import { describe, beforeEach, test, assert } from 'vitest';

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

  test('capture is forced', () => {
    assert.throw(() => {
      engine.move({
        origin: S[22],
        destination: S[15],
        captures: 0,
      });
    });
  });
});
