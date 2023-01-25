import { Draughts, DraughtsBitboard, S } from '../src';
import { formatMove } from '../src/core/helpers';

// Initialise the board
const bitboard = new DraughtsBitboard(S[13], S[18] | S[28]);
const draughts = new Draughts(bitboard);

// Show the moves
console.table(draughts.moves().map((move) => formatMove(move)));
