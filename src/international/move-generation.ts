import { DraughtsEngineMove, DraughtsPlayer } from '../core/engine';
import Mask from './mask';
import Long from 'long';

export type InternationalDraughtsBoardIntermediates = {
  forward: Long;
  backward: Long;
  opponent: Long;
  empty: Long;
};

export class InternationalDraughtsMoveGenerator {
  private intermediates: InternationalDraughtsBoardIntermediates;

  constructor(intermediates: InternationalDraughtsBoardIntermediates) {
    this.intermediates = intermediates;
  }

  getJumpers(): Long {
    let capture = this.intermediates.empty
      .rotateRight(6)
      .and(this.intermediates.opponent.and(Mask.FORWARD_LEFT));
    let jumpers = capture
      .rotateRight(6)
      .and(this.intermediates.forward.and(Mask.FORWARD_LEFT));
    capture = this.intermediates.empty
      .rotateRight(5)
      .and(this.intermediates.opponent.and(Mask.FORWARD_RIGHT));
    jumpers = jumpers.or(
      capture
        .rotateRight(5)
        .and(this.intermediates.forward.and(Mask.FORWARD_RIGHT))
    );

    capture = this.intermediates.empty
      .rotateLeft(5)
      .and(this.intermediates.opponent.and(Mask.BACKWARD_LEFT));
    jumpers = jumpers.or(
      capture
        .rotateLeft(5)
        .and(this.intermediates.backward.and(Mask.BACKWARD_LEFT))
    );

    capture = this.intermediates.empty
      .rotateLeft(6)
      .and(this.intermediates.opponent.and(Mask.BACKWARD_RIGHT));
    jumpers = jumpers.or(
      capture
        .rotateLeft(6)
        .and(this.intermediates.backward.and(Mask.BACKWARD_RIGHT))
    );

    return jumpers;
  }

  getMovers(): Long {
    let movers = Long.fromNumber(0);

    if (this.intermediates.forward.notEquals(Long.fromNumber(0))) {
      movers = movers.or(
        this.intermediates.empty
          .rotateRight(6)
          .and(this.intermediates.forward.and(Mask.FORWARD_LEFT))
      );
      movers = movers.or(
        this.intermediates.empty
          .rotateRight(5)
          .and(this.intermediates.forward.and(Mask.FORWARD_RIGHT))
      );
    }
    if (this.intermediates.backward.notEquals(Long.fromNumber(0))) {
      movers = movers.or(
        this.intermediates.empty
          .rotateLeft(5)
          .and(this.intermediates.backward.and(Mask.BACKWARD_LEFT))
      );
      movers = movers.or(
        this.intermediates.empty
          .rotateLeft(6)
          .and(this.intermediates.backward.and(Mask.BACKWARD_RIGHT))
      );
    }

    return movers;
  }

  getMovesFromOrigin(origin: Long): DraughtsEngineMove<Long>[] {
    const moves: DraughtsEngineMove<Long>[] = [];

    if (origin.and(this.intermediates.forward).notEquals(Long.fromNumber(0))) {
      const d1 = origin
        .and(Mask.FORWARD_LEFT)
        .rotateLeft(6)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d1.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d1, captures: Long.fromNumber(0) });
      }

      const d2 = origin
        .and(Mask.FORWARD_RIGHT)
        .rotateLeft(5)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d2.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d2, captures: Long.fromNumber(0) });
      }
    }

    if (origin.and(this.intermediates.backward).notEquals(Long.fromNumber(0))) {
      const d3 = origin
        .and(Mask.BACKWARD_LEFT)
        .rotateRight(5)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d3.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d3, captures: Long.fromNumber(0) });
      }

      const d4 = origin
        .and(Mask.BACKWARD_RIGHT)
        .rotateRight(6)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d4.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d4, captures: Long.fromNumber(0) });
      }
    }

    return moves;
  }

  getJumpsFromOrigin(origin: Long) {
    const searchStack = this.getSingleJumpFromOrigin(origin);
    const moves: DraughtsEngineMove<Long>[] = [];

    while (searchStack.length > 0) {
      const searchJump = searchStack.pop();
      if (searchJump === undefined) break;

      const nextBoard = this.applyUnfinishedCapture({
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
          captures: searchJump.captures.or(nextJump.captures),
        });
      }

      if (nextJumps.length === 0) moves.push(searchJump);
    }

    return moves;
  }

  getSingleJumpFromOrigin(origin: Long): DraughtsEngineMove<Long>[] {
    const moves: DraughtsEngineMove<Long>[] = [];

    if (origin.and(this.intermediates.forward).notEquals(Long.fromNumber(0))) {
      const c1 = origin
        .and(Mask.FORWARD_LEFT)
        .rotateLeft(6)
        .and(this.intermediates.opponent)
        .toUnsigned();
      const d1 = c1
        .and(Mask.FORWARD_LEFT)
        .rotateLeft(6)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d1.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d1, captures: c1 });
      }

      const c2 = origin
        .and(Mask.FORWARD_RIGHT)
        .rotateLeft(5)
        .and(this.intermediates.opponent)
        .toUnsigned();
      const d2 = c2
        .and(Mask.FORWARD_RIGHT)
        .rotateLeft(5)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d2.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d2, captures: c2 });
      }
    }

    if (origin.and(this.intermediates.backward).notEquals(Long.fromNumber(0))) {
      const c3 = origin
        .and(Mask.BACKWARD_LEFT)
        .rotateRight(5)
        .and(this.intermediates.opponent)
        .toUnsigned();
      const d3 = c3
        .and(Mask.BACKWARD_LEFT)
        .rotateRight(5)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d3.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d3, captures: c3 });
      }

      const c4 = origin
        .and(Mask.BACKWARD_RIGHT)
        .rotateRight(6)
        .and(this.intermediates.opponent)
        .toUnsigned();
      const d4 = c4
        .and(Mask.BACKWARD_RIGHT)
        .rotateRight(6)
        .and(this.intermediates.empty)
        .toUnsigned();
      if (d4.notEquals(Long.fromNumber(0))) {
        moves.push({ origin, destination: d4, captures: c4 });
      }
    }

    return moves;
  }

  private applyUnfinishedCapture(
    move: DraughtsEngineMove<Long>
  ): InternationalDraughtsMoveGenerator {
    return new InternationalDraughtsMoveGenerator({
      forward: this.intermediates.forward
        .and(move.origin)
        .notEquals(Long.fromNumber(0))
        ? this.intermediates.forward.or(move.destination)
        : this.intermediates.forward,
      backward: this.intermediates.backward
        .and(move.origin)
        .notEquals(Long.fromNumber(0))
        ? this.intermediates.backward.or(move.destination)
        : this.intermediates.backward,
      opponent: this.intermediates.opponent.and(move.captures.not()),
      empty: this.intermediates.empty,
    });
  }
}
