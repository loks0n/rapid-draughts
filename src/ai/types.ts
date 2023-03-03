import { Bitboard, IDraughtsEngine } from '../types';

export type DraughtsAI<T extends IDraughtsEngine<Bitboard>> = (
  engine: T
) => T['moves'][0];

export type SearchEvaluationFunction<T extends IDraughtsEngine<Bitboard>> = (
  engine: T
) => number;
