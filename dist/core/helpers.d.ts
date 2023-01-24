import { Move } from './types';
export declare function getBitSplitArray(value: number): number[];
export declare function getBitCount(value: number): number;
export declare function formatBitToSquare(value: number): string;
export declare function formatBitToMultipleSquares(value: number): string;
export declare function formatMove(move: Move): {
    origin: string;
    destination: string;
    captures: string;
};
