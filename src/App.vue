<script setup lang="ts">
import { computed, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSeriesData } from './composables/useSeriesData'
import { useLangUrl } from './composables/useLangUrl'
import {
  localizeReaderSlug,
  hasReaderEntryInLang,
} from './composables/readerSlugAlias'

const { t, locale } = useI18n()
const route = useRoute()
const { bookBySlug } = useSeriesData()
const { langUrl } = useLangUrl()

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
// Portal main OG теперь Ремедиос F-1 «Библиотека» (7 корешков + настольная лампа + Hammershøi mood) 1200×630.
// Frida cont+4 D3 batch «OG экосистемы» (Andrey «APPROVE ALL 6» verdict via zerkalce 15:40 UTC):
// Bass-style Path B canon updated — Ремедиос JPG → Bass warm parchment WebP «три переплёта + фонарь + book edges».
// Cover_kn1.png ещё используется в about.vue + per-book BookPage.vue — не трогать.
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-folkup-books.webp?v=1`
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
// Iskra VERDIKT S308-01 §5 «S1ENFIX Q4 MINOR» (S1DEFIX cont+3 2026-08-31):
// alternateName был hardcoded «Библиотека FolkUp» кириллицей — эмитился на EN/PT/DE страницах.
// Fix: computed reactive to i18n locale — alternateName = t('brand.name') per-locale
// (ru «Библиотека FolkUp» / en «FolkUp Library» / pt «Biblioteca FolkUp» / de «FolkUp-Bibliothek»).
const ORGANIZATION_JSONLD = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FolkUp',
  alternateName: t('brand.name'),
  url: SITE_URL,
  logo: `${SITE_URL}/brand-mark.svg`,
  sameAs: [
    'https://folkup.app',
    'https://books.folkup.life/kn1',
    'https://t.me/folkupbooks',
    'https://github.com/FolkUp',
  ],
}))

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

// LEGAL_PAGES: static-page routes per routes.ts.
// TIKET-31 EXT (Andrey mandate cont+7 2026-08-24 + Iskra §S299-05 canon):
// PT+DE legal routes ДОБАВЛЕНЫ как stub → LangNotReady disclosure (native ratify pending
// Bolik DE-LEGAL + Zeka PT-LEGAL). Switcher показывает все 4 langs везде.
const LEGAL_PAGES = ['ai-disclosure', 'about', 'privacy', 'terms', 'cookies', 'imprint']

// getAvailableLangs: TIKET-31 EXT (Andrey mandate cont+7 2026-08-24 + Iskra §S299-05 canon):
// ВСЕГДА возвращает все 4 langs. Кнопки языков visible везде.
// Missing translations handled gracefully через LangNotReady disclosure component
// (stub routes /{en,pt,de}/kn{N} + /{pt,de}/{legal_page} → LangNotReady.vue с disclosure text).
// Reverses Iskra §1 NAV-1 cont+21 S1PT «hide button если не готов» — override per Andrey UX vision:
// «на всём портале переключение на все 4 языка; если перевод не готов — просто пишем
// перевод этой страницы готовится».
function getAvailableLangs(_currentPath: string): SupportedLocale[] {
  return [...SUPPORTED_LOCALES]
}

const availableLangs = computed(() => getAvailableLangs(route.path))

// TIKET-31 EXT footer language prefix — generic per current lang (не EN fallback).
// PT/DE legal routes ДОБАВЛЕНЫ как stub → LangNotReady disclosure (routes.ts /pt/{legal} + /de/{legal}).
// Retro-viza Iskra + Zeka + Bolik + Lelik pending для canonical native disclosure text.
const footerLangPrefix = computed(() => {
  const lang = routeLang()
  return lang === 'ru' ? '' : `/${lang}`
})

// buildLangUrl: строит адрес параллельной языковой версии текущей страницы.
// Reader routes: /kn{N}/read ↔ /kn{N}/{lang}/read (chapter tail preserved).
// Book-page routes: /kn{N} (RU default) OR /kn{N}/{lang} (pre-rendered locale, fast-follow).
// TIKET-28 data-driven refactor (cont+4 S295KONSOL): hardcoded kn1+en check заменён на
// series.yaml translations per Iskra visa 6. Silent stay preserves UX (no 404 regression).
// buildLangUrl: TIKET-31 EXT (Andrey mandate cont+7 2026-08-24).
// Простой pattern: strip existing lang prefix → add target lang prefix.
// Reader routes (`/kn{N}/{lang}/read/*`) — special case (lang inside path, not prefix).
// Missing lang combinations → LangNotReady stub OR real route depending on translations state.
// S301-09 §3 Тикет 1 P0 fix (Iskra Vier-Augen 2026-08-24 cont+8 S8SCOOP): было fallthrough
// `return currentPath` → 4 одинаковые ссылки на pro-chto странице (переключатель был мёртв).
// Fix двухчастный: (a) pro-chto branch по образцу reader (b) systemic fallback к book-card/home
// в target lang вместо currentPath. Iskra: «переключатель не имеет права рисовать ссылку на
// самого себя: молчаливый провал выглядит как рабочая кнопка».
// S309-12 P1 fix (Iskra TIKET-PATCH 2026-08-31 S1DEFIX cont+4): reader slug alias между
// языками + manifest check вынесены в `composables/readerSlugAlias.ts` для testability.
// Помимо alias — `buildLangUrl` теперь проверяет существование slug в manifest target lang
// и делает fallback к оглавлению `/kn{N}/{lang}/read` если slug отсутствует. Preview state
// тоже даёт reader если route существует (Option B extension per Iskra S309-12 §2.5 —
// kn1 PT preview + reader live).

function buildLangUrl(currentPath: string, targetLang: SupportedLocale): string {
  // Home root
  if (currentPath === '/' || currentPath === '') {
    return targetLang === 'ru' ? '/' : `/${targetLang}`
  }

  // Home lang variants
  const homeLangMatch = currentPath.match(/^\/(en|pt|de)\/?$/)
  if (homeLangMatch) {
    return targetLang === 'ru' ? '/' : `/${targetLang}`
  }

  // Reader chapter routes: /kn{N}/{lang}/read/* — lang в pathIDDLE не prefix
  // (kn1 RU + PT + EN live; kn3-5 RU only; kn2/6/7 no reader). Если translation не live →
  // fallback к RU reader OR home stub. Preserve existing chapter tail для UX continuity.
  // S309-12: tail проходит через alias-map + manifest check target lang → fallback к оглавлению.
  const withLangReaderMatch = currentPath.match(/^\/(kn\d+)\/(ru|pt|en|de)\/read(\/.*)?$/)
  if (withLangReaderMatch) {
    const [, book, , tail = ''] = withLangReaderMatch
    const slugMatch = tail.match(/^\/([^/]+)$/)
    const slug = slugMatch ? slugMatch[1] : null

    if (targetLang === 'ru') {
      if (slug) {
        const localized = localizeReaderSlug(slug, 'ru')
        if (hasReaderEntryInLang(book, 'ru', localized)) {
          return `/${book}/read/${localized}`
        }
        return `/${book}/read` // fallback к оглавлению
      }
      return `/${book}/read`
    }

    const bookData = bookBySlug(book)
    const status = bookData?.translations?.[targetLang]
    // S308-05 Option B extension + S309-12 §2.5: preview state тоже даёт reader если route существует.
    if (status === 'live' || status === 'preview') {
      if (slug) {
        const localized = localizeReaderSlug(slug, targetLang)
        if (hasReaderEntryInLang(book, targetLang, localized)) {
          return `/${book}/${targetLang}/read/${localized}`
        }
        return `/${book}/${targetLang}/read` // fallback к оглавлению
      }
      return `/${book}/${targetLang}/read`
    }
    // Translation not ready → LangNotReady stub на book page уровне (не reader)
    return `/${targetLang}/${book}`
  }

  const withoutLangReaderMatch = currentPath.match(/^\/(kn\d+)\/read(\/.*)?$/)
  if (withoutLangReaderMatch) {
    const [, book, tail = ''] = withoutLangReaderMatch
    const slugMatch = tail.match(/^\/([^/]+)$/)
    const slug = slugMatch ? slugMatch[1] : null

    if (targetLang === 'ru') return currentPath

    const bookData = bookBySlug(book)
    const status = bookData?.translations?.[targetLang]
    // S308-05 Option B extension + S309-12 §2.5: preview state тоже даёт reader если route существует.
    if (status === 'live' || status === 'preview') {
      if (slug) {
        const localized = localizeReaderSlug(slug, targetLang)
        if (hasReaderEntryInLang(book, targetLang, localized)) {
          return `/${book}/${targetLang}/read/${localized}`
        }
        return `/${book}/${targetLang}/read` // fallback к оглавлению
      }
      return `/${book}/${targetLang}/read`
    }
    // Translation not ready → LangNotReady stub на book page уровне
    return `/${targetLang}/${book}`
  }

  // Pro-chto pages: /kn{N}/pro-chto (RU) OR /kn{N}/{lang}/pro-chto (per language).
  // S301-09 §3 Тикет 1 P0 fix (Iskra Vier-Augen 2026-08-24 cont+8 S8SCOOP):
  // routes.ts зарегистрировал все 4 kn1 pro-chto routes (S301-10 §4 P1 mandate, PR #228 EN
  // + PR #234 RU/PT/DE). Переключатель теперь их использует. Series.yaml translations
  // для pro-chto НЕ отражает реальность (все books de:preparing) — hardcode kn1 честнее.
  // Other books (kn2-7) без pro-chto page → fallback к book card в целевом языке.
  const withLangProChToMatch = currentPath.match(/^\/(kn\d+)\/(ru|pt|en|de)\/pro-chto\/?$/)
  if (withLangProChToMatch) {
    const [, book] = withLangProChToMatch
    if (book === 'kn1') {
      return targetLang === 'ru' ? `/${book}/pro-chto` : `/${book}/${targetLang}/pro-chto`
    }
    return targetLang === 'ru' ? `/${book}` : `/${targetLang}/${book}`
  }
  const withoutLangProChToMatch = currentPath.match(/^\/(kn\d+)\/pro-chto\/?$/)
  if (withoutLangProChToMatch) {
    const [, book] = withoutLangProChToMatch
    if (book === 'kn1') {
      return targetLang === 'ru' ? currentPath : `/${book}/${targetLang}/pro-chto`
    }
    return targetLang === 'ru' ? currentPath : `/${targetLang}/${book}`
  }

  // Book page routes: /kn{N} OR /{lang}/kn{N}
  const bookPageMatch = currentPath.match(/^(?:\/(?:en|pt|de))?\/(kn\d+)\/?$/)
  if (bookPageMatch) {
    const [, book] = bookPageMatch
    return targetLang === 'ru' ? `/${book}` : `/${targetLang}/${book}`
  }

  // Legal routes: /{page} OR /{lang}/{page}
  const legalMatch = currentPath.match(/^(?:\/(en|pt|de))?\/([\w-]+)\/?$/)
  if (legalMatch) {
    const [, , page] = legalMatch
    if (LEGAL_PAGES.includes(page)) {
      return targetLang === 'ru' ? `/${page}` : `/${targetLang}/${page}`
    }
  }

  // S301-09 §3 Тикет 1 P0 systemic fix (Iskra Vier-Augen 2026-08-24):
  // `return currentPath` silently drops = fake button. Iskra dixit: «переключатель не имеет
  // права рисовать ссылку на самого себя: молчаливый провал выглядит как рабочая кнопка».
  // Fallback: если path содержит kn{N} → book card в target lang. Else → home в target lang.
  // TODO(S301-09-test): build-time warning + test invariant «4 lang variants distinct».
  if (typeof window !== 'undefined' && typeof console !== 'undefined') {
    console.warn(
      `[buildLangUrl] Unhandled path pattern: ${currentPath} → fallback к home/book-card в ${targetLang}`,
    )
  }
  const anyBookMatch = currentPath.match(/\/(kn\d+)/)
  if (anyBookMatch) {
    const [, book] = anyBookMatch
    return targetLang === 'ru' ? `/${book}` : `/${targetLang}/${book}`
  }
  return targetLang === 'ru' ? '/' : `/${targetLang}`
}

useHead({
  htmlAttrs: {
    lang: routeLang,
  },
  meta: [
    { property: 'og:locale', content: () => OG_LOCALE_MAP[routeLang()] },
    { property: 'og:type', content: 'website' },
    // Iskra VIER-AUGEN-S305-03 §4-2 fix: og:site_name per-locale via i18n
    // (was hardcoded RU «Библиотека FolkUp» on EN/PT/DE pages).
    { property: 'og:site_name', content: () => t('brand.name') },
    { property: 'og:url', content: currentUrl },
    { property: 'og:image', content: DEFAULT_OG_IMAGE },
    { property: 'og:image:type', content: 'image/webp' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    // Iskra VIER-AUGEN-S305-03 §4-2 + VIZA-PAKET-S305-04 §3 Item 2 fix: og:image:alt per-locale
    // via i18n meta.og_image_alt (was hardcoded RU on EN/PT/DE pages). PT: «Remedios» без акута
    // per F-1 fornit canon (PR #237) — имена форнитов не локализуются.
    { property: 'og:image:alt', content: () => t('meta.og_image_alt') },
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
      innerHTML: () => JSON.stringify(ORGANIZATION_JSONLD.value),
    },
  ],
})
</script>

<template>
  <div class="app">
    <header class="site-header">
      <RouterLink :to="langUrl('/')" class="brand-mark">
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
