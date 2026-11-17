"""Rendert die Codes aus tests/codes.js als PNG und liest sie mit zxing-cpp zurück (pip install zxing-cpp).
Aufruf: node tests/codes.js [liste] | python3 tests/codes.py"""
import json, sys
from PIL import Image, ImageDraw
import zxingcpp
fehler = 0
for i, e in enumerate(json.load(sys.stdin)):
    r = e["r"]
    if "matrix" in r:
        m = r["matrix"]; n = len(m); px = 8; im = Image.new("L", ((n + 8) * px,) * 2, 255); d = ImageDraw.Draw(im)
        for y, z in enumerate(m):
            for x, v in enumerate(z):
                if v: d.rectangle([(x + 4) * px, (y + 4) * px, (x + 5) * px - 1, (y + 5) * px - 1], fill=0)
    else:
        mod = [0] * r["ruhe"][0] + r["module"] + [0] * r["ruhe"][1]; px = 3; im = Image.new("L", (len(mod) * px, 120), 255); d = ImageDraw.Draw(im)
        for x, v in enumerate(mod):
            if v: d.rectangle([x * px, 0, x * px + px - 1, 119], fill=0)
    res = zxingcpp.read_barcodes(im)
    text = res[0].text if res else None
    soll = r.get("text", e["t"]) if e["f"] != "qr" else e["t"]
    ok = text == soll
    fehler += not ok
    print(("ok  " if ok else "FEHLER"), e["f"], ("v%d" % r["version"]) if "version" in r else "", repr(e["t"][:40]), "→", repr((text or "")[:40]), res[0].format if res else "")
sys.exit(1 if fehler else 0)
