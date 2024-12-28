const BITS = 32;

const EnglishDraughtsBitSquare: Record<number, number> = [];
EnglishDraughtsBitSquare[0] = 1;
for (let index = 1; index < BITS; index++) {
  EnglishDraughtsBitSquare[index] = EnglishDraughtsBitSquare[index - 1] * 2;
}
export { EnglishDraughtsBitSquare };
