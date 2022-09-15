import { SupabaseClient } from '@supabase/supabase-js';
import { isNullish } from '../../utils';
import { Round } from './Round';

export const updateRound = async (
  supabase: SupabaseClient,
  round: Round,
  update: Partial<Round>
): Promise<Round> => {
  console.log('updating round', round.id, update);
  const result = await supabase
    .from<Round>('rounds')
    .update({ id: round.id, ...update });
  if (!isNullish(result.error)) {
    console.error('error when updating round', round.id, update);
    throw result.error;
  }
  console.log('updated round', result.data);
  return result.data[0];
};
