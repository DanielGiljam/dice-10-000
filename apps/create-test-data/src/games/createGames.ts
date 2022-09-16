import { SupabaseClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import { Player } from '../players';
import { capitalize, isNullish, randomSubset } from '../utils';
import { Game } from './Game';
import { PlayerGame } from './PlayerGame';

export interface CreateGamesOptions {
  count?: number;
}

export interface GameWithPlayers {
  game: Game;
  players: Player[];
}

export const createGames = async (
  supabase: SupabaseClient,
  players: Player[],
  { count = 16 }: CreateGamesOptions = {}
): Promise<GameWithPlayers[]> => {
  const getName = () =>
    `${capitalize(faker.word.adjective())} ${capitalize(faker.word.noun())}`;
  const gameDrafts = Array.from(Array(count), () => ({
    name: getName(),
  }));
  console.log('inserting into games', gameDrafts);
  const gamesResult = await supabase.from<Game>('games').insert(gameDrafts);
  if (!isNullish(gamesResult.error)) {
    console.error('error when inserting into games', gameDrafts);
    throw gamesResult.error;
  }
  console.log('inserted into games', gamesResult.data);
  const playersGamesDrafts = gamesResult.data.flatMap((game) =>
    (count === 1
      ? players
      : randomSubset(
          players,
          Math.max(Math.round(Math.random() * players.length), 2)
        )
    ).map((player) => ({
      player: player.id,
      game: game.id,
    }))
  );
  console.log('inserting into players_games', playersGamesDrafts);
  const playersGamesResult = await supabase
    .from<PlayerGame>('players_games')
    .insert(playersGamesDrafts);
  if (!isNullish(playersGamesResult.error)) {
    console.error(
      'error when inserting into players_games',
      playersGamesDrafts
    );
    throw playersGamesResult.error;
  }
  console.log('inserted into players_games', playersGamesResult.data);
  const playersMap = Object.fromEntries(
    players.map((player) => [player.id, player])
  );
  return gamesResult.data.map((game) => ({
    game,
    players: playersGamesResult.data
      .filter((playerGame) => playerGame.game === game.id)
      .map((playerGame) => playersMap[playerGame.player]),
  }));
};
