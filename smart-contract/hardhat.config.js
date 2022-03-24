require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.2',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/uoQ-NwnxE6je2Tdb5rxYkFSf708xv3Gk',
      accounts: [
        'de73d0e9a83d7d4601c238d87f815e1218756ff5a11ccd55375c8b4be6f63fe9',
      ],
    },
  },
};
