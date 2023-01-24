(function(r,s){typeof exports=="object"&&typeof module<"u"?s(exports):typeof define=="function"&&define.amd?define(["exports"],s):(r=typeof globalThis<"u"?globalThis:r||self,s(r["rapid-draughts"]={}))})(this,function(r){"use strict";var A=Object.defineProperty;var O=(r,s,P)=>s in r?A(r,s,{enumerable:!0,configurable:!0,writable:!0,value:P}):r[s]=P;var _=(r,s,P)=>(O(r,typeof s!="symbol"?s+"":s,P),P);let s=[];s[0]=1;for(let h=1;h<32;h++)s[h]=s[h-1]*2;const P=255,W=4278190080,T=0,p=s[1]|s[2]|s[3]|s[9]|s[10]|s[11]|s[17]|s[18]|s[19]|s[25]|s[26]|s[27],l=s[4]|s[5]|s[6]|s[12]|s[13]|s[14]|s[20]|s[21]|s[22],f=s[28]|s[29]|s[30]|s[20]|s[21]|s[22]|s[12]|s[13]|s[14]|s[4]|s[5]|s[6],d=s[25]|s[26]|s[27]|s[17]|s[18]|s[19]|s[9]|s[10]|s[11],M=s[28]|s[29]|s[30]|s[31],B=s[0]|s[1]|s[2]|s[3];function m(h){let t=[];for(let e=0;e<32;e++){const i=h&1<<e;i&&t.push(i)}return t}function I(h){let t=0;for(let e=0;e<32;e++)h&1<<e&&(t+=1);return t}var k=(h=>(h[h.WHITE=0]="WHITE",h[h.BLACK=1]="BLACK",h))(k||{}),v=(h=>(h[h.PLAYING=0]="PLAYING",h[h.BLACK_WON=1]="BLACK_WON",h[h.WHITE_WON=2]="WHITE_WON",h))(v||{});class b{constructor(t=P,e=W,i=T,n=k.WHITE){_(this,"white");_(this,"black");_(this,"king");_(this,"playerToMove");_(this,"noPieces");_(this,"whiteKing");_(this,"blackKing");_(this,"_moves",null);this.white=t,this.black=e,this.king=i,this.playerToMove=n,this.noPieces=~(this.white|this.black),this.whiteKing=this.white&this.king,this.blackKing=this.black&this.king}move(t){let e=!1;for(const i of this.moves())i.captures===t.captures&&i.destination===t.destination&&i.origin===t.origin&&(e=!0);if(!e)throw Error("invalid move");return this.playerToMove===k.WHITE?this._moveWhite(t):this._moveBlack(t)}moves(){if(this._moves===null){const t=this._getJumpers();if(t)return this._generateJumps(t);const e=this._getMovers();this._moves=this._generateMoves(e)}return this._moves}status(){return this.moves().length===0?this.playerToMove===k.WHITE?v.BLACK_WON:v.WHITE_WON:v.PLAYING}_moveWhite(t){const e=t.origin&this.king;let i=this.white^t.origin,n=this.king^e,c=this.black^t.captures;return n^=t.captures&this.king,i|=t.destination,n|=e?t.destination:t.destination&M,new b(i,c,n,k.BLACK)}_moveBlack(t){const e=t.origin&this.king;let i=this.black^t.origin,n=this.king^e,c=this.white^t.captures;return n^=t.captures&this.king,i|=t.destination,n|=e?t.destination:t.destination&B,new b(c,i,n,k.WHITE)}_generateMoves(t){let e=[];const i=m(t);for(const n of i)e=e.concat(this._generateOriginMoves(n));return e}_generateJumps(t){let e=[],i=0;const n=m(t);for(const c of n)for(const o of this._generateOriginJumps(c)){const a=I(o.captures);a>i?e=[o]:a===i&&e.push(o)}return e}_generateOriginMoves(t){return this.playerToMove===k.WHITE?this._generateOriginMovesWhite(t):this._generateOriginMovesBlack(t)}_generateOriginMovesWhite(t){let e=[];const n=t<<4&this.noPieces;n&&e.push({origin:t,destination:n,captures:0});const c=(t&p)<<3&this.noPieces;c&&e.push({origin:t,destination:c,captures:0});const o=(t&l)<<5&this.noPieces;if(o&&e.push({origin:t,destination:o,captures:0}),t&this.whiteKing){const a=t>>4&this.noPieces;a&&e.push({origin:t,destination:a,captures:0});const u=(t&f)>>3&this.noPieces;u&&e.push({origin:t,destination:u,captures:0});const g=(t&d)>>5&this.noPieces;g&&e.push({origin:t,destination:g,captures:0})}return e}_generateOriginMovesBlack(t){let e=[];const n=t>>4&this.noPieces;n&&e.push({origin:t,destination:n,captures:0});const c=(t&f)>>3&this.noPieces;c&&e.push({origin:t,destination:c,captures:0});const o=(t&d)>>5&this.noPieces;if(o&&e.push({origin:t,destination:o,captures:0}),t&this.blackKing){const a=t<<4&this.noPieces;a&&e.push({origin:t,destination:a,captures:0});const u=(t&p)<<3&this.noPieces;u&&e.push({origin:t,destination:u,captures:0});const g=(t&l)<<5&this.noPieces;g&&e.push({origin:t,destination:g,captures:0})}return e}_generateOriginJumps(t){let e=this.playerToMove===k.WHITE?this._generateOriginJumpWhite(t):this._generateOriginJumpBlack(t),i=[];for(;e.length>0;){const n=e.pop();if(!n)break;const c=this.playerToMove===k.WHITE?this._generateOriginJumpWhite(n.destination,n.origin&this.king):this._generateOriginJumpBlack(n.destination,n.origin&this.king);c.length>0?e.push(...c.map(o=>({origin:n.origin,destination:o.destination,captures:o.captures|n.captures}))):i.push(n)}return i}_generateOriginJumpWhite(t,e=t&this.whiteKing){let i=[];const n=t<<4&this.black,c=((n&p)<<3|(n&l)<<5)&this.noPieces;c&&i.push({origin:t,destination:c,captures:n});const o=((t&p)<<3|(t&l)<<5)&this.black,a=o<<4&this.noPieces;if(a&&i.push({origin:t,destination:a,captures:o}),e){const u=t>>4&this.black,g=((u&f)>>3|(u&d)>>5)&this.noPieces;g&&i.push({origin:t,destination:g,captures:u});const K=((t&f)>>3|(t&d)>>5)&this.black,w=K>>4&this.noPieces;w&&i.push({origin:t,destination:w,captures:K})}return i}_generateOriginJumpBlack(t,e=t&this.blackKing){let i=[];const n=t>>4&this.white,c=((n&f)>>3|(n&d)>>5)&this.noPieces;c&&i.push({origin:t,destination:c,captures:n});const o=((t&f)>>3|(t&d)>>5)&this.white,a=o>>4&this.noPieces;if(a&&i.push({origin:t,destination:a,captures:o}),e){const u=t<<4&this.white,g=((u&p)<<3|(u&l)<<5)&this.noPieces;g&&i.push({origin:t,destination:g,captures:u});const K=((t&p)<<3|(t&l)<<5)&this.white,w=K<<4&this.noPieces;w&&i.push({origin:t,destination:w,captures:K})}return i}_getJumpers(){return this.playerToMove===k.WHITE?this._getWhiteJumpers():this._getBlackJumpers()}_getBlackJumpers(){let t=0,e=this.noPieces<<4&this.white;return e&&(t|=((e&p)<<3|(e&l)<<5)&this.black),e=((this.noPieces&p)<<3|(this.noPieces&l)<<5)&this.white,t|=e<<4&this.black,this.blackKing&&(e=this.noPieces>>4&this.white,e&&(t|=((e&f)>>3|(e&d)>>5)&this.blackKing),e=((this.noPieces&f)>>3|(this.noPieces&d)>>5)&this.white,e&&(t|=e>>4&this.blackKing)),t}_getWhiteJumpers(){let t=0,e=this.noPieces>>4&this.black;return e&&(t|=((e&f)>>3|(e&d)>>5)&this.white),e=((this.noPieces&f)>>3|(this.noPieces&d)>>5)&this.black,t|=e>>4&this.white,this.whiteKing&&(e=this.noPieces<<4&this.black,e&&(t|=((e&p)<<3|(e&l)<<5)&this.whiteKing),e=((this.noPieces&p)<<3|(this.noPieces&l)<<5)&this.black,e&&(t|=e<<4&this.whiteKing)),t}_getMovers(){return this.playerToMove===k.WHITE?this._getWhiteMovers():this._getBlackMovers()}_getBlackMovers(){let t=this.noPieces<<4&this.black;return t|=(this.noPieces&p)<<3&this.black,t|=(this.noPieces&l)<<3&this.black,this.blackKing&&(t|=this.noPieces>>4&this.blackKing,t|=(this.noPieces&f)>>3&this.blackKing,t|=(this.noPieces&d)>>5&this.blackKing),t}_getWhiteMovers(){let t=this.noPieces>>4&this.white;return t|=(this.noPieces&f)>>3&this.white,t|=(this.noPieces&d)>>5&this.white,this.whiteKing&&(t|=this.noPieces<<4&this.whiteKing,t|=(this.noPieces&p)<<3&this.whiteKing,t|=(this.noPieces&l)<<3&this.whiteKing),t}}r.Draughts=b,r.S=s,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})});
