import {
  IDraughts2D,
  IDraughtsEngine,
  Move,
  Move2D,
  Player,
  Square2D,
  Square2DRef,
} from '../types';
import { S, splitBits } from './utils';

const ENGLISH_DRAUGHTS_LAYOUT = [
  [undefined, S[11], undefined, S[5], undefined, S[31], undefined, S[25]],
  [S[10], undefined, S[4], undefined, S[30], undefined, S[24], undefined],
  [undefined, S[3], undefined, S[29], undefined, S[23], undefined, S[17]],
  [S[2], undefined, S[28], undefined, S[22], undefined, S[16], undefined],
  [undefined, S[27], undefined, S[21], undefined, S[15], undefined, S[9]],
  [S[26], undefined, S[20], undefined, S[14], undefined, S[8], undefined],
  [undefined, S[19], undefined, S[13], undefined, S[7], undefined, S[1]],
  [S[18], undefined, S[12], undefined, S[6], undefined, S[0], undefined],
];

const SQUARE_TO_REF: Record<number, Square2DRef> = {};
for (const [rankIndex, rank] of ENGLISH_DRAUGHTS_LAYOUT.entries()) {
  for (const [fileIndex, square] of rank.entries()) {
    if (square === undefined) continue;
    SQUARE_TO_REF[square] = { rank: rankIndex, file: fileIndex };
  }
}

export { SQUARE_TO_REF };

export class EnglishDraughts2D implements IDraughts2D {
  private engine: IDraughtsEngine<number>;

  constructor(engine: IDraughtsEngine<number>) {
    this.engine = engine;
  }

  player() {
    return this.engine.playerToMove;
  }

  status() {
    return this.engine.status();
  }

  board() {
    return ENGLISH_DRAUGHTS_LAYOUT.map<(Square2D | undefined)[]>((rank) => {
      return rank.map<Square2D | undefined>((bit) => {
        if (bit === undefined) return;

        const isLight = !!(bit & this.engine.board.light);
        const isDark = !!(bit & this.engine.board.dark);
        const isKing = !!(bit & this.engine.board.king);

        if (!(isLight || isDark)) return;
        return { player: isLight ? Player.LIGHT : Player.DARK, king: isKing };
      });
    });
  }

  private _isValidMove(move: Move<number>) {
    for (const validMove of this.engine.moves()) {
      if (
        move.origin === validMove.origin &&
        move.destination === validMove.destination &&
        move.captures === validMove.captures
      )
        return true;
    }
    return false;
  }

  move(move: Move2D) {
    const origin = ENGLISH_DRAUGHTS_LAYOUT[move.origin.rank][move.origin.file];
    if (origin === undefined) throw new Error('invalid move origin');

    const destination =
      ENGLISH_DRAUGHTS_LAYOUT[move.destination.rank][move.destination.file];
    if (destination === undefined) throw new Error('invalid move destination');

    let captures = 0;
    for (const capture of move.captures) {
      const square = ENGLISH_DRAUGHTS_LAYOUT[capture.rank][capture.file];
      if (square === undefined) throw new Error('invalid move capture');
      captures |= square;
    }

    const engineMove: Move<number> = { origin, destination, captures };

    if (!this._isValidMove(engineMove)) {
      throw new Error('invalid move');
    }

    this.engine.move(engineMove);
  }

  moves(): Move2D[] {
    const moves: Move2D[] = [];

    for (const move of this.engine.moves()) {
      moves.push({
        origin: SQUARE_TO_REF[move.origin],
        destination: SQUARE_TO_REF[move.destination],
        captures: splitBits(move.captures).map((capture) => {
          return SQUARE_TO_REF[capture];
        }),
      });
    }

    return moves;
  }

  toString() {
    const div = '---------------------------------';
    return `${div}\n${this.board()
      .reverse()
      .map((row) => {
        return `| ${row
          .map((square) => {
            if (!square) return ' ';
            const char = square.player === Player.LIGHT ? 'x' : 'o';
            return square.king ? char.toUpperCase() : char;
          })
          .join(' | ')} |`;
      })
      .join(`\n${div}\n`)}\n${div}`;
  }
}
