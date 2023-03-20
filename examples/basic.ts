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
console.log(`ended after ${draughts.history.moves.length} moves`);
