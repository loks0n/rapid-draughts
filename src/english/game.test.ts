import { describe, beforeEach, test, assert } from 'vitest';
import { DraughtsPlayer } from '../core/engine';

import { EnglishDraughts, EnglishDraughtsGame } from './game';

describe('start position', () => {
  let draughts: EnglishDraughtsGame;

  beforeEach(() => {
    draughts = EnglishDraughts.setup();
  });

  test('corect opening player', () => {
    assert.equal(draughts.player, DraughtsPlayer.DARK);
  });

  test('correct opening moves', () => {
    assert.sameDeepMembers(draughts.moves, [
      { origin: 8, destination: 12, captures: [] },
      { origin: 8, destination: 13, captures: [] },
      { origin: 11, destination: 15, captures: [] },
      { origin: 10, destination: 14, captures: [] },
      { origin: 10, destination: 15, captures: [] },
      { origin: 9, destination: 13, captures: [] },
      { origin: 9, destination: 14, captures: [] },
    ]);
  });

  test('can make opening move', () => {
    assert.doesNotThrow(() => {
      draughts.move({ origin: 8, destination: 12, captures: [] });
      assert.equal(draughts.player, DraughtsPlayer.LIGHT);
    });
  });

  test('invalid move throws an error', () => {
    assert.throws(() => {
      draughts.move({ origin: 8, destination: 14, captures: [] });
    });
  });
});
