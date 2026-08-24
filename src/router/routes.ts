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
  // EN-HOME-1 recovery (Iskra ADDENDUM-1 к TIKET-28, S297-07): восстановление 4-язычной
  // главной, замурованной S250 (сужение SUPPORTED_LOCALES) + PR #193 (buildLangUrl fallback).
  // EN-строки живы native-refined Лёликом (S1LOLIK cont+6 2026-08-02).
  // meta.lang='en' triggers App.vue watcher → i18n locale swap → EN content renders.
  {
    path: '/en',
    name: 'home-en',
    component: () => import('../pages/index.vue'),
    meta: { pageType: 'portal-home', lang: 'en' },
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
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/404.vue'),
  },
]
