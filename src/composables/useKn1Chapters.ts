/**
 * kn.1 chapters composable — manifest-driven ordered list + pre-rendered body loader.
 *
 * Bundle strategy (VIT-KLB cont+49 P0 fix):
 *   - Manifest (metadata only, ~12 KB JSON) → eager import для TOC + navigation.
 *     TOC page (Kn1ReadToc.vue) touches ONLY this — не подтягивает bodies bundle.
 *   - Bodies (~830 KB pre-rendered HTML, keyed by slug) → dynamic import ONLY from
 *     chapter page (Kn1ReadChapter.vue) → отдельный chunk. Per-request cost pays only
 *     once per SPA session (browser cache) + prerender inlines в HTML anyway.
 *
 * Origin: reader restoration cont+30 S3SCOOP (metadata manifest). cont+49 Кочегар fix —
 * async watcher pattern не suspend'ился SSR → HTML прибит на «Загрузка…». Pre-render
 * bodies at build time → SSR emits real HTML → GoogleBot видит контент.
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

interface BodiesArtifact {
  generated: string
  book: string
  locale: string
  bodies: Record<string, string>
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
 * Look up pre-rendered HTML body для chapter by slug from a supplied bodies dictionary.
 * Callers pass в bodies loaded из chapters-bodies.json (usually eager-imported by
 * Kn1ReadChapter.vue so bodies bundle in chapter chunk only — не bloats TOC).
 */
export function pickKn1ChapterBodyHtml(
  bodies: Record<string, string>,
  slug: string,
): string | null {
  return bodies[slug] ?? null
}

/** Type helper для bodies JSON — Kn1ReadChapter.vue imports and casts к this. */
export type Kn1BodiesArtifact = BodiesArtifact
