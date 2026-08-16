<script setup lang="ts">
/**
 * kn.1 reader single-chapter page (/kn1/read/:slug).
 *
 * VIT-KLB cont+49 P0 fix (Кочегар root-cause):
 *   Old pattern использовал async watcher + dynamic import(marked) + async marked.parse
 *   — ни один шаг не suspend'ился vite-ssg SSR-ом. Результат: prerendered HTML прибит
 *   на <div>Загрузка…</div>, GoogleBot видит placeholder, indexing fails.
 *
 * New pattern: bodies pre-rendered at build time via scripts/kn1-reader-manifest.mjs
 *   → per-chapter ES modules content/kn1/ru/chapters-html/{slug}.js (dynamic glob).
 *   SSR: onServerPrefetch awaits body load → renderToString emits real HTML.
 *   Client: watch(slug) triggers same async loader → per-chapter chunk lazy-fetched
 *   on navigation, browser caches. Each chunk under 60 KB gzip bundle gate.
 *   Hydration: SSR-populated renderedHtml serialized через vite-ssg initialState;
 *   client picks it up на initial mount → no flash of loading, byte-match render.
 */
import { computed, onServerPrefetch, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import {
  useKn1ChapterMetaLang,
  loadKn1ChapterBodyHtmlLang,
} from '../composables/useKn1Chapters'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// READER-UNIFY-1 cont+16: lang detected from route.meta.lang OR fallback to path parsing.
// `/kn1/read/*` → 'ru' (backward compat, no lang segment, no meta.lang).
// `/kn1/pt/read/*` → 'pt' (routes.ts sets meta.lang='pt').
// `/kn1/en/read/*` → 'en' (routes.ts sets meta.lang='en').
type Lang = 'ru' | 'pt' | 'en'
const SUPPORTED_LANGS: Lang[] = ['ru', 'pt', 'en']
const lang = computed<Lang>(() => {
  const metaLang = route.meta.lang
  if (typeof metaLang === 'string' && SUPPORTED_LANGS.includes(metaLang as Lang)) {
    return metaLang as Lang
  }
  return 'ru'
})

const chapterData = computed(() => useKn1ChapterMetaLang(lang.value, slug.value))

const renderedHtml = ref<string>('')

// SSR: preload body before renderToString continues → body inlined в prerendered HTML.
onServerPrefetch(async () => {
  const html = await loadKn1ChapterBodyHtmlLang(lang.value, slug.value)
  if (html !== null) renderedHtml.value = html
})

// Client: react к route changes (SPA prev/next). On initial mount после SSR
// renderedHtml already populated from initialState — skip первый triger loading.
if (typeof window !== 'undefined') {
  let hydrated = renderedHtml.value !== ''
  watch(
    [lang, slug],
    async ([newLang, newSlug]) => {
      if (hydrated) {
        hydrated = false // skip только первый call
        return
      }
      const html = await loadKn1ChapterBodyHtmlLang(newLang, newSlug)
      renderedHtml.value = html ?? ''
    },
    { immediate: true },
  )
}

const SITE_URL = 'https://books.folkup.life'

// URL path segment (RU has no lang segment, PT/EN do).
// `langSegment` сохраняем для prev/next chapter nav — `/kn1/{lang}/read/{slug}` routes
// зарегистрированы (routes.ts L36-49) и работают для EN + PT глав.
const langSegment = computed(() => (lang.value === 'ru' ? '' : `/${lang.value}`))
// NAV-1 Ступень 1 HOTFIX (Iskra ESKALACIYA-03 P0-NAV-1 2026-08-16 · S1PT cont+20):
// bookHomePath + tocPath временно жёстко привязаны к живым RU paths для всех lang.
// Причина: `/kn1/pt` + `/kn1/en` landing и `/kn1/pt/read` + `/kn1/en/read` TOC pages
// ещё не существуют → breadcrumb + nav-toc из EN/PT глав вели на 404 (P0 direct мандат
// Андрея через Iskra: «Сломанная навигация — это баг, который надо чинить немедленно»).
// Iskra завизировала compromise: RU-оглавление из EN-главы > 404 (hreflang-эмиссию глав
// не трогать). Ступень 2 (follow-up PR): add lang-aware TOC routes + revert hardcoding.
const bookHomePath = computed(() => '/kn1')
const tocPath = computed(() => '/kn1/read')

// Localized navigation labels.
const NAV_LABELS: Record<Lang, {
  toc: string
  prev: string
  next: string
  breadcrumbLibrary: string
  breadcrumbToc: string
  notFoundTitle: string
  notFoundBody: string
  notFoundLink: string
  metaFallback: string
  metaDescFallback: string
}> = {
  ru: {
    toc: 'К оглавлению',
    prev: '← Предыдущая',
    next: 'Следующая →',
    breadcrumbLibrary: 'Библиотека',
    breadcrumbToc: 'Оглавление',
    notFoundTitle: 'Глава не найдена',
    notFoundBody: 'Проверьте адрес, или',
    notFoundLink: 'вернитесь к оглавлению',
    metaFallback: 'Читать',
    metaDescFallback: 'Читать онлайн — глава книги «Agile Sapiens».',
  },
  pt: {
    toc: 'Ao índice',
    prev: '← Anterior',
    next: 'Próximo →',
    breadcrumbLibrary: 'Biblioteca',
    breadcrumbToc: 'Índice',
    notFoundTitle: 'Capítulo não encontrado',
    notFoundBody: 'Verifique o endereço, ou',
    notFoundLink: 'volte ao índice',
    metaFallback: 'Ler',
    metaDescFallback: 'Ler online — capítulo do livro «Agile Sapiens».',
  },
  en: {
    toc: 'To contents',
    prev: '← Previous',
    next: 'Next →',
    breadcrumbLibrary: 'Library',
    breadcrumbToc: 'Contents',
    notFoundTitle: 'Chapter not found',
    notFoundBody: 'Check the address, or',
    notFoundLink: 'return to contents',
    metaFallback: 'Read',
    metaDescFallback: 'Read online — chapter of «Agile Sapiens».',
  },
}
const labels = computed(() => NAV_LABELS[lang.value])

// PT-READER-OG-LOCALE-1 (Q25) + PORTAL-P0-HREFLANG-EMIT-READER (Q23) + Schema.org
// Article inLanguage (Q22) — consolidated PR 2026-08-16 cont+18.

// BCP 47 language tags для Schema.org JSON-LD `inLanguage` field (per W3C spec).
const BCP47_MAP: Record<Lang, string> = {
  ru: 'ru-RU',
  pt: 'pt-PT',
  en: 'en-US',
}

// Open Graph locale codes (ISO 15897 style — underscore separator, per OG spec).
const OG_LOCALE_MAP: Record<Lang, string> = {
  ru: 'ru_RU',
  pt: 'pt_PT',
  en: 'en_US',
}

// URL builder per lang (RU = no lang segment, backward compat; PT/EN = lang-prefixed).
const urlFor = (l: Lang, s: string): string => {
  const seg = l === 'ru' ? '' : `/${l}`
  return `${SITE_URL}/kn1${seg}/read/${s}/`
}

// Availability check per slug: which languages have this chapter in manifest?
// Uses existing useKn1ChapterMetaLang (returns .meta=null if absent).
// Purpose: emit hreflang alternates only для langs where chapter actually exists —
// avoids linking к 404 pages, satisfies Google reciprocal hreflang requirement.
const availableLangs = computed<Lang[]>(() =>
  SUPPORTED_LANGS.filter(
    (l) => useKn1ChapterMetaLang(l, slug.value).meta !== null,
  ),
)

// Schema.org Article JSON-LD — per-chapter, per-lang.
// Emitted only when chapter meta loaded (avoids empty schema on 404).
const articleJsonLd = computed(() => {
  if (!chapterData.value.meta) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: chapterData.value.meta.title,
    description:
      chapterData.value.meta.description || chapterData.value.meta.title,
    inLanguage: BCP47_MAP[lang.value],
    url: urlFor(lang.value, slug.value),
    isPartOf: {
      '@type': 'Book',
      '@id': `${SITE_URL}/kn1/#book`,
      name: 'Agile Sapiens',
    },
    author: {
      '@type': 'Person',
      name: 'Andrei Klemenchenok',
    },
  }
})

useHead({
  title: () =>
    (chapterData.value.meta?.title || labels.value.metaFallback) +
    ' — Agile Sapiens — FolkUp',
  meta: () => [
    {
      name: 'description',
      content:
        chapterData.value.meta?.description ||
        chapterData.value.meta?.title ||
        labels.value.metaDescFallback,
    },
    {
      property: 'og:title',
      content: chapterData.value.meta?.title || labels.value.metaFallback,
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:url',
      content: urlFor(lang.value, slug.value),
    },
    // Q25 fix: per-page og:locale override wins over App.vue base.
    { property: 'og:locale', content: OG_LOCALE_MAP[lang.value] },
  ],
  link: () => [
    {
      rel: 'canonical',
      href: urlFor(lang.value, slug.value),
    },
    // Q23 hreflang emit: alternate link per available lang (checked против manifests).
    // Reciprocal per Google spec — pages linked here MUST list back to us.
    ...availableLangs.value.map((l) => ({
      rel: 'alternate',
      hreflang: l,
      href: urlFor(l, slug.value),
    })),
    // x-default → RU canonical fallback (per FolkUp mandate — RU is source-of-truth).
    // Only emit if RU variant exists (should always, but defensive).
    ...(availableLangs.value.includes('ru')
      ? [
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: urlFor('ru', slug.value),
          },
        ]
      : []),
  ],
  // Q22 Schema.org Article JSON-LD с inLanguage per lang.
  script: () =>
    articleJsonLd.value
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(articleJsonLd.value),
          },
        ]
      : [],
})
</script>

<template>
  <main class="reader-chapter">
    <nav class="reader-chapter__breadcrumb" aria-label="Хлебные крошки">
      <RouterLink to="/">{{ labels.breadcrumbLibrary }}</RouterLink>
      <span>›</span>
      <RouterLink :to="bookHomePath">Agile Sapiens</RouterLink>
      <span>›</span>
      <RouterLink :to="tocPath">{{ labels.breadcrumbToc }}</RouterLink>
      <span>›</span>
      <span aria-current="page">{{ chapterData.meta?.title }}</span>
    </nav>

    <article v-if="chapterData.meta" class="reader-chapter__body">
      <header class="reader-chapter__header">
        <p v-if="chapterData.meta.act" class="reader-chapter__act">
          {{ chapterData.meta.act }}
        </p>
        <h1>{{ chapterData.meta.title }}</h1>
        <p
          v-if="chapterData.meta.description"
          class="reader-chapter__description"
        >
          {{ chapterData.meta.description }}
        </p>
      </header>

      <!-- READER-NAV-1 cont+14: top nav mirror bottom nav (compact — labels only) -->
      <nav
        class="reader-chapter__nav reader-chapter__nav--top"
        aria-label="Навигация по главам (верх)"
      >
        <RouterLink
          v-if="chapterData.prev"
          :to="`/kn1${langSegment}/read/${chapterData.prev.slug}`"
          class="reader-chapter__nav-link reader-chapter__nav-prev"
        >{{ labels.prev }}</RouterLink>
        <RouterLink :to="tocPath" class="reader-chapter__nav-link reader-chapter__nav-toc">
          {{ labels.toc }}
        </RouterLink>
        <RouterLink
          v-if="chapterData.next"
          :to="`/kn1${langSegment}/read/${chapterData.next.slug}`"
          class="reader-chapter__nav-link reader-chapter__nav-next"
        >{{ labels.next }}</RouterLink>
      </nav>

      <!-- v-html: контент из trusted source (Iskra canonical body) pre-rendered by marked
           at build time (см. scripts/kn1-reader-manifest.mjs). Sync render — SSR-safe. -->
      <div class="reader-chapter__content" v-html="renderedHtml"></div>

      <nav class="reader-chapter__nav" aria-label="Навигация по главам">
        <RouterLink
          v-if="chapterData.prev"
          :to="`/kn1${langSegment}/read/${chapterData.prev.slug}`"
          class="reader-chapter__nav-link reader-chapter__nav-prev"
        >
          <span class="reader-chapter__nav-label">{{ labels.prev }}</span>
          <span class="reader-chapter__nav-title">{{
            chapterData.prev.title
          }}</span>
        </RouterLink>
        <RouterLink :to="tocPath" class="reader-chapter__nav-link reader-chapter__nav-toc">
          {{ labels.toc }}
        </RouterLink>
        <RouterLink
          v-if="chapterData.next"
          :to="`/kn1${langSegment}/read/${chapterData.next.slug}`"
          class="reader-chapter__nav-link reader-chapter__nav-next"
        >
          <span class="reader-chapter__nav-label">{{ labels.next }}</span>
          <span class="reader-chapter__nav-title">{{
            chapterData.next.title
          }}</span>
        </RouterLink>
      </nav>
    </article>

    <div v-else class="reader-chapter__not-found">
      <h1>{{ labels.notFoundTitle }}</h1>
      <p>
        {{ labels.notFoundBody }}
        <RouterLink :to="tocPath">{{ labels.notFoundLink }}</RouterLink>.
      </p>
    </div>
  </main>
</template>

<style scoped>
.reader-chapter {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: var(--color-text, #1a1a1a);
  font-family: var(--font-serif, Georgia, serif);
}

.reader-chapter__breadcrumb {
  font-size: 0.9rem;
  color: var(--color-text-muted, #666);
  margin-bottom: 2rem;
}
.reader-chapter__breadcrumb a {
  color: var(--color-link, #7a2e00);
  text-decoration: none;
}
.reader-chapter__breadcrumb a:hover {
  text-decoration: underline;
}
.reader-chapter__breadcrumb span {
  margin: 0 0.4rem;
}

.reader-chapter__header {
  margin-bottom: 2rem;
  text-align: center;
}
.reader-chapter__act {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent, #a04020);
  margin: 0 0 0.5rem;
}
.reader-chapter__header h1 {
  font-size: 2rem;
  margin: 0 0 0.6rem;
  line-height: 1.3;
}
.reader-chapter__description {
  font-style: italic;
  color: var(--color-text-muted, #555);
  margin: 0 auto;
  max-width: 520px;
}

/* Body typography — оптимизировано для длинного чтения */
.reader-chapter__content {
  font-size: 1.1rem;
  line-height: 1.7;
}
.reader-chapter__content :deep(p) {
  margin: 0 0 1.2em;
  text-align: justify;
  hyphens: auto;
}
.reader-chapter__content :deep(h2) {
  font-size: 1.4rem;
  margin: 2.5em 0 1em;
  border-bottom: 1px solid var(--color-border, #e0d5c8);
  padding-bottom: 0.3em;
}
.reader-chapter__content :deep(h3) {
  font-size: 1.2rem;
  margin: 2em 0 0.8em;
}
.reader-chapter__content :deep(blockquote) {
  margin: 1.5em 0;
  padding: 0.5em 1.5em;
  border-left: 3px solid var(--color-accent, #a04020);
  font-style: italic;
  color: var(--color-text-muted, #555);
}
.reader-chapter__content :deep(em) {
  font-style: italic;
}
.reader-chapter__content :deep(strong) {
  font-weight: 600;
}
.reader-chapter__content :deep(a) {
  color: var(--color-link, #7a2e00);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.reader-chapter__content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border, #ccc);
  margin: 2em auto;
  width: 40%;
}
.reader-chapter__content :deep(ul),
.reader-chapter__content :deep(ol) {
  padding-left: 1.5em;
  margin: 0 0 1.2em;
}
.reader-chapter__content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.5em auto;
  display: block;
}

.reader-chapter__nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #ddd);
}
/* READER-NAV-1 cont+14: top nav compact variant — labels only, less vertical weight */
.reader-chapter__nav--top {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-top: 1px solid var(--color-border, #ddd);
  border-bottom: 1px solid var(--color-border, #ddd);
  font-size: 0.9rem;
}
.reader-chapter__nav--top .reader-chapter__nav-link {
  padding: 0.3rem 0.6rem;
}
.reader-chapter__nav-link {
  display: block;
  color: var(--color-link, #7a2e00);
  text-decoration: none;
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  transition: background 0.15s ease;
}
.reader-chapter__nav-link:hover {
  background: var(--color-hover, #f6f0e8);
}
.reader-chapter__nav-prev {
  text-align: left;
}
.reader-chapter__nav-next {
  text-align: right;
}
.reader-chapter__nav-toc {
  text-align: center;
  white-space: nowrap;
  align-self: center;
  font-weight: 600;
}
.reader-chapter__nav-label {
  display: block;
  font-size: 0.85rem;
  opacity: 0.7;
}
.reader-chapter__nav-title {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 0.2rem;
}

.reader-chapter__not-found {
  text-align: center;
  padding: 4rem 1rem;
}

@media (max-width: 640px) {
  .reader-chapter {
    padding: 1.5rem 1rem 3rem;
  }
  .reader-chapter__header h1 {
    font-size: 1.6rem;
  }
  .reader-chapter__nav {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
  .reader-chapter__nav-prev,
  .reader-chapter__nav-next,
  .reader-chapter__nav-toc {
    text-align: center;
  }
}
</style>
