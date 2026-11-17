const { chromium, devices } = require("playwright");
const D = process.argv[2];
// Liest nachgestellte Kartenfotos (tests/fotos.py) über „Aus Foto lesen“. Aufruf: node tests/foto.js <ordner>  (Server wie bei browser.js)
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ ...devices["iPhone 14"] }); const p = await ctx.newPage();
  const fehler = []; p.on("pageerror", e => fehler.push(e.message)); p.on("console", m => { if (m.type() === "error") fehler.push(m.text()); });
  await p.goto("http://127.0.0.1:8799/");
  for (const f of ["rot_ean", "blau_qr", "gelb_128", "leer"]) {
    await p.click("#plusKnopf"); await p.setInputFiles("#fotoDatei", `${D}/fotos/${f}.jpg`);
    await p.waitForFunction(() => !/Lese Code/.test(document.querySelector("#fotoStatus").textContent), null, { timeout: 30000 });
    const r = await p.evaluate(() => ({ code: document.querySelector("#fCode").value, art: document.querySelector("#arten .an").dataset.art, status: document.querySelector("#fotoStatus").textContent }));
    console.log(f, JSON.stringify(r), "Farbe:", await p.evaluate(() => farbe));
    if (f === "rot_ean") await p.screenshot({ path: `${D}/foto-formular.png` });
    await p.click("#fAbbrechen");
  }
  console.log("Fehler:", fehler.length ? fehler : "keine"); await b.close();
})();
