<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()

// Base head — augmented per-page via useHead в individual pages
const SITE_URL = 'https://books.folkup.life'
const DEFAULT_OG_IMAGE = `${SITE_URL}/covers/cover_kn1.svg`

// Current URL (per-route reactive) for hreflang self-reference
const currentUrl = () => `${SITE_URL}${route.path}`

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  meta: [
    { property: 'og:locale', content: () => locale.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Библиотека FolkUp' },
    { property: 'og:url', content: currentUrl },
    // Default og:image (per-page override via useHead в pages/BookPage.vue)
    { property: 'og:image', content: DEFAULT_OG_IMAGE },
    { property: 'og:image:type', content: 'image/svg+xml' },
    { property: 'og:image:width', content: '240' },
    { property: 'og:image:height', content: '360' },
    // Twitter Card (summary_large_image — works с book covers)
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
  ],
  link: [
    // hreflang minimal per Q1 verdict А cont +17 (Андрей + panel consensus):
    // Single-language site currently (кн.1 RU only). Self-referential ru + x-default.
    // Full per-locale routing deferred to future ticket when EN/DE/PT books launch.
    { rel: 'alternate', hreflang: 'ru', href: currentUrl },
    { rel: 'alternate', hreflang: 'x-default', href: currentUrl },
  ],
})
</script>

<template>
  <div class="app">
    <header class="site-header">
      <RouterLink to="/" class="brand-mark">{{ t('brand.name') }}</RouterLink>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer">
      <!-- Iskra P0-ZHIVOY §3 п.1 (2026-07-23): одна строка вместо двух -->
      <p>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
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
}

.brand-mark {
  font-family: var(--font-brand);
  font-size: 1.5rem;
  color: var(--color-primary);
  text-decoration: none;
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
</style>
