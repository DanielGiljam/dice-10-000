import {DieFace} from "./DieFace";

export const generateOutcome = (numberOfDice: number): DieFace[] =>
    Array.from(Array(numberOfDice), () => Math.round(Math.random() * 5) + 1);
