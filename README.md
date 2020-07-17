# Block.de - a simple blockchain demo

Purely for educational purposes. Implements the basic functionality of a blockchain (hashing, validation, transaction signing, proof-of-work) in a simple node.js CLI. All blockchain functionality included in ```blockchain.js```.

### Demo

I've included a simple CLI demo of the implementation which features my roommates and I trading a made-up currency! 

```bash
  $ cd block.de
  $ npm install
  $ node src/demo
```

If (for some reason) you'd like to join in on this extremely insecure currency trading, you can edit the code and include your own key/address by running ```keygen.js```.

### Ledger

At the conclusion of the interactive demo, there is an option to view the ledger as stored in memory. As this is a simple demo, P2P/decentralization is not implemented.
