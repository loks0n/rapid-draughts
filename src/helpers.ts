import { Move } from "./types";

export function getBitSplitArray(v: number): number[] {
  let split: number[] = [];

  for (let i = 0; i < 32; i++) {
    const bit = v & (1 << i);
    if (bit) split.push(bit);
  }

  return split;
}

export function getBitCount(v: number): number {
  let count: number = 0;

  for (let i = 0; i < 32; i++) {
    const bit = v & (1 << i);
    if (bit) count += 1;
  }

  return count;
}

export function formatBitToSquare(v: number): string {
  for (let i = 0; i < 32; i++) {
    const bit = v & (1 << i);
    if (bit) return `S[${i}]`;
  }

  return `-`;
}

export function formatBitToMultipleSquares(v: number): string {
  return getBitSplitArray(v)
    .map((s) => formatBitToSquare(s))
    .join(" | ");
}

export function formatMove(move: Move) {
  return {
    origin: formatBitToSquare(move.origin),
    destination: formatBitToSquare(move.destination),
    captures: formatBitToMultipleSquares(move.captures),
  };
}
