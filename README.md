# rapid-draughts ⚡

**rapid-draughts** is a *super speedy, blazing fast, rocket-powered* TypeScript draughts/checkers engine.

It uses bitboards, a board representation that holds the draughts board in three 32 or 64 bit unsigned integers. One for the light pieces, dark pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

The engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## How to use

```typescript
import {
  DraughtsPlayer,
  DraughtsStatus,
  EnglishDraughtsComputer,
  EnglishDraughts,
} from 'rapid-draughts';

// Initialise the game
const draughts = EnglishDraughts.setup();

// Show the available moves and play one.
console.table(draughts.moves);
draughts.move(draughts.moves[0]);

// Initialise two computer players
const weakComputer = EnglishDraughtsComputer.random();
const strongComputer = EnglishDraughtsComputer.alphaBeta({
  maxDepth: 7,
});

// Play with the AIs until there is a winner
while (draughts.status === DraughtsStatus.PLAYING) {
  console.log(`${draughts.toString()}`);
  console.log(`to_move = ${draughts.player}`);
  const move =
    draughts.player === DraughtsPlayer.LIGHT
      ? weakComputer(draughts)
      : strongComputer(draughts);

  if (move) draughts.move(move);
}

// Announce the winner
console.log(`${draughts.toString()}`);
console.log(`status = ${draughts.status}`);

```
