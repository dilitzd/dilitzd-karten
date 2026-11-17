"""Baut Test-„Fotos“ (schräg, unscharf, JPEG) aus der Liste von tests/browser.js (nur Testdaten).
Aufruf: python3 tests/fotos.py <ordner>   (erwartet <ordner>/liste.png, schreibt <ordner>/fotos/*.jpg)"""
import os, sys
from PIL import Image, ImageFilter
o = sys.argv[1] if len(sys.argv) > 1 else "."
os.makedirs(f"{o}/fotos", exist_ok=True)
im = Image.open(f"{o}/liste.png")
for (n, b), w in zip({"rot_ean": (48, 198, 1124, 812), "blau_qr": (48, 856, 1124, 1468), "gelb_128": (48, 1512, 1124, 2126)}.items(), (-9, 7, -9)):
    bg = Image.new("RGB", (1600, 1200), (150, 140, 125))
    bg.paste(im.crop(b).rotate(w, expand=True, fillcolor=(150, 140, 125)), (250, 200))
    bg.filter(ImageFilter.GaussianBlur(1.2)).save(f"{o}/fotos/{n}.jpg", quality=80)
Image.new("RGB", (800, 600), (30, 30, 30)).save(f"{o}/fotos/leer.jpg")
