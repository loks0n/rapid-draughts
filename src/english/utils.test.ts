import { describe, expect, it } from 'vitest';
import { cardinality, rotLeft, rotRight, decomposeBits } from './utils';

describe('rotRight', () => {
  it('should rotate bits to the right', () => {
    expect(rotRight(0b1001, 1)).toBe(0b1000_0000_0000_0000_0000_0000_0000_0100);
    expect(rotRight(0b1001, 31)).toBe(0b1_0010);
  });

  it('should handle 0 rotation', () => {
    expect(rotRight(0b1001, 0)).toBe(0b1001);
  });
});

describe('rotLeft', () => {
  it('should rotate bits to the left', () => {
    expect(rotLeft(0b1001, 1)).toBe(0b1_0010);
    expect(rotLeft(0b1001, 31)).toBe(0b1000_0000_0000_0000_0000_0000_0000_0100);
  });

  it('should handle 0 rotation', () => {
    expect(rotLeft(0b1001, 0)).toBe(0b1001);
  });
});

describe('decomposeBits', () => {
  it('should decompose a number into its constituent bits', () => {
    expect(decomposeBits(0b1011)).toEqual([1, 2, 8]);
    expect(decomposeBits(0b1100)).toEqual([4, 8]);
    expect(decomposeBits(0)).toEqual([]);
  });
});

describe('cardinality', () => {
  it('should return the number of set bits in the binary representation of a number', () => {
    expect(cardinality(0b1011)).toBe(3);
    expect(cardinality(0b1100)).toBe(2);
    expect(cardinality(0)).toBe(0);
  });
});
