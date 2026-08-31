<!-- precommit:allow-ai-mentions -->
# кн.2 «Согласные без гласных»

**Position:** 2 из 7 (трилогия FolkUp)
**Author:** Команданте FolkUp
**License:** CC BY-SA 4.0
**Status:** RU-эталон ЩИТ v5.0 PASS · pending EN/DE/PT clones + publish gates

## Directory structure

```
content/kn2/
├── README.md                    # this file
└── ru/
    └── kn2-soglasnye-bez-glasnyh.adoc  # master body (Иви authored)
```

## RU-эталон canonization history

| Дата | Событие | Артефакт |
|------|---------|----------|
| 2026-06-28 | Иви uploaded master body к Drive (id `11e5gxgZMU22Oe90Q62iqMpzOuUKhNH6j`) | 645 KB adoc, 360830 chars |
| 2026-07-01 | Пилот ЩИТ v5.0 S148 (Предисловие + Гл.1 + Гл.2, 9 правок H2) | Drive `181ZRw2pQvfK04XJ4dAsGoW8ZO5miCGdW` |
| 2026-07-01 | Догон ЩИТ v5.0 S149 (Гл.3 → Гл.9 + Эпилог, 16 правок H2) | Drive `1uCio028VmWuW2_Xanat_dZMfIYYomBb8` |
| 2026-07-02 | Alice cont +12 migration к portal + apply 25 patches | этот commit |

## Canonicalization audit (25 патчей = 0 critical / 8 major / 17 minor)

Все правки — снятие H2-суфлёрских обёрток («запомним», «стоит подержать в уме», «мы к нему вернёмся» и т.д.). Тело тезисов НЕ тронуто. Мосты арки (M1–M7 пилота + ~15 мостов Гл.3–9) сохранены все до одного.

**Pilot S148 (9 patches):**
- Preface PASS (0 patches; авторская интонация Сократ = не суфлёр)
- Гл.1 «Сакральный контур»: 5 patches (KN2-H2-01…05)
- Гл.2 «Форк»: 4 patches (KN2-H2-06…09)

**Догон S149 (16-17 patches):**
- Гл.3 «Идея становится товаром»: 5 patches (KN2-H2-10…14)
- Гл.4 «Кто первым сказал вслух»: 1 patch (KN2-H2-15)
- Гл.5-6 «Цеховая тайна / Хакерская этика»: 5 patches (KN2-H2-16…20)
- Гл.7-9 «Корпоративный ответ / Мученик / Сегодня и завтра»: 6 patches (KN2-H2-21…26)
- Эпилог + аппарат PASS (0 patches)

**Post-apply body size:** 360311 chars (was 360830, delta -519 chars от снятия обёрток).

## Publishing gates status

- ✅ RU ЩИТ v5.0 PASS (S149)
- ⏳ DE profile build (Кнут — full profile pilot per Иви mandate S148 после закрытия RU-фронта кн.3)
- ⏳ EN clone (Лёлик)
- ⏳ PT clone (Зека)
- ⏳ ISBN (Гутенберг + Bowker)
- ⏳ Portal deploy (SITE-LONGREADS-001 04-05.07)

## Cross-references

- Иви canon: `КАРТА-Иви-S151-v2` (Drive `1aSGKHSoe05Lf4yEPy5p_y9GTuUz3a3Oe`)
- ЩИТ v5.0 canonical spec: `SHIT-v5.0-KANON-S144` (Drive `1UM304kyzus97ypzFX3VaLobjN3W_LUvD`)
- Portal repo README: root `README.md`
