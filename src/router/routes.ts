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
  {
    path: '/kn1',
    name: 'kn1',
    component: () => import('../pages/kn1.vue'),
    meta: { pageType: 'book', bookSlug: 'kn1' },
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
    path: '/kn4',
    name: 'kn4',
    component: () => import('../pages/kn4.vue'),
    meta: { pageType: 'book', bookSlug: 'kn4' },
  },
  {
    path: '/kn5',
    name: 'kn5',
    component: () => import('../pages/kn5.vue'),
    meta: { pageType: 'book', bookSlug: 'kn5' },
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
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/404.vue'),
  },
]
