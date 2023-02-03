import { EnglishDraughts, Player, Status } from '../src';

// Initialise the game
const { engine, draughts } = EnglishDraughts.setup();

// Initialise two AIs
const weakAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 4, quiescence: false });
const strongAI = EnglishDraughts.AI.alphaBeta({ maxDepth: 6 });

// Play until there is a winner
while (draughts.status() === Status.PLAYING) {
  console.log(draughts.toString());
  const move =
    draughts.player() === Player.LIGHT ? weakAI(engine) : strongAI(engine);
  if (move) engine.move(move);
}

// Announce the winner
console.log(draughts.toString());
console.log(`result = ${draughts.status()}`);
