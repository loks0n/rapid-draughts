import Long from 'long';

const BITS = 32;

const S: Record<number, number> = [];
S[0] = 1;
for (let index = 1; index < BITS; index++) {
  S[index] = S[index - 1] * 2;
}

export { S };

/* We use the following bitboard layout for English Draughts
 *
 *   11  05  31  25
 * 10  04  30  24
 *   03  29  23  17
 * 02  28  22  16
 *   27  21  15  09
 * 26  20  14  08
 *   19  13  07  01
 * 18  12  06  00
 *
 * Access the value of a square with S[n]
 *
 * A move forward to the left is a rotate left 7 bits.
 * A move forward to the right is a rotate left 1 bit.
 */

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

export function cardinality(value: number | Long): number {
  if (typeof value !== 'number') {
    return (
      cardinality(value.getHighBitsUnsigned()) +
      cardinality(value.getLowBitsUnsigned())
    );
  }

  let count = 0;
  for (let index = 0; index < BITS; index++) {
    if (value & (1 << index)) count += 1;
  }
  return count;
}
