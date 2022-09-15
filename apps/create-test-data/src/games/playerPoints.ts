import { Player } from '../players';

export type PlayerPoints = Record<string, number>;

export const initPlayerPoints = (players: Player[]): PlayerPoints =>
  Object.fromEntries(players.map((player) => [player.id, 0]));

export const noOneHasWon = (playerPoints: Record<string, number>): boolean =>
  Object.values(playerPoints).every((points) => points < 10000);
