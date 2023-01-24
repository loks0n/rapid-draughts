import { Draughts } from "./draughts";

export function fromUCI(_uci: string): Draughts {
  return new Draughts();
}
