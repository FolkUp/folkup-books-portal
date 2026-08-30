import type { RouteRecordRaw } from 'vue-router'

/**
 * Static routes per book — SSG pre-render friendly.
 * Per Kочегар+Дьюи Option A structure: content/kn[N]/ subfolder per book.
 * Migration state: кн.1 mirror + 301 redirect from sapiens.folkup.life (post-cutover).
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/index.vue'),
    meta: { pageType: 'portal-home' },
  },
  // EN-HOME-1 recovery (Iskra ADDENDUM-1 к TIKET-28, S297-07 cont+7 S8SCOOP 2026-08-24):
  // восстановление 4-язычной главной, замурованной S250 (сужение SUPPORTED_LOCALES) +
  // PR #193 (buildLangUrl fallback). EN-строки native-refined Лёликом (S1LOLIK cont+6 2026-08-02).
  // meta.lang triggers App.vue watcher → i18n locale swap → target lang content renders.
  {
    path: '/en',
    name: 'home-en',
    component: () => import('../pages/index.vue'),
    meta: { pageType: 'portal-home', lang: 'en' },
  },
  // TIKET-31 PORTAL-UI-LANG-DECOUPLE-1 (Iskra POMETKA-11 S299-11 GO cont+7 S8SCOOP 2026-08-24):
  // 4-lang оболочка per §S299-05 PORTAL-LANG-PARITY-1 canon.
  // PT-строки native-refined Zeka Quatro Olhos (pt.json 212 keys Iskra S214 §2/§3/§9).
  // DE-строки native-refined Bolik Vier-Augen (de.json 234 keys Iskra S214 адаптация).
  {
    path: '/pt',
    name: 'home-pt',
    component: () => import('../pages/index.vue'),
    meta: { pageType: 'portal-home', lang: 'pt' },
  },
  {
    path: '/de',
    name: 'home-de',
    component: () => import('../pages/index.vue'),
    meta: { pageType: 'portal-home', lang: 'de' },
  },
  {
    path: '/kn1',
    name: 'kn1',
    component: () => import('../pages/kn1.vue'),
    meta: { pageType: 'book', bookSlug: 'kn1' },
  },
  {
    path: '/kn1/read',
    name: 'kn1-read-toc',
    component: () => import('../pages/Kn1ReadToc.vue'),
    meta: { pageType: 'reader-toc', bookSlug: 'kn1' },
  },
  {
    path: '/kn1/read/:slug',
    name: 'kn1-read-chapter',
    component: () => import('../pages/Kn1ReadChapter.vue'),
    meta: { pageType: 'reader-chapter', bookSlug: 'kn1' },
  },
  // NAV-1 Ступень 2 cont+21 S1PT: lang-aware TOC routes per Iskra POMETKA-10 §B pt.1
  // (useKn1ChaptersLang уже exists — READER-UNIFY-1 задел). Reverts Ступень 1 hardcoding
  // в Kn1ReadChapter.vue L82-83.
  {
    path: '/kn1/pt/read',
    name: 'kn1-pt-read-toc',
    component: () => import('../pages/Kn1ReadToc.vue'),
    meta: { pageType: 'reader-toc', bookSlug: 'kn1', lang: 'pt' },
  },
  {
    path: '/kn1/en/read',
    name: 'kn1-en-read-toc',
    component: () => import('../pages/Kn1ReadToc.vue'),
    meta: { pageType: 'reader-toc', bookSlug: 'kn1', lang: 'en' },
  },
  // READER-UNIFY-1 cont+16: PT reader chapters (Iskra S284-01 §2 pt.3).
  // /kn1/pt/read/:slug — served if content/kn1/pt/chapters-manifest.json exists.
  {
    path: '/kn1/pt/read/:slug',
    name: 'kn1-pt-read-chapter',
    component: () => import('../pages/Kn1ReadChapter.vue'),
    meta: { pageType: 'reader-chapter', bookSlug: 'kn1', lang: 'pt' },
    props: (route) => ({ ...route.params, lang: 'pt' }),
  },
  // EN reader chapters — content shipping via Iskra Vier-Augen конвейер (9/13 as of 2026-08-16).
  {
    path: '/kn1/en/read/:slug',
    name: 'kn1-en-read-chapter',
    component: () => import('../pages/Kn1ReadChapter.vue'),
    meta: { pageType: 'reader-chapter', bookSlug: 'kn1', lang: 'en' },
    props: (route) => ({ ...route.params, lang: 'en' }),
  },
  // PRO-CHTO standalone routes (Option A.3 per Alisa KVIT-22 → S299-14 DEFAULT-GO canon apply).
  // 4-lang parity per Iskra S301-10 §4 P1 mandate + S301-04 LOCALE-PERSISTENCE canon.
  // Preserves canon S242 §1 KANON1=β (inline pro-chto suppression в BookPage.vue untouched).
  // Content: content/kn1/{lang}/pro-chto.md — RU (Iskra v3-BEZ-SCHYOTA S198) + EN (Лёлик S299-10) +
  //   PT (Zeka S280-02) + DE (Bolik S246 term-cascade). Component reads route.meta.lang.
  {
    path: '/kn1/pro-chto',
    name: 'kn1-pro-chto',
    component: () => import('../pages/ProChtoLangPage.vue'),
    meta: { pageType: 'pro-chto-page', bookSlug: 'kn1', lang: 'ru' },
  },
  {
    path: '/kn1/en/pro-chto',
    name: 'kn1-en-pro-chto',
    component: () => import('../pages/ProChtoLangPage.vue'),
    meta: { pageType: 'pro-chto-page', bookSlug: 'kn1', lang: 'en' },
  },
  {
    path: '/kn1/pt/pro-chto',
    name: 'kn1-pt-pro-chto',
    component: () => import('../pages/ProChtoLangPage.vue'),
    meta: { pageType: 'pro-chto-page', bookSlug: 'kn1', lang: 'pt' },
  },
  {
    path: '/kn1/de/pro-chto',
    name: 'kn1-de-pro-chto',
    component: () => import('../pages/ProChtoLangPage.vue'),
    meta: { pageType: 'pro-chto-page', bookSlug: 'kn1', lang: 'de' },
  },
  {
    path: '/kn2',
    name: 'kn2',
    component: () => import('../pages/kn2.vue'),
    meta: { pageType: 'book', bookSlug: 'kn2' },
  },
  {
    path: '/kn3',
    name: 'kn3',
    component: () => import('../pages/kn3.vue'),
    meta: { pageType: 'book', bookSlug: 'kn3' },
  },
  {
    path: '/kn3/read',
    name: 'kn3-read-toc',
    component: () => import('../pages/Kn3ReadToc.vue'),
    meta: { pageType: 'reader-toc', bookSlug: 'kn3' },
  },
  {
    path: '/kn3/read/:slug',
    name: 'kn3-read-chapter',
    component: () => import('../pages/Kn3ReadChapter.vue'),
    meta: { pageType: 'reader-chapter', bookSlug: 'kn3' },
  },
  {
    path: '/kn4',
    name: 'kn4',
    component: () => import('../pages/kn4.vue'),
    meta: { pageType: 'book', bookSlug: 'kn4' },
  },
  {
    path: '/kn4/read',
    name: 'kn4-read-toc',
    component: () => import('../pages/Kn4ReadToc.vue'),
    meta: { pageType: 'reader-toc', bookSlug: 'kn4' },
  },
  {
    path: '/kn4/read/:slug',
    name: 'kn4-read-chapter',
    component: () => import('../pages/Kn4ReadChapter.vue'),
    meta: { pageType: 'reader-chapter', bookSlug: 'kn4' },
  },
  {
    path: '/kn5',
    name: 'kn5',
    component: () => import('../pages/kn5.vue'),
    meta: { pageType: 'book', bookSlug: 'kn5' },
  },
  {
    path: '/kn5/read',
    name: 'kn5-read-toc',
    component: () => import('../pages/Kn5ReadToc.vue'),
    meta: { pageType: 'reader-toc', bookSlug: 'kn5' },
  },
  {
    path: '/kn5/read/:slug',
    name: 'kn5-read-chapter',
    component: () => import('../pages/Kn5ReadChapter.vue'),
    meta: { pageType: 'reader-chapter', bookSlug: 'kn5' },
  },
  {
    path: '/kn6',
    name: 'kn6',
    component: () => import('../pages/kn6.vue'),
    meta: { pageType: 'book', bookSlug: 'kn6' },
  },
  {
    path: '/kn7',
    name: 'kn7',
    component: () => import('../pages/kn7.vue'),
    meta: { pageType: 'book', bookSlug: 'kn7' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/about.vue'),
    meta: { pageType: 'about' },
  },
  {
    path: '/ai-disclosure',
    name: 'ai-disclosure',
    component: () => import('../pages/ai-disclosure.vue'),
    meta: { pageType: 'ai-disclosure' },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../pages/legal/privacy.vue'),
    meta: { pageType: 'legal', pageKey: 'privacy' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../pages/legal/terms.vue'),
    meta: { pageType: 'legal', pageKey: 'terms' },
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('../pages/legal/cookies.vue'),
    meta: { pageType: 'legal', pageKey: 'cookies' },
  },
  {
    path: '/imprint',
    name: 'imprint',
    component: () => import('../pages/legal/imprint.vue'),
    meta: { pageType: 'legal', pageKey: 'imprint' },
  },
  // EN legal + about + ai-disclosure — TICKET 9 P1 unblock BL-LAUNCH-1
  // per Iskra S291 «минимум /en/ai-disclosure и /en/about должны жить до постинга»
  // EN i18n keys ALL preexist в en.json (RU parity 121/120 verified S8SCOOP cont+0).
  // meta.lang='en' triggers App.vue watcher → i18n locale swap → EN content renders.
  {
    path: '/en/about',
    name: 'about-en',
    component: () => import('../pages/about.vue'),
    meta: { pageType: 'about', lang: 'en' },
  },
  {
    path: '/en/ai-disclosure',
    name: 'ai-disclosure-en',
    component: () => import('../pages/ai-disclosure.vue'),
    meta: { pageType: 'ai-disclosure', lang: 'en' },
  },
  {
    path: '/en/privacy',
    name: 'privacy-en',
    component: () => import('../pages/legal/privacy.vue'),
    meta: { pageType: 'legal', pageKey: 'privacy', lang: 'en' },
  },
  {
    path: '/en/terms',
    name: 'terms-en',
    component: () => import('../pages/legal/terms.vue'),
    meta: { pageType: 'legal', pageKey: 'terms', lang: 'en' },
  },
  {
    path: '/en/cookies',
    name: 'cookies-en',
    component: () => import('../pages/legal/cookies.vue'),
    meta: { pageType: 'legal', pageKey: 'cookies', lang: 'en' },
  },
  {
    path: '/en/imprint',
    name: 'imprint-en',
    component: () => import('../pages/legal/imprint.vue'),
    meta: { pageType: 'legal', pageKey: 'imprint', lang: 'en' },
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // TIKET-31 EXT — PORTAL-LANG-PARITY-1 stub routes (Andrey mandate cont+7 2026-08-24 +
  // Iskra §S299-05 canon): 4-lang switcher visible everywhere; translation-missing pages
  // render LangNotReady disclosure с honest text на target language.
  //
  // Total: 33 stub routes (21 book × 3 non-RU langs + 12 legal × 2 non-RU-non-EN langs).
  // Reader stub routes НЕ добавляем (deep engagement — если reader translation отсутствует,
  // switcher click с /kn{N}/{lang}/read/* fallback к book-level stub /{lang}/kn{N}).
  //
  // When native translation ratifies (Bolik DE + Zeka PT + Lelik EN):
  // Just swap component: LangNotReady → real page component. Меm same URL, no route change.
  // ═══════════════════════════════════════════════════════════════════════════════

  // Book pages EN stubs (kn1-7)
  { path: '/en/kn1', name: 'kn1-en', component: () => import('../pages/kn1.vue'), meta: { pageType: 'book', bookSlug: 'kn1', lang: 'en' } },
  { path: '/en/kn2', name: 'kn2-en', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn2', lang: 'en' } },
  { path: '/en/kn3', name: 'kn3-en', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn3', lang: 'en' } },
  { path: '/en/kn4', name: 'kn4-en', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn4', lang: 'en' } },
  { path: '/en/kn5', name: 'kn5-en', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn5', lang: 'en' } },
  { path: '/en/kn6', name: 'kn6-en', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn6', lang: 'en' } },
  { path: '/en/kn7', name: 'kn7-en', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn7', lang: 'en' } },

  // Book pages PT stubs (kn1-7) — /pt/kn1 flipped stub→wrapper per Iskra VERDIKT-S307-03 §1 Q4 (S1DEFIX cont+2 2026-08-31) + Andrey S306 «флип без вето». Preview state per series.yaml translations.pt='preview' — reader `/kn1/pt/read/*` LIVE 4 chapters (Zeka batch 8 waves 1-4), downloads pending. Pattern mirrors /en/kn1 flip PR #255 (Iskra VIZA-VERDIKT-S304-01 §1).
  { path: '/pt/kn1', name: 'kn1-pt', component: () => import('../pages/kn1.vue'), meta: { pageType: 'book', bookSlug: 'kn1', lang: 'pt' } },
  { path: '/pt/kn2', name: 'kn2-pt', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn2', lang: 'pt' } },
  { path: '/pt/kn3', name: 'kn3-pt', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn3', lang: 'pt' } },
  { path: '/pt/kn4', name: 'kn4-pt', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn4', lang: 'pt' } },
  { path: '/pt/kn5', name: 'kn5-pt', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn5', lang: 'pt' } },
  { path: '/pt/kn6', name: 'kn6-pt', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn6', lang: 'pt' } },
  { path: '/pt/kn7', name: 'kn7-pt', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn7', lang: 'pt' } },

  // Book pages DE stubs (kn1-7)
  { path: '/de/kn1', name: 'kn1-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn1', lang: 'de' } },
  { path: '/de/kn2', name: 'kn2-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn2', lang: 'de' } },
  { path: '/de/kn3', name: 'kn3-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn3', lang: 'de' } },
  { path: '/de/kn4', name: 'kn4-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn4', lang: 'de' } },
  { path: '/de/kn5', name: 'kn5-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn5', lang: 'de' } },
  { path: '/de/kn6', name: 'kn6-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn6', lang: 'de' } },
  { path: '/de/kn7', name: 'kn7-de', component: () => import('../pages/LangNotReady.vue'), meta: { pageType: 'book-stub', bookSlug: 'kn7', lang: 'de' } },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PORTAL-LANG-PARITY-1 mirror redirects (S8SCOOP cont+10 2026-08-25 per Iskra S303-03 §1 п.5).
  //
  // Problem: /kn*/lang URLs (mirror scheme where lang is 2nd segment) return HTTP 404
  // Russian «Экспонат на реставрации» because no route matches — direct violation of
  // PORTAL-LANG-PARITY canon (Iskra S299/S301): «where the book is not in the guest's language
  // — honest note in the guest's language, not «exhibit under restoration» in Russian».
  //
  // Fix: 21 redirect routes /kn1..kn7/{en,pt,de} → /{en,pt,de}/kn1..kn7 (canonical scheme).
  // User lands на canonical URL с proper localized LangNotReady disclosure. Same result
  // as if user typed canonical URL directly. SEO-clean (single canonical URL per lang stub).
  //
  // When native translation ratifies: real component swap на /{lang}/kn* stub route,
  // mirror redirect keeps working — user lands on real content instead of stub.
  // ═══════════════════════════════════════════════════════════════════════════════

  // Kn1 mirror redirects
  { path: '/kn1/en', redirect: '/en/kn1' },
  { path: '/kn1/pt', redirect: '/pt/kn1' },
  { path: '/kn1/de', redirect: '/de/kn1' },

  // Kn2 mirror redirects
  { path: '/kn2/en', redirect: '/en/kn2' },
  { path: '/kn2/pt', redirect: '/pt/kn2' },
  { path: '/kn2/de', redirect: '/de/kn2' },

  // Kn3 mirror redirects
  { path: '/kn3/en', redirect: '/en/kn3' },
  { path: '/kn3/pt', redirect: '/pt/kn3' },
  { path: '/kn3/de', redirect: '/de/kn3' },

  // Kn4 mirror redirects
  { path: '/kn4/en', redirect: '/en/kn4' },
  { path: '/kn4/pt', redirect: '/pt/kn4' },
  { path: '/kn4/de', redirect: '/de/kn4' },

  // Kn5 mirror redirects
  { path: '/kn5/en', redirect: '/en/kn5' },
  { path: '/kn5/pt', redirect: '/pt/kn5' },
  { path: '/kn5/de', redirect: '/de/kn5' },

  // Kn6 mirror redirects
  { path: '/kn6/en', redirect: '/en/kn6' },
  { path: '/kn6/pt', redirect: '/pt/kn6' },
  { path: '/kn6/de', redirect: '/de/kn6' },

  // Kn7 mirror redirects
  { path: '/kn7/en', redirect: '/en/kn7' },
  { path: '/kn7/pt', redirect: '/pt/kn7' },
  { path: '/kn7/de', redirect: '/de/kn7' },

  // Legal pages PT — real components (Zeka native PT-EU refined S299-20 PASS + Iskra S300-01+S301-11
  // Vier-Augen corrections applied 2026-08-24 via PR #239 PT-HOME + PR #240 PT-LEGAL; routes stubs
  // → real components per DEFAULT-GO canon Iskra S299-14 §1 + Andrey «деплоим постоянно всё что исправляем»).
  { path: '/pt/about', name: 'about-pt', component: () => import('../pages/about.vue'), meta: { pageType: 'about', lang: 'pt' } },
  { path: '/pt/ai-disclosure', name: 'ai-disclosure-pt', component: () => import('../pages/ai-disclosure.vue'), meta: { pageType: 'ai-disclosure', lang: 'pt' } },
  { path: '/pt/privacy', name: 'privacy-pt', component: () => import('../pages/legal/privacy.vue'), meta: { pageType: 'legal', pageKey: 'privacy', lang: 'pt' } },
  { path: '/pt/terms', name: 'terms-pt', component: () => import('../pages/legal/terms.vue'), meta: { pageType: 'legal', pageKey: 'terms', lang: 'pt' } },
  { path: '/pt/cookies', name: 'cookies-pt', component: () => import('../pages/legal/cookies.vue'), meta: { pageType: 'legal', pageKey: 'cookies', lang: 'pt' } },
  { path: '/pt/imprint', name: 'imprint-pt', component: () => import('../pages/legal/imprint.vue'), meta: { pageType: 'legal', pageKey: 'imprint', lang: 'pt' } },

  // Legal pages DE stubs (6 pages)
  // Legal pages DE — real components (Bolik CASCADE-ADDENDUM applied peer PR #244 29bf1eb;
  // Iskra Vier-Augen S301-15 PASS + S301-16 гражданство V2 verdict; routes stubs → real
  // components симметрично PT pattern per PR #241. de.json теперь Iskra-ratified via PR #244
  // — routes wire safe от phantom §5 TMG / §55 RStV.
  { path: '/de/about', name: 'about-de', component: () => import('../pages/about.vue'), meta: { pageType: 'about', lang: 'de' } },
  { path: '/de/ai-disclosure', name: 'ai-disclosure-de', component: () => import('../pages/ai-disclosure.vue'), meta: { pageType: 'ai-disclosure', lang: 'de' } },
  { path: '/de/privacy', name: 'privacy-de', component: () => import('../pages/legal/privacy.vue'), meta: { pageType: 'legal', pageKey: 'privacy', lang: 'de' } },
  { path: '/de/terms', name: 'terms-de', component: () => import('../pages/legal/terms.vue'), meta: { pageType: 'legal', pageKey: 'terms', lang: 'de' } },
  { path: '/de/cookies', name: 'cookies-de', component: () => import('../pages/legal/cookies.vue'), meta: { pageType: 'legal', pageKey: 'cookies', lang: 'de' } },
  { path: '/de/imprint', name: 'imprint-de', component: () => import('../pages/legal/imprint.vue'), meta: { pageType: 'legal', pageKey: 'imprint', lang: 'de' } },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/404.vue'),
  },
]
