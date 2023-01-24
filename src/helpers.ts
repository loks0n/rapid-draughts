import { Move } from './types';

/**
 * @param {number} value A 32 bit unsigned int
 * @returns {number[]} An array of numbers each with a single bit active e.g. [1, 2, 4]
 */
export function getBitSplitArray(value: number): number[] {
  const split: number[] = [];

  for (let index = 0; index < 32; index++) {
    const bit = value & (1 << index);
    if (bit) split.push(bit);
  }

  return split;
}

/**
 * @param {number} value A 32 bit unsigned int
 * @returns {number} Returns square location as string e.g. S[1]
 */
export function getBitCount(value: number): number {
  let count = 0;

  for (let index = 0; index < 32; index++) {
    const bit = value & (1 << index);
    if (bit) count += 1;
  }

  return count;
}

/**
 * @param {number} value A 32 bit number will a single active bit
 * @returns {string} Returns square location as string e.g. S[1]
 */
export function formatBitToSquare(value: number): string {
  for (let index = 0; index < 32; index++) {
    const bit = value & (1 << index);
    if (bit) return `S[${index}]`;
  }

  return `-`;
}

/**
 * @param {number} value A 32 bit unsigned int
 * @returns {number[]} A string with each of the corresponding squares e.g. 'S[1] | S[4]'
 */
export function formatBitToMultipleSquares(value: number): string {
  return getBitSplitArray(value)
    .map((s) => formatBitToSquare(s))
    .join(' | ');
}

/**
 * @param {Move} move The move object to be formatted
 * @returns {{origin: string, destination: string, captures: string}}
 * A move object will each key formatted to the corresponding square e.g. 'S[1] | S[4]'
 */
export function formatMove(move: Move) {
  return {
    origin: formatBitToSquare(move.origin),
    destination: formatBitToSquare(move.destination),
    captures: formatBitToMultipleSquares(move.captures),
  };
}
