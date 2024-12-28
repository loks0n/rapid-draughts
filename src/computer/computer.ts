import { Bitboard } from '../bitwise/types';
import { DraughtsEngine, DraughtsEngineMove } from '../core/engine';
import {
  DraughtsAdapter1D,
  DraughtsGame1D,
  DraughtsMove1D,
} from '../core/game';

export type SearchEvaluationFunction<TBitboard extends Bitboard> = (
  engine: DraughtsEngine<TBitboard>
) => number;

export type DraughtsComputerStrategyArgs<
  TBitboard extends Bitboard,
  TOptions,
> = {
  options: TOptions;
  engine: DraughtsEngine<TBitboard>;
};

export type DraughtsComputerStrategy<TBitboard extends Bitboard, TOptions> = (
  args: DraughtsComputerStrategyArgs<TBitboard, TOptions>
) => Promise<DraughtsEngineMove<TBitboard>>;

export type DraughtsComputer<TBitboard extends Bitboard> = (
  game: DraughtsGame1D<TBitboard>
) => Promise<DraughtsMove1D>;

export type DraughtsComputerArguments<TBitboard extends Bitboard, TOptions> = {
  adapter: DraughtsAdapter1D<TBitboard>;
  strategy: DraughtsComputerStrategy<TBitboard, TOptions>;
  options: TOptions;
};

export const DraughtsComputerFactory = {
  setup<TBitboard extends Bitboard, TOptions>({
    adapter,
    strategy,
    options,
  }: DraughtsComputerArguments<
    TBitboard,
    TOptions
  >): DraughtsComputer<TBitboard> {
    return async (game) => {
      const engineMove = await strategy({
        options,
        engine: game.engine,
      });
      return adapter.toMove1D(engineMove);
    };
  },
};
