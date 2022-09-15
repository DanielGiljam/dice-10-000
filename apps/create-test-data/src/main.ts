import { createClient } from '@supabase/supabase-js';
import { createUsers } from './createUsers';
import { createGames, playGames } from './games';
import { getPlayers } from './players';

(async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  const users = await createUsers(supabase);
  const players = await getPlayers(supabase, users);
  const gamesWithPlayers = await createGames(supabase, players);
  await playGames(supabase, gamesWithPlayers);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
