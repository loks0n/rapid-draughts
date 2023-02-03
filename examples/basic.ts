import { EnglishDraughts, Player, Status } from '../src';

// Initialise the game
const { engine, draughts } = EnglishDraughts.setup();

// Show the available moves and play one.
const moves = draughts.moves();
draughts.move(moves[0]);

// Initialise two AIs
const weakAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 4, quiescence: false });
const strongAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 6 });

// Play with the AIs until there is a winner
while (draughts.status() === Status.PLAYING) {
  console.log(draughts.toString());
  const move =
    draughts.player() === Player.LIGHT ? weakAI(engine) : strongAI(engine);
  if (move) engine.move(move);
}

// Announce the winner
console.log(draughts.toString());
console.log(`result = ${draughts.status()}`);
