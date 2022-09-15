import { DiceSubset } from './DiceSubset';
import { DieFace } from './DieFace';

const dieFaceCountsToPoints = {
  [DieFace.One]: (count) => {
    if (count < 3) {
      return 100 * count;
    } else {
      return 1000 * (count - 2);
    }
  },
  [DieFace.Two]: (count) => {
    if (count >= 3) {
      return 200 * (count - 2);
    } else {
      return 0;
    }
  },
  [DieFace.Three]: (count) => {
    if (count >= 3) {
      return 300 * (count - 2);
    } else {
      return 0;
    }
  },
  [DieFace.Four]: (count) => {
    if (count >= 3) {
      return 400 * (count - 2);
    } else {
      return 0;
    }
  },
  [DieFace.Five]: (count) => {
    if (count < 3) {
      return 50 * count;
    } else {
      return 500 * (count - 2);
    }
  },
  [DieFace.Six]: (count) => {
    if (count >= 3) {
      return 400 * (count - 2);
    } else {
      return 0;
    }
  },
};

const createDiceSubset = (dieFace: DieFace, count: number): DiceSubset => ({
  dieFaces: Array(count).fill(dieFace),
  points: dieFaceCountsToPoints[dieFace](count),
});

export const optimallyLockDice = (outcome: DieFace[]): DiceSubset[] => {
  const dieFaceCounts = Array(6).fill(0);
  for (const dieFace of outcome) {
    dieFaceCounts[dieFace - 1]++;
  }
  return dieFaceCounts
    .map((count, index) => createDiceSubset(index + 1, count))
    .filter((diceSubset) => diceSubset.points > 0);
};
