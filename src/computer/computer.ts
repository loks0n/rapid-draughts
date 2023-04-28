import { Bitboard, DraughtsEngine, DraughtsEngineMove } from '../core/engine';
import {
  DraughtsAdapter1D,
  DraughtsGame1D,
  DraughtsMove1D,
} from '../core/game';

export type SearchEvaluationFunction<TBitboard extends Bitboard, TStore> = (
  engine: DraughtsEngine<TBitboard, TStore>
) => number;

export type DraughtsComputerStrategyArgs<
  TBitboard extends Bitboard,
  TStore,
  TOptions
> = {
  options: TOptions;
  engine: DraughtsEngine<TBitboard, TStore>;
};

export type DraughtsComputerStrategy<
  TBitboard extends Bitboard,
  TStore,
  TOptions
> = (
  args: DraughtsComputerStrategyArgs<TBitboard, TStore, TOptions>
) => Promise<DraughtsEngineMove<TBitboard>>;

export type DraughtsComputer<TBitboard extends Bitboard, TStore> = (
  game: DraughtsGame1D<TBitboard, TStore>
) => Promise<DraughtsMove1D>;

export type DraughtsComputerArguments<
  TBitboard extends Bitboard,
  TStore,
  TOptions
> = {
  adapter: DraughtsAdapter1D<TBitboard>;
  strategy: DraughtsComputerStrategy<TBitboard, TStore, TOptions>;
  options: TOptions;
};

export const DraughtsComputerFactory = {
  setup<TBitboard extends Bitboard, TStore, TOptions>({
    adapter,
    strategy,
    options,
  }: DraughtsComputerArguments<TBitboard, TStore, TOptions>): DraughtsComputer<
    TBitboard,
    TStore
  > {
    return async (game) => {
      const engineMove = await strategy({
        options,
        engine: game.engine,
      });
      return adapter.toMove1D(engineMove);
    };
  },
};
