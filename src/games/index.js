import BinaryPve from './BinaryPve';
import OfflinePvp from './OfflinePvp';

BinaryPve.modeName = 'Binary Search - PvE';
OfflinePvp.modeName = 'Offline - PvP';

const games = [
  BinaryPve,
  OfflinePvp,
];

games.default = BinaryPve;

export default games;
