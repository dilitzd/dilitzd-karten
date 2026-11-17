"""App-Symbol „Karten“ (Minimal-Stil wie die Profilbilder): Grauverlauf, KARTEN in gesperrten Versalien (Inter SemiBold, weiß),
darunter Querstrich in Sand. Schreibt symbol-180.png, symbol-192.png, symbol-512.png ins Repository.
Aufruf: python3 werkzeuge/symbol.py   (Schrift Inter unter /usr/share/fonts/opentype/inter/; danach VERSION in sw.js erhöhen)"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WURZEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SCHRIFT = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
WEISS, SAND = (255, 255, 255), (200, 170, 128)

def verlauf(g, oben=0x3C, unten=0x1C, seed=11):
    rng = np.random.default_rng(seed)
    v = np.linspace(oben, unten, g)[:, None] * np.ones((1, g))
    grau = np.clip(np.round(v + rng.random((g, g)) - rng.random((g, g))), 0, 255).astype(np.uint8)
    return Image.fromarray(np.stack([grau] * 3, axis=-1), "RGB")

def symbol(g, T=1024):
    """Zeichnet groß (T px) und verkleinert – saubere Kanten."""
    im = verlauf(T); d = ImageDraw.Draw(im)
    font = ImageFont.truetype(SCHRIFT, 150); abstand = 34; text = "KARTEN"
    breite = sum(d.textlength(c, font=font) for c in text) + abstand * (len(text) - 1)
    x = (T - breite) / 2; oben, unten = font.getbbox("K")[1], font.getbbox("K")[3]
    y = T * 0.46 - (unten - oben) / 2 - oben
    for c in text:
        d.text((x, y), c, font=font, fill=WEISS); x += d.textlength(c, font=font) + abstand
    lang, dick, ys = 420, 14, T * 0.46 + (unten - oben) / 2 + 70
    d.rectangle([(T - lang) / 2, ys, (T + lang) / 2, ys + dick], fill=SAND)
    return im.resize((g, g), Image.LANCZOS)

for g in (180, 192, 512):
    symbol(g).save(os.path.join(WURZEL, "symbol-%d.png" % g))
print("ok")
