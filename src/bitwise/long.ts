import { IBitwiseOps, Long } from './types';
import { BitwiseNumber } from './number';

export const BitwiseLongAlloc: IBitwiseOps<Long> = {
  and(...args: Long[]): Long {
    return new Uint32Array(
      args.reduce(
        (a, b) => [a[0] & b[0], a[1] & b[1]],
        [0xffffffff, 0xffffffff]
      )
    );
  },

  or(...args: Long[]): Long {
    return new Uint32Array(
      args.reduce((a, b) => [a[0] | b[0], a[1] | b[1]], [0, 0])
    );
  },

  xor(a: Long, b: Long): Long {
    return new Uint32Array([a[0] ^ b[0], a[1] ^ b[1]]);
  },

  not(a: Long): Long {
    return new Uint32Array([~a[0] >>> 0, ~a[1] >>> 0]);
  },

  rotLeft(a: Long, shift: number): Long {
    const rotation = shift & 63;
    if (rotation === 0) {
      return new Uint32Array(a);
    }

    if (rotation < 32) {
      const lowToHigh = a[0] >>> (32 - rotation);
      const highToLow = a[1] >>> (32 - rotation);
      return new Uint32Array([
        ((a[0] << rotation) | highToLow) >>> 0,
        ((a[1] << rotation) | lowToHigh) >>> 0,
      ]);
    }

    const actualRotation = rotation - 32;
    const lowToHigh = a[0] << actualRotation;
    const highToLow = a[1] << actualRotation;
    return new Uint32Array([
      ((a[1] >>> (32 - actualRotation)) | highToLow) >>> 0,
      ((a[0] >>> (32 - actualRotation)) | lowToHigh) >>> 0,
    ]);
  },

  rotRight(a: Long, shift: number): Long {
    const rotation = shift & 63;
    if (rotation === 0) {
      return new Uint32Array(a);
    }

    if (rotation < 32) {
      const lowToHigh = a[0] << (32 - rotation);
      const highToLow = a[1] << (32 - rotation);
      return new Uint32Array([
        ((a[0] >>> rotation) | highToLow) >>> 0,
        ((a[1] >>> rotation) | lowToHigh) >>> 0,
      ]);
    }

    const actualRotation = rotation - 32;
    return new Uint32Array([
      (a[1] >>> actualRotation) >>> 0,
      (a[0] >>> actualRotation) >>> 0,
    ]);
  },

  cardinality(a: Long): number {
    return BitwiseNumber.cardinality(a[0]) + BitwiseNumber.cardinality(a[1]);
  },

  decompose(a: Long): Long[] {
    const result: Long[] = [];
    let remainingLow = a[0];
    let remainingHigh = a[1];

    for (let bit = 1; remainingLow; bit <<= 1) {
      if (remainingLow & bit) {
        result.push(new Uint32Array([bit, 0]));
        remainingLow ^= bit;
      }
    }

    for (let bit = 1; remainingHigh; bit <<= 1) {
      if (remainingHigh & bit) {
        result.push(new Uint32Array([0, bit]));
        remainingHigh ^= bit;
      }
    }

    return result;
  },
} as IBitwiseOps<Long>;

const TEMP_AND = new Uint32Array(2);
const TEMP_OR = new Uint32Array(2);
const TEMP_XOR = new Uint32Array(2);
const TEMP_NOT = new Uint32Array(2);
const TEMP_ROT_LEFT = new Uint32Array(2);
const TEMP_ROT_RIGHT = new Uint32Array(2);

export const BitwiseLong: IBitwiseOps<Long> = {
  and(...args: Long[]): Long {
    TEMP_AND[0] = args.reduce((a, b) => a & b[0], 0xffffffff);
    TEMP_AND[1] = args.reduce((a, b) => a & b[1], 0xffffffff);
    return TEMP_AND;
  },

  or(...args: Long[]): Long {
    TEMP_OR[0] = args.reduce((a, b) => a | b[0], 0);
    TEMP_OR[1] = args.reduce((a, b) => a | b[1], 0);
    return TEMP_OR;
  },

  xor(a: Long, b: Long): Long {
    TEMP_XOR[0] = a[0] ^ b[0];
    TEMP_XOR[1] = a[1] ^ b[1];
    return TEMP_XOR;
  },

  not(a: Long): Long {
    TEMP_NOT[0] = ~a[0] >>> 0;
    TEMP_NOT[1] = ~a[1] >>> 0;
    return TEMP_NOT;
  },

  rotLeft(a: Long, shift: number): Long {
    const rotation = shift & 63;
    if (rotation === 0) {
      TEMP_ROT_LEFT.set(a);
      return TEMP_ROT_LEFT;
    }

    if (rotation < 32) {
      const lowToHigh = a[0] >>> (32 - rotation);
      const highToLow = a[1] >>> (32 - rotation);
      TEMP_ROT_LEFT[0] = ((a[0] << rotation) | highToLow) >>> 0;
      TEMP_ROT_LEFT[1] = ((a[1] << rotation) | lowToHigh) >>> 0;
      return TEMP_ROT_LEFT;
    }

    const actualRotation = rotation - 32;
    const lowToHigh = a[0] << actualRotation;
    const highToLow = a[1] << actualRotation;
    TEMP_ROT_LEFT[0] = ((a[1] >>> (32 - actualRotation)) | highToLow) >>> 0;
    TEMP_ROT_LEFT[1] = ((a[0] >>> (32 - actualRotation)) | lowToHigh) >>> 0;
    return TEMP_ROT_LEFT;
  },

  rotRight(a: Long, shift: number): Long {
    const rotation = shift & 63;
    if (rotation === 0) {
      TEMP_ROT_RIGHT.set(a);
      return TEMP_ROT_RIGHT;
    }

    if (rotation < 32) {
      const lowToHigh = a[0] << (32 - rotation);
      const highToLow = a[1] << (32 - rotation);
      TEMP_ROT_RIGHT[0] = ((a[0] >>> rotation) | highToLow) >>> 0;
      TEMP_ROT_RIGHT[1] = ((a[1] >>> rotation) | lowToHigh) >>> 0;
      return TEMP_ROT_RIGHT;
    }

    const actualRotation = rotation - 32;
    TEMP_ROT_RIGHT[0] = (a[1] >>> actualRotation) >>> 0;
    TEMP_ROT_RIGHT[1] = (a[0] >>> actualRotation) >>> 0;
    return TEMP_ROT_RIGHT;
  },

  cardinality(a: Long): number {
    return BitwiseLongAlloc.cardinality(a);
  },

  decompose(a: Long): Long[] {
    return BitwiseLongAlloc.decompose(a);
  },
} as IBitwiseOps<Long>;

const TEMP_CREATE = new Uint32Array(2);

export const LongUtils = {
  createAlloc(low: number, high: number): Long {
    return new Uint32Array([low >>> 0, high >>> 0]);
  },

  create(low: number, high: number): Long {
    TEMP_CREATE[0] = low >>> 0;
    TEMP_CREATE[1] = high >>> 0;
    return TEMP_CREATE;
  },
};
