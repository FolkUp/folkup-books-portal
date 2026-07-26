import { describe, it, expect } from 'vitest'
import { useSeriesData } from '@/composables/useSeriesData'

describe('useSeriesData', () => {
  const {
    series,
    books,
    bookBySlug,
    booksByTrilogy,
    liveBooks,
    upcomingBooks,
    stubBooks,
    gatedBooks,
  } = useSeriesData()

  it('loads series metadata from series.yaml', () => {
    // Canon v2 Iskra S214 2026-07-23 (виза Andrey): «Своим умом» supersedes cont+18 best-guess «FolkUp».
    // «FolkUp» остаётся брендом издательства/экосистемы, не именем серии.
    expect(series.value.name).toBe('Своим умом')
    expect(series.value.total_books).toBe(7)
    expect(series.value.license).toBe('CC BY-SA 4.0')
    // Q10 verdict via Iskra S178b 2026-07-18: public author = pseudonym.
    // Legal name «Andrei Klemenchionok» reserved для /ai-disclosure per AI Act Art. 50(4).
    expect(series.value.author).toBe('Команданте FolkUp')
  })

  it('loads canonical trilogies map (canon v2 §3)', () => {
    // Canon v2 §3: три трилогии — I «Своими силами» · II «Из первых рук» · III «Общий язык»
    expect(series.value.trilogies).toBeDefined()
    expect(series.value.trilogies?.svoimi_silami.name).toBe('Своими силами')
    expect(series.value.trilogies?.iz_pervyh_ruk.name).toBe('Из первых рук')
    expect(series.value.trilogies?.obshchiy_yazyk.name).toBe('Общий язык')
  })

  it('trilogies carry Iskra §3 canonical descriptions (VITRINNYY-PAKET S214)', () => {
    // Iskra §3 VITRINNYY-PAKET S214: подписи-описания для группировки на главной.
    expect(series.value.trilogies?.svoimi_silami.description).toContain('команда делает своё дело')
    expect(series.value.trilogies?.iz_pervyh_ruk.description).toContain('знание доходит до нас')
    expect(series.value.trilogies?.obshchiy_yazyk.description).toContain('договориться труднее')
  })

  it('booksByTrilogy groups books by trilogy in canon v2 order (Iskra §3)', () => {
    // Iskra §3 canonical: order = svoimi_silami → iz_pervyh_ruk → obshchiy_yazyk.
    // Внутри трилогии — по position field (canon v2 §2 таблица переномеровки).
    const groups = booksByTrilogy.value
    expect(groups).toHaveLength(3)
    expect(groups[0].key).toBe('svoimi_silami')
    expect(groups[1].key).toBe('iz_pervyh_ruk')
    expect(groups[2].key).toBe('obshchiy_yazyk')

    // I. Своими силами (kn1 → kn3 → kn4 by position)
    expect(groups[0].books.map((b) => b.slug)).toEqual(['kn1', 'kn3', 'kn4'])
    // II. Из первых рук (kn2 → kn5 → kn6)
    expect(groups[1].books.map((b) => b.slug)).toEqual(['kn2', 'kn5', 'kn6'])
    // III. Общий язык (kn7 — единственная сейчас; canon v2 §3 «группа с одной книгой»)
    expect(groups[2].books.map((b) => b.slug)).toEqual(['kn7'])
  })

  it('loads exactly 7 books', () => {
    expect(books.value).toHaveLength(7)
  })

  it('books are ordered by position (canon v2 §2 таблица переномеровки)', () => {
    // Canon v2 порядок = карта замысла: kn1, kn3, kn4, kn2, kn5, kn6, kn7
    // Position 1..7 sequential; slug — технический идентификатор, ≠ position (canon v2 §3).
    const expectedSlugsByPosition = ['kn1', 'kn3', 'kn4', 'kn2', 'kn5', 'kn6', 'kn7']
    books.value.forEach((book, idx) => {
      expect(book.position).toBe(idx + 1)
      expect(book.slug).toBe(expectedSlugsByPosition[idx])
    })
  })

  it('each book has required fields + trilogy key (canon v2 §3)', () => {
    books.value.forEach((book) => {
      expect(book.slug).toMatch(/^kn[1-7]$/)
      expect(book.status).toMatch(/^(live|stub|launch_target|launch_preparing|variant_b_pause|svod_zakryt_pre_shit_v5)$/)
      expect(book.slug_en_temp).toBeDefined()
      expect(book.trilogy).toMatch(/^(svoimi_silami|iz_pervyh_ruk|obshchiy_yazyk)$/)
    })
  })

  it('trilogy assignment per canon v2 §3', () => {
    // I. Своими силами: kn1, kn3, kn4 (команда создаёт)
    expect(bookBySlug('kn1')?.trilogy).toBe('svoimi_silami')
    expect(bookBySlug('kn3')?.trilogy).toBe('svoimi_silami')
    expect(bookBySlug('kn4')?.trilogy).toBe('svoimi_silami')
    // II. Из первых рук: kn2, kn5, kn6 (знание доходит до нас)
    expect(bookBySlug('kn2')?.trilogy).toBe('iz_pervyh_ruk')
    expect(bookBySlug('kn5')?.trilogy).toBe('iz_pervyh_ruk')
    expect(bookBySlug('kn6')?.trilogy).toBe('iz_pervyh_ruk')
    // III. Общий язык: kn7 (люди договариваются) + будущие тома
    expect(bookBySlug('kn7')?.trilogy).toBe('obshchiy_yazyk')
  })

  it('bookBySlug returns correct book with new positions (canon v2)', () => {
    // kn1 → position 1 (I·1), kn3 → 2 (I·2), kn4 → 3 (I·3),
    // kn2 → 4 (II·1), kn5 → 5 (II·2), kn6 → 6 (II·3), kn7 → 7 (III·1)
    expect(bookBySlug('kn1')?.position).toBe(1)
    expect(bookBySlug('kn3')?.position).toBe(2)
    expect(bookBySlug('kn4')?.position).toBe(3)
    expect(bookBySlug('kn2')?.position).toBe(4)
    expect(bookBySlug('kn5')?.position).toBe(5)
    expect(bookBySlug('kn6')?.position).toBe(6)
    expect(bookBySlug('kn7')?.position).toBe(7)
    expect(bookBySlug('kn1')?.status).toBe('live')
  })

  it('bookBySlug returns undefined for non-existent slug', () => {
    expect(bookBySlug('kn99')).toBeUndefined()
  })

  it('liveBooks filters correctly', () => {
    // kn.1 (v1.0.14 LIVE with 3 factual updates) — kn.4 downgraded к launch_preparing
    // per Andrey Q4 my-call cont+22 2026-07-26 «Скоро с оговоркой» (Iskra §11 gate + §7 A1)
    expect(liveBooks.value).toHaveLength(1)
    const slugs = liveBooks.value.map((b) => b.slug).sort()
    expect(slugs).toEqual(['kn1'])
  })

  it('upcomingBooks filters correctly', () => {
    // kn.4 + kn.5 both launch_preparing (kn.4 добавлен cont+22 per Q4 «Скоро с оговоркой»)
    expect(upcomingBooks.value).toHaveLength(2)
    const slugs = upcomingBooks.value.map((b) => b.slug).sort()
    expect(slugs).toEqual(['kn4', 'kn5'])
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
