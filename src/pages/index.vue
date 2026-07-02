<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useSeriesData } from '../composables/useSeriesData'
import { useBookSeriesSchema } from '../composables/useSchemaOrg'
import BookCard from '../components/BookCard.vue'

const { t } = useI18n()
const { series, books } = useSeriesData()

useHead({
  title: () => t('portal.title'),
  meta: [
    { name: 'description', content: () => t('portal.hero') },
    { property: 'og:title', content: () => t('portal.title') },
    { property: 'og:description', content: () => t('portal.hero') },
  ],
  link: [
    { rel: 'canonical', href: 'https://books.folkup.life/' },
  ],
})

// BookSeries JSON-LD Schema.org (Дьюи competitive gap fill)
useBookSeriesSchema(series.value, books.value)
</script>

<template>
  <div class="portal-home">
    <section class="hero">
      <h1>{{ t('portal.title') }}</h1>
      <p class="hero__lead">{{ t('portal.hero') }}</p>
      <p class="hero__intro">{{ t('portal.series_intro') }}</p>
    </section>

    <section class="series-grid" aria-label="Список книг серии">
      <BookCard v-for="book in books" :key="book.slug" :book="book" />
    </section>
  </div>
</template>

<style scoped>
.portal-home {
  padding: var(--spacing-xl) 0;
}

.hero {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.hero__lead {
  font-size: var(--fs-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.hero__intro {
  font-size: var(--fs-md);
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}
</style>
