import { EnglishDraughts, Player, Status } from '../src';

// Initialise the game
const { engine, draughts } = EnglishDraughts.setup();

// Show the available moves and play one.
const moves = draughts.moves();
draughts.move(moves[0]);

// Initialise two AIs
const weakAI = EnglishDraughts.AI.random();
const strongAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 7 });

// Play with the AIs until there is a winner
while (draughts.status() === Status.PLAYING) {
  console.log(`${draughts.toString()}`);
  console.log(`to_move = ${draughts.player()}`);
  const move =
    draughts.player() === Player.LIGHT ? weakAI(engine) : strongAI(engine);
  if (move) engine.move(move);
}

// Announce the winner
console.log(`${draughts.toString()}`);
console.log(`status = ${draughts.status()}`);
