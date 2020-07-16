const SHA256 = require('crypto-js/sha256');
const colors = require('colors');

class Transaction {
  constructor(from, to, amt) {
    this.from = from;
    this.to = to;
    this.amt = amt;
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

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("[ OK ] ".green + "Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
    this.difficulty = 4; // 5 is good
    this.pendingTransactions = [];
    this.reward = 100;
  }

  createGenesis() {
    return new Block(Date.parse('01/01/2020'), [], '0');
  }

  getLatest() {
    return this.chain[this.chain.length - 1];
  }

  minePending(minerAddress) {
    // add reward to block
    this.pendingTransactions.push(new Transaction(null, minerAddress, this.reward));
    // TODO if pending too big, pick which transactions the miner can handle
    const block = new Block(Date.now(), this.pendingTransactions, this.getLatest().hash);
    block.mineBlock(this.difficulty);

    console.log("[INFO] ".cyan + "BY MINER: " + minerAddress + "\n");
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

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

  validate() {
    const realGenesis = JSON.stringify(this.createGenesis());
    if (realGenesis !== JSON.stringify(this.chain[0])) {
      return false;
    }
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
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
