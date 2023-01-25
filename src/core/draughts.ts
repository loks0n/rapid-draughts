import { DraughtsBitboard } from './bitboard';
import { getBitSplitArray } from './helpers';
import { Move, Player, Status } from './types';

export class Draughts {
  readonly bitboard: DraughtsBitboard;
  readonly playerToMove: Player;

  private _moves: Move[] | undefined = undefined;

  constructor(
    bitboard: DraughtsBitboard = new DraughtsBitboard(),
    playerToMove: Player = Player.WHITE
  ) {
    this.bitboard = bitboard;
    this.playerToMove = playerToMove;
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

    const bitboard =
      this.playerToMove === Player.WHITE
        ? this.bitboard.moveWhite(move)
        : this.bitboard.moveBlack(move);

    const playerToMove =
      this.playerToMove === Player.WHITE ? Player.BLACK : Player.WHITE;

    return new Draughts(bitboard, playerToMove);
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
      return this.bitboard.generateOriginMovesWhite(origin);
    return this.bitboard.generateOriginMovesBlack(origin);
  }

  private _generateOriginJumps(origin: number): Move[] {
    const searchStack: Move[] =
      this.playerToMove === Player.WHITE
        ? this.bitboard.generateOriginJumpWhite(origin)
        : this.bitboard.generateOriginJumpBlack(origin);

    const jumpsStack: Move[] = [];

    while (searchStack.length > 0) {
      const jumpMove = searchStack.pop();
      if (!jumpMove) break;

      const nextJumpMoves =
        this.playerToMove === Player.WHITE
          ? this.bitboard.generateOriginJumpWhite(
              jumpMove.destination,
              jumpMove.origin & this.bitboard.king
            )
          : this.bitboard.generateOriginJumpBlack(
              jumpMove.destination,
              jumpMove.origin & this.bitboard.king
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

  private _getJumpers(): number {
    if (this.playerToMove === Player.WHITE)
      return this.bitboard.getWhiteJumpers();
    return this.bitboard.getBlackJumpers();
  }

  private _getMovers(): number {
    if (this.playerToMove === Player.WHITE)
      return this.bitboard.getWhiteMovers();
    return this.bitboard.getBlackMovers();
  }
}
