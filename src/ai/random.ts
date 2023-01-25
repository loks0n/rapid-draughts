import { Draughts } from '../core/draughts';
import { Move } from '../core/types';

export function randomMove(draughts: Draughts): Move | undefined {
  const moves = draughts.moves();
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex] ?? undefined;
}
