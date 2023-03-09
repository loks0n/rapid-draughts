import { Bitboard, DraughtsEngine } from './engine';

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type DraughtsEngineGetBitboard<T> = T extends DraughtsEngine<
  infer X extends Bitboard,
  unknown
>
  ? X
  : never;

export type DraughtsEngineGetStore<T> = T extends DraughtsEngine<
  Bitboard,
  infer X
>
  ? X
  : never;
