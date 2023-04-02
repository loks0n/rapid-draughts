import { DraughtsPlayer, DraughtsStatus } from '../src/core';
import {
  EnglishDraughts as Draughts,
  EnglishDraughtsComputerFactory as ComputerFactory,
} from '../src/english';

// Initialise the game
const draughts = Draughts.setup();

// Show the available moves and play one.
console.table(draughts.moves);
draughts.move(draughts.moves[0]);

// Initialise two computer players
const weakComputer = ComputerFactory.random();
const strongComputer = ComputerFactory.alphaBeta({
  maxDepth: 7,
});

// Play with the AIs until there is a winner
while (draughts.status === DraughtsStatus.PLAYING) {
  console.log(`${draughts.asciiBoard()}`);
  console.log(`to_move = ${draughts.player}`);

  const computerPlayer =
    draughts.player === DraughtsPlayer.LIGHT ? weakComputer : strongComputer;

  const move = await computerPlayer(draughts);
  if (move) draughts.move(move);
}

// Announce the winner
console.log(`${draughts.asciiBoard()}`);
console.log(`status = ${draughts.status}`);
console.log(`ended after ${draughts.history.moves.length} moves`);
