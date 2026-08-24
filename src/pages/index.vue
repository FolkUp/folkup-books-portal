<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSeriesData } from '../composables/useSeriesData'
import { useBookSeriesSchema } from '../composables/useSchemaOrg'
import BookCard from '../components/BookCard.vue'

const { t, te } = useI18n()
const route = useRoute()
const { series, books, booksByTrilogy } = useSeriesData()

// TIKET-31 PORTAL-UI-LANG-DECOUPLE-1 (Iskra POMETKA-11 S299-11 GO cont+7 S8SCOOP 2026-08-24):
// per-locale canonical + hreflang alternates for all 4 langs (RU + EN + PT + DE).
// Extended from EN-HOME-1 (Iskra ADDENDUM-1 S297-07 cont+7 EN-only) per §S299-05 canon.
const HOME_RU = 'https://books.folkup.life/'
const HOME_EN = 'https://books.folkup.life/en/'
const HOME_PT = 'https://books.folkup.life/pt/'
const HOME_DE = 'https://books.folkup.life/de/'
const canonicalHref = () => {
  const lang = route.meta.lang
  if (lang === 'en') return HOME_EN
  if (lang === 'pt') return HOME_PT
  if (lang === 'de') return HOME_DE
  return HOME_RU
}

useHead({
  title: () => t('portal.title'),
  meta: [
    { name: 'description', content: () => t('portal.hero') },
    { property: 'og:title', content: () => t('portal.title') },
    { property: 'og:description', content: () => t('portal.hero') },
  ],
  link: [
    { rel: 'canonical', href: canonicalHref },
    { rel: 'alternate', hreflang: 'ru', href: HOME_RU },
    { rel: 'alternate', hreflang: 'en', href: HOME_EN },
    { rel: 'alternate', hreflang: 'pt', href: HOME_PT },
    { rel: 'alternate', hreflang: 'de', href: HOME_DE },
    { rel: 'alternate', hreflang: 'x-default', href: HOME_RU },
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
      <p class="hero__ornament" aria-hidden="true">◆</p>
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

.hero h1 {
  font-size: clamp(2.25rem, 4vw + 1rem, 3.5rem);
}

.hero__lead {
  font-size: var(--fs-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.hero__ornament {
  color: var(--color-accent);
  font-size: 1.25rem;
  letter-spacing: 0.5em;
  margin: var(--spacing-md) 0;
  text-align: center;
  line-height: 1;
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
  gap: clamp(1rem, 2vw + 0.5rem, 2.5rem);
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
