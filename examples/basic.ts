import { AI, DraughtsPlayer, DraughtsStatus, EnglishDraughts } from '../src';

// Initialise the game
const draughts = new EnglishDraughts();

// Show the available moves and play one.
const { moves } = draughts.adapter1D;
console.table(moves);
draughts.adapter1D.move(moves[0]);

// Initialise two AIs
const weakAI = AI.random<EnglishDraughts>();
const strongAI = AI.alphaBeta({
  evaluationFunction: AI.evaluation.english,
  maxDepth: 7,
});

// Play with the AIs until there is a winner
while (draughts.status === DraughtsStatus.PLAYING) {
  console.log(`${draughts.adapter1D.toString()}`);
  console.log(`to_move = ${draughts.player}`);
  const move =
    draughts.player === DraughtsPlayer.LIGHT
      ? weakAI(draughts)
      : strongAI(draughts);
  if (move) draughts.move(move);
}

// Announce the winner
console.log(`${draughts.adapter1D.toString()}`);
console.log(`status = ${draughts.status}`);
