# Sessionprotokoll – Karten

Zweck: Kontext für neue Chats. Zu Beginn sagen: „Lies `SESSIONPROTOKOLL.md` im Repository dilitzd/dilitzd-karten und arbeite dort weiter.“
Neue Sitzungen tragen oben im Abschnitt „Verlauf“ ein (neueste zuerst). Regeln und Aufbau: `CLAUDE.md`, Funktionen: `README.md`.

## 1. Stand (v2.1.1)
- Web-App für Kunden- und Mitgliedskarten, veröffentlicht über GitHub Pages: https://dilitzd.github.io/dilitzd-karten/ (Repository öffentlich, enthält keine Karten).
- Am iPhone über Safari → „Zum Home-Bildschirm“ als Web-App installiert (von Matthias bestätigt).
- Funktionen: Farbe je Karte, „+“-Formular mit Vorschau (EAN-13, Code 128, QR-Code, nur Nummer), Karte aus Foto (zxing-wasm lokal in `lib/`), große Ansicht zum Scannen, Liste einfügen/kopieren, offline nutzbar.
- Karten liegen nur im iPhone (`localStorage`). Sicherung: „⋯“ → „Liste kopieren“ → in Notizen.

## 2. Offene Punkte
- **Am iPhone testen:** Start ohne Netz (Flugmodus); Scan an der Kasse (EAN-13, z. B. Supermarkt) und QR bei Kontrolle; „Aus Foto lesen“ mit echten Fotos (auch HEIC) – stimmen Code und Farbvorschlag?
- Prüfen, ob die Karten nach Löschen/Neuanlegen des Home-Bildschirm-Symbols erhalten bleiben (nicht sicher bekannt) – vorher Liste kopieren.
- Altes Scriptable-Skript/Widget „Karten“ am iPhone von Hand löschen (Matthias).

## 3. Verlauf
### 2026-11-17 (Start des Repositorys)
- **v2.0.0:** App aus `Widgets` (`web/karten`, v1.25.0) hierher umgezogen. Wunsch Matthias: kein Hell/Dunkel, sondern Farbe je Geschäft; „+“-Knopf mit Eingabefeldern für Strichcodes und QR-Codes. Umgesetzt: 12 Farbvorgaben + Farbrad, Schrift passt sich der Kartenfarbe an, Code immer dunkel auf Weiß, Art wird beim Tippen vorgeschlagen, Live-Vorschau. In `Widgets` alles zu Karten entfernt (v1.30.0).
- `CLAUDE.md` angelegt.
- **Veröffentlichung:** Pages ging zunächst nicht (privates Repository braucht bezahltes Abo) → Matthias hat das Repository öffentlich gestellt und Pages (`main`, `/ (root)`) eingeschaltet. Läuft, am iPhone bestätigt. Alternative „als Claude-Artifact“ besprochen und verworfen (braucht Netz/Anmeldung, Daten sicherer nur im Gerät).
- **v2.1.0:** Karte aus Foto – Code und Art automatisch, Farbe aus der Bildmitte vorgeschlagen, Name von Hand. Bibliothek zxing-wasm 3.1.6 (MIT) lokal in `lib/`, von Matthias freigegeben. Geprüft mit nachgestellten Fotos (schräg, unscharf): EAN-13, QR, Code 128 richtig.
- **v2.1.1:** App-Symbol neu: Schriftzug KARTEN mit Querstrich in Sand (statt Strichcode) – von Matthias bestätigt.
