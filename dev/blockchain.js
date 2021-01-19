const SHA256 = require('sha256')
const currentNodeUrl = process.argv[3]


function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
  this.createNewBlock(100, '0GENESIS', '0GENESIS');
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

/**
 * Creates hash string from a block from the blockchain
 * @param {string} previousBlockHash - hash of previously block
 * @param {Array} currentBlockData - current block data
 * @param {number} nonce - nonce - number which represents a proof of work using a p.o.w method
 * @returns {string} - returns hash string
 */
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = SHA256(dataAsString);
  return hash
}

/**
 * Proof of work method repeatedly hashs block until it finds correct hash
 * then returns nonce value with attributed to correct hash
 * @param {string} previousBlockHash - hash of previous block
 * @param {array} currentBlockData - current block data
 */
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  while(hash.substring(0,4) != '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    console.log(hash)
  }
  return nonce;
}

module.exports = Blockchain;