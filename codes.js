// Code-Erzeuger (EAN-13, Code 128, QR) – laufen nur im Gerät, kein Online-Dienst. Ursprung: Scriptable-Widget „Karten“ (Repository Widgets, bis v1.25.0).
// ---------------------------------------------------------------- Codes ----
// EAN-13: 95 Module (1 = Strich). Prüfziffer wird ergänzt (12 Ziffern) bzw. geprüft (13 Ziffern).
function ean13(code) {
  const z = String(code).replace(/\s/g, "");
  if (!/^\d{12,13}$/.test(z)) throw new Error("EAN-13 braucht 12 oder 13 Ziffern");
  const d = z.slice(0, 12).split("").map(Number);
  const pruef = (10 - d.reduce((s, x, i) => s + x * (i % 2 ? 3 : 1), 0) % 10) % 10;
  if (z.length === 13 && +z[12] !== pruef) throw new Error("EAN-13: Prüfziffer passt nicht (erwartet " + pruef + ")");
  d.push(pruef);
  const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
  const R = L.map(s => s.replace(/./g, c => c === "0" ? "1" : "0"));
  const G = R.map(s => s.split("").reverse().join(""));
  const PAR = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLL", "LGLGGL", "LGGLGL"][d[0]];
  let s = "101";
  for (let i = 1; i <= 6; i++) s += (PAR[i - 1] === "L" ? L : G)[d[i]];
  s += "01010";
  for (let i = 7; i <= 12; i++) s += R[d[i]];
  s += "101";
  return { module: s.split("").map(Number), text: d.join(""), ruhe: [11, 7] };
}

// Code 128 (Zeichensatz B, druckbares ASCII 32–126; reine Ziffernfolgen gerader Länge als Satz C)
function code128(code) {
  const W = "212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112".split(" ");
  const t = String(code);
  let werte;
  if (/^(\d\d)+$/.test(t) && t.length >= 4) werte = [105].concat(t.match(/\d\d/g).map(Number));
  else {
    if (!/^[\x20-\x7E]+$/.test(t)) throw new Error("Code 128: nur Buchstaben, Ziffern und Satzzeichen ohne Umlaute");
    werte = [104].concat(t.split("").map(c => c.charCodeAt(0) - 32));
  }
  werte.push(werte.reduce((s, v, i) => s + v * (i || 1), 0) % 103);
  werte.push(106);
  const m = [];
  for (const v of werte) W[v].split("").forEach((b, i) => { for (let k = 0; k < +b; k++) m.push(i % 2 ? 0 : 1); });
  return { module: m, text: t, ruhe: [10, 10] };
}

// QR-Code (Byte-Modus, Fehlerkorrektur M, Version 1–10, Maske nach Strafpunkten)
function qr(text) {
  const bytes = [];
  for (const ch of encodeURIComponent(String(text)).match(/%[0-9A-F]{2}|[\s\S]/gi)) bytes.push(ch[0] === "%" && ch.length === 3 ? parseInt(ch.slice(1), 16) : ch.charCodeAt(0));
  const TAB = [null, [1, 10, 26], [1, 16, 44], [1, 26, 70], [2, 18, 100], [2, 24, 134], [4, 16, 172], [4, 18, 196], [4, 22, 242], [5, 22, 292], [5, 26, 346]];
  const AUSR = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
  let ver = 0;
  for (let v = 1; v <= 10; v++) { const [b, e, n] = TAB[v]; if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= (n - b * e) * 8) { ver = v; break; } }
  if (!ver) throw new Error("QR-Inhalt zu lang (max. ca. 210 Zeichen)");
  const [blocks, ecLen, roh] = TAB[ver], datenCw = roh - blocks * ecLen, size = 17 + 4 * ver;
  // Bitstrom
  const bits = [];
  const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
  put(0, Math.min(4, datenCw * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const daten = [];
  for (let i = 0; i < bits.length; i += 8) daten.push(parseInt(bits.slice(i, i + 8).join(""), 2));
  for (let p = 0xEC; daten.length < datenCw; p ^= 0xEC ^ 0x11) daten.push(p);
  // Reed-Solomon
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 0xFF; };
  const teiler = []; for (let i = 0; i < ecLen - 1; i++) teiler.push(0); teiler.push(1);
  for (let i = 0, wurzel = 1; i < ecLen; i++) { for (let j = 0; j < teiler.length; j++) { teiler[j] = mul(teiler[j], wurzel); if (j + 1 < teiler.length) teiler[j] ^= teiler[j + 1]; } wurzel = mul(wurzel, 2); }
  const rest = d => { const r = teiler.map(() => 0); for (const b of d) { const f = b ^ r.shift(); r.push(0); teiler.forEach((c, i) => { r[i] ^= mul(c, f); }); } return r; };
  const kurz = blocks - roh % blocks, kurzLen = Math.floor(roh / blocks), bl = [];
  for (let i = 0, k = 0; i < blocks; i++) {
    const d = daten.slice(k, k + kurzLen - ecLen + (i < kurz ? 0 : 1)); k += d.length;
    const e = rest(d); if (i < kurz) d.push(0); bl.push(d.concat(e));
  }
  const cw = [];
  for (let i = 0; i < bl[0].length; i++) for (let j = 0; j < bl.length; j++) if (i !== kurzLen - ecLen || j >= kurz) cw.push(bl[j][i]);
  // Matrix
  const M = [], F = [];
  for (let y = 0; y < size; y++) { M.push(new Array(size).fill(false)); F.push(new Array(size).fill(false)); }
  const setz = (x, y, dunkel) => { M[y][x] = dunkel; F[y][x] = true; };
  for (let i = 0; i < size; i++) { setz(6, i, i % 2 === 0); setz(i, 6, i % 2 === 0); }
  const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy, d = Math.max(Math.abs(dx), Math.abs(dy)); if (x >= 0 && x < size && y >= 0 && y < size) setz(x, y, d !== 2 && d !== 4); } };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  const pos = AUSR[ver], n = pos.length;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setz(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
  const format = maske => {
    const d = (0 << 3) | maske; let r = d;                       // Fehlerkorrektur M = 00
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = ((d << 10) | r) ^ 0x5412, bit = i => ((b >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) setz(8, i, bit(i));
    setz(8, 7, bit(6)); setz(8, 8, bit(7)); setz(7, 8, bit(8));
    for (let i = 9; i < 15; i++) setz(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) setz(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) setz(8, size - 15 + i, bit(i));
    setz(8, size - 8, true);
  };
  format(0);
  if (ver >= 7) {
    let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    const b = (ver << 12) | r;
    for (let i = 0; i < 18; i++) { const bit = ((b >>> i) & 1) === 1, a = size - 11 + i % 3, c = Math.floor(i / 3); setz(a, c, bit); setz(c, a, bit); }
  }
  let i = 0;
  for (let rechts = size - 1; rechts >= 1; rechts -= 2) {
    if (rechts === 6) rechts = 5;
    for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
      const x = rechts - j, y = ((rechts + 1) & 2) === 0 ? size - 1 - v : v;
      if (!F[y][x] && i < cw.length * 8) { M[y][x] = ((cw[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
    }
  }
  const MASKEN = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
    (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
  const anwenden = m => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!F[y][x] && MASKEN[m](x, y)) M[y][x] = !M[y][x]; };
  const strafe = () => {
    let p = 0, dunkel = 0;
    const reihe = get => { let lauf = 1, s = 0; for (let k = 1; k <= size; k++) { if (k < size && get(k) === get(k - 1)) lauf++; else { if (lauf >= 5) s += lauf - 2; lauf = 1; } } return s; };
    const muster = get => { let s = 0; for (let k = 0; k + 10 < size; k++) { const w = []; for (let q = 0; q < 11; q++) w.push(get(k + q) ? 1 : 0); const t = w.join(""); if (t === "10111010000" || t === "00001011101") s += 40; } return s; };
    for (let y = 0; y < size; y++) { p += reihe(k => M[y][k]) + muster(k => M[y][k]); p += reihe(k => M[k][y]) + muster(k => M[k][y]); }
    for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (M[y][x]) dunkel++;
    return p + Math.floor(Math.abs(dunkel * 20 - size * size * 10) / (size * size)) * 10;
  };
  let beste = 0, min = Infinity;
  for (let m = 0; m < 8; m++) { anwenden(m); format(m); const s = strafe(); if (s < min) { min = s; beste = m; } anwenden(m); }
  anwenden(beste); format(beste);
  return { matrix: M, version: ver };
}
