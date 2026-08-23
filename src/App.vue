<script setup lang="ts">
import { watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()

// Base head — augmented per-page via useHead в individual pages
const SITE_URL = 'https://books.folkup.life'

// PT-READER-OG-LOCALE-1 fix (2026-08-16):
// og:locale + htmlAttrs.lang reactive per route.meta.lang (reader routes set это в routes.ts).
// Non-reader routes fall back к i18n locale.value (RU only per SUPPORTED_LOCALES).
// Overrides могут прийти из per-page useHead (Kn1ReadChapter.vue) — они выигрывают.
type OgLang = 'ru' | 'pt' | 'en'
const OG_LOCALE_MAP: Record<OgLang, string> = {
  ru: 'ru_RU',
  pt: 'pt_PT',
  en: 'en_US',
}
const routeLang = (): OgLang => {
  const metaLang = route.meta.lang
  if (typeof metaLang === 'string' && (metaLang === 'ru' || metaLang === 'pt' || metaLang === 'en')) {
    return metaLang
  }
  return locale.value as OgLang
}
// Iskra STOP-MAYAK S219 §2д: соцсети капризны к SVG. Wave 2 PNG отдаём для превью.
const DEFAULT_OG_IMAGE = `${SITE_URL}/covers/cover_kn1.png`
// PT temporarily hidden from switcher pending pt.json translation + native-speaker review
// per Iskra рекомендация S250 (Andrey verdict а 2026-08-03 cont+45). Type union и pt.json
// файлы preserved. Downloads pt.epub/pt.pdf + PT reader /kn1/pt/read/* остаются доступны
// напрямую по URL. NAV-1 Ступень 2 cont+21 explicit «PT НЕ возвращать (S250 в силе)»
// per Iskra POMETKA-10 §B pt.2.
// LANG-404 HOTFIX Iskra S274 2026-08-11: EN + DE temporarily hidden from switcher.
// DE остаётся hidden до Bolik cont+27+ portal DE-hero v2 через Vier-Augen ratify.
// NAV-1 Ступень 2 cont+21 S1PT: EN restored per Iskra POMETKA-10 §B pt.2. switcher =
// i18n locale-only (UI language change, NOT URL routing) — safe от S274 LANG-404 bug.
// EN interface texts в en.json ready. EN book content /kn1/en/read/* live (Vier-Augen 9/13
// CONDITIONAL PASS 2026-08-16). Landing /en waits Lolik cont+44+ portal EN-hero v2.
const SUPPORTED_LOCALES = ['ru', 'en'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

// Current URL (per-route reactive)
// Iskra P3 (cont+52 SEAL): normalize к trailing-slash form чтобы align og:url + hreflang
// к canonical convention BookPage.vue (`https://books.folkup.life/${slug}/`).
// SSG route.path returns `/kn1` без slash → canonical/og drift observed by Iskra.
const currentUrl = () => {
  const path = route.path
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `${SITE_URL}${withSlash}`
}

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
    'https://books.folkup.life/kn1',
    'https://t.me/folkupbooks',
    'https://github.com/FolkUp',
  ],
}

// NAV-1 Ступень 3 cont+22 S1PT LANG-URL-CANON-1 (Iskra TIKET-S287-01):
// Язык — источник истины = маршрут (route.meta.lang). switchLocale() удалён, localStorage
// упразднён (§2.3). Interface locale синхронизирован с route.meta.lang через watcher (§2.4).
// PT temporarily fallback к RU для i18n (не в SUPPORTED_LOCALES per S250) но PT контент
// главы остаётся доступен /kn1/pt/read/* (Kn1ReadChapter читает свой content по props.lang).
watch(
  () => route.meta.lang,
  (metaLang) => {
    const targetLang =
      typeof metaLang === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(metaLang)
        ? (metaLang as SupportedLocale)
        : 'ru'
    if (locale.value !== targetLang) {
      locale.value = targetLang
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', targetLang)
      }
    }
  },
  { immediate: true },
)

// buildLangUrl: строит адрес параллельной языковой версии текущей страницы.
// Reader routes: /kn{N}/read ↔ /kn{N}/{lang}/read (chapter tail preserved).
// Book-page routes: /kn{N} (RU default) OR /kn{N}/{lang} (pre-rendered locale, fast-follow).
// Non-reader/unknown routes: возвращает currentPath (§2.5 fallback).
function buildLangUrl(currentPath: string, targetLang: SupportedLocale): string {
  const withLangMatch = currentPath.match(/^\/(kn\d+)\/(ru|pt|en|de)\/read(\/.*)?$/)
  if (withLangMatch) {
    const [, book, , tail = ''] = withLangMatch
    if (targetLang === 'ru') return `/${book}/read${tail}`
    return `/${book}/${targetLang}/read${tail}`
  }

  const withoutLangMatch = currentPath.match(/^\/(kn\d+)\/read(\/.*)?$/)
  if (withoutLangMatch) {
    const [, book, tail = ''] = withoutLangMatch
    if (targetLang === 'ru') return currentPath
    return `/${book}/${targetLang}/read${tail}`
  }

  // Book-page routes: /kn{N} OR /kn{N}/{lang} (with optional trailing slash).
  // Hotfix per Iskra S291-03 T2 INC-KN1-LANG-SWITCH-1 (scoped kn1 per explicit ticket
  // wording «hotfix href на /kn1/en/read/»; «системный для будущих флипов DE/PT» handled
  // когда те флипы happen с ticket 11 conditional render в place). Currently kn1=EN live
  // (LIVE-GATE-EN-1 closed post-PR #207 flip), kn2-7 = EN «готовится» → /kn{N}/en/read = 404.
  // TODO cont+6 (ticket 11 owner): implement conditional render — check series.yaml
  // translations.[lang].status === 'live' pre-route (NOT hardcode per Iskra visa 6).
  const bookPageMatch = currentPath.match(/^\/(kn\d+)(?:\/(?:ru|en|pt|de))?\/?$/)
  if (bookPageMatch) {
    const [, book] = bookPageMatch
    if (targetLang === 'ru') return `/${book}`
    // Kn1 EN currently live — safe to route к reader landing.
    if (book === 'kn1' && targetLang === 'en') return `/${book}/en/read`
    // Other books/langs: no confirmed translation live → silent stay preserves
    // pre-hotfix UX (no 404 regression). Ticket 11 will make this conditional-render clean.
    return currentPath
  }

  // Legal + about + ai-disclosure — TICKET 9 P1 unblock BL-LAUNCH-1 per Iskra S291.
  // Routes: /{page} (RU default) OR /en/{page}. EN i18n keys ALL preexist в en.json.
  // PT+DE NOT currently mapped for legal (i18n keys present but нет ratified route decision) —
  // future work по расширению spec.
  const LEGAL_PAGES = ['ai-disclosure', 'about', 'privacy', 'terms', 'cookies', 'imprint']
  const legalMatch = currentPath.match(/^(?:\/(en))?\/([\w-]+)\/?$/)
  if (legalMatch) {
    const [, currentLangPrefix, page] = legalMatch
    if (LEGAL_PAGES.includes(page)) {
      if (targetLang === 'ru') return `/${page}`
      if (targetLang === 'en') return `/en/${page}`
      // pt/de not yet supported for legal — silent stay preserves UX
      return currentLangPrefix ? `/${currentLangPrefix}/${page}` : `/${page}`
    }
  }

  return currentPath
}

useHead({
  htmlAttrs: {
    lang: routeLang,
  },
  meta: [
    { property: 'og:locale', content: () => OG_LOCALE_MAP[routeLang()] },
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
  // hreflang: per-page emission через Kn1ReadChapter.vue (reader routes уже path-prefixed
  // /kn1/read/*, /kn1/pt/read/*, /kn1/en/read/*). Non-reader страницы — single-lang RU
  // (SUPPORTED_LOCALES=['ru']), не нужны alternates. Stray x-default→self удалён per
  // Оракул verdict Q23 (был self-referential bug; correct pattern — reader emits own alternates).
  // Reader page Kn1ReadChapter.vue: emit `<link rel="alternate" hreflang="X" href="Y">` per
  // available lang + x-default→RU, plus canonical URL.
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
        <RouterLink
          v-for="lang in SUPPORTED_LOCALES"
          :key="lang"
          :to="buildLangUrl(route.path, lang)"
          class="lang-switcher__btn"
          :class="{ 'lang-switcher__btn--active': routeLang() === lang }"
          :aria-current="routeLang() === lang ? 'true' : undefined"
          :lang="lang"
        >
          {{ t(`nav.language_${lang}`) }}
        </RouterLink>
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
