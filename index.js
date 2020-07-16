const readline = require('readline');
const { Blockchain, Transaction } = require('./blockchain');

let currency = new Blockchain();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

currency.createTransaction(new Transaction('carter', 'drew', 100));
currency.createTransaction(new Transaction('drew', 'carter', 50));

console.log("Jackson starts mining:");
currency.minePending('jackson');

console.log("Jackson's balance is: " + currency.getBalanceForAddress('jackson') + "\n");

currency.createTransaction(new Transaction('carter', 'drew', 50));
currency.createTransaction(new Transaction('drew', 'carter', 100));

console.log("Nathan starts mining:");
currency.minePending('nathan');

console.log("Jackson's balance is: " + currency.getBalanceForAddress('jackson') + "\n");
console.log("Nathan's balance is: " + currency.getBalanceForAddress('nathan') + "\n");

console.log("Is the blockchain valid? " + currency.validate());
console.log("Tampering...\n")

currency.chain[1].transactions[0].amt = 900;
currency.chain[1].hash = currency.chain[1].calculateHash();

console.log("Is the blockchain valid? " + currency.validate() + "\n");

rl.question('Enter \'y\' for ledger summary or any other character to quit: ', (answer) => {
  if (answer === "y") {
    console.log("\n #################### SUMMARY OF LEDGER ###################")
    console.log(JSON.stringify(currency.chain, null, 2));
  }
  rl.close();
});
