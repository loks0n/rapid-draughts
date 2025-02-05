import { describe, beforeEach, test, assert } from 'vitest';
import { DraughtsPlayer } from '../core/engine';
import {
  EnglishDraughtsEngineFactory as EngineFactory,
  EnglishDraughtsEngine,
} from './engine';

import { EnglishDraughtsBitSquare as S } from './utils';
import { BitwiseNumber } from '../bitwise/number';

/* We use the following bitboard layout for English Draughts
 *
 *   11  05  31  25
 * 10  04  30  24
 *   03  29  23  17
 * 02  28  22  16
 *   27  21  15  09
 * 26  20  14  08
 *   19  13  07  01
 * 18  12  06  00
 *
 * Access the uint32 value of a square with S[n]
 *
 * A move forward to the left is a rotate left 7 bits.
 * A move forward to the right is a rotate left 1 bit.
 */

describe('possible openings', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup();
  });

  test('correct dark moves', () => {
    assert.equal(engine.data.player, DraughtsPlayer.DARK);
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[3],
        destination: S[2],
        captures: 0,
      },
      {
        origin: S[3],
        destination: S[28],
        captures: 0,
      },
      {
        origin: S[29],
        destination: S[28],
        captures: 0,
      },
      {
        origin: S[29],
        destination: S[22],
        captures: 0,
      },
      {
        origin: S[23],
        destination: S[22],
        captures: 0,
      },
      {
        origin: S[23],
        destination: S[16],
        captures: 0,
      },
      {
        origin: S[17],
        destination: S[16],
        captures: 0,
      },
    ]);
  });

  test('correct board after move', () => {
    engine.move({
      origin: S[3],
      destination: S[2],
      captures: 0,
    });
    assert.equal(engine.data.player, DraughtsPlayer.LIGHT);

    assert.equal(
      engine.data.board.dark,
      BitwiseNumber.or(
        S[2],
        S[29],
        S[23],
        S[17],
        S[10],
        S[4],
        S[30],
        S[24],
        S[11],
        S[5],
        S[31],
        S[25]
      )
    );
    assert.equal(engine.data.board.king, 0);
  });

  test('correct light moves', () => {
    engine.move({
      origin: S[3],
      destination: S[2],
      captures: 0,
    });
    assert.equal(engine.data.player, DraughtsPlayer.LIGHT);
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[26],
        destination: S[27],
        captures: 0,
      },
      {
        origin: S[20],
        destination: S[27],
        captures: 0,
      },
      {
        origin: S[20],
        destination: S[21],
        captures: 0,
      },
      {
        origin: S[14],
        destination: S[21],
        captures: 0,
      },
      {
        origin: S[14],
        destination: S[15],
        captures: 0,
      },
      {
        origin: S[8],
        destination: S[15],
        captures: 0,
      },
      {
        origin: S[8],
        destination: S[9],
        captures: 0,
      },
    ]);
  });
});

describe('simple move', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[21] | S[0],
        dark: S[24],
        king: 0,
      },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[24],
        destination: S[23],
        captures: 0,
      },
      {
        origin: S[24],
        destination: S[17],
        captures: 0,
      },
    ]);
  });

  test('correct board after move', () => {
    engine.move({
      origin: S[24],
      destination: S[23],
      captures: 0,
    });
    assert.equal(engine.data.board.light, S[21] | S[0]);
    assert.equal(engine.data.board.dark, S[23]);
    assert.equal(engine.data.board.king, 0);
  });
});

describe('tricky move', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[30],
        dark: S[21],
        king: 0,
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[30],
        destination: S[31],
        captures: 0,
      },
      {
        origin: S[30],
        destination: S[5],
        captures: 0,
      },
    ]);
  });
});

describe('tricky move 2', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[12],
        dark: S[31],
        king: 0,
      },
      player: DraughtsPlayer.DARK,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[31],
        destination: S[30],
        captures: 0,
      },
      {
        origin: S[31],
        destination: S[24],
        captures: 0,
      },
    ]);
  });
});

describe('simple jump', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[21] | S[0],
        dark: S[22],
        king: 0,
      },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[22],
        destination: S[20],
        captures: S[21],
      },
    ]);
  });
});

describe('jump and become king', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[17],
        dark: S[24] | S[14],
        king: 0,
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[17],
        destination: S[31],
        captures: S[24],
      },
    ]);
  });
});

describe('move king', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[11],
        dark: BitwiseNumber.or(S[24], S[14]),
        king: S[11],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[11],
        destination: S[10],
        captures: 0,
      },
      {
        origin: S[11],
        destination: S[4],
        captures: 0,
      },
    ]);

    engine.move({
      origin: S[11],
      destination: S[4],
      captures: 0,
    });

    assert.equal(engine.data.board.light, S[4]);
    assert.equal(engine.data.board.dark, BitwiseNumber.or(S[24], S[14]));
    assert.equal(engine.data.board.king, S[4]);
  });
});
