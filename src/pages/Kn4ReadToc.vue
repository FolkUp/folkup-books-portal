<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useKn4Chapters } from '../composables/useKn4Chapters'

const chapters = useKn4Chapters()

const SITE_URL = 'https://books.folkup.life'

// HARDCODED-RU-STRINGS refactor S1PT cont+25: mirror Kn1 NAV_LABELS pattern.
const { locale } = useI18n()
type Lang = 'ru' | 'pt' | 'en'
const NAV_LABELS: Record<Lang, { breadcrumbLibrary: string }> = {
  ru: { breadcrumbLibrary: 'Библиотека' },
  pt: { breadcrumbLibrary: 'Biblioteca' },
  en: { breadcrumbLibrary: 'Library' },
}
const lang = computed<Lang>(() => {
  const l = locale.value
  if (l === 'pt' || l === 'en') return l
  return 'ru'
})
const labels = computed(() => NAV_LABELS[lang.value])

useHead({
  title: 'Читать онлайн — Где живёт новое — Библиотека FolkUp',
  meta: [
    {
      name: 'description',
      content:
        'Оглавление книги «Где живёт новое». Читать бесплатно онлайн — все главы, эпилог, приложение.',
    },
    { property: 'og:title', content: 'Читать онлайн — Где живёт новое' },
    { property: 'og:type', content: 'book' },
    { property: 'og:url', content: `${SITE_URL}/kn4/read/` },
  ],
  link: [{ rel: 'canonical', href: `${SITE_URL}/kn4/read/` }],
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
      <RouterLink to="/">{{ labels.breadcrumbLibrary }}</RouterLink>
      <span>›</span>
      <RouterLink to="/kn4">Где живёт новое</RouterLink>
      <span>›</span>
      <span aria-current="page">Читать онлайн</span>
    </nav>
    <header class="reader-toc__header">
      <h1>Где живёт новое</h1>
      <p class="reader-toc__subtitle">Как узнают новое там, где раньше не смотрели</p>
      <p class="reader-toc__hint">
        Читать онлайн бесплатно. Форматы EPUB и PDF готовятся.
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
          <RouterLink :to="`/kn4/read/${entry.slug}`" class="reader-toc__link">
            <span class="reader-toc__link-title">{{ entry.title }}</span>
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
@media (max-width: 640px) {
  .reader-toc {
    padding: 1.5rem 1rem 3rem;
  }
  .reader-toc__header h1 {
    font-size: 1.7rem;
  }
}
</style>
