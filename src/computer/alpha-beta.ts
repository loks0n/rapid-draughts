import {
  DraughtsComputerStrategyArgs,
  SearchEvaluationFunction,
} from './computer';
import { Bitboard, DraughtsEngine, DraughtsEngineMove } from '../core/engine';

export type AlphaBetaOptions<TBitboard extends Bitboard, TStore> = {
  maxDepth: number;
  evaluationFunction: SearchEvaluationFunction<TBitboard, TStore>;
  quiescence?: boolean;
};

export async function alphaBeta<TBitboard extends Bitboard, TStore>({
  options: { maxDepth, evaluationFunction, quiescence = true },
  engine,
}: DraughtsComputerStrategyArgs<
  TBitboard,
  TStore,
  AlphaBetaOptions<TBitboard, TStore>
>): Promise<DraughtsEngineMove<TBitboard>> {
  let recordEvaluation = Number.NEGATIVE_INFINITY;
  let recordMove: DraughtsEngineMove<TBitboard> | undefined;

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

type AlphaBetaSearchArguments<TBitboard extends Bitboard, TStore> = {
  data: {
    engine: DraughtsEngine<TBitboard, TStore>;
    alpha: number;
    beta: number;
    depth: number;
  };
  options: Omit<AlphaBetaOptions<TBitboard, TStore>, 'maxDepth'>;
};

async function alphaBetaSearch<TBitboard extends Bitboard, TStore>({
  data: { engine, alpha, beta, depth },
  options: { evaluationFunction, quiescence },
}: AlphaBetaSearchArguments<TBitboard, TStore>) {
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

interface QuiescenceSearchArguments<TBitboard extends Bitboard, TStore> {
  data: {
    engine: DraughtsEngine<TBitboard, TStore>;
    alpha: number;
    beta: number;
  };
  options: {
    evaluationFunction: SearchEvaluationFunction<TBitboard, TStore>;
  };
}

async function quiescenceSearch<TBitboard extends Bitboard, TStore>({
  data: { engine, alpha, beta },
  options: { evaluationFunction },
}: QuiescenceSearchArguments<TBitboard, TStore>) {
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
