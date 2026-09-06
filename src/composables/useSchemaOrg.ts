import { useHead } from '@unhead/vue'
import type { Book, SeriesMeta } from './useSeriesData'

/**
 * Schema.org JSON-LD injection composables.
 * Per Дьюи: BookSeries + Book + Person + isPartOf + position (competitive gap fill vs Standard Ebooks).
 */

const BASE_URL = 'https://books.folkup.life'

// Iskra POMETKA-S315-10 §3.3 T-315-08 (Лёлик S1LOLIK cont+15 2026-09-06):
// author name locale-aware в JSON-LD — RU остаётся «Команданте FolkUp» (Cyrillic canonical
// per S178b pseudonym), non-RU локали → «Comandante FolkUp» (Latin). Matches visible
// template pattern BookPage.vue:536 (t('portal.author_display')) + i18n keys en/pt/de.json:42.
// Iskra strict gate `grep -c 'Команданте' <html /en/*> = 0` — JSON-LD Person.name часть HTML.
const authorNameForLocale = (locale: string, canonical: string): string =>
  locale === 'ru' ? canonical : 'Comandante FolkUp'

export function useBookSeriesSchema(series: SeriesMeta, books: Book[], currentLocale: string = 'ru') {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BookSeries',
    '@id': `${BASE_URL}/#series`,
    name: series.name,
    url: BASE_URL + '/',
    author: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#author`,
      name: authorNameForLocale(currentLocale, series.author),
    },
    hasPart: books.map((b) => ({
      '@type': 'Book',
      '@id': `${BASE_URL}/${b.slug}/#book`,
      name: b.slug,
      url: `${BASE_URL}/${b.slug}/`,
      position: b.position,
    })),
    numberOfBooks: series.total_books,
    license: series.license_url,
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  })
}

// Iskra VIER-AUGEN-S305-03 §3 fix: per-locale JSON-LD (inLanguage + workExample).
// Prior state: hardcoded inLanguage='ru' + workExample only RU EPUB — EN page declared
// как edition of RU download, search engines mis-indexed EN как translation of RU file.
// Fix: pass currentLocale, emit per-locale URL + inLanguage + workExample downloads
// (fallback к RU baseline). Series.yaml canon (kn1 LIVE-GATE-EN-1 G2 Iskra S289-07):
// downloads.{epub,pdf} top-level = RU baseline; downloads.{locale}.{epub,pdf} nested per lang.
export function useBookSchema(
  book: Book,
  series: SeriesMeta,
  title: string,
  currentLocale: string = 'ru',
) {
  type LocaleDownloads = { epub?: string; pdf?: string }
  const localePath = currentLocale === 'ru' ? '' : `/${currentLocale}`
  const bookUrl = `${BASE_URL}${localePath}/${book.slug}/`

  const perLocaleDownloads = (book.downloads as Record<string, unknown> | undefined)?.[
    currentLocale
  ] as LocaleDownloads | undefined
  const epubUrl = perLocaleDownloads?.epub || book.downloads?.epub

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${BASE_URL}/${book.slug}/#book`,
    name: title,
    url: bookUrl,
    isPartOf: {
      '@type': 'BookSeries',
      '@id': `${BASE_URL}/#series`,
      name: series.name,
    },
    position: book.position,
    author: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#author`,
      name: authorNameForLocale(currentLocale, series.author),
    },
    inLanguage: currentLocale,
    license: series.license_url,
  }

  if (book.status === 'live' && book.launch_date) {
    jsonLd.datePublished = book.launch_date
    jsonLd.bookEdition = book.version
    if (epubUrl) {
      jsonLd.workExample = [
        {
          '@type': 'Book',
          bookFormat: 'https://schema.org/EBook',
          encoding: 'EPUB',
          inLanguage: currentLocale,
          url: epubUrl,
          potentialAction: {
            '@type': 'ReadAction',
            target: epubUrl,
          },
        },
      ]
    }
  } else if (book.launch_date_target || book.launch_target) {
    jsonLd.datePublished = book.launch_date_target || book.launch_target
  }

  if (book.canonical_pre_cutover) {
    jsonLd.sameAs = book.canonical_pre_cutover
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  })
}
