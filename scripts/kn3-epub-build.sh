#!/bin/bash
#
# kn.3 «Город Солнца» EPUB generator (pandoc-based)
# S3SCOOP cont+30 · 2026-07-29
#
# Design:
#   Monolithic MASTER.md → pandoc → EPUB3 output.
#   Cover extracted из SVG wrapper (embedded WebP base64 → PNG).
#   Metadata canon: dc:creator = «Команданте FolkUp» (pseudonym per Iskra S178b + Andrey deanon mandate 2026-07-28).
#   Real name preserved только в body колофоне (legal per PT Decreto-Lei 7/2004 Art. 10 + EU AI Act Art. 50(4)).
#
# Prerequisites: pandoc 3.x, python3, ImageMagick (magick)
#
# Usage:
#   bash scripts/kn3-epub-build.sh [VERSION]
#   VERSION defaults к value below (EPUB_VERSION).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MASTER="$PROJECT_ROOT/content/kn3/ru/MASTER.md"
COVER_SVG="$PROJECT_ROOT/public/covers/cover_kn3.svg"
BUILD_DIR="$PROJECT_ROOT/build/kn3"
DOWNLOADS_DIR="$PROJECT_ROOT/public/kn3/downloads"

EPUB_VERSION="${1:-v1.0.1}"
OUTPUT_EPUB="$DOWNLOADS_DIR/city-of-the-sun-${EPUB_VERSION}.epub"

echo "📚 kn.3 «Город Солнца» EPUB build ${EPUB_VERSION}"
echo "================================================"

mkdir -p "$BUILD_DIR" "$DOWNLOADS_DIR"

# Step 1 — extract cover WebP из SVG base64 wrapper
echo "🎨 Extracting cover from SVG wrapper..."
# Convert Git Bash / MSYS paths → native Windows paths для Python (Windows Python не понимает /c/... form)
COVER_SVG_NATIVE=$(cygpath -w "$COVER_SVG" 2>/dev/null || echo "$COVER_SVG")
BUILD_DIR_NATIVE=$(cygpath -w "$BUILD_DIR" 2>/dev/null || echo "$BUILD_DIR")
python3 - <<PYEOF
import re, base64, sys, os
svg_path = r"$COVER_SVG_NATIVE"
out_webp = os.path.join(r"$BUILD_DIR_NATIVE", "cover.webp")
with open(svg_path, 'r', encoding='utf-8') as f:
    svg = f.read()
m = re.search(r'data:image/webp;base64,([A-Za-z0-9+/=]+)', svg)
if not m:
    print('ERR: no base64 WebP found в SVG', file=sys.stderr)
    sys.exit(1)
data = base64.b64decode(m.group(1))
with open(out_webp, 'wb') as f:
    f.write(data)
print(f'  [OK] extracted {len(data)} bytes -> cover.webp')
PYEOF

# Step 2 — WebP → PNG (1200×1800 sRGB для broader EPUB reader compat)
echo "🎨 Converting WebP → PNG (1200×1800)..."
magick "$BUILD_DIR/cover.webp" -background white -flatten -resize 1200x1800 "$BUILD_DIR/cover.png"
COVER_SIZE=$(du -h "$BUILD_DIR/cover.png" | cut -f1)
echo "  ✓ cover.png: $COVER_SIZE"

# Step 3 — pandoc → EPUB3 build
echo "📖 Building EPUB3..."
pandoc "$MASTER" \
  --from markdown \
  --to epub3 \
  --toc \
  --toc-depth=2 \
  --epub-cover-image="$BUILD_DIR/cover.png" \
  --metadata title="Город Солнца. Ретроспектива 2026" \
  --metadata creator="Команданте FolkUp" \
  --metadata lang="ru" \
  --metadata publisher="FolkUp Ecosystem" \
  --metadata rights="© 2026 Команданте FolkUp. Licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)" \
  --metadata description="Как утопии города становятся планом — и что из этого выходит. Книга серии «Своим умом», трилогия «Своими силами»." \
  --metadata date="$(date -u +%Y-%m-%d)" \
  --metadata subject="essays, urban planning, utopia, philosophy, business, agile" \
  --output "$OUTPUT_EPUB"

EPUB_SIZE=$(du -h "$OUTPUT_EPUB" | cut -f1)
FILE_COUNT=$(unzip -l "$OUTPUT_EPUB" | tail -1 | awk '{print $2}')
echo "  ✓ EPUB: $EPUB_SIZE ($FILE_COUNT files)"

# Step 4 — Quick QA (metadata check)
echo ""
echo "🔍 QA metadata:"
unzip -p "$OUTPUT_EPUB" EPUB/content.opf | grep -oE "dc:[a-z]+>[^<]+" | head -8

# Step 5 — Deanon sanity check (no real name в metadata)
echo ""
echo "🛡  Deanon check (metadata should NOT contain real name):"
if unzip -p "$OUTPUT_EPUB" EPUB/content.opf | grep -q "Клеменч[её]нок"; then
  echo "  ❌ FAIL: real name found в EPUB metadata!"
  exit 1
else
  echo "  ✓ EPUB metadata clean (pseudonym only)"
fi

# Step 6 — cleanup build/
rm -rf "$BUILD_DIR"

echo ""
echo "🎉 EPUB build complete!"
echo "  Output: $OUTPUT_EPUB"
echo ""
echo "Next: adapt для PDF (Puppeteer install в portal npm), OR ship EPUB volna первой."
