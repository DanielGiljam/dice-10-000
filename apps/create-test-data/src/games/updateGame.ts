import { SupabaseClient } from '@supabase/supabase-js';
import { isNullish } from '../utils';
import { Game } from './Game';

export const updateGame = async (
  supabase: SupabaseClient,
  game: Game,
  update: Partial<Game>
): Promise<Game> => {
  console.log('updating game', game.id, update);
  const result = await supabase
    .from<Game>('games')
    .update({ id: game.id, ...update });
  if (!isNullish(result.error)) {
    console.error('error when updating game', game.id, update);
    throw result.error;
  }
  console.log('updated game', result.data);
  return result.data[0];
};
