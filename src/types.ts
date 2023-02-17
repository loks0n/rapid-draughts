import Long from 'long';

// Universal types

export enum Player {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum Status {
  PLAYING = 'playing',
  DRAW = 'draw',
  DARK_WON = 'dark_won',
  LIGHT_WON = 'light_won',
}

// Engine types

type Bitboard = number | Long;

export type Board<T extends Bitboard> = {
  light: T;
  dark: T;
  king: T;
};

export type Move<T extends Bitboard> = {
  origin: T;
  destination: T;
  captures: T;
};

export interface IDraughtsEngine<T extends Bitboard> {
  board: Board<T>;
  playerToMove: Player;
  status(): Status;
  moves(): Move<T>[];
  move(move: Move<T>): void;
  copy(): IDraughtsEngine<T>;
}

// 1D Types

export type Square1D = {
  player: Player;
  king: boolean;
};

export type Board1D = (Square1D | undefined)[];

export type Square1DRef = number;

export type Move1D = {
  origin: Square1DRef;
  destination: Square1DRef;
  captures: Square1DRef[];
};

export interface IDraughts1D {
  toString(): string;
  player(): Player;
  status(): Status;
  board(): Board1D;
  moves(): Move1D[];
  move(move: Move1D): void;
}
