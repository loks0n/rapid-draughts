import { IBitwiseOps } from './types';

export const BitwiseNumber: IBitwiseOps<number> = {
  and(...args: number[]): number {
    return args.reduce((a, b) => a & b, 0xffffffff) >>> 0;
  },

  or(...args: number[]): number {
    return args.reduce((a, b) => a | b, 0) >>> 0;
  },

  xor(a: number, b: number): number {
    return (a ^ b) >>> 0;
  },

  not(a: number): number {
    return ~a >>> 0;
  },

  rotLeft(a: number, shift: number): number {
    const rotation = shift & 31;
    return ((a << rotation) | (a >>> (32 - rotation))) >>> 0;
  },

  rotRight(a: number, shift: number): number {
    const rotation = shift & 31;
    return ((a >>> rotation) | (a << (32 - rotation))) >>> 0;
  },

  cardinality(a: number): number {
    let n = a;
    n = n - ((n >>> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
    return (((n + (n >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
  },

  decompose(a: number): number[] {
    const result: number[] = [];
    let remaining = a;
    for (let bit = 1; remaining; bit <<= 1) {
      if (remaining & bit) {
        result.push(bit >>> 0);
        remaining ^= bit;
      }
    }
    return result;
  },
} as IBitwiseOps<number>;
