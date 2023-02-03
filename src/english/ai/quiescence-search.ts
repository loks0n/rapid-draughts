import { cardinality } from '../utils';
import { IDraughtsEngine } from '../../types';

export interface QuiescenceSearchArguments {
  data: {
    engine: IDraughtsEngine<number>;
    alpha: number;
    beta: number;
  };
  options: {
    evaluateFn: (engine: IDraughtsEngine<number>) => number;
  };
}

export function quiescenceSearch({
  data: { engine, alpha, beta },
  options: { evaluateFn },
}: QuiescenceSearchArguments) {
  const evaluation = evaluateFn(engine);
  if (evaluation >= beta) return beta;
  alpha = Math.max(evaluation, alpha);

  for (const move of engine.moves()) {
    if (cardinality(move.captures) === 0) continue;

    const next = engine.copy();
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
