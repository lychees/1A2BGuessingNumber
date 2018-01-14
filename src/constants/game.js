const gameModes = [
  'Binary Search - PvE',
  'Binary Search - PvP',
  '1A2B - PvE',
  '1A2B - PvP',
];

gameModes.default = gameModes[0];

const networks = [
  'Ethereum Mainnet',
  'Ethereum Kovan testnet',
  'Qtum Testnet',
];

networks.default = networks[1];

export {
  gameModes,
  networks,
}
