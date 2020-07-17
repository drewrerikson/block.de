const SHA256 = require('crypto-js/sha256');
const colors = require('colors');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor(from, to, amt) {
    this.from = from;
    this.to = to;
    this.amt = amt;
  }

  // Encodes transaction into hash
  calculateHash(){
    return SHA256(this.from + this.to + this.amt).toString();
  }

  // Signs the transaction with keychain @param key
  signTransaction(key){
    if (key.getPublic('hex') !== this.from) {
      throw new Error("[ ER ]".red + " Signature invalid!");
    }

    const txHash = this.calculateHash();
    const sign = key.sign(txHash, 'base64');
    this.signature = sign.toDER('hex');
  }

  // Checks for transaction signature and transaction validity
  isValid() {
    if (this.from === null) return true;
    if (!this.signature || this.signature.length === 0) {
      throw new Error("[ ER ]".red + " Failed to find signature during transaction validation.");
    }
    const publicKey = ec.keyFromPublic(this.from, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // Encodes block info into hash
  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  // Proof-of-work check for a miner at difficulty @param difficulty
  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("[ OK ] ".green + "Block mined: " + this.hash);
  }

  // Performs checks on all transactions in this block
  validateTransactions() {
    for (const tx of this.transactions){
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.reward = 100;
  }

  // Initialize blockchain with null genesis
  createGenesis() {
    return new Block(Date.parse('01/01/2020'), [], '0');
  }

  // Returns latest block
  getLatest() {
    return this.chain[this.chain.length - 1];
  }

  // Allow @param minerAddress to receive class award for mining pending transaction
  minePending(minerAddress) {
    this.pendingTransactions.push(new Transaction(null, minerAddress, this.reward));
    // If this were large scale, miner would only take a chunk of pendingTransactions
    const block = new Block(Date.now(), this.pendingTransactions, this.getLatest().hash);
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.pendingTransactions = [];
  }

  // Perform checks on and push @param transaction to pendingTransactions
  addTransaction(transaction){
    if(!transaction.from || !transaction.to) {
      throw new Error("[ ER ]".red + "Transaction is missing from/to address.");
    }
    if(!transaction.isValid()) {
      throw new Error("[ ER ]".red + "Cannot add invalid transaction to chain")
    }

    this.pendingTransactions.push(transaction);
  }

  // Return balance of address @param address
  getBalanceForAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from == address) {
          balance -= tx.amt;
        }
        if (tx.to == address) {
          balance += tx.amt;
        }
      }
    }
    return balance;
  }

  // Ensure that no one has tampered with the chain.
  validate() {
    const realGenesis = JSON.stringify(this.createGenesis());
    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (!current.validateTransactions()) {
        return false;
      }

      if (current.hash !== current.calculateHash()) {
        return false;
      }

      if (current.previousHash !== previous.hash) {
        return false;
      }
    }

    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;
