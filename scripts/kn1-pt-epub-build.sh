#!/bin/bash
#
# kn.1 «Agile Sapiens» (PT edition) EPUB v1.0.0 generator (pandoc-based)
# S1KOCHEGAR cont+14 · 2026-09-06 (per Iskra START-S315-08 + KANON EPUB-TRAKT-1 S315-04+06)
#
# CANON EPUB-TRAKT-1 compliance:
#   §2.1 nav.xhtml REMOVED from spine outright (S315-06 refinement, v1.1e pattern)
#   §2.2 Cover = Frida art `cover_kn1_pt.v3.png` (не типографский титул), resize 1200x1800
#   §2.3 Images JPEG/PNG only (no webp in manifest) — kn1 PT text-only anyway
#   §2.4 xhtml ≥ 10 · nav ≥ 60 chapters+sections · no ::: {# <figure в теле
#   §2.5 Проба Андрея (test URL до series.yaml swap)
#
# Content sources: folkup-books-portal/content/kn1/pt/
#   - chapters/*.md (16 chapters + intermezzos + preface + afterword) via manifest ordering
#   - chapters/apparatus/*.md (7 apparatus files, apparatus-* order per manifest)
#
# Metadata canon:
#   - dc:creator = «Comandante FolkUp» (pseudonym per Iskra S178b + Andrey deanon)
#   - Real name «Andrei Klemenchenok» в apparatus/colophon только (legal per PT Decreto-Lei 7/2004 Art. 10 + AI Act 50(4))
#   - Rights CC BY-SA 4.0
#   - Language pt, translator Zeka
#
# Prerequisites: pandoc 3.x, ImageMagick (magick), python3, epubcheck 5.x
#
# Usage: bash scripts/kn1-pt-epub-build.sh [VERSION]

set -euo pipefail
export PYTHONIOENCODING=utf-8

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

CONTENT_ROOT="$PROJECT_ROOT/content/kn1/pt"
CHAPTERS_DIR="$CONTENT_ROOT/chapters"
APPARATUS_DIR="$CONTENT_ROOT/chapters/apparatus"
MANIFEST_JSON="$CONTENT_ROOT/chapters-manifest.json"

# CANON EPUB-TRAKT-1 §2.2: cover = Frida art с витрины (public/covers/), не типографский титул
COVER_PNG="$PROJECT_ROOT/public/covers/cover_kn1_pt.v3.png"

BUILD_DIR="/c/Transit/kn1-pt-build"
EPUB_VERSION="${1:-v1.0.0}"
OUTPUT_EPUB="$BUILD_DIR/agile-sapiens-pt-${EPUB_VERSION}.epub"

echo "📚 kn.1 «Agile Sapiens» (PT) EPUB build ${EPUB_VERSION} (КАНОН EPUB-TRAKT-1)"
echo "==========================================================================="
echo "  Cover: cover_kn1_pt.v3.png (Frida v3 art 31.08) → resize 1200x1800"
echo "  Nav: REMOVED from spine (S315-06 canon)"
echo "  Text-only: no plates in body"
echo ""

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Verify sources
for src in "$MANIFEST_JSON" "$COVER_PNG"; do
  [[ -f "$src" ]] || { echo "  ❌ MISSING: $src" >&2; exit 1; }
done
[[ -d "$CHAPTERS_DIR" ]] || { echo "  ❌ MISSING dir: $CHAPTERS_DIR" >&2; exit 1; }
[[ -d "$APPARATUS_DIR" ]] || { echo "  ❌ MISSING dir: $APPARATUS_DIR" >&2; exit 1; }

echo "  ✓ Manifest: $MANIFEST_JSON"
echo "  ✓ Chapters dir: $(find $CHAPTERS_DIR -maxdepth 1 -name '*.md' | wc -l) .md files"
echo "  ✓ Apparatus dir: $(find $APPARATUS_DIR -maxdepth 1 -name '*.md' | wc -l) .md files"
echo "  ✓ Cover source: $(du -h $COVER_PNG | cut -f1) $(magick identify $COVER_PNG | awk '{print $3}')"

# Step 1 — Cover resize (canon §2.2 ≥1600 px height gate → 1200x1800)
echo ""
echo "🎨 Cover resize к 1200x1800..."
magick "$COVER_PNG" -background white -flatten -resize 1200x1800 "$BUILD_DIR/cover.png"
COVER_MD5=$(md5sum "$BUILD_DIR/cover.png" | awk '{print $1}')
echo "  ✓ Cover resized: $(du -h $BUILD_DIR/cover.png | cut -f1) $(magick identify $BUILD_DIR/cover.png | awk '{print $3}')"
echo "  ✓ Cover md5: $COVER_MD5"

# Step 2 — Assemble merged.md (chapters по manifest order + apparatus canonical order)
echo ""
echo "📝 Assembling merged.md по manifest ordering..."

MERGED_MD="$BUILD_DIR/kn1-pt-merged.md"

python3 - <<'PYEOF'
import json, os, re, sys

CONTENT_ROOT = "/c/JOHNDOE_CLAUDE/tmp-s1kochegar-cont14-kn1-pt-epub/content/kn1/pt"
BUILD_DIR = "/c/Transit/kn1-pt-build"

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

manifest_path = native(f"{CONTENT_ROOT}/chapters-manifest.json")
chapters_dir = native(f"{CONTENT_ROOT}/chapters")
apparatus_dir = native(f"{CONTENT_ROOT}/chapters/apparatus")
merged_path = native(f"{BUILD_DIR}/kn1-pt-merged.md")

with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Sort entries by order field (canonical per manifest)
entries_sorted = sorted(manifest['entries'], key=lambda e: e['order'])

# Split: chapters (isApparatus=false) + apparatus (isApparatus=true)
chapters = [e for e in entries_sorted if not e.get('isApparatus', False)]
apparatus = [e for e in entries_sorted if e.get('isApparatus', False)]

print(f'  Manifest entries: {len(entries_sorted)} (chapters: {len(chapters)}, apparatus: {len(apparatus)})')

def strip_frontmatter(text):
    """Remove YAML frontmatter (---\n...\n---\n) — pandoc metadata handled top-level"""
    m = re.match(r'^---\n.*?\n---\n', text, re.DOTALL)
    if m:
        return text[m.end():]
    return text

def strip_footer_link(text):
    """Remove reader-only 'Ao Índice ↗' footer link before EPUB embed"""
    # Pattern: '---\n\n*[Ao Índice ↗](/kn1/pt/read)*' at file end
    text = re.sub(r'\n---\s*\n\s*\*\[[^\]]+\]\([^)]+\)\*\s*$', '\n', text, flags=re.MULTILINE)
    return text.rstrip() + '\n'

def strip_image_refs(text):
    """Remove markdown image refs (plates .webp/.png/.jpg) — text-only EPUB per canon §2.3"""
    text = re.sub(
        r'!\[[^\]]*\]\([^\)]+\.(webp|png|jpg|jpeg|gif|svg)\)\s*\n?',
        '',
        text,
        flags=re.IGNORECASE
    )
    # Also strip HTML <figure><img> blocks (defensive)
    text = re.sub(r'<figure[^>]*>.*?</figure>\s*', '', text, flags=re.DOTALL | re.IGNORECASE)
    return text

def strip_reader_urls(text):
    """Replace absolute /kn1/pt/read/* cross-reference links with plain text (canon §RSC-026 fix)

    Web reader has these URLs; EPUB cannot resolve them (RSC-026 URL leaks outside container).
    Pattern: [text](/kn1/pt/read/slug) → text (keeping the display text, dropping the link)
    """
    text = re.sub(r'\[([^\]]+)\]\(/kn1/pt/read[^\)]*\)', r'\1', text)
    # Also strip href="/kn1/..." in HTML anchors
    text = re.sub(r'<a\s+href="/kn1/[^"]*"[^>]*>([^<]+)</a>', r'\1', text)
    return text

def read_content(entry):
    """Read chapter or apparatus file, strip frontmatter + footer + images, prepend H1 title"""
    slug = entry['slug']
    is_apparatus = entry.get('isApparatus', False)

    if is_apparatus:
        # Slug like 'apparatus-transparency' → file 'transparency.md'
        file_slug = slug.replace('apparatus-', '')
        path = os.path.join(apparatus_dir, f'{file_slug}.md')
    else:
        path = os.path.join(chapters_dir, f'{slug}.md')

    if not os.path.exists(path):
        print(f'  [WARN] MISSING: {path}', file=sys.stderr)
        return None

    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    text = strip_frontmatter(text)
    text = strip_footer_link(text)
    text = strip_image_refs(text)
    text = strip_reader_urls(text)
    text = text.lstrip()

    # Prepend H1 title from manifest ONLY if file doesn't already start with H1
    # (apparatus files already have # Title; chapters usually start with ## OR blockquote — need H1 prepend)
    # Vraga catch cont+14: duplicate H1s caused 6 orphan stub xhtml pages в apparatus
    if not re.match(r'^# [^#\n]', text):
        title = entry.get('title', slug).strip()
        text = f'# {title}\n\n' + text
    return text

# Assemble body
body_parts = []
for e in chapters:
    content = read_content(e)
    if content:
        body_parts.append(content)
        print(f'  ✓ chapter: {e["slug"]} ({len(content)} chars)')
    else:
        print(f'  ❌ SKIP: {e["slug"]} (file missing)')

# Apparatus (in canonical order per manifest)
apparat_parts = []
for e in apparatus:
    content = read_content(e)
    if content:
        apparat_parts.append(content)
        print(f'  ✓ apparatus: {e["slug"]} ({len(content)} chars)')
    else:
        print(f'  ❌ SKIP: {e["slug"]} (file missing)')

# Merge
merged = '\n\n'.join(body_parts + apparat_parts)

with open(merged_path, 'w', encoding='utf-8') as f:
    f.write(merged)

lines_count = merged.count('\n')
print(f'')
print(f'  [OK] merged.md: {lines_count} lines, {len(merged)} chars')
PYEOF

echo ""
echo "  ✓ merged.md: $(wc -l < $MERGED_MD) lines, $(du -h $MERGED_MD | cut -f1)"

# Step 3 — pandoc EPUB3 build с PT metadata
echo ""
echo "📖 pandoc EPUB3 build (PT canon)..."

cd "$BUILD_DIR"

pandoc kn1-pt-merged.md \
  --from markdown \
  --to epub3 \
  --toc \
  --toc-depth=3 \
  --epub-cover-image=cover.png \
  --resource-path=".:$BUILD_DIR" \
  --metadata title="Agile Sapiens" \
  --metadata subtitle="Análise Literária da Gestão" \
  --metadata creator="Comandante FolkUp" \
  --metadata lang="pt" \
  --metadata publisher="FolkUp Ecosystem" \
  --metadata rights="© 2026 Comandante FolkUp. Licenciado sob CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)" \
  --metadata description="Análise literária da gestão: como a literatura previu a gestão moderna. Monografia científica popular sobre como as obras clássicas descreveram intuitivamente princípios que a gestão comercializou mais tarde como metodologias revolucionárias." \
  --metadata date="$(date -u +%Y-%m-%d)" \
  --metadata subject="literatura, gestão, análise literária, agile, metodologia" \
  --output "$OUTPUT_EPUB"

echo "  ✓ pandoc build: $(du -h $OUTPUT_EPUB | cut -f1)"

# Step 4 — POSTPROCESS: REMOVE nav.xhtml itemref from spine (per КАНОН S315-06 v1.1e refinement)
echo ""
echo "🔧 Postprocess: REMOVE nav itemref from spine (per КАНОН EPUB-TRAKT-1 §2.1 S315-06)..."

OUTPUT_EPUB="$OUTPUT_EPUB" python3 - <<'PYEOF'
import zipfile, shutil, os, sys, re

OUTPUT = os.environ.get('OUTPUT_EPUB', '')
if OUTPUT.startswith('/c/'):
    OUTPUT = OUTPUT.replace('/c/', 'C:/', 1)

TEMP = OUTPUT + '.tmp'

nav_removals = 0
landmarks_removals = 0

with zipfile.ZipFile(OUTPUT, 'r') as z_in:
    with zipfile.ZipFile(TEMP, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for item in z_in.infolist():
            data = z_in.read(item.filename)
            if item.filename == 'EPUB/content.opf':
                content = data.decode('utf-8')
                # REMOVE `<itemref idref="nav" ... />` entirely (S315-06 canon: nav НЕ в spine вообще)
                new_content, n = re.subn(
                    r'\s*<itemref\s+idref="nav"[^/]*/>\s*\n?',
                    '\n    ',
                    content
                )
                nav_removals = n
                content = new_content
                data = content.encode('utf-8')
            elif item.filename == 'EPUB/nav.xhtml':
                # Also remove landmarks TOC ref (avoid RSC-011 if nav referenced by landmarks)
                content = data.decode('utf-8')
                new_content, n = re.subn(
                    r'\s*<li>\s*<a\s+href="#toc"[^>]*>[^<]+</a>\s*</li>\s*',
                    '\n    ',
                    content
                )
                landmarks_removals = n
                content = new_content
                data = content.encode('utf-8')
            # Mimetype MUST be first + uncompressed
            if item.filename == 'mimetype':
                new_item = zipfile.ZipInfo('mimetype')
                new_item.compress_type = zipfile.ZIP_STORED
                z_out.writestr(new_item, data)
            else:
                z_out.writestr(item, data)

shutil.move(TEMP, OUTPUT)
print(f'  [OK] nav itemref removals: {nav_removals}')
print(f'  [OK] landmarks TOC ref removals: {landmarks_removals}')
print(f'  [OK] EPUB postprocessed: {OUTPUT}')
PYEOF

# Step 5 — Verify gates (canon EPUB-TRAKT-1 §2 + Iskra S315-08 §1.1)
echo ""
echo "🔍 Verify canon gates:"

# Gate 1: nav idref=0 (canon §2.1)
NAV_IN_SPINE=$(unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -c 'idref="nav"' || echo "0")
echo "  Gate 1 (nav in spine): $NAV_IN_SPINE (must be 0)"

# Gate 2: no image/webp в manifest (canon §2.3)
WEBP_IN_MANIFEST=$(unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -c 'image/webp' || echo "0")
echo "  Gate 2 (image/webp): $WEBP_IN_MANIFEST (must be 0)"

# Gate 3: xhtml count ≥ 10 (Iskra S315-08 §1.1)
XHTML_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "EPUB/text/.*\.xhtml" || echo "0")
echo "  Gate 3 (xhtml count ≥ 10): $XHTML_COUNT"

# Gate 4: nav PT ≥ 60 (Iskra §1.1) — use grep -oE | wc -l для count occurrences (не lines)
NAV_LI_COUNT=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | grep -oE '<a href="text/' | wc -l)
echo "  Gate 4 (nav PT ≥ 60): $NAV_LI_COUNT"

# Gate 5: no <figure> in body (canon)
FIGURE_COUNT=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -c '<figure' || echo "0")
echo "  Gate 5 (<figure> в теле = 0): $FIGURE_COUNT"

# Gate 6: no ::: (pandoc div syntax visible)
DIV_MARKER=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -c ':::' || echo "0")
echo "  Gate 6 (::: markers = 0): $DIV_MARKER"

# Gate 7: cover-image md5 = post-resize source md5
COVER_MEDIA=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -E "EPUB/media/.*\.png$" | awk '{print $NF}' | head -1)
if [[ -n "$COVER_MEDIA" ]]; then
  EPUB_COVER_MD5=$(unzip -p "$OUTPUT_EPUB" "$COVER_MEDIA" 2>/dev/null | md5sum | awk '{print $1}')
  echo "  Gate 7 (cover md5): $EPUB_COVER_MD5"
  echo "    Expected (source resized): $COVER_MD5"
  if [[ "$EPUB_COVER_MD5" == "$COVER_MD5" ]]; then
    echo "    ✓ Cover md5 match (Frida v3 art embedded)"
  else
    echo "    ❌ Cover md5 mismatch!"
  fi
fi

# Gate 8: Klemenchenok в apparatus/colophon (Iskra §1.3)
KLEMENCH_COUNT=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -c 'Klemenchenok' || echo "0")
echo "  Gate 8 (Klemenchenok ≥ 1 in colophon): $KLEMENCH_COUNT"

# Gate 9: Zeka translator credit
ZEKA_COUNT=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE '\bZeka\b' || echo "0")
echo "  Gate 9 (Zeka translator ≥ 1): $ZEKA_COUNT"

# Gate 10: epubcheck 3.3 clean
echo ""
echo "🔍 epubcheck:"
epubcheck "$OUTPUT_EPUB" 2>&1 | tail -5

echo ""
echo "🎉 kn.1 PT EPUB ${EPUB_VERSION} build complete!"
echo "  Output: $OUTPUT_EPUB"
echo "  MD5: $(md5sum $OUTPUT_EPUB | awk '{print $1}')"
echo "  Size: $(du -h $OUTPUT_EPUB | cut -f1)"
