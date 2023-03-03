import {
  DraughtsEngineBoard,
  DraughtsPlayer,
  IDraughtsEngine,
  WithAdapter1D,
} from '../../types';

export type EnglishDraughtsDrawCounter = {
  sinceCapture: number;
  sinceUncrownedAdvance: number;
};

export type EnglishDraughtsEngineConfig = {
  player?: DraughtsPlayer;
  board?: DraughtsEngineBoard<number>;
  drawCounters?: EnglishDraughtsDrawCounter;
};

export interface IEnglishDraughtsEngine
  extends IDraughtsEngine<number>,
    WithAdapter1D {
  drawCounters: EnglishDraughtsDrawCounter;
  serialize(): EnglishDraughtsEngineConfig;
}
