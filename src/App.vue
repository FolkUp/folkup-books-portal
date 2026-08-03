<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()

const LOCALE_STORAGE_KEY = 'folkup-preferred-locale'

// Base head — augmented per-page via useHead в individual pages
const SITE_URL = 'https://books.folkup.life'
// Iskra STOP-MAYAK S219 §2д: соцсети капризны к SVG. Wave 2 PNG отдаём для превью.
const DEFAULT_OG_IMAGE = `${SITE_URL}/covers/cover_kn1.png`
// PT temporarily hidden from switcher pending pt.json translation + native-speaker review
// per Iskra рекомендация S250 (Andrey verdict а 2026-08-03 cont+45). Type union и pt.json
// файлы preserved. Downloads pt.epub/pt.pdf остаются доступны напрямую по URL.
const SUPPORTED_LOCALES = ['ru', 'en', 'de'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

// Current URL (per-route reactive)
const currentUrl = () => `${SITE_URL}${route.path}`

// Schema.org Organization — publisher identity (per Дьюи SEO audit 2026-07-23)
const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FolkUp',
  alternateName: 'Библиотека FolkUp',
  url: SITE_URL,
  logo: `${SITE_URL}/brand-mark.svg`,
  sameAs: [
    'https://folkup.app',
    'https://sapiens.folkup.life',
    'https://t.me/folkupbooks',
    'https://github.com/FolkUp',
  ],
}

function switchLocale(lang: SupportedLocale): void {
  locale.value = lang
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang)
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, lang)
    } catch {
      // Storage quota exceeded / private mode — silent
    }
  }
}

// Restore persisted locale on mount (SSR-safe — vite-ssg prerenders с default RU)
onMounted(() => {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) {
      const lang = stored as SupportedLocale
      if (locale.value !== lang) {
        locale.value = lang
        document.documentElement.setAttribute('lang', lang)
      }
    }
  } catch {
    // Storage access denied — silent
  }
})

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  meta: [
    { property: 'og:locale', content: () => locale.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Библиотека FolkUp' },
    { property: 'og:url', content: currentUrl },
    { property: 'og:image', content: DEFAULT_OG_IMAGE },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '800' },
    { property: 'og:image:height', content: '1200' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
  ],
  // hreflang: SPA client-side locale switch — все 5 tags указывают на тот же URL.
  // TODO(next batch): implement path-prefix routing (/en/privacy /de/privacy /pt/privacy)
  // для полноценной per-locale indexation. See BACKLOG ticket PORTAL-P0-HREFLANG-PATH-PREFIX.
  link: [
    { rel: 'alternate', hreflang: 'x-default', href: currentUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(ORGANIZATION_JSONLD),
    },
  ],
})
</script>

<template>
  <div class="app">
    <header class="site-header">
      <RouterLink to="/" class="brand-mark">
        <img src="/brand-mark.svg" alt="" aria-hidden="true" class="brand-mark__icon" />
        <span class="brand-mark__text">{{ t('brand.name') }}</span>
      </RouterLink>
      <nav class="lang-switcher" :aria-label="t('nav.language_label')">
        <button
          v-for="lang in SUPPORTED_LOCALES"
          :key="lang"
          type="button"
          class="lang-switcher__btn"
          :class="{ 'lang-switcher__btn--active': locale === lang }"
          :aria-pressed="locale === lang"
          :lang="lang"
          @click="switchLocale(lang)"
        >
          {{ t(`nav.language_${lang}`) }}
        </button>
      </nav>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <nav class="site-footer__nav" :aria-label="t('nav.footer_about')">
        <RouterLink to="/about">{{ t('nav.footer_about') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink to="/ai-disclosure">{{ t('nav.footer_ai_disclosure') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink to="/privacy">{{ t('nav.footer_privacy') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink to="/terms">{{ t('nav.footer_terms') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink to="/cookies">{{ t('nav.footer_cookies') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink to="/imprint">{{ t('nav.footer_imprint') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <a :href="`mailto:${t('nav.footer_contact')}`">{{ t('nav.footer_contact') }}</a>
      </nav>
      <p class="site-footer__copyright">{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
}

.site-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-brand);
  font-size: 1.5rem;
  color: var(--color-primary);
  text-decoration: none;
}

.brand-mark__icon {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}

.brand-mark__text {
  line-height: 1;
}

.lang-switcher {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.lang-switcher__btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--fs-sm, 0.875rem);
  font-weight: 500;
  padding: 0.25rem 0.55rem;
  border-radius: 3px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.lang-switcher__btn:hover {
  color: var(--color-primary);
  background: var(--color-bg-alt, transparent);
}

.lang-switcher__btn:focus-visible {
  outline: 2px solid var(--color-accent, currentColor);
  outline-offset: 2px;
}

.lang-switcher__btn--active {
  color: var(--color-primary);
  border-color: var(--color-accent, var(--color-primary));
  font-weight: 600;
}

.site-main {
  flex: 1;
  max-width: var(--layout-max-width);
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 100%;
}

.site-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-align: center;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
  align-items: baseline;
}

.site-footer__nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.site-footer__nav a:hover,
.site-footer__nav a:focus-visible {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.site-footer__sep {
  color: var(--color-border);
}

.site-footer__copyright {
  margin: 0;
}

@media (max-width: 640px) {
  .site-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .lang-switcher__btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }

  .site-footer__nav {
    gap: 0.35em;
    font-size: 0.8125rem;
  }
}
</style>
