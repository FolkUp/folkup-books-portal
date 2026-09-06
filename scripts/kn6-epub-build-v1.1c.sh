#!/bin/bash
#
# kn.6 «Своими глазами» EPUB v1.1c generator (pandoc-based)
# S1KOCHEGAR cont+13 · 2026-09-06 (post Andrey report: captions пробрались в тело)
#
# CHANGES vs v1.1b:
#   - Raw HTML <img> без figure/figcaption (нет visible captions в теле)
#   - Alt text короткий (только для accessibility, скрытый в reader'ах)
#   - Полная атрибуция остаётся ТОЛЬКО в аппарате «Иллюстрации» (KANON-S214 §3)
#
# CHANGES vs v1.1 (retained):
#   - webp → jpg conversion (v1.1b fix)
#   - No --split-level=1 (matches v1.0 config)

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

BUILD_DIR="/c/Transit/kn6-build-v1.1c"

EPUB_VERSION="${1:-v1.1c}"
OUTPUT_EPUB="$BUILD_DIR/kn6-svoimi-glazami-${EPUB_VERSION}.epub"

echo "📚 kn.6 «Своими глазами» EPUB build ${EPUB_VERSION}"
echo "===================================================="
echo "  EDITORIAL FIX: убраны figcaptions из тела (per Andrey report)"
echo ""

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/media"

# Step 1 — verify
for src in "$SVOD_MASTER" "$APPARAT_V10" "$APPARAT_V12" "$COVER_PNG"; do
  [[ -f "$src" ]] || { echo "  ❌ MISSING: $src" >&2; exit 1; }
done

FRIDA_PLATES=(
  "kn6-00-vvedenie.webp" "kn6-01-prover-sam.webp" "kn6-02-filolog.webp"
  "kn6-03-inkvizitor.webp" "kn6-04-komissiya.webp" "kn6-05-vrach.webp"
  "kn6-06-oficer.webp" "kn6-07-sozhzhennyy-arkhiv.webp" "kn6-08-ten.webp"
  "kn6-vrezka-01-khor.webp" "kn6-vrezka-02-lozh.webp"
  "kn6-intermediya-kartograf.webp" "kn6-koda-kartoteka.webp"
)
FIRST_SOURCES=(
  "01-bailly-rapport-1784-title.webp" "02-zola-jaccuse-laurore-1898.webp"
  "03-bordereau-dreyfus-1894.webp" "04-semmelweis-aetiologie-1861-title.webp"
  "05-donatio-constantini-stgallen-9c.webp" "06-valla-de-falso-credita-1620.webp"
  "07-apollo11-aldrin-1969.webp"
)

# Step 2 — webp → jpg
echo "🔄 Converting webp → jpg..."
for p in "${FRIDA_PLATES[@]}"; do
  BASE="${p%.webp}"
  magick "$IMAGES_SRC/$p" -background white -alpha remove -quality 85 "$BUILD_DIR/media/${BASE}.jpg" 2>&1 | tail -1
done
for s in "${FIRST_SOURCES[@]}"; do
  BASE="${s%.webp}"
  magick "$SOURCES_SRC/$s" -background white -alpha remove -quality 85 "$BUILD_DIR/media/${BASE}.jpg" 2>&1 | tail -1
done
echo "  ✓ 20 images converted ($(du -sh $BUILD_DIR/media | cut -f1))"

# Step 3 — cover
magick "$COVER_PNG" -background white -flatten -resize 1200x1800 "$BUILD_DIR/cover.png"
echo "  ✓ cover ready"

# Step 4 — assemble merged .md
MERGED_MD="$BUILD_DIR/kn6-merged.md"

python3 - <<'PYEOF'
import re, os, sys

VAULT_ROOT = "/c/JOHNDOE_CLAUDE/vault"
BUILD_DIR = "/c/Transit/kn6-build-v1.1c"

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

svod_path = native(f"{VAULT_ROOT}/books/KN6-SVOD-MASTER-v1.0-S196.md")
apparat_v10_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md")
apparat_v12_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md")
merged_path = native(f"{BUILD_DIR}/kn6-merged.md")

# NO CAPTIONS в теле — только alt text (короткий, для accessibility)
# Full attribution ТОЛЬКО в аппарате «Иллюстрации»
PLATE_MAP = {
    "Введение. Своими глазами": {"plate": "kn6-00-vvedenie.jpg", "alt": "Иллюстрация", "sources": []},
    "I. Проверь сам": {
        "plate": "kn6-01-prover-sam.jpg", "alt": "Иллюстрация",
        "sources": [("07-apollo11-aldrin-1969.jpg", "Первоисточник")],
    },
    "II. Филолог": {
        "plate": "kn6-02-filolog.jpg", "alt": "Иллюстрация",
        "sources": [("06-valla-de-falso-credita-1620.jpg", "Первоисточник")],
    },
    "III. Инквизитор": {
        "plate": "kn6-03-inkvizitor.jpg", "alt": "Иллюстрация",
        "sources": [("05-donatio-constantini-stgallen-9c.jpg", "Первоисточник")],
    },
    "IV. Комиссия": {
        "plate": "kn6-04-komissiya.jpg", "alt": "Иллюстрация",
        "sources": [("01-bailly-rapport-1784-title.jpg", "Первоисточник")],
    },
    "V. Врач": {
        "plate": "kn6-05-vrach.jpg", "alt": "Иллюстрация",
        "sources": [("04-semmelweis-aetiologie-1861-title.jpg", "Первоисточник")],
    },
    "VI. Офицер": {
        "plate": "kn6-06-oficer.jpg", "alt": "Иллюстрация",
        "sources": [
            ("02-zola-jaccuse-laurore-1898.jpg", "Первоисточник"),
            ("03-bordereau-dreyfus-1894.jpg", "Первоисточник"),
        ],
    },
    "VII. Сожжённый архив": {"plate": "kn6-07-sozhzhennyy-arkhiv.jpg", "alt": "Иллюстрация", "sources": []},
    "VIII. Тень": {"plate": "kn6-08-ten.jpg", "alt": "Иллюстрация", "sources": []},
    "Врезка. Сколько весит хор": {"plate": "kn6-vrezka-01-khor.jpg", "alt": "Иллюстрация", "sources": []},
    "Врезка. Ложь во спасение": {"plate": "kn6-vrezka-02-lozh.jpg", "alt": "Иллюстрация", "sources": []},
    "Интермедия. Картограф": {"plate": "kn6-intermediya-kartograf.jpg", "alt": "Иллюстрация", "sources": []},
    "Кода. Картотека": {"plate": "kn6-koda-kartoteka.jpg", "alt": "Иллюстрация", "sources": []},
}

with open(svod_path, 'r', encoding='utf-8') as f:
    content = f.read()

lines_all = content.split('\n')
first_h1 = next((i for i, l in enumerate(lines_all) if l.startswith('# ')), None)
if first_h1 is None: sys.exit(1)
content = '\n'.join(lines_all[first_h1:])

cleaned_lines = []
for line in content.split('\n'):
    stripped = line.strip()
    if re.match(r'^\[\[[a-zA-Z0-9_-]+\]\]$', stripped) or re.match(r'^\[\.[a-zA-Z0-9_-]+\]$', stripped):
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
        matched_key = next((k for k in PLATE_MAP if heading.startswith(k) or heading == k), None)
        if matched_key:
            entry = PLATE_MAP[matched_key]
            output_lines.append('')
            # RAW HTML <img> — no markdown ![], no figure/figcaption
            output_lines.append(f'<img src="media/{entry["plate"]}" alt="{entry["alt"]}" />')
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
                for src_file, src_alt in entry['sources']:
                    output_lines.append(f'<img src="media/{src_file}" alt="{src_alt}" />')
                    output_lines.append('')
                    sources_injected += 1
                i = j
                continue
    i += 1

body_processed = '\n'.join(output_lines)

# Apparatus (unchanged from v1.1b — full attribution here)
with open(apparat_v10_path, 'r', encoding='utf-8') as f:
    v10_lines = f.readlines()
apparat_start = next(i for i, l in enumerate(v10_lines) if l.strip().startswith('## Источники'))
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
insert_illustrations_at = next(idx for idx, l in enumerate(lines_ap) if l.startswith('## Именной указатель'))
apparat_with_illustrations = '\n'.join(lines_ap[:insert_illustrations_at]) + '\n' + ILLUSTRATIONS_SECTION + '\n' + '\n'.join(lines_ap[insert_illustrations_at:])

lines_ap2 = apparat_with_illustrations.split('\n')
insert_kak_at = next(idx for idx, l in enumerate(lines_ap2) if l.startswith('## Заявление о прозрачности ИИ'))
final_apparat = '\n'.join(lines_ap2[:insert_kak_at]) + '\n' + kak_ispravit_section + '\n' + '\n'.join(lines_ap2[insert_kak_at:])

lines_final = final_apparat.split('\n')
colophon_idx = next((idx for idx, l in enumerate(lines_final) if l.startswith('## Колофон')), None)
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

print(f'  [OK] {plates_injected} plates + {sources_injected} sources — RAW HTML no figure/figcaption')
PYEOF

echo "  ✓ merged.md: $(wc -l < $MERGED_MD) lines"

# Step 5 — pandoc build (v1.0-compat, no --split-level, HTML img inline)
echo ""
echo "📖 Building EPUB3..."
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

# Gates
XHTML_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "EPUB/text/.*\.xhtml")
NAV_LI_COUNT=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | grep -oE '<li id="toc-li-[0-9]+' | wc -l)
IMG_TAGS=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -oE '<img[^>]+>' | wc -l)
FIGCAP_COUNT=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -c '<figcaption')
FIGURE_COUNT=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -c '<figure')

echo ""
echo "🔍 Gates:"
echo "  xhtml: $XHTML_COUNT"
echo "  nav <li>: $NAV_LI_COUNT"
echo "  <img> tags: $IMG_TAGS (expected 20)"
echo "  <figure> в теле: $FIGURE_COUNT (must be 0 — raw img only)"
echo "  <figcaption> в теле: $FIGCAP_COUNT (must be 0 — no captions)"

# Deanon
if unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -q "Клеменч[её]нок"; then
  echo "  ❌ FAIL: real name found"
  exit 1
fi

# epubcheck
echo ""
echo "🔍 epubcheck:"
epubcheck "$OUTPUT_EPUB" 2>&1 | tail -3

echo ""
echo "🎉 kn.6 EPUB v1.1c build complete!"
echo "  Output: $OUTPUT_EPUB"
echo "  MD5: $(md5sum $OUTPUT_EPUB | awk '{print $1}')"
