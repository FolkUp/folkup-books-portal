import { describe, it, expect } from 'vitest'
import { useSeriesData } from '@/composables/useSeriesData'

describe('useSeriesData', () => {
  const { series, books, bookBySlug, liveBooks, upcomingBooks, stubBooks, pausedBooks } = useSeriesData()

  it('loads series metadata from series.yaml', () => {
    expect(series.value.name).toBe('Agile Sapiens')
    expect(series.value.total_books).toBe(7)
    expect(series.value.license).toBe('CC BY-SA 4.0')
    expect(series.value.author).toBe('Андрей Клеменчёнок')
  })

  it('loads exactly 7 books', () => {
    expect(books.value).toHaveLength(7)
  })

  it('books are ordered by position', () => {
    books.value.forEach((book, idx) => {
      expect(book.position).toBe(idx + 1)
    })
  })

  it('each book has required fields', () => {
    books.value.forEach((book) => {
      expect(book.slug).toMatch(/^kn[1-7]$/)
      expect(book.status).toMatch(/^(live|stub|launch_target|variant_b_pause)$/)
      expect(book.slug_en_temp).toBeDefined()
    })
  })

  it('bookBySlug returns correct book', () => {
    const kn1 = bookBySlug('kn1')
    expect(kn1?.position).toBe(1)
    expect(kn1?.status).toBe('live')
  })

  it('bookBySlug returns undefined for non-existent slug', () => {
    expect(bookBySlug('kn99')).toBeUndefined()
  })

  it('liveBooks filters correctly', () => {
    expect(liveBooks.value).toHaveLength(1)
    expect(liveBooks.value[0].slug).toBe('kn1')
  })

  it('upcomingBooks filters correctly', () => {
    expect(upcomingBooks.value).toHaveLength(1)
    expect(upcomingBooks.value[0].slug).toBe('kn5')
  })

  it('pausedBooks includes kn7 (Variant B)', () => {
    expect(pausedBooks.value).toHaveLength(1)
    expect(pausedBooks.value[0].slug).toBe('kn7')
  })

  it('kn1 has canonical pointing к sapiens (pre-cutover state)', () => {
    const kn1 = bookBySlug('kn1')
    expect(kn1?.canonical_pre_cutover).toBe('https://sapiens.folkup.life/')
  })

  it('kn1 has EPUB + PDF downloads', () => {
    const kn1 = bookBySlug('kn1')
    expect(kn1?.downloads?.epub).toContain('v1.0.10.epub')
    expect(kn1?.downloads?.pdf).toContain('v1.0.10.pdf')
  })

  it('kn3 has Bauhaus/Kandinsky illustration style', () => {
    const kn3 = bookBySlug('kn3')
    expect(kn3?.illustration_style).toContain('Bauhaus')
  })
})
