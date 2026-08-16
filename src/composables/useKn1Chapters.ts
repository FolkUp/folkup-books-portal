/**
 * kn.1 chapters composable — manifest-driven ordered list + per-chapter body loader.
 *
 * Bundle strategy (VIT-KLB cont+49 P0 fix):
 *   - Manifest (metadata only, ~12 KB JSON) → eager import для TOC + navigation.
 *     TOC page (Kn1ReadToc.vue) touches ONLY this — не подтягивает bodies.
 *   - Bodies split per-chapter ES modules (content/kn1/{lang}/chapters-html/{slug}.js) —
 *     dynamic import via glob. Vite splits каждый в собственный chunk (~5-90 KB raw,
 *     gzip typically 30-40% — все under 60 KB gzip bundle gate).
 *
 * Multi-lang (READER-UNIFY-1 cont+16):
 *   - RU manifest stays statically imported (backward compat + zero-lang default).
 *   - PT/EN manifests + all bodies loaded via `import.meta.glob` matching all locales.
 *   - Legacy exports (useKn1Chapters, useKn1ChapterMeta, useKn1ChapterSlugs,
 *     loadKn1ChapterBodyHtml) stay RU-only (backward-compat).
 *   - New lang-aware exports (useKn1ChaptersLang, useKn1ChapterMetaLang,
 *     useKn1ChapterSlugsLang, loadKn1ChapterBodyHtmlLang) accept explicit lang.
 *
 * Origin: reader restoration cont+30 S3SCOOP (metadata manifest). cont+49 Кочегар fix —
 * async watcher pattern не suspend'ился SSR → HTML прибит на «Загрузка…». Pre-render
 * bodies at build time + per-chapter split → SSR emits real HTML + bundle gate OK.
 * cont+16 READER-UNIFY-1: PT/EN lang-parametrized (Iskra S284-01 §2 pt.3 mandate).
 */
import { ref } from 'vue'
import ruManifest from '../../content/kn1/ru/chapters-manifest.json'

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

type Lang = 'ru' | 'pt' | 'en'

const typedRuManifest = ruManifest as Manifest

// All per-lang manifests — eager import (metadata only, small).
// Vite matches `../../content/kn1/{lang}/chapters-manifest.json` at build time.
// Path key format: `../../content/kn1/pt/chapters-manifest.json` etc.
const manifestModules = import.meta.glob<{ default: Manifest }>(
  '../../content/kn1/*/chapters-manifest.json',
  { eager: true, import: 'default' }
) as unknown as Record<string, Manifest>

// All per-lang per-chapter HTML modules — dynamic glob (lazy per navigation).
// Path key format: `../../content/kn1/ru/chapters-html/preface.js`
const chapterHtmlModules = import.meta.glob<{ default: string }>(
  '../../content/kn1/*/chapters-html/*.js',
)

/** Get manifest for lang. Falls back to empty if not present (EN scaffold pending). */
function getManifest(lang: Lang): Manifest {
  if (lang === 'ru') return typedRuManifest
  const key = `../../content/kn1/${lang}/chapters-manifest.json`
  const found = manifestModules[key]
  if (found) return found as Manifest
  return { generated: '', book: 'kn1', locale: lang, entries: [] }
}

// ============================================================
// Legacy RU-only API (backward compat — existing callers)
// ============================================================

/**
 * All chapter metadata — ordered per canonical sequence (RU).
 */
export function useKn1Chapters() {
  return ref(typedRuManifest.entries)
}

/**
 * All chapter slugs — used by vite-ssg includedRoutes для prerender (RU).
 */
export function useKn1ChapterSlugs(): string[] {
  return typedRuManifest.entries.map((e) => e.slug)
}

/**
 * Single chapter meta + prev/next navigation (synchronous, from manifest) — RU.
 */
export function useKn1ChapterMeta(slug: string) {
  const idx = typedRuManifest.entries.findIndex((e) => e.slug === slug)
  if (idx < 0) return { meta: null, prev: null, next: null }
  return {
    meta: typedRuManifest.entries[idx],
    prev: idx > 0 ? typedRuManifest.entries[idx - 1] : null,
    next:
      idx < typedRuManifest.entries.length - 1
        ? typedRuManifest.entries[idx + 1]
        : null,
  }
}

/**
 * Load pre-rendered HTML body для chapter by slug (RU).
 * Returns null if slug unknown.
 */
export async function loadKn1ChapterBodyHtml(slug: string): Promise<string | null> {
  return loadKn1ChapterBodyHtmlLang('ru', slug)
}

// ============================================================
// Lang-aware API (READER-UNIFY-1 cont+16)
// ============================================================

/**
 * All chapter metadata for lang — ordered per canonical sequence.
 */
export function useKn1ChaptersLang(lang: Lang) {
  return ref(getManifest(lang).entries)
}

/**
 * All chapter slugs for lang — used by vite.config kn1ReaderRoutes.
 */
export function useKn1ChapterSlugsLang(lang: Lang): string[] {
  return getManifest(lang).entries.map((e) => e.slug)
}

/**
 * Single chapter meta + prev/next navigation for lang.
 */
export function useKn1ChapterMetaLang(lang: Lang, slug: string) {
  const entries = getManifest(lang).entries
  const idx = entries.findIndex((e) => e.slug === slug)
  if (idx < 0) return { meta: null, prev: null, next: null }
  return {
    meta: entries[idx],
    prev: idx > 0 ? entries[idx - 1] : null,
    next: idx < entries.length - 1 ? entries[idx + 1] : null,
  }
}

/**
 * Load pre-rendered HTML body для chapter by lang + slug.
 * Returns null if lang/slug unknown.
 *
 * SSR path (Kn1ReadChapter.vue onServerPrefetch) — awaited by vite-ssg's
 *   renderToString → body inlined в prerendered HTML.
 * Client path (watch(slug)) — chunk loads on-demand per navigation, browser
 *   caches after first hit.
 */
export async function loadKn1ChapterBodyHtmlLang(
  lang: Lang,
  slug: string,
): Promise<string | null> {
  const path = `../../content/kn1/${lang}/chapters-html/${slug}.js`
  const loader = chapterHtmlModules[path]
  if (!loader) return null
  const mod = await loader()
  return mod.default
}
