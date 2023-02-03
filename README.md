# rapid-draughts ⚡

**rapid-draughts** is a *super speedy, blazing fast, rocket-powered* 8x8 board TypeScript draughts/checkers engine.

It uses bitboards, a board representation that holds the draughts board in three 32 bit unsigned integers. One for the light pieces, dark pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

The engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## How to use

```typescript
import { EnglishDraughts, Player, Status } from 'rapid-draughts';

// Initialise the game
const { engine, draughts } = EnglishDraughts.setup();

// Show the available moves and play one.
const moves = draughts.moves();
draughts.move(moves[0]);

// Initialise two AIs
const weakAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 4, quiescence: false });
const strongAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 6 });

// Play with the AIs until there is a winner
while (draughts.status() === Status.PLAYING) {
  console.log(draughts.toString());
  const move =
    draughts.player() === Player.LIGHT ? weakAI(engine) : strongAI(engine);
  if (move) engine.move(move);
}

// Announce the winner
console.log(draughts.toString());
console.log(`result = ${draughts.status()}`);

```
