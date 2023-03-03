import {
  DraughtsEngineBoard,
  DraughtsEngineMove,
  DraughtsPlayer,
} from '../../types';
import * as Mask from './mask';
import {
  EnglishDraughtsBoardIntermediates,
  EnglishDraughtsDrawCounter,
} from './types';
import { rotLeft, rotRight } from './utils';

export function generateIntermediates(
  player: DraughtsPlayer,
  board: DraughtsEngineBoard<number>
): EnglishDraughtsBoardIntermediates {
  return {
    forward:
      player === DraughtsPlayer.LIGHT ? board.light : board.dark & board.king,
    backward:
      player === DraughtsPlayer.LIGHT ? board.light & board.king : board.dark,
    opponent: player === DraughtsPlayer.LIGHT ? board.dark : board.light,
    empty: ~(board.light | board.dark),
  };
}

function generateMoveIntermediates(
  board: EnglishDraughtsBoardIntermediates,
  move: DraughtsEngineMove<number>
): EnglishDraughtsBoardIntermediates {
  return {
    forward:
      board.forward & move.origin
        ? board.forward | move.destination
        : board.forward,
    backward:
      board.backward & move.origin
        ? board.backward | move.destination
        : board.backward,
    opponent: board.opponent & ~move.captures,
    empty: board.empty,
  };
}

export function applyMove(
  board: DraughtsEngineBoard<number>,
  drawCounters: EnglishDraughtsDrawCounter,
  move: DraughtsEngineMove<number>
): {
  board: DraughtsEngineBoard<number>;
  drawCounters: EnglishDraughtsDrawCounter;
} {
  const newBoard = {
    ...board,
  };

  newBoard.light &= ~(move.origin | move.captures);
  newBoard.dark &= ~(move.origin | move.captures);
  newBoard.king &= ~(move.origin | move.captures);

  if (board.light & move.origin) {
    newBoard.light |= move.destination;
    newBoard.king |= move.destination & Mask.RANK_7;
  } else {
    newBoard.dark |= move.destination;
    newBoard.king |= move.destination & Mask.RANK_0;
  }

  const newDrawCounters = { ...drawCounters };

  if (board.king & move.origin) {
    newBoard.king |= move.destination;
    newDrawCounters.sinceUncrownedAdvance += 1;
  } else {
    newDrawCounters.sinceUncrownedAdvance = 0;
  }

  if (move.captures) {
    newDrawCounters.sinceCapture = 0;
  } else {
    newDrawCounters.sinceCapture += 1;
  }

  return { board: newBoard, drawCounters: newDrawCounters };
}

export function getJumpers(board: EnglishDraughtsBoardIntermediates): number {
  let capture = rotRight(board.empty, 7) & (board.opponent & Mask.FORWARD_LEFT);
  let jumpers = rotRight(capture, 7) & (board.forward & Mask.FORWARD_LEFT);

  capture = rotRight(board.empty, 1) & (board.opponent & Mask.FORWARD_RIGHT);
  jumpers |= rotRight(capture, 1) & (board.forward & Mask.FORWARD_RIGHT);

  capture = rotLeft(board.empty, 1) & (board.opponent & Mask.BACKWARD_LEFT);
  jumpers |= rotLeft(capture, 1) & (board.backward & Mask.BACKWARD_LEFT);

  capture = rotLeft(board.empty, 7) & (board.opponent & Mask.BACKWARD_RIGHT);
  jumpers |= rotLeft(capture, 7) & (board.backward & Mask.BACKWARD_RIGHT);

  return jumpers;
}

export function getMultipleJumpsFromOrigin(
  board: EnglishDraughtsBoardIntermediates,
  origin: number
) {
  const searchStack = getSingleJumpFromOrigin(board, origin);
  const moves: DraughtsEngineMove<number>[] = [];

  while (searchStack.length > 0) {
    const searchJump = searchStack.pop();
    if (!searchJump) break;

    const nextBoard = generateMoveIntermediates(board, {
      ...searchJump,
      origin,
    });

    const nextJumps = getSingleJumpFromOrigin(
      nextBoard,
      searchJump.destination
    );

    for (const nextJump of nextJumps) {
      searchStack.push({
        origin,
        destination: nextJump.destination,
        captures: searchJump.captures | nextJump.captures,
      });
    }

    if (nextJumps.length === 0) moves.push(searchJump);
  }

  return moves;
}

function getSingleJumpFromOrigin(
  board: EnglishDraughtsBoardIntermediates,
  origin: number
): DraughtsEngineMove<number>[] {
  const moves: DraughtsEngineMove<number>[] = [];

  if (origin & board.forward) {
    const c1 = rotLeft(origin & Mask.FORWARD_LEFT, 7) & board.opponent;
    // WARNING: Requires 0 fill shift to treat S[31] square as unsigned
    const d1 = (rotLeft(c1 & Mask.FORWARD_LEFT, 7) & board.empty) >>> 0;
    if (d1) {
      moves.push({ origin, destination: d1, captures: c1 });
    }

    const c2 = rotLeft(origin & Mask.FORWARD_RIGHT, 1) & board.opponent;
    // WARNING: Requires 0 fill shift to treat S[31] square as unsigned
    const d2 = (rotLeft(c2 & Mask.FORWARD_RIGHT, 1) & board.empty) >>> 0;
    if (d2) {
      moves.push({ origin, destination: d2, captures: c2 });
    }
  }

  if (origin & board.backward) {
    const c3 = rotRight(origin & Mask.BACKWARD_LEFT, 1) & board.opponent;
    const d3 = rotRight(c3 & Mask.BACKWARD_LEFT, 1) & board.empty;
    if (d3) {
      moves.push({ origin, destination: d3, captures: c3 });
    }

    const c4 = rotRight(origin & Mask.BACKWARD_RIGHT, 7) & board.opponent;
    const d4 = rotRight(c4 & Mask.BACKWARD_RIGHT, 7) & board.empty;
    if (d4) {
      moves.push({ origin, destination: d4, captures: c4 });
    }
  }

  return moves;
}

export function getMovers(board: EnglishDraughtsBoardIntermediates): number {
  let movers = 0;

  if (board.forward) {
    movers |= rotRight(board.empty, 7) & board.forward & Mask.FORWARD_LEFT;
    movers |= rotRight(board.empty, 1) & board.forward & Mask.FORWARD_RIGHT;
  }
  if (board.backward) {
    movers |= rotLeft(board.empty, 1) & board.backward & Mask.BACKWARD_LEFT;
    movers |= rotLeft(board.empty, 7) & board.backward & Mask.BACKWARD_RIGHT;
  }

  return movers;
}

export function getMovesFromOrigin(
  board: EnglishDraughtsBoardIntermediates,
  origin: number
): DraughtsEngineMove<number>[] {
  const moves: DraughtsEngineMove<number>[] = [];

  if (origin & board.forward) {
    const d1 = rotLeft(origin & Mask.FORWARD_LEFT, 7) & board.empty;
    if (d1) {
      moves.push({ origin, destination: d1, captures: 0 });
    }

    const d2 = rotLeft(origin & Mask.FORWARD_RIGHT, 1) & board.empty;
    if (d2) {
      moves.push({ origin, destination: d2, captures: 0 });
    }
  }

  if (origin & board.backward) {
    const d3 = rotRight(origin & Mask.BACKWARD_LEFT, 1) & board.empty;
    if (d3) {
      moves.push({ origin, destination: d3, captures: 0 });
    }

    const d4 = rotRight(origin & Mask.BACKWARD_RIGHT, 7) & board.empty;
    if (d4) {
      moves.push({ origin, destination: d4, captures: 0 });
    }
  }

  return moves;
}
