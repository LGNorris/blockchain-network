function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
}

Blockchain.prototype.createNewBlock = (nonce, previousBlockHash, hash) => {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.newTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };
  
  this.newTransactions = [];
  this.chain.push(newBlock)

  return newBlock;
}

module.exports = Blockchain;