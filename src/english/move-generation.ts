import { BitwiseNumber } from '../bitwise/number';
import { DraughtsEngineMove, DraughtsPlayer } from '../core/engine';
import { EnglishDraughtsEngine } from './engine';
import Mask from './mask';

export type EnglishDraughtsBoardIntermediates = {
  forward: number;
  backward: number;
  opponent: number;
  empty: number;
};

export class EnglishDraughtsMoveGenerator {
  private intermediates: EnglishDraughtsBoardIntermediates;

  constructor(intermediates: EnglishDraughtsBoardIntermediates) {
    this.intermediates = intermediates;
  }

  getJumpers(): number {
    let capture = BitwiseNumber.and(
      BitwiseNumber.rotRight(this.intermediates.empty, 7),
      BitwiseNumber.and(this.intermediates.opponent, Mask.FORWARD_LEFT)
    );
    let jumpers = BitwiseNumber.and(
      BitwiseNumber.rotRight(capture, 7),
      BitwiseNumber.and(this.intermediates.forward, Mask.FORWARD_LEFT)
    );

    capture = BitwiseNumber.and(
      BitwiseNumber.rotRight(this.intermediates.empty, 1),
      BitwiseNumber.and(this.intermediates.opponent, Mask.FORWARD_RIGHT)
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotRight(capture, 1),
        BitwiseNumber.and(this.intermediates.forward, Mask.FORWARD_RIGHT)
      )
    );

    capture = BitwiseNumber.and(
      BitwiseNumber.rotLeft(this.intermediates.empty, 1),
      BitwiseNumber.and(this.intermediates.opponent, Mask.BACKWARD_LEFT)
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotLeft(capture, 1),
        BitwiseNumber.and(this.intermediates.backward, Mask.BACKWARD_LEFT)
      )
    );

    capture = BitwiseNumber.and(
      BitwiseNumber.rotLeft(this.intermediates.empty, 7),
      BitwiseNumber.and(this.intermediates.opponent, Mask.BACKWARD_RIGHT)
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotLeft(capture, 7),
        BitwiseNumber.and(this.intermediates.backward, Mask.BACKWARD_RIGHT)
      )
    );

    return jumpers;
  }

  getMovers(): number {
    let movers = 0;

    if (this.intermediates.forward) {
      movers = BitwiseNumber.or(
        movers,
        BitwiseNumber.and(
          BitwiseNumber.and(
            BitwiseNumber.rotRight(this.intermediates.empty, 7),
            this.intermediates.forward
          ),
          Mask.FORWARD_LEFT
        )
      );
      movers = BitwiseNumber.or(
        movers,
        BitwiseNumber.and(
          BitwiseNumber.and(
            BitwiseNumber.rotRight(this.intermediates.empty, 1),
            this.intermediates.forward
          ),
          Mask.FORWARD_RIGHT
        )
      );
    }
    if (this.intermediates.backward) {
      movers = BitwiseNumber.or(
        movers,
        BitwiseNumber.and(
          BitwiseNumber.and(
            BitwiseNumber.rotLeft(this.intermediates.empty, 1),
            this.intermediates.backward
          ),
          Mask.BACKWARD_LEFT
        )
      );
      movers = BitwiseNumber.or(
        movers,
        BitwiseNumber.and(
          BitwiseNumber.and(
            BitwiseNumber.rotLeft(this.intermediates.empty, 7),
            this.intermediates.backward
          ),
          Mask.BACKWARD_RIGHT
        )
      );
    }

    return movers;
  }

  getMovesFromOrigin(origin: number): DraughtsEngineMove<number>[] {
    const moves: DraughtsEngineMove<number>[] = [];

    if (BitwiseNumber.and(origin, this.intermediates.forward)) {
      const d1 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(origin, Mask.FORWARD_LEFT), 7),
        this.intermediates.empty
      );
      if (d1) {
        moves.push({ origin, destination: d1, captures: 0 });
      }

      const d2 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(origin, Mask.FORWARD_RIGHT), 1),
        this.intermediates.empty
      );
      if (d2) {
        moves.push({ origin, destination: d2, captures: 0 });
      }
    }

    if (BitwiseNumber.and(origin, this.intermediates.backward)) {
      const d3 = BitwiseNumber.and(
        BitwiseNumber.rotRight(
          BitwiseNumber.and(origin, Mask.BACKWARD_LEFT),
          1
        ),
        this.intermediates.empty
      );
      if (d3) {
        moves.push({ origin, destination: d3, captures: 0 });
      }

      const d4 = BitwiseNumber.and(
        BitwiseNumber.rotRight(
          BitwiseNumber.and(origin, Mask.BACKWARD_RIGHT),
          7
        ),
        this.intermediates.empty
      );
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
          captures: BitwiseNumber.or(searchJump.captures, nextJump.captures),
        });
      }

      if (nextJumps.length === 0) moves.push(searchJump);
    }

    return moves;
  }

  getSingleJumpFromOrigin(origin: number): DraughtsEngineMove<number>[] {
    const moves: DraughtsEngineMove<number>[] = [];

    if (BitwiseNumber.and(origin, this.intermediates.forward)) {
      const c1 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(origin, Mask.FORWARD_LEFT), 7),
        this.intermediates.opponent
      );
      const d1 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(c1, Mask.FORWARD_LEFT), 7),
        this.intermediates.empty
      );
      if (d1) {
        moves.push({ origin, destination: d1, captures: c1 });
      }

      const c2 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(origin, Mask.FORWARD_RIGHT), 1),
        this.intermediates.opponent
      );
      const d2 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(c2, Mask.FORWARD_RIGHT), 1),
        this.intermediates.empty
      );
      if (d2) {
        moves.push({ origin, destination: d2, captures: c2 });
      }
    }

    if (BitwiseNumber.and(origin, this.intermediates.backward)) {
      const c3 = BitwiseNumber.and(
        BitwiseNumber.rotRight(
          BitwiseNumber.and(origin, Mask.BACKWARD_LEFT),
          1
        ),
        this.intermediates.opponent
      );
      const d3 = BitwiseNumber.and(
        BitwiseNumber.rotRight(BitwiseNumber.and(c3, Mask.BACKWARD_LEFT), 1),
        this.intermediates.empty
      );
      if (d3) {
        moves.push({ origin, destination: d3, captures: c3 });
      }

      const c4 = BitwiseNumber.and(
        BitwiseNumber.rotRight(
          BitwiseNumber.and(origin, Mask.BACKWARD_RIGHT),
          7
        ),
        this.intermediates.opponent
      );
      const d4 = BitwiseNumber.and(
        BitwiseNumber.rotRight(BitwiseNumber.and(c4, Mask.BACKWARD_RIGHT), 7),
        this.intermediates.empty
      );
      if (d4) {
        moves.push({ origin, destination: d4, captures: c4 });
      }
    }

    return moves;
  }

  private applyUnfinishedCapture(
    move: DraughtsEngineMove<number>
  ): EnglishDraughtsMoveGenerator {
    return new EnglishDraughtsMoveGenerator({
      forward: BitwiseNumber.and(this.intermediates.forward, move.origin)
        ? BitwiseNumber.or(this.intermediates.forward, move.destination)
        : this.intermediates.forward,
      backward: BitwiseNumber.and(this.intermediates.backward, move.origin)
        ? BitwiseNumber.or(this.intermediates.backward, move.destination)
        : this.intermediates.backward,
      opponent: BitwiseNumber.and(
        this.intermediates.opponent,
        BitwiseNumber.not(move.captures)
      ),
      empty: this.intermediates.empty,
    });
  }
}

export const EnglishDraughtsMoveGeneratorFactory = {
  fromEngine(engine: EnglishDraughtsEngine): EnglishDraughtsMoveGenerator {
    const { player, board } = engine.data;
    return new EnglishDraughtsMoveGenerator({
      forward:
        player === DraughtsPlayer.LIGHT
          ? board.light
          : BitwiseNumber.and(board.dark, board.king),
      backward:
        player === DraughtsPlayer.LIGHT
          ? BitwiseNumber.and(board.light, board.king)
          : board.dark,
      opponent: player === DraughtsPlayer.LIGHT ? board.dark : board.light,
      empty: BitwiseNumber.not(BitwiseNumber.or(board.light, board.dark)),
    });
  },
};
