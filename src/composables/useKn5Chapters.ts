/**
 * kn.5 «Чужими руками» chapters composable — manifest + lazy body loader.
 * Source: content/kn5/ru/chapters-generated/ (split by kn5-reader-manifest.mjs
 * from pandoc-fenced-div MASTER).
 */
import { ref } from 'vue'
import manifest from '../../content/kn5/ru/chapters-manifest.json'

const chapterBodyModules = import.meta.glob<string>(
  '../../content/kn5/ru/chapters-generated/*.md',
  { query: '?raw', import: 'default' },
)

export interface Kn5ChapterMeta {
  slug: string
  title: string
  description: string | null
  order: number
  isApparatus: boolean
}

interface Kn5Manifest {
  generated: string
  book: string
  locale: string
  entries: Kn5ChapterMeta[]
}

const typedManifest = manifest as Kn5Manifest

export function useKn5Chapters() {
  return ref(typedManifest.entries)
}

export function useKn5ChapterSlugs(): string[] {
  return typedManifest.entries.map((e) => e.slug)
}

export function useKn5ChapterMeta(slug: string) {
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

export async function loadKn5ChapterBody(slug: string): Promise<string | null> {
  const path = `../../content/kn5/ru/chapters-generated/${slug}.md`
  if (chapterBodyModules[path]) {
    return await chapterBodyModules[path]()
  }
  return null
}
