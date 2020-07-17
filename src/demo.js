const readline = require('readline');
const { Blockchain, Transaction } = require('./blockchain');
const colors = require('colors');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Generate keys/addresses for demo
const myKey = ec.keyFromPrivate('639d0e33a823076b466d28a25e14c0da58dabd0404d3bf3d35f1d4044892ca40');
const myAddress = myKey.getPublic('hex');
const carterKey = ec.keyFromPrivate('2327aba090dfe5529011482642f9930608345e5ad858789d699d22708220d0d9');
const carterAddress = carterKey.getPublic('hex');
const jacksonKey = ec.keyFromPrivate('3e0809fb8e9087bed980f2161bfa892d622e7c10b1a8976a200140050d0b6dc4');
const jacksonAddress = jacksonKey.getPublic('hex');
const addressLookup = {myAddress : "Drew", carterAddress: "Carter", jacksonAddress: "Jackson"}

function transact(from, to, key, amt) {
  const tx1 = new Transaction(from, to, amt);
  tx1.signTransaction(key);
  currency.addTransaction(tx1);
}

// Create 'currency' and begin demo
let currency = new Blockchain();

transact(carterAddress, myAddress, carterKey, 100);
transact(myAddress, carterAddress, myKey, 50);

console.log("[ OK ] ".green + "Carter and Drew transact. Jackson starts mining:");
currency.minePending(jacksonAddress);
console.log("[INFO] ".cyan + "BY MINER: " + addressLookup.jacksonAddress + "\n");

console.log("[ OK ] ".green + "Jackson's balance is: " + currency.getBalanceForAddress(jacksonAddress));
console.log("[ OK ] ".green + "Drew's balance is: " + currency.getBalanceForAddress(myAddress));
console.log("[ OK ] ".green + "Carter's balance is: " + currency.getBalanceForAddress(carterAddress) + "\n");

transact(jacksonAddress, myAddress, jacksonKey, 15);
transact(jacksonAddress, carterAddress, jacksonKey, 15);

console.log("[ OK ] ".green + "Jackson donates to Drew and Carter. Carter mines:");
currency.minePending(carterAddress);
console.log("[INFO] ".cyan + "BY MINER: " + addressLookup.carterAddress + "\n");

console.log("[ OK ] ".green + "Jackson's balance is: " + currency.getBalanceForAddress(jacksonAddress));
console.log("[ OK ] ".green + "Drew's balance is: " + currency.getBalanceForAddress(myAddress));
console.log("[ OK ] ".green + "Carter's balance is: " + currency.getBalanceForAddress(carterAddress) + "\n");

console.log("[ OK ] ".green + "Is the blockchain valid? " + currency.validate());
console.log("[ OK ] ".yellow + "Tampering...")

currency.chain[1].transactions[0].amt = 900;
currency.chain[1].hash = currency.chain[1].calculateHash();

console.log("[ OK ] ".green + "Is the blockchain valid? " + colors.red(currency.validate()) + "\n");

// Prompt user as to whether or not they want to see JSON summary of ledger
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter ' + 'y'.cyan.underline + ' for ledger summary or any other character to quit: ', (answer) => {
  if (answer === "y") {
    console.log("\n #################### SUMMARY OF LEDGER ###################".grey)
    console.log(JSON.stringify(currency.chain, null, 2));
  }
  rl.close();
});
