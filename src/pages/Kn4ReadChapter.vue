<script setup lang="ts">
/**
 * kn.4 «Где живёт новое» reader single-chapter (/kn4/read/:slug).
 * VIT-KLB cont+51 mirror kn1 pattern: SSR-safe pre-rendered HTML via onServerPrefetch.
 */
import { computed, onServerPrefetch, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import {
  useKn4ChapterMeta,
  loadKn4ChapterBodyHtml,
} from '../composables/useKn4Chapters'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const chapterData = computed(() => useKn4ChapterMeta(slug.value))
const renderedHtml = ref<string>('')

onServerPrefetch(async () => {
  const html = await loadKn4ChapterBodyHtml(slug.value)
  if (html !== null) renderedHtml.value = html
})

if (typeof window !== 'undefined') {
  let hydrated = renderedHtml.value !== ''
  watch(
    slug,
    async (newSlug) => {
      if (hydrated) {
        hydrated = false
        return
      }
      const html = await loadKn4ChapterBodyHtml(newSlug)
      renderedHtml.value = html ?? ''
    },
    { immediate: true },
  )
}

const SITE_URL = 'https://books.folkup.life'

useHead({
  title: () =>
    (chapterData.value.meta?.title || 'Читать') +
    ' — Где живёт новое — Библиотека FolkUp',
  meta: () => [
    {
      name: 'description',
      content:
        chapterData.value.meta?.description ||
        chapterData.value.meta?.title ||
        'Читать онлайн — глава книги «Где живёт новое».',
    },
    {
      property: 'og:title',
      content: chapterData.value.meta?.title || 'Читать',
    },
    { property: 'og:type', content: 'article' },
    {
      property: 'og:url',
      content: `${SITE_URL}/kn4/read/${slug.value}/`,
    },
  ],
  link: () => [
    { rel: 'canonical', href: `${SITE_URL}/kn4/read/${slug.value}/` },
  ],
})
</script>

<template>
  <main class="reader-chapter">
    <nav class="reader-chapter__breadcrumb" aria-label="Хлебные крошки">
      <RouterLink to="/">Библиотека</RouterLink>
      <span>›</span>
      <RouterLink to="/kn4">Где живёт новое</RouterLink>
      <span>›</span>
      <RouterLink to="/kn4/read">Оглавление</RouterLink>
      <span>›</span>
      <span aria-current="page">{{ chapterData.meta?.title }}</span>
    </nav>
    <article v-if="chapterData.meta" class="reader-chapter__body">
      <header class="reader-chapter__header">
        <h1>{{ chapterData.meta.title }}</h1>
      </header>
      <!-- v-html: контент из trusted source pre-rendered by marked at build time
           (см. scripts/kn4-reader-manifest.mjs). Sync render — SSR-safe. -->
      <div class="reader-chapter__content" v-html="renderedHtml"></div>
      <nav class="reader-chapter__nav" aria-label="Навигация по главам">
        <RouterLink
          v-if="chapterData.prev"
          :to="`/kn4/read/${chapterData.prev.slug}`"
          class="reader-chapter__nav-link reader-chapter__nav-prev"
        >
          <span class="reader-chapter__nav-label">← Предыдущая</span>
          <span class="reader-chapter__nav-title">{{ chapterData.prev.title }}</span>
        </RouterLink>
        <RouterLink to="/kn4/read" class="reader-chapter__nav-link reader-chapter__nav-toc">
          К оглавлению
        </RouterLink>
        <RouterLink
          v-if="chapterData.next"
          :to="`/kn4/read/${chapterData.next.slug}`"
          class="reader-chapter__nav-link reader-chapter__nav-next"
        >
          <span class="reader-chapter__nav-label">Следующая →</span>
          <span class="reader-chapter__nav-title">{{ chapterData.next.title }}</span>
        </RouterLink>
      </nav>
    </article>
    <div v-else class="reader-chapter__not-found">
      <h1>Глава не найдена</h1>
      <p>
        Проверьте адрес, или
        <RouterLink to="/kn4/read">вернитесь к оглавлению</RouterLink>.
      </p>
    </div>
  </main>
</template>

<style scoped>
.reader-chapter { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem 4rem; color: var(--color-text, #1a1a1a); font-family: var(--font-serif, Georgia, serif); }
.reader-chapter__breadcrumb { font-size: 0.9rem; color: var(--color-text-muted, #666); margin-bottom: 2rem; }
.reader-chapter__breadcrumb a { color: var(--color-link, #7a2e00); text-decoration: none; }
.reader-chapter__breadcrumb a:hover { text-decoration: underline; }
.reader-chapter__breadcrumb span { margin: 0 0.4rem; }
.reader-chapter__header { margin-bottom: 2rem; text-align: center; }
.reader-chapter__header h1 { font-size: 2rem; margin: 0 0 0.6rem; line-height: 1.3; }
.reader-chapter__content { font-size: 1.1rem; line-height: 1.7; }
.reader-chapter__content :deep(p) { margin: 0 0 1.2em; text-align: justify; hyphens: auto; }
.reader-chapter__content :deep(h2) { font-size: 1.4rem; margin: 2.5em 0 1em; border-bottom: 1px solid var(--color-border, #e0d5c8); padding-bottom: 0.3em; }
.reader-chapter__content :deep(h3) { font-size: 1.2rem; margin: 2em 0 0.8em; }
.reader-chapter__content :deep(blockquote) { margin: 1.5em 0; padding: 0.5em 1.5em; border-left: 3px solid var(--color-accent, #a04020); font-style: italic; color: var(--color-text-muted, #555); }
.reader-chapter__content :deep(em) { font-style: italic; }
.reader-chapter__content :deep(strong) { font-weight: 600; }
.reader-chapter__content :deep(a) { color: var(--color-link, #7a2e00); text-decoration: underline; text-underline-offset: 2px; }
.reader-chapter__content :deep(hr) { border: none; border-top: 1px solid var(--color-border, #ccc); margin: 2em auto; width: 40%; }
.reader-chapter__content :deep(ul), .reader-chapter__content :deep(ol) { padding-left: 1.5em; margin: 0 0 1.2em; }
.reader-chapter__nav { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border, #ddd); }
.reader-chapter__nav-link { display: block; color: var(--color-link, #7a2e00); text-decoration: none; padding: 0.6rem 0.8rem; border-radius: 4px; transition: background 0.15s ease; }
.reader-chapter__nav-link:hover { background: var(--color-hover, #f6f0e8); }
.reader-chapter__nav-prev { text-align: left; }
.reader-chapter__nav-next { text-align: right; }
.reader-chapter__nav-toc { text-align: center; white-space: nowrap; align-self: center; font-weight: 600; }
.reader-chapter__nav-label { display: block; font-size: 0.85rem; opacity: 0.7; }
.reader-chapter__nav-title { display: block; font-size: 0.95rem; font-weight: 600; margin-top: 0.2rem; }
.reader-chapter__not-found { text-align: center; padding: 4rem 1rem; }
@media (max-width: 640px) {
  .reader-chapter { padding: 1.5rem 1rem 3rem; }
  .reader-chapter__header h1 { font-size: 1.6rem; }
  .reader-chapter__nav { grid-template-columns: 1fr; gap: 0.6rem; }
  .reader-chapter__nav-prev, .reader-chapter__nav-next, .reader-chapter__nav-toc { text-align: center; }
}
</style>
