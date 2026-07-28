<!-- precommit:allow-ai-mentions -->
# folkup-books-portal

**Domain:** `books.folkup.life`
**Purpose:** Единый portal для 7-book Agile Sapiens series
**Stack:** Vue 3 + Vite + vite-ssg + asciidoctor.js + vue-i18n + style-dictionary
**License:** Dual — MIT (code) + CC BY-SA 4.0 (content). Full text: [`LICENSE`](LICENSE) (MIT) + [`LICENSE-CONTENT`](LICENSE-CONTENT) (CC BY-SA 4.0). Directory-to-license mapping under `## Licensing` section below. Copyright infringement reporting: [`DMCA.md`](DMCA.md).

## Licensing

Materials are dual-licensed by class:

**MIT License (`LICENSE`) — code + technical infrastructure:**

- `src/**` — Vue 3 components, composables, routing, i18n loader
- `scripts/**` — build scripts, generators, deployment tooling
- `astro.config.*`, `vite.config.*`, `package.json`, `tsconfig.json`, config files
- `.github/**` — CI/CD workflows

**Creative Commons Attribution-ShareAlike 4.0 International (`LICENSE-CONTENT`) — content:**

- `content/kn*/**` — book chapters (kn.1-kn.7 series), MASTER.md, editorial text
- `public/kn*/downloads/**` — per-book EPUB and PDF compiled formats
- `public/covers/**` + `public/images/kn*-chapters/**` — cover art, chapter plates
- `translations/**` — translated versions (translators as FolkUp entities)

**Third-party dependencies** — retain original licenses. See `package.json`.

**Attribution format:**

> «Book Chapter Title» by Команданте FolkUp, licensed under CC BY-SA 4.0.
> Source: https://github.com/FolkUp/folkup-books-portal/blob/main/content/<path>
> Modifications: [describe if any].

**Copyright infringement reporting:** see [`DMCA.md`](DMCA.md).

## Aligned decisions (cont +39 S26AGIL)

- **Tech stack** = Vue 3 + Vite + vite-ssg per Андрей verdict 2026-07-02 + CLDESIGN-007 target framework
- **Migration model** = кн.1 mirror + 301 redirect from sapiens.folkup.life (Андрей Q8=В cont +39)
- **Timing** = кн.5 launch + migration параллельно 04-05 июля 2026
- **Кн.7** = Variant B жёсткий (не релизится до сигнала Андрея; stub «В паузе» ~150 слов)
- **Indexation** = всё published indexed; noindex только preview branches (Андрей mandate 2026-07-02)
- **Owners** = Johnny (frontend, per panel gap audit) + Кочегар (deploy) + Гутенберг (content pipeline) + Дьюи (SEO) + Фрида (illustrations) + Фонарщик (design tokens)

## Repo structure

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
├── public/
│   ├── robots.txt                        # AI bot policy per Q11
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

## Development

```bash
# Install
npm install
npx playwright install --with-deps chromium

# Dev server
npm run dev

# Type check
npm run type-check

# Unit tests
npm run test:unit

# E2E + visual + a11y
npm run test:e2e

# Build (vite-ssg static generation)
npm run build

# Preview built site
npm run preview
```

## Deploy

Push к `main` → GH Actions → Cloudflare Pages (`books-folkup-life` project). Post-deploy smoke test verifies 200 responses.

## Content pipeline (Иви .adoc → LIVE)

```
Иви .adoc (Drive)  →  Гутенберг conversion  →  content/knN/  →
   asciidoctor.js build-time  →  Vue components  →  vite-ssg build  →  CF Pages
```

## Cross-references

- CLDESIGN-007 (BACKLOG:10618) — target framework validation
- SITE-LONGREADS-001 (BACKLOG:19099) — Иви S52 mandate original
- Kочегар + Дьюи panel verdict: `vault/memory/kochegar-dewey-portal-verdict-2026-07-01.md`
- Stack documentation: `vault/memory/publishing-stack-documentation-2026-07-02.md`
- Panel gap audit: `vault/memory/panel-fornit-gap-audit-vue-publishing-2026-07-02.md`
- КиберГонзо industry research: `vault/memory/kibergonzo-book-portal-industry-research-2026-07-01.md`
- Illustrations registry: `vault/memory/illustrations-registry-canonical.md`
- Publishing pipeline roadmap: `vault/memory/publishing-pipeline-program-roadmap-2026-06-28.md`
