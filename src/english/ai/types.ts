import { IDraughtsEngine, Move } from '../../types';

export type EnglishDraughtsAI = (
  engine: IDraughtsEngine<number>
) => Move<number> | undefined;
