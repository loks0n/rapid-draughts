import { Draughts, S } from '../src';
import { formatMove } from '../src/helpers';

// Initialise the board
const draughts = new Draughts(S[13], S[18] | S[28]);

// Show the moves
console.table(draughts.moves().map((move) => formatMove(move)));
