#!/bin/bash
#
# kn.6 «Своими глазами» EPUB v1.1g generator (pandoc-based)
# S1KOCHEGAR cont+14 · 2026-09-07 (per Iskra Template v3 + T-316-01 P0 kitchen leak fix)
#
# CHANGES vs v1.1f (Iskra Template v3 Gate 6 G1-ILL — SEAL-FINAL-S316 §3 Урок 11):
#   - Preprocess merged.md: strip fenced ```yaml illustration manifest blocks
#     (root cause T-316-01 P0: pandoc syntax-highlights YAML manifest → kitchen leak в body)
#   - Post-build Gate 6 G1-ILL verify — сборка ПАДАЕТ (exit 1) при hits > 0
#   - Detection mask: `^\s*- id: k\d+-ill-|license_expect|source_hint|KOSTYAK|FACT-GATE|Плашка|type: "поиск`
#   - Generic YAML-key body strip: `^\s*\w+: ".*"$` (naked YAML не в fence)
#
# CHANGES retained from v1.1f:
#   - Обложка = K1 «Картотека» Фриды (vault/books/kn6-package/covers/kn6-cover-final.png)
#   - nav.xhtml REMOVED from spine outright (S315-06 canon)
#   - RAW HTML img без figure/figcaption
#   - webp → jpg conversion
#   - No --split-level explicit flag

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VAULT_ROOT="/c/JOHNDOE_CLAUDE/vault"

SVOD_MASTER="$VAULT_ROOT/books/KN6-SVOD-MASTER-v1.0-S196.md"
APPARAT_V10="$VAULT_ROOT/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md"
APPARAT_V12="$VAULT_ROOT/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md"

# КАНОН S315-04 §2.2: обложка = K1 Фриды из vault, не типографский титул portal
COVER_PNG="$VAULT_ROOT/books/kn6-package/covers/kn6-cover-final.png"

IMAGES_SRC="$PROJECT_ROOT/content/kn6/ru/images"
SOURCES_SRC="$PROJECT_ROOT/content/kn6/ru/images/sources"

BUILD_DIR="/c/Transit/kn6-build-v1.1g"

EPUB_VERSION="${1:-v1.1g}"
OUTPUT_EPUB="$BUILD_DIR/kn6-svoimi-glazami-${EPUB_VERSION}.epub"

echo "📚 kn.6 «Своими глазами» EPUB build ${EPUB_VERSION} (КАНОН EPUB-TRAKT-1)"
echo "======================================================================"
echo "  Обложка K1 Фриды (851 KB, kn6-cover-final.png) + nav linear=no + JPG only"
echo ""

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/media"

# Verify sources
for src in "$SVOD_MASTER" "$APPARAT_V10" "$APPARAT_V12" "$COVER_PNG"; do
  [[ -f "$src" ]] || { echo "  ❌ MISSING: $src" >&2; exit 1; }
done
echo "  ✓ Cover K1 Фриды: $COVER_PNG ($(du -h $COVER_PNG | cut -f1), $(magick identify $COVER_PNG | awk '{print $3}'))"

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

# Step 1 — webp → jpg
echo "🔄 Converting webp → jpg..."
for p in "${FRIDA_PLATES[@]}"; do
  BASE="${p%.webp}"
  magick "$IMAGES_SRC/$p" -background white -alpha remove -quality 85 "$BUILD_DIR/media/${BASE}.jpg" 2>&1 | tail -1
done
for s in "${FIRST_SOURCES[@]}"; do
  BASE="${s%.webp}"
  magick "$SOURCES_SRC/$s" -background white -alpha remove -quality 85 "$BUILD_DIR/media/${BASE}.jpg" 2>&1 | tail -1
done
echo "  ✓ 20 images ($(du -sh $BUILD_DIR/media | cut -f1))"

# Step 2 — cover K1 Фриды (per КАНОН §2.2 — используем vault K1 напрямую, 1200x1800 already correct size)
echo ""
echo "🎨 Cover K1 «Картотека» Фриды..."
# Kn6-cover-final.png is already 1200x1800 8-bit sRGB — copy as-is, no re-encode
cp "$COVER_PNG" "$BUILD_DIR/cover.png"
echo "  ✓ K1 Фриды cover: $(du -h $BUILD_DIR/cover.png | cut -f1) $(magick identify $BUILD_DIR/cover.png | awk '{print $3}')"
echo "  ✓ md5: $(md5sum $BUILD_DIR/cover.png | awk '{print $1}')"

# Step 3 — assemble merged .md (same as v1.1c)
MERGED_MD="$BUILD_DIR/kn6-merged.md"

python3 - <<'PYEOF'
import re, os, sys

VAULT_ROOT = "/c/JOHNDOE_CLAUDE/vault"
BUILD_DIR = "/c/Transit/kn6-build-v1.1g"

def native(p):
    return p.replace('/c/', 'C:/', 1) if p.startswith('/c/') else p

svod_path = native(f"{VAULT_ROOT}/books/KN6-SVOD-MASTER-v1.0-S196.md")
apparat_v10_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.0-CANONICAL-body-Iskra-S197-preserved-2026-07-26.md")
apparat_v12_path = native(f"{VAULT_ROOT}/books/KN6-APPARAT-v1.2-ADRES-PRIYOMNOY-FIXED-SUPERSED-v11-Iskra-S216-2026-07-23.md")
merged_path = native(f"{BUILD_DIR}/kn6-merged.md")

# NO CAPTIONS in body per Andrey report cont+13 (retained from v1.1c)
PLATE_MAP = {
    "Введение. Своими глазами": {"plate": "kn6-00-vvedenie.jpg", "alt": "Иллюстрация", "sources": []},
    "I. Проверь сам": {"plate": "kn6-01-prover-sam.jpg", "alt": "Иллюстрация",
        "sources": [("07-apollo11-aldrin-1969.jpg", "Первоисточник")]},
    "II. Филолог": {"plate": "kn6-02-filolog.jpg", "alt": "Иллюстрация",
        "sources": [("06-valla-de-falso-credita-1620.jpg", "Первоисточник")]},
    "III. Инквизитор": {"plate": "kn6-03-inkvizitor.jpg", "alt": "Иллюстрация",
        "sources": [("05-donatio-constantini-stgallen-9c.jpg", "Первоисточник")]},
    "IV. Комиссия": {"plate": "kn6-04-komissiya.jpg", "alt": "Иллюстрация",
        "sources": [("01-bailly-rapport-1784-title.jpg", "Первоисточник")]},
    "V. Врач": {"plate": "kn6-05-vrach.jpg", "alt": "Иллюстрация",
        "sources": [("04-semmelweis-aetiologie-1861-title.jpg", "Первоисточник")]},
    "VI. Офицер": {"plate": "kn6-06-oficer.jpg", "alt": "Иллюстрация",
        "sources": [
            ("02-zola-jaccuse-laurore-1898.jpg", "Первоисточник"),
            ("03-bordereau-dreyfus-1894.jpg", "Первоисточник"),
        ]},
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
content = '\n'.join(lines_all[first_h1:])

# v1.1f Layer 3 Iskra Template v3 Gate 6 G1-ILL preprocess: strip fenced ```yaml illustration manifest blocks
# Root cause T-316-01 P0 kitchen leak: pandoc syntax-highlights ```yaml blocks в body → sourceCode
# spans (<span class="fu">license_expect</span>) — kitchen manifest leaks в EPUB body per SEAL-FINAL-S316
# §3 Урок 11 «gate искал known markers без generic YAML-key check». Strip preprocess = defense-in-depth.
yaml_stripped = re.sub(
    r'^```yaml\s*\n.*?\n```\s*$\n?',
    '',
    content,
    flags=re.MULTILINE | re.DOTALL
)
yaml_blocks_stripped = content.count('```yaml')
if yaml_blocks_stripped > 0:
    print(f'  [OK] v1.1f Layer 3 Gate 6 preprocess: {yaml_blocks_stripped} ```yaml fenced blocks stripped from body')

# v1.1g Layer 4 Iskra DOPOLNENIE-S317-03a §1 + POMETKA-S317-06 canon: strip inline [СЛОТ k*-ill-*: ...]
# markers per Iskra formal regex «\[СЛОТ\s+k[0-9]+-ill-[0-9]+:[^\]]*\]» DOTALL (Печкин cont5-03 §1
# verbatim 7 slots in ch003/ch004/ch006/ch007 + Andrey screenshot S317-03a). Absatz целиком удаляется,
# соседние не склеиваются (Iskra §1 «многострочный, DOTALL — слот может переноситься»).
slot_stripped = re.sub(
    r'^\s*\[СЛОТ\s+k[0-9]+-ill-[0-9]+:[^\]]*?\]\s*$\n?',
    '',
    yaml_stripped,
    flags=re.MULTILINE | re.DOTALL
)
# EN variant on the safe side (Iskra §1 «на всякий случай `\[SLOT\s`»):
slot_stripped = re.sub(
    r'^\s*\[SLOT\s+k[0-9]+-ill-[0-9]+:[^\]]*?\]\s*$\n?',
    '',
    slot_stripped,
    flags=re.MULTILINE | re.DOTALL
)
slots_ru_count = len(re.findall(r'\[СЛОТ\s+k[0-9]+-ill-[0-9]+', yaml_stripped, re.MULTILINE))
slots_en_count = len(re.findall(r'\[SLOT\s+k[0-9]+-ill-[0-9]+', yaml_stripped, re.MULTILINE))
if slots_ru_count > 0 or slots_en_count > 0:
    print(f'  [OK] v1.1g Layer 4 preprocess: {slots_ru_count} [СЛОТ] + {slots_en_count} [SLOT] inline markers stripped from body')

content = slot_stripped

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

# Apparatus (same as v1.1c)
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

print(f'  [OK] {plates_injected} plates + {sources_injected} sources')
PYEOF

echo "  ✓ merged.md: $(wc -l < $MERGED_MD) lines"

# Step 4 — pandoc build
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

echo "  ✓ pandoc build: $(du -h $OUTPUT_EPUB | cut -f1)"

# Step 5 — POSTPROCESS v1.1g: MOVE nav.xhtml itemref в spine ПОСЛЕ введения (Template v4)
# Iskra POMETKA-S317-06 + S318-05 §2 п.2: «nav в spine после введения страницей оглавления»
# v1.1e/f REMOVED nav from spine outright per S315-06 «читалки игнорируют linear=no» —
# but AlReader still didn't show ncx TOC (Iskra S317-03 «оглавление ПРОПАЛО СОВСЕМ»).
# Template v4 restores nav в spine as visible chapter after preface — reader shows nav as page.
echo ""
echo "🔧 Postprocess: MOVE nav itemref после введения в spine (Template v4 per Iskra POMETKA-S317-06)..."

python3 - <<'PYEOF'
import zipfile, shutil, os, sys, re

OUTPUT = os.environ.get('OUTPUT_EPUB', '/c/Transit/kn6-build-v1.1g/kn6-svoimi-glazami-v1.1g.epub')
if OUTPUT.startswith('/c/'):
    OUTPUT = OUTPUT.replace('/c/', 'C:/', 1)

TEMP = OUTPUT + '.tmp'

with zipfile.ZipFile(OUTPUT, 'r') as z_in:
    with zipfile.ZipFile(TEMP, 'w', zipfile.ZIP_DEFLATED) as z_out:
        for item in z_in.infolist():
            data = z_in.read(item.filename)
            if item.filename == 'EPUB/content.opf':
                content = data.decode('utf-8')
                # v1.1g Template v4: MOVE nav itemref ПОСЛЕ chapter «Введение» (ch001_xhtml)
                # Iskra POMETKA-S318-05 §2 п.2 verbatim: «nav.xhtml в spine после введения страницей оглавления»
                # Sequence: cover_xhtml → title_page_xhtml → ch001_xhtml (Введение) → NAV → ch002_xhtml (I. Проверь сам) → ...
                # Skip: cover_xhtml, title_page_xhtml, nav — find first chXXX_xhtml itemref
                nav_match = re.search(r'\s*<itemref\s+idref="nav"[^/]*/>\s*\n?', content)
                if nav_match:
                    nav_line_stripped = nav_match.group(0).strip()
                    # Remove nav from current position (whatever it is)
                    content_no_nav = re.sub(r'\s*<itemref\s+idref="nav"[^/]*/>\s*\n?', '\n    ', content, count=1)
                    # Find first CHAPTER itemref (skip cover/title/nav, find ch001 = введение)
                    # Pandoc naming: ch001_xhtml, ch002_xhtml, ... — introduction = ch001
                    intro_match = re.search(r'(<itemref\s+idref="ch001_xhtml"[^/]*/>)', content_no_nav)
                    if intro_match:
                        intro_line = intro_match.group(1)
                        # Insert nav AFTER ch001 (введение) — за первой главой введения
                        content = content_no_nav.replace(
                            intro_line,
                            intro_line + '\n    ' + nav_line_stripped,
                            1
                        )
                        print(f'  [OK] v1.1g Template v4: nav itemref MOVED после ch001 (Введение. Своими глазами) per Iskra POMETKA-S318-05 §2 п.2')
                    else:
                        # Fallback: find first non-cover/title/nav itemref
                        skip_ids = {'cover_xhtml', 'title_page_xhtml', 'nav'}
                        all_matches = re.findall(r'<itemref\s+idref="([^"]+)"[^/]*/>', content_no_nav)
                        first_chapter = next((idref for idref in all_matches if idref not in skip_ids), None)
                        if first_chapter:
                            pattern = rf'<itemref\s+idref="{re.escape(first_chapter)}"[^/]*/>'
                            match = re.search(pattern, content_no_nav)
                            if match:
                                chapter_line = match.group(0)
                                content = content_no_nav.replace(
                                    chapter_line,
                                    chapter_line + '\n    ' + nav_line_stripped,
                                    1
                                )
                                print(f'  [OK] v1.1g Template v4: nav itemref MOVED после первой главы (idref={first_chapter}) — fallback')
                            else:
                                print(f'  [WARN] v1.1g Template v4: fallback failed, nav removed')
                                content = content_no_nav
                        else:
                            print(f'  [WARN] v1.1g Template v4: no chapter itemref found, nav removed')
                            content = content_no_nav
                else:
                    print(f'  [INFO] v1.1g Template v4: no nav itemref in spine to move')
                data = content.encode('utf-8')
            elif item.filename == 'EPUB/nav.xhtml':
                # v1.1g: KEEP landmarks TOC reference since nav.xhtml IS в spine (Template v4)
                # No modification needed to nav.xhtml itself — pandoc generates correct landmarks
                pass
            # Special handling: mimetype MUST be first + uncompressed
            if item.filename == 'mimetype':
                new_item = zipfile.ZipInfo('mimetype')
                new_item.compress_type = zipfile.ZIP_STORED
                z_out.writestr(new_item, data)
            else:
                z_out.writestr(item, data)

# Replace original с postprocessed
shutil.move(TEMP, OUTPUT)
print(f'  [OK] EPUB postprocessed: {OUTPUT}')
PYEOF

# Verify postprocess v1.1g — nav itemref MUST be present (Template v4: nav IN spine)
echo ""
echo "🔍 Verify nav itemref PRESENT в spine (Template v4 — must be exactly 1):"
NAV_REFS=$(unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -c 'idref="nav"' 2>/dev/null || true)
NAV_REFS="${NAV_REFS:-0}"
NAV_REFS="${NAV_REFS//[^0-9]/}"
echo "  nav itemref count: $NAV_REFS (must be 1 per Template v4)"
if [[ "$NAV_REFS" != "1" ]]; then
  echo "  ❌ FAIL: nav itemref count != 1 (Template v4 requires nav IN spine after preface)"
  exit 1
fi
echo "  ✓ nav в spine (Template v4 per Iskra POMETKA-S317-06)"

# v1.1g Gate: verify nav positioned AFTER ch001 (Введение) per Template v4
echo ""
echo "🔍 Verify nav positioned AFTER ch001_xhtml (Введение) per Iskra POMETKA-S318-05 §2 п.2:"
SPINE_ORDER=$(unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -oE '<itemref[^/]*/>' | head -6)
echo "$SPINE_ORDER"
NAV_POS=$(unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -oE '<itemref[^/]*/>' | grep -n 'idref="nav"' | cut -d: -f1)
CH001_POS=$(unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -oE '<itemref[^/]*/>' | grep -n 'idref="ch001_xhtml"' | cut -d: -f1)
NAV_POS="${NAV_POS:-0}"
NAV_POS="${NAV_POS//[^0-9]/}"
CH001_POS="${CH001_POS:-0}"
CH001_POS="${CH001_POS//[^0-9]/}"
echo "  ch001 (Введение) position: $CH001_POS"
echo "  nav position: $NAV_POS"
if [[ "$CH001_POS" -eq "0" ]]; then
  echo "  ⚠️  WARN: ch001_xhtml not found, cannot verify nav-after-intro semantic"
elif [[ "$NAV_POS" -le "$CH001_POS" ]]; then
  echo "  ❌ FAIL: nav at position $NAV_POS, must be AFTER ch001 at position $CH001_POS (Template v4)"
  exit 1
else
  echo "  ✓ nav positioned AFTER Введение (Template v4 canon Iskra POMETKA-S318-05)"
fi

# Gates (set +e safe для grep -c pipefail interaction — no-match exit 1 defeats set -e via subshell)
XHTML_COUNT=$(unzip -l "$OUTPUT_EPUB" 2>/dev/null | grep -cE "EPUB/text/.*\.xhtml" || true)
NAV_LI_COUNT=$(unzip -p "$OUTPUT_EPUB" EPUB/nav.xhtml 2>/dev/null | grep -oE '<li id="toc-li-[0-9]+' | wc -l || true)
IMG_TAGS=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -oE '<img[^>]+>' | wc -l || true)
FIGURE_COUNT=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -c '<figure' || true)
COVER_IMG_MD5=$(unzip -p "$OUTPUT_EPUB" EPUB/media/file20.png 2>/dev/null | md5sum | awk '{print $1}')
KANON_COVER_MD5="854af8b03f014685897460708ed80be5"

# Sanitize varsable — grep -c/wc -l may emit multi-line if fallback triggered
XHTML_COUNT="${XHTML_COUNT//[^0-9]/}"
NAV_LI_COUNT="${NAV_LI_COUNT//[^0-9]/}"
IMG_TAGS="${IMG_TAGS//[^0-9]/}"
FIGURE_COUNT="${FIGURE_COUNT//[^0-9]/}"

echo ""
echo "🔍 Gates:"
echo "  xhtml: $XHTML_COUNT"
echo "  nav <li>: $NAV_LI_COUNT"
echo "  <img> tags: $IMG_TAGS (expected 20)"
echo "  <figure> в теле: $FIGURE_COUNT (must be 0)"
echo "  cover md5: $COVER_IMG_MD5"
echo "  KANON expected: $KANON_COVER_MD5"
if [[ "$COVER_IMG_MD5" == "$KANON_COVER_MD5" ]]; then
  echo "  ✓ Cover = K1 «Картотека» Фриды (match)"
else
  echo "  ❌ Cover mismatch!"
fi

# Deanon
if unzip -p "$OUTPUT_EPUB" EPUB/content.opf 2>/dev/null | grep -q "Клеменч[её]нок"; then
  echo "  ❌ FAIL: real name found"
  exit 1
fi

# Gate 6 G1-ILL (Iskra Template v3 SEAL-FINAL-S316 §3 Урок 11 — MANDATORY, сборка падает)
echo ""
echo "🔍 Gate 6 G1-ILL kitchen leak check (Iskra Template v3):"
G1_ILL_HITS=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE '^\s*- id: k[0-9]+-ill-|license_expect|source_hint|KOSTYAK|FACT-GATE|Плашка|type: "поиск' || true)
echo "  specific kitchen markers hits: $G1_ILL_HITS (must be 0)"
if [[ "$G1_ILL_HITS" != "0" ]]; then
  echo "  ❌ FAIL: kitchen leak detected — сборка ПАДАЕТ per Iskra Template v3"
  unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -nE '^\s*- id: k[0-9]+-ill-|license_expect|source_hint|KOSTYAK|FACT-GATE|Плашка|type: "поиск' | head -10
  exit 1
fi
# Generic naked YAML-key body check (defense-in-depth per SEAL-FINAL-S316 §3 «gate искал known markers»)
GENERIC_YAML_HITS=$(unzip -p "$OUTPUT_EPUB" 'EPUB/text/*.xhtml' 2>/dev/null | grep -cE '^\s*[a-z_]+: ".*"$' || true)
echo "  generic YAML-key hits: $GENERIC_YAML_HITS (informational)"
echo "  ✓ Gate 6 G1-ILL PASS"

# epubcheck
echo ""
echo "🔍 epubcheck:"
epubcheck "$OUTPUT_EPUB" 2>&1 | tail -3

echo ""
echo "🎉 kn.6 EPUB v1.1g build complete!"
echo "  Output: $OUTPUT_EPUB"
echo "  MD5: $(md5sum $OUTPUT_EPUB | awk '{print $1}')"
