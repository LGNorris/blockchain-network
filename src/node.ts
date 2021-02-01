import cors from "cors";
import helmet from "helmet";
import cluster from "cluster";
import bodyParser from "body-parser";
import express from "express";
import limit from "express-rate-limit";
import config from "config";
import rp from "request-promise";
import os from "os"
import { v4 as uuidv4 } from "uuid";

import { masterLog, allLog, log } from "./logger";

//@ts-ignore
import Blockchain from "./lib/blockchain";

const nodeAddress = uuidv4().split("-").join("");

const blockchain = new Blockchain();

export default class Node {
  instance: express.Express;

  constructor(port: number) {
    masterLog.info("Creating node instance");

    const env = config.get("env");
    const corsOrigin = config.get("settings.cors_origin") + "";
    const corsOptions = { origin: corsOrigin };

    masterLog.info("Cors origin: " + corsOptions.origin.blue);
    masterLog.info("Env: " + `${env}`.blue);

    this.instance = express();
    this.instance.use(helmet());
    this.instance.use(cors(corsOptions));
    this.instance.use(bodyParser.json());
    this.instance.use(bodyParser.urlencoded({ extended: false }));
    this.instance.disable("x-powered-by");
    this.instance.use(
      "/api",
      limit({
        windowMs: 15 * 60 * 1000,
        max: 250,
      })
    );

    this.instance.get("/", function (req, res) {
      res.json({
        message: "Blockchain node up and running",
      });
    });

    this.instance.get("/blockchain", function (req, res) {
      res.send({ blockchain });
    });

    this.instance.post("/transaction", function (req, res) {
      const newTransaction = req.body;
      const blockIndex = blockchain.addTransactionToPendingTransactions(
        newTransaction
      );
      res.json({
        note: `Transaction will be added in block ${blockIndex}`,
      });
    });

    this.instance.post("/transaction/broadcast", function (req, res) {
      const newTransaction = blockchain.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
      );
      blockchain.addTransactionToPendingTransactions(newTransaction);

      const requestPromises: any[] = [];

      blockchain.networkNodes.forEach((networkNodeUrl: string) => {
        const requestOptions = {
          uri: networkNodeUrl + "/transaction",
          method: "POST",
          body: newTransaction,
          json: true,
        };
        requestPromises.push(rp(requestOptions));
      });
      Promise.all(requestPromises).then((data) => {
        res.json({
          note: "Transaction created and broadcast successfully.",
        });
      });
    });

    this.instance.get("/mine", function (req, res) {
      const lastBlock = blockchain.getLastBlock();
      const previousBlockHash = lastBlock["hash"];
      const currentBlockData = {
        transactions: blockchain.pendingTransactions,
        index: lastBlock["index"] + 1,
      };
      const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);
      const blockHash = blockchain.hashBlock(
        previousBlockHash,
        currentBlockData,
        nonce
      );

      blockchain.createNewTransaction(12.5, "00REWARDS", nodeAddress);

      const newBlock = blockchain.createNewBlock(
        nonce,
        previousBlockHash,
        blockHash
      );

      const requestPromises: any[] = [];

      blockchain.networkNodes.forEach((networkNodeUrl: string) => {
        const requestOptions = {
          uri: networkNodeUrl + "/receive-new-block",
          method: "POST",
          body: {
            newBlock: newBlock,
          },
          json: true,
        };
        requestPromises.push(rp(requestOptions));
      });

      Promise.all(requestPromises)
        .then((data) => {
          const requestOptions = {
            uri: blockchain.currentNodeUrl + "/transaction/broadcast",
            method: "POST",
            body: {
              amount: 12.5,
              sender: "00",
              recipient: nodeAddress,
            },
            json: true,
          };
          console.log(requestOptions)
          return rp(requestOptions);
        })
        .then((data) => {
          res.json({
            note: "New block mined successfully",
            block: newBlock,
          });
        })
        .catch(error => {
          console.error(error.message)
        }); 
    });

    this.instance.post("/receive-new-block", function (req, res) {
      const newBlock = req.body.newBlock;
      const lastBlock = blockchain.getLastBlock();
      const correctHash = lastBlock.hash === newBlock.previousBlockHash;
      const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

      if (correctHash && correctIndex) {
        blockchain.chain.push(newBlock);
        blockchain.pendingTransactions = [];
        res.json({
          note: "New block received and accepted.",
          newBlock: newBlock,
        });
      } else {
        res.json({
          note: "New block rejected.",
          newBlock: newBlock,
        });
      }
    });

    this.instance.post("/register-and-broadcast-node", function (req, res) {
      const newNodeUrl = req.body.newNodeUrl;
      if (blockchain.networkNodes.indexOf(newNodeUrl) == -1)
        blockchain.networkNodes.push(newNodeUrl);

      const regNodesPromises: any[] = [];

      blockchain.networkNodes.forEach((networkNodeUrl: string) => {
        const requestOptions = {
          uri: networkNodeUrl + "/register-node",
          method: "POST",
          body: {
            newNodeUrl: newNodeUrl,
          },
          json: true,
        };

        regNodesPromises.push(rp(requestOptions));
      });

      Promise.all(regNodesPromises)
        .then((data) => {
          const bulkRegOptions = {
            uri: newNodeUrl + "/register-nodes-bulk",
            method: "POST",
            body: {
              allNetworkNodes: [
                ...blockchain.networkNodes,
                blockchain.currentNodeUrl,
              ],
            },
            json: true,
          };
          return rp(bulkRegOptions);
        })
        .then((data) => {
          res.json({
            note: "New node registered with network successfully",
          });
        });
    });

    this.instance.post("/register-node", function (req, res) {
      const newNodeUrl = req.body.newNodeUrl;
      const nodeNotAlreadyPresent = blockchain.networkNodes.indexOf(newNodeUrl) == -1;
      const notCurrentNode = blockchain.currentNodeUrl !== newNodeUrl;
      if (nodeNotAlreadyPresent && notCurrentNode)
        blockchain.networkNodes.push(newNodeUrl);
      res.json({
        note: "New node registered successfully.",
      });
    });

    this.instance.post("/register-nodes-bulk", function (req, res) {
      const allNetworkNodes = req.body.allNetworkNodes;
      allNetworkNodes.forEach((networkNodeUrl: any) => {
        const nodeNotAlreadyPresent =
          blockchain.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = blockchain.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode)
          blockchain.networkNodes.push(networkNodeUrl);
      });
      res.json({
        note: "Bulk node registration successfull. ",
      });
    });

    this.instance.get("/consensus", function (req, res) {
      const requestPromises: any[] = [];
    
      blockchain.networkNodes.forEach((networkNodeUrl: string) => {
        const requestOptions = {
          uri: networkNodeUrl + "/blockchain",
          method: "GET",
          json: true,
        };
    
        requestPromises.push(rp(requestOptions));
      });
    
      Promise.all(requestPromises).then((blockchains) => {
        const currentChainLength = blockchain.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
        blockchains.forEach((currentBlockchain) => {
          if (currentBlockchain.blockchain.chain.length > maxChainLength) {
            maxChainLength = currentBlockchain.blockchain.chain.length;
            newLongestChain = currentBlockchain.blockchain.chain;
            newPendingTransactions = currentBlockchain.blockchain.pendingTransactions;
          }
        });
    
        if (
          !newLongestChain ||
          (newLongestChain && !blockchain.chainIsValid(newLongestChain))
        ) {
          res.json({
            note: "Current chain has not been replaced.",
            chain: blockchain.chain,
          });
        } else {
          blockchain.chain = newLongestChain;
          blockchain.pendingTransactions = newPendingTransactions;
          res.json({
            note: 'This chain has been replaced.',
            chain: blockchain.chain
          })
        };
      });
    });


    // Endpoints for blockchain explorer
    this.instance.get('/block/:blockHash', function (req, res) {
      const blockHash = req.params.blockHash;
      const correctBlock = blockchain.getBlock(blockHash);
      res.json({
        block: correctBlock
      })
    });

    this.instance.get('/transaction/:transactionId', function (req, res) {
      const transactionId = req.params.transactionId;
      const transactionData = blockchain.getTransaction(transactionId)
      res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
      })
    });

    this.instance.get('/address/:address', function (req, res) {
      const address = req.params.address;
      const addressData = blockchain.getAddressData(address);
      res.json({
        addressData: addressData,
      })
    });
  }


  configure = async (poolSize: number, isTest: boolean) => {
    if (cluster.isMaster) {
      masterLog.info("Configuring master instance");
      if (!isTest)
        for (let index = 0; index < poolSize; index += 1) cluster.fork();
    }
  };

  start = (port: number, name: string) => {
    if (cluster.isMaster)
      log.info(
        `Blockchain node: Listening for activity on http://localhost:${
          port.toString().green
        }`
      );
    else {
      log.info(`Starting worker ${cluster.worker.id}`);
      this.instance.listen(port, () =>
        log.info(`Worker ${cluster.worker.id} UP`.green)
      );
    }
  };
}
