var W = Object.defineProperty;
var b = (h, t, e) => t in h ? W(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var _ = (h, t, e) => (b(h, typeof t != "symbol" ? t + "" : t, e), e);
let s = [];
s[0] = 1;
for (let h = 1; h < 32; h++)
  s[h] = s[h - 1] * 2;
const m = 255, M = 4278190080, T = 0, u = s[1] | s[2] | s[3] | s[9] | s[10] | s[11] | s[17] | s[18] | s[19] | s[25] | s[26] | s[27], p = s[4] | s[5] | s[6] | s[12] | s[13] | s[14] | s[20] | s[21] | s[22], l = s[28] | s[29] | s[30] | s[20] | s[21] | s[22] | s[12] | s[13] | s[14] | s[4] | s[5] | s[6], f = s[25] | s[26] | s[27] | s[17] | s[18] | s[19] | s[9] | s[10] | s[11], B = s[28] | s[29] | s[30] | s[31], I = s[0] | s[1] | s[2] | s[3];
function v(h) {
  let t = [];
  for (let e = 0; e < 32; e++) {
    const i = h & 1 << e;
    i && t.push(i);
  }
  return t;
}
function A(h) {
  let t = 0;
  for (let e = 0; e < 32; e++)
    h & 1 << e && (t += 1);
  return t;
}
var d = /* @__PURE__ */ ((h) => (h[h.WHITE = 0] = "WHITE", h[h.BLACK = 1] = "BLACK", h))(d || {}), K = /* @__PURE__ */ ((h) => (h[h.PLAYING = 0] = "PLAYING", h[h.BLACK_WON = 1] = "BLACK_WON", h[h.WHITE_WON = 2] = "WHITE_WON", h))(K || {});
class w {
  constructor(t = m, e = M, i = T, n = d.WHITE) {
    _(this, "white");
    _(this, "black");
    _(this, "king");
    _(this, "playerToMove");
    _(this, "noPieces");
    _(this, "whiteKing");
    _(this, "blackKing");
    _(this, "_moves", null);
    this.white = t, this.black = e, this.king = i, this.playerToMove = n, this.noPieces = ~(this.white | this.black), this.whiteKing = this.white & this.king, this.blackKing = this.black & this.king;
  }
  move(t) {
    let e = !1;
    for (const i of this.moves())
      i.captures === t.captures && i.destination === t.destination && i.origin === t.origin && (e = !0);
    if (!e)
      throw Error("invalid move");
    return this.playerToMove === d.WHITE ? this._moveWhite(t) : this._moveBlack(t);
  }
  moves() {
    if (this._moves === null) {
      const t = this._getJumpers();
      if (t)
        return this._generateJumps(t);
      const e = this._getMovers();
      this._moves = this._generateMoves(e);
    }
    return this._moves;
  }
  status() {
    return this.moves().length === 0 ? this.playerToMove === d.WHITE ? K.BLACK_WON : K.WHITE_WON : K.PLAYING;
  }
  _moveWhite(t) {
    const e = t.origin & this.king;
    let i = this.white ^ t.origin, n = this.king ^ e, c = this.black ^ t.captures;
    return n ^= t.captures & this.king, i |= t.destination, n |= e ? t.destination : t.destination & B, new w(i, c, n, d.BLACK);
  }
  _moveBlack(t) {
    const e = t.origin & this.king;
    let i = this.black ^ t.origin, n = this.king ^ e, c = this.white ^ t.captures;
    return n ^= t.captures & this.king, i |= t.destination, n |= e ? t.destination : t.destination & I, new w(c, i, n, d.WHITE);
  }
  _generateMoves(t) {
    let e = [];
    const i = v(t);
    for (const n of i)
      e = e.concat(this._generateOriginMoves(n));
    return e;
  }
  _generateJumps(t) {
    let e = [], i = 0;
    const n = v(t);
    for (const c of n)
      for (const o of this._generateOriginJumps(c)) {
        const a = A(o.captures);
        a > i ? e = [o] : a === i && e.push(o);
      }
    return e;
  }
  _generateOriginMoves(t) {
    return this.playerToMove === d.WHITE ? this._generateOriginMovesWhite(t) : this._generateOriginMovesBlack(t);
  }
  _generateOriginMovesWhite(t) {
    let e = [];
    const n = t << 4 & this.noPieces;
    n && e.push({ origin: t, destination: n, captures: 0 });
    const c = (t & u) << 3 & this.noPieces;
    c && e.push({ origin: t, destination: c, captures: 0 });
    const o = (t & p) << 5 & this.noPieces;
    if (o && e.push({ origin: t, destination: o, captures: 0 }), t & this.whiteKing) {
      const a = t >> 4 & this.noPieces;
      a && e.push({ origin: t, destination: a, captures: 0 });
      const r = (t & l) >> 3 & this.noPieces;
      r && e.push({ origin: t, destination: r, captures: 0 });
      const k = (t & f) >> 5 & this.noPieces;
      k && e.push({ origin: t, destination: k, captures: 0 });
    }
    return e;
  }
  _generateOriginMovesBlack(t) {
    let e = [];
    const n = t >> 4 & this.noPieces;
    n && e.push({ origin: t, destination: n, captures: 0 });
    const c = (t & l) >> 3 & this.noPieces;
    c && e.push({ origin: t, destination: c, captures: 0 });
    const o = (t & f) >> 5 & this.noPieces;
    if (o && e.push({ origin: t, destination: o, captures: 0 }), t & this.blackKing) {
      const a = t << 4 & this.noPieces;
      a && e.push({ origin: t, destination: a, captures: 0 });
      const r = (t & u) << 3 & this.noPieces;
      r && e.push({ origin: t, destination: r, captures: 0 });
      const k = (t & p) << 5 & this.noPieces;
      k && e.push({ origin: t, destination: k, captures: 0 });
    }
    return e;
  }
  _generateOriginJumps(t) {
    let e = this.playerToMove === d.WHITE ? this._generateOriginJumpWhite(t) : this._generateOriginJumpBlack(t), i = [];
    for (; e.length > 0; ) {
      const n = e.pop();
      if (!n)
        break;
      const c = this.playerToMove === d.WHITE ? this._generateOriginJumpWhite(
        n.destination,
        n.origin & this.king
      ) : this._generateOriginJumpBlack(
        n.destination,
        n.origin & this.king
      );
      c.length > 0 ? e.push(
        ...c.map((o) => ({
          origin: n.origin,
          destination: o.destination,
          captures: o.captures | n.captures
        }))
      ) : i.push(n);
    }
    return i;
  }
  _generateOriginJumpWhite(t, e = t & this.whiteKing) {
    let i = [];
    const n = t << 4 & this.black, c = ((n & u) << 3 | (n & p) << 5) & this.noPieces;
    c && i.push({ origin: t, destination: c, captures: n });
    const o = ((t & u) << 3 | (t & p) << 5) & this.black, a = o << 4 & this.noPieces;
    if (a && i.push({ origin: t, destination: a, captures: o }), e) {
      const r = t >> 4 & this.black, k = ((r & l) >> 3 | (r & f) >> 5) & this.noPieces;
      k && i.push({ origin: t, destination: k, captures: r });
      const g = ((t & l) >> 3 | (t & f) >> 5) & this.black, P = g >> 4 & this.noPieces;
      P && i.push({ origin: t, destination: P, captures: g });
    }
    return i;
  }
  _generateOriginJumpBlack(t, e = t & this.blackKing) {
    let i = [];
    const n = t >> 4 & this.white, c = ((n & l) >> 3 | (n & f) >> 5) & this.noPieces;
    c && i.push({ origin: t, destination: c, captures: n });
    const o = ((t & l) >> 3 | (t & f) >> 5) & this.white, a = o >> 4 & this.noPieces;
    if (a && i.push({ origin: t, destination: a, captures: o }), e) {
      const r = t << 4 & this.white, k = ((r & u) << 3 | (r & p) << 5) & this.noPieces;
      k && i.push({ origin: t, destination: k, captures: r });
      const g = ((t & u) << 3 | (t & p) << 5) & this.white, P = g << 4 & this.noPieces;
      P && i.push({ origin: t, destination: P, captures: g });
    }
    return i;
  }
  _getJumpers() {
    return this.playerToMove === d.WHITE ? this._getWhiteJumpers() : this._getBlackJumpers();
  }
  _getBlackJumpers() {
    let t = 0, e = this.noPieces << 4 & this.white;
    return e && (t |= ((e & u) << 3 | (e & p) << 5) & this.black), e = ((this.noPieces & u) << 3 | (this.noPieces & p) << 5) & this.white, t |= e << 4 & this.black, this.blackKing && (e = this.noPieces >> 4 & this.white, e && (t |= ((e & l) >> 3 | (e & f) >> 5) & this.blackKing), e = ((this.noPieces & l) >> 3 | (this.noPieces & f) >> 5) & this.white, e && (t |= e >> 4 & this.blackKing)), t;
  }
  _getWhiteJumpers() {
    let t = 0, e = this.noPieces >> 4 & this.black;
    return e && (t |= ((e & l) >> 3 | (e & f) >> 5) & this.white), e = ((this.noPieces & l) >> 3 | (this.noPieces & f) >> 5) & this.black, t |= e >> 4 & this.white, this.whiteKing && (e = this.noPieces << 4 & this.black, e && (t |= ((e & u) << 3 | (e & p) << 5) & this.whiteKing), e = ((this.noPieces & u) << 3 | (this.noPieces & p) << 5) & this.black, e && (t |= e << 4 & this.whiteKing)), t;
  }
  _getMovers() {
    return this.playerToMove === d.WHITE ? this._getWhiteMovers() : this._getBlackMovers();
  }
  _getBlackMovers() {
    let t = this.noPieces << 4 & this.black;
    return t |= (this.noPieces & u) << 3 & this.black, t |= (this.noPieces & p) << 3 & this.black, this.blackKing && (t |= this.noPieces >> 4 & this.blackKing, t |= (this.noPieces & l) >> 3 & this.blackKing, t |= (this.noPieces & f) >> 5 & this.blackKing), t;
  }
  _getWhiteMovers() {
    let t = this.noPieces >> 4 & this.white;
    return t |= (this.noPieces & l) >> 3 & this.white, t |= (this.noPieces & f) >> 5 & this.white, this.whiteKing && (t |= this.noPieces << 4 & this.whiteKing, t |= (this.noPieces & u) << 3 & this.whiteKing, t |= (this.noPieces & p) << 3 & this.whiteKing), t;
  }
}
export {
  w as Draughts,
  s as S
};
