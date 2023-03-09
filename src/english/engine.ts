import {
  DraughtsEngine,
  DraughtsEngineData,
  DraughtsEngineMove,
  DraughtsEngineStrategy,
  DraughtsPlayer,
  DraughtsStatus,
} from '../core/engine';
import * as Mask from './mask';
import { EnglishDraughtsMoveGenerator } from './move-generation';
import { equals, splitBits } from './utils';

export type EnglishDraughtsEngineStore = {
  sinceCapture: number;
  sinceNonKingAdvance: number;
};

export const EnglishDraughtsEngineDefaultData: DraughtsEngineData<
  number,
  EnglishDraughtsEngineStore
> = {
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

  status(engine: DraughtsEngine<number, EnglishDraughtsEngineStore>) {
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

  moves(engine: DraughtsEngine<number, EnglishDraughtsEngineStore>) {
    const generator = EnglishDraughtsMoveGenerator.fromPlayerAndBoard(
      engine.data.player,
      engine.data.board
    );

    const moves: DraughtsEngineMove<number>[] = [];

    const jumpers = generator.getJumpers();
    if (jumpers) {
      for (const jumper of splitBits(jumpers)) {
        moves.push(...generator.getJumpsFromOrigin(jumper));
      }
      return moves;
    }

    const movers = generator.getMovers();
    for (const mover of splitBits(movers)) {
      moves.push(...generator.getMovesFromOrigin(mover));
    }

    return moves;
  },

  move(
    engine: DraughtsEngine<number, EnglishDraughtsEngineStore>,
    move: DraughtsEngineMove<number>
  ) {
    if (!engine.moves.some((validMove) => equals(move, validMove))) {
      throw new Error('invalid move');
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

export const EnglishDraughtsEngine = {
  new(
    data?: Partial<DraughtsEngineData<number, EnglishDraughtsEngineStore>>
  ): DraughtsEngine<number, EnglishDraughtsEngineStore> {
    return new DraughtsEngine(
      { ...EnglishDraughtsEngineDefaultData, ...data },
      EnglishDraughtsEngineStrategy
    );
  },
};
