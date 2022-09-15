export const makeDecisionAboutYielding = (
  currentPoints: number,
  numberOfDice: number,
  accumulatedPoints: number,
  numberOfRolls: number
): boolean => {
  if (currentPoints === 0) {
    if (accumulatedPoints >= 1000) {
      return true;
    } else {
      return false;
    }
  } else {
    const randomNumber = Math.random();
    return (
      Math.round(
        randomNumber -
          (((randomNumber * (numberOfDice - 3)) / 6) * numberOfRolls) / 10
      ) === 1
    );
  }
};
