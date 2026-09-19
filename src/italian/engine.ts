import { BitwiseNumber } from '../bitwise/number';
import type {
  DraughtsEngineData,
  DraughtsEngineMove,
  DraughtsEngineStrategy,
} from '../core/engine';
import { DraughtsEngine, DraughtsPlayer, DraughtsStatus } from '../core/engine';
import Mask from '../english/mask';
import { EnglishDraughtsEngineStrategy } from '../english/engine';
import { ItalianDraughtsMoveGeneratorFactory } from './move-generation';

export type ItalianDraughtsEngineData = DraughtsEngineData<number>;

export type ItalianDraughtsEngine = DraughtsEngine<number>;

export const ItalianDraughtsEngineDefaultData: ItalianDraughtsEngineData = {
  player: DraughtsPlayer.LIGHT,
  board: {
    light: Mask.LIGHT_START,
    dark: Mask.DARK_START,
    king: 0,
  },
  stats: {
    sinceCapture: 0,
    sinceNonKingAdvance: 0,
  },
};

export const ItalianDraughtsEngineStrategy: DraughtsEngineStrategy<number> = {
  ...EnglishDraughtsEngineStrategy,

  status(engine: ItalianDraughtsEngine) {
    if (engine.moves.length === 0) {
      return engine.data.player === DraughtsPlayer.LIGHT
        ? DraughtsStatus.DARK_WON
        : DraughtsStatus.LIGHT_WON;
    }

    const { board, stats } = engine.data;
    const bothHaveKing =
      BitwiseNumber.and(board.light, board.king) !== 0 &&
      BitwiseNumber.and(board.dark, board.king) !== 0;

    if (
      bothHaveKing &&
      stats.sinceCapture >= 80 &&
      stats.sinceNonKingAdvance >= 80
    ) {
      return DraughtsStatus.DRAW;
    }

    return DraughtsStatus.PLAYING;
  },

  moves(engine: ItalianDraughtsEngine) {
    const generator = ItalianDraughtsMoveGeneratorFactory.fromEngine(engine);

    const jumps = generator.getJumps();
    if (jumps.length > 0) return jumps;

    const movers = generator.getMovers();
    const moves: DraughtsEngineMove<number>[] = [];
    for (const mover of BitwiseNumber.decompose(movers)) {
      moves.push(...generator.getMovesFromOrigin(mover));
    }

    return moves;
  },

  move(engine: ItalianDraughtsEngine, move: DraughtsEngineMove<number>) {
    const data = EnglishDraughtsEngineStrategy.move(engine, move);
    const manMoved = !BitwiseNumber.and(move.origin, engine.data.board.king);
    return {
      ...data,
      stats: {
        ...data.stats,
        // the inherited english strategy never resets this counter
        sinceNonKingAdvance: manMoved
          ? 0
          : engine.data.stats.sinceNonKingAdvance + 1,
      },
    };
  },
};

export const ItalianDraughtsEngineFactory = {
  /**
   * Set up an Italian Draughts engine with optional data
   * @param data Optional data for the engine
   * @returns An Italian Draughts engine instance
   */
  setup(data?: Partial<ItalianDraughtsEngineData>): ItalianDraughtsEngine {
    return new DraughtsEngine(
      { ...ItalianDraughtsEngineDefaultData, ...data },
      ItalianDraughtsEngineStrategy
    );
  },
};
