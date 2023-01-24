export declare enum Player {
    WHITE = 0,
    BLACK = 1
}
export declare enum Status {
    PLAYING = 0,
    BLACK_WON = 1,
    WHITE_WON = 2
}
export declare type Move = {
    origin: number;
    destination: number;
    captures: number;
};
