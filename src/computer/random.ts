import { Bitboard } from '../bitwise/types';
import { DraughtsEngineMove } from '../core/engine';
import { DraughtsComputerStrategyArgs } from './computer';

export async function random<TBitboard extends Bitboard>({
  engine,
}: DraughtsComputerStrategyArgs<TBitboard, undefined>): Promise<
  DraughtsEngineMove<TBitboard>
> {
  if (engine.moves.length === 0) throw new Error('no valid moves');

  const randomIndex = Math.floor(Math.random() * engine.moves.length);
  const randomEngineMove = engine.moves[randomIndex];

  return randomEngineMove;
}
