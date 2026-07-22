<script setup lang="ts">
/**
 * /ai-disclosure — EU AI Act Art. 50(4) compliance page.
 * Canon: Лев T-LEV-IMPRESSUM verdikт cont+29 B4 + Q4a compromise verdict cont+32
 * (Andrei A choice — legal name only here, псевдоним «Команданте FolkUp» везде остальном).
 *
 * Discloses:
 * - Legal name Andrei Klemenchionok (natural person editorial responsibility per AI Act 50(4)(b))
 * - AI tools used в production pipeline
 * - Human editorial oversight gates
 * - License CC BY-SA 4.0
 */
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const SITE_URL = 'https://books.folkup.life'

useHead({
  title: () => t('ai_disclosure.title') + ' — ' + t('brand.name'),
  meta: [
    { name: 'description', content: () => t('ai_disclosure.meta_description') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: () => t('ai_disclosure.title') },
    { property: 'og:description', content: () => t('ai_disclosure.meta_description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${SITE_URL}/ai-disclosure/` },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: () => t('ai_disclosure.title') },
    { name: 'twitter:description', content: () => t('ai_disclosure.meta_description') },
  ],
  link: [
    { rel: 'canonical', href: `${SITE_URL}/ai-disclosure/` },
    { rel: 'alternate', hreflang: 'ru', href: `${SITE_URL}/ai-disclosure/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/ai-disclosure/` },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${SITE_URL}/ai-disclosure/#webpage`,
        name: 'Раскрытие использования ИИ — Библиотека FolkUp',
        url: `${SITE_URL}/ai-disclosure/`,
        description: 'AI usage disclosure per EU AI Act Article 50(4). Legal name of natural person responsible for editorial oversight: Andrei Klemenchionok.',
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntity: {
          '@type': 'Person',
          name: 'Andrei Klemenchionok',
          jobTitle: 'Editor / Publisher',
          worksFor: { '@id': `${SITE_URL}/#organization` },
          description: 'Natural person responsible для editorial oversight of AI-assisted content per EU AI Act Art. 50(4)(b). Publishes under pseudonym «Команданте FolkUp».',
        },
        inLanguage: 'ru',
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
