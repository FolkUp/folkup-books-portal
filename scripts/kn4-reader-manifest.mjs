#!/usr/bin/env node
/**
 * kn.4 «Где живёт новое» reader manifest + chapters generator — pre-build step.
 *
 * Source: vault/books/KN4-Gde-zhivet-novoe-KORPUS-vychitka-S21-MASTER.md
 * (canonical Iskra S21 body, 802 lines, top-level # headings clean).
 *
 * Split by top-level # headings. Similar pattern к kn3-reader-manifest.mjs.
 *
 * Slug scheme:
 *   «Где живёт новое — корпус для вычитки» → intro
 *   «Колофон»                                → colophon (apparatus)
 *   «Предисловие. …»                        → preface
 *   «Глава N. …»                            → chapter-N
 *   «Эпилог. …»                             → epilogue
 *   «Захлопнутые двери»                     → apparatus-appendix (короткая витрина)
 *
 * NOTE: Source lives в vault (не в portal repo). Portal reads vault path
 * at build time. Preserves canonical source-of-truth в vault; portal = view layer.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

// kn.4 canonical master copied from vault к portal content/ (self-contained для CI build).
// Source vault path: vault/books/KN4-Gde-zhivet-novoe-KORPUS-vychitka-S21-MASTER.md
const MASTER_PATH = resolve(PROJECT_ROOT, 'content/kn4/ru/master.md')
const CHAPTERS_DIR = resolve(PROJECT_ROOT, 'content/kn4/ru/chapters-generated')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'content/kn4/ru/chapters-manifest.json')

function classifyHeading(heading, index) {
  const text = heading.trim()

  if (/^Где живёт новое/i.test(text)) {
    return { slug: 'intro', isApparatus: false, order: 10 }
  }
  if (/^Колофон/i.test(text)) {
    return { slug: 'colophon', isApparatus: true, order: 20 }
  }
  if (/^Предисловие/i.test(text)) {
    return { slug: 'preface', isApparatus: false, order: 30 }
  }
  const chapterMatch = text.match(/^Глава\s+(\d+)/i)
  if (chapterMatch) {
    const n = parseInt(chapterMatch[1], 10)
    return { slug: `chapter-${n}`, isApparatus: false, order: 100 + n * 10 }
  }
  if (/^Эпилог/i.test(text)) {
    return { slug: 'epilogue', isApparatus: false, order: 800 }
  }
  if (/^Захлопнутые двери/i.test(text)) {
    return { slug: 'apparatus-appendix', isApparatus: true, order: 900 }
  }

  console.warn(`[kn4-reader-manifest] Unknown heading pattern: «${text}»`)
  return {
    slug: `unknown-${index}`,
    isApparatus: false,
    order: 999000 + index,
  }
}

function extractDescription(body) {
  const trimmed = body.trim()
  if (!trimmed) return null
  const firstBlock = trimmed.split(/\n\n+/)[0]
  const cleaned = firstBlock
    .replace(/^[*_>*-]\s*/gm, '')
    .replace(/[*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.length > 200 ? cleaned.slice(0, 197) + '…' : cleaned
}

function split() {
  const master = readFileSync(MASTER_PATH, 'utf-8')
  const lines = master.split('\n')

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

function main() {
  console.log('[kn4-reader-manifest] Reading MASTER from', MASTER_PATH)

  if (existsSync(CHAPTERS_DIR)) rmSync(CHAPTERS_DIR, { recursive: true, force: true })
  mkdirSync(CHAPTERS_DIR, { recursive: true })

  const entries = split()
  console.log(`[kn4-reader-manifest] Split into ${entries.length} entries`)

  for (const entry of entries) {
    const out = join(CHAPTERS_DIR, `${entry.slug}.md`)
    const contentWithHeading = `# ${entry.title}\n\n${entry._body}\n`
    writeFileSync(out, contentWithHeading, 'utf-8')
  }

  const manifest = {
    generated: new Date().toISOString(),
    book: 'kn4',
    locale: 'ru',
    entries: entries.map((e) => ({
      slug: e.slug,
      title: e.title,
      description: e.description,
      order: e.order,
      isApparatus: e.isApparatus,
    })),
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')

  console.log(`[kn4-reader-manifest] Wrote ${entries.length} chapter files к ${CHAPTERS_DIR}`)
  console.log(`[kn4-reader-manifest] Wrote manifest к ${MANIFEST_PATH}`)
}

main()
