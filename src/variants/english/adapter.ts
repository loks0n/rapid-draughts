import { S, splitBits } from './utils';
import {
  DraughtsBoard1D,
  DraughtsEngineMove,
  DraughtsMove1D,
  DraughtsPlayer,
  DraughtsStatus,
  IDraughtsGameAdapter1D,
} from '../../types';
import { IEnglishDraughtsEngine } from './types';

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
    const board: DraughtsBoard1D = [];

    for (const [position, bit] of ENGLISH_DRAUGHTS_LAYOUT.entries()) {
      // light squares before
      if (Math.floor(position / 4) % 2 === 0) {
        board.push({ dark: false, piece: undefined, position: undefined });
      }

      const isLightPiece = !!(bit & this.engine.board.light);
      const isDarkPiece = !!(bit & this.engine.board.dark);
      const isKingPiece = !!(bit & this.engine.board.king);

      // populated dark square
      board.push({
        dark: true,
        position,
        piece:
          isLightPiece || isDarkPiece
            ? {
                player: isLightPiece
                  ? DraughtsPlayer.LIGHT
                  : DraughtsPlayer.DARK,
                king: isKingPiece,
              }
            : undefined,
      });

      // light squares after
      if (Math.floor(position / 4) % 2 !== 0) {
        board.push({ dark: false, piece: undefined, position: undefined });
      }
    }

    return board;
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
