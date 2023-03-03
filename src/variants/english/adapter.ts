import { S, splitBits } from './utils';
import {
  DraughtsBoard1D,
  DraughtsSquare1D as DraughtsSquare1D,
  DraughtsEngineMove,
  DraughtsMove1D,
  DraughtsPlayer,
  DraughtsStatus,
  IDraughtsGameAdapter1D,
} from '../../types';
import { IEnglishDraughtsEngine } from './types';

const ENGLISH_DRAUGHTS_LAYOUT = [
  undefined,
  S[11],
  undefined,
  S[5],
  undefined,
  S[31],
  undefined,
  S[25],
  S[10],
  undefined,
  S[4],
  undefined,
  S[30],
  undefined,
  S[24],
  undefined,
  undefined,
  S[3],
  undefined,
  S[29],
  undefined,
  S[23],
  undefined,
  S[17],
  S[2],
  undefined,
  S[28],
  undefined,
  S[22],
  undefined,
  S[16],
  undefined,
  undefined,
  S[27],
  undefined,
  S[21],
  undefined,
  S[15],
  undefined,
  S[9],
  S[26],
  undefined,
  S[20],
  undefined,
  S[14],
  undefined,
  S[8],
  undefined,
  undefined,
  S[19],
  undefined,
  S[13],
  undefined,
  S[7],
  undefined,
  S[1],
  S[18],
  undefined,
  S[12],
  undefined,
  S[6],
  undefined,
  S[0],
  undefined,
];

function isDarkSquare(squareIndex: number, boardSize = 8): boolean {
  const file = squareIndex % boardSize;
  const rank = Math.floor(squareIndex / boardSize);

  return (rank + file) % 2 === 0;
}

const SQUARE_TO_REF: Map<number | undefined, number | undefined> = new Map();
for (const [squareIndex, square] of ENGLISH_DRAUGHTS_LAYOUT.entries()) {
  SQUARE_TO_REF.set(square, squareIndex);
}

function convert1DMoveToEnglishEngineMove(
  move: DraughtsMove1D
): DraughtsEngineMove<number> {
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
  return { origin, destination, captures };
}

function convertEnglishEngineMoveTo1DMove(
  move: DraughtsEngineMove<number>
): DraughtsMove1D | undefined {
  const origin = SQUARE_TO_REF.get(move.origin);
  if (!origin) return;

  const destination = SQUARE_TO_REF.get(move.destination);
  if (!destination) return;

  const captures = [];
  for (const capture of splitBits(move.captures)) {
    const captureRef = SQUARE_TO_REF.get(capture);
    if (captureRef) captures.push(captureRef);
  }

  return { origin, destination, captures };
}

export class EnglishDraughtsAdapter1D implements IDraughtsGameAdapter1D {
  player: DraughtsPlayer;
  status: DraughtsStatus;

  private _board: DraughtsBoard1D | undefined;
  private _moves: DraughtsMove1D[] | undefined;
  private engine: IEnglishDraughtsEngine;

  constructor(engine: IEnglishDraughtsEngine) {
    this.engine = engine;
    this.status = engine.status;
    this.player = engine.player;
  }

  get board(): DraughtsBoard1D {
    return (this._board ??= this._initializeBoard());
  }

  private _initializeBoard(): DraughtsBoard1D {
    return ENGLISH_DRAUGHTS_LAYOUT.map<DraughtsSquare1D>((bit, index) => {
      if (bit === undefined || isDarkSquare(index)) {
        return { dark: false };
      }

      const isLightPiece = !!(bit & this.engine.board.light);
      const isDarkPiece = !!(bit & this.engine.board.dark);
      const isKingPiece = !!(bit & this.engine.board.king);

      return {
        dark: true,
        location: Math.floor(index / 2),
        piece:
          isLightPiece || isDarkPiece
            ? {
                player: isLightPiece
                  ? DraughtsPlayer.LIGHT
                  : DraughtsPlayer.DARK,
                king: isKingPiece,
              }
            : undefined,
      };
    });
  }

  get moves(): DraughtsMove1D[] {
    return (this._moves ??= this._initializeMoves());
  }

  private _initializeMoves(): DraughtsMove1D[] {
    const moves: DraughtsMove1D[] = [];

    for (const engineMove of this.engine.moves) {
      const move = convertEnglishEngineMoveTo1DMove(engineMove);
      if (move !== undefined) moves.push(move);
    }

    return moves;
  }

  move(move: DraughtsMove1D) {
    const engineMove = convert1DMoveToEnglishEngineMove(move);
    this.engine.move(engineMove);
  }

  toString() {
    const div = '---------------------------------';
    let str = `${div}\n`;

    for (const [ref, square] of this.board.entries()) {
      // is start of row
      if (ref % 8 === 0) {
        str += `|`;
      }

      // output square
      if (square.piece) {
        let char = square.piece.player === DraughtsPlayer.LIGHT ? 'x' : 'o';
        char = square.piece.king ? char.toUpperCase() : char;
        str += ` ${char} |`;
      } else {
        str += '   |';
      }

      // is end of row
      if (ref % 8 === 7) {
        str += ` \n${div}\n`;
      }
    }

    return str;
  }
}
