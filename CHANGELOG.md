# Changelog

## v2.0.0 – 17.11.2026
- Umzug aus dem Repository `Widgets` (dort `web/karten`, v1.25.0) in eigenes Repository für GitHub Pages.
- **Farben je Karte** (Geschäft/Verein) statt Hell-/Dunkelmodus; feste dunkle Seite im Grauverlauf; Schrift auf der Karte passt sich der Farbe an.
- **„+“-Knopf** oben rechts: Formular mit Name, Farbe (12 Vorgaben + Farbrad), Art als Knöpfe (EAN-13, Code 128, QR-Code, nur Nummer), Code, Nummer, Beschreibung und Live-Vorschau; Art wird beim Tippen vorgeschlagen.
- Code immer dunkel auf weißem Feld (Liste und große Ansicht); große Ansicht mit Band in der Kartenfarbe.
- Liste (JSON) mit neuem Feld `farbe`; alte Listen ohne Farbe bleiben gültig (Grau).
- Prüfung: Playwright (iPhone 14) ohne Fehler, Daten bleiben nach Neuladen, falsche EAN-Prüfziffer wird abgelehnt; zxing liest EAN-13, QR und Code 128 aus Liste und großer Ansicht.
