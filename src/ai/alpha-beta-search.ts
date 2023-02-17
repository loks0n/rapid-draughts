import { Bitboard, IDraughtsEngine, Move } from '../types';
import { quiescenceSearch } from './quiescence-search';
import { DraughtsAI } from './types';

export type AlphaBetaEvaluationFunction<T extends Bitboard> = (
  engine: IDraughtsEngine<T>
) => number;

export interface AlphaBetaArguments<T extends Bitboard> {
  maxDepth: number;
  evaluateFn: AlphaBetaEvaluationFunction<T>;
  quiescence?: boolean;
}

export type AlphaBetaSearchArguments<T extends Bitboard> = {
  data: {
    engine: IDraughtsEngine<T>;
    alpha: number;
    beta: number;
    depth: number;
  };
  options: {
    evaluateFn: AlphaBetaEvaluationFunction<T>;
    quiescence: boolean;
  };
};

export function alphaBeta<T extends Bitboard>({
  maxDepth,
  evaluateFn,
  quiescence = true,
}: AlphaBetaArguments<T>): DraughtsAI<T> {
  return (engine: IDraughtsEngine<T>) => {
    let recordEvaluation = Number.NEGATIVE_INFINITY;
    let recordMove: Move<T> | undefined;

    for (const move of engine.moves()) {
      const next = engine.clone();
      next.move(move);

      const evaluation = -alphaBetaSearch({
        data: {
          engine: next,
          alpha: Number.NEGATIVE_INFINITY,
          beta: Number.POSITIVE_INFINITY,
          depth: maxDepth - 1,
        },
        options: { evaluateFn, quiescence },
      });
      if (evaluation >= recordEvaluation) {
        recordEvaluation = evaluation;
        recordMove = move;
      }
    }

    if (recordMove === undefined) {
      throw new Error('no available moves');
    }
    return recordMove;
  };
}

function alphaBetaSearch<T extends Bitboard>({
  data: { engine, alpha, beta, depth },
  options: { evaluateFn, quiescence },
}: AlphaBetaSearchArguments<T>) {
  if (depth === 0)
    return quiescence
      ? quiescenceSearch({
          data: { engine, alpha, beta },
          options: { evaluateFn },
        })
      : evaluateFn(engine);

  for (const move of engine.moves()) {
    const next = engine.clone();
    next.move(move);

    const evaluation = -alphaBetaSearch({
      data: {
        engine: next,
        alpha: -beta,
        beta: -alpha,
        depth: depth - 1,
      },
      options: { evaluateFn, quiescence },
    });
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  }

  return alpha;
}
