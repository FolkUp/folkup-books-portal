<script setup lang="ts">
/**
 * Shared BookPage component — используется каждой per-book page (kn1-kn7).
 * Renders book landing с cover + description + status + Schema.org markup.
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useSeriesData } from '../composables/useSeriesData'
import { useBookSchema } from '../composables/useSchemaOrg'

const props = defineProps<{
  slug: string
}>()

const { t } = useI18n()
const { series, bookBySlug } = useSeriesData()

const book = computed(() => bookBySlug(props.slug))
const title = computed(() => t(`books.${props.slug}.title`))
const subtitle = computed(() => t(`books.${props.slug}.subtitle`))

const isLive = computed(() => book.value?.status === 'live')
const isPause = computed(() => book.value?.status === 'variant_b_pause')

const SITE_URL = 'https://books.folkup.life'

// Per-book og:image (absolute URL, overrides App.vue default)
const bookOgImage = computed(() => {
  const coverPath = book.value?.cover_v1 || '/covers/cover_kn1.svg'
  return coverPath.startsWith('http') ? coverPath : `${SITE_URL}${coverPath}`
})

useHead({
  title: () => title.value + ' — ' + t('brand.name'),
  meta: [
    { name: 'description', content: () => subtitle.value },
    { property: 'og:title', content: () => title.value },
    { property: 'og:description', content: () => subtitle.value },
    { property: 'og:type', content: 'book' },
    { property: 'og:image', content: () => bookOgImage.value },
    // Twitter Card override (per-book image)
    { name: 'twitter:title', content: () => title.value },
    { name: 'twitter:description', content: () => subtitle.value },
    { name: 'twitter:image', content: () => bookOgImage.value },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://books.folkup.life/${props.slug}/`,
    },
  ],
})

// Book Schema.org markup
if (book.value) {
  useBookSchema(book.value, series.value, title.value)
}
</script>

<template>
  <div v-if="book" class="book-page">
    <div class="book-page__layout">
      <aside class="book-page__cover">
        <img
          v-if="book.cover_v1"
          :src="book.cover_v1"
          :alt="`Обложка книги ${title}`"
          width="360"
          height="540"
          loading="eager"
        />
      </aside>

      <article class="book-page__content">
        <p class="book-page__series">
          <RouterLink to="/">{{ t('brand.name') }}</RouterLink>
          &middot; Серия «{{ series.name }}» &middot; Книга {{ book.position }}
        </p>

        <h1 class="book-page__title">{{ title }}</h1>
        <p class="book-page__subtitle">{{ subtitle }}</p>

        <div v-if="isLive" class="book-page__actions">
          <a
            v-if="book.downloads?.epub"
            :href="book.downloads.epub"
            class="book-page__button"
            download
          >
            {{ t('portal.read_book') }} (EPUB)
          </a>
          <a
            v-if="book.downloads?.pdf"
            :href="book.downloads.pdf"
            class="book-page__button"
            download
          >
            PDF
          </a>
        </div>

        <div
          v-if="isLive && book.format_stale_note"
          class="book-page__format-stale"
          role="note"
          aria-label="Пометка о форматах на реставрации"
        >
          <strong>Форматы на реставрации.</strong>
          <p>{{ book.format_stale_note }}</p>
        </div>

        <div v-else-if="isPause" class="book-page__notice">
          <strong>{{ t('portal.in_pause') }}.</strong>
          <p>{{ subtitle }}</p>
        </div>

        <div v-else class="book-page__notice">
          <strong>{{ t('portal.coming_soon') }}</strong>
          <p v-if="book.launch_date_target || book.launch_target">
            Ожидаем: {{ book.launch_date_target || book.launch_target }}
          </p>
        </div>

        <footer class="book-page__meta">
          <p>
            <strong>Автор:</strong> Comandante FolkUp
          </p>
          <p>
            <strong>©</strong> {{ series.author }} ·
            <a :href="series.license_url">{{ series.license }}</a>
          </p>
          <p v-if="book.illustration_style">
            <strong>Стиль иллюстраций:</strong> {{ book.illustration_style }}
          </p>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped>
.book-page {
  padding: var(--spacing-xl) 0;
}

.book-page__layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
}

@media (max-width: 768px) {
  .book-page__layout {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
}

.book-page__cover {
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.book-page__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-page__series {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.book-page__title {
  margin-bottom: var(--spacing-sm);
}

.book-page__subtitle {
  font-size: var(--fs-lg);
  font-style: italic;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
}

.book-page__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.book-page__format-stale {
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  background: var(--color-ivory, #FEFCF6);
  border: 1px solid var(--color-amber, #E8AD4A);
  border-left: 4px solid var(--color-amber, #E8AD4A);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text, #2b2b2b);
}

.book-page__format-stale strong {
  color: var(--color-bordeaux, #7D4450);
  display: block;
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.02em;
}

.book-page__format-stale p {
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

.book-page__button {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
  color: var(--color-ivory);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 500;
  transition: background var(--transition-fast);
}

.book-page__button:hover {
  background: var(--color-bordeaux);
  color: var(--color-ivory);
}

.book-page__notice {
  padding: var(--spacing-md);
  background: var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xl);
}

.book-page__meta {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.book-page__meta p {
  margin-bottom: var(--spacing-xs);
}
</style>
