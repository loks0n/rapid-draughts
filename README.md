# rapid-draughts ⚡

**rapid-draughts** is a *super speedy, blazing fast, rocket-powered* TypeScript draughts/checkers engine.

It uses bitboards, a board representation that holds the draughts board in three 32 or 64 bit unsigned integers. One for the light pieces, dark pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

The engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## How to use

```typescript
import { AI, DraughtsPlayer, DraughtsStatus, EnglishDraughts } from 'rapid-draughts';

// Initialise the game
const draughts = new EnglishDraughts();

// Show the available moves and play one.
const { moves } = draughts.adapter1D;
console.table(moves);
draughts.adapter1D.move(moves[0]);

// Initialise two AIs
const weakAI = AI.random<EnglishDraughts>();
const strongAI = AI.alphaBeta\({
  evaluationFunction: AI.evaluation.english,
  maxDepth: 7,
});

// Play with the AIs until there is a winner
while (draughts.status === DraughtsStatus.PLAYING) {
  console.log(`${draughts.adapter1D.toString()}`);
  console.log(`to_move = ${draughts.player}`);
  const move =
    draughts.player === DraughtsPlayer.LIGHT
      ? weakAI(draughts)
      : strongAI(draughts);
  if (move) draughts.move(move);
}

// Announce the winner
console.log(`${draughts.toString()}`);
console.log(`status = ${draughts.status}`);
```
