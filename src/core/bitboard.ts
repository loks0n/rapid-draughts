/*
 *   Bitboard representation
 *   ----------------
 *     28  29  30  31
 *   24  25  26  27
 *     20  21  22  23
 *   16  17  18  19
 *     12  13  14  15
 *   08  09  10  11
 *     04  05  06  07
 *   00  01  02  03
 *   ----------------
 */

import { Move } from './types';

const S: Record<number, number> = [];
S[0] = 1;
for (let index = 1; index < 32; index++) {
  S[index] = S[index - 1] * 2;
}

export { S };

export const WHITE_START = 0b0000_0000_0000_0000_0000_1111_1111_1111;
export const BLACK_START = 0b1111_1111_1111_0000_0000_0000_0000_0000;
export const KING_START = 0b0000_0000_0000_0000_0000_0000_0000_0000;

export const MASK_L3 =
  S[1] |
  S[2] |
  S[3] |
  S[9] |
  S[10] |
  S[11] |
  S[17] |
  S[18] |
  S[19] |
  S[25] |
  S[26] |
  S[27];

export const MASK_L5 =
  S[4] | S[5] | S[6] | S[12] | S[13] | S[14] | S[20] | S[21] | S[22];

export const MASK_R3 =
  S[28] |
  S[29] |
  S[30] |
  S[20] |
  S[21] |
  S[22] |
  S[12] |
  S[13] |
  S[14] |
  S[4] |
  S[5] |
  S[6];

export const MASK_R5 =
  S[25] | S[26] | S[27] | S[17] | S[18] | S[19] | S[9] | S[10] | S[11];

export const MASK_KING_WHITE = S[28] | S[29] | S[30] | S[31];

export const MASK_KING_BLACK = S[0] | S[1] | S[2] | S[3];

export class DraughtsBitboard {
  readonly white: number;
  readonly black: number;
  readonly king: number;

  private readonly noPieces: number;
  private readonly whiteKing: number;
  private readonly blackKing: number;

  constructor(white = WHITE_START, black = BLACK_START, king = KING_START) {
    this.white = white;
    this.black = black;
    this.king = king;

    this.noPieces = ~(this.white | this.black);
    this.whiteKing = this.white & this.king;
    this.blackKing = this.black & this.king;
  }

  moveWhite(move: Move): DraughtsBitboard {
    // Remove origin piece from white and kings
    const isKing = move.origin & this.king;
    let white = this.white ^ move.origin;
    let king = this.king ^ isKing;

    // Remove captures from black and kings
    const black = this.black ^ move.captures;
    king ^= move.captures & this.king;

    // Place destination piece in white and kings
    white |= move.destination;
    king |= isKing ? move.destination : move.destination & MASK_KING_WHITE;

    return new DraughtsBitboard(white, black, king);
  }

  moveBlack(move: Move): DraughtsBitboard {
    // Remove origin piece from black and kings
    const isKing = move.origin & this.king;
    let black = this.black ^ move.origin;
    let king = this.king ^ isKing;

    // Remove captures from white and kings
    const white = this.white ^ move.captures;
    king ^= move.captures & this.king;

    // Place destination piece in black and kings
    black |= move.destination;
    king |= isKing ? move.destination : move.destination & MASK_KING_BLACK;

    return new DraughtsBitboard(white, black, king);
  }

  getBlackMovers(): number {
    let movers = (this.noPieces << 4) & this.black;
    movers |= ((this.noPieces & MASK_L3) << 3) & this.black;
    movers |= ((this.noPieces & MASK_L5) << 3) & this.black;

    if (this.blackKing) {
      movers |= (this.noPieces >> 4) & this.blackKing;
      movers |= ((this.noPieces & MASK_R3) >> 3) & this.blackKing;
      movers |= ((this.noPieces & MASK_R5) >> 5) & this.blackKing;
    }

    return movers;
  }

  getWhiteMovers(): number {
    let movers = (this.noPieces >> 4) & this.white;
    movers |= ((this.noPieces & MASK_R3) >> 3) & this.white;
    movers |= ((this.noPieces & MASK_R5) >> 5) & this.white;

    if (this.whiteKing) {
      movers |= (this.noPieces << 4) & this.whiteKing;
      movers |= ((this.noPieces & MASK_L3) << 3) & this.whiteKing;
      movers |= ((this.noPieces & MASK_L5) << 3) & this.whiteKing;
    }

    return movers;
  }

  generateOriginMovesWhite(origin: number) {
    const moves: Move[] = [];
    const captures = 0;

    const d1 = (origin << 4) & this.noPieces;
    if (d1) moves.push({ origin, destination: d1, captures });

    const d2 = ((origin & MASK_L3) << 3) & this.noPieces;
    if (d2) moves.push({ origin, destination: d2, captures });

    const d3 = ((origin & MASK_L5) << 5) & this.noPieces;
    if (d3) moves.push({ origin, destination: d3, captures });

    if (origin & this.whiteKing) {
      const d4 = (origin >> 4) & this.noPieces;
      if (d4) moves.push({ origin, destination: d4, captures });

      const d5 = ((origin & MASK_R3) >> 3) & this.noPieces;
      if (d5) moves.push({ origin, destination: d5, captures });

      const d6 = ((origin & MASK_R5) >> 5) & this.noPieces;
      if (d6) moves.push({ origin, destination: d6, captures });
    }

    return moves;
  }

  generateOriginMovesBlack(origin: number) {
    const moves: Move[] = [];
    const captures = 0;

    const d1 = (origin >> 4) & this.noPieces;
    if (d1) moves.push({ origin, destination: d1, captures });

    const d2 = ((origin & MASK_R3) >> 3) & this.noPieces;
    if (d2) moves.push({ origin, destination: d2, captures });

    const d3 = ((origin & MASK_R5) >> 5) & this.noPieces;
    if (d3) moves.push({ origin, destination: d3, captures });

    if (origin & this.blackKing) {
      const d4 = (origin << 4) & this.noPieces;
      if (d4) moves.push({ origin, destination: d4, captures });

      const d5 = ((origin & MASK_L3) << 3) & this.noPieces;
      if (d5) moves.push({ origin, destination: d5, captures });

      const d6 = ((origin & MASK_L5) << 5) & this.noPieces;
      if (d6) moves.push({ origin, destination: d6, captures });
    }

    return moves;
  }

  getBlackJumpers(): number {
    let movers = 0;
    let temporary = (this.noPieces << 4) & this.white;

    if (temporary) {
      movers |=
        (((temporary & MASK_L3) << 3) | ((temporary & MASK_L5) << 5)) &
        this.black;
    }

    temporary =
      (((this.noPieces & MASK_L3) << 3) | ((this.noPieces & MASK_L5) << 5)) &
      this.white;
    movers |= (temporary << 4) & this.black;

    if (this.blackKing) {
      temporary = (this.noPieces >> 4) & this.white;

      if (temporary) {
        movers |=
          (((temporary & MASK_R3) >> 3) | ((temporary & MASK_R5) >> 5)) &
          this.blackKing;
      }

      temporary =
        (((this.noPieces & MASK_R3) >> 3) | ((this.noPieces & MASK_R5) >> 5)) &
        this.white;
      if (temporary) movers |= (temporary >> 4) & this.blackKing;
    }

    return movers;
  }

  getWhiteJumpers(): number {
    let movers = 0;
    let temporary = (this.noPieces >> 4) & this.black;

    if (temporary) {
      movers |=
        (((temporary & MASK_R3) >> 3) | ((temporary & MASK_R5) >> 5)) &
        this.white;
    }

    temporary =
      (((this.noPieces & MASK_R3) >> 3) | ((this.noPieces & MASK_R5) >> 5)) &
      this.black;
    movers |= (temporary >> 4) & this.white;

    if (this.whiteKing) {
      temporary = (this.noPieces << 4) & this.black;

      if (temporary) {
        movers |=
          (((temporary & MASK_L3) << 3) | ((temporary & MASK_L5) << 5)) &
          this.whiteKing;
      }

      temporary =
        (((this.noPieces & MASK_L3) << 3) | ((this.noPieces & MASK_L5) << 5)) &
        this.black;
      if (temporary) movers |= (temporary << 4) & this.whiteKing;
    }

    return movers;
  }

  generateOriginJumpWhite(
    origin: number,
    king = origin & this.whiteKing
  ): Move[] {
    const moves: Move[] = [];

    const c1 = (origin << 4) & this.black;
    const d1 = (((c1 & MASK_L3) << 3) | ((c1 & MASK_L5) << 5)) & this.noPieces;
    if (d1) {
      moves.push({ origin, destination: d1, captures: c1 });
    }

    const c2 =
      (((origin & MASK_L3) << 3) | ((origin & MASK_L5) << 5)) & this.black;
    const d2 = (c2 << 4) & this.noPieces;
    if (d2) {
      moves.push({ origin, destination: d2, captures: c2 });
    }

    if (king) {
      const c1 = (origin >> 4) & this.black;
      const d1 =
        (((c1 & MASK_R3) >> 3) | ((c1 & MASK_R5) >> 5)) & this.noPieces;
      if (d1) {
        moves.push({ origin, destination: d1, captures: c1 });
      }

      const c2 =
        (((origin & MASK_R3) >> 3) | ((origin & MASK_R5) >> 5)) & this.black;
      const d2 = (c2 >> 4) & this.noPieces;
      if (d2) {
        moves.push({ origin, destination: d2, captures: c2 });
      }
    }

    return moves;
  }

  generateOriginJumpBlack(
    origin: number,
    king = origin & this.blackKing
  ): Move[] {
    const moves: Move[] = [];

    const c1 = (origin >> 4) & this.white;
    const d1 = (((c1 & MASK_R3) >> 3) | ((c1 & MASK_R5) >> 5)) & this.noPieces;
    if (d1) {
      moves.push({ origin, destination: d1, captures: c1 });
    }

    const c2 =
      (((origin & MASK_R3) >> 3) | ((origin & MASK_R5) >> 5)) & this.white;
    const d2 = (c2 >> 4) & this.noPieces;
    if (d2) {
      moves.push({ origin, destination: d2, captures: c2 });
    }

    if (king) {
      const c1 = (origin << 4) & this.white;
      const d1 =
        (((c1 & MASK_L3) << 3) | ((c1 & MASK_L5) << 5)) & this.noPieces;
      if (d1) {
        moves.push({ origin, destination: d1, captures: c1 });
      }

      const c2 =
        (((origin & MASK_L3) << 3) | ((origin & MASK_L5) << 5)) & this.white;
      const d2 = (c2 << 4) & this.noPieces;
      if (d2) {
        moves.push({ origin, destination: d2, captures: c2 });
      }
    }

    return moves;
  }
}
