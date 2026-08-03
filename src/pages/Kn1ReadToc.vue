<script setup lang="ts">
/**
 * kn.1 reader TOC page (/kn1/read).
 * Lists all chapters по canonical order (preface → chapters → intermezzi → afterword → apparatus).
 * Origin: reader restoration cont+30 S3SCOOP.
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useKn1Chapters } from '../composables/useKn1Chapters'
import { useSeriesData } from '../composables/useSeriesData'

const chapters = useKn1Chapters()
const { bookBySlug } = useSeriesData()

// P0 fix cont+46: было hardcoded v1.0.15 → 301 к /kn1/ = «читать не работает» per Iskra S252 ESKALACIYA
// LESSON-CONT44-1 recurring: derive URLs из series.yaml source-of-truth, self-adapt при version bumps
const kn1 = computed(() => bookBySlug('kn1'))
const epubHref = computed(() => kn1.value?.downloads?.epub ?? '/kn1')
const pdfHref = computed(() => kn1.value?.downloads?.pdf ?? '/kn1')

const SITE_URL = 'https://books.folkup.life'

useHead({
  title: 'Читать онлайн — Agile Sapiens — Библиотека FolkUp',
  meta: [
    {
      name: 'description',
      content:
        'Оглавление книги «Agile Sapiens». Читать бесплатно онлайн — все главы, интермедии, аппарат.',
    },
    { property: 'og:title', content: 'Читать онлайн — Agile Sapiens' },
    { property: 'og:type', content: 'book' },
    { property: 'og:url', content: `${SITE_URL}/kn1/read/` },
    {
      property: 'og:description',
      content: 'Оглавление книги — читать онлайн бесплатно.',
    },
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/kn1/read/` }],
})

interface TocSection {
  title: string
  entries: typeof chapters.value
}

const sections = computed<TocSection[]>(() => {
  const body = chapters.value.filter((c) => !c.isApparatus)
  const apparatus = chapters.value.filter((c) => c.isApparatus)
  return [
    { title: 'Основной текст', entries: body },
    { title: 'Аппарат', entries: apparatus },
  ]
})
</script>

<template>
  <main class="reader-toc">
    <nav class="reader-toc__breadcrumb" aria-label="Хлебные крошки">
      <RouterLink to="/">Библиотека</RouterLink>
      <span>›</span>
      <RouterLink to="/kn1">Agile Sapiens</RouterLink>
      <span>›</span>
      <span aria-current="page">Читать онлайн</span>
    </nav>

    <header class="reader-toc__header">
      <h1>Agile Sapiens</h1>
      <p class="reader-toc__subtitle">Литературный анализ бизнеса</p>
      <p class="reader-toc__hint">
        Читать онлайн бесплатно. Тексты доступны также в форматах
        <a :href="epubHref" download>EPUB</a>
        и
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
          <RouterLink :to="`/kn1/read/${entry.slug}`" class="reader-toc__link">
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
