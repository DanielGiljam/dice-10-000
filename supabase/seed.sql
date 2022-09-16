-- PLAYERS
create table public.players (
  id uuid not null primary key, -- UUID from auth.users
  "name" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
comment on table public.players is 'Player profile for each user.';
comment on column public.players.id is 'References the internal Supabase Auth user.';

-- GAMES
create table public.games (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  "name" text not null,
  ended_at timestamp with time zone
);
comment on table public.games is 'Games.';

-- PLAYERS <--> GAMES
create table public.players_games (
  id bigint generated by default as identity primary key,
  player uuid references public.players not null,
  game bigint references public.games not null,
  unique (player, game)
);
comment on table public.players_games is 'Players in games.';

-- ROUND
create table public.rounds (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  "index" int not null,
  game bigint references public.games not null,
  ended_at timestamp with time zone,
  unique (game, "index")
);
comment on table public.rounds is 'Rounds in games.';

-- TURN
create table public.turns (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  player uuid references public.players not null,
  "round" bigint references public.rounds not null,
  game bigint references public.games not null,
  ended_at timestamp with time zone,
  unique ("round", player)
);
comment on table public.turns is 'Turns in rounds.';

-- ROLL
create table public.rolls (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  "index" int not null,
  player uuid references public.players not null,
  turn bigint references public.turns not null,
  "round" bigint references public.rounds not null,
  game bigint references public.games not null,
  ended_at timestamp with time zone,
  outcome json,
  locked_dice json,
  unique (turn, "index")
);
comment on table public.rolls is 'Rolls in turns.';

-- check if player A is in any games with player B
create function public.p1_is_in_game_with_p2(
  p1 uuid,
  p2 uuid
)
returns boolean as
$$
  begin
    return exists(
      select
        1
      from public.players_games pg1
      join public.players_games pg2
      on
        pg1.player = p1 and
        pg1.game = pg2.game and
        pg2.player = p2
    );
  end;
$$
language plpgsql security definer;

-- check if player is in game
create function public.player_is_in_game(
  player uuid,
  game bigint
)
returns boolean as
$$
  begin
    return exists(
      select
        1
      from public.players_games pg
      where
        pg.player = player_is_in_game.player and
        pg.game = player_is_in_game.game
    );
  end;
$$
language plpgsql security definer;

-- Secure the tables
alter table public.players
  enable row level security;
alter table public.games
  enable row level security;
alter table public.players_games
  enable row level security;
alter table public.rounds
  enable row level security;
alter table public.turns
  enable row level security;
alter table public.rolls
  enable row level security;

create policy "Allow read access if player is in any games with other player" on public.players
  for select using (p1_is_in_game_with_p2(auth.uid(), id));
create policy "Allow individual update access" on public.players
  for update using (auth.uid() = id);
create policy "Allow read access if player is in the game" on public.games
  for select using (player_is_in_game(auth.uid(), id));
create policy "Allow read access if player is in the game" on public.rounds
  for select using (player_is_in_game(auth.uid(), game));
create policy "Allow read access if player is in the game" on public.turns
  for select using (player_is_in_game(auth.uid(), game));
create policy "Allow read access if player is in the game" on public.rolls
  for select using (player_is_in_game(auth.uid(), game));

-- Send "previous data" on change
alter table public.players
  replica identity full;
alter table public.games
  replica identity full;
alter table public.rounds
  replica identity full;
alter table public.turns
  replica identity full;
alter table public.rolls
  replica identity full;

-- inserts a row into public.players
create function public.handle_new_user()
returns trigger as
$$
  begin
    insert into public.players (id, "name")
    values (new.id, new.email);

    return new;
  end;
$$
language plpgsql security definer;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
 * REALTIME SUBSCRIPTIONS
 * Only allow realtime listening on public tables.
 */

begin;
  -- remove the realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the publication but don't enable it for any tables
  create publication supabase_realtime;
commit;

-- add tables to the publication
alter publication supabase_realtime add table public.players;
alter publication supabase_realtime add table public.players_games;
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.rounds;
alter publication supabase_realtime add table public.turns;
alter publication supabase_realtime add table public.rolls;
