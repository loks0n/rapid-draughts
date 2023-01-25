import { test, assert, describe, beforeEach } from 'vitest';
import { Draughts, S } from '../index';
import { DraughtsBitboard } from './bitboard';
import { Player, Status } from './types';

describe('simple capture', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[13], S[18] | S[28]);
    draughts = new Draughts(bitboard);
  });

  test('correct moves', () => {
    assert.sameDeepMembers(draughts.moves(), [
      { origin: S[13], destination: S[22], captures: S[18] },
    ]);
  });

  test('capture is forced', () => {
    assert.throw(() => {
      draughts = draughts.move({
        origin: S[13],
        destination: S[17],
        captures: 0,
      });
    });
  });
});

describe('double capture', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[0], S[4] | S[13]);
    draughts = new Draughts(bitboard);
  });

  test('correct moves', () => {
    assert.sameDeepMembers(draughts.moves(), [
      { origin: S[0], destination: S[18], captures: S[4] | S[13] },
    ]);
  });
});

describe('king capture', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[4], S[9] | S[3], S[4]);
    draughts = new Draughts(bitboard);
  });

  test('correct moves', () => {
    assert.sameDeepMembers(draughts.moves(), [
      { origin: S[4], destination: S[13], captures: S[9] },
    ]);
  });

  test('can make valid move', () => {
    assert.doesNotThrow(() => {
      draughts = draughts.move({
        origin: S[4],
        destination: S[13],
        captures: S[9],
      });
    });

    assert.equal(draughts.bitboard.white, S[13]);
    assert.equal(draughts.bitboard.black, S[3]);
    assert.equal(draughts.bitboard.king, S[13]);
  });
});

describe('king backwards capture', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[18], S[13] | S[3], S[18]);
    draughts = new Draughts(bitboard);
  });

  test('correct moves', () => {
    assert.sameDeepMembers(draughts.moves(), [
      { origin: S[18], destination: S[9], captures: S[13] },
    ]);
  });

  test('can make valid move', () => {
    assert.doesNotThrow(() => {
      draughts = draughts.move({
        origin: S[18],
        destination: S[9],
        captures: S[13],
      });
    });

    assert.equal(draughts.bitboard.white, S[9]);
    assert.equal(draughts.bitboard.black, S[3]);
    assert.equal(draughts.bitboard.king, S[9]);
  });
});

describe('make king', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[24], S[17]);
    draughts = new Draughts(bitboard);
    assert.equal(draughts.bitboard.king, 0);
  });

  test('king is made', () => {
    draughts = draughts.move({
      origin: S[24],
      destination: S[28],
      captures: 0,
    });
    assert.equal(draughts.bitboard.king, S[28]);
  });
});

describe('white wins', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[17], S[21]);
    draughts = new Draughts(bitboard);
  });

  test('can win with move', () => {
    assert.equal(draughts.status(), Status.PLAYING);

    draughts = draughts.move({
      origin: S[17],
      destination: S[26],
      captures: S[21],
    });

    assert.equal(draughts.status(), Status.WHITE_WON);
  });
});

describe('black wins', () => {
  let bitboard: DraughtsBitboard;
  let draughts: Draughts;

  beforeEach(() => {
    bitboard = new DraughtsBitboard(S[17], S[21], 0);
    draughts = new Draughts(bitboard, Player.BLACK);
  });

  test('can win with move', () => {
    assert.equal(draughts.status(), Status.PLAYING);

    draughts = draughts.move({
      origin: S[21],
      destination: S[12],
      captures: S[17],
    });

    assert.equal(draughts.status(), Status.BLACK_WON);
  });
});
