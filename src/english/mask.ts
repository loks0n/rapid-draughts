import { EnglishDraughtsBitSquare as S } from './utils';

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
 * Access the uint32 value of a square with S[n]
 *
 * A move forward to the left is a rotate left 7 bits.
 * A move forward to the right is a rotate left 1 bit.
 */

const RANK_0 = S[18] | S[12] | S[6] | S[0];
const RANK_1 = S[19] | S[13] | S[7] | S[1];
const RANK_2 = S[26] | S[20] | S[14] | S[8];
const RANK_3 = S[27] | S[21] | S[15] | S[9];
const RANK_4 = S[2] | S[28] | S[22] | S[16];
const RANK_5 = S[3] | S[29] | S[23] | S[17];
const RANK_6 = S[10] | S[4] | S[30] | S[24];
const RANK_7 = S[11] | S[5] | S[31] | S[25];

const BOARD =
  RANK_0 | RANK_1 | RANK_2 | RANK_3 | RANK_4 | RANK_5 | RANK_6 | RANK_7;

const FILE_0 = S[18] | S[26] | S[2] | S[10];
const FILE_7 = S[1] | S[9] | S[17] | S[25];

const FORWARD_LEFT = ~(RANK_7 | FILE_0);
const FORWARD_RIGHT = ~(RANK_7 | FILE_7);
const BACKWARD_LEFT = ~(RANK_0 | FILE_0);
const BACKWARD_RIGHT = ~(RANK_0 | FILE_7);

const LIGHT_START = RANK_0 | RANK_1 | RANK_2;
const DARK_START = RANK_5 | RANK_6 | RANK_7;

const MIDDLE_TWO_RANK_FOUR_FILE = S[21] | S[28] | S[22];
const MIDDLE_FOUR_RANK_TWO_FILE = S[29] | S[22] | S[21] | S[14];

const Mask = {
  BOARD,
  RANK_0,
  RANK_7,
  FORWARD_LEFT,
  FORWARD_RIGHT,
  BACKWARD_LEFT,
  BACKWARD_RIGHT,
  LIGHT_START,
  DARK_START,
  MIDDLE_FOUR_RANK_TWO_FILE,
  MIDDLE_TWO_RANK_FOUR_FILE,
};

export default Mask;
