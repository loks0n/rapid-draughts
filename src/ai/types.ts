import { Bitboard, IDraughtsEngine, Move } from '../types';

export type DraughtsAI<T extends Bitboard> = (
  engine: IDraughtsEngine<T>
) => Move<T> | undefined;
