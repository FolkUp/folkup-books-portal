#!/usr/bin/env node
/**
 * kn.1 reader manifest generator — pre-build step.
 *
 * Reads content/kn1/ru/chapters/**\/*.md, extracts frontmatter (title, weight, act, etc),
 * generates TWO artifacts:
 *   1. content/kn1/ru/chapters-manifest.json — metadata only (~12 KB) для TOC + navigation
 *   2. content/kn1/ru/chapters-bodies.json — bodyHtml keyed by slug (~500 KB-1 MB)
 *      pre-rendered via marked at build time, used ONLY by chapter page (SSR-safe).
 *
 * Rationale (VIT-KLB kn1 reader P0 fix cont+49):
 *   - Old async watcher pattern в Kn1ReadChapter.vue не suspend'ится SSR → HTML прибит
 *     на «Загрузка…» → GoogleBot видит placeholder вместо контента (indexing fail)
 *   - New pattern: SSR reads pre-rendered bodyHtml sync из bodies manifest → HTML byte-match
 *     между SSR и client hydration → no re-render, no flash of loading state
 *   - Bodies split to separate file — TOC page importt только metadata (12 KB, no bloat)
 *
 * Called: prebuild hook в package.json (npm run build → prebuild → build).
 * Origin: reader restoration cont+30 S3SCOOP; bodyHtml split cont+49 Кочегар guidance.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')
const CHAPTERS_DIR = resolve(PROJECT_ROOT, 'content/kn1/ru/chapters')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'content/kn1/ru/chapters-manifest.json')
const BODIES_PATH = resolve(PROJECT_ROOT, 'content/kn1/ru/chapters-bodies.json')

// Configure marked sync mode (default async в v18; forced sync via async: false)
marked.setOptions({ async: false })

/** Apparatus reading order (canonical, matches epub-generator.sh convention) */
const APPARATUS_ORDER = [
  'apparatus-acknowledgments',
  'apparatus-methodology',
  'apparatus-sources',
  'apparatus-slovar-terminov',
  'apparatus-predmetnyy-ukazatel',
  'apparatus-transparency',
  'apparatus-colophon',
]

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
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
    const idx = APPARATUS_ORDER.indexOf(slug)
    return 9000 + (idx >= 0 ? idx * 10 : 999)
  }
  return typeof fm.weight === 'number' ? fm.weight : 9999
}

/** Files к skip — Hugo internal section indices, not reader content */
const SKIP_FILES = new Set(['_index.md', '_index.ru.md'])

/** Strip YAML frontmatter из raw markdown, return body only. */
function stripFrontmatter(raw) {
  const match = raw.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/)
  return match ? match[1] : raw
}

/** Render markdown body к HTML via marked (sync). */
function renderBody(rawMarkdown) {
  const body = stripFrontmatter(rawMarkdown)
  return marked.parse(body)
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
      order: orderKey(slug, fm),
    })
    bodies[slug] = renderBody(raw)
  }

  // Apparatus subfolder
  const apparatusDir = resolve(CHAPTERS_DIR, 'apparatus')
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
      order: orderKey(slug, fm),
    })
    bodies[slug] = renderBody(raw)
  }

  entries.sort((a, b) => a.order - b.order)
  return { entries, bodies }
}

function main() {
  console.log('[kn1-reader-manifest] Reading chapters from', CHAPTERS_DIR)
  const { entries, bodies } = collect()
  console.log(`[kn1-reader-manifest] Collected ${entries.length} entries`)

  const generated = new Date().toISOString()

  const manifest = {
    generated,
    book: 'kn1',
    locale: 'ru',
    entries,
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`[kn1-reader-manifest] Wrote ${MANIFEST_PATH} (${entries.length} entries)`)

  const bodiesArtifact = {
    generated,
    book: 'kn1',
    locale: 'ru',
    bodies,
  }
  writeFileSync(BODIES_PATH, JSON.stringify(bodiesArtifact), 'utf-8')
  const bodiesSize = Buffer.byteLength(JSON.stringify(bodiesArtifact), 'utf-8')
  console.log(
    `[kn1-reader-manifest] Wrote ${BODIES_PATH} (${Object.keys(bodies).length} bodies, ${(bodiesSize / 1024).toFixed(1)} KB)`,
  )
}

main()
