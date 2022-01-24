const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKeys = [
  "0df1836d9719cba3368f8e877ff4392e77f4df1611fbe2975624e0712c0bd180",
  "1c4e2bd0121c6916d63b183431c7c54577331351dd75cc95676ed05259ca7e7b",
  "2d240032f54579b50adcbd06087118111dbf2e9a07445398103999fbceb76a69",
  "25b9c99cee2d14b26019390770362bed93aa920718980a34f8728891e348fba3",
  "a17bcf48d412d64e43aa702e83def32014d4e4bb7d4a3f3f55d80e5771c64809",
  "9959f455ce96ab79d09643caa926718f82e48ca38d30849f53cc3dd6f5b2a159"
];

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
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