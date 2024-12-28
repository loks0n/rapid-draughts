import { Bitboard } from '../bitwise/types';
import { DraughtsPlayer } from './engine';
import type {
  DraughtsEngine,
  DraughtsEngineBoard,
  DraughtsEngineMove,
  DraughtsStatus,
} from './engine';
import { formatBoard } from './utils';

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
  readonly origin: number;
  readonly destination: number;
  readonly captures: number[];
};

export type DraughtsGameHistory1D = {
  moves: DraughtsMove1D[];
  boards: DraughtsBoard1D[];
};

export type DraughtsAdapter1D<TBitboard extends Bitboard> = {
  toMove1D: (engineMove: DraughtsEngineMove<TBitboard>) => DraughtsMove1D;
  toEngineMove: (move1D: DraughtsMove1D) => DraughtsEngineMove<TBitboard>;
  toBoard1D: (engineBoard: DraughtsEngineBoard<TBitboard>) => DraughtsBoard1D;
};

export class DraughtsGame1D<TBitboard extends Bitboard> {
  engine: DraughtsEngine<TBitboard>;
  history: DraughtsGameHistory1D;

  private _board: DraughtsBoard1D | undefined;
  private _moves: DraughtsMove1D[] | undefined;

  private readonly adapter: DraughtsAdapter1D<TBitboard>;

  constructor(
    engine: DraughtsEngine<TBitboard>,
    history: DraughtsGameHistory1D,
    adapter: DraughtsAdapter1D<TBitboard>
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
   * Get the current player to move
   */
  get player(): DraughtsPlayer {
    return this.engine.data.player;
  }

  /**
   * Get the 1D array representation of the current board
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
   * Check if a move is valid
   * @param move The move to check in 1D representation
   * @returns True if the move is valid, false otherwise.
   */
  isValidMove(move: DraughtsMove1D) {
    const engineMove = this.adapter.toEngineMove(move);
    return this.engine.isValidMove(engineMove);
  }

  /**
   * Make a move using the 1D representation of a move
   * @param move The move to make in 1D representation
   */
  move(move: DraughtsMove1D) {
    if (!this.isValidMove(move)) {
      throw new Error(`invalid move: ${JSON.stringify(move)}`);
    }

    this.history.boards.push(this.board);
    this.history.moves.push(move);

    const engineMove = this.adapter.toEngineMove(move);
    this.engine.move(engineMove);

    this._board = undefined;
    this._moves = undefined;
  }

  asciiBoard() {
    return formatBoard(this.board);
  }
}
