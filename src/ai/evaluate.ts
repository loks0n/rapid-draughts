import { Draughts } from '../core/draughts';
import { Player, Status } from '../core/types';
import { getBitCount } from '../core/helpers';

const statusToPlayer = {
  [Status.WHITE_WON]: Player.WHITE,
  [Status.BLACK_WON]: Player.BLACK,
};

export function evaluate(draughts: Draughts) {
  const status = draughts.status();

  if (status !== Status.PLAYING) {
    return draughts.playerToMove === statusToPlayer[status]
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
  }

  return evaluateMiddlegame(draughts);
}

function evaluateMiddlegame(draughts: Draughts): number {
  const player =
    draughts.playerToMove === Player.WHITE ? draughts.white : draughts.black;
  const opponent =
    draughts.playerToMove === Player.WHITE ? draughts.black : draughts.white;

  let evaluation = 0;

  evaluation += getBitCount(player);
  evaluation += getBitCount(player & draughts.king);
  evaluation -= getBitCount(opponent);
  evaluation -= getBitCount(opponent & draughts.king);

  return evaluation;
}
