import Long from 'long';

export enum DraughtsPlayer {
  LIGHT = 'light',
  DARK = 'dark',
}

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

export enum DraughtsStatus {
  PLAYING = 'playing',
  DRAW = 'draw',
  LIGHT_WON = 'light_won',
  DARK_WON = 'dark_won',
}

export type Bitboard = number | Long;

export type DraughtsEngineBoard<T extends Bitboard> = {
  light: T;
  dark: T;
  king: T;
};

export type DraughtsEngineMove<T extends Bitboard> = {
  origin: T;
  destination: T;
  captures: T;
};

export interface IDraughtsEngineBase {
  player: DraughtsPlayer;
  status: DraughtsStatus;
}

export interface IDraughtsEngine<T extends Bitboard>
  extends IDraughtsEngineBase {
  moves: DraughtsEngineMove<T>[];
  board: DraughtsEngineBoard<T>;
  move(move: DraughtsEngineMove<T>): void;
  clone(): this;
}

export interface IDraughtsGameAdapter1D extends IDraughtsEngineBase {
  moves: DraughtsMove1D[];
  board: DraughtsBoard1D;
  move(move: DraughtsMove1D): void;
}

export interface WithAdapter1D {
  adapter1D: IDraughtsGameAdapter1D;
}
