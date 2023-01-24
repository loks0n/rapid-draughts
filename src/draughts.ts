import {
  BLACK_START,
  KING_START,
  MASK_KING_BLACK,
  MASK_KING_WHITE,
  MASK_L3,
  MASK_L5,
  MASK_R3,
  MASK_R5,
  WHITE_START,
} from './bitboard';
import { getBitSplitArray } from './helpers';
import { Move, Player, Status } from './types';

export class Draughts {
  readonly white: number;
  readonly black: number;
  readonly king: number;

  readonly playerToMove: Player;

  private readonly noPieces: number;
  private readonly whiteKing: number;
  private readonly blackKing: number;

  private _moves: Move[] | undefined = undefined;

  constructor(
    white = WHITE_START,
    black = BLACK_START,
    king = KING_START,
    playerToMove: Player = Player.WHITE
  ) {
    this.white = white;
    this.black = black;
    this.king = king;

    this.playerToMove = playerToMove;

    this.noPieces = ~(this.white | this.black);
    this.whiteKing = this.white & this.king;
    this.blackKing = this.black & this.king;
  }

  move(move: Move): Draughts {
    let contains = false;

    for (const validMove of this.moves()) {
      if (
        validMove.captures === move.captures &&
        validMove.destination === move.destination &&
        validMove.origin === move.origin
      )
        contains = true;
    }

    if (!contains) {
      throw new Error('invalid move');
    }

    if (this.playerToMove === Player.WHITE) return this._moveWhite(move);
    return this._moveBlack(move);
  }

  moves(): Move[] {
    if (this._moves === undefined) {
      const jumpers = this._getJumpers();
      if (jumpers) return this._generateJumps(jumpers);

      const movers = this._getMovers();
      this._moves = this._generateMoves(movers);
    }
    return this._moves;
  }

  status(): Status {
    if (this.moves().length === 0) {
      return this.playerToMove === Player.WHITE
        ? Status.BLACK_WON
        : Status.WHITE_WON;
    }
    return Status.PLAYING;
  }

  private _moveWhite(move: Move): Draughts {
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

    return new Draughts(white, black, king, Player.BLACK);
  }

  private _moveBlack(move: Move): Draughts {
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

    return new Draughts(white, black, king, Player.WHITE);
  }

  private _generateMoves(movers: number): Move[] {
    const generated: Move[] = [];
    const moversSplit: number[] = getBitSplitArray(movers);

    for (const movers of moversSplit) {
      generated.push(...this._generateOriginMoves(movers));
    }
    return generated;
  }

  private _generateJumps(jumpers: number): Move[] {
    const generated: Move[] = [];
    const jumpersSplit: number[] = getBitSplitArray(jumpers);

    for (const jumper of jumpersSplit) {
      const jumpMoves = this._generateOriginJumps(jumper);
      generated.push(...jumpMoves);
    }
    return generated;
  }

  private _generateOriginMoves(origin: number): Move[] {
    if (this.playerToMove === Player.WHITE)
      return this._generateOriginMovesWhite(origin);
    return this._generateOriginMovesBlack(origin);
  }

  private _generateOriginMovesWhite(origin: number) {
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

  private _generateOriginMovesBlack(origin: number) {
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

  private _generateOriginJumps(origin: number): Move[] {
    const searchStack: Move[] =
      this.playerToMove === Player.WHITE
        ? this._generateOriginJumpWhite(origin)
        : this._generateOriginJumpBlack(origin);

    const jumpsStack: Move[] = [];

    while (searchStack.length > 0) {
      const jumpMove = searchStack.pop();
      if (!jumpMove) break;

      const nextJumpMoves =
        this.playerToMove === Player.WHITE
          ? this._generateOriginJumpWhite(
              jumpMove.destination,
              jumpMove.origin & this.king
            )
          : this._generateOriginJumpBlack(
              jumpMove.destination,
              jumpMove.origin & this.king
            );

      if (nextJumpMoves.length > 0) {
        searchStack.push(
          ...nextJumpMoves.map<Move>((nextJumpMove) => ({
            origin: jumpMove.origin,
            destination: nextJumpMove.destination,
            captures: nextJumpMove.captures | jumpMove.captures,
          }))
        );
      } else {
        jumpsStack.push(jumpMove);
      }
    }
    return jumpsStack;
  }

  private _generateOriginJumpWhite(
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

  private _generateOriginJumpBlack(
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

  private _getJumpers(): number {
    if (this.playerToMove === Player.WHITE) return this._getWhiteJumpers();
    return this._getBlackJumpers();
  }

  private _getBlackJumpers(): number {
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

  private _getWhiteJumpers(): number {
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

  private _getMovers(): number {
    if (this.playerToMove === Player.WHITE) return this._getWhiteMovers();
    return this._getBlackMovers();
  }

  private _getBlackMovers(): number {
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

  private _getWhiteMovers(): number {
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
}
