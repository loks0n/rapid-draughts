import { Draughts } from '../core/draughts';
import { quiescenceSearch } from './quiescence-search';

export function alphaBetaMove(draughts: Draughts, depth: number) {
  let recordEvaluation = Number.NEGATIVE_INFINITY;
  let recordMove;

  for (const move of draughts.moves()) {
    const next = draughts.move(move);
    const evaluation = -alphaBetaSearch(
      next,
      depth - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
    if (evaluation >= recordEvaluation) {
      recordEvaluation = evaluation;
      recordMove = move;
    }
  }

  return recordMove;
}

function alphaBetaSearch(
  draughts: Draughts,
  depth: number,
  alpha: number,
  beta: number
) {
  if (depth === 0) return quiescenceSearch(draughts, alpha, beta);

  for (const move of draughts.moves()) {
    const next = draughts.move(move);
    const evaluation = -alphaBetaSearch(next, depth - 1, -beta, -alpha);
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  }

  return alpha;
}
