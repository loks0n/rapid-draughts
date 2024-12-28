import { describe, expect, it } from 'vitest';
import { BitwiseLong, BitwiseLongAlloc, LongUtils } from './long';
import { Long } from './types';

describe('BitwiseLong and BitwiseLongAlloc', () => {
  const implementations = [BitwiseLong, BitwiseLongAlloc];
  const createLong = (low: number, high: number): Long =>
    new Uint32Array([low, high]);

  implementations.forEach((implementation) => {
    const name =
      implementation === BitwiseLong ? 'BitwiseLong' : 'BitwiseLongAlloc';

    describe(name, () => {
      describe('and', () => {
        it('performs bitwise AND operation', () => {
          const a = createLong(0b1010, 0b1100);
          const b = createLong(0b1100, 0b1010);
          const result = implementation.and(a, b);
          expect(Array.from(result)).toEqual([0b1000, 0b1000]);
        });
      });

      describe('or', () => {
        it('performs bitwise OR operation', () => {
          const a = createLong(0b1010, 0b1100);
          const b = createLong(0b1100, 0b1010);
          const result = implementation.or(a, b);
          expect(Array.from(result)).toEqual([0b1110, 0b1110]);
        });
      });

      describe('xor', () => {
        it('performs bitwise XOR operation', () => {
          const a = createLong(0b1010, 0b1100);
          const b = createLong(0b1100, 0b1010);
          const result = implementation.xor(a, b);
          expect(Array.from(result)).toEqual([0b0110, 0b0110]);
        });
      });

      describe('not', () => {
        it('performs bitwise NOT operation', () => {
          const a = createLong(0b1010, 0b1100);
          const result = implementation.not(a);
          expect(Array.from(result)).toEqual([0xfffffff5, 0xfffffff3]);
        });
      });

      describe('rotLeft', () => {
        it('rotates bits left within 32-bit boundary', () => {
          const a = createLong(0b1, 0);
          const result = implementation.rotLeft(a, 1);
          expect(Array.from(result)).toEqual([0b10, 0]);
        });

        it('rotates bits left across 32-bit boundary', () => {
          const a = createLong(0x80000000, 0);
          const result = implementation.rotLeft(a, 1);
          expect(Array.from(result)).toEqual([0, 1]);
        });

        it('handles rotation greater than 63 bits', () => {
          const a = createLong(0b1, 0);
          const result = implementation.rotLeft(a, 65);
          expect(Array.from(result)).toEqual([0b10, 0]);
        });
      });

      describe('rotRight', () => {
        it('rotates bits right within 32-bit boundary', () => {
          const a = createLong(0b10, 0);
          const result = implementation.rotRight(a, 1);
          expect(Array.from(result)).toEqual([0b1, 0]);
        });

        it('rotates bits right across 32-bit boundary', () => {
          const a = createLong(0, 1);
          const result = implementation.rotRight(a, 1);
          expect(Array.from(result)).toEqual([0x80000000, 0]);
        });

        it('handles rotation greater than 63 bits', () => {
          const a = createLong(0b10, 0);
          const result = implementation.rotRight(a, 65);
          expect(Array.from(result)).toEqual([0b1, 0]);
        });
      });

      describe('cardinality', () => {
        it('counts number of set bits', () => {
          const a = createLong(0b1010, 0b1100);
          expect(implementation.cardinality(a)).toBe(4);
        });
      });

      describe('decompose', () => {
        it('decomposes long into powers of 2', () => {
          const a = createLong(0b1010, 0b1100);
          const result = implementation.decompose(a);
          expect(result.length).toBe(4);
          expect(result.map((x) => Array.from(x))).toEqual([
            [2, 0],
            [8, 0],
            [0, 4],
            [0, 8],
          ]);
        });
      });
    });
  });
});

describe('LongUtils', () => {
  describe('create', () => {
    it('creates a Long with specified low and high values', () => {
      const result = LongUtils.create(0x12345678, 0x90abcdef);
      expect(Array.from(result)).toEqual([0x12345678, 0x90abcdef]);
    });

    it('handles values outside 32-bit range', () => {
      const result = LongUtils.create(0x100000000, 0x100000000);
      expect(Array.from(result)).toEqual([0, 0]);
    });
  });

  describe('createAlloc', () => {
    it('creates a new Long with specified low and high values', () => {
      const result = LongUtils.createAlloc(0x12345678, 0x90abcdef);
      expect(Array.from(result)).toEqual([0x12345678, 0x90abcdef]);
    });

    it('handles values outside 32-bit range', () => {
      const result = LongUtils.createAlloc(0x100000000, 0x100000000);
      expect(Array.from(result)).toEqual([0, 0]);
    });
  });
});
