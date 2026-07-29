/**
 * kn.4 «Где живёт новое» chapters composable — manifest + lazy body loader.
 * Mirror useKn1/useKn3 pattern. Source split by kn4-reader-manifest.mjs prebuild.
 */
import { ref } from 'vue'
import manifest from '../../content/kn4/ru/chapters-manifest.json'

const chapterBodyModules = import.meta.glob<string>(
  '../../content/kn4/ru/chapters-generated/*.md',
  { query: '?raw', import: 'default' },
)

export interface Kn4ChapterMeta {
  slug: string
  title: string
  description: string | null
  order: number
  isApparatus: boolean
}

interface Kn4Manifest {
  generated: string
  book: string
  locale: string
  entries: Kn4ChapterMeta[]
}

const typedManifest = manifest as Kn4Manifest

export function useKn4Chapters() {
  return ref(typedManifest.entries)
}

export function useKn4ChapterSlugs(): string[] {
  return typedManifest.entries.map((e) => e.slug)
}

export function useKn4ChapterMeta(slug: string) {
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

export async function loadKn4ChapterBody(slug: string): Promise<string | null> {
  const path = `../../content/kn4/ru/chapters-generated/${slug}.md`
  if (chapterBodyModules[path]) {
    return await chapterBodyModules[path]()
  }
  return null
}
