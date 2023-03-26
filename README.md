# rapid-draughts ⚡

[![npm version](https://badge.fury.io/js/rapid-draughts.svg)](https://badge.fury.io/js/rapid-draughts)
![Known Vulnerabilities](https://snyk.io/test/github/loks0n/rapid-draughts/badge.svg)

A *super speedy, blazing fast, rocket-powered* TypeScript draughts/checkers engine.

It uses bitboards, a board representation that holds the draughts board in three 32 or 64 bit unsigned integers. One for the light pieces, dark pieces and the king pieces.

Bitboards enable fast move generation and have minimal memory usage.

The engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## Demo

rapid-draughts powers the draughts game site [http://www.draughts.org/](http://www.draughts.org/). Check it out!

## How to use

```typescript
import { DraughtsPlayer, DraughtsStatus } from 'rapid-draughts/core';
import {
  EnglishDraughts as Draughts,
  EnglishDraughtsComputerFactory as ComputerFactory,
} from 'rapid-draughts/english';

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

```
