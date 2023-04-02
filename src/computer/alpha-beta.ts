import {
  DraughtsComputerStrategyArgs,
  SearchEvaluationFunction,
} from './computer';
import { Bitboard, DraughtsEngine, DraughtsEngineMove } from '../core/engine';

export type AlphaBetaOptions<T extends Bitboard, E> = {
  maxDepth: number;
  evaluationFunction: SearchEvaluationFunction<T, E>;
  quiescence?: boolean;
};

export async function alphaBeta<T extends Bitboard, E>({
  options: { maxDepth, evaluationFunction, quiescence = true },
  engine,
}: DraughtsComputerStrategyArgs<T, E, AlphaBetaOptions<T, E>>): Promise<
  DraughtsEngineMove<T>
> {
  let recordEvaluation = Number.NEGATIVE_INFINITY;
  let recordMove: DraughtsEngineMove<T> | undefined;

  for (const move of engine.moves) {
    const next = engine.clone();
    next.move(move);

    const evaluation = -(await alphaBetaSearch({
      data: {
        engine: next,
        alpha: Number.NEGATIVE_INFINITY,
        beta: Number.POSITIVE_INFINITY,
        depth: maxDepth - 1,
      },
      options: { evaluationFunction, quiescence },
    }));
    if (evaluation >= recordEvaluation) {
      recordEvaluation = evaluation;
      recordMove = move;
    }
  }

  if (recordMove === undefined) {
    throw new Error('no available moves');
  }

  return recordMove;
}

/**
 * Options for the alpha-beta pruning search algorithm
 *
 * @typedef {Object} AlphaBetaOptions
 * @property {number} maxDepth - Maximum depth of the search tree for the alpha-beta pruning algorithm.
 * @property {SearchEvaluationFunction<T, E>} evaluationFunction - The evaluation function to be used for scoring game states.
 * @property {boolean} [quiescence] - Optional flag to enable/disable quiescence search. Defaults to true.
 */
type AlphaBetaSearchArguments<T extends Bitboard, E> = {
  data: {
    engine: DraughtsEngine<T, E>;
    alpha: number;
    beta: number;
    depth: number;
  };
  options: Omit<AlphaBetaOptions<T, E>, 'maxDepth'>;
};

async function alphaBetaSearch<T extends Bitboard, E>({
  data: { engine, alpha, beta, depth },
  options: { evaluationFunction, quiescence },
}: AlphaBetaSearchArguments<T, E>) {
  if (depth === 0)
    return quiescence
      ? quiescenceSearch({
          data: { engine, alpha, beta },
          options: { evaluationFunction },
        })
      : evaluationFunction(engine);

  for (const move of engine.moves) {
    const next = engine.clone();
    next.move(move);

    const evaluation = -(await alphaBetaSearch({
      data: {
        engine: next,
        alpha: -beta,
        beta: -alpha,
        depth: depth - 1,
      },
      options: { evaluationFunction, quiescence: quiescence },
    }));
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  }

  return alpha;
}

interface QuiescenceSearchArguments<T extends Bitboard, E> {
  data: {
    engine: DraughtsEngine<T, E>;
    alpha: number;
    beta: number;
  };
  options: {
    evaluationFunction: SearchEvaluationFunction<T, E>;
  };
}

async function quiescenceSearch<T extends Bitboard, E>({
  data: { engine, alpha, beta },
  options: { evaluationFunction },
}: QuiescenceSearchArguments<T, E>) {
  const evaluation = evaluationFunction(engine);
  if (evaluation >= beta) return beta;
  alpha = Math.max(evaluation, alpha);

  for (const move of engine.moves) {
    if (!move.captures) continue;
    const next = engine.clone();
    next.move(move);

    const nextEvaluation = -(await quiescenceSearch({
      data: { engine: next, alpha: -beta, beta: -alpha },
      options: { evaluationFunction },
    }));

    if (nextEvaluation >= beta) return beta;
    alpha = Math.max(nextEvaluation, alpha);
  }

  return alpha;
}
