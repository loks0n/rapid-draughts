import { describe, beforeEach, test, assert } from 'vitest';
import { DraughtsPlayer } from '../core/engine';

import { ItalianDraughts, ItalianDraughtsGame } from './game';
import { EnglishDraughtsBitSquare as S } from '../english/utils';

describe('start position', () => {
  let draughts: ItalianDraughtsGame;

  beforeEach(() => {
    draughts = ItalianDraughts.setup();
  });

  test('correct opening player', () => {
    assert.equal(draughts.player, DraughtsPlayer.LIGHT);
  });

  test('correct opening moves', () => {
    assert.sameDeepMembers(draughts.moves, [
      { origin: 20, destination: 16, captures: [] },
      { origin: 20, destination: 17, captures: [] },
      { origin: 21, destination: 17, captures: [] },
      { origin: 21, destination: 18, captures: [] },
      { origin: 22, destination: 18, captures: [] },
      { origin: 22, destination: 19, captures: [] },
      { origin: 23, destination: 19, captures: [] },
    ]);
  });

  test('can make opening move', () => {
    assert.doesNotThrow(() => {
      draughts.move({ origin: 20, destination: 16, captures: [] });
      assert.equal(draughts.player, DraughtsPlayer.DARK);
    });
  });

  test('invalid move throws an error', () => {
    assert.throws(() => {
      draughts.move({ origin: 20, destination: 18, captures: [] });
    });
  });

  test('correct light cantone square', () => {
    assert.deepEqual(draughts.board[63], {
      dark: true,
      position: 31,
      piece: { player: DraughtsPlayer.LIGHT, king: false },
    });
  });
});

describe('simple jump', () => {
  let draughts: ItalianDraughtsGame;

  beforeEach(() => {
    draughts = ItalianDraughts.setup({
      board: {
        light: S[14],
        dark: S[21] | S[4],
        king: 0,
      },
    });
  });

  test('correct moves', () => {
    assert.sameDeepMembers(draughts.moves, [
      { origin: 21, destination: 14, captures: [18] },
    ]);
  });

  test('can make jump move', () => {
    assert.doesNotThrow(() => {
      draughts.move({ origin: 21, destination: 14, captures: [18] });
      assert.equal(draughts.player, DraughtsPlayer.DARK);
    });
  });
});
