import {
  DraughtsEngineBoard,
  DraughtsEngineMove,
  DraughtsPlayer,
} from '../../types';
import * as Mask from './mask';
import { rotLeft, rotRight } from './utils';

export type EnglishDraughtsBoardIntermediates = {
  forward: number;
  backward: number;
  opponent: number;
  empty: number;
};

export class EnglishDraughtsMoveGenerator {
  private forward: number;
  private backward: number;
  private opponent: number;
  private empty: number;

  constructor(args: {
    forward: number;
    backward: number;
    opponent: number;
    empty: number;
  }) {
    this.forward = args.forward;
    this.backward = args.backward;
    this.opponent = args.opponent;
    this.empty = args.empty;
  }

  static fromPlayerAndBoard(
    player: DraughtsPlayer,
    board: DraughtsEngineBoard<number>
  ) {
    const forward =
      player === DraughtsPlayer.LIGHT ? board.light : board.dark & board.king;
    const backward =
      player === DraughtsPlayer.LIGHT ? board.light & board.king : board.dark;
    const opponent = player === DraughtsPlayer.LIGHT ? board.dark : board.light;
    const empty = ~(board.light | board.dark);

    return new EnglishDraughtsMoveGenerator({
      forward,
      backward,
      opponent,
      empty,
    });
  }

  getJumpers(): number {
    let capture = rotRight(this.empty, 7) & (this.opponent & Mask.FORWARD_LEFT);
    let jumpers = rotRight(capture, 7) & (this.forward & Mask.FORWARD_LEFT);

    capture = rotRight(this.empty, 1) & (this.opponent & Mask.FORWARD_RIGHT);
    jumpers |= rotRight(capture, 1) & (this.forward & Mask.FORWARD_RIGHT);

    capture = rotLeft(this.empty, 1) & (this.opponent & Mask.BACKWARD_LEFT);
    jumpers |= rotLeft(capture, 1) & (this.backward & Mask.BACKWARD_LEFT);

    capture = rotLeft(this.empty, 7) & (this.opponent & Mask.BACKWARD_RIGHT);
    jumpers |= rotLeft(capture, 7) & (this.backward & Mask.BACKWARD_RIGHT);

    return jumpers;
  }

  getMovers(): number {
    let movers = 0;

    if (this.forward) {
      movers |= rotRight(this.empty, 7) & this.forward & Mask.FORWARD_LEFT;
      movers |= rotRight(this.empty, 1) & this.forward & Mask.FORWARD_RIGHT;
    }
    if (this.backward) {
      movers |= rotLeft(this.empty, 1) & this.backward & Mask.BACKWARD_LEFT;
      movers |= rotLeft(this.empty, 7) & this.backward & Mask.BACKWARD_RIGHT;
    }

    return movers;
  }

  getMovesFromOrigin(origin: number): DraughtsEngineMove<number>[] {
    const moves: DraughtsEngineMove<number>[] = [];

    if (origin & this.forward) {
      const d1 = rotLeft(origin & Mask.FORWARD_LEFT, 7) & this.empty;
      if (d1) {
        moves.push({ origin, destination: d1, captures: 0 });
      }

      const d2 = rotLeft(origin & Mask.FORWARD_RIGHT, 1) & this.empty;
      if (d2) {
        moves.push({ origin, destination: d2, captures: 0 });
      }
    }

    if (origin & this.backward) {
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

  getJumpsFromOrigin(origin: number) {
    const searchStack = this.getSingleJumpFromOrigin(origin);
    const moves: DraughtsEngineMove<number>[] = [];

    while (searchStack.length > 0) {
      const searchJump = searchStack.pop();
      if (!searchJump) break;

      const nextBoard = this._fromMove({
        ...searchJump,
        origin,
      });

      const nextJumps = nextBoard.getSingleJumpFromOrigin(
        searchJump.destination
      );

      for (const nextJump of nextJumps) {
        searchStack.push({
          origin,
          destination: nextJump.destination,
          captures: searchJump.captures | nextJump.captures,
        });
      }

      if (nextJumps.length === 0) moves.push(searchJump);
    }

    return moves;
  }

  getSingleJumpFromOrigin(origin: number): DraughtsEngineMove<number>[] {
    const moves: DraughtsEngineMove<number>[] = [];

    if (origin & this.forward) {
      const c1 = rotLeft(origin & Mask.FORWARD_LEFT, 7) & this.opponent;
      // WARNING: Requires 0 fill shift to treat S[31] square as unsigned
      const d1 = (rotLeft(c1 & Mask.FORWARD_LEFT, 7) & this.empty) >>> 0;
      if (d1) {
        moves.push({ origin, destination: d1, captures: c1 });
      }

      const c2 = rotLeft(origin & Mask.FORWARD_RIGHT, 1) & this.opponent;
      // WARNING: Requires 0 fill shift to treat S[31] square as unsigned
      const d2 = (rotLeft(c2 & Mask.FORWARD_RIGHT, 1) & this.empty) >>> 0;
      if (d2) {
        moves.push({ origin, destination: d2, captures: c2 });
      }
    }

    if (origin & this.backward) {
      const c3 = rotRight(origin & Mask.BACKWARD_LEFT, 1) & this.opponent;
      const d3 = rotRight(c3 & Mask.BACKWARD_LEFT, 1) & this.empty;
      if (d3) {
        moves.push({ origin, destination: d3, captures: c3 });
      }

      const c4 = rotRight(origin & Mask.BACKWARD_RIGHT, 7) & this.opponent;
      const d4 = rotRight(c4 & Mask.BACKWARD_RIGHT, 7) & this.empty;
      if (d4) {
        moves.push({ origin, destination: d4, captures: c4 });
      }
    }

    return moves;
  }

  private _fromMove(
    move: DraughtsEngineMove<number>
  ): EnglishDraughtsMoveGenerator {
    return new EnglishDraughtsMoveGenerator({
      forward:
        this.forward & move.origin
          ? this.forward | move.destination
          : this.forward,
      backward:
        this.backward & move.origin
          ? this.backward | move.destination
          : this.backward,
      opponent: this.opponent & ~move.captures,
      empty: this.empty,
    });
  }
}
