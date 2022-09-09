# _Dice 10 000_ Specification Draft 2 – 2022-09

## Tech Stack

- Monorepo management tool: [Nx](https://nx.dev/)
- Application development framework: [Next.js](https://nextjs.org/)
  - 🚧 The technologies used to develop the web application won't be decided or specified up front. These are the technologies as of current, although they may be subject to change as development goes on:
    - State management solutions:
      - [XState](https://xstate.js.org/docs/)
      - [`zustand`](https://github.com/pmndrs/zustand)
    - Styling solutions:
      - [Tailwind CSS](https://tailwindcss.com/)
    - Prefab component libraries:
      - [Supabase UI](https://ui.supabase.io/) (for sign in and sign up related UI)
- Hosting form: static, hosting platform: [Vercel](https://vercel.com/)
  - Custom domain: `danielgiljam.com`
  - Base path: `/dice-10-000`
- Database: [Supabase Database](https://supabase.com/database)
- 🚧 Sections that will be added in updates to this draft or later drafts:
  - Testing

## Game Rules

- There are 6 dice in the game.
- There must be at least 2 players in the game.
- Each player enters the game with 0 points.
- A player can earn points for themselves by rolling dice on their turn.
  - A player can roll dice multiple times per turn.
- After each roll the player has to lock at least one subset of dice.
  - The player can only lock subsets of dice that are worth points.
  - A subset of dice becomes immutable once locked. The locked dice cannot later on be re-arranged into subsets worth more points.
- If the outcome of the rolled dice isn’t worth any points, then the player’s turn ends without the player earning any points on that turn.
- The player can choose to yield their turn, thus earning the points gathered so far in the turn.

  - The first time the player earns points, they must earn at least 1000 points.
  - The first player to earn 10 000 points wins the game.

- If there are no dice left to roll, then all dice are unlocked for the subsequent roll. This doesn’t affect the points gathered during the turn so far. They keep accumulating.

- Dice are worth points as following:
  | Dice Combinations | Points |
  | :---------------- | -----: |
  | ⚀ | 100 |
  | ⚀ ⚀ | 200 |
  | ⚀ ⚀ ⚀ | 1 000 |
  | ⚀ ⚀ ⚀ ⚀ | 2 000 |
  | ⚀ ⚀ ⚀ ⚀ ⚀ | 4 000 |
  | ⚀ ⚀ ⚀ ⚀ ⚀ ⚀ | 8 000 |
  | ⚁ ⚁ ⚁ | 200 |
  | ⚁ ⚁ ⚁ ⚁ | 400 |
  | ⚁ ⚁ ⚁ ⚁ ⚁ | 800 |
  | ⚁ ⚁ ⚁ ⚁ ⚁ ⚁ | 1 600 |
  | ⚂ ⚂ ⚂ | 300 |
  | ⚂ ⚂ ⚂ ⚂ | 600 |
  | ⚂ ⚂ ⚂ ⚂ ⚂ | 1 200 |
  | ⚂ ⚂ ⚂ ⚂ ⚂ ⚂ | 2 400 |
  | ⚃ ⚃ ⚃ | 400 |
  | ⚃ ⚃ ⚃ ⚃ | 800 |
  | ⚃ ⚃ ⚃ ⚃ ⚃ | 1 800 |
  | ⚃ ⚃ ⚃ ⚃ ⚃ ⚃ | 3 600 |
  | ⚄ | 50 |
  | ⚄ ⚄ | 100 |
  | ⚄ ⚄ ⚄ | 500 |
  | ⚄ ⚄ ⚄ ⚄ | 1 000 |
  | ⚄ ⚄ ⚄ ⚄ ⚄ | 2 000 |
  | ⚄ ⚄ ⚄ ⚄ ⚄ ⚄ | 4 000 |
  | ⚅ ⚅ ⚅ | 600 |
  | ⚅ ⚅ ⚅ ⚅ | 1 200 |
  | ⚅ ⚅ ⚅ ⚅ ⚅ | 2 400 |
  | ⚅ ⚅ ⚅ ⚅ ⚅ ⚅ | 4 800 |

## Data Structures

### `Player`

```ts
interface Player {
  id: Id;
  created_at: Date;
  name: string;
  games: Game[];
}
```

### `Game`

```ts
interface Game {
  id: Id;
  created_at: Date;
  name: string;
  players: Player[];
  rounds: Round[];
  ended_at: Date | undefined;
}
```

### `Round`

```ts
interface Round {
  id: Id;
  created_at: Date;
  index: number;
  game: Game;
  turn_queue: Player[];
  completed_turns: Turn[];
  remaining_turns: Turn[];
  ended_at: Date | undefined;
}
```

### `Turn`

```ts
interface Turn {
  id: Id;
  created_at: Date;
  player: Player;
  round: Round;
  game: Game;
  ended_at: Date | undefined;
  rolls: Roll[];
}
```

### `Roll`

```ts
interface Roll {
  id: Id;
  created_at: Date;
  index: number;
  player: Player;
  turn: Turn;
  round: Round;
  game: Game;
  ended_at: Date | undefined;
  outcome: DieFace[];
  locked_dices: DiceSubset[];
}
```

### `DieFace`

```ts
enum DieFace {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
}
```

### `DiceSubset`

```ts
interface DiceSubset {
  die_faces: DieFace[];
  points: number;
}
```
