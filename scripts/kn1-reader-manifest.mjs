#!/usr/bin/env node
/**
 * kn.1 reader manifest generator — pre-build step.
 *
 * Reads content/kn1/{lang}/chapters/**\/*.md, extracts frontmatter (title, weight, act, etc),
 * generates:
 *   1. content/kn1/{lang}/chapters-manifest.json — metadata only (~12 KB) для TOC + navigation
 *   2. content/kn1/{lang}/chapters-html/{slug}.js — pre-rendered HTML per chapter, ES modules
 *      с default export string. Loaded via dynamic import glob → each chapter own chunk
 *      (Vite splits automatically) → per-chunk under 60 KB gzip bundle gate.
 *
 * CLI:
 *   node scripts/kn1-reader-manifest.mjs [--lang=<code>]
 *   Default: --lang=ru (backward compat)
 *   Supported: ru, pt, en (any lang with content/kn1/{lang}/chapters/ dir)
 *   Graceful skip: if content/kn1/{lang}/chapters/ absent OR empty — script logs and exits 0.
 *
 * Rationale (VIT-KLB kn1 reader P0 fix cont+49):
 *   - Old async watcher pattern в Kn1ReadChapter.vue не suspend'ился SSR → HTML прибит
 *     на «Загрузка…» → GoogleBot видит placeholder вместо контента (indexing fail).
 *   - New pattern: SSR uses onServerPrefetch → await dynamic import → renderToString
 *     resolves body. Client uses watch(slug, ...) + async import — chunk lazy-loaded
 *     per-navigation, chunk cache warms after first visit.
 *   - Per-chapter split keeps each chunk under 60 KB gzip gate (chapters range 5-50 KB
 *     raw HTML; gzip typically 30-40% of raw).
 *
 * Called: prebuild hook в package.json — invoked per lang (ru, pt, en).
 * Origin: reader restoration cont+30 S3SCOOP; bodyHtml pre-render + per-chapter split
 *   cont+49 Кочегар guidance. READER-UNIFY-1 cont+16: lang-parametrized (PT support).
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

// --- CLI parsing ---
function parseLangArg() {
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--lang=([a-z]{2})$/)
    if (match) return match[1]
  }
  return 'ru' // backward-compat default
}
const LANG = parseLangArg()
const CHAPTERS_DIR = resolve(PROJECT_ROOT, `content/kn1/${LANG}/chapters`)
const MANIFEST_PATH = resolve(PROJECT_ROOT, `content/kn1/${LANG}/chapters-manifest.json`)
const BODIES_DIR = resolve(PROJECT_ROOT, `content/kn1/${LANG}/chapters-html`)
const PLATES_DIR = resolve(PROJECT_ROOT, 'public/images/kn1-chapters')

// Configure marked sync mode (default async в v18; forced sync via async: false)
marked.setOptions({ async: false })

/**
 * Auto-detect plate filename by chapter slug (Option C per Iskra S299-01 §4).
 * Convention: kn1-chapters/kn1-NN-<topic>.webp matches slug chapter-N-<topic>.
 * Special case: afterword → kn1-afterword.webp.
 * preface + intermezzo-N never match — returns null (correctly excluded per Iskra Q2 canon).
 * Cached — loaded once per script invocation.
 * Frontmatter `plate:` field remains explicit override (source of truth per Iskra §4 §1).
 */
let plateFilesCache = null
function loadPlateFiles() {
  if (plateFilesCache) return plateFilesCache
  try {
    plateFilesCache = readdirSync(PLATES_DIR).filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
  } catch {
    plateFilesCache = []
    console.warn(`[kn1-reader-manifest] plate dir absent OR empty: ${PLATES_DIR}`)
  }
  return plateFilesCache
}

function detectPlate(slug) {
  // Regular chapter-N-<topic> → kn1-NN-<topic>.ext
  const chapterMatch = slug.match(/^chapter-(\d+)-(.+)$/)
  if (chapterMatch) {
    const [, num, topic] = chapterMatch
    const numPadded = num.padStart(2, '0')
    const stem = `kn1-${numPadded}-${topic}`
    const files = loadPlateFiles()
    return files.find((f) => f.startsWith(`${stem}.`)) || null
  }
  // Special case: afterword → kn1-afterword.ext
  if (slug === 'afterword') {
    const files = loadPlateFiles()
    return files.find((f) => f.startsWith('kn1-afterword.')) || null
  }
  // preface, intermezzo-N — no plate per Iskra RATIFIKACIYA Q2 canon
  return null
}

/** Apparatus reading order (canonical, matches epub-generator.sh convention)
 *
 * Wave C EN parametrization (Kochegar cont+6 per S1ENFIX URGENT supplement 30.08):
 * Explicit weight map вместо ordinal indexing — subject-index EN получает 9030 без
 * сдвига RU items (transparency 9050 / colophon 9060 preserved). Prebuild регенерирует
 * manifest.json на каждый CF Pages `npm run build` — subject-index EN был в fallback
 * bucket 9999 до этого fix (RU-only APPARATUS_ORDER не содержал EN slug), TOC position
 * landed на самом конце вместо после sources.
 *
 * Каждая locale видит только свой subset (RU: slovar-terminov + predmetnyy-ukazatel;
 * EN: subject-index) — так что дублирование weight 9030 across locales безопасно.
 */
const APPARATUS_WEIGHTS = {
  'apparatus-acknowledgments': 9000,
  'apparatus-methodology': 9010,
  'apparatus-sources': 9020,
  'apparatus-subject-index': 9030,       // EN (subject-index)
  'apparatus-slovar-terminov': 9030,     // RU (glossary) — не conflict, разные locale manifests
  'apparatus-predmetnyy-ukazatel': 9040, // RU (subject index)
  'apparatus-transparency': 9050,
  'apparatus-colophon': 9060,
}
// Backward-compat: keep APPARATUS_ORDER array для any external code that reads it.
const APPARATUS_ORDER = Object.keys(APPARATUS_WEIGHTS)

function parseFrontmatter(raw) {
  // Normalize CRLF → LF for cross-platform frontmatter parsing (PT/EN files may use CRLF).
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { title: '' }
  const fm = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i)
    if (!kv) continue
    let [, key, value] = kv
    value = value.trim()
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1)
    if (/^-?\d+$/.test(value)) value = Number(value)
    else if (value === 'true') value = true
    else if (value === 'false') value = false
    fm[key] = value
  }
  return fm
}

function orderKey(slug, fm) {
  // preface — first, before chapter-0-pilot (weight=10). Fix Iskra S230 AKT §1 P1-1.
  if (slug === 'preface') return 5
  if (slug === 'afterword') return 8000
  if (slug.startsWith('apparatus-')) {
    // Wave C fix (Kochegar cont+6): explicit weight lookup вместо ordinal indexing —
    // subject-index EN получает 9030 без сдвига RU items. Fallback 9999 (был 9000+999).
    return APPARATUS_WEIGHTS[slug] ?? 9999
  }
  return typeof fm.weight === 'number' ? fm.weight : 9999
}

/** Files к skip — Hugo internal section indices, not reader content */
const SKIP_FILES = new Set(['_index.md', '_index.ru.md'])

/** Strip YAML frontmatter из raw markdown, return body only. Normalizes CRLF → LF. */
function stripFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/)
  return match ? match[1] : normalized
}

/** Render markdown body к HTML via marked (sync). */
function renderBody(rawMarkdown) {
  const body = stripFrontmatter(rawMarkdown)
  return marked.parse(body)
}

/**
 * Serialize HTML string к safe ES module.
 * Uses JSON.stringify для escape всех спецсимволов (backticks, backslashes, unicode).
 */
function serializeHtmlModule(html) {
  return `// Auto-generated by scripts/kn1-reader-manifest.mjs — DO NOT EDIT.
// Pre-rendered HTML body для kn1 chapter. Loaded via dynamic import per-chunk.
export default ${JSON.stringify(html)}
`
}

function collect() {
  const entries = []
  const bodies = {}

  // Root chapters
  for (const file of readdirSync(CHAPTERS_DIR)) {
    if (!file.endsWith('.md')) continue
    if (SKIP_FILES.has(file)) continue
    const slug = file.replace(/\.md$/, '')
    const raw = readFileSync(resolve(CHAPTERS_DIR, file), 'utf-8')
    const fm = parseFrontmatter(raw)
    entries.push({
      slug,
      title: fm.title || slug,
      description: fm.description || null,
      weight: fm.weight ?? null,
      act: fm.act || null,
      act_opener: fm.act_opener || false,
      isApparatus: false,
      plate: fm.plate || detectPlate(slug),
      order: orderKey(slug, fm),
    })
    bodies[slug] = renderBody(raw)
  }

  // Apparatus subfolder — optional (PT/EN may not have apparatus yet)
  const apparatusDir = resolve(CHAPTERS_DIR, 'apparatus')
  if (existsSync(apparatusDir)) {
    for (const file of readdirSync(apparatusDir)) {
      if (!file.endsWith('.md')) continue
      if (SKIP_FILES.has(file)) continue
      const baseSlug = file.replace(/\.md$/, '')
      const slug = `apparatus-${baseSlug}`
      const raw = readFileSync(resolve(apparatusDir, file), 'utf-8')
      const fm = parseFrontmatter(raw)
      entries.push({
        slug,
        title: fm.title || baseSlug,
        description: fm.description || null,
        weight: fm.weight ?? null,
        act: null,
        act_opener: false,
        isApparatus: true,
        plate: fm.plate || null,
        order: orderKey(slug, fm),
      })
      bodies[slug] = renderBody(raw)
    }
  }

  entries.sort((a, b) => a.order - b.order)
  return { entries, bodies }
}

function main() {
  // Graceful skip if lang has no chapters dir (PT/EN scaffold pending)
  if (!existsSync(CHAPTERS_DIR)) {
    console.log(`[kn1-reader-manifest][${LANG}] Chapters dir absent: ${CHAPTERS_DIR}`)
    console.log(`[kn1-reader-manifest][${LANG}] Graceful skip — no manifest generated.`)
    return
  }

  console.log(`[kn1-reader-manifest][${LANG}] Reading chapters from ${CHAPTERS_DIR}`)
  const { entries, bodies } = collect()

  if (entries.length === 0) {
    console.log(`[kn1-reader-manifest][${LANG}] No chapters found — graceful skip.`)
    return
  }

  console.log(`[kn1-reader-manifest][${LANG}] Collected ${entries.length} entries`)

  const generated = new Date().toISOString()

  const manifest = {
    generated,
    book: 'kn1',
    locale: LANG,
    entries,
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`[kn1-reader-manifest][${LANG}] Wrote ${MANIFEST_PATH} (${entries.length} entries)`)

  // Per-chapter HTML modules — clean-write directory (deleted entries drop out).
  if (existsSync(BODIES_DIR)) rmSync(BODIES_DIR, { recursive: true, force: true })
  mkdirSync(BODIES_DIR, { recursive: true })
  let totalSize = 0
  let maxSize = 0
  let maxSlug = ''
  for (const [slug, html] of Object.entries(bodies)) {
    const modulePath = resolve(BODIES_DIR, `${slug}.js`)
    const content = serializeHtmlModule(html)
    writeFileSync(modulePath, content, 'utf-8')
    const size = Buffer.byteLength(content, 'utf-8')
    totalSize += size
    if (size > maxSize) {
      maxSize = size
      maxSlug = slug
    }
  }
  console.log(
    `[kn1-reader-manifest][${LANG}] Wrote ${Object.keys(bodies).length} chapter HTML modules to ${BODIES_DIR}`,
  )
  console.log(
    `[kn1-reader-manifest][${LANG}]   total: ${(totalSize / 1024).toFixed(1)} KB, max: ${(maxSize / 1024).toFixed(1)} KB (${maxSlug})`,
  )
}

main()
