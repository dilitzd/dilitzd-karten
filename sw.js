// Karten – Offline-Speicher: Seite, Codes und Symbole liegen im Gerät, die App startet auch ohne Netz.
// Bei neuer Fassung VERSION erhöhen (sonst bleibt die alte im Zwischenspeicher).
const VERSION = "karten-3";
const DATEIEN = ["./", "index.html", "codes.js", "manifest.webmanifest", "symbol-180.png", "symbol-192.png", "symbol-512.png", "lib/zxing-reader.js", "lib/zxing_reader.wasm"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSION).map(n => caches.delete(n))))); self.clients.claim(); });
// Netz zuerst (neue Fassung sofort), sonst aus dem Speicher
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(VERSION).then(c => c.put(e.request, k)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
