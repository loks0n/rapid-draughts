import { IDraughtsEngine, Player, Status } from '../../types';
import { cardinality } from '../../english/utils';
import * as Mask from '../../english/mask';

const statusToPlayer = {
  [Status.LIGHT_WON]: Player.LIGHT,
  [Status.DARK_WON]: Player.DARK,
};

export function englishDraughts(engine: IDraughtsEngine<number>) {
  const status = engine.status();
  if (status !== Status.PLAYING) {
    if (status === Status.DRAW) return Number.NEGATIVE_INFINITY;
    return engine.playerToMove === statusToPlayer[status]
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
  }

  return evaluateMiddlegame(engine);
}

const PIECE_WEIGHT = 50;
const KING_WEIGHT = 77;
const BACK_ROW_WEIGHT = 40;
const MIDDLE_TWO_RANK_FOUR_FILE_WEIGHT = 25;
const MIDDLE_FOUR_RANK_TWO_FILE_WEIGHT = 5;

function evaluateMiddlegame(engine: IDraughtsEngine<number>): number {
  const player =
    engine.playerToMove === Player.LIGHT
      ? engine.board.light
      : engine.board.dark;
  const opponent =
    engine.playerToMove === Player.LIGHT
      ? engine.board.dark
      : engine.board.light;

  let evaluation = 0;

  evaluation += cardinality(player) * PIECE_WEIGHT;
  evaluation -= cardinality(opponent) * PIECE_WEIGHT;

  evaluation += cardinality(player & engine.board.king) * KING_WEIGHT;
  evaluation -= cardinality(opponent & engine.board.king) * KING_WEIGHT;

  const back_row =
    engine.playerToMove === Player.LIGHT ? Mask.RANK_0 : Mask.RANK_7;
  const opponent_back_row =
    engine.playerToMove === Player.LIGHT ? Mask.RANK_7 : Mask.RANK_0;
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
