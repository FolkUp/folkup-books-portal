import { test, expect } from '@playwright/test'

/**
 * Schema.org markup validation tests.
 * Per Дьюи SEO checklist + КиберГонзо research (competitive gap fill vs Standard Ebooks).
 */

test.describe('Schema.org markup', () => {
  test('portal home has BookSeries JSON-LD', async ({ page }) => {
    await page.goto('/')
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(scripts.length).toBeGreaterThan(0)

    const bookSeries = scripts.map((s) => JSON.parse(s)).find((j) => j['@type'] === 'BookSeries')
    expect(bookSeries).toBeDefined()
    expect(bookSeries.numberOfBooks).toBe(7)
    expect(bookSeries.hasPart).toHaveLength(7)
    expect(bookSeries.license).toContain('by-sa/4.0')
  })

  test('kn1 page has Book JSON-LD с workExample', async ({ page }) => {
    await page.goto('/kn1')
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()

    const book = scripts.map((s) => JSON.parse(s)).find((j) => j['@type'] === 'Book')
    expect(book).toBeDefined()
    expect(book.position).toBe(1)
    expect(book.isPartOf['@id']).toContain('#series')
    expect(book.workExample).toBeDefined()
    expect(book.workExample[0].bookFormat).toContain('EBook')
  })

  test('kn5 stub has Book JSON-LD с future datePublished', async ({ page }) => {
    await page.goto('/kn5')
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()

    const book = scripts.map((s) => JSON.parse(s)).find((j) => j['@type'] === 'Book')
    expect(book).toBeDefined()
    expect(book.position).toBe(5)
    expect(book.datePublished).toBeTruthy()
    // Should be future date
    expect(new Date(book.datePublished).getTime()).toBeGreaterThan(new Date('2026-07-01').getTime())
  })

  test('kn7 (Variant B) Book JSON-LD without launch date claim', async ({ page }) => {
    await page.goto('/kn7')
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()

    const book = scripts.map((s) => JSON.parse(s)).find((j) => j['@type'] === 'Book')
    expect(book).toBeDefined()
    expect(book.position).toBe(7)
    // Кн.7 = Variant B pause, no datePublished promised
    expect(book.workExample).toBeUndefined()
  })

  test('all pages include author reference by @id', async ({ page }) => {
    for (const url of ['/', '/kn1', '/kn5', '/kn7']) {
      await page.goto(url)
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
      const jsonList = scripts.map((s) => JSON.parse(s))

      const withAuthor = jsonList.find((j) => j.author)
      expect(withAuthor?.author['@id']).toBe('https://books.folkup.life/#author')
    }
  })
})
