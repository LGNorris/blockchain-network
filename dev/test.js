const Blockchain = require("./blockchain");
const bitcoin = new Blockchain();

const b1c = {
  chain: [
    {
      index: 1,
      timestamp: 1611415001342,
      transactions: [],
      nonce: 100,
      hash: "0GENESIS",
      previousBlockHash: "0GENESIS",
    },
    {
      index: 2,
      timestamp: 1611415175901,
      transactions: [],
      nonce: 36656,
      hash: "0000f490d94e287728d96ccbda78975c26636f6cdf698dc4f089554d02c3a1f2",
      previousBlockHash: "0GENESIS",
    },
    {
      index: 3,
      timestamp: 1611415233155,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41169785d0e746febe7080a37a9b876a",
          transactionId: "bf36dfcf391a40778ebd7f9ce3cfcb4f",
        },
        {
          amount: 4500,
          sender: "XXX3432FSD",
          recipient: "SDF6346SDF333",
          transactionId: "354e967680a24ded834e460738b6b8b7",
        },
        {
          amount: 333,
          sender: "XXX3432FSD",
          recipient: "SDF6346SDF333",
          transactionId: "81194332d3594c3f9413e2dc88290782",
        },
        {
          amount: 10000,
          sender: "XXX3432FSD",
          recipient: "SDF6346SDF333",
          transactionId: "0c4f879f90154ab8bfeec42797f309b2",
        },
      ],
      nonce: 1380,
      hash: "00000e21dcd8e8ed3a1d68afde79837027f01fbd1d130d6998b6c2da197e63d6",
      previousBlockHash:
        "0000f490d94e287728d96ccbda78975c26636f6cdf698dc4f089554d02c3a1f2",
    },
    {
      index: 4,
      timestamp: 1611415278435,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41169785d0e746febe7080a37a9b876a",
          transactionId: "d67a930d59ac444fbf6cfc06d86a3659",
        },
        {
          amount: 50000,
          sender: "XXX3432FSD",
          recipient: "SDF6346SDF333",
          transactionId: "5e53ebaf0f684b4682ebd5eb052bd6b2",
        },
        {
          amount: 100000,
          sender: "XXX3432FSD",
          recipient: "SDF6346SDF333",
          transactionId: "4f41aa5b2cc34b02b82819a066dfb6d2",
        },
      ],
      nonce: 94590,
      hash: "000049ba6c8226c8dd0ecbccae1c3095ec960dfd0118a33b3d690e5cf376786d",
      previousBlockHash:
        "00000e21dcd8e8ed3a1d68afde79837027f01fbd1d130d6998b6c2da197e63d6",
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: "00",
      recipient: "41169785d0e746febe7080a37a9b876a",
      transactionId: "538ff6f9aa6c48489daae8f366a209dc",
    },
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log('VALID: ', bitcoin.chainIsValid(b1c.chain))