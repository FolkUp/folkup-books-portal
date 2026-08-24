<script setup lang="ts">
import { computed, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSeriesData } from './composables/useSeriesData'

const { t, locale } = useI18n()
const route = useRoute()
const { bookBySlug } = useSeriesData()

// Base head — augmented per-page via useHead в individual pages
const SITE_URL = 'https://books.folkup.life'

// PT-READER-OG-LOCALE-1 fix (2026-08-16), extended TIKET-31 4-lang (2026-08-24 cont+7):
// og:locale + htmlAttrs.lang reactive per route.meta.lang (reader routes set это в routes.ts).
// Non-reader routes fall back к i18n locale.value (per SUPPORTED_LOCALES 4 langs).
// Overrides могут прийти из per-page useHead (Kn1ReadChapter.vue) — они выигрывают.
type OgLang = 'ru' | 'pt' | 'en' | 'de'
const OG_LOCALE_MAP: Record<OgLang, string> = {
  ru: 'ru_RU',
  pt: 'pt_PT',
  en: 'en_US',
  de: 'de_DE',
}
const routeLang = (): OgLang => {
  const metaLang = route.meta.lang
  if (
    typeof metaLang === 'string' &&
    (metaLang === 'ru' || metaLang === 'pt' || metaLang === 'en' || metaLang === 'de')
  ) {
    return metaLang
  }
  return locale.value as OgLang
}
// Iskra STOP-MAYAK S219 §2д: соцсети капризны к SVG. Wave 2 PNG отдаём для превью.
// S1ILLUS cont+0 Frida OG integration (Iskra PAKET-19 S288 «Визирую пускай приступает» + Andrey verbatim pick cont+3):
// Portal main OG теперь Ремедиос F-1 «Библиотека» (7 корешков + настольная лампа + Hammershøi mood) 1200×630 JPG.
// Cover_kn1.png ещё используется в about.vue + per-book BookPage.vue — не трогать.
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og/books-og-hires.jpg`
// TIKET-31 PORTAL-UI-LANG-DECOUPLE-1 (Iskra POMETKA-11 S299-11 GO cont+7 S8SCOOP 2026-08-24):
// Оболочка 4 языка (RU + EN + PT + DE) per Iskra §S299-05 PORTAL-LANG-PARITY-1 canon.
// i18n files ready: ru.json (212 keys) + en.json (227) + pt.json (212, Zeka Quatro Olhos)
// + de.json (234, Bolik Vier-Augen). Home routes / /en /pt /de + legal routes RU+EN.
// Legal PT+DE routes = separate ticket after Bolik DE-LEGAL + Zeka PT-LEGAL ratify.
// Book content translations остаются gated per series.yaml translations[lang]==='live'
// (currently kn1 EN live via Vier-Augen 9/13 CONDITIONAL PASS 2026-08-16;
// PT/DE reader content shipping via separate translator tracks — S1TREN + Bolik + Lelik).
// Historical decisions (superseded by TIKET-31):
//   S250 (Andrey 2026-08-03 cont+45): PT hidden from switcher — REVERSED
//   S274 LANG-404 HOTFIX Iskra 2026-08-11: DE hidden from switcher — REVERSED
//   NAV-1 Ступень 2 cont+21 S1PT: EN restored — expanded к 4-lang
const SUPPORTED_LOCALES = ['ru', 'en', 'pt', 'de'] as const
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

// NAV-1 Ступень 3 cont+22 S1PT LANG-URL-CANON-1 (Iskra TIKET-S287-01),
// extended TIKET-31 4-lang decouple (cont+7 S8SCOOP 2026-08-24):
// Язык — источник истины = маршрут (route.meta.lang). switchLocale() удалён, localStorage
// упразднён (§2.3). Interface locale синхронизирован с route.meta.lang через watcher (§2.4).
// 4 langs (RU + EN + PT + DE) все в SUPPORTED_LOCALES; watcher применяет к interface locale.
// Reader content per-book gated via series.yaml translations[lang]==='live' (см. langsAvailableForBook).
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

// LEGAL_PAGES: static-page routes existing в RU (/{page}) + EN (/en/{page}) per routes.ts.
// PT+DE legal routes НЕ добавлены в TIKET-31 scope — pending Bolik DE-LEGAL 6-pages ratify
// (draft landed 11:42 UTC 2026-08-24, ждёт Iskra Vier-Augen) + Zeka PT-LEGAL strings.
// Legal switcher показывает RU+EN только; home switcher — все 4 langs.
const LEGAL_PAGES = ['ai-disclosure', 'about', 'privacy', 'terms', 'cookies', 'imprint']

// TIKET-28 P0 INC-PORTAL-LANG-SWITCH-HOME (Iskra S297-06 + ADDENDUM-1 S297-07) — closes
// TODO ticket 11 per Iskra visa 6: data-driven check series.yaml translations[lang]==='live'
// вместо hardcoded `book === 'kn1' && targetLang === 'en'` (S291-03 T2 scoped hotfix заменён).
// Silent stay preserves UX (no 404 regression) если target lang НЕ live.
function langsAvailableForBook(bookSlug: string): SupportedLocale[] {
  const book = bookBySlug(bookSlug)
  if (!book?.translations) return ['ru']
  const result: SupportedLocale[] = []
  for (const lang of SUPPORTED_LOCALES) {
    if (book.translations[lang] === 'live') {
      result.push(lang)
    }
  }
  return result.length > 0 ? result : ['ru']
}

// getAvailableLangs: возвращает список langs, у которых current route имеет live-версию.
// Iskra §1 mandate: «кнопка языка X показывается ТОЛЬКО если у текущего маршрута существует
// X-версия». Активный язык всегда виден (safety fallback в конце).
// Карта источников истины (TIKET-31 4-lang decouple cont+7 S8SCOOP 2026-08-24):
//   • homepage / /en /pt /de → все 4 langs (SUPPORTED_LOCALES; i18n messages ready)
//   • books/reader → series.yaml translations[lang]==='live' (gated by translation availability)
//   • legal/about → routes.ts фактические маршруты (currently RU + EN; PT/DE pending Bolik+Zeka)
//   • unknown → active lang only (safe — one button, no dead link)
function getAvailableLangs(currentPath: string): SupportedLocale[] {
  // TIKET-31 PORTAL-UI-LANG-DECOUPLE-1 (cont+7 S8SCOOP): homepage 4-язычная
  // (RU + EN + PT + DE). Iskra §S299-05 PORTAL-LANG-PARITY-1 canon.
  if (
    currentPath === '/' ||
    currentPath === '' ||
    currentPath === '/en' ||
    currentPath === '/en/' ||
    currentPath === '/pt' ||
    currentPath === '/pt/' ||
    currentPath === '/de' ||
    currentPath === '/de/'
  ) {
    return [...SUPPORTED_LOCALES]
  }

  const readerLangMatch = currentPath.match(/^\/(kn\d+)\/(ru|pt|en|de)\/read(\/.*)?$/)
  if (readerLangMatch) {
    return langsAvailableForBook(readerLangMatch[1])
  }

  const readerDefaultMatch = currentPath.match(/^\/(kn\d+)\/read(\/.*)?$/)
  if (readerDefaultMatch) {
    return langsAvailableForBook(readerDefaultMatch[1])
  }

  const bookPageMatch = currentPath.match(/^\/(kn\d+)(?:\/(?:ru|en|pt|de))?\/?$/)
  if (bookPageMatch) {
    return langsAvailableForBook(bookPageMatch[1])
  }

  const legalMatch = currentPath.match(/^(?:\/(en))?\/([\w-]+)\/?$/)
  if (legalMatch && LEGAL_PAGES.includes(legalMatch[2])) {
    // Legal routes: RU + EN через routes.ts. PT+DE pending Bolik DE-LEGAL + Zeka PT-LEGAL.
    return SUPPORTED_LOCALES.filter((l) => l === 'ru' || l === 'en')
  }

  return [routeLang() as SupportedLocale]
}

const availableLangs = computed(() => getAvailableLangs(route.path))

// TIKET-29 4-lang footer extension (Iskra POMETKA-11 S299-11 passenger cont+7 S8SCOOP):
// Legal routes existing только в RU (/{page}) + EN (/en/{page}) per routes.ts.
// PT/DE users на home — footer links fallback к EN legal (nearest available lang).
// TODO: расширить к /pt/ + /de/ legal когда Bolik DE-LEGAL 6-pages (Vier-Augen pending)
// + Zeka PT-LEGAL strings landed. Отдельный ticket PT-DE-LEGAL-ROUTES-1 после Iskra ratify.
const footerLangPrefix = computed(() => {
  const lang = routeLang()
  if (lang === 'ru') return ''
  if (lang === 'en') return '/en'
  return '/en' // PT/DE fallback к EN legal until PT-DE-LEGAL-ROUTES-1
})

// buildLangUrl: строит адрес параллельной языковой версии текущей страницы.
// Reader routes: /kn{N}/read ↔ /kn{N}/{lang}/read (chapter tail preserved).
// Book-page routes: /kn{N} (RU default) OR /kn{N}/{lang} (pre-rendered locale, fast-follow).
// TIKET-28 data-driven refactor (cont+4 S295KONSOL): hardcoded kn1+en check заменён на
// series.yaml translations per Iskra visa 6. Silent stay preserves UX (no 404 regression).
function buildLangUrl(currentPath: string, targetLang: SupportedLocale): string {
  // TIKET-31 4-lang decouple (cont+7 S8SCOOP 2026-08-24): `/` ↔ `/en` ↔ `/pt` ↔ `/de` mapping.
  // Placed FIRST — most specific match precedes book/reader/legal regex fallbacks.
  if (currentPath === '/' || currentPath === '') {
    return targetLang === 'ru' ? '/' : `/${targetLang}`
  }
  const homeLangMatch = currentPath.match(/^\/(en|pt|de)\/?$/)
  if (homeLangMatch) {
    return targetLang === 'ru' ? '/' : `/${targetLang}`
  }

  const withLangMatch = currentPath.match(/^\/(kn\d+)\/(ru|pt|en|de)\/read(\/.*)?$/)
  if (withLangMatch) {
    const [, book, , tail = ''] = withLangMatch
    if (targetLang === 'ru') return `/${book}/read${tail}`
    const bookData = bookBySlug(book)
    if (bookData?.translations?.[targetLang] === 'live') {
      return `/${book}/${targetLang}/read${tail}`
    }
    return currentPath
  }

  const withoutLangMatch = currentPath.match(/^\/(kn\d+)\/read(\/.*)?$/)
  if (withoutLangMatch) {
    const [, book, tail = ''] = withoutLangMatch
    if (targetLang === 'ru') return currentPath
    const bookData = bookBySlug(book)
    if (bookData?.translations?.[targetLang] === 'live') {
      return `/${book}/${targetLang}/read${tail}`
    }
    return currentPath
  }

  const bookPageMatch = currentPath.match(/^\/(kn\d+)(?:\/(?:ru|en|pt|de))?\/?$/)
  if (bookPageMatch) {
    const [, book] = bookPageMatch
    if (targetLang === 'ru') return `/${book}`
    const bookData = bookBySlug(book)
    if (bookData?.translations?.[targetLang] === 'live') {
      return `/${book}/${targetLang}/read`
    }
    return currentPath
  }

  const legalMatch = currentPath.match(/^(?:\/(en))?\/([\w-]+)\/?$/)
  if (legalMatch) {
    const [, currentLangPrefix, page] = legalMatch
    if (LEGAL_PAGES.includes(page)) {
      if (targetLang === 'ru') return `/${page}`
      if (targetLang === 'en') return `/en/${page}`
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
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Ремедиос (Frida-форнит FolkUp): семь книжных корешков и настольная лампа — свет над Библиотекой' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
  ],
  // hreflang: per-page emission.
  //   • Reader (Kn1ReadChapter.vue): emit `<link rel="alternate" hreflang="X" href="Y">` per
  //     available lang + x-default→RU, plus canonical URL. Reader routes уже path-prefixed
  //     /kn1/read/*, /kn1/pt/read/*, /kn1/en/read/*.
  //   • Home (index.vue): emits hreflang alternates ru/en/pt/de + x-default→RU (TIKET-31 cont+7).
  //   • Legal (about/privacy/terms/cookies/imprint/ai-disclosure): RU + EN alternates only.
  // Stray x-default→self удалён per Оракул verdict Q23 (self-referential bug fixed).
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
          v-for="lang in availableLangs"
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
        <RouterLink :to="footerLangPrefix + '/about'">{{ t('nav.footer_about') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink :to="footerLangPrefix + '/ai-disclosure'">{{ t('nav.footer_ai_disclosure') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink :to="footerLangPrefix + '/privacy'">{{ t('nav.footer_privacy') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink :to="footerLangPrefix + '/terms'">{{ t('nav.footer_terms') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink :to="footerLangPrefix + '/cookies'">{{ t('nav.footer_cookies') }}</RouterLink>
        <span class="site-footer__sep" aria-hidden="true">·</span>
        <RouterLink :to="footerLangPrefix + '/imprint'">{{ t('nav.footer_imprint') }}</RouterLink>
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
