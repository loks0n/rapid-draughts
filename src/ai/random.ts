import { Bitboard, IDraughtsEngine } from '../types';
import { DraughtsAI } from './types';

export function random<T extends Bitboard>(): DraughtsAI<T> {
  return (engine: IDraughtsEngine<T>) => {
    const moves = engine.moves();

    if (moves.length === 0) {
      throw new Error('no valid moves');
    }

    const randomIndex = Math.floor(Math.random() * moves.length);

    return moves[randomIndex];
  };
}
