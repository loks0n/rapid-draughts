import { Draughts } from "../src";

// Initialise the board
let draughts = new Draughts();

// Play 10 moves
for (let i = 0; i < 10; i++) {
  draughts = draughts.move(draughts.moves()[0]);
}

// Show the bitboard result
const { white, black, king } = draughts;
console.table({ white, black, king });
