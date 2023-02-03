import { Move, IDraughtsEngine } from '../../types';
import { englishDraughtsEvaluation } from './evaluate';
import { quiescenceSearch } from './quiescence-search';
import { EnglishDraughtsAI } from './types';

export type AlphaBetaEvaluationFunction = (
  engine: IDraughtsEngine<number>
) => number;

export interface AlphaBetaArguments {
  maxDepth: number;
  evaluateFn?: AlphaBetaEvaluationFunction;
  quiescence?: boolean;
}

export function alphaBeta({
  maxDepth,
  evaluateFn = englishDraughtsEvaluation,
  quiescence = true,
}: AlphaBetaArguments): EnglishDraughtsAI {
  return (engine: IDraughtsEngine<number>) => {
    let recordEvaluation = Number.NEGATIVE_INFINITY;
    let recordMove: Move<number> | undefined;

    for (const move of engine.moves()) {
      const next = engine.copy();
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

type AlphaBetaSearchArguments = {
  data: {
    engine: IDraughtsEngine<number>;
    alpha: number;
    beta: number;
    depth: number;
  };
  options: {
    evaluateFn: AlphaBetaEvaluationFunction;
    quiescence: boolean;
  };
};

function alphaBetaSearch({
  data: { engine, alpha, beta, depth },
  options: { evaluateFn, quiescence },
}: AlphaBetaSearchArguments) {
  if (depth === 0)
    return quiescence
      ? quiescenceSearch({
          data: { engine, alpha, beta },
          options: { evaluateFn },
        })
      : evaluateFn(engine);

  for (const move of engine.moves()) {
    const next = engine.copy();
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
