const BITS = 32;

const S: Record<number, number> = [];
S[0] = 1;
for (let index = 1; index < BITS; index++) {
  S[index] = S[index - 1] * 2;
}
export { S };

const BIT_MASK = 0xff_ff_ff_ff;

export function rotRight(value: number, r: number): number {
  const rotation = r % BITS;
  const applied =
    (value >>> rotation) | ((value << (BITS - rotation)) & BIT_MASK);
  return applied >>> 0;
}

export function rotLeft(value: number, r: number): number {
  const rotation = r % BITS;
  const applied =
    ((value << rotation) & BIT_MASK) | (value >>> (BITS - rotation));
  return applied >>> 0;
}

export function decomposeBits(value: number): number[] {
  const split: number[] = [];
  for (let bit = 1; value; bit <<= 1) {
    if (value & bit) {
      split.push(bit);
      value ^= bit;
    }
  }
  return split;
}

export function cardinality(num: number): number {
  num = num - ((num >>> 1) & 0x55_55_55_55);
  num = (num & 0x33_33_33_33) + ((num >>> 2) & 0x33_33_33_33);
  num = (((num + (num >>> 4)) & 0x0f_0f_0f_0f) * 0x01_01_01_01) >>> 24;
  return num;
}
