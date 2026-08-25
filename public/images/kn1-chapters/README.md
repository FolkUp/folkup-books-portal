# Кн.1 «Agile Sapiens» — 13 chapter plates (флагман трилогии)

Deployment cont+5 EXT (2026-08-24) — flagship chapter plates trilogy launch per Iskra RATIFIKACIYA-S295-13 «GO 13 плит + виза Андрея '13 и да'» + Vier-Augen PASS S297-05 §1 с 4 правками.

Style canon = kn.6 «Своими глазами» (Victorian steel engraving, palette bordeaux + amber + sepia + sage + ivory, no text/no Cyrillic discipline, fine cross-hatching, chiaroscuro focal lighting).

## Chapter plate mapping

| # | Chapter slug | Frida plate | Metaphor |
|---|--------------|-------------|----------|
| 1 | `chapter-0-pilot` | `kn1-00-pilot.webp` | Vintage cockpit dashboard, dawn light, empty pilot seat — symbolic departure into unknown |
| 2 | `chapter-1-jules-verne` | `kn1-01-jules-verne.webp` | Nautilus brass periscope, depth gauge, kelp shadows — undersea exploration |
| 3 | `chapter-2-frankenstein` | `kn1-02-frankenstein.webp` | Laboratory glassware, amber plasma flask, Galvani apparatus — scientific hubris |
| 4 | `chapter-3-holmes` | `kn1-03-holmes.webp` | Magnifying glass over parchment, deerstalker silhouette, pipe smoke — investigation |
| 5 | `chapter-4-borges` | `kn1-04-borges.webp` | Infinite library shelf receding, mirror labyrinth — infinite knowledge |
| 6 | `chapter-5-nemo` | `kn1-05-nemo.webp` | Victorian brass diving helmet, air hose, sage-sepia depth — undersea descent |
| 7 | `chapter-6-jekyll-hyde` | `kn1-06-jekyll-hyde.webp` | Split potion flask amber/bordeaux, dual mirror shadow — duality of nature |
| 8 | `chapter-6-mina-harker` | `kn1-06-mina-harker.webp` | Victorian Remington typewriter, layered diary pages, garlic sprig — evidence gathering |
| 9 | `chapter-7-don-quixote` | `kn1-07-don-quixote.webp` | Windmill silhouette dusk, tilted lance — chivalric folly against systemic reality |
| 10 | `chapter-8-time-machine` | `kn1-08-time-machine.webp` | Brass time-lever, exposed clockwork gears, Roman numeral dial — temporal manipulation |
| 11 | `chapter-9-niichavo` | `kn1-09-niichavo.webp` | Ornate brass door handle, floral/geometric decoration, magical apparatus — threshold to hidden knowledge |
| 12 | `chapter-10-chuma` | `kn1-10-chuma.webp` | Closed Oran shutters, plague doctor mask on table — quarantine and endurance |
| 13 | `afterword` | `kn1-afterword.webp` | Setting sun over library rooftop, amber warm light through stained glass — closing chapter reflection |

**Explicitly NO plates** (per Iskra RATIFIKACIYA Q2 verbatim): `preface` (открывается обложкой) + `intermezzo-1/2/3` (авторские передышки, воздух ритма книги).

## Style canon

All Frida plates — Victorian steel engraving canon (mirrors kn.6 series identity):
- Palette: bordeaux (#7D4450) + deep amber (#E8AD4A) + sepia + muted sage (#6A7E5C) + ivory
- Format: portrait 2:3 aspect (Ernst Haeckel scientific illustration proportions)
- No readable text, no Cyrillic (Flux 1.1 Pro Cyrillic FAIL known — типографика через HTML/SVG composite)
- Fine cross-hatching, chiaroscuro focal lighting
- Ambient warm candlelight source
- No character portraits — subject/scene composition only

## Generation provenance

- **Pipeline:** Flux 1.1 Pro (Replicate) + custom prompt engineering per BRIEF §3
- **Cost:** $1.56 total ($0.36 pilot 9 gens + $1.20 full batch 30 gens = 39 gens total, -69% под кап $5 per Andrey «13 и да» ratified budget)
- **Picks:** Andrey zerkalce selection cont+5 EXT-2 + EXT-3 (2026-08-24)
- **Ratifikaciya:** Iskra RATIFIKACIYA-S295-13 GO + VIER-AUGEN-S297-05 §1 PASS с 4 правками (правки 2+3 в prompts applied in-place до gen execute, правки 1+4 к моменту PR применены)

## Downstream integration

- **Iskra editorial:** verify каждый plate placement fit к точным местам в тексте главы (ярус паспорта финальный) — **PRINYATA cont+7 (Iskra S299-01)**
- **Andrey visa:** quality gate + zerkalce Andrey selection final approved cont+5..+7
- **Attribution:** per BRIEF §9 canonical — «Иллюстрации chapter plates: Ремедиос (Frida-форнит FolkUp, Flux 1.1 Pro), 2026-08. Style canon Victorian steel engraving по прецеденту кн.6. Лицензия CC BY-SA 4.0» — добавлено в аппарат книги (colophon.md)
- **Reader integration Option B (SHIPPED cont+6, PR #222 MERGED 2026-08-24 10:40 UTC):** frontmatter `plate: kn1-NN-<slug>.webp` declared в 13 RU md-файлах глав → Vue3 Kn1ReadChapter.vue renders `<figure class="reader-chapter__plate">` conditionally per `chapterData.meta.plate`. Live prod: `books.folkup.life/kn1/read/chapter-N` (RU only currently).
- **Reader integration Option C (PREP cont+9, awaits Iskra P2 ticket registration + Johnny availability):** filesystem-based auto-detection в `scripts/kn1-reader-manifest.mjs` (`detectPlate()` function) — plates auto-wire for PT/EN/DE readers когда chapter slugs match filename convention (see §Filename convention ниже). Branch `feat/s1illus-cont9-kn1-reader-option-c-prep` SHA `7a08443` local, ready to push после ratify. Iskra §4 §1 explicit override preserved (frontmatter `plate:` field остаётся source of truth).

## Filename convention for auto-detection (Option C)

Для acceleration future plate additions без per-language frontmatter edits — filename discipline enables `detectPlate()` auto-wire:

| Slug pattern | Plate filename convention | Extension |
|---|---|---|
| `chapter-N-<topic>` (N = 0..99) | `kn1-NN-<topic>.<ext>` (N zero-padded) | `.webp` \| `.jpg` \| `.jpeg` \| `.png` |
| `afterword` (special case) | `kn1-afterword.<ext>` | same |
| `preface` (canon: НО plate) | — (не auto-wire) | — |
| `intermezzo-N` (canon: НО plate) | — (не auto-wire) | — |
| `apparatus-*` (colophon/methodology/etc) | — (не auto-wire) | — |

**Example:** slug `chapter-6-jekyll-hyde` → filename `kn1-06-jekyll-hyde.webp` (both stems must match after zero-pad).

**Explicit override:** frontmatter `plate: <custom-filename>.webp` supersedes auto-detection (Iskra §4 §1 canon — source of truth preserved). Use для edge cases когда filename не совпадает slug convention.

**Cross-lang status (post-Option C activation):**
- **RU:** 13/13 (explicit frontmatter, backward compat baseline)
- **PT:** 1/4 auto-detected (chapter-0-pilot; +12 когда Bolik ships remaining chapters)
- **EN:** 13/13 auto-detected (все chapters + afterword auto-wire)
- **DE:** graceful skip (chapters dir absent; активируется когда Bolik ships DE routes)

**Session:** S1ILLUS cont+5 EXT-3 generation · cont+6 Option B reader wiring shipped · cont+7 Iskra PRINYATA + Option C recommend · cont+9 Option C prep branch ready · Cartouche L3 Autonome Andrey max-autonomy carte-blanche
