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

// 2D Types

export type Square2D = {
  player: Player;
  king: boolean;
};

export type Board2D = (Square2D | undefined)[][];

export type Square2DRef = {
  rank: number;
  file: number;
};

export type Move2D = {
  origin: Square2DRef;
  destination: Square2DRef;
  captures: Square2DRef[];
};

export interface IDraughts2D {
  toString(): string;
  player(): Player;
  status(): Status;
  board(): Board2D;
  moves(): Move2D[];
  move(move: Move2D): void;
}
