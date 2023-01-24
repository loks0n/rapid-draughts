var W = Object.defineProperty;
var N = (s, t, e) => t in s ? W(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var v = (s, t, e) => (N(s, typeof t != "symbol" ? t + "" : t, e), e);
const n = [];
n[0] = 1;
for (let s = 1; s < 32; s++)
  n[s] = n[s - 1] * 2;
const E = 4095, A = 4293918720, B = 0, u = n[1] | n[2] | n[3] | n[9] | n[10] | n[11] | n[17] | n[18] | n[19] | n[25] | n[26] | n[27], p = n[4] | n[5] | n[6] | n[12] | n[13] | n[14] | n[20] | n[21] | n[22], l = n[28] | n[29] | n[30] | n[20] | n[21] | n[22] | n[12] | n[13] | n[14] | n[4] | n[5] | n[6], f = n[25] | n[26] | n[27] | n[17] | n[18] | n[19] | n[9] | n[10] | n[11], O = n[28] | n[29] | n[30] | n[31], S = n[0] | n[1] | n[2] | n[3];
function I(s) {
  const t = [];
  for (let e = 0; e < 32; e++) {
    const i = s & 1 << e;
    i && t.push(i);
  }
  return t;
}
function m(s) {
  let t = 0;
  for (let e = 0; e < 32; e++)
    s & 1 << e && (t += 1);
  return t;
}
function g(s) {
  for (let t = 0; t < 32; t++)
    if (s & 1 << t)
      return `S[${t}]`;
  return "-";
}
function b(s) {
  return I(s).map((t) => g(t)).join(" | ");
}
function H(s) {
  return {
    origin: g(s.origin),
    destination: g(s.destination),
    captures: b(s.captures)
  };
}
const C = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatBitToMultipleSquares: b,
  formatBitToSquare: g,
  formatMove: H,
  getBitCount: m,
  getBitSplitArray: I
}, Symbol.toStringTag, { value: "Module" }));
var r = /* @__PURE__ */ ((s) => (s[s.WHITE = 0] = "WHITE", s[s.BLACK = 1] = "BLACK", s))(r || {}), d = /* @__PURE__ */ ((s) => (s[s.PLAYING = 0] = "PLAYING", s[s.BLACK_WON = 1] = "BLACK_WON", s[s.WHITE_WON = 2] = "WHITE_WON", s))(d || {});
class M {
  constructor(t = E, e = A, i = B, o = r.WHITE) {
    v(this, "white");
    v(this, "black");
    v(this, "king");
    v(this, "playerToMove");
    v(this, "noPieces");
    v(this, "whiteKing");
    v(this, "blackKing");
    v(this, "_moves");
    this.white = t, this.black = e, this.king = i, this.playerToMove = o, this.noPieces = ~(this.white | this.black), this.whiteKing = this.white & this.king, this.blackKing = this.black & this.king;
  }
  move(t) {
    let e = !1;
    for (const i of this.moves())
      i.captures === t.captures && i.destination === t.destination && i.origin === t.origin && (e = !0);
    if (!e)
      throw new Error("invalid move");
    return this.playerToMove === r.WHITE ? this._moveWhite(t) : this._moveBlack(t);
  }
  moves() {
    if (this._moves === void 0) {
      const t = this._getJumpers();
      if (t)
        return this._generateJumps(t);
      const e = this._getMovers();
      this._moves = this._generateMoves(e);
    }
    return this._moves;
  }
  status() {
    return this.moves().length === 0 ? this.playerToMove === r.WHITE ? d.BLACK_WON : d.WHITE_WON : d.PLAYING;
  }
  _moveWhite(t) {
    const e = t.origin & this.king;
    let i = this.white ^ t.origin, o = this.king ^ e;
    const c = this.black ^ t.captures;
    return o ^= t.captures & this.king, i |= t.destination, o |= e ? t.destination : t.destination & O, new M(i, c, o, r.BLACK);
  }
  _moveBlack(t) {
    const e = t.origin & this.king;
    let i = this.black ^ t.origin, o = this.king ^ e;
    const c = this.white ^ t.captures;
    return o ^= t.captures & this.king, i |= t.destination, o |= e ? t.destination : t.destination & S, new M(c, i, o, r.WHITE);
  }
  _generateMoves(t) {
    const e = [], i = I(t);
    for (const o of i)
      e.push(...this._generateOriginMoves(o));
    return e;
  }
  _generateJumps(t) {
    const e = [], i = I(t);
    for (const o of i) {
      const c = this._generateOriginJumps(o);
      e.push(...c);
    }
    return e;
  }
  _generateOriginMoves(t) {
    return this.playerToMove === r.WHITE ? this._generateOriginMovesWhite(t) : this._generateOriginMovesBlack(t);
  }
  _generateOriginMovesWhite(t) {
    const e = [], o = t << 4 & this.noPieces;
    o && e.push({ origin: t, destination: o, captures: 0 });
    const c = (t & u) << 3 & this.noPieces;
    c && e.push({ origin: t, destination: c, captures: 0 });
    const h = (t & p) << 5 & this.noPieces;
    if (h && e.push({ origin: t, destination: h, captures: 0 }), t & this.whiteKing) {
      const _ = t >> 4 & this.noPieces;
      _ && e.push({ origin: t, destination: _, captures: 0 });
      const a = (t & l) >> 3 & this.noPieces;
      a && e.push({ origin: t, destination: a, captures: 0 });
      const k = (t & f) >> 5 & this.noPieces;
      k && e.push({ origin: t, destination: k, captures: 0 });
    }
    return e;
  }
  _generateOriginMovesBlack(t) {
    const e = [], o = t >> 4 & this.noPieces;
    o && e.push({ origin: t, destination: o, captures: 0 });
    const c = (t & l) >> 3 & this.noPieces;
    c && e.push({ origin: t, destination: c, captures: 0 });
    const h = (t & f) >> 5 & this.noPieces;
    if (h && e.push({ origin: t, destination: h, captures: 0 }), t & this.blackKing) {
      const _ = t << 4 & this.noPieces;
      _ && e.push({ origin: t, destination: _, captures: 0 });
      const a = (t & u) << 3 & this.noPieces;
      a && e.push({ origin: t, destination: a, captures: 0 });
      const k = (t & p) << 5 & this.noPieces;
      k && e.push({ origin: t, destination: k, captures: 0 });
    }
    return e;
  }
  _generateOriginJumps(t) {
    const e = this.playerToMove === r.WHITE ? this._generateOriginJumpWhite(t) : this._generateOriginJumpBlack(t), i = [];
    for (; e.length > 0; ) {
      const o = e.pop();
      if (!o)
        break;
      const c = this.playerToMove === r.WHITE ? this._generateOriginJumpWhite(
        o.destination,
        o.origin & this.king
      ) : this._generateOriginJumpBlack(
        o.destination,
        o.origin & this.king
      );
      c.length > 0 ? e.push(
        ...c.map((h) => ({
          origin: o.origin,
          destination: h.destination,
          captures: h.captures | o.captures
        }))
      ) : i.push(o);
    }
    return i;
  }
  _generateOriginJumpWhite(t, e = t & this.whiteKing) {
    const i = [], o = t << 4 & this.black, c = ((o & u) << 3 | (o & p) << 5) & this.noPieces;
    c && i.push({ origin: t, destination: c, captures: o });
    const h = ((t & u) << 3 | (t & p) << 5) & this.black, _ = h << 4 & this.noPieces;
    if (_ && i.push({ origin: t, destination: _, captures: h }), e) {
      const a = t >> 4 & this.black, k = ((a & l) >> 3 | (a & f) >> 5) & this.noPieces;
      k && i.push({ origin: t, destination: k, captures: a });
      const T = ((t & l) >> 3 | (t & f) >> 5) & this.black, P = T >> 4 & this.noPieces;
      P && i.push({ origin: t, destination: P, captures: T });
    }
    return i;
  }
  _generateOriginJumpBlack(t, e = t & this.blackKing) {
    const i = [], o = t >> 4 & this.white, c = ((o & l) >> 3 | (o & f) >> 5) & this.noPieces;
    c && i.push({ origin: t, destination: c, captures: o });
    const h = ((t & l) >> 3 | (t & f) >> 5) & this.white, _ = h >> 4 & this.noPieces;
    if (_ && i.push({ origin: t, destination: _, captures: h }), e) {
      const a = t << 4 & this.white, k = ((a & u) << 3 | (a & p) << 5) & this.noPieces;
      k && i.push({ origin: t, destination: k, captures: a });
      const T = ((t & u) << 3 | (t & p) << 5) & this.white, P = T << 4 & this.noPieces;
      P && i.push({ origin: t, destination: P, captures: T });
    }
    return i;
  }
  _getJumpers() {
    return this.playerToMove === r.WHITE ? this._getWhiteJumpers() : this._getBlackJumpers();
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
    return this.playerToMove === r.WHITE ? this._getWhiteMovers() : this._getBlackMovers();
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
const y = {
  [d.WHITE_WON]: r.WHITE,
  [d.BLACK_WON]: r.BLACK
};
function J(s) {
  const t = s.status();
  return t !== d.PLAYING ? s.playerToMove === y[t] ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : L(s);
}
function L(s) {
  const t = s.playerToMove === r.WHITE ? s.white : s.black, e = s.playerToMove === r.WHITE ? s.black : s.white;
  let i = 0;
  return i += m(t), i += m(t & s.king), i -= m(e), i -= m(e & s.king), i;
}
function K(s, t, e) {
  const i = J(s);
  if (i >= e)
    return e;
  t = Math.max(i, t);
  for (const o of s.moves()) {
    if (m(o.captures) === 0)
      continue;
    const c = s.move(o), h = -K(c, -e, -t);
    if (h >= e)
      return e;
    t = Math.max(h, t);
  }
  return t;
}
function x(s, t) {
  let e = Number.NEGATIVE_INFINITY, i;
  for (const o of s.moves()) {
    const c = s.move(o), h = -w(
      c,
      t - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    );
    h >= e && (e = h, i = o);
  }
  return i;
}
function w(s, t, e, i) {
  if (t === 0)
    return K(s, e, i);
  for (const o of s.moves()) {
    const c = s.move(o), h = -w(c, t - 1, -i, -e);
    if (h >= i)
      return i;
    e = Math.max(h, e);
  }
  return e;
}
const G = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  alphaBetaMove: x
}, Symbol.toStringTag, { value: "Module" }));
export {
  G as AI,
  M as Draughts,
  C as Helpers,
  n as S
};
