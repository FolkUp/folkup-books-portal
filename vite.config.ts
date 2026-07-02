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
        // manualChunks applied only in client build (SSR treats vue as external)
        manualChunks(id, { getModuleInfo }) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/vue/') ||
              id.includes('/vue-router/') ||
              id.includes('/vue-i18n/') ||
              id.includes('/@unhead/')
            ) {
              // Only chunk into vendor for client build (getModuleInfo undefined in SSR external)
              return 'vendor'
            }
          }
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
