import { EnglishDraughts2D } from './2d';
import { EnglishDraughtsEngine } from './engine';

export function setup() {
  const engine = new EnglishDraughtsEngine();
  return { engine, draughts: new EnglishDraughts2D(engine) };
}
