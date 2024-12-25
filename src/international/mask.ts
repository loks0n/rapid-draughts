import {
  InternationalDraughtsBitSquare as S,
  bitwiseOr as or,
} from './utils';

/* We use the following bitboard layout for International Draughts
 *
 * [57][58][59][60][61][62]
 * [63]  00, 01, 02, 03, 04,
 *     05, 06, 07, 08, 09, [10]
 * [10]  11, 12, 13, 14, 15,
 *     16, 17, 18, 19, 20, [21]
 * [21]  22, 23, 24, 25, 26,
 *     27, 28, 29, 30, 31, [32]
 * [32]  33, 34, 35, 36, 37,
 *     38, 39, 40, 41, 42, [43]
 * [43]  44, 45, 46, 47, 48,
 *     49, 50, 51, 52, 53, [54]
 * [55][56][57][58][59][60]
 *
 * Access the uint32 value of a square with S[n]
 *
 * Squares encased in brackets, such as [57], are invalid.
 * A move forward to the left is a rotate right 6 bits.
 * A move forward to the right is a rotate right 5 bit.
 */

const RANK_9 = or(S[0], S[1], S[2], S[3], S[4]);
const RANK_8 = or(S[5], S[6], S[7], S[8], S[9]);
const RANK_7 = or(S[12], S[13], S[14], S[15], S[16]);
const RANK_6 = or(S[17], S[18], S[19], S[20], S[21]);
const RANK_5 = or(S[22], S[23], S[24], S[25], S[26]);
const RANK_4 = or(S[27], S[28], S[29], S[30], S[31]);
const RANK_3 = or(S[36], S[37], S[38], S[39], S[40]);
const RANK_2 = or(S[41], S[42], S[43], S[44], S[45]);
const RANK_1 = or(S[48], S[49], S[50], S[51], S[52]);
const RANK_0 = or(S[53], S[54], S[55], S[56], S[57]);

const BOARD = or(
  RANK_9,
  RANK_8,
  RANK_7,
  RANK_6,
  RANK_5,
  RANK_4,
  RANK_3,
  RANK_2,
  RANK_1,
  RANK_0
);

const DARK_START = or(RANK_0, RANK_1, RANK_2, RANK_3);
const LIGHT_START = or(RANK_6, RANK_7, RANK_8, RANK_9);

const Mask = {
  BOARD,
  LIGHT_START,
  DARK_START,
};

export default Mask;
