import { Bitboard } from '../bitwise/types';

export enum DraughtsStatus {
  PLAYING = 'playing',
  DRAW = 'draw',
  LIGHT_WON = 'light_won',
  DARK_WON = 'dark_won',
}

export type DraughtsEngineBoard<TBitboard extends Bitboard> = {
  readonly light: TBitboard;
  readonly dark: TBitboard;
  readonly king: TBitboard;
};

export type DraughtsEngineMove<TBitboard extends Bitboard> = {
  readonly origin: TBitboard;
  readonly destination: TBitboard;
  readonly captures: TBitboard;
};

export enum DraughtsPlayer {
  LIGHT = 'light',
  DARK = 'dark',
}

export type DraughtsEngineData<TBitboard extends Bitboard> = {
  player: DraughtsPlayer;
  board: DraughtsEngineBoard<TBitboard>;
  stats: {
    sinceCapture: number;
    sinceNonKingAdvance: number;
  };
};

export type DraughtsEngineStrategy<TBitboard extends Bitboard> = {
  moves: (engine: DraughtsEngine<TBitboard>) => DraughtsEngineMove<TBitboard>[];
  status: (engine: DraughtsEngine<TBitboard>) => DraughtsStatus;
  isValidMove: (
    engine: DraughtsEngine<TBitboard>,
    move: DraughtsEngineMove<TBitboard>
  ) => boolean;
  move: (
    engine: DraughtsEngine<TBitboard>,
    move: DraughtsEngineMove<TBitboard>
  ) => DraughtsEngineData<TBitboard>;
};

export class DraughtsEngine<TBitboard extends Bitboard> {
  data: DraughtsEngineData<TBitboard>;

  private strategy: DraughtsEngineStrategy<TBitboard>;

  private _moves: DraughtsEngineMove<TBitboard>[] | undefined;
  private _status: DraughtsStatus | undefined;

  constructor(
    data: DraughtsEngineData<TBitboard>,
    strategy: DraughtsEngineStrategy<TBitboard>
  ) {
    this.data = data;
    this.strategy = strategy;
  }

  /**
   * Returns the current game status
   */
  get status(): DraughtsStatus {
    return (this._status ??= this.strategy.status(this));
  }

  /**
   * Returns the available moves
   */
  get moves(): DraughtsEngineMove<TBitboard>[] {
    return (this._moves ??= this.strategy.moves(this));
  }

  /**
   * Clones the current engine instance
   * @returns A new cloned engine instance
   */
  clone(): DraughtsEngine<TBitboard> {
    return new DraughtsEngine(this.serialize(), this.strategy);
  }

  /**
   * Serializes the engine data
   * @returns The serialized engine data
   */
  serialize(): DraughtsEngineData<TBitboard> {
    return {
      board: { ...this.data.board },
      player: this.data.player,
      stats: { ...this.data.stats },
    };
  }

  move(move: DraughtsEngineMove<TBitboard>): void {
    this.data = this.strategy.move(this, move);
    this._moves = undefined;
    this._status = undefined;
  }

  isValidMove(move: DraughtsEngineMove<TBitboard>): boolean {
    return this.strategy.isValidMove(this, move);
  }
}
