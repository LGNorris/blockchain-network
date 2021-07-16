const SHA256 = require("sha256");
const currentNodeUrl = process.argv[2];
const { v4: uuidv4 } = require("uuid");

const nodeName = 'http://' + process.env.IP + ':' + process.env.NODE_PORT

function Blockchain(this: any) {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = nodeName || currentNodeUrl
  this.networkNodes = [];
  this.id = 'GENESIS'
  this.createNewBlock(100, "0GENESIS", "0GENESIS");
}

/**
 * Creates new block and adds to blockchain
 * @param {number} nonce - number which represents a proof of work using a p.o.w method
 * @param {string} previousBlockHash - unique hash of previous block on blockchain
 * @param {string} hash - unique hash of this block
 */

Blockchain.prototype.createNewBlock = function (
  nonce: any,
  previousBlockHash: any,
  hash: any
) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    id: hash,
    previousBlockHash: previousBlockHash,
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};

/**
 * Return last block on blockchain
 * @returns {object} - returns last block object on block chain
 */

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

/**
 * Create new transaction prior to next block creation
 * @param {number} amount - value of amount sent in transaction
 * @param {string} sender - address of person who is initiating transaction and sending the above amount
 * @param {string} recipient  - address of person who is receiving the transaction
 */

Blockchain.prototype.createNewTransaction = function (
  amount: any,
  sender: any,
  recipient: any
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
    transactionId: uuidv4().split("-").join(""), 
    receivedTime: Date.now(),
  };

  return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (
  transactionObj: any
) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock()["index"] + 1;
};

/**
 * Creates hash string from a block from the blockchain
 * @param {string} previousBlockHash - hash of previously block
 * @param {Array} currentBlockData - current block data
 * @param {number} nonce - nonce - number which represents a proof of work using a p.o.w method
 * @returns {string} - returns hash string
 */

Blockchain.prototype.hashBlock = function (
  previousBlockHash: any,
  currentBlockData: any,
  nonce: { toString: () => any; }
) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = SHA256(dataAsString);

  return hash;
};

/**
 * Proof of work method repeatedly hashs block until it finds correct hash
 * then returns nonce value which attributed to correct hash
 * @param {string} previousBlockHash - hash of previous block
 * @param {array} currentBlockData - current block data
 */

Blockchain.prototype.proofOfWork = function (
  previousBlockHash: any,
  currentBlockData: any
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) != "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }
  return nonce;
};

/**
 * @param {object} - blockchain object
 * @return {boolean} - returns boolean representing whether blockchain is valid
 */

Blockchain.prototype.chainIsValid = function (blockchain: string | any[]) {
  let validChain = true;

  for (var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    const blockHash = this.hashBlock(
      previousBlock["hash"],
      {
        transactions: currentBlock["transactions"],
        index: currentBlock["index"],
      },
      currentBlock["nonce"]
    );
    if (blockHash.substring(0, 4) !== "0000") validChain = false;
    if (currentBlock["previousBlockHash"] !== previousBlock["hash"])
      validChain = false;
    console.log("previousBlockHash => ", previousBlock["hash"]);
    console.log("currentBlockHash =>", currentBlock["hash"]);
  }

  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock["nonce"] === 100;
  const correctPrevBlockHash = genesisBlock["previousBlockHash"] === "0GENESIS";
  const correctHash = genesisBlock["hash"] === "0GENESIS";
  const correctTransactions = genesisBlock["transactions"].length === 0;

  if (
    !correctNonce ||
    !correctPrevBlockHash ||
    !correctHash ||
    !correctTransactions
  )
    validChain = false;

  return validChain;
};

Blockchain.prototype.getBlock = function (blockHash: any) {
  let correctBlock = null;
  this.chain.forEach((block: { hash: any; }) => {
    if (block.hash === blockHash) correctBlock = block;
  });
  
  return correctBlock;
};

Blockchain.prototype.getTransaction = function (transactionId: any) {
  let correctTransaction = null;
  let correctBlock = null;
  this.chain.forEach((block: { transactions: any[]; }) => {
    block.transactions.forEach((transaction: { transactionId: any; }) => {
      if (transaction.transactionId === transactionId) {
        correctTransaction = transaction;
        correctBlock = block;
      }
    });
  });

  return {
    transaction: correctTransaction,
    block: correctBlock,
  };
};

Blockchain.prototype.getAddressData = function (address: any) {
  const addressTransactions: any[] = [];
  this.chain.forEach((block: { transactions: any[]; }) => {
    block.transactions.forEach((transaction: { sender: any; recipient: any; }) => {
      if(transaction.sender === address || transaction.recipient === address) {
        addressTransactions.push(transaction)
      }
    })
  })

  let balance = 0;
  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) balance += transaction.amount;
    else if(transaction.sender === address) balance -= transaction.amount;
  })

  return {
    addressTransactions: addressTransactions,
    addressBalance: balance
  }
}

module.exports = Blockchain;