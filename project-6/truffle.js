const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKeys = [
  "0x9137dc4de37d28802ff9e5ee3fe982f1ca2e5faa52f54a00a6023f546b23e779",
  "0x18911376efeff48444d1323178bc9f5319686b754845e53eb1b777e08949ee9b",
  "0xf948c5bb8b54d25b2060b5b19967f50f07dc388d6a5dada56e5904561e19f08b",
  "0xfad19151620a352ab90e5f9c9f4282e89e1fe32e070f2c618e7bc9f6d0d236fb",
  "0x19d1242b0a3f09e1787d7868a4ec7613ac4e85746e95e447797ce36962c7f68b",
  "0x3bb675f8c07099816e23a3e283090cfb0f793ab625b73ca51a2d027a3c1f2d0e"
];

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          privateKeys,
          providerOrUrl: `https://ropsten.infura.io/v3/c131ca0c8b164926ae51dcb0f3fce74e`,
          numberOfAddresses: 6,
        }),
      network_id: 4, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  }
};