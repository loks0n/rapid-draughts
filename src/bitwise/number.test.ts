import { describe, it, expect } from 'vitest';
import { BitwiseNumber } from './number';

describe('BitwiseNumber', () => {
  describe('and', () => {
    it('performs bitwise AND operation', () => {
      expect(BitwiseNumber.and(0b1010, 0b1100)).toBe(0b1000);
      expect(BitwiseNumber.and(0xffffffff, 0xffffffff)).toBe(0xffffffff);
      expect(BitwiseNumber.and(0, 0xffffffff)).toBe(0);
    });
  });

  describe('or', () => {
    it('performs bitwise OR operation', () => {
      expect(BitwiseNumber.or(0b1010, 0b1100)).toBe(0b1110);
      expect(BitwiseNumber.or(0, 0xffffffff)).toBe(0xffffffff);
      expect(BitwiseNumber.or(0, 0)).toBe(0);
    });
  });

  describe('xor', () => {
    it('performs bitwise XOR operation', () => {
      expect(BitwiseNumber.xor(0b1010, 0b1100)).toBe(0b0110);
      expect(BitwiseNumber.xor(0xffffffff, 0xffffffff)).toBe(0);
      expect(BitwiseNumber.xor(0, 0xffffffff)).toBe(0xffffffff);
    });
  });

  describe('not', () => {
    it('performs bitwise NOT operation', () => {
      expect(BitwiseNumber.not(0)).toBe(0xffffffff);
      expect(BitwiseNumber.not(0xffffffff)).toBe(0);
      expect(BitwiseNumber.not(0b1010)).toBe(0xfffffff5);
    });
  });

  describe('rotLeft', () => {
    it('rotates bits left', () => {
      expect(BitwiseNumber.rotLeft(0b1, 1)).toBe(0b10);
      expect(BitwiseNumber.rotLeft(0b1, 31)).toBe(0x80000000);
      expect(BitwiseNumber.rotLeft(0b1, 32)).toBe(0b1);
    });

    it('handles rotation greater than 31 bits', () => {
      expect(BitwiseNumber.rotLeft(0b1, 33)).toBe(0b10);
    });
  });

  describe('rotRight', () => {
    it('rotates bits right', () => {
      expect(BitwiseNumber.rotRight(0b10, 1)).toBe(0b1);
      expect(BitwiseNumber.rotRight(0x80000000, 31)).toBe(0b1);
      expect(BitwiseNumber.rotRight(0b1, 32)).toBe(0b1);
    });

    it('handles rotation greater than 31 bits', () => {
      expect(BitwiseNumber.rotRight(0b10, 33)).toBe(0b1);
    });
  });

  describe('cardinality', () => {
    it('counts number of set bits', () => {
      expect(BitwiseNumber.cardinality(0)).toBe(0);
      expect(BitwiseNumber.cardinality(0xffffffff)).toBe(32);
      expect(BitwiseNumber.cardinality(0b1010)).toBe(2);
    });
  });

  describe('decompose', () => {
    it('decomposes number into powers of 2', () => {
      expect(BitwiseNumber.decompose(0)).toEqual([]);
      expect(BitwiseNumber.decompose(0b1010)).toEqual([2, 8]);
      expect(BitwiseNumber.decompose(7)).toEqual([1, 2, 4]);
    });
  });
});
