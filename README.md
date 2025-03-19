# rapid-draughts ⚡

[![npm version](https://badge.fury.io/js/rapid-draughts.svg)](https://badge.fury.io/js/rapid-draughts)
![Downloads](https://img.shields.io/npm/dt/rapid-draughts)
![Known Vulnerabilities](https://snyk.io/test/github/loks0n/rapid-draughts/badge.svg)
[![Package quality](https://packagequality.com/shield/rapid-draughts.png)](https://packagequality.com/#?package=rapid-draughts)
![License](https://img.shields.io/github/license/loks0n/rapid-draughts?color=lightgrey)
![Benchmark](https://img.shields.io/badge/Benchmarks-Available-brightgreen)

A *super speedy, blazing fast, rocket-powered* TypeScript draughts/checkers engine with move validation, AI and game history.

It uses bitboards, a board representation that holds the draughts board in three 32 or 64 bit unsigned integers. One for the light pieces, dark pieces and the king pieces. Bitboards enable fast move generation and have minimal memory usage.

The english draughts / american checkers engine follows the [WCDF ruleset](https://www.wcdf.net/rules.htm).

## Installing

Run the following command inside your node project:
```bash
npm install rapid-draughts
```

## How To Use

```typescript
import { DraughtsPlayer, DraughtsStatus } from 'rapid-draughts';
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
```

## Online Demo

rapid-draughts powers the draughts game site [draughts.org](https://draughts.org/). Check it out!
