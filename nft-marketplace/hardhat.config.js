require("@nomiclabs/hardhat-waffle");
const { solidity } = require("ethereum-waffle");
const fs = require("fs");

const privateKey = fs.readFileSync("./secret").toString.trim();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mainnet: {
      url:"rps url",
      accounts: [privateKey],
    },

  },
  solidity: "0.8.20",
};