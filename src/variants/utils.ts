import Long from 'long';
import { DraughtsPlayer } from '../types';

export function togglePlayer(player: DraughtsPlayer): DraughtsPlayer {
  return player === DraughtsPlayer.LIGHT
    ? DraughtsPlayer.DARK
    : DraughtsPlayer.LIGHT;
}

export function cardinality(value: number | Long) {
  if (typeof value === 'number') return cardinalityNumber(value);
  return cardinalityLong(value);
}

export function cardinalityNumber(value: number): number {
  let count = 0;
  for (let index = 0; index < 32; index++) {
    if (value & (1 << index)) count += 1;
  }
  return count;
}

export function cardinalityLong(value: Long): number {
  return (
    cardinalityNumber(value.getLowBitsUnsigned()) +
    cardinalityNumber(value.getHighBitsUnsigned())
  );
}
