/**
 * kn.5 «Трудности диалога» chapters composable — manifest + per-chapter HTML loader.
 * VIT-KLB cont+51 mirror kn1 pattern: pre-rendered HTML modules (via marked GFM sync),
 *   dynamic glob per-chunk. Source: content/kn7/ru/chapters-html/*.js (pre-rendered
 *   by kn7-reader-manifest.mjs — pandoc-fenced-div MASTER stripping preserved).
 */
import { ref } from 'vue'
import manifest from '../../content/kn7/ru/chapters-manifest.json'

const chapterHtmlModules = import.meta.glob<{ default: string }>(
  '../../content/kn7/ru/chapters-html/*.js',
)

export interface Kn7ChapterMeta {
  slug: string
  title: string
  description: string | null
  order: number
  isApparatus: boolean
}

interface Kn7Manifest {
  generated: string
  book: string
  locale: string
  entries: Kn7ChapterMeta[]
}

const typedManifest = manifest as Kn7Manifest

export function useKn7Chapters() {
  return ref(typedManifest.entries)
}

export function useKn7ChapterSlugs(): string[] {
  return typedManifest.entries.map((e) => e.slug)
}

export function useKn7ChapterMeta(slug: string) {
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
 * Load pre-rendered HTML body для chapter by slug. See useKn3Chapters for pattern rationale.
 */
export async function loadKn7ChapterBodyHtml(slug: string): Promise<string | null> {
  const path = `../../content/kn7/ru/chapters-html/${slug}.js`
  const loader = chapterHtmlModules[path]
  if (!loader) return null
  const mod = await loader()
  return mod.default
}
