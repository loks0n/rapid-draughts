import { cardinality } from '../english/utils';
import { Bitboard, IDraughtsEngine } from '../types';

export interface QuiescenceSearchArguments<T extends Bitboard> {
  data: {
    engine: IDraughtsEngine<T>;
    alpha: number;
    beta: number;
  };
  options: {
    evaluateFn: (engine: IDraughtsEngine<T>) => number;
  };
}

export function quiescenceSearch<T extends Bitboard>({
  data: { engine, alpha, beta },
  options: { evaluateFn },
}: QuiescenceSearchArguments<T>) {
  const evaluation = evaluateFn(engine);
  if (evaluation >= beta) return beta;
  alpha = Math.max(evaluation, alpha);

  for (const move of engine.moves()) {
    if (cardinality(move.captures) === 0) continue;

    const next = engine.clone();
    next.move(move);

    const nextEvaluation = -quiescenceSearch({
      data: { engine: next, alpha: -beta, beta: -alpha },
      options: { evaluateFn },
    });

    if (nextEvaluation >= beta) return beta;
    alpha = Math.max(nextEvaluation, alpha);
  }

  return alpha;
}
