import { Draughts } from "../src";
import { moveToSquares, S } from "../src/bitboard";

// Initialise the board
let draughts = new Draughts(S[13], S[18] | S[28]);

// Show the moves
console.table(draughts.moves().map(moveToSquares));
