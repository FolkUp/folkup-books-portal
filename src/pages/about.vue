<script setup lang="ts">
/**
 * /about — «О проекте» page.
 * Canon: Иве S172 v1 text УТВЕРЖДЁН Андреем per S174c 2026-07-15.
 * Author = «Команданте FolkUp» (pseudonym per S174d — Q10-independent).
 * Schema.org AboutPage per S174c primatka §4.
 * Illustration slots (S1/S2/S3) — placeholders, финал Фрида (canon S138 stamp).
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const SITE_URL = 'https://books.folkup.life'

// TICKET 9 P1 (S8SCOOP cont+0): dynamic canonical + hreflang alt EN per route.meta.lang.
// /about (RU default) OR /en/about (EN variant). Self-canonical per variant. hreflang cross-refs.
const currentLang = computed<string>(() => (route.meta.lang as string) || 'ru')
const currentUrl = computed(() =>
  currentLang.value === 'en' ? `${SITE_URL}/en/about/` : `${SITE_URL}/about/`,
)

useHead({
  title: () => t('about.title') + ' — ' + t('brand.name'),
  meta: [
    { name: 'description', content: () => t('about.meta_description') },
    { property: 'og:title', content: () => t('about.title') },
    { property: 'og:description', content: () => t('about.meta_description') },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: () => currentUrl.value },
    { property: 'og:image', content: `${SITE_URL}/covers/cover_kn1.png` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => t('about.title') },
    { name: 'twitter:description', content: () => t('about.meta_description') },
    { name: 'twitter:image', content: `${SITE_URL}/covers/cover_kn1.png` },
  ],
  link: [
    { rel: 'canonical', href: () => currentUrl.value },
    { rel: 'alternate', hreflang: 'ru', href: `${SITE_URL}/about/` },
    { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/en/about/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/about/` },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': `${currentUrl.value}#aboutpage`,
          name:
            currentLang.value === 'en'
              ? 'About — FolkUp Library'
              : 'О проекте — Библиотека FolkUp',
          url: currentUrl.value,
          description:
            currentLang.value === 'en'
              ? 'About FolkUp Library: free books under CC BY-SA 4.0 — non-fiction series on teams and people. Human editing alongside AI; humans are accountable for every word.'
              : 'О Библиотеке FolkUp: свободные книги под CC BY-SA 4.0 — нон-фикшн серия о командах и людях. Редактирует человек вместе с ИИ; за каждое слово отвечает человек.',
          publisher: { '@id': `${SITE_URL}/#organization` },
          mainEntity: { '@id': `${SITE_URL}/#series` },
          inLanguage: currentLang.value,
        }),
    },
  ],
})
</script>

<template>
  <div class="about-page">
    <article class="about-page__content">
      <h1>{{ t('about.h1') }}</h1>


      <section>
        <h2>{{ t('about.section1.h2') }}</h2>
        <p class="about-page__lead">{{ t('about.section1.p1') }}</p>
        <p>{{ t('about.section1.p2') }}</p>
        <p>{{ t('about.section1.p3') }}</p>
      </section>

      <section>
        <h2>{{ t('about.section2.h2') }}</h2>
        <p>{{ t('about.section2.p1') }}</p>
        <p>{{ t('about.section2.p2') }}</p>
      </section>

      <section>
        <h2>{{ t('about.section3.h2') }}</h2>
        <i18n-t keypath="about.section3.p1" tag="p">
          <template #declarationLink>
            <a href="https://declaration.folkup.app/ru/" rel="noopener">{{ t('about.section3.declaration_link_text') }}</a>
          </template>
        </i18n-t>
        <i18n-t keypath="about.section3.p2" tag="p">
          <template #articlesLink>
            <a href="https://underground.folkup.life" rel="noopener">{{ t('about.section3.articles_link_text') }}</a>
          </template>
          <template #encyclopediasLink>
            <a href="https://folkup.app" rel="noopener">{{ t('about.section3.encyclopedias_link_text') }}</a>
          </template>
        </i18n-t>
      </section>

      <section>
        <h2>{{ t('about.section4.h2') }}</h2>
        <i18n-t keypath="about.section4.p1" tag="p">
          <template #firstBookLink>
            <RouterLink to="/kn1">{{ t('about.section4.first_book_link_text') }}</RouterLink>
          </template>
        </i18n-t>
      </section>
    </article>
  </div>
</template>

<style scoped>
.about-page {
  padding: var(--spacing-xl) 0;
}

.about-page__content {
  max-width: 680px;
  margin: 0 auto;
}

.about-page__content h1 {
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.about-page__content h2 {
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-md);
}

.about-page__content p {
  margin-bottom: var(--spacing-md);
  line-height: 1.7;
}

.about-page__lead {
  font-size: var(--fs-lg);
  font-style: italic;
  color: var(--color-text-muted);
}

/* S1 hero illustration placeholder — canon S138 «ЭКСПОНАТ НА РЕСТАВРАЦИИ» stamp
   until Фрида финал per S174c. */
.about-page__illustration {
  margin: var(--spacing-xl) 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
}

.about-page__illustration--pending {
  background: var(--color-border);
  border-radius: var(--radius-md);
  position: relative;
}

.about-page__stamp {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 3px solid var(--color-bordeaux);
  color: var(--color-bordeaux);
  border-radius: 50%;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: var(--fs-sm);
  transform: rotate(-12deg);
  background: rgba(255, 255, 255, 0.85);
}
</style>
