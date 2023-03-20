import { describe, beforeEach, test, assert } from 'vitest';
import { DraughtsEngine, DraughtsPlayer } from '../core/engine';

import {
  EnglishDraughtsEngineFactory as EngineFactory,
  EnglishDraughtsEngine,
} from './engine';
import { S } from './utils';

describe('possible openings', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup();
  });

  test('correct dark moves', () => {
    assert.equal(engine.data.player, DraughtsPlayer.DARK);
    assert.sameDeepMembers(engine.moves, [
      { origin: S[3], destination: S[2], captures: 0 },
      { origin: S[3], destination: S[28], captures: 0 },
      { origin: S[29], destination: S[28], captures: 0 },
      { origin: S[29], destination: S[22], captures: 0 },
      { origin: S[23], destination: S[22], captures: 0 },
      { origin: S[23], destination: S[16], captures: 0 },
      { origin: S[17], destination: S[16], captures: 0 },
    ]);
  });

  test('correct board after move', () => {
    engine.move({ origin: S[3], destination: S[2], captures: 0 });
    assert.equal(engine.data.player, DraughtsPlayer.LIGHT);
    assert.equal(
      engine.data.board.dark,
      S[2] |
        S[29] |
        S[23] |
        S[17] |
        S[10] |
        S[4] |
        S[30] |
        S[24] |
        S[11] |
        S[5] |
        S[31] |
        S[25]
    );
    assert.equal(engine.data.board.king, 0);
  });

  test('correct light moves', () => {
    engine.move({ origin: S[3], destination: S[2], captures: 0 });
    assert.equal(engine.data.player, DraughtsPlayer.LIGHT);
    assert.sameDeepMembers(engine.moves, [
      { origin: S[26], destination: S[27], captures: 0 },
      { origin: S[20], destination: S[27], captures: 0 },
      { origin: S[20], destination: S[21], captures: 0 },
      { origin: S[14], destination: S[21], captures: 0 },
      { origin: S[14], destination: S[15], captures: 0 },
      { origin: S[8], destination: S[15], captures: 0 },
      { origin: S[8], destination: S[9], captures: 0 },
    ]);
  });
});

describe('simple move', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: { light: S[21] | S[0], dark: S[24], king: 0 },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      { origin: S[24], destination: S[23], captures: 0 },
      { origin: S[24], destination: S[17], captures: 0 },
    ]);
  });

  test('correct board after move', () => {
    engine.move({ origin: S[24], destination: S[23], captures: 0 });
    assert.equal(engine.data.board.light, S[21] | S[0]);
    assert.equal(engine.data.board.dark, S[23]);
    assert.equal(engine.data.board.king, 0);
  });
});

describe('tricky move', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: { light: S[30], dark: S[21], king: 0 },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      { origin: S[30], destination: S[31], captures: 0 },
      { origin: S[30], destination: S[5], captures: 0 },
    ]);
  });
});

describe('simple jump', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: { light: S[21] | S[0], dark: S[22], king: 0 },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      { origin: S[22], destination: S[20], captures: S[21] },
    ]);
  });
});

describe('jump and become king', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = EngineFactory.setup({
      board: { light: S[17], dark: S[24] | S[14], king: 0 },
      player: DraughtsPlayer.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves, [
      { origin: S[17], destination: S[31], captures: S[24] },
    ]);
  });
});
