import { IDraughtsEngine } from '../../types';
import { EnglishDraughtsAI } from './types';

export function random(): EnglishDraughtsAI {
  return (engine: IDraughtsEngine<number>) => {
    const moves = engine.moves();

    if (moves.length === 0) {
      throw new Error('no valid moves');
    }

    const randomIndex = Math.floor(Math.random() * moves.length);

    return moves[randomIndex];
  };
}
