<script setup lang="ts">
/**
 * /ai-disclosure — EU AI Act Art. 50(4) compliance page.
 * Canon: Лев T-LEV-IMPRESSUM verdikт cont+29 B4 + Q4a compromise verdict cont+32
 * (Andrei A choice — legal name only here, псевдоним «Команданте FolkUp» везде остальном).
 *
 * Discloses:
 * - Legal name Andrei Klemenchenok (natural person editorial responsibility per AI Act 50(4), second subparagraph)
 * - AI tools used в production pipeline
 * - Human editorial oversight gates
 * - License CC BY-SA 4.0
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, te } = useI18n()
const route = useRoute()

// Iskra APPLY-READY-S316-07 canon: 6-section structure (who_responsible / the_human /
// ai_assistants / verifiability / why_voluntary / licence + italic subtitle + updated_note).
// Rollout allowed per locale (Iskra §4). If new-canon EN keys present — render new 6-section;
// else fallback к legacy 4-section (RU/PT/DE pending Kochegar/Zeka/Bolik apply per §4 порядок).
const hasNewCanonStructure = computed(() => te('ai_disclosure.who_responsible.h2'))

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
              currentLang.value === 'ru'
                ? 'Natural person responsible for editorial oversight of AI-assisted content per EU AI Act Article 50(4), second subparagraph. Publishes under pseudonym «Команданте FolkUp».'
                : 'Natural person responsible for editorial oversight of AI-assisted content per EU AI Act Article 50(4), second subparagraph. Publishes under pseudonym «Comandante FolkUp».',
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

      <!-- New canonical 6-section structure per Iskra APPLY-READY-S316-07 -->
      <template v-if="hasNewCanonStructure">
        <p class="ai-disclosure-page__subtitle"><em>{{ t('ai_disclosure.subtitle') }}</em></p>

        <section>
          <h2>{{ t('ai_disclosure.who_responsible.h2') }}</h2>
          <p>{{ t('ai_disclosure.who_responsible.p1') }}</p>
          <p>{{ t('ai_disclosure.who_responsible.p2') }}</p>
        </section>

        <section>
          <h2>{{ t('ai_disclosure.the_human.h2') }}</h2>
          <p>{{ t('ai_disclosure.the_human.p1') }}</p>
        </section>

        <section>
          <h2>{{ t('ai_disclosure.ai_assistants.h2') }}</h2>
          <p>{{ t('ai_disclosure.ai_assistants.p1') }}</p>
          <p>{{ t('ai_disclosure.ai_assistants.p2') }}</p>
        </section>

        <section>
          <h2>{{ t('ai_disclosure.verifiability.h2') }}</h2>
          <p>{{ t('ai_disclosure.verifiability.p1') }}</p>
        </section>

        <section>
          <h2>{{ t('ai_disclosure.why_voluntary.h2') }}</h2>
          <p>{{ t('ai_disclosure.why_voluntary.p1') }}</p>
        </section>

        <section>
          <h2>{{ t('ai_disclosure.licence.h2') }}</h2>
          <p>{{ t('ai_disclosure.licence.p1') }}</p>
        </section>

        <p class="ai-disclosure-page__footer"><em>{{ t('ai_disclosure.updated_note') }}</em></p>
      </template>

      <!-- Legacy 4-section structure (RU/PT/DE pending Kochegar/Zeka/Bolik apply per Iskra §4) -->
      <template v-else>
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
      </template>
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
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.ai-disclosure-page__subtitle {
  margin-bottom: var(--spacing-2xl);
  text-align: center;
  opacity: 0.75;
  font-size: 0.95em;
}

.ai-disclosure-page__footer {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border, rgba(0,0,0,0.1));
  opacity: 0.7;
  font-size: 0.9em;
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
