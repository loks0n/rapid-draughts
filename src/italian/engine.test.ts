import { describe, beforeEach, test, assert } from 'vitest';
import { DraughtsPlayer, DraughtsStatus } from '../core/engine';
import {
  ItalianDraughtsEngineFactory as EngineFactory,
  ItalianDraughtsEngine,
} from './engine';

import { EnglishDraughtsBitSquare as S } from '../english/utils';
import { BitwiseNumber } from '../bitwise/number';

/* We use the following bitboard layout for Italian Draughts
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
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup();
  });

  test('correct light moves', () => {
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

describe('men cannot capture kings', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[15],
        dark: S[22],
        king: S[22],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[15],
        destination: S[16],
        captures: 0,
      },
    ]);
  });
});

describe('men cannot capture kings mid-chain', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[14],
        dark: S[21] | S[3],
        king: S[3],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[14],
        destination: S[28],
        captures: S[21],
      },
    ]);
  });
});

describe('kings capture kings', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[15],
        dark: S[22],
        king: S[15] | S[22],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[15],
        destination: S[29],
        captures: S[22],
      },
    ]);
  });
});

describe('jump and become king', () => {
  let engine: ItalianDraughtsEngine;

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
  let engine: ItalianDraughtsEngine;

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

describe('priority by captured pieces', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[14],
        dark: S[21] | S[3] | S[15],
        king: 0,
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[14],
        destination: S[10],
        captures: BitwiseNumber.or(S[21], S[3]),
      },
    ]);
  });
});

describe('priority of the capturing king', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[26] | S[9],
        dark: S[27] | S[16],
        king: S[9],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[9],
        destination: S[23],
        captures: S[16],
      },
    ]);
  });
});

describe('priority by captured kings', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[26] | S[9],
        dark: S[27] | S[16],
        king: S[9] | S[26] | S[16],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[9],
        destination: S[23],
        captures: S[16],
      },
    ]);
  });
});

describe('priority by capturing a king earlier', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[21],
        dark: S[28] | S[22] | S[4] | S[16],
        king: S[21] | S[28] | S[16],
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[21],
        destination: S[5],
        captures: BitwiseNumber.or(S[28], S[4]),
      },
    ]);
  });
});

describe('equal priority', () => {
  let engine: ItalianDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: {
        light: S[14],
        dark: S[21] | S[15],
        king: 0,
      },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      {
        origin: S[14],
        destination: S[28],
        captures: S[21],
      },
      {
        origin: S[14],
        destination: S[16],
        captures: S[15],
      },
    ]);
  });
});

describe('draw', () => {
  test('draws after 80 plies without captures or man moves', () => {
    const engine = EngineFactory.setup({
      board: {
        light: S[22],
        dark: S[5],
        king: S[22] | S[5],
      },
      stats: { sinceCapture: 80, sinceNonKingAdvance: 80 },
      player: DraughtsPlayer.LIGHT,
    });

    assert.equal(engine.status, DraughtsStatus.DRAW);
  });

  test('no draw before 80 plies without captures', () => {
    const engine = EngineFactory.setup({
      board: {
        light: S[22],
        dark: S[5],
        king: S[22] | S[5],
      },
      stats: { sinceCapture: 79, sinceNonKingAdvance: 80 },
      player: DraughtsPlayer.LIGHT,
    });

    assert.equal(engine.status, DraughtsStatus.PLAYING);
  });

  test('no draw before 80 plies without man moves', () => {
    const engine = EngineFactory.setup({
      board: {
        light: S[22],
        dark: S[5],
        king: S[22] | S[5],
      },
      stats: { sinceCapture: 80, sinceNonKingAdvance: 79 },
      player: DraughtsPlayer.LIGHT,
    });

    assert.equal(engine.status, DraughtsStatus.PLAYING);
  });

  test('no draw without a king each side', () => {
    const engine = EngineFactory.setup({
      board: {
        light: S[22],
        dark: S[5],
        king: S[5],
      },
      stats: { sinceCapture: 80, sinceNonKingAdvance: 80 },
      player: DraughtsPlayer.LIGHT,
    });

    assert.equal(engine.status, DraughtsStatus.PLAYING);
  });

  test('correct stats after a man move', () => {
    const engine = EngineFactory.setup({
      board: {
        light: S[8],
        dark: S[5],
        king: S[5],
      },
      stats: { sinceCapture: 0, sinceNonKingAdvance: 5 },
      player: DraughtsPlayer.LIGHT,
    });

    engine.move({ origin: S[8], destination: S[15], captures: 0 });

    assert.equal(engine.data.stats.sinceNonKingAdvance, 0);
  });

  test('correct stats after a king move', () => {
    const engine = EngineFactory.setup({
      board: {
        light: S[11],
        dark: BitwiseNumber.or(S[24], S[14]),
        king: S[11],
      },
      stats: { sinceCapture: 0, sinceNonKingAdvance: 5 },
      player: DraughtsPlayer.LIGHT,
    });

    engine.move({ origin: S[11], destination: S[4], captures: 0 });

    assert.equal(engine.data.stats.sinceNonKingAdvance, 6);
  });
});
