#!/usr/bin/env node
/**
 * kn.1 reader manifest generator — pre-build step.
 *
 * Reads content/kn1/ru/chapters/**\/*.md, extracts frontmatter (title, weight, act, etc),
 * generates content/kn1/ru/chapters-manifest.json — small (~5 KB) index файл для TOC.
 *
 * Rationale: eager glob-bundling ALL chapters (860 KB) blows 60 KB gzip bundle gate.
 * Manifest carries only metadata (small); chapter bodies lazy-loaded per-chunk at runtime.
 *
 * Called: prebuild hook в package.json (npm run build → prebuild → build).
 * Origin: reader restoration cont+30 S3SCOOP.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')
const CHAPTERS_DIR = resolve(PROJECT_ROOT, 'content/kn1/ru/chapters')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'content/kn1/ru/chapters-manifest.json')

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
  if (slug === 'preface') return 50
  if (slug === 'afterword') return 8000
  if (slug.startsWith('apparatus-')) {
    const idx = APPARATUS_ORDER.indexOf(slug)
    return 9000 + (idx >= 0 ? idx * 10 : 999)
  }
  return typeof fm.weight === 'number' ? fm.weight : 9999
}

/** Files к skip — Hugo internal section indices, not reader content */
const SKIP_FILES = new Set(['_index.md', '_index.ru.md'])

function collect() {
  const entries = []

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
  }

  entries.sort((a, b) => a.order - b.order)
  return entries
}

function main() {
  console.log('[kn1-reader-manifest] Reading chapters from', CHAPTERS_DIR)
  const entries = collect()
  console.log(`[kn1-reader-manifest] Collected ${entries.length} entries`)

  const manifest = {
    generated: new Date().toISOString(),
    book: 'kn1',
    locale: 'ru',
    entries,
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`[kn1-reader-manifest] Wrote ${MANIFEST_PATH} (${entries.length} entries)`)
}

main()
