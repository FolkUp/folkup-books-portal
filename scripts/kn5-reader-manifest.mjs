#!/usr/bin/env node
/**
 * kn.5 «Чужими руками» reader manifest + chapters generator — pre-build step.
 *
 * Source: content/kn5/ru/master.md (copied from vault
 * KN5-Chuzhimi-rukami-FULL-v1.1-cont15-vorota-fix-2026-07-22.md).
 * Format: pandoc HTML→MD с fenced div syntax (::: {.section data-title="X"}).
 *
 * Split by top-level ::: {.section data-title="..."} markers.
 * Strip inner :::+ div wrappers (preserve only textual content).
 *
 * Slug scheme:
 *   «Обложка» / «Титул» / «Посвящение» / «Фронтиспис» → front-matter (grouped)
 *   «Предисловие» → preface
 *   «Интермедия. …» → intermezzo-N
 *   «I. Переписчик» … «VIII. Платформа» → chapter-N-slug (Roman numerals → arabic + short slug)
 *   «Кода. …» → coda
 *   «Колофон» → colophon (apparatus)
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')
const MASTER_PATH = resolve(PROJECT_ROOT, 'content/kn5/ru/master.md')
const CHAPTERS_DIR = resolve(PROJECT_ROOT, 'content/kn5/ru/chapters-generated')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'content/kn5/ru/chapters-manifest.json')

const ROMAN_TO_ARABIC = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 }

/** Transliterate cyrillic title → ASCII slug для URL. */
function toSlug(text) {
  const map = {
    А: 'a', Б: 'b', В: 'v', Г: 'g', Д: 'd', Е: 'e', Ё: 'yo', Ж: 'zh',
    З: 'z', И: 'i', Й: 'y', К: 'k', Л: 'l', М: 'm', Н: 'n', О: 'o',
    П: 'p', Р: 'r', С: 's', Т: 't', У: 'u', Ф: 'f', Х: 'h', Ц: 'ts',
    Ч: 'ch', Ш: 'sh', Щ: 'sch', Ъ: '', Ы: 'y', Ь: '', Э: 'e', Ю: 'yu', Я: 'ya',
  }
  return text
    .split('')
    .map((c) => {
      const upper = c.toUpperCase()
      if (map[upper] !== undefined) {
        return c === upper ? map[upper] : map[upper].toLowerCase()
      }
      return c
    })
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function classifyHeading(title, index) {
  const text = title.trim()

  // Front matter (обложка / титул / посвящение / фронтиспис — group as intro)
  if (/^Обложка$/i.test(text)) return { slug: 'cover', isApparatus: false, order: 5 }
  if (/^Титул$/i.test(text)) return { slug: 'title-page', isApparatus: false, order: 10 }
  if (/^Посвящение$/i.test(text)) return { slug: 'dedication', isApparatus: false, order: 15 }
  if (/^Фронтиспис$/i.test(text)) return { slug: 'frontispiece', isApparatus: false, order: 20 }

  if (/^Предисловие/i.test(text)) return { slug: 'preface', isApparatus: false, order: 30 }
  if (/^Колофон/i.test(text)) return { slug: 'colophon', isApparatus: true, order: 900 }

  // Кода
  if (/^Кода/i.test(text)) return { slug: 'coda', isApparatus: false, order: 850 }

  // Интермедии
  const intermezzoMatch = text.match(/^Интермедия\.\s*(.*)$/i)
  if (intermezzoMatch) {
    const label = intermezzoMatch[1].trim()
    let slug
    if (/пролог/i.test(label)) slug = 'intermezzo-prologue'
    else {
      // «После "Цензора"» / «Перед Кодой» — derive slug from label
      const s = toSlug(label.replace(/[«»"]/g, ''))
      slug = `intermezzo-${s}`
    }
    return { slug, isApparatus: false, order: 100 + index }
  }

  // Главы «I. Название» — «VIII. Название»
  const chapterMatch = text.match(/^([IVX]+)\.\s+(.+)$/i)
  if (chapterMatch) {
    const roman = chapterMatch[1].toUpperCase()
    const name = chapterMatch[2].trim()
    const n = ROMAN_TO_ARABIC[roman] || index
    return {
      slug: `chapter-${n}-${toSlug(name)}`,
      isApparatus: false,
      order: 200 + n * 10,
    }
  }

  console.warn(`[kn5-reader-manifest] Unknown title pattern: «${text}»`)
  return { slug: `unknown-${index}`, isApparatus: false, order: 999000 + index }
}

/**
 * Strip pandoc fenced div wrappers (`:::+` opening/closing) — preserve inner text.
 * kn.5 uses nested divs for typography styling; reader doesn't need styling classes.
 */
function stripFencedDivs(text) {
  return text
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()
      if (/^:::+(\s+\{[^}]*\})?$/.test(trimmed)) return false
      if (/^:::+\s+[a-zA-Z_-]/.test(trimmed)) return false
      if (/^:::+$/.test(trimmed)) return false
      return true
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Unescape pandoc HTML→MD backslash escapes.
 * Pandoc escapes `#<>-*_[]` etc when converting HTML→MD to avoid markdown interpretation.
 * For reader rendering via marked, восстанавливаем canonical markdown/HTML syntax.
 */
function unescapePandoc(text) {
  return text
    // Escaped hash (headings): \# → #
    .replace(/\\#/g, '#')
    // Escaped HTML angles: \< → < , \> → >
    .replace(/\\</g, '<').replace(/\\>/g, '>')
    // Escaped dashes: \- → -
    .replace(/\\-/g, '-')
    // Escaped brackets: \[ → [ , \] → ]
    .replace(/\\\[/g, '[').replace(/\\\]/g, ']')
    // Escaped braces: \{ → { , \} → }
    .replace(/\\\{/g, '{').replace(/\\\}/g, '}')
    // Escaped emphasis: \* → * , \_ → _
    .replace(/\\\*/g, '*').replace(/\\_/g, '_')
    // Escaped tilde/backtick
    .replace(/\\~/g, '~').replace(/\\`/g, '`')
    // Escaped pipe: \| → |
    .replace(/\\\|/g, '|')
}

function split() {
  const master = readFileSync(MASTER_PATH, 'utf-8')
  const lines = master.split('\n')

  // Find all top-level ::: {.section data-title="X"} lines
  const sectionRegex = /^:::+\s*\{\.section[^}]*data-title="([^"]+)"/
  const sectionIndices = []
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(sectionRegex)
    if (match) {
      sectionIndices.push({ line: i, title: match[1] })
    }
  }

  const entries = []
  for (let i = 0; i < sectionIndices.length; i++) {
    const startLine = sectionIndices[i].line + 1 // skip opening ::: line
    const endLine =
      i + 1 < sectionIndices.length ? sectionIndices[i + 1].line : lines.length

    const title = sectionIndices[i].title
    const rawBody = lines.slice(startLine, endLine).join('\n')
    const cleanBody = unescapePandoc(stripFencedDivs(rawBody))

    const cls = classifyHeading(title, i)
    entries.push({
      slug: cls.slug,
      title,
      description: null, // pandoc div content не easy для description extraction
      order: cls.order,
      isApparatus: cls.isApparatus,
      _body: cleanBody,
    })
  }

  return entries.sort((a, b) => a.order - b.order)
}

function main() {
  console.log('[kn5-reader-manifest] Reading MASTER from', MASTER_PATH)

  if (existsSync(CHAPTERS_DIR)) rmSync(CHAPTERS_DIR, { recursive: true, force: true })
  mkdirSync(CHAPTERS_DIR, { recursive: true })

  const entries = split()
  console.log(`[kn5-reader-manifest] Split into ${entries.length} sections`)

  for (const entry of entries) {
    const out = join(CHAPTERS_DIR, `${entry.slug}.md`)
    const contentWithHeading = `# ${entry.title}\n\n${entry._body}\n`
    writeFileSync(out, contentWithHeading, 'utf-8')
  }

  const manifest = {
    generated: new Date().toISOString(),
    book: 'kn5',
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

  console.log(`[kn5-reader-manifest] Wrote ${entries.length} section files к ${CHAPTERS_DIR}`)
}

main()
