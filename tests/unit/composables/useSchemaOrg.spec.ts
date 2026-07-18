import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock useHead за тем чтобы захватить injected content
const injected: Record<string, unknown>[] = []
vi.mock('@unhead/vue', () => ({
  useHead: (config: Record<string, unknown>) => {
    injected.push(config)
  },
}))

import { useBookSeriesSchema, useBookSchema } from '@/composables/useSchemaOrg'
import type { Book, SeriesMeta } from '@/composables/useSeriesData'

const testSeries: SeriesMeta = {
  name: 'Agile Sapiens',
  author: 'Андрей Клеменчёнок',
  author_url: 'https://books.folkup.life/#author',
  license: 'CC BY-SA 4.0',
  license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
  total_books: 7,
  publisher: 'FolkUp Ecosystem',
  publisher_imprint: 'Редакция FolkUp',
}

const testBook: Book = {
  position: 1,
  slug: 'kn1',
  slug_en_temp: 'agile-sapiens',
  status: 'live',
  version: '1.0.14',
  launch_date: '2026-05-24',
  downloads: {
    epub: 'https://books.folkup.life/kn1/downloads/agile-sapiens-v1.0.14.epub',
    pdf: 'https://books.folkup.life/kn1/downloads/agile-sapiens-v1.0.14.pdf',
  },
}

function extractJsonLd(index: number): Record<string, unknown> {
  const script = (injected[index].script as Array<{ innerHTML: string }>)[0]
  return JSON.parse(script.innerHTML)
}

describe('useBookSeriesSchema', () => {
  beforeEach(() => {
    injected.length = 0
  })

  it('injects BookSeries JSON-LD', () => {
    useBookSeriesSchema(testSeries, [testBook])
    const jsonLd = extractJsonLd(0)
    expect(jsonLd['@type']).toBe('BookSeries')
    expect(jsonLd['@id']).toBe('https://books.folkup.life/#series')
    expect(jsonLd.name).toBe('Agile Sapiens')
    expect(jsonLd.numberOfBooks).toBe(7)
  })

  it('BookSeries hasPart references each book', () => {
    useBookSeriesSchema(testSeries, [testBook])
    const jsonLd = extractJsonLd(0)
    const hasPart = jsonLd.hasPart as Array<Record<string, unknown>>
    expect(hasPart).toHaveLength(1)
    expect(hasPart[0]['@type']).toBe('Book')
    expect(hasPart[0]['@id']).toBe('https://books.folkup.life/kn1/#book')
    expect(hasPart[0].position).toBe(1)
  })

  it('includes CC BY-SA 4.0 license URL', () => {
    useBookSeriesSchema(testSeries, [testBook])
    const jsonLd = extractJsonLd(0)
    expect(jsonLd.license).toBe('https://creativecommons.org/licenses/by-sa/4.0/')
  })

  it('references author entity by @id', () => {
    useBookSeriesSchema(testSeries, [testBook])
    const jsonLd = extractJsonLd(0)
    const author = jsonLd.author as Record<string, unknown>
    expect(author['@id']).toBe('https://books.folkup.life/#author')
    expect(author['@type']).toBe('Person')
  })
})

describe('useBookSchema', () => {
  beforeEach(() => {
    injected.length = 0
  })

  it('injects Book JSON-LD с isPartOf BookSeries', () => {
    useBookSchema(testBook, testSeries, 'Agile Sapiens')
    const jsonLd = extractJsonLd(0)
    expect(jsonLd['@type']).toBe('Book')
    expect(jsonLd.position).toBe(1)
    const isPartOf = jsonLd.isPartOf as Record<string, unknown>
    expect(isPartOf['@id']).toBe('https://books.folkup.life/#series')
  })

  it('includes datePublished + bookEdition для live book', () => {
    useBookSchema(testBook, testSeries, 'Agile Sapiens')
    const jsonLd = extractJsonLd(0)
    expect(jsonLd.datePublished).toBe('2026-05-24')
    expect(jsonLd.bookEdition).toBe('1.0.14')
  })

  it('includes workExample с ReadAction для live book с EPUB', () => {
    useBookSchema(testBook, testSeries, 'Agile Sapiens')
    const jsonLd = extractJsonLd(0)
    const workExample = jsonLd.workExample as Array<Record<string, unknown>>
    expect(workExample).toHaveLength(1)
    expect(workExample[0].bookFormat).toBe('https://schema.org/EBook')
    expect(workExample[0].encoding).toBe('EPUB')
    const action = workExample[0].potentialAction as Record<string, unknown>
    expect(action['@type']).toBe('ReadAction')
  })

  it('post-cutover — no sameAs (canonical_pre_cutover removed)', () => {
    useBookSchema(testBook, testSeries, 'Agile Sapiens')
    const jsonLd = extractJsonLd(0)
    expect(jsonLd.sameAs).toBeUndefined()
  })

  it('stub book has future datePublished без workExample', () => {
    const stubBook: Book = {
      position: 5,
      slug: 'kn5',
      slug_en_temp: 'by-others-hands',
      status: 'launch_target',
      launch_date_target: '2026-07-04',
    }
    useBookSchema(stubBook, testSeries, 'Чужими руками')
    const jsonLd = extractJsonLd(0)
    expect(jsonLd.datePublished).toBe('2026-07-04')
    expect(jsonLd.workExample).toBeUndefined()
  })
})
