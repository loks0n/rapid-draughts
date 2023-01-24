import { test, assert, describe, beforeEach } from 'vitest';
import { Draughts, S } from '../index';
import { Player, Status } from './types';

describe('simple capture', () => {
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[13], S[18] | S[28]);
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
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[0], S[4] | S[13]);
  });

  test('correct moves', () => {
    assert.sameDeepMembers(draughts.moves(), [
      { origin: S[0], destination: S[18], captures: S[4] | S[13] },
    ]);
  });
});

describe('king capture', () => {
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[4], S[9] | S[3], S[4]);
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

    assert.equal(draughts.white, S[13]);
    assert.equal(draughts.black, S[3]);
    assert.equal(draughts.king, S[13]);
  });
});

describe('king backwards capture', () => {
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[18], S[13] | S[3], S[18]);
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

    assert.equal(draughts.white, S[9]);
    assert.equal(draughts.black, S[3]);
    assert.equal(draughts.king, S[9]);
  });
});

describe('make king', () => {
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[24], S[17]);
    assert.equal(draughts.king, 0);
  });

  test('king is made', () => {
    draughts = draughts.move({
      origin: S[24],
      destination: S[28],
      captures: 0,
    });
    assert.equal(draughts.king, S[28]);
  });
});

describe('white wins', () => {
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[17], S[21]);
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
  let draughts: Draughts;

  beforeEach(() => {
    draughts = new Draughts(S[17], S[21], 0, Player.BLACK);
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
