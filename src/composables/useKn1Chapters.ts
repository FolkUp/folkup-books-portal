/**
 * kn.1 chapters composable — manifest-driven ordered list + per-chapter body loader.
 *
 * Bundle strategy (VIT-KLB cont+49 P0 fix):
 *   - Manifest (metadata only, ~12 KB JSON) → eager import для TOC + navigation.
 *     TOC page (Kn1ReadToc.vue) touches ONLY this — не подтягивает bodies.
 *   - Bodies split per-chapter ES modules (content/kn1/ru/chapters-html/{slug}.js) —
 *     dynamic import via glob. Vite splits каждый в собственный chunk (~5-90 KB raw,
 *     gzip typically 30-40% — все under 60 KB gzip bundle gate).
 *
 * Origin: reader restoration cont+30 S3SCOOP (metadata manifest). cont+49 Кочегар fix —
 * async watcher pattern не suspend'ился SSR → HTML прибит на «Загрузка…». Pre-render
 * bodies at build time + per-chapter split → SSR emits real HTML + bundle gate OK.
 */
import { ref } from 'vue'
import manifest from '../../content/kn1/ru/chapters-manifest.json'

export interface ChapterMeta {
  slug: string
  title: string
  description: string | null
  weight: number | null
  act: string | null
  act_opener: boolean
  isApparatus: boolean
  order: number
}

interface Manifest {
  generated: string
  book: string
  locale: string
  entries: ChapterMeta[]
}

const typedManifest = manifest as Manifest

// Per-chapter HTML modules — dynamic glob → каждый chunk отдельно.
// Vite matches `../../content/kn1/ru/chapters-html/{slug}.js` at build,
// каждый chapter файл = own on-demand chunk.
const chapterHtmlModules = import.meta.glob<{ default: string }>(
  '../../content/kn1/ru/chapters-html/*.js',
)

/**
 * All chapter metadata — ordered per canonical sequence.
 */
export function useKn1Chapters() {
  return ref(typedManifest.entries)
}

/**
 * All chapter slugs — used by vite-ssg includedRoutes для prerender.
 */
export function useKn1ChapterSlugs(): string[] {
  return typedManifest.entries.map((e) => e.slug)
}

/**
 * Single chapter meta + prev/next navigation (synchronous, from manifest).
 */
export function useKn1ChapterMeta(slug: string) {
  const idx = typedManifest.entries.findIndex((e) => e.slug === slug)
  if (idx < 0) return { meta: null, prev: null, next: null }
  return {
    meta: typedManifest.entries[idx],
    prev: idx > 0 ? typedManifest.entries[idx - 1] : null,
    next:
      idx < typedManifest.entries.length - 1
        ? typedManifest.entries[idx + 1]
        : null,
  }
}

/**
 * Load pre-rendered HTML body для chapter by slug.
 * Returns null if slug unknown.
 *
 * SSR path (Kn1ReadChapter.vue onServerPrefetch) — awaited by vite-ssg's
 *   renderToString → body inlined в prerendered HTML.
 * Client path (watch(slug)) — chunk loads on-demand per navigation, browser
 *   caches after first hit.
 */
export async function loadKn1ChapterBodyHtml(slug: string): Promise<string | null> {
  const path = `../../content/kn1/ru/chapters-html/${slug}.js`
  const loader = chapterHtmlModules[path]
  if (!loader) return null
  const mod = await loader()
  return mod.default
}
