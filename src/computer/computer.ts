import { Bitboard, DraughtsEngine, DraughtsEngineMove } from '../core/engine';
import {
  DraughtsAdapter1D,
  DraughtsGame1D,
  DraughtsMove1D,
} from '../core/game';

export type SearchEvaluationFunction<T extends Bitboard, E> = (
  engine: DraughtsEngine<T, E>
) => number;

export type DraughtsComputerStrategyArgs<T extends Bitboard, E, O> = {
  options: O;
  engine: DraughtsEngine<T, E>;
};

export type DraughtsComputerStrategy<T extends Bitboard, E, O> = (
  args: DraughtsComputerStrategyArgs<T, E, O>
) => Promise<DraughtsEngineMove<T>>;

export type DraughtsComputer<T extends Bitboard, E> = (
  game: DraughtsGame1D<T, E>
) => Promise<DraughtsMove1D>;

export type DraughtsComputerArguments<T extends Bitboard, E, O> = {
  adapter: DraughtsAdapter1D<T>;
  strategy: DraughtsComputerStrategy<T, E, O>;
  options: O;
};

export const DraughtsComputerFactory = {
  setup<T extends Bitboard, E, O>({
    adapter,
    strategy,
    options,
  }: DraughtsComputerArguments<T, E, O>): DraughtsComputer<T, E> {
    return async (game) => {
      const engineMove = await strategy({
        options,
        engine: game.engine,
      });
      return adapter.toMove1D(engineMove);
    };
  },
};
