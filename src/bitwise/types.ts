export type Long = Uint32Array;
export type Bitboard = number | Long;

export interface IBitwiseOps<TBitboard extends Bitboard> {
  and(...args: TBitboard[]): TBitboard;
  or(...args: TBitboard[]): TBitboard;
  xor(a: TBitboard, b: TBitboard): TBitboard;
  not(a: TBitboard): TBitboard;
  rotLeft(a: TBitboard, shift: number): TBitboard;
  rotRight(a: TBitboard, shift: number): TBitboard;
  cardinality(a: TBitboard): number;
  decompose(a: TBitboard): TBitboard[];
}
