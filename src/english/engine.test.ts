import { describe, beforeEach, test, assert } from 'vitest';
import { Player } from '../types';

import { EnglishDraughtsEngine } from './engine';
import { S } from './utils';

describe('simple move', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = new EnglishDraughtsEngine({
      board: { light: S[21] | S[0], dark: S[24], king: 0 },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves(), [
      { origin: S[24], destination: S[23], captures: 0 },
      { origin: S[24], destination: S[17], captures: 0 },
    ]);
  });
});

describe('simple jump', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = new EnglishDraughtsEngine({
      board: { light: S[21] | S[0], dark: S[22], king: 0 },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves(), [
      { origin: S[22], destination: S[20], captures: S[21] },
    ]);
  });
});

describe('jump and become king', () => {
  let engine: EnglishDraughtsEngine;

  beforeEach(() => {
    engine = new EnglishDraughtsEngine({
      board: { light: S[17], dark: S[24] | S[14], king: 0 },
      playerToMove: Player.LIGHT,
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(engine.moves(), [
      { origin: S[17], destination: S[31], captures: S[24] },
    ]);
  });
});
