const readline = require('readline');
const { Blockchain, Transaction } = require('./blockchain');
const colors = require('colors');

let currency = new Blockchain();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

currency.createTransaction(new Transaction('carter', 'drew', 100));
currency.createTransaction(new Transaction('drew', 'carter', 50));

console.log("[ OK ] ".green + "Carter and Drew transact. Jackson starts mining:");
currency.minePending('jackson');

console.log("[ OK ] ".green + "Jackson's balance is: " + currency.getBalanceForAddress('jackson'));
console.log("[ OK ] ".green + "Nathan's balance is: " + currency.getBalanceForAddress('nathan'));
console.log("[ OK ] ".green + "Drew's balance is: " + currency.getBalanceForAddress('drew'));
console.log("[ OK ] ".green + "Carter's balance is: " + currency.getBalanceForAddress('carter') + "\n");

currency.createTransaction(new Transaction('carter', 'drew', 50));
currency.createTransaction(new Transaction('drew', 'carter', 100));

console.log("[ OK ] ".green + "Carter and Drew transact. Nathan starts mining:");
currency.minePending('nathan');

console.log("[ OK ] ".green + "Jackson's balance is: " + currency.getBalanceForAddress('jackson'));
console.log("[ OK ] ".green + "Nathan's balance is: " + currency.getBalanceForAddress('nathan'));
console.log("[ OK ] ".green + "Drew's balance is: " + currency.getBalanceForAddress('drew'));
console.log("[ OK ] ".green + "Carter's balance is: " + currency.getBalanceForAddress('carter') + "\n");

console.log("[ OK ] ".green + "Is the blockchain valid? " + currency.validate());
console.log("[ OK ] ".yellow + "Tampering...")

currency.chain[1].transactions[0].amt = 900;
currency.chain[1].hash = currency.chain[1].calculateHash();

console.log("[ OK ] ".green + "Is the blockchain valid? " + colors.red(currency.validate()) + "\n");

rl.question('Enter ' + 'y'.cyan.underline + ' for ledger summary or any other character to quit: ', (answer) => {
  if (answer === "y") {
    console.log("\n #################### SUMMARY OF LEDGER ###################".grey)
    console.log(JSON.stringify(currency.chain, null, 2));
  }
  rl.close();
});
