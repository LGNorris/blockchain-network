function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
}

/**
 * Creates new block and adds to blockchain
 * @param {number} nonce - number which represents a proof of work using a p.o.w method
 * @param {string} previousBlockHash - unique hash of previous block on blockchain
 * @param {string} hash - unique hash of this block
 */

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock)
  return newBlock;
}

/**
 * Return last block on blockchain
 * @returns {object} - returns last block object on block chain
 */

Blockchain.prototype.getLastBlock = function ()  {
  return this.chain[this.chain.length - 1]
}

/**
 * Create new transaction prior to next block creation
 * @param {number} amount - value of amount sent in transaction
 * @param {string} sender - address of person who is initiating transaction and sending the above amount
 * @param {string} recipient  - address of person who is receiving the transaction
 */

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient
  }
  this.pendingTransactions.push(newTransaction)
  return this.getLastBlock()['index'] + 1
}

module.exports = Blockchain;