import { DiceSubset } from './DiceSubset';
import { DieFace } from './DieFace';

export interface Roll {
  id: string;
  created_at: Date;
  index: number;
  player: string;
  turn: string;
  round: string;
  game: string;
  ended_at: Date | undefined;
  outcome: DieFace[];
  locked_dice: DiceSubset[];
}
