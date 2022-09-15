import { SupabaseClient } from '@supabase/supabase-js';
import { Player } from '../../../players';
import { PlayerPoints } from '../../playerPoints';
import { Game } from '../../Game';
import { Round } from '../Round';
import { createTurn } from './createTurn';
import { playRoll, Roll } from './rolls';
import { Turn } from './Turn';
import { updateTurn } from './updateTurn';

export interface TurnWithEverything {
  turn: Turn;
  rolls: Roll[];
}

export const playTurn = async (
  supabase: SupabaseClient,
  game: Game,
  round: Round,
  player: Player,
  playerPoints: PlayerPoints
): Promise<TurnWithEverything> => {
  console.log(
    `playing ${player.name}'s turn in round ${round.index + 1} in game ${
      game.name
    }`
  );
  const turn = await createTurn(supabase, game, round, player);
  let numberOfDice = 6;
  let accumulatedPoints = 0;
  let nullOutcome = false;
  const rolls: Roll[] = [];
  while (!nullOutcome) {
    const roll = await playRoll(
      supabase,
      game,
      round,
      turn,
      player,
      rolls.length,
      numberOfDice
    );
    rolls.push(roll);
    if (roll.locked_dice.length > 0) {
      numberOfDice -= roll.locked_dice.reduce(
        (aggregate, current) => aggregate + current.dieFaces.length,
        0
      );
      if (numberOfDice === 0) {
        numberOfDice = 6;
      }
      accumulatedPoints += roll.locked_dice.reduce(
        (aggregate, current) => aggregate + current.points,
        0
      );
    } else {
      nullOutcome = true;
    }
  }
  if (nullOutcome) {
    accumulatedPoints = 0;
  }
  playerPoints[player.id] += accumulatedPoints;
  const update = { ended_at: new Date() };
  const updatedTurn = await updateTurn(supabase, turn, update);
  console.log(
    `finished ${player.name}'s turn in round ${round.index + 1} in game ${
      game.name
    }`
  );
  return { turn: updatedTurn, rolls };
};
