export enum Player {
  WHITE,
  BLACK,
}

export enum Status {
  PLAYING,
  BLACK_WON,
  WHITE_WON,
}

export type Move = {
  origin: number;
  destination: number;
  captures: number;
};
