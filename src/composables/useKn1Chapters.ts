/**
 * kn.1 chapters composable — manifest-driven ordered list + lazy body loader.
 *
 * Bundle strategy:
 *   - Manifest (metadata only, ~13 KB JSON) → eager import для TOC + navigation
 *   - Body content (860 KB total 24 chapters) → non-eager glob, per-chunk lazy load
 *
 * Origin: reader restoration cont+30 S3SCOOP. First attempt eager-globed all bodies →
 * 860 KB useKn1Chapters chunk, failed 60 KB gzip bundle gate. Refactored к manifest +
 * lazy per-chapter loading (kn1-reader-manifest.mjs pre-build step).
 */
import { ref } from 'vue'
import manifest from '../../content/kn1/ru/chapters-manifest.json'

// Lazy glob — each chapter becomes separate chunk, loaded on demand
const chapterBodyModules = import.meta.glob<string>(
  '../../content/kn1/ru/chapters/**/*.md',
  { query: '?raw', import: 'default' },
)

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
 * Load chapter body (markdown source) — lazy, per-chapter chunk.
 * Handles both root chapters + apparatus-* slugs.
 */
export async function loadKn1ChapterBody(slug: string): Promise<string | null> {
  // Root chapter: content/kn1/ru/chapters/{slug}.md
  const rootPath = `../../content/kn1/ru/chapters/${slug}.md`
  if (chapterBodyModules[rootPath]) {
    return await chapterBodyModules[rootPath]()
  }
  // Apparatus: prefix «apparatus-» → subfolder
  if (slug.startsWith('apparatus-')) {
    const baseSlug = slug.replace(/^apparatus-/, '')
    const apparatusPath = `../../content/kn1/ru/chapters/apparatus/${baseSlug}.md`
    if (chapterBodyModules[apparatusPath]) {
      return await chapterBodyModules[apparatusPath]()
    }
  }
  return null
}

/**
 * Strip YAML frontmatter из raw markdown, return body only.
 */
export function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/)
  return match ? match[1] : raw
}
