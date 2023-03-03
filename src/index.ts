import { random } from './ai/strategies/random';
import { alphaBeta } from './ai/strategies/alpha-beta';
import { quiescence } from './ai/strategies/quiescence';
import { english } from './ai/evaluation/english';

const evaluation = {
  english,
};

export const AI = {
  random,
  alphaBeta,
  quiescence,
  evaluation,
};

export { DraughtsPlayer, DraughtsStatus } from './types';
export type { DraughtsBoard1D, DraughtsMove1D } from './types';

export { EnglishDraughtsEngine as EnglishDraughts } from './variants/english/engine';
export type { EnglishDraughtsEngineConfig as EnglishDraughtsConfig } from './variants/english/types';
