import { describe, it, expect } from 'vitest'
import { useSeriesData } from '@/composables/useSeriesData'

describe('useSeriesData', () => {
  const { series, books, bookBySlug, liveBooks, upcomingBooks, stubBooks, gatedBooks } = useSeriesData()

  it('loads series metadata from series.yaml', () => {
    expect(series.value.name).toBe('Agile Sapiens')
    expect(series.value.total_books).toBe(7)
    expect(series.value.license).toBe('CC BY-SA 4.0')
    // Q10 verdict via Iskra S178b 2026-07-18: public author = pseudonym.
    // Legal name «Andrei Klemenchionok» reserved для /ai-disclosure per AI Act Art. 50(4).
    expect(series.value.author).toBe('Comandante FolkUp')
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
      expect(book.status).toMatch(/^(live|stub|launch_target|launch_preparing|variant_b_pause|svod_zakryt_pre_shit_v5)$/)
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

  it('gatedBooks includes kn7 (quality gate pending — ЩИТ v5 после кн.3 per Иви S151)', () => {
    expect(gatedBooks.value).toHaveLength(1)
    expect(gatedBooks.value[0].slug).toBe('kn7')
    expect(gatedBooks.value[0].status).toBe('svod_zakryt_pre_shit_v5')
  })

  it('kn1 post-cutover — canonical_pre_cutover removed', () => {
    const kn1 = bookBySlug('kn1')
    expect(kn1?.canonical_pre_cutover).toBeUndefined()
  })

  it('kn1 has EPUB + PDF downloads (current v1.0.14 LIVE)', () => {
    const kn1 = bookBySlug('kn1')
    expect(kn1?.downloads?.epub).toContain('v1.0.14.epub')
    expect(kn1?.downloads?.pdf).toContain('v1.0.14.pdf')
  })

  it('kn1 covers include all 4 languages', () => {
    const kn1 = bookBySlug('kn1')
    expect(kn1?.covers?.ru).toBe('/covers/cover_kn1.svg')
    expect(kn1?.covers?.en).toBe('/covers/cover_kn1_en.svg')
    expect(kn1?.covers?.de).toBe('/covers/cover_kn1_de.svg')
    expect(kn1?.covers?.pt).toBe('/covers/cover_kn1_pt.svg')
  })

  it('all books have covers structure (Иви S138 pack import)', () => {
    books.value.forEach((book) => {
      expect(book.covers).toBeDefined()
      expect(book.covers?.ru).toMatch(/^\/covers\/cover_kn[1-7]\.svg$/)
    })
  })

  it('kn3 has Bauhaus/Kandinsky illustration style', () => {
    const kn3 = bookBySlug('kn3')
    expect(kn3?.illustration_style).toContain('Bauhaus')
  })
})
