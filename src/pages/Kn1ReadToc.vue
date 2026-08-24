<script setup lang="ts">
/**
 * kn.1 reader TOC page (lang-aware).
 * Routes: /kn1/read (RU canonical, no lang segment) + /kn1/en/read + /kn1/pt/read.
 * Lists all chapters по canonical order (preface → chapters → intermezzi → afterword → apparatus).
 *
 * Origin: reader restoration cont+30 S3SCOOP (RU-only).
 * READER-UNIFY-1 cont+16: chapter reader parametrized (Kn1ReadChapter.vue).
 * NAV-1 Ступень 2 cont+21 S1PT: TOC lang-aware (this file) + reverts Ступень 1 hardcoding
 *   в Kn1ReadChapter.vue L82-83 (per Iskra POMETKA-10 §B acceptance criteria).
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useKn1ChaptersLang } from '../composables/useKn1Chapters'
import { useSeriesData } from '../composables/useSeriesData'
import { useLangUrl } from '../composables/useLangUrl'

const route = useRoute()
const { langUrl } = useLangUrl()

type Lang = 'ru' | 'pt' | 'en'
const SUPPORTED_LANGS: Lang[] = ['ru', 'pt', 'en']
const lang = computed<Lang>(() => {
  const metaLang = route.meta.lang
  if (typeof metaLang === 'string' && SUPPORTED_LANGS.includes(metaLang as Lang)) {
    return metaLang as Lang
  }
  return 'ru'
})

const chapters = computed(() => useKn1ChaptersLang(lang.value).value)
const { bookBySlug } = useSeriesData()

const kn1 = computed(() => bookBySlug('kn1'))
// Per-locale downloads resolve per Iskra KANON-VOROTA S289-07 LIVE-GATE-EN-1 G2:
// `book.downloads?.[locale]?.epub` → per-locale nested (EN v1.0.0), fallback к
// `book.downloads?.epub` (RU top-level). Mirror BookPage.vue localeDownloads pattern.
const epubHref = computed(
  () => kn1.value?.downloads?.[lang.value]?.epub ?? kn1.value?.downloads?.epub ?? '/kn1',
)
const pdfHref = computed(
  () => kn1.value?.downloads?.[lang.value]?.pdf ?? kn1.value?.downloads?.pdf ?? '/kn1',
)

const SITE_URL = 'https://books.folkup.life'

// URL path segment (RU has no lang segment, PT/EN do — matches Kn1ReadChapter.vue pattern).
const langSegment = computed(() => (lang.value === 'ru' ? '' : `/${lang.value}`))
const tocPath = computed(() => `/kn1${langSegment.value}/read/`)

// Localized TOC labels + chapter URL builder.
const TOC_LABELS: Record<Lang, {
  title: string
  subtitle: string
  hint: string
  hintDownloads: (formats: string) => string
  breadcrumbLibrary: string
  breadcrumbBook: string
  breadcrumbCurrent: string
  sectionBody: string
  sectionApparatus: string
  metaTitle: string
  metaDesc: string
  ogTitle: string
  ogDesc: string
}> = {
  ru: {
    title: 'Agile Sapiens',
    subtitle: 'Литературный анализ бизнеса',
    hint: 'Читать онлайн бесплатно. Тексты доступны также в форматах',
    hintDownloads: (formats) => formats,
    breadcrumbLibrary: 'Библиотека',
    breadcrumbBook: 'Agile Sapiens',
    breadcrumbCurrent: 'Читать онлайн',
    sectionBody: 'Основной текст',
    sectionApparatus: 'Аппарат',
    metaTitle: 'Читать онлайн — Agile Sapiens — Библиотека FolkUp',
    metaDesc: 'Оглавление книги «Agile Sapiens». Читать бесплатно онлайн — все главы, интермедии, аппарат.',
    ogTitle: 'Читать онлайн — Agile Sapiens',
    ogDesc: 'Оглавление книги — читать онлайн бесплатно.',
  },
  pt: {
    title: 'Agile Sapiens',
    subtitle: 'Análise literária de negócios',
    hint: 'Ler online gratuitamente. Textos também disponíveis nos formatos',
    hintDownloads: (formats) => formats,
    breadcrumbLibrary: 'Biblioteca',
    breadcrumbBook: 'Agile Sapiens',
    breadcrumbCurrent: 'Ler online',
    sectionBody: 'Texto principal',
    sectionApparatus: 'Aparato',
    metaTitle: 'Ler online — Agile Sapiens — Biblioteca FolkUp',
    metaDesc: 'Índice do livro «Agile Sapiens». Ler online gratuitamente — todos os capítulos, intermezzos, aparato.',
    ogTitle: 'Ler online — Agile Sapiens',
    ogDesc: 'Índice do livro — ler online gratuitamente.',
  },
  en: {
    title: 'Agile Sapiens',
    subtitle: 'A Literary Business Analysis',
    hint: 'Read online for free. Texts also available in formats',
    hintDownloads: (formats) => formats,
    breadcrumbLibrary: 'Library',
    breadcrumbBook: 'Agile Sapiens',
    breadcrumbCurrent: 'Read online',
    sectionBody: 'Main text',
    sectionApparatus: 'Apparatus',
    metaTitle: 'Read online — Agile Sapiens — FolkUp Library',
    metaDesc: 'Contents of «Agile Sapiens». Read online for free — all chapters, intermezzos, apparatus.',
    ogTitle: 'Read online — Agile Sapiens',
    ogDesc: 'Book contents — read online for free.',
  },
}
const labels = computed(() => TOC_LABELS[lang.value])

// bookHomePath — /kn1 canonical (no lang landing pages exist yet; RU landing serves as fallback).
const bookHomePath = computed(() => '/kn1')

const chapterUrl = (slug: string) => `/kn1${langSegment.value}/read/${slug}`

useHead(() => ({
  title: labels.value.metaTitle,
  htmlAttrs: { lang: lang.value },
  meta: [
    { name: 'description', content: labels.value.metaDesc },
    { property: 'og:title', content: labels.value.ogTitle },
    { property: 'og:type', content: 'book' },
    { property: 'og:url', content: `${SITE_URL}${tocPath.value}` },
    { property: 'og:description', content: labels.value.ogDesc },
    { property: 'og:locale', content: lang.value === 'ru' ? 'ru_RU' : lang.value === 'pt' ? 'pt_PT' : 'en_US' },
  ],
  link: [
    { rel: 'canonical', href: `${SITE_URL}${tocPath.value}` },
    // hreflang alternates — all lang TOC routes cross-linked (per Iskra §B pt.4 audit-hvosty).
    { rel: 'alternate', hreflang: 'ru', href: `${SITE_URL}/kn1/read/` },
    { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/kn1/en/read/` },
    { rel: 'alternate', hreflang: 'pt', href: `${SITE_URL}/kn1/pt/read/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/kn1/read/` },
  ],
}))

interface TocSection {
  title: string
  entries: typeof chapters.value
}

const sections = computed<TocSection[]>(() => {
  const body = chapters.value.filter((c) => !c.isApparatus)
  const apparatus = chapters.value.filter((c) => c.isApparatus)
  return [
    { title: labels.value.sectionBody, entries: body },
    { title: labels.value.sectionApparatus, entries: apparatus },
  ]
})
</script>

<template>
  <main class="reader-toc">
    <nav class="reader-toc__breadcrumb" :aria-label="labels.breadcrumbCurrent">
      <RouterLink :to="langUrl('/')">{{ labels.breadcrumbLibrary }}</RouterLink>
      <span>›</span>
      <RouterLink :to="bookHomePath">{{ labels.breadcrumbBook }}</RouterLink>
      <span>›</span>
      <span aria-current="page">{{ labels.breadcrumbCurrent }}</span>
    </nav>

    <header class="reader-toc__header">
      <h1>{{ labels.title }}</h1>
      <p class="reader-toc__subtitle">{{ labels.subtitle }}</p>
      <p class="reader-toc__hint">
        {{ labels.hint }}
        <a :href="epubHref" download>EPUB</a>
        {{ lang === 'ru' ? 'и' : lang === 'pt' ? 'e' : 'and' }}
        <a :href="pdfHref" download>PDF</a>.
      </p>
    </header>

    <section
      v-for="section in sections"
      :key="section.title"
      class="reader-toc__section"
    >
      <h2>{{ section.title }}</h2>
      <ol class="reader-toc__list">
        <li v-for="entry in section.entries" :key="entry.slug">
          <RouterLink :to="chapterUrl(entry.slug)" class="reader-toc__link">
            <span class="reader-toc__link-title">{{ entry.title }}</span>
            <span
              v-if="entry.description"
              class="reader-toc__link-desc"
              >{{ entry.description }}</span
            >
          </RouterLink>
        </li>
      </ol>
    </section>
  </main>
</template>

<style scoped>
.reader-toc {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: var(--color-text, #1a1a1a);
  font-family: var(--font-serif, Georgia, serif);
}

.reader-toc__breadcrumb {
  font-size: 0.9rem;
  color: var(--color-text-muted, #666);
  margin-bottom: 2rem;
}
.reader-toc__breadcrumb a {
  color: var(--color-link, #7a2e00);
  text-decoration: none;
}
.reader-toc__breadcrumb a:hover {
  text-decoration: underline;
}
.reader-toc__breadcrumb span {
  margin: 0 0.4rem;
}

.reader-toc__header {
  margin-bottom: 3rem;
}
.reader-toc__header h1 {
  font-size: 2.2rem;
  margin: 0 0 0.4rem;
  line-height: 1.2;
}
.reader-toc__subtitle {
  font-style: italic;
  color: var(--color-text-muted, #555);
  margin: 0 0 1rem;
  font-size: 1.1rem;
}
.reader-toc__hint {
  font-size: 0.95rem;
  color: var(--color-text-muted, #666);
  margin: 0;
}
.reader-toc__hint a {
  color: var(--color-link, #7a2e00);
  text-decoration: underline;
}

.reader-toc__section {
  margin-bottom: 2.5rem;
}
.reader-toc__section h2 {
  font-size: 1.3rem;
  border-bottom: 1px solid var(--color-border, #ddd);
  padding-bottom: 0.4rem;
  margin-bottom: 1rem;
}

.reader-toc__list {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 0;
}
.reader-toc__list li {
  margin-bottom: 0.8rem;
}

.reader-toc__link {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  transition: background 0.15s ease;
}
.reader-toc__link:hover {
  background: var(--color-hover, #f6f0e8);
}
.reader-toc__link-title {
  display: block;
  font-weight: 600;
  color: var(--color-link, #7a2e00);
}
.reader-toc__link-desc {
  display: block;
  font-size: 0.9rem;
  color: var(--color-text-muted, #666);
  margin-top: 0.2rem;
  font-style: italic;
}

@media (max-width: 640px) {
  .reader-toc {
    padding: 1.5rem 1rem 3rem;
  }
  .reader-toc__header h1 {
    font-size: 1.7rem;
  }
}
</style>
