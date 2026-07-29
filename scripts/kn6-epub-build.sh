#!/bin/bash
#
# kn.6 «Своими глазами» EPUB generator (pandoc-based)
# S3SCOOP cont+30 · 2026-07-29
#
# Per Iskra S228 §1 reassignment kn6-build ownership → S3SCOOP + Кочегар.
# Handoff pack: vault/memory/kn6-build-handoff-2026-07-29.md.
#
# Design:
#   Sources: KN6-SVOD-MASTER-v1.0-S196.md (body, 1411 строк) + APPARAT v1.0 (canonical)
#   с v1.2 «Как исправить эту книгу» insertion (per Iskra S216 fix + Iskra S197 canonical order).
#
#   Apparatus insertion order per Iskra S197 canonical:
#     Источники → Именной указатель → Благодарности → [Как исправить] → Заявление ИИ → Лицензия → Колофон
#
# Build workspace: /c/Transit/kn6-build/ (per handoff §5 rule — не vault, не repo, до Iskra PASS).
# Post-approval: copy к folkup-books-portal/public/kn6/downloads/ + PR + prod verify.
#
# Metadata canon:
#   - dc:creator = «Команданте FolkUp» (pseudonym per Iskra S178b + Andrey deanon mandate)
#   - Rights CC BY-SA 4.0
#   - Cover: cover_kn6.png (Frida art, ready PNG — SVG extraction not needed)
#
# Prerequisites: pandoc 3.x, ImageMagick (magick)
#
# Usage:
#   bash scripts/kn6-epub-build.sh [VERSION]
#   VERSION defaults к v1.0.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VAULT_ROOT="/c/JOHNDOE_CLAUDE/vault"

SVOD_MASTER="$VAULT_ROOT/books/KN6-SVOD-MASTER-v1.0-S196.md"
APPARAT_V10="$VAULT_ROOT/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md"
APPARAT_V12="$VAULT_ROOT/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md"

COVER_PNG="$PROJECT_ROOT/public/covers/cover_kn6.png"

# Build workspace — per handoff §5 rule: не vault, не repo
BUILD_DIR="/c/Transit/kn6-build"

EPUB_VERSION="${1:-v1.0}"
OUTPUT_EPUB="$BUILD_DIR/kn6-svoimi-glazami-${EPUB_VERSION}.epub"

echo "📚 kn.6 «Своими глазами» EPUB build ${EPUB_VERSION}"
echo "===================================================="

mkdir -p "$BUILD_DIR"

# Step 1 — verify sources exist
echo "🔍 Verifying canonical sources..."
for src in "$SVOD_MASTER" "$APPARAT_V10" "$APPARAT_V12"; do
  if [[ ! -f "$src" ]]; then
    echo "  ❌ MISSING: $src" >&2
    exit 1
  fi
  echo "  ✓ $(basename $src)"
done

# Cover check
if [[ ! -f "$COVER_PNG" ]]; then
  echo "  ❌ MISSING cover: $COVER_PNG" >&2
  exit 1
fi
echo "  ✓ cover_kn6.png ($(du -h $COVER_PNG | cut -f1))"

# Step 2 — resize cover к EPUB-friendly 1200×1800
echo ""
echo "🎨 Preparing cover (1200×1800 sRGB)..."
magick "$COVER_PNG" -background white -flatten -resize 1200x1800 "$BUILD_DIR/cover.png"
echo "  [OK] cover ready: $(du -h $BUILD_DIR/cover.png | cut -f1)"

# Step 3 — assemble merged .md с apparatus в canonical order
# Extract v1.2 «Как исправить» section (lines 42-77 из v1.2 file):
echo ""
echo "📝 Assembling merged manuscript..."
echo "   (preprocess: strip HTML comment header + AsciiDoc annotations [[anchor]] / [.role])"

MERGED_MD="$BUILD_DIR/kn6-merged.md"

# Preprocess SVOD master:
# 1) Strip leading HTML comment metadata (lines 1..first `-->`) — internal S196 build note
# 2) Strip AsciiDoc anchor lines: ^[[some-id]]$
# 3) Strip AsciiDoc block role lines: ^[.some-role]$ (e.g. [.dateline], [.interlude], [.coda])
# Rationale: pandoc markdown reader treats these as invalid link/paragraph text
# which produces malformed chapter splits (Lesson: kn.6 first build attempt lost
# «I. Проверь сам» chapter due к [[glava-prover-sam]] anchor before H1).

python3 - <<PYEOF
import re, os

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

svod_path = native(r"$SVOD_MASTER")
merged_path = native(r"$MERGED_MD")

with open(svod_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1) Strip leading metadata: everything before first «# » heading.
#    SVOD S196 header uses nested HTML comments (line 20 has inner <!-- V2 Iskra --> ),
#    breaking simple <!--...--> regex. First reader-facing content = «# Введение».
lines_all = content.split('\n')
first_h1 = None
for i, line in enumerate(lines_all):
    if line.startswith('# '):
        first_h1 = i
        break
if first_h1 is None:
    print('ERR: no # heading found в SVOD master', __import__('sys').stderr)
    __import__('sys').exit(1)
content = '\n'.join(lines_all[first_h1:])

# 2+3) Strip AsciiDoc anchor + block role lines
cleaned_lines = []
for line in content.split('\n'):
    stripped = line.strip()
    if re.match(r'^\[\[[a-zA-Z0-9_-]+\]\]$', stripped):
        continue  # anchor
    if re.match(r'^\[\.[a-zA-Z0-9_-]+\]$', stripped):
        continue  # block role
    cleaned_lines.append(line)

cleaned = '\n'.join(cleaned_lines)

with open(merged_path, 'w', encoding='utf-8') as f:
    f.write(cleaned)

print(f'  [OK] SVOD preprocessed: stripped HTML header + AsciiDoc annotations')
PYEOF

echo "" >> "$MERGED_MD"
echo "" >> "$MERGED_MD"

# Extract v1.0 apparat: skip header/preservation note (lines 1-9), keep Источники onwards
# Split by «## Благодарности» section — insert v1.2 «Как исправить» AFTER Благодарности, BEFORE «Заявление о прозрачности ИИ»

# Method: Read v1.0 apparat, find «## Благодарности» → «## Заявление» boundary,
# splice v1.2 «Как исправить» in между.

python3 - <<PYEOF
import sys, os

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

svod_md_path = native(r"$MERGED_MD")
apparat_v10_path = native(r"$APPARAT_V10")
apparat_v12_path = native(r"$APPARAT_V12")

# Read v1.0 apparat body — skip preservation header (line 1-9 approx)
with open(apparat_v10_path, 'r', encoding='utf-8') as f:
    v10_lines = f.readlines()

# Find where actual content starts (after «---» separator following preservation note)
# Preservation note ends at line 8 (---), content starts at line 10 «## Источники»
apparat_start = 0
for i, line in enumerate(v10_lines):
    if line.strip().startswith('## Источники'):
        apparat_start = i
        break
apparat_body = ''.join(v10_lines[apparat_start:])

# Read v1.2 «Как исправить» section (lines 42-77 из v1.2 = section starts at «## Как исправить эту книгу»)
with open(apparat_v12_path, 'r', encoding='utf-8') as f:
    v12_lines = f.readlines()

kak_ispravit_start = None
kak_ispravit_end = None
for i, line in enumerate(v12_lines):
    if line.strip().startswith('## Как исправить эту книгу'):
        kak_ispravit_start = i
    elif kak_ispravit_start is not None and line.strip().startswith('## 3.'):
        # «## 3. ИТОГОВЫЙ ПОРЯДОК» — end of «Как исправить» section
        kak_ispravit_end = i
        break

kak_ispravit_section = ''.join(v12_lines[kak_ispravit_start:kak_ispravit_end])

# Insert «Как исправить» AFTER «Благодарности», BEFORE «Заявление о прозрачности ИИ»
# Find boundary в apparat_body
lines = apparat_body.split('\n')
insert_at = None
for i, line in enumerate(lines):
    if line.startswith('## Заявление о прозрачности ИИ'):
        insert_at = i
        break

if insert_at is None:
    print('ERR: Заявление о прозрачности ИИ not found в apparat v1.0', file=sys.stderr)
    sys.exit(1)

# Insert section
final_apparat = '\n'.join(lines[:insert_at]) + '\n' + kak_ispravit_section + '\n' + '\n'.join(lines[insert_at:])

# Append к merged md
with open(svod_md_path, 'a', encoding='utf-8') as f:
    f.write('\n\n')
    f.write(final_apparat)

print(f'  [OK] Assembled merged manuscript')
print(f'    Apparatus body: {len(apparat_body.split(chr(10)))} lines from v1.0')
print(f'    + Kak ispravit inserted from v1.2 ({len(kak_ispravit_section.split(chr(10)))} lines)')
PYEOF

MERGED_LINES=$(wc -l < "$MERGED_MD")
echo "  [OK] merged.md: $MERGED_LINES lines"

# Step 4 — pandoc → EPUB3 build
echo ""
echo "📖 Building EPUB3..."
pandoc "$MERGED_MD" \
  --from markdown \
  --to epub3 \
  --toc \
  --toc-depth=2 \
  --epub-cover-image="$BUILD_DIR/cover.png" \
  --metadata title="Своими глазами" \
  --metadata creator="Команданте FolkUp" \
  --metadata lang="ru" \
  --metadata publisher="FolkUp Ecosystem" \
  --metadata rights="© 2026 Команданте FolkUp. Licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)" \
  --metadata description="Как отличить настоящее от подделки — своими глазами, шесть веков, девять историй. Книга серии «Своим умом», трилогия «Из первых рук»." \
  --metadata date="$(date -u +%Y-%m-%d)" \
  --metadata subject="essays, epistemology, forensics, verification, history" \
  --output "$OUTPUT_EPUB"

EPUB_SIZE=$(du -h "$OUTPUT_EPUB" | cut -f1)
FILE_COUNT=$(unzip -l "$OUTPUT_EPUB" | tail -1 | awk '{print $2}')
echo "  [OK] EPUB: $EPUB_SIZE ($FILE_COUNT files)"

# Step 5 — QA metadata
echo ""
echo "🔍 QA metadata:"
unzip -p "$OUTPUT_EPUB" EPUB/content.opf | grep -oE "dc:[a-z]+>[^<]+" | head -8

# Step 6 — Deanon sanity check
echo ""
echo "🛡  Deanon check (metadata should NOT contain real name):"
if unzip -p "$OUTPUT_EPUB" EPUB/content.opf | grep -q "Клеменч[её]нок"; then
  echo "  ❌ FAIL: real name found в EPUB metadata!"
  exit 1
else
  echo "  ✓ EPUB metadata clean (pseudonym only)"
fi

# Step 7 — TOC verification (chapters detected)
echo ""
echo "📑 TOC structure (first 10 nav entries):"
unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml | grep -oP '<li[^>]*>.*?</li>' | head -10 | sed 's/<[^>]*>//g' | head -10

echo ""
echo "🎉 kn.6 EPUB build complete!"
echo "  Output: $OUTPUT_EPUB"
echo "  Merge stats: SVOD($MERGED_LINES lines) + APPARAT v1.0 + v1.2 «Как исправить» insertion"
echo ""
echo "Next steps per handoff §3 workflow:"
echo "  5. Submit к Iskra: MAYAK-Alisa-S3SCOOP-cont30-kn6-build-artefakt-priyomka с $OUTPUT_EPUB"
echo "  6. WAIT Iskra приёмка verdict"
echo "  7. If PASS: copy к portal/public/kn6/downloads/ + PR + prod verify"
