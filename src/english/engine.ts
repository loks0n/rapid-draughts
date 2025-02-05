import { BitwiseNumber } from '../bitwise/number';
import type {
  DraughtsEngineData,
  DraughtsEngineMove,
  DraughtsEngineStrategy,
} from '../core/engine';
import { DraughtsEngine, DraughtsStatus, DraughtsPlayer } from '../core/engine';
import { compareMove } from '../core/utils';
import Mask from './mask';
import { EnglishDraughtsMoveGeneratorFactory } from './move-generation';

export type EnglishDraughtsEngineData = DraughtsEngineData<number>;

export type EnglishDraughtsEngine = DraughtsEngine<number>;

export const EnglishDraughtsEngineDefaultData: EnglishDraughtsEngineData = {
  player: DraughtsPlayer.DARK,
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

export const EnglishDraughtsEngineStrategy: DraughtsEngineStrategy<number> = {
  status(engine: EnglishDraughtsEngine) {
    if (engine.moves.length === 0) {
      return engine.data.player === DraughtsPlayer.LIGHT
        ? DraughtsStatus.DARK_WON
        : DraughtsStatus.LIGHT_WON;
    }
    if (
      engine.data.stats.sinceCapture >= 40 &&
      engine.data.stats.sinceNonKingAdvance >= 40
    ) {
      return DraughtsStatus.DRAW;
    }
    return DraughtsStatus.PLAYING;
  },

  isValidMove(engine: EnglishDraughtsEngine, move: DraughtsEngineMove<number>) {
    return engine.moves.some((validMove) => compareMove(move, validMove));
  },

  moves(engine: EnglishDraughtsEngine) {
    const generator = EnglishDraughtsMoveGeneratorFactory.fromEngine(engine);
    const moves: DraughtsEngineMove<number>[] = [];

    const jumpers = generator.getJumpers();
    if (jumpers) {
      for (const jumper of BitwiseNumber.decompose(jumpers)) {
        moves.push(...generator.getJumpsFromOrigin(jumper));
      }
      return moves;
    }

    const movers = generator.getMovers();
    for (const mover of BitwiseNumber.decompose(movers)) {
      moves.push(...generator.getMovesFromOrigin(mover));
    }

    return moves;
  },

  move(engine: EnglishDraughtsEngine, move: DraughtsEngineMove<number>) {
    if (!engine.isValidMove(move)) {
      throw new Error(`invalid move: ${JSON.stringify(move)}`);
    }

    const board = {
      ...engine.data.board,
    };

    const stats = { ...engine.data.stats };

    // Remove the origin and captures from the color boards
    const isKing = BitwiseNumber.and(move.origin, engine.data.board.king);
    const remaining = BitwiseNumber.not(
      BitwiseNumber.or(move.origin, move.captures)
    );

    board.light = BitwiseNumber.and(board.light, remaining);
    board.dark = BitwiseNumber.and(board.dark, remaining);
    board.king = BitwiseNumber.and(board.king, remaining);

    // Add the destination to the color board
    if (BitwiseNumber.and(move.origin, engine.data.board.light)) {
      board.light = BitwiseNumber.or(board.light, move.destination);
    } else {
      board.dark = BitwiseNumber.or(board.dark, move.destination);
    }

    if (isKing) {
      board.king = BitwiseNumber.or(board.king, move.destination);
    }

    board.king = BitwiseNumber.or(
      board.king,
      BitwiseNumber.and(
        move.destination,
        BitwiseNumber.or(Mask.RANK_0, Mask.RANK_7)
      )
    );

    // Add the destination to the king board
    if (BitwiseNumber.and(move.destination, engine.data.board.king)) {
      board.king = BitwiseNumber.or(board.king, move.destination);
      stats.sinceNonKingAdvance = 0;
    } else {
      stats.sinceNonKingAdvance += 1;
    }

    if (move.captures) {
      stats.sinceCapture = 0;
    } else {
      stats.sinceCapture += 1;
    }

    return {
      player:
        engine.data.player === DraughtsPlayer.LIGHT
          ? DraughtsPlayer.DARK
          : DraughtsPlayer.LIGHT,
      board,
      stats,
    };
  },
};

export const EnglishDraughtsEngineFactory = {
  /**
   * Set up an English Draughts engine with optional data
   * @param data Optional data for the engine
   * @returns An English Draughts engine instance
   */
  setup(data?: Partial<EnglishDraughtsEngineData>): EnglishDraughtsEngine {
    return new DraughtsEngine(
      { ...EnglishDraughtsEngineDefaultData, ...data },
      EnglishDraughtsEngineStrategy
    );
  },
};
