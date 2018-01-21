const gameModes = [
  'Binary Search - PvE',
  'Binary Search - PvP',
  '1A2B - PvE',
  '1A2B - PvP',
];

gameModes.default = gameModes[0];

const networks = {
  1: 'Ethereum Mainnet',
  42: 'Ethereum Kovan testnet',
};

networks.default = networks[1];

export {
  gameModes,
  networks,
}
