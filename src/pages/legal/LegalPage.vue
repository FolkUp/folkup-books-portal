<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

// Shared component for 4 legal pages (privacy / terms / cookies / imprint).
// pageKey resolved from route meta.pageKey per router config.
// Content = i18n keys `legal.<pageKey>.content` (array of HTML strings, rendered via v-html).
// Content controlled by us (i18n JSON), no XSS risk from user input.

const { t, tm } = useI18n()
const route = useRoute()

const SITE_URL = 'https://books.folkup.life'

const pageKey = computed<string>(() => (route.meta.pageKey as string) || 'privacy')

// TICKET 9 P1 (S8SCOOP cont+0): dynamic canonical + hreflang alt EN per route.meta.lang.
// S295KONSOL cont+6 SEO extension 2026-08-24: 4-lang parity per Iskra KANON S301-08 LOCALE-DEFAULTS
// (portal keeps RU root + EN/PT/DE prefixed). All 4 hreflang cross-refs + og:locale reactive.
// PT audience discoverability via search engines найти /pt/{pageKey} instead of /en (Google
// hreflang cross-ref connects language variants properly).
const currentLang = computed<string>(() => (route.meta.lang as string) || 'ru')
const ruUrl = computed(() => `${SITE_URL}/${pageKey.value}/`)
const enUrl = computed(() => `${SITE_URL}/en/${pageKey.value}/`)
const ptUrl = computed(() => `${SITE_URL}/pt/${pageKey.value}/`)
const deUrl = computed(() => `${SITE_URL}/de/${pageKey.value}/`)
const currentUrl = computed(() => {
  switch (currentLang.value) {
    case 'en': return enUrl.value
    case 'pt': return ptUrl.value
    case 'de': return deUrl.value
    default: return ruUrl.value
  }
})
const OG_LOCALES: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  pt: 'pt_PT',
  de: 'de_DE',
}
const ogLocale = computed(() => OG_LOCALES[currentLang.value] ?? 'ru_RU')

const paragraphs = computed<string[]>(() => {
  const raw = tm(`legal.${pageKey.value}.content`) as unknown
  return Array.isArray(raw) ? (raw as string[]) : []
})

const pageTitle = computed(() => t(`legal.${pageKey.value}.title`))
const metaDescription = computed(() => t(`legal.${pageKey.value}.meta_description`))
const lastUpdatedLabel = computed(() => t('legal.last_updated_label'))
const lastUpdatedDate = computed(() => t('legal.last_updated_date'))

useHead({
  title: () => `${pageTitle.value} — ${t('brand.name')}`,
  meta: [
    { name: 'description', content: () => metaDescription.value },
    { property: 'og:title', content: () => pageTitle.value },
    { property: 'og:description', content: () => metaDescription.value },
    { property: 'og:url', content: () => currentUrl.value },
    { property: 'og:locale', content: () => ogLocale.value },
  ],
  link: [
    { rel: 'canonical', href: () => currentUrl.value },
    { rel: 'alternate', hreflang: 'ru', href: () => ruUrl.value },
    { rel: 'alternate', hreflang: 'en', href: () => enUrl.value },
    { rel: 'alternate', hreflang: 'pt', href: () => ptUrl.value },
    { rel: 'alternate', hreflang: 'de', href: () => deUrl.value },
    { rel: 'alternate', hreflang: 'x-default', href: () => ruUrl.value },
  ],
})
</script>

<template>
  <article class="legal-page">
    <header class="legal-page__header">
      <h1>{{ pageTitle }}</h1>
      <p class="legal-page__updated">
        <em>{{ lastUpdatedLabel }} {{ lastUpdatedDate }}</em>
      </p>
    </header>

    <div class="legal-page__body">
      <div
        v-for="(block, idx) in paragraphs"
        :key="idx"
        class="legal-page__block"
        v-html="block"
      />
    </div>
  </article>
</template>

<style scoped>
.legal-page {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  font-family: var(--font-body, Georgia, serif);
  color: var(--color-text);
  line-height: 1.65;
}

.legal-page__header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.legal-page__header h1 {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-sm);
  line-height: 1.2;
}

.legal-page__updated {
  color: var(--color-text-muted);
  font-size: var(--fs-sm, 0.875rem);
  margin: 0;
}

.legal-page__body :deep(h2) {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 1.375rem;
  color: var(--color-primary);
  margin: var(--spacing-xl) 0 var(--spacing-sm);
  line-height: 1.3;
}

.legal-page__body :deep(p) {
  margin: 0 0 var(--spacing-md);
}

.legal-page__body :deep(ul) {
  margin: 0 0 var(--spacing-md);
  padding-left: 1.5em;
}

.legal-page__body :deep(li) {
  margin-bottom: var(--spacing-xs);
}

.legal-page__body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.legal-page__body :deep(a:hover) {
  text-decoration-thickness: 2px;
}

.legal-page__body :deep(code) {
  font-family: 'Fira Code', 'Consolas', monospace;
  background: var(--color-bg-alt, #f4f0e8);
  padding: 0.1em 0.35em;
  border-radius: 3px;
  font-size: 0.9em;
}

.legal-page__body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-md) 0;
  font-size: var(--fs-sm, 0.875rem);
}

.legal-page__body :deep(thead) {
  background: var(--color-bg-alt, #f4f0e8);
}

.legal-page__body :deep(th),
.legal-page__body :deep(td) {
  padding: var(--spacing-sm);
  text-align: left;
  border: 1px solid var(--color-border);
  vertical-align: top;
}

.legal-page__body :deep(th) {
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .legal-page__body :deep(table) {
    display: block;
    overflow-x: auto;
  }
}
</style>
