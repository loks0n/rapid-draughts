# rapid-draughts

**rapid-draughts** is a *super speedy, blazing fast, rocket-powered* 8x8 board TypeScript draughts/checkers engine.

It uses Bitboards, a board representation that hold the draughts board in three 32 bit unsigned integers. One for the white pieces, black pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

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

