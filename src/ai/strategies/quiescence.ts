import { Bitboard, IDraughtsEngine } from '../../types';

export interface QuiescenceSearchArguments<
  T extends IDraughtsEngine<Bitboard>
> {
  data: {
    engine: T;
    alpha: number;
    beta: number;
  };
  options: {
    evaluationFunction: (engine: T) => number;
  };
}

export function quiescence<T extends IDraughtsEngine<Bitboard>>({
  data: { engine, alpha, beta },
  options: { evaluationFunction },
}: QuiescenceSearchArguments<T>) {
  const evaluation = evaluationFunction(engine);
  if (evaluation >= beta) return beta;
  alpha = Math.max(evaluation, alpha);

  for (const move of engine.moves) {
    if (!move.captures) continue;
    const next = engine.clone();
    next.move(move);

    const nextEvaluation = -quiescence({
      data: { engine: next, alpha: -beta, beta: -alpha },
      options: { evaluationFunction },
    });
    if (nextEvaluation >= beta) return beta;
    alpha = Math.max(nextEvaluation, alpha);
  }

  return alpha;
}
