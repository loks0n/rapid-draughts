import {
  Bitboard,
  DraughtsEngine,
  DraughtsEngineBoard,
  DraughtsEngineMove,
  DraughtsPlayer,
  DraughtsStatus,
} from './engine';

export type DraughtsPiece1D = {
  king: boolean;
  player: DraughtsPlayer;
};

export type DraughtsDarkSquare1D = {
  piece: DraughtsPiece1D | undefined;
  position: number;
  dark: true;
};

export type DraughtsLightSquare1D = {
  piece: undefined;
  position: undefined;
  dark: false;
};

export type DraughtsSquare1D = DraughtsLightSquare1D | DraughtsDarkSquare1D;

export type DraughtsBoard1D = DraughtsSquare1D[];

export interface DraughtsMove1D {
  origin: number;
  destination: number;
  captures: number[];
}

export type DraughtsAdapter1D<T extends Bitboard> = {
  toMove1D: (engineMove: DraughtsEngineMove<T>) => DraughtsMove1D;
  toEngineMove: (move1D: DraughtsMove1D) => DraughtsEngineMove<T>;
  toBoard1D: (engineBoard: DraughtsEngineBoard<T>) => DraughtsBoard1D;
};

export class DraughtsGame1D<T extends Bitboard, E> {
  engine: DraughtsEngine<T, E>;

  private adapter: DraughtsAdapter1D<T>;

  private _board: DraughtsBoard1D | undefined;
  private _moves: DraughtsMove1D[] | undefined;

  constructor(engine: DraughtsEngine<T, E>, adapter: DraughtsAdapter1D<T>) {
    this.engine = engine;
    this.adapter = adapter;
  }

  get status(): DraughtsStatus {
    return this.engine.status;
  }

  get player(): DraughtsPlayer {
    return this.engine.data.player;
  }

  get board(): DraughtsBoard1D {
    return (this._board ??= this.adapter.toBoard1D(this.engine.data.board));
  }

  get moves(): DraughtsMove1D[] {
    return (this._moves ??= this.engine.moves.map((engineMove) =>
      this.adapter.toMove1D(engineMove)
    ));
  }

  move(adapterMove: DraughtsMove1D) {
    const engineMove = this.adapter.toEngineMove(adapterMove);
    this.engine.move(engineMove);
    this._board = undefined;
    this._moves = undefined;
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
