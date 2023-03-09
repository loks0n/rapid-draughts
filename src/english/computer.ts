import {
  DraughtsComputer,
  DraughtsComputerInstance,
  SearchEvaluationFunction,
} from '../computer/computer';
import { alphaBeta, AlphaBetaOptions } from '../computer/alpha-beta';
import { random } from '../computer/random';
import { DraughtsEngine, DraughtsPlayer, DraughtsStatus } from '../core/engine';
import { EnglishDraughtsEngineStore } from './engine';
import { EnglishDraughtsAdapter1D } from './game';
import { cardinality } from './utils';
import * as Mask from './mask';

const statusToPlayer = {
  [DraughtsStatus.LIGHT_WON]: DraughtsPlayer.LIGHT,
  [DraughtsStatus.DARK_WON]: DraughtsPlayer.DARK,
};

export const evaluate: SearchEvaluationFunction<
  number,
  EnglishDraughtsEngineStore
> = (engine: DraughtsEngine<number, EnglishDraughtsEngineStore>) => {
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

function evaluateMiddlegame(
  engine: DraughtsEngine<number, EnglishDraughtsEngineStore>
): number {
  const player =
    engine.data.player === DraughtsPlayer.LIGHT
      ? engine.data.board.light
      : engine.data.board.dark;
  const opponent =
    engine.data.player === DraughtsPlayer.LIGHT
      ? engine.data.board.dark
      : engine.data.board.light;

  let evaluation = 0;

  evaluation += cardinality(player) * PIECE_WEIGHT;
  evaluation -= cardinality(opponent) * PIECE_WEIGHT;

  evaluation += cardinality(player & engine.data.board.king) * KING_WEIGHT;
  evaluation -= cardinality(opponent & engine.data.board.king) * KING_WEIGHT;

  const back_row =
    engine.data.player === DraughtsPlayer.LIGHT ? Mask.RANK_0 : Mask.RANK_7;
  const opponent_back_row =
    engine.data.player === DraughtsPlayer.LIGHT ? Mask.RANK_7 : Mask.RANK_0;
  evaluation += cardinality(player & back_row) * BACK_ROW_WEIGHT;
  evaluation -= cardinality(opponent & opponent_back_row) * BACK_ROW_WEIGHT;

  evaluation +=
    cardinality(player & Mask.MIDDLE_TWO_RANK_FOUR_FILE) *
    MIDDLE_TWO_RANK_FOUR_FILE_WEIGHT;
  evaluation -=
    cardinality(opponent & Mask.MIDDLE_TWO_RANK_FOUR_FILE) *
    MIDDLE_TWO_RANK_FOUR_FILE_WEIGHT;

  evaluation +=
    cardinality(player & Mask.MIDDLE_FOUR_RANK_TWO_FILE) *
    MIDDLE_FOUR_RANK_TWO_FILE_WEIGHT;
  evaluation -=
    cardinality(opponent & Mask.MIDDLE_FOUR_RANK_TWO_FILE) *
    MIDDLE_FOUR_RANK_TWO_FILE_WEIGHT;

  return evaluation;
}

export const EnglishDraughtsComputer = {
  random(): DraughtsComputerInstance<number, EnglishDraughtsEngineStore> {
    return DraughtsComputer.new({
      adapter: EnglishDraughtsAdapter1D,
      strategy: random<number, EnglishDraughtsEngineStore>,
      options: undefined,
    });
  },
  alphaBeta(
    options: Partial<AlphaBetaOptions<number, EnglishDraughtsEngineStore>>
  ): DraughtsComputerInstance<number, EnglishDraughtsEngineStore> {
    const withDefaultOptions: AlphaBetaOptions<
      number,
      EnglishDraughtsEngineStore
    > = {
      maxDepth: options.maxDepth ?? 4,
      quiescence: options.quiescence ?? true,
      evaluationFunction: options.evaluationFunction ?? evaluate,
    };

    return DraughtsComputer.new({
      adapter: EnglishDraughtsAdapter1D,
      strategy: alphaBeta<number, EnglishDraughtsEngineStore>,
      options: withDefaultOptions,
    });
  },
};
