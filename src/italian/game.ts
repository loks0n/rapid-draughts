import { DraughtsEngineData } from '../core/engine';
import {
  DraughtsBoard1D,
  DraughtsAdapter1D,
  DraughtsGame1D,
  DraughtsGameHistory1D,
} from '../core/game';
import { EnglishDraughtsAdapter1D } from '../english/game';
import { ItalianDraughtsEngineFactory } from './engine';

// The engine reuses English's board layout, so the adapter mirrors positions
// left-right to present the board in the Italian orientation
const mirrorPosition = (position: number): number =>
  !Number.isInteger(position) || position < 0 || position > 31
    ? position // invalid, rejected by the English adapter
    : Math.floor(position / 4) * 4 + (3 - (position % 4));

const BOARD_WIDTH = 8;

export const ItalianDraughtsAdapter1D: DraughtsAdapter1D<number> = {
  toMove1D(engineMove) {
    const move = EnglishDraughtsAdapter1D.toMove1D(engineMove);
    return {
      origin: mirrorPosition(move.origin),
      destination: mirrorPosition(move.destination),
      captures: move.captures.map(mirrorPosition),
    };
  },

  toEngineMove(move) {
    return EnglishDraughtsAdapter1D.toEngineMove({
      origin: mirrorPosition(move.origin),
      destination: mirrorPosition(move.destination),
      captures: move.captures.map(mirrorPosition),
    });
  },

  toBoard1D(engineBoard) {
    const board = EnglishDraughtsAdapter1D.toBoard1D(engineBoard);
    const mirrored: DraughtsBoard1D = [];
    for (let row = 0; row < BOARD_WIDTH; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const square = board[row * BOARD_WIDTH + (BOARD_WIDTH - 1 - col)];
        mirrored.push(
          square.dark
            ? { ...square, position: mirrorPosition(square.position) }
            : square
        );
      }
    }
    return mirrored;
  },
};

export const ItalianDraughtsDefaultHistory1D: DraughtsGameHistory1D = {
  moves: [],
  boards: [],
};

export type ItalianDraughtsGame = DraughtsGame1D<number>;

export const ItalianDraughts = {
  /**
   * Sets up a new Italian Draughts game
   * @param data Optional data to initialize the game engine
   * @param history Optional history to initialize the game
   * @returns The new Italian Draughts game
   */
  setup(
    data?: Partial<DraughtsEngineData<number>>,
    history?: Partial<DraughtsGameHistory1D>
  ): ItalianDraughtsGame {
    const engine = ItalianDraughtsEngineFactory.setup(data);
    return new DraughtsGame1D(
      engine,
      { ...ItalianDraughtsDefaultHistory1D, ...history },
      ItalianDraughtsAdapter1D
    );
  },
};
