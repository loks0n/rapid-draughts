import { Move } from "./types";
export declare function getBitSplitArray(v: number): number[];
export declare function getBitCount(v: number): number;
export declare function formatBitToSquare(v: number): string;
export declare function formatBitToMultipleSquares(v: number): string;
export declare function formatMove(move: Move): {
    origin: string;
    destination: string;
    captures: string;
};
