import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// vite-ssg uses this same config for SSG build (via `vite-ssg build`).
// Per Кочегар+Дьюи+R1 memo: single-config approach preferred for consistency.

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@data': fileURLToPath(new URL('./data', import.meta.url)),
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
    },
  },
  build: {
    // Bundle gate: 60KB gzip hard cap (per Дьюи Performance SEO + folkup-landing precedent)
    // Warning threshold triggers CI review
    chunkSizeWarningLimit: 60,
    // Rollup optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor split for cache stability
          vendor: ['vue', 'vue-router', 'vue-i18n', '@unhead/vue'],
        },
      },
    },
  },
  // SSG-specific settings (used by vite-ssg build)
  ssgOptions: {
    // Include static routes per page files
    formatting: 'minify',
    // Crawl all internal links
    crawl: true,
    // Skip pre-render for dynamic content (defer к client hydration if needed)
    // For our case (7 books × 4 locales) all static — no dynamic routes
    onFinished() {
      console.log('vite-ssg build finished. Verify sitemap.xml + hreflang links.')
    },
  },
})
