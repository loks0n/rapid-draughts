import { Bitboard } from '../bitwise/types';
import { DraughtsEngineMove, DraughtsPlayer } from './engine';
import { DraughtsBoard1D, DraughtsMove1D } from './game';

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

export function formatBoard(board: DraughtsBoard1D) {
  const boardSize = Math.floor(Math.sqrt(board.length));
  const div = '-'.repeat(1 + boardSize * 4);
  let str = `${div}\n`;

  for (const [ref, square] of board.entries()) {
    // is start of row
    if (ref % boardSize === 0) {
      str += `|`;
    }

    // output square
    if (square.piece) {
      let char = square.piece.player === DraughtsPlayer.LIGHT ? 'x' : 'o';
      char = square.piece.king ? char.toUpperCase() : char;
      str += ` ${char} |`;
    } else {
      str += '   |';
    }

    // is end of row
    if (ref % boardSize === boardSize - 1) {
      str += ` \n${div}\n`;
    }
  }

  return str;
}
