import {
  IDraughts1D,
  IDraughtsEngine,
  Move,
  Move1D,
  Player,
  Square1D,
  Square1DRef,
} from '../types';
import { S, splitBits } from './utils';

const ENGLISH_DRAUGHTS_LAYOUT = [
  S[11],
  S[5],
  S[31],
  S[25],
  S[10],
  S[4],
  S[30],
  S[24],
  S[3],
  S[29],
  S[23],
  S[17],
  S[2],
  S[28],
  S[22],
  S[16],
  S[27],
  S[21],
  S[15],
  S[9],
  S[26],
  S[20],
  S[14],
  S[8],
  S[19],
  S[13],
  S[7],
  S[1],
  S[18],
  S[12],
  S[6],
  S[0],
];

// Create inverse map
const SQUARE_TO_REF: Map<number, Square1DRef> = new Map();
for (const [squareIndex, square] of ENGLISH_DRAUGHTS_LAYOUT.entries()) {
  SQUARE_TO_REF.set(square, squareIndex);
}

export { SQUARE_TO_REF };

export class EnglishDraughts1D implements IDraughts1D {
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
    return ENGLISH_DRAUGHTS_LAYOUT.map<Square1D | undefined>((bit) => {
      if (bit === undefined) return;

      const isLight = !!(bit & this.engine.board.light);
      const isDark = !!(bit & this.engine.board.dark);
      const isKing = !!(bit & this.engine.board.king);

      if (!(isLight || isDark)) return;
      return { player: isLight ? Player.LIGHT : Player.DARK, king: isKing };
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

  move(move: Move1D) {
    const origin = ENGLISH_DRAUGHTS_LAYOUT[move.origin];
    if (origin === undefined) throw new Error('invalid move origin');

    const destination = ENGLISH_DRAUGHTS_LAYOUT[move.destination];
    if (destination === undefined) throw new Error('invalid move destination');

    let captures = 0;
    for (const capture of move.captures) {
      const square = ENGLISH_DRAUGHTS_LAYOUT[capture];
      if (square === undefined) throw new Error('invalid move capture');
      captures |= square;
    }

    const engineMove: Move<number> = { origin, destination, captures };

    if (!this._isValidMove(engineMove)) {
      throw new Error('invalid move');
    }

    this.engine.move(engineMove);
  }

  moves(): Move1D[] {
    const moves: Move1D[] = [];

    for (const move of this.engine.moves()) {
      const origin = SQUARE_TO_REF.get(move.origin);
      if (!origin) continue;

      const destination = SQUARE_TO_REF.get(move.destination);
      if (!destination) continue;

      const captures = [];
      for (const capture of splitBits(move.captures)) {
        const captureRef = SQUARE_TO_REF.get(capture);
        if (captureRef) captures.push(captureRef);
      }

      moves.push({
        origin,
        destination,
        captures,
      });
    }

    return moves;
  }

  toString() {
    const div = '---------------------------------';
    let str = `${div}\n`;

    for (const [ref, square] of this.board().entries()) {
      // is start of row
      if (ref % 4 === 0) {
        str += `|`;
      }

      // empty square before
      if (Math.floor(ref / 4) % 2 === 0) {
        str += '   |';
      }

      // output square
      if (square) {
        let char = square.player === Player.LIGHT ? 'x' : 'o';
        char = square.king ? char.toUpperCase() : char;
        str += ` ${char} |`;
      } else {
        str += '   |';
      }

      // empty square after
      if (Math.floor(ref / 4) % 2 !== 0) {
        str += '   |';
      }

      // is end of row
      if (ref % 4 === 3) {
        str += ` \n${div}\n`;
      }
    }

    return str;
  }
}
