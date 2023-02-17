import {
  Board,
  IDraughtsBoard,
  IDraughtsState,
  Move,
  Player,
  Status,
} from '../types';
import * as Mask from './mask';
import { rotLeft, rotRight, splitBits } from './utils';

export class EnglishDraughtsEngine
  implements IDraughtsBoard<number>, IDraughtsState
{
  board: Board<number>;
  playerToMove: Player;

  private cache = {
    lastCapture: 0,
    lastUncrownedAdvance: 0,
  };

  private _moves: Move<number>[] | undefined;

  private empty: number;
  private lightKing: number;
  private darkKing: number;

  constructor({
    board = { light: Mask.LIGHT_START, dark: Mask.DARK_START, king: 0 },
    playerToMove = Player.DARK,
    cache = {
      lastCapture: 0,
      lastUncrownedAdvance: 0,
    },
  } = {}) {
    this.board = board;
    this.playerToMove = playerToMove;
    this.cache = cache;

    this.empty = ~(board.light | board.dark);
    this.lightKing = board.light & board.king;
    this.darkKing = board.dark & board.king;
  }

  serialize() {
    return {
      board: { ...this.board },
      playerToMove: this.playerToMove,
      cache: { ...this.cache },
    };
  }

  clone() {
    return new EnglishDraughtsEngine({
      board: { ...this.board },
      playerToMove: this.playerToMove,
      cache: { ...this.cache },
    });
  }

  status(): Status {
    if (this.moves().length === 0) {
      return this.playerToMove === Player.LIGHT
        ? Status.DARK_WON
        : Status.LIGHT_WON;
    }
    if (this.cache.lastCapture >= 40 && this.cache.lastUncrownedAdvance >= 40) {
      return Status.DRAW;
    }
    return Status.PLAYING;
  }

  moves(): Move<number>[] {
    if (this._moves !== undefined) return this._moves;

    const player = {
      forward:
        this.playerToMove === Player.LIGHT ? this.board.light : this.darkKing,
      backward:
        this.playerToMove === Player.LIGHT ? this.lightKing : this.board.dark,
      opponent:
        this.playerToMove === Player.LIGHT ? this.board.dark : this.board.light,
    };

    const moves: Move<number>[] = [];

    const jumpers = this.getJumpers(player);
    if (jumpers) {
      for (const jumper of splitBits(jumpers)) {
        moves.push(...this.getMultipleJumpsFromOrigin(jumper, player));
      }
      return moves;
    }

    const movers = this.getMovers(player);

    for (const mover of splitBits(movers)) {
      moves.push(...this.getMovesFromOrigin(mover, player));
    }

    this._moves = moves;
    return this._moves;
  }

  move(move: Move<number>) {
    const board = {
      ...this.board,
    };

    board.light &= ~(move.origin | move.captures);
    board.dark &= ~(move.origin | move.captures);
    board.king &= ~(move.origin | move.captures);

    if (this.board.light & move.origin) {
      board.light |= move.destination;
      board.king |= move.destination & Mask.RANK_7;
    } else {
      board.dark |= move.destination;
      board.king |= move.destination & Mask.RANK_0;
    }

    if (this.board.king & move.origin) {
      board.king |= move.destination;
      this.cache.lastUncrownedAdvance += 1;
    } else {
      this.cache.lastUncrownedAdvance = 0;
    }

    if (move.captures) {
      this.cache.lastCapture = 0;
    } else {
      this.cache.lastCapture += 1;
    }

    this._moves = undefined;
    this.board = board;
    this.playerToMove =
      this.playerToMove === Player.LIGHT ? Player.DARK : Player.LIGHT;

    this.empty = ~(board.light | board.dark);
    this.lightKing = board.light & board.king;
    this.darkKing = board.dark & board.king;
  }

  private getMultipleJumpsFromOrigin(
    origin: number,
    player: {
      forward: number;
      backward: number;
      opponent: number;
    }
  ) {
    const searchStack = this.getSingleJumpFromOrigin(origin, player);
    const moves: Move<number>[] = [];

    while (searchStack.length > 0) {
      const searchJump = searchStack.pop();
      if (!searchJump) break;

      const nextSearchPlayer = {
        opponent: player.opponent & ~searchJump.captures,
        forward:
          player.forward & origin
            ? player.forward | searchJump.destination
            : player.forward,
        backward:
          player.backward & origin
            ? player.backward | searchJump.destination
            : player.backward,
      };

      const nextJumps = this.getSingleJumpFromOrigin(
        searchJump.destination,
        nextSearchPlayer
      );

      if (nextJumps.length === 0) {
        moves.push(searchJump);
        continue;
      }

      for (const nextJump of nextJumps) {
        searchStack.push({
          origin,
          destination: nextJump.destination,
          captures: searchJump.captures | nextJump.captures,
        });
      }
    }

    return moves;
  }

  private getSingleJumpFromOrigin(
    origin: number,
    player: {
      forward: number;
      backward: number;
      opponent: number;
    }
  ): Move<number>[] {
    const moves: Move<number>[] = [];

    if (origin & player.forward) {
      // WANRING: Requires 0 shift to treat S[31] square as unsigned
      const c1 = rotLeft(origin & Mask.FORWARD_LEFT, 7) & player.opponent;
      const d1 = (rotLeft(c1 & Mask.FORWARD_LEFT, 7) & this.empty) >>> 0;
      if (d1) {
        moves.push({ origin, destination: d1, captures: c1 });
      }

      const c2 = rotLeft(origin & Mask.FORWARD_RIGHT, 1) & player.opponent;
      const d2 = rotLeft(c2 & Mask.FORWARD_RIGHT, 1) & this.empty;
      if (d2) {
        moves.push({ origin, destination: d2, captures: c2 });
      }
    }

    if (origin & player.backward) {
      const c3 = rotRight(origin & Mask.BACKWARD_LEFT, 1) & player.opponent;
      const d3 = rotRight(c3 & Mask.BACKWARD_LEFT, 1) & this.empty;
      if (d3) {
        moves.push({ origin, destination: d3, captures: c3 });
      }

      const c4 = rotRight(origin & Mask.BACKWARD_RIGHT, 7) & player.opponent;
      const d4 = rotRight(c4 & Mask.BACKWARD_RIGHT, 7) & this.empty;
      if (d4) {
        moves.push({ origin, destination: d4, captures: c4 });
      }
    }

    return moves;
  }

  private getMovesFromOrigin(
    origin: number,
    player: {
      forward: number;
      backward: number;
    }
  ): Move<number>[] {
    const moves: Move<number>[] = [];

    if (origin & player.forward) {
      const d1 = rotLeft(origin & Mask.FORWARD_LEFT, 7) & this.empty;
      if (d1) {
        moves.push({ origin, destination: d1, captures: 0 });
      }

      const d2 = rotLeft(origin & Mask.FORWARD_RIGHT, 1) & this.empty;
      if (d2) {
        moves.push({ origin, destination: d2, captures: 0 });
      }
    }

    if (origin & player.backward) {
      const d3 = rotRight(origin & Mask.BACKWARD_LEFT, 1) & this.empty;
      if (d3) {
        moves.push({ origin, destination: d3, captures: 0 });
      }

      const d4 = rotRight(origin & Mask.BACKWARD_RIGHT, 7) & this.empty;
      if (d4) {
        moves.push({ origin, destination: d4, captures: 0 });
      }
    }

    return moves;
  }

  private getJumpers(player: {
    forward: number;
    backward: number;
    opponent: number;
  }): number {
    let capture =
      rotRight(this.empty, 7) & (player.opponent & Mask.FORWARD_LEFT);
    let jumpers = rotRight(capture, 7) & (player.forward & Mask.FORWARD_LEFT);

    capture = rotRight(this.empty, 1) & (player.opponent & Mask.FORWARD_RIGHT);
    jumpers |= rotRight(capture, 1) & (player.forward & Mask.FORWARD_RIGHT);

    capture = rotLeft(this.empty, 1) & (player.opponent & Mask.BACKWARD_LEFT);
    jumpers |= rotLeft(capture, 1) & (player.backward & Mask.BACKWARD_LEFT);

    capture = rotLeft(this.empty, 7) & (player.opponent & Mask.BACKWARD_RIGHT);
    jumpers |= rotLeft(capture, 7) & (player.backward & Mask.BACKWARD_RIGHT);

    return jumpers;
  }

  private getMovers(player: { forward: number; backward: number }): number {
    let movers = 0;

    if (player.forward) {
      movers |= rotRight(this.empty, 7) & player.forward & Mask.FORWARD_LEFT;
      movers |= rotRight(this.empty, 1) & player.forward & Mask.FORWARD_RIGHT;
    }
    if (player.backward) {
      movers |= rotLeft(this.empty, 1) & player.backward & Mask.BACKWARD_LEFT;
      movers |= rotLeft(this.empty, 7) & player.backward & Mask.BACKWARD_RIGHT;
    }

    return movers;
  }
}
