import { Bitboard, DraughtsEngineMove } from './engine';
import { DraughtsMove1D } from './game';

export function compareMove(
  moveA: DraughtsEngineMove<Bitboard>,
  moveB: DraughtsEngineMove<Bitboard>
): boolean {
  return (
    moveA.origin === moveB.origin &&
    moveA.destination === moveB.destination &&
    moveA.captures === moveB.captures
  );
}

export function compareCaptures1D(
  capturesA: number[],
  capturesB: number[]
): boolean {
  if (capturesA.length !== capturesB.length) {
    return false;
  }
  for (const [i, element] of capturesA.entries()) {
    if (element !== capturesB[i]) {
      return false;
    }
  }
  return true;
}

export function comparePartialMove1D(
  moveA: DraughtsMove1D,
  moveB: Partial<DraughtsMove1D>
): boolean {
  if (moveB.origin && moveA.origin !== moveB.origin) {
    return false;
  }
  if (moveB.destination && moveA.destination !== moveB.destination) {
    return false;
  }
  if (moveB.captures && !compareCaptures1D(moveA.captures, moveB.captures)) {
    return false;
  }
  return true;
}
