#!/bin/bash
#
# kn.6 «Своими глазами» EPUB v1.1 generator (pandoc-based)
# S1KOCHEGAR cont+13 · 2026-09-06
#
# Per PLAN-KARTINKI Iskra S313-06 §1: v1.1 = v1.0 + 13 плашек Фриды (act-openers)
#   + 7 первоисточников (в теле глав) + аппарат «Иллюстрации» + colophon S223.
#
# Structural gates 10-13 per Iskra S313-13 §3:
#   (10) EPUB/text/*.xhtml ≥ 15 (kn6 has 13 sections + apparat + covers)
#   (11) nav.xhtml без "Title Page/Cover/Table of Contents" — только русские
#   (12) nav ≥ 60 пунктов (per S313-13 §4 kn7 baseline)
#   (13) размер ≥ 6.0 MB (13 плашек + 7 первоисточников в полном разрешении)
#
# Companion к kn6-epub-build.sh (v1.0), extends с injection + Иллюстрации.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VAULT_ROOT="/c/JOHNDOE_CLAUDE/vault"

SVOD_MASTER="$VAULT_ROOT/books/KN6-SVOD-MASTER-v1.0-S196.md"
APPARAT_V10="$VAULT_ROOT/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md"
APPARAT_V12="$VAULT_ROOT/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md"

COVER_PNG="$PROJECT_ROOT/public/covers/cover_kn6.png"

# Frida plates + первоисточники source location
IMAGES_SRC="$PROJECT_ROOT/content/kn6/ru/images"
SOURCES_SRC="$PROJECT_ROOT/content/kn6/ru/images/sources"

BUILD_DIR="/c/Transit/kn6-build-v1.1"

EPUB_VERSION="${1:-v1.1}"
OUTPUT_EPUB="$BUILD_DIR/kn6-svoimi-glazami-${EPUB_VERSION}.epub"

echo "📚 kn.6 «Своими глазами» EPUB build ${EPUB_VERSION}"
echo "===================================================="
echo "  PLAN-KARTINKI Iskra S313-06 §1: 13 плашек + 7 первоисточников + аппарат «Иллюстрации» + S223 colophon"
echo "  Gates 10-13 per S313-13 §3: xhtml ≥ 15 · nav русский без English placeholders · nav ≥ 60 · size ≥ 6.0 MB"
echo ""

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/media"

# Step 1 — verify sources exist
echo "🔍 Verifying canonical sources..."
for src in "$SVOD_MASTER" "$APPARAT_V10" "$APPARAT_V12" "$COVER_PNG"; do
  if [[ ! -f "$src" ]]; then
    echo "  ❌ MISSING: $src" >&2
    exit 1
  fi
  echo "  ✓ $(basename $src)"
done

# Verify all 13 Frida plates + 7 first-sources
echo ""
echo "🔍 Verifying 13 Frida plates + 7 first-sources..."
FRIDA_PLATES=(
  "kn6-00-vvedenie.webp"
  "kn6-01-prover-sam.webp"
  "kn6-02-filolog.webp"
  "kn6-03-inkvizitor.webp"
  "kn6-04-komissiya.webp"
  "kn6-05-vrach.webp"
  "kn6-06-oficer.webp"
  "kn6-07-sozhzhennyy-arkhiv.webp"
  "kn6-08-ten.webp"
  "kn6-vrezka-01-khor.webp"
  "kn6-vrezka-02-lozh.webp"
  "kn6-intermediya-kartograf.webp"
  "kn6-koda-kartoteka.webp"
)
FIRST_SOURCES=(
  "01-bailly-rapport-1784-title.webp"
  "02-zola-jaccuse-laurore-1898.webp"
  "03-bordereau-dreyfus-1894.webp"
  "04-semmelweis-aetiologie-1861-title.webp"
  "05-donatio-constantini-stgallen-9c.webp"
  "06-valla-de-falso-credita-1620.webp"
  "07-apollo11-aldrin-1969.webp"
)

MISSING=0
for p in "${FRIDA_PLATES[@]}"; do
  if [[ ! -f "$IMAGES_SRC/$p" ]]; then
    echo "  ❌ MISSING plate: $p"
    MISSING=1
  fi
done
for s in "${FIRST_SOURCES[@]}"; do
  if [[ ! -f "$SOURCES_SRC/$s" ]]; then
    echo "  ❌ MISSING source: $s"
    MISSING=1
  fi
done
if [[ $MISSING -ne 0 ]]; then
  echo "  ❌ FAIL: missing images"
  exit 1
fi
echo "  ✓ 13 плашек Фриды + 7 первоисточников — all present"

# Step 2 — copy images to build dir (pandoc will pick up с relative paths)
echo ""
echo "📸 Copying images to build workspace..."
for p in "${FRIDA_PLATES[@]}"; do
  cp "$IMAGES_SRC/$p" "$BUILD_DIR/media/$p"
done
for s in "${FIRST_SOURCES[@]}"; do
  cp "$SOURCES_SRC/$s" "$BUILD_DIR/media/$s"
done
IMG_TOTAL_SIZE=$(du -sh "$BUILD_DIR/media" | cut -f1)
echo "  ✓ 20 images copied ($IMG_TOTAL_SIZE)"

# Step 3 — resize cover
echo ""
echo "🎨 Preparing cover (1200×1800 sRGB)..."
magick "$COVER_PNG" -background white -flatten -resize 1200x1800 "$BUILD_DIR/cover.png"
echo "  ✓ cover ready: $(du -h $BUILD_DIR/cover.png | cut -f1)"

# Step 4 — assemble merged .md с images + apparatus
echo ""
echo "📝 Assembling merged manuscript с injected images..."

MERGED_MD="$BUILD_DIR/kn6-merged.md"

python3 - <<'PYEOF'
import re, os, sys

VAULT_ROOT = "/c/JOHNDOE_CLAUDE/vault"
BUILD_DIR = "/c/Transit/kn6-build-v1.1"

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

svod_path = native(f"{VAULT_ROOT}/books/KN6-SVOD-MASTER-v1.0-S196.md")
apparat_v10_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md")
apparat_v12_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md")
merged_path = native(f"{BUILD_DIR}/kn6-merged.md")

# =========================================================================
# CHAPTER PLATE MAPPING (per content/kn6/ru/images/README.md)
# =========================================================================
# Structure: {chapter_heading_prefix: (frida_plate, [first_sources_with_captions])}
# Chapter_heading_prefix — match beginning of H1 line for injection.

PLATE_MAP = {
    "Введение. Своими глазами": {
        "plate": "kn6-00-vvedenie.webp",
        "plate_caption": "Плашка Фриды: конформность — фигура и хор",
        "sources": [],  # Frida only, no first-source
    },
    "I. Проверь сам": {
        "plate": "kn6-01-prover-sam.webp",
        "plate_caption": "Плашка Фриды: «Проверь сам»",
        "sources": [
            ("07-apollo11-aldrin-1969.webp",
             "Астронавт Buzz Aldrin на поверхности Луны. Фото: Neil Armstrong / NASA, миссия Apollo 11, 21 июля 1969. Wikimedia Commons, Public Domain."),
        ],
    },
    "II. Филолог": {
        "plate": "kn6-02-filolog.webp",
        "plate_caption": "Плашка Фриды: филолог с увеличительным стеклом",
        "sources": [
            ("06-valla-de-falso-credita-1620.webp",
             "Lorenzo Valla, *De falso credita et ementita Constantini Donatione declamatio* — титульный лист издания 1620 г. Текст 1440 г. Wikimedia Commons, Public Domain."),
        ],
    },
    "III. Инквизитор": {
        "plate": "kn6-03-inkvizitor.webp",
        "plate_caption": "Плашка Фриды: «Инквизитор»",
        "sources": [
            ("05-donatio-constantini-stgallen-9c.webp",
             "*Constitutum Constantini* (Донация Константина), рукопись IX века. St. Gallen, Stiftsbibliothek, Cod. Sang. 670, стр. 318. Wikimedia Commons, Public Domain."),
        ],
    },
    "IV. Комиссия": {
        "plate": "kn6-04-komissiya.webp",
        "plate_caption": "Плашка Фриды: «Комиссия»",
        "sources": [
            ("01-bailly-rapport-1784-title.webp",
             "Титульный лист: *Rapport des commissaires chargés par le Roi, de l'examen du magnétisme animal.* Paris: Imprimerie royale, 1784. Wikimedia Commons, Public Domain."),
        ],
    },
    "V. Врач": {
        "plate": "kn6-05-vrach.webp",
        "plate_caption": "Плашка Фриды: «Врач»",
        "sources": [
            ("04-semmelweis-aetiologie-1861-title.webp",
             "Ignaz Philipp Semmelweis, *Die Aetiologie, der Begriff und die Prophylaxis des Kindbettfiebers.* Pest, Wien & Leipzig: C. A. Hartleben's Verlags-Expedition, 1861 (титульный лист). Wikimedia Commons, Public Domain."),
        ],
    },
    "VI. Офицер": {
        "plate": "kn6-06-oficer.webp",
        "plate_caption": "Плашка Фриды: «Офицер»",
        "sources": [
            ("02-zola-jaccuse-laurore-1898.webp",
             "*«J'accuse…!»* Émile Zola, опубликовано в *L'Aurore*, 13 января 1898. Wikimedia Commons, Public Domain (Франция + США). *Droit moral perpetuel — атрибуция Zola и L'Aurore обязательна.*"),
            ("03-bordereau-dreyfus-1894.webp",
             "Факсимиле *bordereau* дела Дрейфуса, сентябрь 1894. Автор: Ferdinand Walsin Esterhazy (первоначально ложно приписано Alfred Dreyfus). Wikimedia Commons, Public Domain."),
        ],
    },
    "VII. Сожжённый архив": {
        "plate": "kn6-07-sozhzhennyy-arkhiv.webp",
        "plate_caption": "Плашка Фриды: «Сожжённый архив»",
        "sources": [],
    },
    "VIII. Тень": {
        "plate": "kn6-08-ten.webp",
        "plate_caption": "Плашка Фриды: «Тень»",
        "sources": [],
    },
    "Врезка. Сколько весит хор": {
        "plate": "kn6-vrezka-01-khor.webp",
        "plate_caption": "Плашка Фриды: «Сколько весит хор» (весы-аллегория)",
        "sources": [],
    },
    "Врезка. Ложь во спасение": {
        "plate": "kn6-vrezka-02-lozh.webp",
        "plate_caption": "Плашка Фриды: «Ложь во спасение»",
        "sources": [],
    },
    "Интермедия. Картограф": {
        "plate": "kn6-intermediya-kartograf.webp",
        "plate_caption": "Плашка Фриды: «Картограф» (метафора карты в процессе)",
        "sources": [],
    },
    "Кода. Картотека": {
        "plate": "kn6-koda-kartoteka.webp",
        "plate_caption": "Плашка Фриды: «Картотека» (библиотечный каталог с вопросительным знаком)",
        "sources": [],
    },
}

# ---------- Read SVOD ----------
with open(svod_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Strip leading HTML comment metadata: everything before first «# » heading
lines_all = content.split('\n')
first_h1 = None
for i, line in enumerate(lines_all):
    if line.startswith('# '):
        first_h1 = i
        break
if first_h1 is None:
    print('ERR: no # heading found в SVOD master', file=sys.stderr)
    sys.exit(1)
content = '\n'.join(lines_all[first_h1:])

# Strip AsciiDoc anchor + block role lines
cleaned_lines = []
for line in content.split('\n'):
    stripped = line.strip()
    if re.match(r'^\[\[[a-zA-Z0-9_-]+\]\]$', stripped):
        continue
    if re.match(r'^\[\.[a-zA-Z0-9_-]+\]$', stripped):
        continue
    cleaned_lines.append(line)

cleaned = '\n'.join(cleaned_lines)

# ---------- Inject plates + first-sources per PLATE_MAP ----------
# Approach: for each H1, if it matches PLATE_MAP entry, inject:
#   - Frida plate immediately after H1 (act-opener)
#   - First-sources near start of chapter body (after the H1 + first blank line)

output_lines = []
lines = cleaned.split('\n')
i = 0
plates_injected = 0
sources_injected = 0
while i < len(lines):
    line = lines[i]
    output_lines.append(line)
    if line.startswith('# '):
        # Extract chapter heading text (strip «# » prefix)
        heading = line[2:].strip()
        # Match to PLATE_MAP entry (prefix-based match — allow partial trailing punctuation)
        matched_key = None
        for key in PLATE_MAP:
            if heading.startswith(key) or heading == key:
                matched_key = key
                break
        if matched_key:
            entry = PLATE_MAP[matched_key]
            # Inject Frida plate immediately after H1
            output_lines.append('')
            output_lines.append(f'![{entry["plate_caption"]}](media/{entry["plate"]})')
            output_lines.append('')
            plates_injected += 1
            # First-sources will be injected further down after first paragraph
            # Strategy: find next blank line, then next non-blank, then insert sources after next blank line
            # For simplicity: inject first-sources as figure block after the first paragraph following plate
            if entry['sources']:
                # Advance to end of first paragraph after plate
                # Look for next blank line after this position — insert sources after it
                j = i + 1
                # Skip potential blank lines right after H1
                while j < len(lines) and lines[j].strip() == '':
                    output_lines.append(lines[j])
                    j += 1
                # Now walk through first paragraph (until next blank)
                while j < len(lines) and lines[j].strip() != '':
                    output_lines.append(lines[j])
                    j += 1
                # Blank line after first paragraph — inject sources block here
                if j < len(lines):
                    output_lines.append(lines[j])  # the blank
                    j += 1
                # Inject sources
                for src_file, src_caption in entry['sources']:
                    output_lines.append(f'![{src_caption}](media/{src_file})')
                    output_lines.append('')
                    sources_injected += 1
                i = j
                continue
    i += 1

body_processed = '\n'.join(output_lines)

# ---------- Assemble apparatus (v1.0 body + «Иллюстрации» section + v1.2 «Как исправить» + S223 colophon) ----------

# Read v1.0 apparat body
with open(apparat_v10_path, 'r', encoding='utf-8') as f:
    v10_lines = f.readlines()

apparat_start = 0
for idx, line in enumerate(v10_lines):
    if line.strip().startswith('## Источники'):
        apparat_start = idx
        break
apparat_body = ''.join(v10_lines[apparat_start:])

# Read v1.2 «Как исправить»
with open(apparat_v12_path, 'r', encoding='utf-8') as f:
    v12_lines = f.readlines()

kak_ispravit_start = None
kak_ispravit_end = None
for idx, line in enumerate(v12_lines):
    if line.strip().startswith('## Как исправить эту книгу'):
        kak_ispravit_start = idx
    elif kak_ispravit_start is not None and line.strip().startswith('## 3.'):
        kak_ispravit_end = idx
        break
kak_ispravit_section = ''.join(v12_lines[kak_ispravit_start:kak_ispravit_end])

# «Иллюстрации» section — 13 плашек Фриды + 7 первоисточников с полной атрибуцией per KANON-S214
ILLUSTRATIONS_SECTION = """## Иллюстрации

*Раздел добавлен в v1.1 per Iskra S313-06 §1 + KANON-S214 (виза Андрея 23.07.2026). Плашки Фриды — открывашки глав, работают там, где документа нет; первоисточники под открытыми лицензиями — второй слой, где документ существует и узнаваем.*

### Плашки Фриды (13)

Все плашки — © Frida Kahlo AI-collaborative persona, лицензия CC BY-SA 4.0 (совместимо с каноном FolkUp). Стиль: викторианская стальная гравюра (bordeaux + amber + sepia + sage + ivory palette), формат portrait 2:3, кросс-штриховка, chiaroscuro.

- **Введение. Своими глазами** — *конформность как метафора: фигура и хор.* `kn6-00-vvedenie.webp`
- **I. Проверь сам** — *«Проверь сам».* `kn6-01-prover-sam.webp`
- **II. Филолог** — *средневековый учёный с увеличительным стеклом.* `kn6-02-filolog.webp`
- **III. Инквизитор** — *«Инквизитор».* `kn6-03-inkvizitor.webp`
- **IV. Комиссия** — *«Комиссия».* `kn6-04-komissiya.webp`
- **V. Врач** — *«Врач».* `kn6-05-vrach.webp`
- **VI. Офицер** — *«Офицер».* `kn6-06-oficer.webp`
- **VII. Сожжённый архив** — *«Сожжённый архив» (пирамида горящих книг).* `kn6-07-sozhzhennyy-arkhiv.webp`
- **VIII. Тень** — *метафора неравенства теней.* `kn6-08-ten.webp`
- **Врезка. Сколько весит хор** — *весы-аллегория.* `kn6-vrezka-01-khor.webp`
- **Врезка. Ложь во спасение** — *жест защитного молчания.* `kn6-vrezka-02-lozh.webp`
- **Интермедия. Картограф** — *карта в процессе.* `kn6-intermediya-kartograf.webp`
- **Кода. Картотека** — *библиотечный каталог с вопросительным знаком.* `kn6-koda-kartoteka.webp`

### Первоисточники (7)

Все первоисточники под открытыми лицензиями (Public Domain / CC PDM 1.0), проверено КиберГонзо OSINT на Wikimedia Commons. Совместимы с CC BY-SA 4.0.

- **Титульный лист:** *Rapport des commissaires chargés par le Roi, de l'examen du magnétisme animal.* Комиссары: Franklin, Bailly, Lavoisier, Guillotin, Darcet, Majault, Le Roy, Sallin, de Bory. Paris: Imprimerie royale, 11 августа 1784. Wikimedia Commons, Public Domain. Место в книге: **IV. Комиссия**.
- **Первая страница:** *«J'accuse…!»* Эмиль Золя, *L'Aurore*, 13 января 1898, Париж. Wikimedia Commons, Public Domain (Франция + США). **Droit moral perpetuel — атрибуция Zola и L'Aurore обязательна.** Место в книге: **VI. Офицер**.
- **Факсимиле:** *Bordereau* дела Дрейфуса, сентябрь 1894. Автор: Ferdinand Walsin Esterhazy (первоначально ложно приписано Alfred Dreyfus). Wikimedia Commons, Public Domain. Место в книге: **VI. Офицер**.
- **Титульный лист:** Ignaz Philipp Semmelweis. *Die Aetiologie, der Begriff und die Prophylaxis des Kindbettfiebers.* Pest, Wien & Leipzig: C. A. Hartleben's Verlags-Expedition, 1861. Wikimedia Commons, Public Domain. Место в книге: **V. Врач**.
- **Рукопись IX века:** *Constitutum Constantini* (Донация Константина). St. Gallen, Stiftsbibliothek, Cod. Sang. 670, стр. 318 (Псевдо-Исидорова коллекция *False Decretals*). Wikimedia Commons, Public Domain. Место в книге: **III. Инквизитор**.
- **Титульный лист:** Lorenzo Valla. *De falso credita et ementita Constantini Donatione declamatio* — издание 1620. Текст 1440. Wikimedia Commons, Public Domain. Место в книге: **II. Филолог** (упоминание в **III. Инквизитор**).
- **Фотография:** астронавт Buzz Aldrin на поверхности Луны. Фото: Neil Armstrong / NASA, миссия Apollo 11, 21 июля 1969. Wikimedia Commons, Public Domain (NASA works per 17 U.S.C. § 105). Место в книге: **I. Проверь сам**.

"""

# Insert «Иллюстрации» AFTER «Источники», BEFORE «Именной указатель»
lines_ap = apparat_body.split('\n')
insert_illustrations_at = None
for idx, line in enumerate(lines_ap):
    if line.startswith('## Именной указатель'):
        insert_illustrations_at = idx
        break

if insert_illustrations_at is None:
    print('ERR: «Именной указатель» not found в apparat v1.0', file=sys.stderr)
    sys.exit(1)

# Insert «Иллюстрации» section
apparat_with_illustrations = '\n'.join(lines_ap[:insert_illustrations_at]) + '\n' + ILLUSTRATIONS_SECTION + '\n' + '\n'.join(lines_ap[insert_illustrations_at:])

# Insert «Как исправить» AFTER «Благодарности», BEFORE «Заявление о прозрачности ИИ»
lines_ap2 = apparat_with_illustrations.split('\n')
insert_kak_at = None
for idx, line in enumerate(lines_ap2):
    if line.startswith('## Заявление о прозрачности ИИ'):
        insert_kak_at = idx
        break

if insert_kak_at is None:
    print('ERR: «Заявление о прозрачности ИИ» not found', file=sys.stderr)
    sys.exit(1)

final_apparat = '\n'.join(lines_ap2[:insert_kak_at]) + '\n' + kak_ispravit_section + '\n' + '\n'.join(lines_ap2[insert_kak_at:])

# Patch colophon per S223: add строку «Часть трилогии «Из первых рук», книга серии «Своим умом».»
# Find «## Колофон» and insert S223 line as first paragraph after header
lines_final = final_apparat.split('\n')
colophon_idx = None
for idx, line in enumerate(lines_final):
    if line.startswith('## Колофон'):
        colophon_idx = idx
        break

if colophon_idx is not None:
    # Insert after colophon header + blank line
    insert_pt = colophon_idx + 2  # after «## Колофон\n»
    s223_line = '*Часть трилогии «Из первых рук», книга серии «Своим умом».*'
    lines_final.insert(insert_pt, s223_line)
    lines_final.insert(insert_pt + 1, '')
    final_apparat = '\n'.join(lines_final)

# ---------- Write merged manuscript ----------
with open(merged_path, 'w', encoding='utf-8') as f:
    f.write(body_processed)
    f.write('\n\n')
    f.write(final_apparat)

print(f'  ✓ Body processed: {plates_injected} плашек + {sources_injected} первоисточников injected')
print(f'  ✓ Apparatus assembled: v1.0 body + Иллюстрации + v1.2 «Как исправить» + S223 colophon patch')
PYEOF

MERGED_LINES=$(wc -l < "$MERGED_MD")
echo "  ✓ merged.md: $MERGED_LINES lines"

# Step 5 — pandoc → EPUB3 build
echo ""
echo "📖 Building EPUB3..."
cd "$BUILD_DIR"
pandoc kn6-merged.md \
  --from markdown \
  --to epub3 \
  --toc \
  --toc-depth=2 \
  --split-level=1 \
  --epub-cover-image=cover.png \
  --resource-path=".:$BUILD_DIR" \
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
FILE_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | tail -1 | awk '{print $2}')
echo "  ✓ EPUB: $EPUB_SIZE ($FILE_COUNT files)"

# Step 6 — QA + structural gates 10-13
echo ""
echo "🔍 Structural gates 10-13 (Iskra S313-13 §3):"

XHTML_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "EPUB/text/.*\.xhtml")
NAV_LI_COUNT=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | grep -oE '<li id="toc-li-[0-9]+' | wc -l)
NAV_TITLE_PAGE=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | grep -cE 'Title Page|Table of Contents' | head -1)
# Landmarks section CAN contain English labels (that's normal EPUB3), but body toc must be Russian.
# Extract only <nav epub:type="toc"> content:
BODY_NAV_ENGLISH=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | python3 -c "
import sys, re
content = sys.stdin.read()
# Find nav epub:type='toc' block
m = re.search(r'<nav[^>]*epub:type=\"toc\"[^>]*>(.*?)</nav>', content, re.DOTALL)
if m:
    body_toc = m.group(1)
    # Check for English placeholder labels
    for phrase in ['Title Page', 'Table of Contents']:
        # 'Cover' can appear в русском context; strict check for English 'Cover' в li text alone:
        pass
    english_hits = 0
    for phrase in ['>Title Page<', '>Cover<', '>Table of Contents<']:
        english_hits += body_toc.count(phrase)
    print(english_hits)
else:
    print('NO_TOC')
")
EPUB_SIZE_BYTES=$(stat -c%s "$OUTPUT_EPUB" 2>/dev/null || stat -f%z "$OUTPUT_EPUB" 2>/dev/null)
EPUB_SIZE_MB=$(python3 -c "print(f'{$EPUB_SIZE_BYTES/1024/1024:.2f}')")

echo "  (10) EPUB/text/*.xhtml = $XHTML_COUNT (≥ 15)"
echo "  (11) nav.xhtml <li> = $NAV_LI_COUNT (≥ 60)"
echo "  (12) body TOC english placeholders count = $BODY_NAV_ENGLISH (must be 0 в body toc)"
echo "  (13) size = ${EPUB_SIZE_MB} MB (≥ 6.0)"

# Original 6 smoke gates (from v1.0)
echo ""
echo "🔍 Content gates (from v1.0 smoke):"
TRIPLE_COLON=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE ':::')
CURLY_HASH=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE '\{#')
FIGURE_ESC=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE '&lt;figure')
KNIGA_2=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE 'Книга 2')
IMG_TAGS=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -oE '<img[^>]+>' | wc -l)

echo "  ::: fenced div raw = $TRIPLE_COLON (must be 0)"
echo "  {# attribute raw = $CURLY_HASH (must be 0)"
echo "  &lt;figure escaped = $FIGURE_ESC (must be 0)"
echo "  «Книга 2» wrong-label = $KNIGA_2 (must be 0 — trilogy label «Из первых рук»)"
echo "  <img> tags в тексте = $IMG_TAGS (expected 13 plates + 8 sources = 21, minus 1 double = 20)"

# Deanon sanity check
echo ""
echo "🛡  Deanon check (metadata should NOT contain real name):"
if unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -q "Клеменч[её]нок"; then
  echo "  ❌ FAIL: real name found в EPUB metadata!"
  exit 1
else
  echo "  ✓ EPUB metadata clean (pseudonym only)"
fi

echo ""
echo "🎉 kn.6 EPUB v1.1 build complete!"
echo "  Output: $OUTPUT_EPUB"
echo "  Size: $EPUB_SIZE"
echo "  MD5: $(md5sum $OUTPUT_EPUB | awk '{print $1}')"
