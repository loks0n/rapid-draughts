import Long from 'long';

export enum DraughtsStatus {
  PLAYING = 'playing',
  DRAW = 'draw',
  LIGHT_WON = 'light_won',
  DARK_WON = 'dark_won',
}

export type Bitboard = number | Long;

export type DraughtsEngineBoard<T extends Bitboard> = {
  readonly light: T;
  readonly dark: T;
  readonly king: T;
};

export type DraughtsEngineMove<T extends Bitboard> = {
  readonly origin: T;
  readonly destination: T;
  readonly captures: T;
};

export enum DraughtsPlayer {
  LIGHT = 'light',
  DARK = 'dark',
}

export type DraughtsEngineData<T extends Bitboard, E> = {
  player: DraughtsPlayer;
  board: DraughtsEngineBoard<T>;
  store: E;
};

export type DraughtsEngineStrategy<T extends Bitboard, E> = {
  moves: (engine: DraughtsEngine<T, E>) => DraughtsEngineMove<T>[];
  status: (engine: DraughtsEngine<T, E>) => DraughtsStatus;
  isValidMove: (
    engine: DraughtsEngine<T, E>,
    move: DraughtsEngineMove<T>
  ) => boolean;
  move: (
    engine: DraughtsEngine<T, E>,
    move: DraughtsEngineMove<T>
  ) => DraughtsEngineData<T, E>;
  serializeStore: (store: E) => E;
};

export class DraughtsEngine<T extends Bitboard, E> {
  data: DraughtsEngineData<T, E>;

  private strategy: DraughtsEngineStrategy<T, E>;

  private _moves: DraughtsEngineMove<T>[] | undefined;
  private _status: DraughtsStatus | undefined;

  constructor(
    data: DraughtsEngineData<T, E>,
    strategy: DraughtsEngineStrategy<T, E>
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
  get moves(): DraughtsEngineMove<T>[] {
    return (this._moves ??= this.strategy.moves(this));
  }

  /**
   * Clones the current engine instance
   * @returns A new cloned engine instance
   */
  clone(): DraughtsEngine<T, E> {
    return new DraughtsEngine(this.serialize(), this.strategy);
  }

  /**
   * Serializes the engine data
   * @returns The serialized engine data
   */
  serialize(): DraughtsEngineData<T, E> {
    return {
      board: { ...this.data.board },
      store: this.strategy.serializeStore(this.data.store),
      player: this.data.player,
    };
  }

  move(move: DraughtsEngineMove<T>): void {
    this.data = this.strategy.move(this, move);
    this._moves = undefined;
    this._status = undefined;
  }

  isValidMove(move: DraughtsEngineMove<T>): boolean {
    return this.strategy.isValidMove(this, move);
  }
}
