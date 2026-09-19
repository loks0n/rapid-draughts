import { BitwiseNumber } from '../bitwise/number';
import { DraughtsEngineMove, DraughtsPlayer } from '../core/engine';
import { compareMove } from '../core/utils';
import { ItalianDraughtsEngine } from './engine';
import Mask from '../english/mask';

export type ItalianDraughtsBoardIntermediates = {
  forward: number;
  backward: number;
  king: number;
  opponent: number;
  opponentMen: number;
  opponentKing: number;
  empty: number;
};

export type ItalianDraughtsCaptureChain = {
  origin: number;
  destination: number;
  originIsKing: boolean;
  orderedCaptures: number[];
};

export class ItalianDraughtsMoveGenerator {
  private intermediates: ItalianDraughtsBoardIntermediates;

  constructor(intermediates: ItalianDraughtsBoardIntermediates) {
    this.intermediates = intermediates;
  }

  getJumps(): DraughtsEngineMove<number>[] {
    const chains: ItalianDraughtsCaptureChain[] = [];
    for (const jumper of BitwiseNumber.decompose(this.getJumpers())) {
      chains.push(...this.getJumpsFromOrigin(jumper));
    }
    if (chains.length === 0) return [];

    return deduplicateMoves(
      this.keepLegalChains(chains).map(chainToEngineMove)
    );
  }

  getJumpers(): number {
    const menForward = BitwiseNumber.and(
      this.intermediates.forward,
      BitwiseNumber.not(this.intermediates.king)
    );
    const menBackward = BitwiseNumber.and(
      this.intermediates.backward,
      BitwiseNumber.not(this.intermediates.king)
    );

    let capture = BitwiseNumber.and(
      BitwiseNumber.rotRight(this.intermediates.empty, 7),
      BitwiseNumber.and(this.intermediates.opponent, Mask.FORWARD_LEFT)
    );
    let jumpers = BitwiseNumber.and(
      BitwiseNumber.rotRight(capture, 7),
      BitwiseNumber.and(this.intermediates.king, Mask.FORWARD_LEFT)
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotRight(
          BitwiseNumber.and(capture, this.intermediates.opponentMen),
          7
        ),
        BitwiseNumber.and(menForward, Mask.FORWARD_LEFT)
      )
    );

    capture = BitwiseNumber.and(
      BitwiseNumber.rotRight(this.intermediates.empty, 1),
      BitwiseNumber.and(this.intermediates.opponent, Mask.FORWARD_RIGHT)
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotRight(capture, 1),
        BitwiseNumber.and(this.intermediates.king, Mask.FORWARD_RIGHT)
      )
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotRight(
          BitwiseNumber.and(capture, this.intermediates.opponentMen),
          1
        ),
        BitwiseNumber.and(menForward, Mask.FORWARD_RIGHT)
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
        BitwiseNumber.and(this.intermediates.king, Mask.BACKWARD_LEFT)
      )
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotLeft(
          BitwiseNumber.and(capture, this.intermediates.opponentMen),
          1
        ),
        BitwiseNumber.and(menBackward, Mask.BACKWARD_LEFT)
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
        BitwiseNumber.and(this.intermediates.king, Mask.BACKWARD_RIGHT)
      )
    );
    jumpers = BitwiseNumber.or(
      jumpers,
      BitwiseNumber.and(
        BitwiseNumber.rotLeft(
          BitwiseNumber.and(capture, this.intermediates.opponentMen),
          7
        ),
        BitwiseNumber.and(menBackward, Mask.BACKWARD_RIGHT)
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

  getJumpsFromOrigin(origin: number): ItalianDraughtsCaptureChain[] {
    const originIsKing = !!BitwiseNumber.and(origin, this.intermediates.king);
    const searchStack: ItalianDraughtsCaptureChain[] =
      this.getSingleJumpFromOrigin(origin).map((jump) => ({
        origin,
        destination: jump.destination,
        originIsKing,
        orderedCaptures: [jump.captures],
      }));
    const completedChains: ItalianDraughtsCaptureChain[] = [];

    while (searchStack.length > 0) {
      const searchChain = searchStack.pop();
      if (searchChain === undefined) break;

      const nextBoard = this.applyUnfinishedCapture({
        origin,
        destination: searchChain.destination,
        captures: BitwiseNumber.or(...searchChain.orderedCaptures),
      });

      const nextJumps = nextBoard.getSingleJumpFromOrigin(
        searchChain.destination
      );

      for (const nextJump of nextJumps) {
        searchStack.push({
          origin,
          destination: nextJump.destination,
          originIsKing,
          orderedCaptures: [...searchChain.orderedCaptures, nextJump.captures],
        });
      }

      if (nextJumps.length === 0) completedChains.push(searchChain);
    }

    return completedChains;
  }

  getSingleJumpFromOrigin(origin: number): DraughtsEngineMove<number>[] {
    const moves: DraughtsEngineMove<number>[] = [];

    const capturableOpponent = BitwiseNumber.and(
      origin,
      this.intermediates.king
    )
      ? this.intermediates.opponent
      : this.intermediates.opponentMen;

    if (BitwiseNumber.and(origin, this.intermediates.forward)) {
      const c1 = BitwiseNumber.and(
        BitwiseNumber.rotLeft(BitwiseNumber.and(origin, Mask.FORWARD_LEFT), 7),
        capturableOpponent
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
        capturableOpponent
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
        capturableOpponent
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
        capturableOpponent
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

  private keepLegalChains(
    chains: ItalianDraughtsCaptureChain[]
  ): ItalianDraughtsCaptureChain[] {
    const { opponentKing } = this.intermediates;

    let best = chains[0];
    for (const chain of chains.slice(1)) {
      if (rankCaptureChains(chain, best, opponentKing) > 0) {
        best = chain;
      }
    }
    return chains.filter(
      (chain) => rankCaptureChains(chain, best, opponentKing) === 0
    );
  }

  private applyUnfinishedCapture(
    move: DraughtsEngineMove<number>
  ): ItalianDraughtsMoveGenerator {
    const remaining = BitwiseNumber.not(move.captures);
    return new ItalianDraughtsMoveGenerator({
      forward: BitwiseNumber.and(this.intermediates.forward, move.origin)
        ? BitwiseNumber.or(this.intermediates.forward, move.destination)
        : this.intermediates.forward,
      backward: BitwiseNumber.and(this.intermediates.backward, move.origin)
        ? BitwiseNumber.or(this.intermediates.backward, move.destination)
        : this.intermediates.backward,
      king: BitwiseNumber.and(this.intermediates.king, move.origin)
        ? BitwiseNumber.or(this.intermediates.king, move.destination)
        : this.intermediates.king,
      opponent: BitwiseNumber.and(this.intermediates.opponent, remaining),
      opponentMen: BitwiseNumber.and(this.intermediates.opponentMen, remaining),
      opponentKing: BitwiseNumber.and(
        this.intermediates.opponentKing,
        remaining
      ),
      empty: this.intermediates.empty,
    });
  }
}

// Positive when the first chain outranks the second, negative when the
// second does, zero when they tie
function rankCaptureChains(
  first: ItalianDraughtsCaptureChain,
  second: ItalianDraughtsCaptureChain,
  opponentKing: number
): number {
  // More captured pieces outranks fewer
  if (first.orderedCaptures.length !== second.orderedCaptures.length) {
    return first.orderedCaptures.length - second.orderedCaptures.length;
  }

  // Moving a king outranks moving a man
  if (first.originIsKing !== second.originIsKing) {
    return first.originIsKing ? 1 : -1;
  }

  // More captured kings outranks fewer
  const countCapturedKings = (chain: ItalianDraughtsCaptureChain): number => {
    let count = 0;
    for (const capture of chain.orderedCaptures) {
      if (BitwiseNumber.and(capture, opponentKing)) count += 1;
    }
    return count;
  };
  const firstKingCount = countCapturedKings(first);
  const secondKingCount = countCapturedKings(second);
  if (firstKingCount !== secondKingCount) {
    return firstKingCount - secondKingCount;
  }

  // Taking a king earlier in the chain outranks taking one later
  for (let index = 0; index < first.orderedCaptures.length; index += 1) {
    const firstCapturesKing = !!BitwiseNumber.and(
      first.orderedCaptures[index],
      opponentKing
    );
    const secondCapturesKing = !!BitwiseNumber.and(
      second.orderedCaptures[index],
      opponentKing
    );
    if (firstCapturesKing !== secondCapturesKing) {
      return firstCapturesKing ? 1 : -1;
    }
  }

  return 0;
}

function chainToEngineMove(
  chain: ItalianDraughtsCaptureChain
): DraughtsEngineMove<number> {
  return {
    origin: chain.origin,
    destination: chain.destination,
    captures: BitwiseNumber.or(...chain.orderedCaptures),
  };
}

// Different capture paths may produce the same engine move
function deduplicateMoves(
  moves: DraughtsEngineMove<number>[]
): DraughtsEngineMove<number>[] {
  const uniqueMoves: DraughtsEngineMove<number>[] = [];
  for (const move of moves) {
    if (!uniqueMoves.some((existing) => compareMove(existing, move))) {
      uniqueMoves.push(move);
    }
  }
  return uniqueMoves;
}

export const ItalianDraughtsMoveGeneratorFactory = {
  fromEngine(engine: ItalianDraughtsEngine): ItalianDraughtsMoveGenerator {
    const { player, board } = engine.data;
    const own = player === DraughtsPlayer.LIGHT ? board.light : board.dark;
    const opponent = player === DraughtsPlayer.LIGHT ? board.dark : board.light;
    const ownKing = BitwiseNumber.and(own, board.king);

    return new ItalianDraughtsMoveGenerator({
      forward: player === DraughtsPlayer.LIGHT ? own : ownKing,
      backward: player === DraughtsPlayer.LIGHT ? ownKing : own,
      king: ownKing,
      opponent,
      opponentMen: BitwiseNumber.and(opponent, BitwiseNumber.not(board.king)),
      opponentKing: BitwiseNumber.and(opponent, board.king),
      empty: BitwiseNumber.not(BitwiseNumber.or(board.light, board.dark)),
    });
  },
};
