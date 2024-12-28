import {
  DraughtsComputerFactory,
  DraughtsComputer,
  SearchEvaluationFunction,
} from '../computer/computer';
import { alphaBeta, AlphaBetaOptions } from '../computer/alpha-beta';
import { random } from '../computer/random';
import { DraughtsEngine, DraughtsPlayer, DraughtsStatus } from '../core/engine';
import { EnglishDraughtsAdapter1D } from './game';
import Mask from './mask';
import { BitwiseNumber } from '../bitwise/number';

const statusToPlayer = {
  [DraughtsStatus.LIGHT_WON]: DraughtsPlayer.LIGHT,
  [DraughtsStatus.DARK_WON]: DraughtsPlayer.DARK,
};

/**
 * Evaluation function for the English Draughts game
 *
 * @param {DraughtsEngine<number>} engine - The game engine
 * @returns {number} - Evaluation score for the given position
 */
export const evaluate: SearchEvaluationFunction<number> = (
  engine: DraughtsEngine<number>
) => {
  const status = engine.status;
  if (status !== DraughtsStatus.PLAYING) {
    if (status === DraughtsStatus.DRAW) return Number.NEGATIVE_INFINITY;
    return engine.data.player === statusToPlayer[status]
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
  }
  return evaluateMiddlegame(engine);
};

const PIECE_WEIGHT = 50;
const KING_WEIGHT = 77;
const BACK_ROW_WEIGHT = 40;
const MIDDLE_TWO_RANK_FOUR_FILE_WEIGHT = 25;
const MIDDLE_FOUR_RANK_TWO_FILE_WEIGHT = 5;

function evaluateMiddlegame(engine: DraughtsEngine<number>): number {
  const player =
    engine.data.player === DraughtsPlayer.LIGHT
      ? engine.data.board.light
      : engine.data.board.dark;
  const opponent =
    engine.data.player === DraughtsPlayer.LIGHT
      ? engine.data.board.dark
      : engine.data.board.light;
  const playerKings = player & engine.data.board.king;
  const opponentKings = opponent & engine.data.board.king;

  const back_row =
    engine.data.player === DraughtsPlayer.LIGHT ? Mask.RANK_0 : Mask.RANK_7;
  const opponent_back_row =
    engine.data.player === DraughtsPlayer.LIGHT ? Mask.RANK_7 : Mask.RANK_0;

  const playerPieces = BitwiseNumber.cardinality(player);
  const opponentPieces = BitwiseNumber.cardinality(opponent);
  const playerKingsCount = BitwiseNumber.cardinality(playerKings);
  const opponentKingsCount = BitwiseNumber.cardinality(opponentKings);
  const playerBackRowCount = BitwiseNumber.cardinality(player & back_row);
  const opponentBackRowCount = BitwiseNumber.cardinality(
    opponent & opponent_back_row
  );
  const playerMiddleTwoRankFourFileCount = BitwiseNumber.cardinality(
    player & Mask.MIDDLE_TWO_RANK_FOUR_FILE
  );
  const opponentMiddleTwoRankFourFileCount = BitwiseNumber.cardinality(
    opponent & Mask.MIDDLE_TWO_RANK_FOUR_FILE
  );
  const playerMiddleFourRankTwoFileCount = BitwiseNumber.cardinality(
    player & Mask.MIDDLE_FOUR_RANK_TWO_FILE
  );
  const opponentMiddleFourRankTwoFileCount = BitwiseNumber.cardinality(
    opponent & Mask.MIDDLE_FOUR_RANK_TWO_FILE
  );

  return (
    (playerPieces - opponentPieces) * PIECE_WEIGHT +
    (playerKingsCount - opponentKingsCount) * KING_WEIGHT +
    (playerBackRowCount - opponentBackRowCount) * BACK_ROW_WEIGHT +
    (playerMiddleTwoRankFourFileCount - opponentMiddleTwoRankFourFileCount) *
      MIDDLE_TWO_RANK_FOUR_FILE_WEIGHT +
    (playerMiddleFourRankTwoFileCount - opponentMiddleFourRankTwoFileCount) *
      MIDDLE_FOUR_RANK_TWO_FILE_WEIGHT
  );
}

export type EnglishDraughtsComputer = DraughtsComputer<number>;

export const EnglishDraughtsComputerFactory = {
  /**
   * Creates a computer opponent with a random strategy
   * @returns {EnglishDraughtsComputer} - A computer opponent with a random strategy
   */
  random(): EnglishDraughtsComputer {
    return DraughtsComputerFactory.setup({
      adapter: EnglishDraughtsAdapter1D,
      strategy: random<number>,
      options: undefined,
    });
  },
  /**
   * Creates a computer opponent with an alpha-beta pruning strategy
   * @param {Partial<AlphaBetaOptions<number>>} options - Options for the alpha-beta pruning strategy
   * @returns {EnglishDraughtsComputer} - A computer opponent with an alpha-beta pruning strategy
   */
  alphaBeta(
    options: Partial<AlphaBetaOptions<number>>
  ): EnglishDraughtsComputer {
    const withDefaultOptions: AlphaBetaOptions<number> = {
      maxDepth: options.maxDepth ?? 4,
      quiescence: options.quiescence ?? true,
      evaluationFunction: options.evaluationFunction ?? evaluate,
    };

    return DraughtsComputerFactory.setup({
      adapter: EnglishDraughtsAdapter1D,
      strategy: alphaBeta<number>,
      options: withDefaultOptions,
    });
  },
};
