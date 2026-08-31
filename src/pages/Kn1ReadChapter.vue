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
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import {
  useKn1ChapterMetaLang,
  loadKn1ChapterBodyHtmlLang,
} from '../composables/useKn1Chapters'
import { useLangUrl } from '../composables/useLangUrl'
import { useSeriesData } from '../composables/useSeriesData'

const { t } = useI18n()
const { series } = useSeriesData()

const route = useRoute()
const { langUrl } = useLangUrl()
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
const langSegment = computed(() => (lang.value === 'ru' ? '' : `/${lang.value}`))
// NAV-1 Ступень 2 cont+21 S1PT: reverted Ступень 1 hardcoding per Iskra POMETKA-10 §B
// pt.1 acceptance — lang-aware TOC routes /kn1/en/read + /kn1/pt/read shipped this PR.
// bookHomePath keeps '/kn1' fallback per pragmatic UX: /en/kn1 stub = LangNotReady disclosure
// (confusing since user was reading EN chapters). '/kn1' RU book page shows real content.
// Compromise until /en/kn1 promoted к real EN book page (BookPage.vue rendering EN i18n).
// tocPath lang-aware — EN/PT chapter breadcrumb points к EN/PT TOC (no more RU fallback).
const bookHomePath = computed(() => '/kn1')
const tocPath = computed(() => `/kn1${langSegment.value}/read`)

// Localized navigation labels.
const NAV_LABELS: Record<Lang, {
  toc: string
  prev: string
  next: string
  breadcrumbLibrary: string
  breadcrumbToc: string
  breadcrumbAria: string
  navChaptersTopAria: string
  navChaptersBottomAria: string
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
    breadcrumbAria: 'Хлебные крошки',
    navChaptersTopAria: 'Навигация по главам (верх)',
    navChaptersBottomAria: 'Навигация по главам',
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
    breadcrumbAria: 'Trilha de navegação',
    navChaptersTopAria: 'Navegação de capítulos (topo)',
    navChaptersBottomAria: 'Navegação de capítulos',
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
    breadcrumbAria: 'Breadcrumbs',
    navChaptersTopAria: 'Chapter navigation (top)',
    navChaptersBottomAria: 'Chapter navigation',
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
    // Iskra VERDIKT S308-02 §2 п.2 (S1DEFIX cont+3 2026-08-31):
    // Replace hardcoded juridical name с series.author (pseudonym «Команданте FolkUp»)
    // per Banksy canon — юр-имя только там, где обязано стоять (AI Act 50(4), юрстраницы,
    // non-RU editions по канону колофона). BookSeries + Book schemas already use series.author.
    author: {
      '@type': 'Person',
      name: series.value.author,
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
    <nav class="reader-chapter__breadcrumb" :aria-label="labels.breadcrumbAria">
      <RouterLink :to="langUrl('/')">{{ labels.breadcrumbLibrary }}</RouterLink>
      <span>›</span>
      <RouterLink :to="bookHomePath">Agile Sapiens</RouterLink>
      <span>›</span>
      <RouterLink :to="tocPath">{{ labels.breadcrumbToc }}</RouterLink>
      <span>›</span>
      <span aria-current="page">{{ chapterData.meta?.title }}</span>
    </nav>

    <article v-if="chapterData.meta" class="reader-chapter__body">
      <!-- Act opener plate (S311-10 §2.2 + S311-11 PARITET-IZDANIY-1 canon).
           Rendered only на первых главах каждого акта (3 out of 23 chapters kn.1):
           act I → chapter-0-pilot, act II → chapter-5-nemo, act III → chapter-8-time-machine.
           Files language-neutral, alt текст локализован. -->
      <figure
        v-if="chapterData.meta.act_opener && chapterData.meta.act"
        class="reader-chapter__act-opener"
      >
        <img
          :src="`/kn1/images/chapters/agil-act-opener-${chapterData.meta.act.split(':')[0].trim()}.webp`"
          :alt="t('book_reader.act_opener_alt', { act: chapterData.meta.act })"
          loading="lazy"
          decoding="async"
        />
      </figure>

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
        :aria-label="labels.navChaptersTopAria"
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

      <!-- Chapter plate (cont+6 wiring; 13 плит flagship shipped cont+5 EXT-3 PR #219).
           Plate URL от frontmatter `plate:` field via useKn1Chapters manifest. -->
      <figure
        v-if="chapterData.meta.plate"
        class="reader-chapter__plate"
      >
        <img
          :src="`/images/kn1-chapters/${chapterData.meta.plate}`"
          :alt="t('book_reader.illustration_alt', { title: chapterData.meta.title })"
          loading="lazy"
          decoding="async"
          width="800"
          height="1200"
        />
      </figure>

      <!-- v-html: контент из trusted source (Iskra canonical body) pre-rendered by marked
           at build time (см. scripts/kn1-reader-manifest.mjs). Sync render — SSR-safe. -->
      <div class="reader-chapter__content" v-html="renderedHtml"></div>

      <nav class="reader-chapter__nav" :aria-label="labels.navChaptersBottomAria">
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

/* Chapter plate — flagship kn.1 illustration (cont+6 wiring; 13 плит cont+5 EXT-3) */
.reader-chapter__plate {
  margin: 2rem auto 2.5rem;
  max-width: 480px;
  text-align: center;
}
.reader-chapter__plate img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
@media (max-width: 640px) {
  .reader-chapter__plate {
    max-width: 100%;
    margin: 1.5rem auto 2rem;
  }
}

/* Act opener plate — визуальный маркер начала каждого акта книги (S311-10 §2.2).
   Крупнее chapter plate — работает как section divider для читателя.
   Ratified S311-11 PARITET-IZDANIY-1 canon: файл language-neutral, alt локализован. */
.reader-chapter__act-opener {
  margin: 0 auto 2.5rem;
  max-width: 640px;
  text-align: center;
}
.reader-chapter__act-opener img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.16);
}
@media (max-width: 640px) {
  .reader-chapter__act-opener {
    max-width: 100%;
    margin: 0 auto 1.5rem;
  }
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
