# FolkUp Books Portal · Vue 3 SPA для Библиотеки FolkUp

[![License MIT (code)](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![License CC BY-SA 4.0 (content)](https://img.shields.io/badge/content-CC%20BY--SA%204.0-green.svg)](LICENSE-CONTENT)
[![Site](https://img.shields.io/badge/live-books.folkup.life-blue.svg)](https://books.folkup.life)

**Vue 3 + Vite + vite-ssg portal для Библиотеки FolkUp — свободные книги под CC BY-SA 4.0. Reader-facing SPA с per-book download packages (EPUB + PDF) и longform integration с [underground.folkup.life](https://underground.folkup.life).**

## About

Portal обслуживает семикнижную серию в общей нижней навигации, единой typography (Playfair Display + Vollkorn + Pacifico brand mark), unified download packages, cross-references между книгами и longform materials.

Автор — Команданте FolkUp (Команданте FolkUp is a literary pseudonym; legal identification and AI-use disclosure: [books.folkup.life/ai-disclosure](https://books.folkup.life/ai-disclosure)).

LIVE at [books.folkup.life](https://books.folkup.life). Deploy: Cloudflare Pages.

## Books в серии

- **kn.1** — Agile Sapiens (Литературный бизнес-анализ) — **LIVE**
- **kn.2** — Согласные без гласных — publishing pipeline
- **kn.3** — Город Солнца — publishing pipeline
- **kn.4** — Где живёт новое — publishing pipeline
- **kn.5** — Палимпсест Архимеда — publishing pipeline
- **kn.6** — in preparation
- **kn.7** — in preparation

## Development

```bash
npm install
npx playwright install --with-deps chromium

npm run dev            # local dev server (Vite HMR)
npm run type-check     # TypeScript strict
npm run test:unit      # Vitest unit tests
npm run test:e2e       # Playwright E2E + visual regression + a11y
npm run build          # production SSG build
npm run preview        # preview production build
```

Stack:

- **Vue 3** — Composition API, Vue Router
- **Vite** — build + HMR
- **vite-ssg** — static site generation with island hydration
- **TypeScript** — strict mode
- **Tailwind CSS v4** — utility styling
- **asciidoctor.js** — book content processing
- **vue-i18n** — RU primary + EN/DE/PT translations
- **Playwright** — visual regression + accessibility E2E
- **Vitest** — unit tests (jsdom + v8 coverage)

## Architecture

```
folkup-books-portal/
├── src/
│   ├── main.ts                          # vite-ssg entry
│   ├── App.vue                          # Root layout
│   ├── router/routes.ts                 # Static routes 7 books + home + 404
│   ├── i18n/locales/{ru,en,de,pt}.json  # Translations (RU primary)
│   ├── composables/
│   │   ├── useSeriesData.ts             # series.yaml → typed access
│   │   └── useSchemaOrg.ts              # BookSeries + Book JSON-LD
│   ├── components/BookCard.vue
│   ├── pages/{index,kn1,kn2,...,kn7,BookPage,404}.vue
│   └── styles/{tokens.css,base.css}
├── data/series.yaml                      # 7-book metadata + status per book
├── content/kn{1-7}/**                    # Book content (Markdown + AsciiDoc)
├── public/
│   ├── kn{1-7}/**                        # Per-book static assets
│   ├── robots.txt                        # AI bot policy
│   ├── llms.txt                          # LLM discoverability per llmstxt.org
│   ├── _redirects                        # CF Pages (301 explicit)
│   └── _headers                          # Content-type + security
├── tests/
│   ├── unit/                             # Vitest — composables + components
│   ├── e2e/                              # Playwright — portal-home / a11y / schema-org
│   └── visual/                           # Visual regression 3-viewport
├── vite.config.ts                        # + ssgOptions
├── vitest.config.ts                      # jsdom + v8 coverage
├── playwright.config.ts                  # mobile / tablet / desktop + a11y
├── .github/workflows/deploy.yml          # CI + CF Pages deploy
├── tsconfig.json
├── package.json
└── README.md
```

## Deploy

Push to `main` → GitHub Actions → Cloudflare Pages (`books-folkup-life` project). Post-deploy smoke test verifies 200 responses across all published book pages.

## Related projects (FolkUp Ecosystem)

- [agile-sapiens](https://github.com/FolkUp/agile-sapiens) — kn.1 monograph source repo
- [orga (underground.folkup.life)](https://github.com/FolkUp/orga) — longform research + essay platform
- [folkup-landing](https://github.com/FolkUp/folkup-landing) — FolkUp ecosystem entry point

Full ecosystem map: [folkup.app](https://folkup.app).

## Licensing

Dual-licensed following the FolkUp ecosystem canon:

- **Code (Vue 3 components, composables, scripts, config, workflows)** — MIT.
  See [`LICENSE`](./LICENSE).
- **Content (book chapters, per-book downloads, cover art, translations)** —
  Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
  See [`LICENSE-CONTENT`](./LICENSE-CONTENT).

Attribution format for CC BY-SA content:

> «Book Chapter Title» by Команданте FolkUp, licensed under CC BY-SA 4.0.
> Source: https://github.com/FolkUp/folkup-books-portal/blob/main/content/<path>
> Modifications: [describe if any].

Copyright infringement notices → [`DMCA.md`](./DMCA.md) (GitHub referral +
direct contact `info@folkup.app`, subject: DMCA).

## Contributing

Pull requests welcomed. Content edits and code contributions: DCO Signed-off-by required. See `CONTRIBUTING.md` when opening the repository.

## Contact

- Editorial / content: `info@folkup.app`
- DMCA / copyright: `info@folkup.app` (subject: DMCA) — see [`DMCA.md`](./DMCA.md)
- Publisher: Команданте FolkUp / FolkUp Ecosystem

---

**© 2026 Команданте FolkUp · Publisher: FolkUp Ecosystem · Content CC BY-SA 4.0 · Code MIT**
