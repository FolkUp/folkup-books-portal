#!/usr/bin/env node
/**
 * kn.3 «Город Солнца» reader manifest + chapters generator — pre-build step.
 *
 * Source: content/kn3/ru/MASTER.md (monolithic 7075 строк, split by top-level `# ` headings).
 * Output:
 *   - content/kn3/ru/chapters-generated/{slug}.md   — one per chapter section
 *   - content/kn3/ru/chapters-manifest.json          — metadata index
 *
 * Slug scheme (stable across MASTER edits):
 *   «Город Солнца»               → intro (title page)
 *   «Колофон»                     → colophon
 *   «Предисловие. Как сделана…»  → preface
 *   «Глава N. …»                 → chapter-N
 *   «Эпилог. …»                  → epilogue
 *   «Приложение АN. …»           → apparatus-aN (or apparatus-aN-bis/ter)
 *
 * chapters-generated/ = derived state, git-ignored.
 * Origin: reader restoration cont+30 S3SCOOP Track G — parallel to kn.1 pipeline (multi-file).
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')
const MASTER_PATH = resolve(PROJECT_ROOT, 'content/kn3/ru/MASTER.md')
const CHAPTERS_DIR = resolve(PROJECT_ROOT, 'content/kn3/ru/chapters-generated')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'content/kn3/ru/chapters-manifest.json')

/**
 * Detect slug + role from chapter heading.
 * Returns { slug, isApparatus, order } или null если heading невalid.
 */
function classifyHeading(heading, index) {
  const text = heading.trim()

  // Title page — first heading of book
  if (/^Город Солнца/i.test(text)) {
    return { slug: 'intro', isApparatus: false, order: 10 }
  }

  // Колофон — legal + author disclosure
  if (/^Колофон/i.test(text)) {
    return { slug: 'colophon', isApparatus: true, order: 20 }
  }

  // Предисловие
  if (/^Предисловие/i.test(text)) {
    return { slug: 'preface', isApparatus: false, order: 30 }
  }

  // Главы — «Глава N. ...»
  const chapterMatch = text.match(/^Глава\s+(\d+)/i)
  if (chapterMatch) {
    const n = parseInt(chapterMatch[1], 10)
    return { slug: `chapter-${n}`, isApparatus: false, order: 100 + n * 10 }
  }

  // Эпилог
  if (/^Эпилог/i.test(text)) {
    return { slug: 'epilogue', isApparatus: false, order: 800 }
  }

  // Приложения — «Приложение АN. ...», «Приложение АN-bis/ter»
  const apparatusMatch = text.match(/^Приложение\s+[АA](\d+)(-bis|-ter)?/i)
  if (apparatusMatch) {
    const n = apparatusMatch[1]
    const suffix = apparatusMatch[2] || ''
    // Order: bis (11) > ter (12) для sub-sequencing within same number
    const subOrder = suffix === '-bis' ? 1 : suffix === '-ter' ? 2 : 0
    return {
      slug: `apparatus-a${n}${suffix}`,
      isApparatus: true,
      order: 900 + parseInt(n, 10) * 10 + subOrder,
    }
  }

  // Fallback — unknown top-level heading (shouldn't happen in canonical MASTER)
  console.warn(`[kn3-reader-manifest] Unknown heading pattern: «${text}»`)
  return {
    slug: `unknown-${index}`,
    isApparatus: false,
    order: 999000 + index,
  }
}

/**
 * Extract first paragraph (or subtitle) для description meta.
 * Reads body до first `\n\n`, strips markdown syntax lightly.
 */
function extractDescription(body) {
  const trimmed = body.trim()
  if (!trimmed) return null
  const firstBlock = trimmed.split(/\n\n+/)[0]
  // Skip italic/blockquote/list markers
  const cleaned = firstBlock
    .replace(/^[*_>*-]\s*/gm, '')
    .replace(/[*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  // Truncate к 200 chars for meta description
  return cleaned.length > 200 ? cleaned.slice(0, 197) + '…' : cleaned
}

function split() {
  const master = readFileSync(MASTER_PATH, 'utf-8')
  const lines = master.split('\n')

  // Find all top-level `# ` heading line indices
  const headingIndices = []
  for (let i = 0; i < lines.length; i++) {
    if (/^# [^#]/.test(lines[i])) {
      headingIndices.push(i)
    }
  }

  const entries = []
  for (let i = 0; i < headingIndices.length; i++) {
    const startLine = headingIndices[i]
    const endLine = i + 1 < headingIndices.length ? headingIndices[i + 1] : lines.length

    const headingRaw = lines[startLine].replace(/^# /, '').trim()
    const bodyLines = lines.slice(startLine + 1, endLine)
    const body = bodyLines.join('\n').trim()

    const cls = classifyHeading(headingRaw, i)
    entries.push({
      slug: cls.slug,
      title: headingRaw,
      description: extractDescription(body),
      order: cls.order,
      isApparatus: cls.isApparatus,
      _body: body,
    })
  }

  return entries.sort((a, b) => a.order - b.order)
}

/**
 * Slugs excluded from reader bundle — too large (blow 60 KB gzip bundle gate).
 * Указатель имён (517 KB raw / 156 KB gzip) — user должен consult EPUB для полного индекса.
 * Reader TOC purposefully omits these; kn.3 landing page links к EPUB download.
 */
const READER_EXCLUDED_SLUGS = new Set(['apparatus-a1'])

function main() {
  console.log('[kn3-reader-manifest] Reading MASTER from', MASTER_PATH)

  // Clean + recreate chapters-generated/
  if (existsSync(CHAPTERS_DIR)) rmSync(CHAPTERS_DIR, { recursive: true, force: true })
  mkdirSync(CHAPTERS_DIR, { recursive: true })

  const allEntries = split()
  const entries = allEntries.filter((e) => !READER_EXCLUDED_SLUGS.has(e.slug))
  const excluded = allEntries.filter((e) => READER_EXCLUDED_SLUGS.has(e.slug))

  console.log(`[kn3-reader-manifest] Split into ${allEntries.length} total entries`)
  if (excluded.length > 0) {
    console.log(`[kn3-reader-manifest] Excluded ${excluded.length} entries from reader (bundle gate):`)
    for (const e of excluded) {
      console.log(`  - ${e.slug} · «${e.title}» · body ${e._body.length} bytes`)
    }
  }
  console.log(`[kn3-reader-manifest] Reader manifest: ${entries.length} entries`)

  // Write per-chapter markdown files (only reader-included)
  for (const entry of entries) {
    const out = join(CHAPTERS_DIR, `${entry.slug}.md`)
    const contentWithHeading = `# ${entry.title}\n\n${entry._body}\n`
    writeFileSync(out, contentWithHeading, 'utf-8')
  }

  // Write manifest (без _body)
  const manifest = {
    generated: new Date().toISOString(),
    book: 'kn3',
    locale: 'ru',
    entries: entries.map((e) => ({
      slug: e.slug,
      title: e.title,
      description: e.description,
      order: e.order,
      isApparatus: e.isApparatus,
    })),
    excluded: excluded.map((e) => ({
      slug: e.slug,
      title: e.title,
      reason: 'body too large for 60 KB gzip bundle gate — consult EPUB',
    })),
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`[kn3-reader-manifest] Wrote ${entries.length} chapter files к ${CHAPTERS_DIR}`)
  console.log(`[kn3-reader-manifest] Wrote manifest к ${MANIFEST_PATH}`)
}

main()
