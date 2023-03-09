import { DraughtsEngineMove } from '../core/engine';

const BITS = 32;

const S: Record<number, number> = [];
S[0] = 1;
for (let index = 1; index < BITS; index++) {
  S[index] = S[index - 1] * 2;
}
export { S };

const BIT_MASK = 2 ** BITS - 1;

export function rotRight(value: number, r: number): number {
  const rotation = r & (BITS - 1);
  const applied =
    (value >>> rotation) | ((value << (BITS - rotation)) & BIT_MASK);
  return applied >>> 0;
}

export function rotLeft(value: number, r: number): number {
  const rotation = r & (BITS - 1);
  const applied =
    ((value << rotation) & BIT_MASK) | (value >>> (BITS - rotation));
  return applied >>> 0;
}

export function splitBits(value: number): number[] {
  const split: number[] = [];
  for (let index = 0; index < BITS; index++) {
    const bit = (value & (1 << index)) >>> 0;
    if (bit) split.push(bit);
  }
  return split;
}

export function equals(
  moveA: DraughtsEngineMove<number>,
  moveB: DraughtsEngineMove<number>
): boolean {
  return (
    moveA.origin === moveB.origin &&
    moveA.destination === moveB.destination &&
    moveA.captures === moveB.captures
  );
}

export function cardinality(value: number): number {
  let count = 0;
  for (let index = 0; index < 32; index++) {
    if (value & (1 << index)) count += 1;
  }
  return count;
}
