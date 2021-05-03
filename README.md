![Logo for github repo](/public/logo.png "Blockchain network demonstrator")

# Blockchain network demonstrator

This is a blockchain network implemented in Javascript with the idea behind this projects being to explore and demonstrate the concepts behind basic decentralised blockchains using Javascript. This code allows you to deploy an instance of a blockchain with the following features:

- 'Proof Of Work' and hashing algorithms to secure the network and also the data within the blockchain
- Methods to create/send and store transactions in blocks
- Methods to mine/create new blocks that contain transaction data
- Consenus algorithm to allow nodes to coordinate and agree on a single source of truth (blockchain data)
- Simple broadcasting function to keep blockchain nodes synchronised
- A REST API which allows blockchain interaction through various endpoints

# Usage

This software requires an .env file at root to run successfully. This `env` file should contain the following environment variables:

```
PORT=YOUR_PORT
IP=YOUR_IP
CORS_ORIGIN=YOUR_CORS_ORIGIN
```

#### `PORT`

- The preferred port to expose your network on

#### `IP`

- The IP of current host of which the application is running on. This is exposed once instance of blockchain is deployed and running. Required for communication between network nodes.

#### `CORS_ORIGIN`

- The allowed origins of requests. In most instances, a mirror of IP or domain name.
  <br>

## Start

```
git clone https://github.com/LGNorris/blockchain-network.git
cd blockchain-network
npm install
npm run build
npm start
```

Docker instructions to be added soon.

#### `npm install`

- installs project dependencies (in package.json)

#### `npm run build`

- build and compiles TS to JS using TS config (in tsconfig.json)

#### `npm start`

- starts software

<br>

# REST API endpoints

Open endpoints require no Authentication.

- Show full blockchain info : `GET /blockchain`
- Show total transactions and total amount across blockchain: `GET /blockchain/stats`
- Send and broadcast transaction: `POST /transaction/broadcast`
- Add transaction to pending transactions: `POST /transaction` - internally used by `POST /transaction/broadcast`
- Mine latest block: `GET /mine`
- Receive new block if new: `POST /receive-new-block` - used internally by `GET /mine`
- Register and broadcast new node across network nodes: `POST /register-and-broadcast-node`
- Get blockchain consensus from network node: `GET /consensus`
- Get block by block hash:`GET /block/:blockhash`
- Get transaction by transaction: id `GET /transaction/:transactionId`
- Get address data by address: `GET /address/:addressId`
- Get get all transactions: `GET /transactions`
  <br>

# Add node to blockchain network

To do
