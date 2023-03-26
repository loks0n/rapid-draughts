import { DraughtsPlayer } from './engine';
import type {
  Bitboard,
  DraughtsEngine,
  DraughtsEngineBoard,
  DraughtsEngineMove,
  DraughtsStatus,
} from './engine';

export type DraughtsPiece1D = {
  readonly king: boolean;
  readonly player: DraughtsPlayer;
};

export type DraughtsDarkSquare1D = {
  readonly piece: DraughtsPiece1D | undefined;
  readonly position: number;
  readonly dark: true;
};

export type DraughtsLightSquare1D = {
  readonly piece: undefined;
  readonly position: undefined;
  readonly dark: false;
};

export type DraughtsSquare1D = DraughtsLightSquare1D | DraughtsDarkSquare1D;

export type DraughtsBoard1D = DraughtsSquare1D[];

export type DraughtsMove1D = {
  origin: number;
  destination: number;
  captures: number[];
};

export type DraughtsGameHistory1D = {
  moves: DraughtsMove1D[];
  boards: DraughtsBoard1D[];
};

export type DraughtsAdapter1D<T extends Bitboard> = {
  toMove1D: (engineMove: DraughtsEngineMove<T>) => DraughtsMove1D;
  toEngineMove: (move1D: DraughtsMove1D) => DraughtsEngineMove<T>;
  toBoard1D: (engineBoard: DraughtsEngineBoard<T>) => DraughtsBoard1D;
};

export class DraughtsGame1D<T extends Bitboard, E> {
  engine: DraughtsEngine<T, E>;
  history: DraughtsGameHistory1D;

  private adapter: DraughtsAdapter1D<T>;

  private _board: DraughtsBoard1D | undefined;
  private _moves: DraughtsMove1D[] | undefined;

  constructor(
    engine: DraughtsEngine<T, E>,
    history: DraughtsGameHistory1D,
    adapter: DraughtsAdapter1D<T>
  ) {
    this.engine = engine;
    this.history = history;
    this.adapter = adapter;
  }

  /**
   * Get the status of the game
   */
  get status(): DraughtsStatus {
    return this.engine.status;
  }

  /**
   * Get the current player
   */
  get player(): DraughtsPlayer {
    return this.engine.data.player;
  }

  /**
   * Get the 1D representation of the current board
   */
  get board(): DraughtsBoard1D {
    return (this._board ??= this.adapter.toBoard1D(this.engine.data.board));
  }

  /**
   * Get the available moves in 1D representation
   */
  get moves(): DraughtsMove1D[] {
    return (this._moves ??= this.engine.moves.map((engineMove) =>
      this.adapter.toMove1D(engineMove)
    ));
  }

  /**
   * Make a move using the 1D representation of a move
   * @param move The move to make in 1D representation
   */
  move(move: DraughtsMove1D) {
    this.history.boards.push(this.board);
    this.history.moves.push(move);

    const engineMove = this.adapter.toEngineMove(move);
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
