# _Dice 10 000_ Specification Draft 1 – 2022-07

## Tech Stack

- Application development framework: [Next.js](https://nextjs.org/)
  - State management solution: [XState](https://xstate.js.org/docs/)
  - External styling libraries:
    - [Tailwind CSS](https://tailwindcss.com/)
  - External prefab component libraries:
    - [Material UI](https://mui.com/)
- Hosting form: static, hosting platform: [Firebase Hosting](https://firebase.google.com/products/hosting)
  - Potentially custom domain: `danielgiljam.com`
- Database: [Firestore](https://firebase.google.com/products/firestore)

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
  id: ObjectId;
  createdAt: Date;
  name: string;
  games: Array<Game | ObjectId>;
}
```

### `Game`

```ts
interface Game {
  id: ObjectId;
  createdAt: Date;
  name: string;
  players: Array<Player | ObjectId>;
  rounds: Array<Round | ObjectId>;
  endedAt: Date | undefined;
}
```

### `Round`

```ts
interface Round {
  id: ObjectId;
  createdAt: Date;
  index: number;
  game: Game | ObjectId;
  turnQueue: Array<Player | ObjectId>;
  completedTurns: Array<Turn | ObjectId>;
  remainingTurns: Array<Turn | ObjectId>;
  endedAt: Date | undefined;
}
```

### `Turn`

```ts
interface Turn {
  id: ObjectId;
  createdAt: Date;
  player: Player | ObjectId;
  round: Round | ObjectId;
  game: Game | ObjectId;
  endedAt: Date | undefined;
  rolls: Array<Roll | ObjectId>;
}
```

### `Roll`

```ts
interface Roll {
  id: ObjectId;
  createdAt: Date;
  index: number;
  player: Player | ObjectId;
  turn: Turn | ObjectId;
  round: Round | ObjectId;
  game: Game | ObjectId;
  endedAt: Date | undefined;
  outcome: DieFace[];
  lockedDices: DiceSubset[];
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
  dieFaces: DieFace[];
  points: number;
}
```
