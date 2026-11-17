const { chromium, devices } = require("playwright");
// Browser-Test (iPhone 14, nur Testdaten). Vorher im Repository-Ordner: python3 -m http.server 8799
// Aufruf: node tests/browser.js <ausgabeordner>; danach Bilder z. B. mit zxing-cpp lesen.
const O = process.argv[2] || ".";
const K = [{name:"Testmarkt",format:"ean13",code:"400638133393",farbe:"#D7262E"},{name:"Verein",format:"qr",code:"Hallo Welt äöü",nummer:"123-45/A",beschreibung:"Mitglied",farbe:"#1F4E9C"},{name:"Kammer",format:"code128",code:"ABC123XYZ",farbe:"#F6C800"}];
(async () => {
  const b = await chromium.launch(); const fehler = [];
  const ctx = await b.newContext({ ...devices["iPhone 14"] });
  const p = await ctx.newPage(); p.on("pageerror", e => fehler.push(e.message)); p.on("console", m => { if (m.type() === "error") fehler.push(m.text()); });
  p.on("dialog", d => d.accept());
  await p.goto("http://127.0.0.1:8799/");
  await p.screenshot({ path: `${O}/leer.png` });
  // Karten über den „+“-Knopf anlegen
  for (const k of K) {
    await p.click("#plusKnopf"); await p.fill("#fName", k.name); await p.fill("#fCode", k.code);
    if (k.nummer) await p.fill("#fNummer", k.nummer); if (k.beschreibung) await p.fill("#fText", k.beschreibung);
    await p.click(`#farben button[data-f="${k.farbe}"]`);
    if (k.name === "Kammer") await p.screenshot({ path: `${O}/formular.png` });
    await p.click("#fSpeichern"); await p.waitForTimeout(100);
  }
  // Nur Nummer, Art selbst gewählt, eigene Farbe per Liste
  await p.click("#plusKnopf"); await p.fill("#fName", "Skilehrer"); await p.click('#arten button[data-art="nummer"]'); await p.fill("#fCode", "1A2564"); await p.click("#fSpeichern");
  const formate = await p.evaluate(() => JSON.parse(localStorage.getItem("karten-v1")).map(k => k.format + ":" + k.farbe).join(" "));
  console.log("gespeichert:", formate);
  await p.screenshot({ path: `${O}/liste.png`, fullPage: true });
  for (let i = 0; i < 3; i++) { await p.click(`.kachel[data-i="${i}"]`); await p.waitForTimeout(150); await p.screenshot({ path: `${O}/gross-${i}.png` }); await p.click("#grossZu"); await p.waitForTimeout(150); }
  // falsche Prüfziffer muss abgelehnt werden
  await p.click("#plusKnopf"); await p.fill("#fName", "Falsch"); await p.fill("#fCode", "4006381333932"); await p.click("#fSpeichern");
  console.log("Fehlertext:", await p.textContent("#fFehler")); await p.click("#fAbbrechen");
  await p.reload(); console.log("Kacheln nach Neuladen:", await p.locator(".kachel").count());
  console.log("Fehler:", fehler.length ? fehler : "keine");
  await b.close();
})();
