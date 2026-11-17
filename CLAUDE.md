# CLAUDE.md – Karten

Web-App „Karten“ von Matthias Dilitz: Kunden- und Mitgliedskarten (EAN-13, Code 128, QR-Code, nur Nummer) für den Home-Bildschirm des iPhones, ohne Netz nutzbar. Ausgelagert aus dem Repository `dilitzd/Widgets` (dort bis v1.25.0 unter `web/karten`, entfernt in v1.30.0).

## Zuerst
1. `README.md` (Funktionen, Dateien, Veröffentlichung) und `CHANGELOG.md` lesen.
2. Gestaltung: Richtlinie wie bei den Widgets (Skill **widget-design** im Repository `Widgets`), mit den Ausnahmen unten.

## Wie ich arbeiten will
- Deutsch, kurz, gezielt, einfache Sprache; Fachbegriffe wo nötig. **Keine Fakten erfinden** – Unklares offen sagen.
- Ich lese oft am iPhone: Ergebnis zuerst, Vorschau als Bild.
- Vor größeren Umbauten kurz nachfragen; kleine Korrekturen direkt umsetzen.

## Feste Regeln
- **Kein Hell-/Dunkelmodus.** Seite immer Grauverlauf `#3C3C3C → #1C1C1C`; Text `#FFFFFF / #D0D0D0 / #8E8E8E`; Akzent Sand `#C8AA80` („+“-Knopf, Auswahl), Fehler Pastellrot `#F28B82`. Schrift SF Pro (Systemschrift).
- **Jede Karte in der Farbe ihres Geschäfts/Vereins** (Feld `farbe`, `#RRGGBB`; fehlt sie: Grau `#4A4A4A`). Schrift auf der Karte automatisch hell/dunkel (`textFarbe()`).
- **Code immer dunkel (`#111111`) auf Weiß** – in Liste und großer Ansicht, sonst lesen Kassenscanner nicht. Nie umgekehrt (hell auf dunkel).
- Keine Logos oder Markenzeichen von Geschäften nachbauen – nur Name und frei gewählte Farbe.
- **Datenschutz:** Karten liegen nur im Gerät (`localStorage`, Schlüssel `karten-v1`). Nie echte Kartennummern in Code, Tests, Commits oder Chat-Ausgaben ablegen; Tests nur mit Testdaten.
- Keine externen Bibliotheken oder Online-Dienste ohne Rückfrage – Codes erzeugt `codes.js` lokal, die App muss offline laufen.
- Format der Liste (JSON) abwärtskompatibel halten: `name`, `format` (`ean13`/`code128`/`qr`/`nummer`), `code`, `nummer`, `beschreibung`, `farbe`.

## Aufbau
| Datei | Inhalt |
|---|---|
| `index.html` | App: Liste, Formular („+“), große Ansicht, Menü (Liste einfügen/kopieren) |
| `codes.js` | Code-Erzeuger EAN-13, Code 128, QR |
| `sw.js` | Offline-Speicher – **bei jeder Änderung `VERSION` erhöhen** |
| `manifest.webmanifest`, `symbol-*.png` | Name und Symbol für den Home-Bildschirm |
| `tests/` | `browser.js` (Playwright, iPhone 14), `codes.js` + `codes.py` (zxing liest Codes zurück) |

## Prüfen vor Auslieferung
- `python3 -m http.server 8799 &` im Repository-Ordner, dann `node tests/browser.js <ausgabeordner>` – keine Fehler, Daten bleiben nach Neuladen.
- Codes in den Bildern mit zxing-cpp lesen (`pip install zxing-cpp`); bei Änderungen an `codes.js`: `node tests/codes.js | python3 tests/codes.py` – alles „ok“.
- Vorschau (Liste, Formular, große Ansicht) als Bild an Matthias schicken.
- Echter Test (Home-Bildschirm, Scan an der Kasse) nur am iPhone möglich – Ungetestetes in `CHANGELOG.md` bzw. im Abschluss offen nennen.

## Abschluss jeder Änderung
1. Datei(en) ändern, Kopfkommentar in `index.html` aktuell halten, `VERSION` in `sw.js` erhöhen.
2. `CHANGELOG.md`: neuer Eintrag oben (`## vX.Y.Z – Datum`), Minor = neue Funktion, Patch = Korrektur.
3. `README.md` bei neuen Funktionen/Dateien anpassen.
4. Commit und Push **direkt auf `main`** (GitHub Pages veröffentlicht von dort). `main` muss immer lauffähig sein. Nie `--force`; bei abgelehntem Push erst `git pull --rebase origin main`.

## Veröffentlichung
GitHub Pages: Settings → Pages → `main`, `/ (root)`; Adresse `https://dilitzd.github.io/dilitzd-karten/`. Repository ist privat – Pages dafür nur mit bezahltem GitHub-Abo, sonst öffentlich stellen (Matthias entscheidet). Einschalten kann nur Matthias.
