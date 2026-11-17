# Karten

Kunden- und Mitgliedskarten als Web-App für den Home-Bildschirm (iPhone, ohne Netz nutzbar).

- **Jede Karte in der Farbe ihres Geschäfts/Vereins** (Auswahl oder eigenes Farbrad), Schrift passt sich automatisch an (hell/dunkel je nach Farbe). Kein Hell-/Dunkelmodus.
- **„+“ oben rechts:** neue Karte – Name, Farbe, Art (Strichcode EAN-13, Strichcode Code 128, QR-Code, nur Nummer), Code, angezeigte Nummer, Beschreibung; Vorschau beim Tippen. Die Art wird beim Tippen vorgeschlagen (12–13 Ziffern → EAN-13, Link/Umlaute/lang → QR, sonst Code 128), bis man selbst eine wählt.
- **Aus Foto lesen** (im Formular oder Menü „+ Karte aus Foto“): Foto aufnehmen oder aus der Mediathek wählen → Code und Art werden erkannt, die Farbe aus dem Foto vorgeschlagen; nur den Namen selbst eintragen. Liest EAN-13, UPC-A (wird zu EAN-13), Code 128 und QR; andere Codes (z. B. EAN-8, Code 39, Data Matrix) werden als Nummer übernommen. Läuft im Gerät, das Foto wird nicht gespeichert.
- **Antippen:** große Ansicht, Code dunkel auf Weiß (für Kassenscanner), oben Band in der Kartenfarbe; Wischen = nächste Karte; Bildschirm bleibt an (wenn das Gerät es erlaubt).
- **Menü „⋯“:** Liste einfügen (JSON) und Liste kopieren (Sicherung).

**Datenschutz:** Die Karten liegen nur im Speicher des Geräts (`localStorage`), nie im Repository und nie auf einem Server. Die Codes erzeugt `codes.js` lokal.

## Dateien
| Datei | Inhalt |
|---|---|
| `index.html` | App (Gestaltung, Liste, Formular, große Ansicht) |
| `codes.js` | Code-Erzeuger EAN-13, Code 128, QR |
| `lib/` | zxing-wasm 3.1.6 (MIT) zum Lesen von Codes aus Fotos – lädt erst beim ersten Foto (siehe `lib/LIESMICH.txt`) |
| `sw.js` | Offline-Speicher – bei jeder neuen Fassung `VERSION` erhöhen |
| `manifest.webmanifest`, `symbol-*.png` | Name und Symbol für den Home-Bildschirm |
| `tests/` | `browser.js` (Playwright, iPhone 14), `codes.js` + `codes.py` (zxing liest die Codes zurück), `fotos.py` + `foto.js` (Foto-Lesen) |

## Veröffentlichen (GitHub Pages)
Repository → Settings → Pages → Branch `main`, Ordner `/ (root)`. Adresse danach: `https://dilitzd.github.io/dilitzd-karten/`.
Hinweis: Pages für **private** Repositories braucht ein bezahltes GitHub-Abo; sonst Repository auf öffentlich stellen (enthält keine persönlichen Daten).

Am iPhone: Adresse in Safari öffnen → Teilen → „Zum Home-Bildschirm“.

## Liste (JSON)
```json
[{"name":"Supermarkt","format":"ean13","code":"4006381333931","farbe":"#D7262E"},
 {"name":"Verein","format":"qr","code":"…","nummer":"123","beschreibung":"Mitglied","farbe":"#1F4E9C"}]
```
`format`: `ean13`, `code128`, `qr`, `nummer`; `farbe` als `#RRGGBB` (fehlt sie, wird Grau genommen).

## Prüfen
```
python3 -m http.server 8799 &   # im Repository-Ordner
node tests/browser.js /tmp/k    # Bilder danach mit zxing-cpp lesen
node tests/codes.js | python3 tests/codes.py
python3 tests/fotos.py /tmp/k && node tests/foto.js /tmp/k
```
