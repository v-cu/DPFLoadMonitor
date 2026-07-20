#!/usr/bin/env python3
"""Synchronizacja nagłówka i stopki na wszystkich podstronach.

Edytuj menu w templates/header.en.html i templates/header.pl.html
(albo stopkę w templates/footer.html), a następnie uruchom z katalogu
głównego projektu:

    python tools/sync_layout.py

Skrypt podmienia zawartość pomiędzy markerami
<!-- layout:header --> ... <!-- /layout:header --> oraz
<!-- layout:footer --> ... <!-- /layout:footer -->
w każdym pliku en/**/index.html i pl/**/index.html.
Niczego nie trzeba budować — strona dalej działa jako czysty statyczny HTML.
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HEADER_RE = re.compile(
    r"(<!-- layout:header[^>]*-->\n).*?(\n<!-- /layout:header -->)", re.S
)
FOOTER_RE = re.compile(r"(<!-- layout:footer -->\n).*?(\n<!-- /layout:footer -->)", re.S)


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def main():
    headers = {
        "en": read(os.path.join(ROOT, "templates", "header.en.html")).rstrip("\n"),
        "pl": read(os.path.join(ROOT, "templates", "header.pl.html")).rstrip("\n"),
    }
    footer = read(os.path.join(ROOT, "templates", "footer.html")).rstrip("\n")

    pages = sorted(
        glob.glob(os.path.join(ROOT, "en", "**", "index.html"), recursive=True)
        + glob.glob(os.path.join(ROOT, "pl", "**", "index.html"), recursive=True)
    )
    if not pages:
        sys.exit("Nie znaleziono podstron – uruchom skrypt z katalogu projektu.")

    changed = 0
    for page in pages:
        lang = "pl" if os.sep + "pl" + os.sep in page else "en"
        html = read(page)
        new = HEADER_RE.sub(lambda m: m.group(1) + headers[lang] + m.group(2), html)
        new = FOOTER_RE.sub(lambda m: m.group(1) + footer + m.group(2), new)
        if new != html:
            with open(page, "w", encoding="utf-8") as f:
                f.write(new)
            changed += 1
            print("zaktualizowano:", os.path.relpath(page, ROOT))
    print(f"gotowe – zmienionych plików: {changed} / {len(pages)}")


if __name__ == "__main__":
    main()
