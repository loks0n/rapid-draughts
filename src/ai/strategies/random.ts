import { Bitboard, IDraughtsEngine } from '../../types';
import { DraughtsAI } from '../types';

export function random<T extends IDraughtsEngine<Bitboard>>(): DraughtsAI<T> {
  return (engine: T) => {
    if (engine.moves.length === 0) throw new Error('no valid moves');

    const randomIndex = Math.floor(Math.random() * engine.moves.length);

    return engine.moves[randomIndex];
  };
}
