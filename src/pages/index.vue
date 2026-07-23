<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useSeriesData } from '../composables/useSeriesData'
import { useBookSeriesSchema } from '../composables/useSchemaOrg'
import BookCard from '../components/BookCard.vue'

const { t, te } = useI18n()
const { series, books, booksByTrilogy } = useSeriesData()

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

// Iskra §3 VITRINNYY-PAKET S214: helper для i18n группы (с fallback на series.yaml).
function trilogyName(key: string): string {
  const i18nKey = `portal.trilogies.${key}.name`
  if (te(i18nKey)) return t(i18nKey)
  return series.value.trilogies?.[key as keyof typeof series.value.trilogies]?.name ?? key
}

function trilogyDescription(key: string): string {
  const i18nKey = `portal.trilogies.${key}.description`
  if (te(i18nKey)) return t(i18nKey)
  return (
    series.value.trilogies?.[key as keyof typeof series.value.trilogies]?.description ?? ''
  )
}
</script>

<template>
  <div class="portal-home">
    <section class="hero">
      <h1>{{ t('portal.title') }}</h1>
      <p class="hero__lead">{{ t('portal.hero') }}</p>
      <p class="hero__intro">{{ t('portal.series_intro') }}</p>
    </section>

    <!-- Iskra §3 VITRINNYY-PAKET S214: книги сгруппированы по трилогиям.
         Третью трилогию не помечаем «в работе» — читатель видит группу
         с одной книгой; когда выйдут остальные — группа пополнится. -->
    <section
      v-for="group in booksByTrilogy"
      :key="group.key"
      class="trilogy-group"
      :aria-labelledby="`trilogy-${group.key}-heading`"
    >
      <header class="trilogy-group__header">
        <h2 :id="`trilogy-${group.key}-heading`" class="trilogy-group__name">
          {{ trilogyName(group.key) }}
        </h2>
        <p class="trilogy-group__description">
          {{ trilogyDescription(group.key) }}
        </p>
      </header>

      <div class="series-grid" role="list">
        <BookCard v-for="book in group.books" :key="book.slug" :book="book" />
      </div>
    </section>

    <!-- Iskra §9 VITRINNYY-PAKET S214: единый адрес приёмной. -->
    <section class="feedback-block" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading" class="feedback-block__heading">
        {{ t('portal.feedback_heading') }}
      </h2>
      <p class="feedback-block__text">
        {{ t('portal.feedback_text') }}
      </p>
      <p class="feedback-block__link">
        <a
          :href="t('portal.feedback_url')"
          rel="noopener"
          target="_blank"
        >{{ t('portal.feedback_link_text') }}</a>
      </p>
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

.trilogy-group {
  margin-bottom: var(--spacing-3xl);
}

.trilogy-group__header {
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.trilogy-group__name {
  font-size: var(--fs-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.trilogy-group__description {
  font-size: var(--fs-md);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}

.feedback-block {
  max-width: 720px;
  margin: var(--spacing-3xl) auto 0;
  padding: var(--spacing-xl);
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.feedback-block__heading {
  font-size: var(--fs-lg);
  margin-bottom: var(--spacing-md);
}

.feedback-block__text {
  font-size: var(--fs-md);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-muted);
}

.feedback-block__link a {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
