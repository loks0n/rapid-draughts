import {
  DraughtsEngineBoard,
  DraughtsEngineMove,
  DraughtsPlayer,
  DraughtsStatus,
} from '../../types';
import { togglePlayer } from '../utils';
import { EnglishDraughtsAdapter1D } from './adapter';
import {
  applyMove,
  generateIntermediates,
  getJumpers,
  getMovers,
  getMovesFromOrigin,
  getMultipleJumpsFromOrigin,
} from './generation';

import * as Mask from './mask';
import {
  EnglishDraughtsDrawCounter,
  EnglishDraughtsEngineConfig,
  IEnglishDraughtsEngine,
} from './types';
import { splitBits } from './utils';

function engineMoveEquals(
  moveA: DraughtsEngineMove<number>,
  moveB: DraughtsEngineMove<number>
): boolean {
  return (
    moveA.origin === moveB.origin &&
    moveA.destination === moveB.destination &&
    moveA.captures === moveB.captures
  );
}

const DEFAULT_CONFIG = {
  player: DraughtsPlayer.DARK,
  board: {
    light: Mask.LIGHT_START,
    dark: Mask.DARK_START,
    king: 0,
  },
  drawCounters: {
    sinceCapture: 0,
    sinceUncrownedAdvance: 0,
  },
};

export class EnglishDraughtsEngine implements IEnglishDraughtsEngine {
  player: DraughtsPlayer;
  board: DraughtsEngineBoard<number>;
  drawCounters: EnglishDraughtsDrawCounter;

  adapter1D: EnglishDraughtsAdapter1D;

  private _moves: DraughtsEngineMove<number>[] | undefined;
  private _status: DraughtsStatus | undefined;

  constructor(config: EnglishDraughtsEngineConfig = DEFAULT_CONFIG) {
    this.player = config.player ?? DEFAULT_CONFIG.player;
    this.board = config.board ?? DEFAULT_CONFIG.board;
    this.drawCounters = config.drawCounters ?? DEFAULT_CONFIG.drawCounters;
    this.adapter1D = new EnglishDraughtsAdapter1D(this);
  }

  get status(): DraughtsStatus {
    return (this._status ??= this._initializeStatus());
  }

  private _initializeStatus(): DraughtsStatus {
    if (this.moves.length === 0) {
      return this.player === DraughtsPlayer.LIGHT
        ? DraughtsStatus.DARK_WON
        : DraughtsStatus.LIGHT_WON;
    }
    if (
      this.drawCounters.sinceCapture >= 40 &&
      this.drawCounters.sinceUncrownedAdvance >= 40
    ) {
      return DraughtsStatus.DRAW;
    }
    return DraughtsStatus.PLAYING;
  }

  get moves(): DraughtsEngineMove<number>[] {
    return (this._moves ??= this._initializeMoves());
  }

  private _initializeMoves(): DraughtsEngineMove<number>[] {
    const intermediates = generateIntermediates(this.player, this.board);

    const moves: DraughtsEngineMove<number>[] = [];

    const jumpers = getJumpers(intermediates);
    if (jumpers) {
      for (const jumper of splitBits(jumpers)) {
        moves.push(...getMultipleJumpsFromOrigin(intermediates, jumper));
      }
      return moves;
    }

    const movers = getMovers(intermediates);
    for (const mover of splitBits(movers)) {
      moves.push(...getMovesFromOrigin(intermediates, mover));
    }

    return moves;
  }

  move(move: DraughtsEngineMove<number>): void {
    if (!this.moves.some((validMove) => engineMoveEquals(move, validMove))) {
      throw new Error('invalid move');
    }

    this.player = togglePlayer(this.player);

    const { board, drawCounters } = applyMove(
      this.board,
      this.drawCounters,
      move
    );

    this.board = board;
    this.drawCounters = drawCounters;

    this._wipeCache();
  }

  private _wipeCache() {
    this._moves = undefined;
    this._status = undefined;
    this.adapter1D = new EnglishDraughtsAdapter1D(this);
  }

  serialize() {
    return {
      player: this.player,
      board: { ...this.board },
      drawCounters: { ...this.drawCounters },
    };
  }

  clone(): this {
    return new EnglishDraughtsEngine(this.serialize()) as this;
  }
}
