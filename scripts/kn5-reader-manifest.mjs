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

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, join } from 'node:path'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')
const MASTER_PATH = resolve(PROJECT_ROOT, 'content/kn5/ru/master.md')
const CHAPTERS_DIR = resolve(PROJECT_ROOT, 'content/kn5/ru/chapters-generated')
const MANIFEST_PATH = resolve(PROJECT_ROOT, 'content/kn5/ru/chapters-manifest.json')
const BODIES_DIR = resolve(PROJECT_ROOT, 'content/kn5/ru/chapters-html')
const PLATES_DIR = resolve(PROJECT_ROOT, 'public/images/kn5-chapters')

const KN5_PLATE_METAPHORS = {
  '01': 'Палимпсест',
  '02': 'Скрипториум',
  '03': 'Пробел на витрине',
  '04': 'Бебельплац',
  '05': 'Чикчи',
  '06': 'Печатный станок',
  '07': 'Вульф',
  '08': 'Sacre du Printemps',
  '09': 'Критик',
  '10': 'Куратор',
  '11': 'Платформа',
  '12': 'Фронтиспис',
  '13': 'Кода',
}

let _plateFilesCache = null
function loadPlateFiles() {
  if (_plateFilesCache) return _plateFilesCache
  try {
    _plateFilesCache = readdirSync(PLATES_DIR).filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
  } catch {
    _plateFilesCache = []
  }
  return _plateFilesCache
}

function findPlateFile(nn) {
  const files = loadPlateFiles()
  return files.find((f) => f.startsWith(`ill-${nn}-`) || f === `ill-${nn}.jpg` || f === `ill-${nn}.webp`) || null
}

// Configure marked sync mode + GFM (mirrors Kn5ReadChapter.vue prior client-side config)
marked.setOptions({ async: false })
marked.use({ gfm: true })

/** Strip leading H1 heading (# ...) — title renders via useHead + h1 в template. */
function stripLeadingH1(md) {
  return md.replace(/^# [^\n]+\n+/, '')
}

/**
 * Strip pandoc header attributes {#id .class} from end of ATX headings.
 * Per Iskra S312-06 §3 mandate: prevent pandoc syntax from reaching reader HTML.
 * Regex matches `#{1,6} <text> {#anchor .class ...}` at end of line, removing только `{...}` suffix.
 * Example: `# Чужими руками {#chuzhimi-rukami .cover-title}` → `# Чужими руками`
 */
function stripPandocHeaderAttrs(md) {
  return md.replace(/^(#{1,6}\s+.+?)\s*\{[#.][^}]*\}\s*$/gm, '$1')
}

/** Render markdown body к HTML via marked (sync). Strips HTML comments, leading H1, pandoc attrs. */
function renderBody(rawMarkdown) {
  return marked.parse(stripPandocHeaderAttrs(stripLeadingH1(rawMarkdown)))
}

/**
 * Wire illustration text refs («Иллюстрация · ill-NN») к proper figure elements.
 *
 * — Existing plate file (ill-NN-*.{webp,jpg}) → <figure class="reader-chapter__plate"><img>
 * — Missing plate (per README kn.5 §Illustrations «rejected en bloc per Frida brief 2026-06-12»
 *   для ill-03/09/10/13) → restoration stub <figure class="reader-chapter__plate reader-chapter__plate--restoration">
 *
 * Regex matches marked-rendered pattern: <p>Иллюстрация · ill-NN  </p>
 * (trailing double-space preserved by marked from source markdown pandoc output).
 */
function wireIllustrationRefs(html) {
  return html.replace(
    /<p>Иллюстрация\s*·\s*ill-(\d+)\s*<\/p>/g,
    (_match, nn) => {
      const metaphor = KN5_PLATE_METAPHORS[nn] || `ill-${nn}`
      const file = findPlateFile(nn)
      if (file) {
        return (
          `<figure class="reader-chapter__plate">` +
          `<img src="/images/kn5-chapters/${file}" alt="Иллюстрация ${nn}: ${metaphor}" ` +
          `loading="lazy" decoding="async">` +
          `<figcaption>${metaphor}</figcaption>` +
          `</figure>`
        )
      }
      // Canon Iskra S138 seal «ЭКСПОНАТ НА РЕСТАВРАЦИИ · 2026» reused from 404/about.
      // Unique textPath id per plate (kn5-NN) avoids collision if multiple stubs render on one page.
      return (
        `<figure class="reader-chapter__plate reader-chapter__plate--restoration" ` +
        `role="img" aria-label="Иллюстрация ${nn} «${metaphor}» — готовится">` +
        `<div class="restoration-stub">` +
        `<svg class="restoration-stub__seal" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<defs>` +
        `<path id="stamp-ring-kn5-${nn}" d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />` +
        `</defs>` +
        `<circle cx="110" cy="110" r="100" fill="none" stroke="#7D4450" stroke-width="3" />` +
        `<circle cx="110" cy="110" r="93" fill="none" stroke="#7D4450" stroke-width="1.5" />` +
        `<text font-family="Vollkorn, Georgia, serif" font-size="15" font-weight="700" fill="#7D4450" letter-spacing="2">` +
        `<textPath href="#stamp-ring-kn5-${nn}" startOffset="0">ЭКСПОНАТ НА РЕСТАВРАЦИИ · ЭКСПОНАТ НА РЕСТАВРАЦИИ · </textPath>` +
        `</text>` +
        `<text x="110" y="120" font-family="Playfair Display, Georgia, serif" font-size="42" font-weight="700" fill="#7D4450" text-anchor="middle">2026</text>` +
        `</svg>` +
        `<span class="restoration-stub__metaphor">${metaphor}</span>` +
        `<span class="restoration-stub__hint">иллюстрация готовится</span>` +
        `</div>` +
        `</figure>`
      )
    },
  )
}

/** Serialize HTML string к safe ES module. precommit:allow-ai-mentions marker для index safety. */
function serializeHtmlModule(html) {
  return `// Auto-generated by scripts/kn5-reader-manifest.mjs — DO NOT EDIT.
// Pre-rendered HTML body для kn5 chapter. Loaded via dynamic import per-chunk.
// precommit:allow-ai-mentions
export default ${JSON.stringify(html)}
`
}

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
  if (existsSync(BODIES_DIR)) rmSync(BODIES_DIR, { recursive: true, force: true })
  mkdirSync(BODIES_DIR, { recursive: true })

  const entries = split()
  console.log(`[kn5-reader-manifest] Split into ${entries.length} sections`)

  let totalHtmlSize = 0
  let maxHtmlSize = 0
  let maxHtmlSlug = ''
  for (const entry of entries) {
    const md = `# ${entry.title}\n\n${entry._body}\n`
    writeFileSync(join(CHAPTERS_DIR, `${entry.slug}.md`), md, 'utf-8')

    const html = wireIllustrationRefs(renderBody(md))
    const modContent = serializeHtmlModule(html)
    writeFileSync(join(BODIES_DIR, `${entry.slug}.js`), modContent, 'utf-8')
    const size = Buffer.byteLength(modContent, 'utf-8')
    totalHtmlSize += size
    if (size > maxHtmlSize) {
      maxHtmlSize = size
      maxHtmlSlug = entry.slug
    }
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
  console.log(
    `[kn5-reader-manifest] Wrote ${entries.length} HTML modules к ${BODIES_DIR}`,
  )
  console.log(
    `[kn5-reader-manifest]   total: ${(totalHtmlSize / 1024).toFixed(1)} KB, max: ${(maxHtmlSize / 1024).toFixed(1)} KB (${maxHtmlSlug})`,
  )
}

main()
