<!-- precommit:allow-ai-mentions -->
# кн.7 «Трудности диалога»

**Position:** 7 из 7 (финал трилогии FolkUp — Variant B жёсткий)
**Author:** Андрей Клеменчёнок · «Команданте FolkUp»
**License:** CC BY-SA 4.0
**Status:** СВОД ЗАКРЫТ 2026-07-02 (Ивин S151 verdict Андрея) · ЩИТ v5.0 gates PENDING · release BLOCKED pending кн.3 close-out

## ⚠️ Не публиковать до сигнала Андрея

Из Ивин S151 mandate:
> Собрать канонический корпус кн.7 в git: мастер S120 + вставка уровня 2 «Переводчик, которого никто не звал» (по разметке шва S142) + интерлюд «Занзибар» v10.
>
> **ВАЖНО: закрытие свода ≠ готовность.** Кн.7 проходит ворота ЩИТ v5.0 (прогон Иви) ПОСЛЕ кн.3 — до этого не публиковать, соцпак не боевой.

## Directory structure

```
content/kn7/
├── README.md                              # this file
└── ru/
    └── parts/
        ├── README-SBORKA-KN7-MASTER-S120.md     # Иви sborka instructions
        ├── KN7-00-OBLOZHKA-OGLAVLENIE-S120.md   # обложка + оглавление
        ├── KN7-01-VHOD-Rybka-S120.md            # ВХОД. Рыбка, которой не хватило
        ├── KN7-02-glava-1-1-Slova-pereveli-S120.md
        ├── KN7-03-glava-1-2-Barjer-do-slov-S120.md
        ├── KN7-04-glava-2-1-Odin-yazyk-raznye-plemena-S120.md
        ├── KN7-05-glava-2-2-Perevodchik-kotorogo-nikto-ne-zval-S120.md  # вставка уровня 2 (v S120 embedded)
        ├── KN7-06-glava-3-1-Soglasilis-S120.md
        ├── KN7-06a-INTERMEDIYA-Zanzibar-v10-S144.md    # NEW cont +12: инсерт per S151 mandate
        ├── KN7-07-glava-3-2-Sporyat-ob-odnom-S120.md
        ├── KN7-08-glava-3-3-Obshchiy-yazyk-kak-oruzhie-Bangkok-S120.md
        ├── KN7-09-glava-3-4-Gotovaya-korobka-S120.md
        ├── KN7-10-uroven4-Dno-chelovek-mashina-S120.md
        ├── KN7-11-VYHOD-Raspahnutaya-dver-S120.md
        ├── KN7-12-prilozhenie-k-urovnyu-3-S120.md
        ├── KN7-13-prilozhenie-k-dnu-uroven4-S120.md
        └── KN7-14-prilozhenie-filosofiya-dialoga-S120.md
```

## Assembly instructions

Per Ивин `README-SBORKA-KN7-MASTER-S120.md`:

```bash
cd content/kn7/ru/parts/
cat KN7-00-*.md KN7-01-*.md KN7-02-*.md KN7-03-*.md KN7-04-*.md \
    KN7-05-*.md KN7-06-*.md KN7-06a-*.md KN7-07-*.md KN7-08-*.md \
    KN7-09-*.md KN7-10-*.md KN7-11-*.md KN7-12-*.md KN7-13-*.md \
    KN7-14-*.md > /tmp/KN7-corpus-sobran.md
```

(cascade cont +12: adds KN7-06a between 06 «Согласились» и 07 «Спорят об одном» per Занзибар v10 якорь S144 «уровень 3, после гл.3.1, перед 3.2»)

## Assembly audit — cont +12 (2026-07-02)

**Ивин S151 mandate → git assembly:**

| Компонент | Источник (Drive ID) | Место в корпусе |
|-----------|---------------------|-----------------|
| Master S120 (15 частей) | zip `11iE1xCS6SeGUfu33aQwix_SJv83xw9pT` | parts KN7-00…14 (base corpus) |
| «Переводчик которого никто не звал» уровень 2 | embedded в master part 05 (S120 версия) | KN7-05-*.md |
| «Занзибар» v10 (S144) | md `1ryYCFpnS69ZXE8bhhNZShMfxuP0v6Q46` | NEW KN7-06a-*.md (между 06 и 07) |

**Total volume:** ~217,690 bytes корпуса S120 + ~13,000 bytes интермедии = **~230 KB total**.

## Publishing gates status

- ✅ Мастер S120 корпус в git (cont +12 assembly complete)
- ✅ Занзибар v10 (S144) интермедия inserted
- ✅ «Переводчик» уровень 2 (S120 embedded) present
- ⚠️ S142 markup для «Переводчик» — Ивин mandate wording ambiguous; v S120 версия используется как canonical. **Clarification requested в KVITANCIYA S151.**
- ⏳ ЩИТ v5.0 прогон Иви (ПОСЛЕ кн.3 close-out — RU-фронт кн.3 currently в этап 2 blocked pending body upload от Иви)
- ⏳ Publication + соцпак (BLOCKED until Ивин ЩИТ v5.0 PASS)

## Cross-references

- Иви canon: `КАРТА-Иви-S151-v2` (Drive `1aSGKHSoe05Lf4yEPy5p_y9GTuUz3a3Oe`)
- MAYAK S151 4 verdicta: Drive `1jQxQwe8FPF4ekM46znkGfZJnD7b9iJvf`
- Master S120 mirror READ-ONLY: Drive `1wlGAlk775Rtf5QzjKsL9MBn-McE-O61x`
- STUB _index для portal: Drive `1jgPwRU4U_2WdOVbnpj8A4dfbDGxjgztt` (Ивин prepared)
- Portal repo README: root `README.md`
