# rapid-draughts ⚡

**rapid-draughts** is a *super speedy, blazing fast, rocket-powered* 8x8 board TypeScript draughts/checkers engine.

It uses bitboards, a board representation that holds the draughts board in three 32 bit unsigned integers. One for the light pieces, dark pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

The engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## How to use

```typescript
import { EnglishDraughts } from 'rapid-draughts';

// Start a game
let draughts = new EnglishDraughts();
console.log(draughts.toString());

// Output the current player
console.log(draughts.player() === Player.WHI)

// Show the moves
const moves = draughts.moves();
console.table(moves);

// Make a move
draughts = draughts.move(moves[0]);
console.log(draughts.toString());
```
