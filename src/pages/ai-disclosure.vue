<script setup lang="ts">
/**
 * /ai-disclosure — EU AI Act Art. 50(4) compliance page.
 * Canon: Лев T-LEV-IMPRESSUM verdikт cont+29 B4 + Q4a compromise verdict cont+32
 * (Andrei A choice — legal name only here, псевдоним «Команданте FolkUp» везде остальном).
 *
 * Discloses:
 * - Legal name Andrei Klemenchenok (natural person editorial responsibility per AI Act 50(4)(b))
 * - AI tools used в production pipeline
 * - Human editorial oversight gates
 * - License CC BY-SA 4.0
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const SITE_URL = 'https://books.folkup.life'

// TICKET 9 P1 (S8SCOOP cont+0): dynamic canonical + hreflang alt EN per route.meta.lang.
// S295KONSOL cont+6 SEO extension 2026-08-24: 4-lang parity per Iskra KANON S301-08 LOCALE-DEFAULTS.
// PT audience discoverability — Google finds /pt/ai-disclosure via hreflang cross-ref.
const currentLang = computed<string>(() => (route.meta.lang as string) || 'ru')
const ruUrl = `${SITE_URL}/ai-disclosure/`
const enUrl = `${SITE_URL}/en/ai-disclosure/`
const ptUrl = `${SITE_URL}/pt/ai-disclosure/`
const deUrl = `${SITE_URL}/de/ai-disclosure/`
const currentUrl = computed(() => {
  switch (currentLang.value) {
    case 'en': return enUrl
    case 'pt': return ptUrl
    case 'de': return deUrl
    default: return ruUrl
  }
})
const OG_LOCALES: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  pt: 'pt_PT',
  de: 'de_DE',
}
const ogLocale = computed(() => OG_LOCALES[currentLang.value] ?? 'ru_RU')

useHead({
  title: () => t('ai_disclosure.title') + ' — ' + t('brand.name'),
  meta: [
    { name: 'description', content: () => t('ai_disclosure.meta_description') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: () => t('ai_disclosure.title') },
    { property: 'og:description', content: () => t('ai_disclosure.meta_description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: () => currentUrl.value },
    { property: 'og:locale', content: () => ogLocale.value },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: () => t('ai_disclosure.title') },
    { name: 'twitter:description', content: () => t('ai_disclosure.meta_description') },
  ],
  link: [
    { rel: 'canonical', href: () => currentUrl.value },
    { rel: 'alternate', hreflang: 'ru', href: ruUrl },
    { rel: 'alternate', hreflang: 'en', href: enUrl },
    { rel: 'alternate', hreflang: 'pt', href: ptUrl },
    { rel: 'alternate', hreflang: 'de', href: deUrl },
    { rel: 'alternate', hreflang: 'x-default', href: ruUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${currentUrl.value}#webpage`,
          name:
            currentLang.value === 'en'
              ? 'AI Usage Disclosure — FolkUp Library'
              : 'Раскрытие использования ИИ — Библиотека FolkUp',
          url: currentUrl.value,
          description:
            'AI usage disclosure per EU AI Act Article 50(4). Legal name of natural person responsible for editorial oversight: Andrei Klemenchenok.',
          publisher: { '@id': `${SITE_URL}/#organization` },
          mainEntity: {
            '@type': 'Person',
            name: 'Andrei Klemenchenok',
            jobTitle: 'Editor / Publisher',
            worksFor: { '@id': `${SITE_URL}/#organization` },
            description:
              'Natural person responsible for editorial oversight of AI-assisted content per EU AI Act Art. 50(4)(b). Publishes under pseudonym «Команданте FolkUp».',
          },
          inLanguage: currentLang.value,
        }),
    },
  ],
})
</script>

<template>
  <div class="ai-disclosure-page">
    <article class="ai-disclosure-page__content">
      <h1>{{ t('ai_disclosure.h1') }}</h1>

      <section>
        <h2>{{ t('ai_disclosure.section1.h2') }}</h2>
        <p>{{ t('ai_disclosure.section1.p1') }}</p>
        <p>{{ t('ai_disclosure.section1.p2') }}</p>
      </section>

      <section>
        <h2>{{ t('ai_disclosure.section2.h2') }}</h2>
        <p>{{ t('ai_disclosure.section2.p1') }}</p>
        <ul>
          <li>{{ t('ai_disclosure.section2.item1') }}</li>
          <li>{{ t('ai_disclosure.section2.item2') }}</li>
          <li>{{ t('ai_disclosure.section2.item3') }}</li>
        </ul>
        <p>{{ t('ai_disclosure.section2.p2') }}</p>
        <ul>
          <li>{{ t('ai_disclosure.section2.gate1') }}</li>
          <li>{{ t('ai_disclosure.section2.gate2') }}</li>
          <li>{{ t('ai_disclosure.section2.gate3') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ t('ai_disclosure.section3.h2') }}</h2>
        <p>{{ t('ai_disclosure.section3.p1') }}</p>
        <p>{{ t('ai_disclosure.section3.p2') }}</p>
      </section>

      <section>
        <h2>{{ t('ai_disclosure.section4.h2') }}</h2>
        <p>{{ t('ai_disclosure.section4.p1') }}</p>
      </section>
    </article>
  </div>
</template>

<style scoped>
.ai-disclosure-page {
  padding: var(--spacing-xl) 0;
}

.ai-disclosure-page__content {
  max-width: 680px;
  margin: 0 auto;
}

.ai-disclosure-page__content h1 {
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.ai-disclosure-page__content h2 {
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-md);
}

.ai-disclosure-page__content p {
  margin-bottom: var(--spacing-md);
  line-height: 1.7;
}

.ai-disclosure-page__content ul {
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-lg);
}

.ai-disclosure-page__content li {
  margin-bottom: var(--spacing-xs);
  line-height: 1.7;
}
</style>
