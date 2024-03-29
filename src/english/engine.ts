import type {
  DraughtsEngineData,
  DraughtsEngineMove,
  DraughtsEngineStrategy,
} from '../core/engine';
import { DraughtsEngine, DraughtsStatus, DraughtsPlayer } from '../core/engine';
import { compareMove } from '../core/utils';
import Mask from './mask';
import { EnglishDraughtsMoveGeneratorFactory } from './move-generation';
import { decomposeBits } from './utils';

export type EnglishDraughtsEngineStore = {
  readonly sinceCapture: number;
  readonly sinceNonKingAdvance: number;
};

export type EnglishDraughtsEngineData = DraughtsEngineData<
  number,
  EnglishDraughtsEngineStore
>;

export type EnglishDraughtsEngine = DraughtsEngine<
  number,
  EnglishDraughtsEngineStore
>;

export const EnglishDraughtsEngineDefaultData: EnglishDraughtsEngineData = {
  player: DraughtsPlayer.DARK,
  board: {
    light: Mask.LIGHT_START,
    dark: Mask.DARK_START,
    king: 0,
  },
  store: {
    sinceCapture: 0,
    sinceNonKingAdvance: 0,
  },
};

export const EnglishDraughtsEngineStrategy: DraughtsEngineStrategy<
  number,
  EnglishDraughtsEngineStore
> = {
  serializeStore(store: EnglishDraughtsEngineStore) {
    return {
      ...store,
    };
  },

  status(engine: EnglishDraughtsEngine) {
    if (engine.moves.length === 0) {
      return engine.data.player === DraughtsPlayer.LIGHT
        ? DraughtsStatus.DARK_WON
        : DraughtsStatus.LIGHT_WON;
    }
    if (
      engine.data.store.sinceCapture >= 40 &&
      engine.data.store.sinceNonKingAdvance >= 40
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
      for (const jumper of decomposeBits(jumpers)) {
        moves.push(...generator.getJumpsFromOrigin(jumper));
      }
      return moves;
    }

    const movers = generator.getMovers();
    for (const mover of decomposeBits(movers)) {
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

    const store = { ...engine.data.store };

    board.light &= ~(move.origin | move.captures);
    board.dark &= ~(move.origin | move.captures);
    board.king &= ~(move.origin | move.captures);

    if (engine.data.board.light & move.origin) {
      board.light |= move.destination;
      board.king |= move.destination & Mask.RANK_7;
    } else {
      board.dark |= move.destination;
      board.king |= move.destination & Mask.RANK_0;
    }

    if (engine.data.board.king & move.origin) {
      board.king |= move.destination;
      store.sinceNonKingAdvance += 1;
    } else {
      store.sinceNonKingAdvance = 0;
    }

    if (move.captures) {
      store.sinceCapture = 0;
    } else {
      store.sinceCapture += 1;
    }

    return {
      player:
        engine.data.player === DraughtsPlayer.LIGHT
          ? DraughtsPlayer.DARK
          : DraughtsPlayer.LIGHT,
      board,
      store,
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
