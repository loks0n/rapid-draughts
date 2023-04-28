import Long from 'long';

export enum DraughtsStatus {
  PLAYING = 'playing',
  DRAW = 'draw',
  LIGHT_WON = 'light_won',
  DARK_WON = 'dark_won',
}

export type Bitboard = number | Long;

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

export type DraughtsEngineData<TBitboard extends Bitboard, E> = {
  player: DraughtsPlayer;
  board: DraughtsEngineBoard<TBitboard>;
  store: E;
};

export type DraughtsEngineStrategy<TBitboard extends Bitboard, TStore> = {
  moves: (
    engine: DraughtsEngine<TBitboard, TStore>
  ) => DraughtsEngineMove<TBitboard>[];
  status: (engine: DraughtsEngine<TBitboard, TStore>) => DraughtsStatus;
  isValidMove: (
    engine: DraughtsEngine<TBitboard, TStore>,
    move: DraughtsEngineMove<TBitboard>
  ) => boolean;
  move: (
    engine: DraughtsEngine<TBitboard, TStore>,
    move: DraughtsEngineMove<TBitboard>
  ) => DraughtsEngineData<TBitboard, TStore>;
  serializeStore: (store: TStore) => TStore;
};

export class DraughtsEngine<TBitboard extends Bitboard, TStore> {
  data: DraughtsEngineData<TBitboard, TStore>;

  private strategy: DraughtsEngineStrategy<TBitboard, TStore>;

  private _moves: DraughtsEngineMove<TBitboard>[] | undefined;
  private _status: DraughtsStatus | undefined;

  constructor(
    data: DraughtsEngineData<TBitboard, TStore>,
    strategy: DraughtsEngineStrategy<TBitboard, TStore>
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
  clone(): DraughtsEngine<TBitboard, TStore> {
    return new DraughtsEngine(this.serialize(), this.strategy);
  }

  /**
   * Serializes the engine data
   * @returns The serialized engine data
   */
  serialize(): DraughtsEngineData<TBitboard, TStore> {
    return {
      board: { ...this.data.board },
      store: this.strategy.serializeStore(this.data.store),
      player: this.data.player,
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
