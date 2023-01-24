import { evaluate } from './evaluate';
import { Draughts } from '../core/draughts';
import { getBitCount } from '../core/helpers';

export function quiescenceSearch(
  draughts: Draughts,
  alpha: number,
  beta: number
) {
  const evaluation = evaluate(draughts);

  if (evaluation >= beta) return beta;
  alpha = Math.max(evaluation, alpha);

  for (const move of draughts.moves()) {
    if (getBitCount(move.captures) === 0) continue;

    const next = draughts.move(move);
    const nextEvaluation = -quiescenceSearch(next, -beta, -alpha);

    if (nextEvaluation >= beta) return beta;
    alpha = Math.max(nextEvaluation, alpha);
  }

  return alpha;
}
