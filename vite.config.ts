import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// vite-ssg uses this same config for SSG build (via `vite-ssg build`).
// Per Кочегар+Дьюи+R1 memo: single-config approach preferred for consistency.

/**
 * kn.1 reader dynamic route prerender list — read chapter filesystem at build config time.
 * Reader restoration cont+30 S3SCOOP: /kn1/read/:slug needs static list для vite-ssg prerender.
 */
// Files к skip — Hugo internal section indices, not reader-facing chapters.
// Must match scripts/kn1-reader-manifest.mjs SKIP_FILES set.
const READER_SKIP_FILES = new Set(['_index.md', '_index.ru.md'])

function kn1ReaderRoutes(): string[] {
  const chaptersDir = resolve(fileURLToPath(new URL('.', import.meta.url)), 'content/kn1/ru/chapters')
  const routes: string[] = []
  try {
    // Root chapter files
    for (const file of readdirSync(chaptersDir)) {
      if (!file.endsWith('.md') || READER_SKIP_FILES.has(file)) continue
      routes.push(`/kn1/read/${file.replace(/\.md$/, '')}`)
    }
    // Apparatus subfolder — slug prefixed «apparatus-»
    const apparatusDir = resolve(chaptersDir, 'apparatus')
    for (const file of readdirSync(apparatusDir)) {
      if (!file.endsWith('.md') || READER_SKIP_FILES.has(file)) continue
      routes.push(`/kn1/read/apparatus-${file.replace(/\.md$/, '')}`)
    }
  } catch (err) {
    console.warn('[vite.config] Failed enumerate kn.1 chapters:', err)
  }
  return routes
}

const KN1_READER_ROUTES = kn1ReaderRoutes()
console.log(`[vite-ssg] Prerender kn.1 reader routes: ${KN1_READER_ROUTES.length} chapters`)

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
    // Explicit routes list — includes dynamic kn.1 reader routes (/kn1/read/:slug).
    // Static routes auto-discovered; dynamic ones must be enumerated explicitly.
    // Filter out route templates containing `:` (dynamic segments) — replaced
    // by concrete slug URLs. Per vite-ssg docs: https://github.com/antfu/vite-ssg#usage
    includedRoutes(paths: string[]) {
      const staticPaths = paths.filter((p) => !p.includes(':'))
      return [...staticPaths, ...KN1_READER_ROUTES]
    },
    onFinished() {
      console.log(`vite-ssg build finished. Prerender includes ${KN1_READER_ROUTES.length} kn.1 reader routes. Verify sitemap.xml + hreflang links.`)
    },
  },
})
