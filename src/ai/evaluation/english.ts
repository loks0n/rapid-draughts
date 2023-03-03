import { DraughtsStatus, DraughtsPlayer } from '../../types';
import { cardinality } from '../../variants/utils';
import * as Mask from '../../variants/english/mask';
import { EnglishDraughtsEngine } from '../../variants/english/engine';
import { SearchEvaluationFunction } from '../types';

const statusToPlayer = {
  [DraughtsStatus.LIGHT_WON]: DraughtsPlayer.LIGHT,
  [DraughtsStatus.DARK_WON]: DraughtsPlayer.DARK,
};

export const english: SearchEvaluationFunction<EnglishDraughtsEngine> = (
  engine: EnglishDraughtsEngine
) => {
  const status = engine.status;
  if (status !== DraughtsStatus.PLAYING) {
    if (status === DraughtsStatus.DRAW) return Number.NEGATIVE_INFINITY;
    return engine.player === statusToPlayer[status]
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

function evaluateMiddlegame(engine: EnglishDraughtsEngine): number {
  const player =
    engine.player === DraughtsPlayer.LIGHT
      ? engine.board.light
      : engine.board.dark;
  const opponent =
    engine.player === DraughtsPlayer.LIGHT
      ? engine.board.dark
      : engine.board.light;

  let evaluation = 0;

  evaluation += cardinality(player) * PIECE_WEIGHT;
  evaluation -= cardinality(opponent) * PIECE_WEIGHT;

  evaluation += cardinality(player & engine.board.king) * KING_WEIGHT;
  evaluation -= cardinality(opponent & engine.board.king) * KING_WEIGHT;

  const back_row =
    engine.player === DraughtsPlayer.LIGHT ? Mask.RANK_0 : Mask.RANK_7;
  const opponent_back_row =
    engine.player === DraughtsPlayer.LIGHT ? Mask.RANK_7 : Mask.RANK_0;
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
