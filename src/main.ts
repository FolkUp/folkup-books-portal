import { ViteSSG } from 'vite-ssg'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { routes } from './router/routes'
import ruMessages from './i18n/locales/ru.json'
import enMessages from './i18n/locales/en.json'
import deMessages from './i18n/locales/de.json'
import ptMessages from './i18n/locales/pt.json'

import './styles/tokens.css'
import './styles/base.css'

// vite-ssg factory — returns setup function per R1 memo canonical pattern
// Head management: vite-ssg AUTO-registers @unhead/vue plugin (useHead=true default),
// applying SSR-aware createHead. Do NOT register own createHead() — conflicts с vite-ssg's.
// Bug fix cont +17: prior explicit createHead() from '@unhead/vue/client' was overriding
// vite-ssg's server head plugin, preventing SSG prerender from applying useHead calls.
export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, initialState }) => {
    // i18n — per-locale build (SEO + bundle size per R1 memo)
    const i18n = createI18n({
      legacy: false, // Required для Composition API per R1 memo
      globalInjection: true,
      locale: 'ru',
      fallbackLocale: 'ru',
      messages: {
        ru: ruMessages,
        en: enMessages,
        de: deMessages,
        pt: ptMessages,
      },
    })
    app.use(i18n)

    // Serialize state для SSG hydration
    if (import.meta.env.SSR) {
      initialState.data = {} // Placeholder — expand с series data if needed
    }
  }
)
