import { Move } from "./draughts";

/*
 *   Bitboard representation
 *   ----------------
 *     28  29  30  31
 *   24  25  26  27
 *     20  21  22  23
 *   16  17  18  19
 *     12  13  14  15
 *   08  09  10  11
 *     04  05  06  07
 *   00  01  02  03
 *   ----------------
 */

let S: Record<number, number> = [];
S[0] = 1;
for (let i = 1; i < 32; i++) {
  S[i] = S[i - 1] * 2;
}

export { S };

export function splitBits(v: number): number[] {
  let split: number[] = [];

  for (let i = 0; i < 32; i++) {
    const bit = v & (1 << i);
    if (bit) split.push(bit);
  }

  return split;
}

export function squareBit(v: number): string {
  for (let i = 0; i < 32; i++) {
    const bit = v & (1 << i);
    if (bit) return `S[${i}]`;
  }

  return `-`;
}

export function splitAndSquares(v: number): string {
  return splitBits(v)
    .map((s) => squareBit(s))
    .join(" | ");
}

export function countBits(v: number): number {
  let count: number = 0;

  for (let i = 0; i < 32; i++) {
    const bit = v & (1 << i);
    if (bit) count += 1;
  }

  return count;
}

export function moveToSquares(move: Move) {
  return {
    origin: splitAndSquares(move.origin),
    destination: splitAndSquares(move.destination),
    captures: splitAndSquares(move.captures),
  };
}

export const MASK_L3 =
  S[1] |
  S[2] |
  S[3] |
  S[9] |
  S[10] |
  S[11] |
  S[17] |
  S[18] |
  S[19] |
  S[25] |
  S[26] |
  S[27];

export const MASK_L5 =
  S[4] | S[5] | S[6] | S[12] | S[13] | S[14] | S[20] | S[21] | S[22];

export const MASK_R3 =
  S[28] |
  S[29] |
  S[30] |
  S[20] |
  S[21] |
  S[22] |
  S[12] |
  S[13] |
  S[14] |
  S[4] |
  S[5] |
  S[6];

export const MASK_R5 =
  S[25] | S[26] | S[27] | S[17] | S[18] | S[19] | S[9] | S[10] | S[11];

export const MASK_KING_WHITE = S[28] | S[29] | S[30] | S[31];

export const MASK_KING_BLACK = S[0] | S[1] | S[2] | S[3];
