# rapid-draughts ⚡

**rapid-draughts** is a *super speedy, blazing fast, rocket-powered* 8x8 board TypeScript draughts/checkers engine.

It uses bitboards, a board representation that holds the draughts board in three 32 bit unsigned integers. One for the white pieces, black pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

The engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## How to use

```typescript
import { Draughts } from 'rapid-draughts';

// Initialise the board
let draughts = new Draughts();

// Play 10 moves
for (let i = 0; i < 10; i++) {
  draughts = draughts.move(draughts.moves()[0]);
}

// Show the bitboard result
const { white, black, king } = draughts;
console.table({ white, black, king });
```

