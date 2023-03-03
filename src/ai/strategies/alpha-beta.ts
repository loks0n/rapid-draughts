import { Bitboard, DraughtsEngineMove, IDraughtsEngine } from '../../types';
import { quiescence } from './quiescence';
import { DraughtsAI, SearchEvaluationFunction } from '../types';

export interface AlphaBetaArguments<T extends IDraughtsEngine<Bitboard>> {
  maxDepth: number;
  evaluationFunction: SearchEvaluationFunction<T>;
  quiescence?: boolean;
}

export type AlphaBetaSearchArguments<T extends IDraughtsEngine<Bitboard>> = {
  data: {
    engine: T;
    alpha: number;
    beta: number;
    depth: number;
  };
  options: {
    evaluationFunction: SearchEvaluationFunction<T>;
    enableQuiescence: boolean;
  };
};

export function alphaBeta<T extends IDraughtsEngine<Bitboard>>({
  maxDepth,
  evaluationFunction,
  quiescence = true,
}: AlphaBetaArguments<T>): DraughtsAI<T> {
  return (engine: T) => {
    let recordEvaluation = Number.NEGATIVE_INFINITY;
    let recordMove: DraughtsEngineMove<Bitboard> | undefined;

    for (const move of engine.moves) {
      const next = engine.clone();
      next.move(move);

      const evaluation = -alphaBetaSearch({
        data: {
          engine: next,
          alpha: Number.NEGATIVE_INFINITY,
          beta: Number.POSITIVE_INFINITY,
          depth: maxDepth - 1,
        },
        options: { evaluationFunction, enableQuiescence: quiescence },
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

function alphaBetaSearch<T extends IDraughtsEngine<Bitboard>>({
  data: { engine, alpha, beta, depth },
  options: { evaluationFunction, enableQuiescence },
}: AlphaBetaSearchArguments<T>) {
  if (depth === 0)
    return enableQuiescence
      ? quiescence({
          data: { engine, alpha, beta },
          options: { evaluationFunction },
        })
      : evaluationFunction(engine);

  for (const move of engine.moves) {
    const next = engine.clone();
    next.move(move);

    const evaluation = -alphaBetaSearch({
      data: {
        engine: next,
        alpha: -beta,
        beta: -alpha,
        depth: depth - 1,
      },
      options: { evaluationFunction, enableQuiescence },
    });
    if (evaluation >= beta) return beta;
    alpha = Math.max(evaluation, alpha);
  }

  return alpha;
}
