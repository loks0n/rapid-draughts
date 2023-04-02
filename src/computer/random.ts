import { Bitboard, DraughtsEngineMove } from '../core/engine';
import { DraughtsComputerStrategyArgs } from './computer';

export async function random<T extends Bitboard, E>({
  engine,
}: DraughtsComputerStrategyArgs<T, E, undefined>): Promise<
  DraughtsEngineMove<T>
> {
  if (engine.moves.length === 0) throw new Error('no valid moves');

  const randomIndex = Math.floor(Math.random() * engine.moves.length);
  const randomEngineMove = engine.moves[randomIndex];

  return randomEngineMove;
}
