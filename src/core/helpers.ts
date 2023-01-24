import { Move } from './types';

export function getBitSplitArray(value: number): number[] {
  const split: number[] = [];

  for (let index = 0; index < 32; index++) {
    const bit = value & (1 << index);
    if (bit) split.push(bit);
  }

  return split;
}

export function getBitCount(value: number): number {
  let count = 0;

  for (let index = 0; index < 32; index++) {
    const bit = value & (1 << index);
    if (bit) count += 1;
  }

  return count;
}

export function formatBitToSquare(value: number): string {
  for (let index = 0; index < 32; index++) {
    const bit = value & (1 << index);
    if (bit) return `S[${index}]`;
  }

  return `-`;
}

export function formatBitToMultipleSquares(value: number): string {
  return getBitSplitArray(value)
    .map((s) => formatBitToSquare(s))
    .join(' | ');
}

export function formatMove(move: Move) {
  return {
    origin: formatBitToSquare(move.origin),
    destination: formatBitToSquare(move.destination),
    captures: formatBitToMultipleSquares(move.captures),
  };
}
