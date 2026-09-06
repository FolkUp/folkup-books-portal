#!/bin/bash
#
# kn.6 «Своими глазами» EPUB v1.1b generator (pandoc-based)
# S1KOCHEGAR cont+13 · 2026-09-06 (post v1.1 broken report)
#
# CHANGES vs v1.1:
#   - webp → jpg conversion для inline images (webp support не universal в EPUB readers)
#   - No --split-level=1 explicit flag (использую default splitting like v1.0)
#   - Matches v1.0 pandoc config as close as possible

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VAULT_ROOT="/c/JOHNDOE_CLAUDE/vault"

SVOD_MASTER="$VAULT_ROOT/books/KN6-SVOD-MASTER-v1.0-S196.md"
APPARAT_V10="$VAULT_ROOT/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md"
APPARAT_V12="$VAULT_ROOT/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md"

COVER_PNG="$PROJECT_ROOT/public/covers/cover_kn6.png"

IMAGES_SRC="$PROJECT_ROOT/content/kn6/ru/images"
SOURCES_SRC="$PROJECT_ROOT/content/kn6/ru/images/sources"

BUILD_DIR="/c/Transit/kn6-build-v1.1b"

EPUB_VERSION="${1:-v1.1b}"
OUTPUT_EPUB="$BUILD_DIR/kn6-svoimi-glazami-${EPUB_VERSION}.epub"

echo "📚 kn.6 «Своими глазами» EPUB build ${EPUB_VERSION}"
echo "===================================================="
echo "  CONSERVATIVE build (post v1.1 broken report): webp→jpg conversion + no --split-level"
echo ""

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/media"

# Step 1 — verify sources
for src in "$SVOD_MASTER" "$APPARAT_V10" "$APPARAT_V12" "$COVER_PNG"; do
  if [[ ! -f "$src" ]]; then
    echo "  ❌ MISSING: $src" >&2
    exit 1
  fi
done

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

# Step 2 — convert webp → jpg (universal EPUB reader support)
echo "🔄 Converting webp → jpg (universal EPUB reader support)..."
for p in "${FRIDA_PLATES[@]}"; do
  BASE="${p%.webp}"
  magick "$IMAGES_SRC/$p" -background white -alpha remove -quality 85 "$BUILD_DIR/media/${BASE}.jpg" 2>&1 | tail -2
done
for s in "${FIRST_SOURCES[@]}"; do
  BASE="${s%.webp}"
  magick "$SOURCES_SRC/$s" -background white -alpha remove -quality 85 "$BUILD_DIR/media/${BASE}.jpg" 2>&1 | tail -2
done
IMG_TOTAL_SIZE=$(du -sh "$BUILD_DIR/media" | cut -f1)
echo "  ✓ 20 images converted ($IMG_TOTAL_SIZE)"

# Step 3 — cover
magick "$COVER_PNG" -background white -flatten -resize 1200x1800 "$BUILD_DIR/cover.png"
echo "  ✓ cover ready: $(du -h $BUILD_DIR/cover.png | cut -f1)"

# Step 4 — assemble merged .md
MERGED_MD="$BUILD_DIR/kn6-merged.md"

python3 - <<'PYEOF'
import re, os, sys

VAULT_ROOT = "/c/JOHNDOE_CLAUDE/vault"
BUILD_DIR = "/c/Transit/kn6-build-v1.1b"

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

svod_path = native(f"{VAULT_ROOT}/books/KN6-SVOD-MASTER-v1.0-S196.md")
apparat_v10_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md")
apparat_v12_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md")
merged_path = native(f"{BUILD_DIR}/kn6-merged.md")

# NOTE: .jpg extensions (converted from .webp)
PLATE_MAP = {
    "Введение. Своими глазами": {
        "plate": "kn6-00-vvedenie.jpg",
        "plate_caption": "Плашка Фриды: конформность — фигура и хор",
        "sources": [],
    },
    "I. Проверь сам": {
        "plate": "kn6-01-prover-sam.jpg",
        "plate_caption": "Плашка Фриды: «Проверь сам»",
        "sources": [
            ("07-apollo11-aldrin-1969.jpg",
             "Астронавт Buzz Aldrin на поверхности Луны. Фото: Neil Armstrong / NASA, миссия Apollo 11, 21 июля 1969. Wikimedia Commons, Public Domain."),
        ],
    },
    "II. Филолог": {
        "plate": "kn6-02-filolog.jpg",
        "plate_caption": "Плашка Фриды: филолог с увеличительным стеклом",
        "sources": [
            ("06-valla-de-falso-credita-1620.jpg",
             "Lorenzo Valla, *De falso credita et ementita Constantini Donatione declamatio* — титульный лист издания 1620 г. Текст 1440 г. Wikimedia Commons, Public Domain."),
        ],
    },
    "III. Инквизитор": {
        "plate": "kn6-03-inkvizitor.jpg",
        "plate_caption": "Плашка Фриды: «Инквизитор»",
        "sources": [
            ("05-donatio-constantini-stgallen-9c.jpg",
             "*Constitutum Constantini* (Донация Константина), рукопись IX века. St. Gallen, Stiftsbibliothek, Cod. Sang. 670, стр. 318. Wikimedia Commons, Public Domain."),
        ],
    },
    "IV. Комиссия": {
        "plate": "kn6-04-komissiya.jpg",
        "plate_caption": "Плашка Фриды: «Комиссия»",
        "sources": [
            ("01-bailly-rapport-1784-title.jpg",
             "Титульный лист: *Rapport des commissaires chargés par le Roi, de l'examen du magnétisme animal.* Paris: Imprimerie royale, 1784. Wikimedia Commons, Public Domain."),
        ],
    },
    "V. Врач": {
        "plate": "kn6-05-vrach.jpg",
        "plate_caption": "Плашка Фриды: «Врач»",
        "sources": [
            ("04-semmelweis-aetiologie-1861-title.jpg",
             "Ignaz Philipp Semmelweis, *Die Aetiologie, der Begriff und die Prophylaxis des Kindbettfiebers.* Pest, Wien & Leipzig: C. A. Hartleben's Verlags-Expedition, 1861 (титульный лист). Wikimedia Commons, Public Domain."),
        ],
    },
    "VI. Офицер": {
        "plate": "kn6-06-oficer.jpg",
        "plate_caption": "Плашка Фриды: «Офицер»",
        "sources": [
            ("02-zola-jaccuse-laurore-1898.jpg",
             "*«J'accuse…!»* Émile Zola, опубликовано в *L'Aurore*, 13 января 1898. Wikimedia Commons, Public Domain (Франция + США). *Droit moral perpetuel — атрибуция Zola и L'Aurore обязательна.*"),
            ("03-bordereau-dreyfus-1894.jpg",
             "Факсимиле *bordereau* дела Дрейфуса, сентябрь 1894. Автор: Ferdinand Walsin Esterhazy (первоначально ложно приписано Alfred Dreyfus). Wikimedia Commons, Public Domain."),
        ],
    },
    "VII. Сожжённый архив": {
        "plate": "kn6-07-sozhzhennyy-arkhiv.jpg",
        "plate_caption": "Плашка Фриды: «Сожжённый архив»",
        "sources": [],
    },
    "VIII. Тень": {
        "plate": "kn6-08-ten.jpg",
        "plate_caption": "Плашка Фриды: «Тень»",
        "sources": [],
    },
    "Врезка. Сколько весит хор": {
        "plate": "kn6-vrezka-01-khor.jpg",
        "plate_caption": "Плашка Фриды: «Сколько весит хор» (весы-аллегория)",
        "sources": [],
    },
    "Врезка. Ложь во спасение": {
        "plate": "kn6-vrezka-02-lozh.jpg",
        "plate_caption": "Плашка Фриды: «Ложь во спасение»",
        "sources": [],
    },
    "Интермедия. Картограф": {
        "plate": "kn6-intermediya-kartograf.jpg",
        "plate_caption": "Плашка Фриды: «Картограф» (метафора карты в процессе)",
        "sources": [],
    },
    "Кода. Картотека": {
        "plate": "kn6-koda-kartoteka.jpg",
        "plate_caption": "Плашка Фриды: «Картотека» (библиотечный каталог с вопросительным знаком)",
        "sources": [],
    },
}

with open(svod_path, 'r', encoding='utf-8') as f:
    content = f.read()

lines_all = content.split('\n')
first_h1 = None
for i, line in enumerate(lines_all):
    if line.startswith('# '):
        first_h1 = i
        break
content = '\n'.join(lines_all[first_h1:])

cleaned_lines = []
for line in content.split('\n'):
    stripped = line.strip()
    if re.match(r'^\[\[[a-zA-Z0-9_-]+\]\]$', stripped):
        continue
    if re.match(r'^\[\.[a-zA-Z0-9_-]+\]$', stripped):
        continue
    cleaned_lines.append(line)

cleaned = '\n'.join(cleaned_lines)

output_lines = []
lines = cleaned.split('\n')
i = 0
plates_injected = 0
sources_injected = 0
while i < len(lines):
    line = lines[i]
    output_lines.append(line)
    if line.startswith('# '):
        heading = line[2:].strip()
        matched_key = None
        for key in PLATE_MAP:
            if heading.startswith(key) or heading == key:
                matched_key = key
                break
        if matched_key:
            entry = PLATE_MAP[matched_key]
            output_lines.append('')
            output_lines.append(f'![{entry["plate_caption"]}](media/{entry["plate"]})')
            output_lines.append('')
            plates_injected += 1
            if entry['sources']:
                j = i + 1
                while j < len(lines) and lines[j].strip() == '':
                    output_lines.append(lines[j])
                    j += 1
                while j < len(lines) and lines[j].strip() != '':
                    output_lines.append(lines[j])
                    j += 1
                if j < len(lines):
                    output_lines.append(lines[j])
                    j += 1
                for src_file, src_caption in entry['sources']:
                    output_lines.append(f'![{src_caption}](media/{src_file})')
                    output_lines.append('')
                    sources_injected += 1
                i = j
                continue
    i += 1

body_processed = '\n'.join(output_lines)

with open(apparat_v10_path, 'r', encoding='utf-8') as f:
    v10_lines = f.readlines()
apparat_start = 0
for idx, line in enumerate(v10_lines):
    if line.strip().startswith('## Источники'):
        apparat_start = idx
        break
apparat_body = ''.join(v10_lines[apparat_start:])

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

ILLUSTRATIONS_SECTION = """## Иллюстрации

*Раздел добавлен в v1.1 per Iskra S313-06 §1 + KANON-S214 (виза Андрея 23.07.2026). Плашки Фриды — открывашки глав, работают там, где документа нет; первоисточники под открытыми лицензиями — второй слой, где документ существует и узнаваем.*

### Плашки Фриды (13)

Все плашки — © Frida Kahlo AI-collaborative persona, лицензия CC BY-SA 4.0 (совместимо с каноном FolkUp). Стиль: викторианская стальная гравюра (bordeaux + amber + sepia + sage + ivory palette), формат portrait 2:3, кросс-штриховка, chiaroscuro.

- **Введение. Своими глазами** — *конформность как метафора: фигура и хор.*
- **I. Проверь сам** — *«Проверь сам».*
- **II. Филолог** — *средневековый учёный с увеличительным стеклом.*
- **III. Инквизитор** — *«Инквизитор».*
- **IV. Комиссия** — *«Комиссия».*
- **V. Врач** — *«Врач».*
- **VI. Офицер** — *«Офицер».*
- **VII. Сожжённый архив** — *«Сожжённый архив» (пирамида горящих книг).*
- **VIII. Тень** — *метафора неравенства теней.*
- **Врезка. Сколько весит хор** — *весы-аллегория.*
- **Врезка. Ложь во спасение** — *жест защитного молчания.*
- **Интермедия. Картограф** — *карта в процессе.*
- **Кода. Картотека** — *библиотечный каталог с вопросительным знаком.*

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

lines_ap = apparat_body.split('\n')
insert_illustrations_at = None
for idx, line in enumerate(lines_ap):
    if line.startswith('## Именной указатель'):
        insert_illustrations_at = idx
        break
apparat_with_illustrations = '\n'.join(lines_ap[:insert_illustrations_at]) + '\n' + ILLUSTRATIONS_SECTION + '\n' + '\n'.join(lines_ap[insert_illustrations_at:])

lines_ap2 = apparat_with_illustrations.split('\n')
insert_kak_at = None
for idx, line in enumerate(lines_ap2):
    if line.startswith('## Заявление о прозрачности ИИ'):
        insert_kak_at = idx
        break
final_apparat = '\n'.join(lines_ap2[:insert_kak_at]) + '\n' + kak_ispravit_section + '\n' + '\n'.join(lines_ap2[insert_kak_at:])

# Colophon S223 patch
lines_final = final_apparat.split('\n')
colophon_idx = None
for idx, line in enumerate(lines_final):
    if line.startswith('## Колофон'):
        colophon_idx = idx
        break

if colophon_idx is not None:
    insert_pt = colophon_idx + 2
    s223_line = '*Часть трилогии «Из первых рук», книга серии «Своим умом».*'
    lines_final.insert(insert_pt, s223_line)
    lines_final.insert(insert_pt + 1, '')
    final_apparat = '\n'.join(lines_final)

with open(merged_path, 'w', encoding='utf-8') as f:
    f.write(body_processed)
    f.write('\n\n')
    f.write(final_apparat)

print(f'  [OK] {plates_injected} plates + {sources_injected} sources')
PYEOF

MERGED_LINES=$(wc -l < "$MERGED_MD")
echo "  ✓ merged.md: $MERGED_LINES lines"

# Step 5 — pandoc build (matching v1.0 config as close as possible — NO --split-level)
echo ""
echo "📖 Building EPUB3 (v1.0-compat config, no --split-level)..."
cd "$BUILD_DIR"
pandoc kn6-merged.md \
  --from markdown \
  --to epub3 \
  --toc \
  --toc-depth=2 \
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

# Structural gates 10-13
XHTML_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "EPUB/text/.*\.xhtml")
NAV_LI_COUNT=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | grep -oE '<li id="toc-li-[0-9]+' | wc -l)
EPUB_SIZE_MB=$(python3 -c "print(f'{$(stat -c%s $OUTPUT_EPUB)/1024/1024:.2f}')")
IMG_TAGS=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -oE '<img[^>]+>' | wc -l)
WEBP_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "\.webp$" || echo 0)
JPG_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "\.jpg$")

echo ""
echo "🔍 Structural gates:"
echo "  (10) EPUB/text/*.xhtml = $XHTML_COUNT"
echo "  (11) nav.xhtml <li> = $NAV_LI_COUNT"
echo "  (13) size = ${EPUB_SIZE_MB} MB"
echo "  <img> tags = $IMG_TAGS"
echo "  webp files (must be 0 — replaced by jpg): $WEBP_COUNT"
echo "  jpg files: $JPG_COUNT"

# EPUB validation
echo ""
echo "🔍 EPUB validation (epubcheck):"
epubcheck "$OUTPUT_EPUB" 2>&1 | tail -3

# Deanon
if unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -q "Клеменч[её]нок"; then
  echo "  ❌ FAIL: real name found"
  exit 1
fi

echo ""
echo "🎉 kn.6 EPUB v1.1b build complete!"
echo "  Output: $OUTPUT_EPUB"
echo "  MD5: $(md5sum $OUTPUT_EPUB | awk '{print $1}')"
