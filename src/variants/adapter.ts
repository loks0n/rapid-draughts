import {
  Bitboard,
  DraughtsBoard1D,
  DraughtsMove1D,
  DraughtsPlayer,
  DraughtsStatus,
  IDraughtsEngine,
  IDraughtsGameAdapter1D,
} from '../types';

export abstract class AbstractDraughtsAdapter1D<
  T extends IDraughtsEngine<Bitboard>
> implements IDraughtsGameAdapter1D
{
  player: DraughtsPlayer;
  status: DraughtsStatus;

  private _board: DraughtsBoard1D | undefined;
  private _moves: DraughtsMove1D[] | undefined;

  private engine: T;

  constructor(engine: T) {
    this.engine = engine;
    this.status = engine.status;
    this.player = engine.player;
  }

  abstract convertEngineMoveToAdapterMove(
    engineMove: T['moves'][0]
  ): DraughtsMove1D;
  abstract convertAdapterMoveToEngineMove(
    adapterMove: DraughtsMove1D
  ): T['moves'][0];
  abstract convertEngineBoardToAdapterBoard(
    engineBoard: T['board']
  ): DraughtsBoard1D;

  get board(): DraughtsBoard1D {
    return (this._board ??= this.convertEngineBoardToAdapterBoard(
      this.engine.board
    ));
  }

  wipeCache() {
    this._board = undefined;
    this._moves = undefined;
  }

  move(adapterMove: DraughtsMove1D) {
    const engineMove = this.convertAdapterMoveToEngineMove(adapterMove);
    this.engine.move(engineMove);
  }

  get moves(): DraughtsMove1D[] {
    return (this._moves ??= this._initializeMoves());
  }

  private _initializeMoves(): DraughtsMove1D[] {
    const moves: DraughtsMove1D[] = [];

    for (const engineMove of this.engine.moves) {
      const adapterMove = this.convertEngineMoveToAdapterMove(engineMove);
      if (adapterMove !== undefined) moves.push(adapterMove);
    }

    return moves;
  }

  toString() {
    const boardSize = Math.floor(Math.sqrt(this.board.length));
    const div = '-'.repeat(1 + boardSize * 4);
    let str = `${div}\n`;

    for (const [ref, square] of this.board.entries()) {
      // is start of row
      if (ref % boardSize === 0) {
        str += `|`;
      }

      // output square
      if (square.piece) {
        let char = square.piece.player === DraughtsPlayer.LIGHT ? 'x' : 'o';
        char = square.piece.king ? char.toUpperCase() : char;
        str += ` ${char} |`;
      } else {
        str += '   |';
      }

      // is end of row
      if (ref % boardSize === boardSize - 1) {
        str += ` \n${div}\n`;
      }
    }

    return str;
  }
}
