<script setup lang="ts">
/*
 * TIKET-31 EXT PORTAL-LANG-PARITY-1 (Iskra S299-05 canon + Andrey mandate cont+7 2026-08-24):
 * Disclosure page для routes где translation ещё не переведён.
 *
 * Показывается на stub routes: /{en,pt,de}/kn{N} + /{pt,de}/{legal_page}.
 * Text native-refined draft (retro-viza Iskra + Zeka + Bolik + Lelik pending).
 *
 * SEO: noindex per Дьюи P0 mitigation (иначе Google Panda penalty на весь портал).
 * hreflang emitted к real RU version (fallback path preserved).
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useSeriesData } from '../composables/useSeriesData'
import { useLangUrl } from '../composables/useLangUrl'

const { t } = useI18n()
const route = useRoute()
const { bookBySlug } = useSeriesData()
const { langUrl } = useLangUrl()

const bookSlug = route.meta.bookSlug as string | undefined
const targetLang = (route.meta.lang || 'ru') as 'ru' | 'en' | 'pt' | 'de'

const book = computed(() => (bookSlug ? bookBySlug(bookSlug) : null))

// Fallback link: strip lang prefix → RU original path
const ruUrl = computed(() => {
  const stripped = route.path.replace(/^\/(en|pt|de)/, '')
  return stripped || '/'
})

// Cover per target lang (or RU fallback)
const coverUrl = computed(() => {
  if (!book.value) return null
  return book.value.covers?.[targetLang] || book.value.cover_v1 || '/covers/cover_kn1.svg'
})

// SEO: noindex mandatory per Дьюи (иначе Google посчитает 290 stub pages как soft 404)
useHead({
  title: () => `${t('lang_not_ready.title')} · ${t('brand.name')}`,
  meta: [
    { name: 'robots', content: 'noindex, follow' },
    { name: 'description', content: () => t('lang_not_ready.text') },
    { property: 'og:title', content: () => t('lang_not_ready.title') },
    { property: 'og:description', content: () => t('lang_not_ready.text') },
  ],
})
</script>

<template>
  <div class="lang-not-ready">
    <div class="lang-not-ready__notice">
      <h1 class="lang-not-ready__title">{{ t('lang_not_ready.title') }}</h1>
      <p class="lang-not-ready__text">{{ t('lang_not_ready.text') }}</p>
    </div>

    <div v-if="book && coverUrl" class="lang-not-ready__book">
      <RouterLink :to="ruUrl" class="lang-not-ready__book-link">
        <img
          :src="coverUrl"
          :alt="book.slug"
          class="lang-not-ready__cover"
          width="200"
          height="300"
          loading="lazy"
        />
      </RouterLink>
      <p class="lang-not-ready__book-note">{{ t('lang_not_ready.book_note') }}</p>
    </div>

    <nav class="lang-not-ready__nav">
      <RouterLink :to="ruUrl" class="lang-not-ready__link lang-not-ready__link--primary">
        {{ t('lang_not_ready.back_to_ru') }}
      </RouterLink>
      <span class="lang-not-ready__sep" aria-hidden="true">·</span>
      <RouterLink :to="langUrl('/')" class="lang-not-ready__link">
        {{ t('lang_not_ready.home') }}
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.lang-not-ready {
  max-width: 620px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  text-align: center;
}

.lang-not-ready__notice {
  margin-bottom: 2rem;
}

.lang-not-ready__title {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(1.5rem, 3vw + 0.5rem, 2rem);
  font-weight: 700;
  color: var(--color-bordeaux, #7d4450);
  margin: 0 0 1rem;
  letter-spacing: -0.01em;
}

.lang-not-ready__text {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-text, #1a1a1a);
  margin: 0;
}

.lang-not-ready__book {
  margin: 2.5rem auto 2rem;
}

.lang-not-ready__book-link {
  display: inline-block;
  transition: transform 0.15s ease;
}

.lang-not-ready__book-link:hover,
.lang-not-ready__book-link:focus-visible {
  transform: translateY(-3px);
  outline: none;
}

.lang-not-ready__book-link:focus-visible .lang-not-ready__cover {
  box-shadow: 0 0 0 3px var(--color-amber, #e8ad4a);
}

.lang-not-ready__cover {
  display: block;
  width: 160px;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(125, 68, 80, 0.15);
  transition: box-shadow 0.15s ease;
  margin: 0 auto;
}

.lang-not-ready__book-note {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted, #6b6b6b);
  font-style: italic;
}

.lang-not-ready__nav {
  display: inline-flex;
  gap: 0.5em;
  align-items: baseline;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.5rem;
}

.lang-not-ready__link {
  color: var(--color-text-muted, #6b6b6b);
  text-decoration: none;
  transition: color 0.15s ease;
  font-size: 0.9375rem;
}

.lang-not-ready__link--primary {
  color: var(--color-bordeaux, #7d4450);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 500;
}

.lang-not-ready__link:hover,
.lang-not-ready__link:focus-visible {
  color: var(--color-primary, #7d4450);
  text-decoration: underline;
}

.lang-not-ready__sep {
  color: var(--color-border, #e5e0d0);
}

@media (max-width: 640px) {
  .lang-not-ready {
    padding: 2rem 1rem 3rem;
  }
  .lang-not-ready__cover {
    width: 130px;
  }
}
</style>
