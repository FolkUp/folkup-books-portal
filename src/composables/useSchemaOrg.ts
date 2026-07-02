import { useHead } from '@unhead/vue'
import type { Book, SeriesMeta } from './useSeriesData'

/**
 * Schema.org JSON-LD injection composables.
 * Per Дьюи: BookSeries + Book + Person + isPartOf + position (competitive gap fill vs Standard Ebooks).
 */

const BASE_URL = 'https://books.folkup.life'

export function useBookSeriesSchema(series: SeriesMeta, books: Book[]) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BookSeries',
    '@id': `${BASE_URL}/#series`,
    name: series.name,
    url: BASE_URL + '/',
    author: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#author`,
      name: series.author,
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

export function useBookSchema(book: Book, series: SeriesMeta, title: string) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${BASE_URL}/${book.slug}/#book`,
    name: title,
    url: `${BASE_URL}/${book.slug}/`,
    isPartOf: {
      '@type': 'BookSeries',
      '@id': `${BASE_URL}/#series`,
      name: series.name,
    },
    position: book.position,
    author: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#author`,
      name: series.author,
    },
    inLanguage: 'ru',
    license: series.license_url,
  }

  if (book.status === 'live' && book.launch_date) {
    jsonLd.datePublished = book.launch_date
    jsonLd.bookEdition = book.version
    if (book.downloads?.epub) {
      jsonLd.workExample = [
        {
          '@type': 'Book',
          bookFormat: 'https://schema.org/EBook',
          encoding: 'EPUB',
          url: book.downloads.epub,
          potentialAction: {
            '@type': 'ReadAction',
            target: book.downloads.epub,
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
