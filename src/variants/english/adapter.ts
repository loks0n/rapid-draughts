import {
  DraughtsEngineMove,
  DraughtsMove1D,
  DraughtsEngineBoard,
  DraughtsBoard1D,
  DraughtsPlayer,
} from '../../types';
import { AbstractDraughtsAdapter1D } from '../adapter';
import { EnglishDraughtsEngine } from './engine';
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

const SQUARE_TO_REF: Map<number | undefined, number | undefined> = new Map();
for (const [squareIndex, square] of ENGLISH_DRAUGHTS_LAYOUT.entries()) {
  SQUARE_TO_REF.set(square, squareIndex);
}

export class EnglishDraughtsAdapter1D extends AbstractDraughtsAdapter1D<EnglishDraughtsEngine> {
  convertEngineMoveToAdapterMove(
    engineMove: DraughtsEngineMove<number>
  ): DraughtsMove1D {
    const origin = SQUARE_TO_REF.get(engineMove.origin);
    if (origin === undefined) throw new Error('invalid move origin');

    const destination = SQUARE_TO_REF.get(engineMove.destination);
    if (destination === undefined) throw new Error('invalid move destination');

    const captures = [];
    for (const capture of splitBits(engineMove.captures)) {
      const captureRef = SQUARE_TO_REF.get(capture);
      if (captureRef) captures.push(captureRef);
    }

    return { origin, destination, captures };
  }

  convertAdapterMoveToEngineMove(
    adapterMove: DraughtsMove1D
  ): DraughtsEngineMove<number> {
    const origin = ENGLISH_DRAUGHTS_LAYOUT[adapterMove.origin];
    if (origin === undefined) throw new Error('invalid move origin');

    const destination = ENGLISH_DRAUGHTS_LAYOUT[adapterMove.destination];
    if (destination === undefined) throw new Error('invalid move destination');

    let captures = 0;
    for (const capture of adapterMove.captures) {
      const square = ENGLISH_DRAUGHTS_LAYOUT[capture];
      if (square === undefined) throw new Error('invalid move capture');
      captures |= square;
    }
    return { origin, destination, captures };
  }

  convertEngineBoardToAdapterBoard(
    engineBoard: DraughtsEngineBoard<number>
  ): DraughtsBoard1D {
    const board: DraughtsBoard1D = [];

    for (const [position, bit] of ENGLISH_DRAUGHTS_LAYOUT.entries()) {
      // light squares before
      if (Math.floor(position / 4) % 2 === 0) {
        board.push({ dark: false, piece: undefined, position: undefined });
      }

      const isLightPiece = !!(bit & engineBoard.light);
      const isDarkPiece = !!(bit & engineBoard.dark);
      const isKingPiece = !!(bit & engineBoard.king);

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
}
