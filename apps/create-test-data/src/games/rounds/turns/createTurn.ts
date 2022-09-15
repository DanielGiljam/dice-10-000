import { SupabaseClient } from '@supabase/supabase-js';
import { isNullish } from '../../../utils';
import { Player } from '../../../players';
import { Game } from '../../Game';
import { Round } from '../Round';
import { Turn } from './Turn';

export const createTurn = async (
  supabase: SupabaseClient,
  game: Game,
  round: Round,
  player: Player
): Promise<Turn> => {
  const draft = { game: game.id, round: round.id, player: player.id };
  console.log('inserting into turns', draft);
  const result = await supabase.from<Turn>('turns').insert(draft);
  if (!isNullish(result.error)) {
    console.error('error when inserting into turns', draft);
    throw result.error;
  }
  console.log('inserted into turns', result.data);
  return result.data[0];
};
