import { Draughts } from '../src';

// Initialise the board
let draughts = new Draughts();

// Play 10 moves
for (let index = 0; index < 10; index++) {
  draughts = draughts.move(draughts.moves()[0]);
}

// Show the bitboard result
const { white, black, king } = draughts.bitboard;
console.table({ white, black, king });
