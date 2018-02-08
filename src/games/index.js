import BinaryPve from './BinaryPve';
import OfflinePvp from './OfflinePvp';
import SelfServicePvp from './SelfServicePvp'

BinaryPve.modeName = 'Binary Search - PvE';
OfflinePvp.modeName = 'Offline - PvP';
SelfServicePvp.modeName = 'Self Service - PvP';

const games = [
  BinaryPve,
  OfflinePvp,
  SelfServicePvp
];

games.default = BinaryPve;

export default games;
