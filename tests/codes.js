// Prüft die Code-Erzeuger aus codes.js: erzeugt Module/Matrix als JSON (für codes.py → PNG + zxing).
// Aufruf: node tests/codes.js [json-liste [[format, inhalt], …]] | python3 tests/codes.py   (Standard: Testwerte ohne persönliche Daten)
const fs = require("fs");
const src = fs.readFileSync(__dirname + "/../codes.js", "utf8");
const teil = src;
const { ean13, code128, qr } = new Function(teil + "; return { ean13, code128, qr };")();
const liste = process.argv[2] ? JSON.parse(process.argv[2]) : [["ean13", "4006381333931"], ["ean13", "400638133393"], ["code128", "ABC-123 xyz"], ["code128", "123456"],
  ["qr", "Hallo Welt"], ["qr", "Grüße aus Südtirol – ÄÖÜ ß €"], ["qr", "x".repeat(100)], ["qr", "1|2|3|Hauptstraße|" + "y".repeat(150)]];
console.log(JSON.stringify(liste.map(([f, t]) => { const r = { ean13, code128, qr }[f](t); return { f, t, r }; })));
