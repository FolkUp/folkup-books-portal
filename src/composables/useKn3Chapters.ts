/**
 * kn.3 «Город Солнца» chapters composable — manifest-driven TOC + per-chapter body loader.
 *
 * Bundle strategy (VIT-KLB cont+51 mirror kn1 pattern PR #146):
 *   - Manifest (metadata only, ~4 KB JSON) → eager import для TOC + navigation.
 *   - Bodies split per-chapter ES modules (content/kn3/ru/chapters-html/{slug}.js) —
 *     dynamic import via glob. Vite splits каждый в собственный chunk → 60 KB gzip gate.
 *
 * Origin: reader restoration cont+30 S3SCOOP Track G (metadata manifest + raw md loader).
 * cont+51 mirror kn1 fix — async watcher pattern не suspend'ился SSR → HTML прибит на
 * «Загрузка…». Pre-render bodies at build time + per-chapter split → SSR emits real HTML.
 *
 * Source split: content/kn3/ru/chapters-generated/*.md (kept для tooling parity) +
 * content/kn3/ru/chapters-html/*.js (pre-rendered by kn3-reader-manifest.mjs).
 */
import { ref } from 'vue'
import manifest from '../../content/kn3/ru/chapters-manifest.json'

// Per-chapter HTML modules — dynamic glob → каждый chunk отдельно.
const chapterHtmlModules = import.meta.glob<{ default: string }>(
  '../../content/kn3/ru/chapters-html/*.js',
)

export interface Kn3ChapterMeta {
  slug: string
  title: string
  description: string | null
  order: number
  isApparatus: boolean
}

interface Kn3Manifest {
  generated: string
  book: string
  locale: string
  entries: Kn3ChapterMeta[]
}

const typedManifest = manifest as Kn3Manifest

export function useKn3Chapters() {
  return ref(typedManifest.entries)
}

export function useKn3ChapterSlugs(): string[] {
  return typedManifest.entries.map((e) => e.slug)
}

export function useKn3ChapterMeta(slug: string) {
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
 * SSR path (Kn3ReadChapter.vue onServerPrefetch) — awaited by vite-ssg's
 *   renderToString → body inlined в prerendered HTML.
 * Client path (watch(slug)) — chunk loads on-demand per navigation, browser
 *   caches after first hit.
 */
export async function loadKn3ChapterBodyHtml(slug: string): Promise<string | null> {
  const path = `../../content/kn3/ru/chapters-html/${slug}.js`
  const loader = chapterHtmlModules[path]
  if (!loader) return null
  const mod = await loader()
  return mod.default
}
