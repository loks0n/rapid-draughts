import Long from 'long';

const BITS = 64;

const InternationalDraughtsBitSquare: Record<number, Long> = [];
InternationalDraughtsBitSquare[0] = Long.fromNumber(1);
for (let index = 1; index < BITS; index++) {
  InternationalDraughtsBitSquare[index] =
    InternationalDraughtsBitSquare[index - 1].shiftLeft(1);
}
export { InternationalDraughtsBitSquare };

export function bitwiseOr(...args: Long[]): Long {
  let acc = Long.fromNumber(0);
  for (const arg of args) {
    acc = acc.or(arg);
  }
  return acc;
}

export function rotRight(value: Long, bits: number): Long {
  return value.rotateRight(bits);
}

export function rotLeft(value: Long, bits: number): Long {
  return value.rotateLeft(bits);
}

