var W = Object.defineProperty;
var b = (h, t, e) => t in h ? W(h, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : h[t] = e;
var _ = (h, t, e) => (b(h, typeof t != "symbol" ? t + "" : t, e), e);
let s = [];
s[0] = 1;
for (let h = 1; h < 32; h++)
  s[h] = s[h - 1] * 2;
const m = 4095, M = 4293918720, T = 0, r = s[1] | s[2] | s[3] | s[9] | s[10] | s[11] | s[17] | s[18] | s[19] | s[25] | s[26] | s[27], u = s[4] | s[5] | s[6] | s[12] | s[13] | s[14] | s[20] | s[21] | s[22], p = s[28] | s[29] | s[30] | s[20] | s[21] | s[22] | s[12] | s[13] | s[14] | s[4] | s[5] | s[6], l = s[25] | s[26] | s[27] | s[17] | s[18] | s[19] | s[9] | s[10] | s[11], B = s[28] | s[29] | s[30] | s[31], I = s[0] | s[1] | s[2] | s[3];
function v(h) {
  let t = [];
  for (let e = 0; e < 32; e++) {
    const i = h & 1 << e;
    i && t.push(i);
  }
  return t;
}
function O(h) {
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
    let e = [];
    const i = v(t);
    for (const n of i) {
      const c = this._generateOriginJumps(n);
      e = e.concat(c);
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
    const c = (t & r) << 3 & this.noPieces;
    c && e.push({ origin: t, destination: c, captures: 0 });
    const o = (t & u) << 5 & this.noPieces;
    if (o && e.push({ origin: t, destination: o, captures: 0 }), t & this.whiteKing) {
      const f = t >> 4 & this.noPieces;
      f && e.push({ origin: t, destination: f, captures: 0 });
      const a = (t & p) >> 3 & this.noPieces;
      a && e.push({ origin: t, destination: a, captures: 0 });
      const k = (t & l) >> 5 & this.noPieces;
      k && e.push({ origin: t, destination: k, captures: 0 });
    }
    return e;
  }
  _generateOriginMovesBlack(t) {
    let e = [];
    const n = t >> 4 & this.noPieces;
    n && e.push({ origin: t, destination: n, captures: 0 });
    const c = (t & p) >> 3 & this.noPieces;
    c && e.push({ origin: t, destination: c, captures: 0 });
    const o = (t & l) >> 5 & this.noPieces;
    if (o && e.push({ origin: t, destination: o, captures: 0 }), t & this.blackKing) {
      const f = t << 4 & this.noPieces;
      f && e.push({ origin: t, destination: f, captures: 0 });
      const a = (t & r) << 3 & this.noPieces;
      a && e.push({ origin: t, destination: a, captures: 0 });
      const k = (t & u) << 5 & this.noPieces;
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
    const n = t << 4 & this.black, c = ((n & r) << 3 | (n & u) << 5) & this.noPieces;
    c && i.push({ origin: t, destination: c, captures: n });
    const o = ((t & r) << 3 | (t & u) << 5) & this.black, f = o << 4 & this.noPieces;
    if (f && i.push({ origin: t, destination: f, captures: o }), e) {
      const a = t >> 4 & this.black, k = ((a & p) >> 3 | (a & l) >> 5) & this.noPieces;
      k && i.push({ origin: t, destination: k, captures: a });
      const g = ((t & p) >> 3 | (t & l) >> 5) & this.black, P = g >> 4 & this.noPieces;
      P && i.push({ origin: t, destination: P, captures: g });
    }
    return i;
  }
  _generateOriginJumpBlack(t, e = t & this.blackKing) {
    let i = [];
    const n = t >> 4 & this.white, c = ((n & p) >> 3 | (n & l) >> 5) & this.noPieces;
    c && i.push({ origin: t, destination: c, captures: n });
    const o = ((t & p) >> 3 | (t & l) >> 5) & this.white, f = o >> 4 & this.noPieces;
    if (f && i.push({ origin: t, destination: f, captures: o }), e) {
      const a = t << 4 & this.white, k = ((a & r) << 3 | (a & u) << 5) & this.noPieces;
      k && i.push({ origin: t, destination: k, captures: a });
      const g = ((t & r) << 3 | (t & u) << 5) & this.white, P = g << 4 & this.noPieces;
      P && i.push({ origin: t, destination: P, captures: g });
    }
    return i;
  }
  _getJumpers() {
    return this.playerToMove === d.WHITE ? this._getWhiteJumpers() : this._getBlackJumpers();
  }
  _getBlackJumpers() {
    let t = 0, e = this.noPieces << 4 & this.white;
    return e && (t |= ((e & r) << 3 | (e & u) << 5) & this.black), e = ((this.noPieces & r) << 3 | (this.noPieces & u) << 5) & this.white, t |= e << 4 & this.black, this.blackKing && (e = this.noPieces >> 4 & this.white, e && (t |= ((e & p) >> 3 | (e & l) >> 5) & this.blackKing), e = ((this.noPieces & p) >> 3 | (this.noPieces & l) >> 5) & this.white, e && (t |= e >> 4 & this.blackKing)), t;
  }
  _getWhiteJumpers() {
    let t = 0, e = this.noPieces >> 4 & this.black;
    return e && (t |= ((e & p) >> 3 | (e & l) >> 5) & this.white), e = ((this.noPieces & p) >> 3 | (this.noPieces & l) >> 5) & this.black, t |= e >> 4 & this.white, this.whiteKing && (e = this.noPieces << 4 & this.black, e && (t |= ((e & r) << 3 | (e & u) << 5) & this.whiteKing), e = ((this.noPieces & r) << 3 | (this.noPieces & u) << 5) & this.black, e && (t |= e << 4 & this.whiteKing)), t;
  }
  _getMovers() {
    return this.playerToMove === d.WHITE ? this._getWhiteMovers() : this._getBlackMovers();
  }
  _getBlackMovers() {
    let t = this.noPieces << 4 & this.black;
    return t |= (this.noPieces & r) << 3 & this.black, t |= (this.noPieces & u) << 3 & this.black, this.blackKing && (t |= this.noPieces >> 4 & this.blackKing, t |= (this.noPieces & p) >> 3 & this.blackKing, t |= (this.noPieces & l) >> 5 & this.blackKing), t;
  }
  _getWhiteMovers() {
    let t = this.noPieces >> 4 & this.white;
    return t |= (this.noPieces & p) >> 3 & this.white, t |= (this.noPieces & l) >> 5 & this.white, this.whiteKing && (t |= this.noPieces << 4 & this.whiteKing, t |= (this.noPieces & r) << 3 & this.whiteKing, t |= (this.noPieces & u) << 3 & this.whiteKing), t;
  }
}
export {
  w as Draughts,
  s as S,
  O as getBitCount,
  v as getBitSplitArray
};
