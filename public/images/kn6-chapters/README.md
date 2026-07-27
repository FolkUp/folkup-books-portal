# Кн.6 «Своими глазами» — иллюстрации chapter plates + first-sources

Deployment cont+24 (2026-07-26) — hybrid layer per Iskra §4 memo стратегии:
- **Плашки Фриды** — держат визуальный стиль, работают там где документа нет (сцены, метафоры, обобщения)
- **Первоисточники под открытыми лицензиями** — второй слой где документ существует и узнаваем

## Chapter plate mapping

Structure per `vault/books/KN6-SVOD-MASTER-v1.0-S196.md` (S196 canon) + S127 OGLAVKA v2 FINAL 4 interludii.

| Section | Frida plate | First-source | Combined layer |
|---------|-------------|--------------|----------------|
| **Введение. Своими глазами** | `kn6-00-vvedenie.webp` (conformity metaphor — figure vs chorus) | — | Frida only |
| **I. Проверь сам** | `kn6-01-prover-sam.webp` SHIPPED cont+24 | `sources/07-apollo11-aldrin-1969.webp` | Frida + Apollo 11 |
| **II. Филолог** | `kn6-02-filolog.webp` (medieval scholar с magnifying glass) | `sources/05-donatio-constantini-stgallen-9c.webp` + `sources/06-valla-de-falso-credita-1620.webp` | Frida + Donatio + Valla (Iskra S219 pair-review cont+25: перенос из «Инквизитор») |
| **III. Инквизитор** | `kn6-03-inkvizitor.webp` SHIPPED cont+24 | — | Frida only (перенесены к «Филолог» per Iskra S219) |
| **IV. Комиссия** | `kn6-04-komissiya.webp` SHIPPED cont+24 | `sources/01-bailly-rapport-1784-title.webp` | Frida + Bailly 1784 |
| **V. Врач** | `kn6-05-vrach.webp` SHIPPED cont+24 | `sources/04-semmelweis-aetiologie-1861-title.webp` | Frida + Semmelweis 1861 |
| **VI. Офицер** | `kn6-06-oficer.webp` SHIPPED cont+24 | `sources/02-zola-jaccuse-laurore-1898.webp` + `sources/03-bordereau-dreyfus-1894.webp` | Frida + Zola + Bordereau |
| **VII. Сожжённый архив** | `kn6-07-sozhzhennyy-arkhiv.webp` (burning books pyre) | — | Frida only |
| **VIII. Тень** | `kn6-08-ten.webp` (shadow disparity metaphor) | — | Frida only |
| **Врезка. Сколько весит хор** | `kn6-vrezka-01-khor.webp` (balance scale allegory) | — | Frida only |
| **Врезка. Ложь во спасение** | `kn6-vrezka-02-lozh.webp` (protective silence gesture) | — | Frida only |
| **Интермедия. Картограф** | `kn6-intermediya-kartograf.webp` (map mid-draw metaphor) | — | Frida only |
| **Кода. Картотека** | `kn6-koda-kartoteka.webp` (library card catalog c question mark) | — | Frida only |

## Existing artifacts

- `plate-kn6-svoimi-glazami.webp` — symbolic general plate (fallback, pre-cont+24)
- 7 first-sources в `sources/` folder — see `sources/README.md` для полной attribution catalog

## Style canon

Все Frida plates — Victorian steel engraving canon (S1FRIDA Wave 2 covers pipeline):
- Palette: bordeaux + deep amber + sepia + muted sage + ivory
- Format: portrait 2:3 chapter plate (matches Ernst Haeckel scientific illustration format)
- No readable text, no cyrillic (Cyrillic FAIL known Flux 1.1 Pro — использовать HTML/SVG composite для title typography отдельно)
- Fine cross-hatching, chiaroscuro focal lighting
- Ambient warm candlelight source

## Downstream

- **Iskra editorial:** verify каждый plate placement fit к точным местам в тексте главы
- **Andrey visa:** quality gate на hybrid concept + go/no-go на serie-wide rollout
- **Typesetter build:** attribution block «Иллюстрации» в аппарат кн.6 per KANON-S214 (для всех first-sources + credit Frida для plates)
- **BATCH 3b:** ✅ shipped — 5 hybrid Frida plates для kn6-01/03/04/05/06 (sections с первоисточниками)

**Session:** S3SCOOP cont+24 · Autonomous carte blanche Andrey · Iskra proposal S214 pilot validated
