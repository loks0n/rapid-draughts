import {
  DraughtsComputerFactory,
  DraughtsComputer,
} from '../computer/computer';
import { alphaBeta, AlphaBetaOptions } from '../computer/alpha-beta';
import { random } from '../computer/random';
import { evaluate } from '../english/computer';
import { ItalianDraughtsAdapter1D } from './game';

export type ItalianDraughtsComputer = DraughtsComputer<number>;

export const ItalianDraughtsComputerFactory = {
  /**
   * Creates a computer opponent with a random strategy
   * @returns {ItalianDraughtsComputer} - A computer opponent with a random strategy
   */
  random(): ItalianDraughtsComputer {
    return DraughtsComputerFactory.setup({
      adapter: ItalianDraughtsAdapter1D,
      strategy: random<number>,
      options: undefined,
    });
  },
  /**
   * Creates a computer opponent with an alpha-beta pruning strategy
   * @param {Partial<AlphaBetaOptions<number>>} options - Options for the alpha-beta pruning strategy
   * @returns {ItalianDraughtsComputer} - A computer opponent with an alpha-beta pruning strategy
   */
  alphaBeta(
    options: Partial<AlphaBetaOptions<number>>
  ): ItalianDraughtsComputer {
    const withDefaultOptions: AlphaBetaOptions<number> = {
      maxDepth: options.maxDepth ?? 4,
      quiescence: options.quiescence ?? true,
      evaluationFunction: options.evaluationFunction ?? evaluate,
    };

    return DraughtsComputerFactory.setup({
      adapter: ItalianDraughtsAdapter1D,
      strategy: alphaBeta<number>,
      options: withDefaultOptions,
    });
  },
};
