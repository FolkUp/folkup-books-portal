import { test, expect } from '@playwright/test'

test.describe('Portal home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads с корректным title', async ({ page }) => {
    // cont+47 Иве S169 P0-B: site title = «Библиотека FolkUp» (без числа книг)
    await expect(page).toHaveTitle(/Библиотека FolkUp/i)
  })

  test('shows all 7 book cards', async ({ page }) => {
    const cards = page.locator('.book-card')
    await expect(cards).toHaveCount(7)
  })

  test('has canonical link tag', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', 'https://books.folkup.life/')
  })

  test('injects BookSeries JSON-LD в head', async ({ page }) => {
    const scripts = await page.locator('script[type="application/ld+json"]').all()
    expect(scripts.length).toBeGreaterThan(0)

    const content = await scripts[0].textContent()
    const json = JSON.parse(content || '{}')
    expect(json['@type']).toBe('BookSeries')
    expect(json.numberOfBooks).toBe(7)
    expect(json.license).toContain('by-sa/4.0')
  })

  test('kn1 card is clickable + links к /kn1', async ({ page }) => {
    const kn1Card = page.locator('[aria-labelledby="book-kn1-title"]')
    await expect(kn1Card).toBeVisible()

    const link = kn1Card.locator('a')
    await expect(link).toHaveAttribute('href', /\/kn1/)
  })

  test('kn7 card is disabled (Variant B pause)', async ({ page }) => {
    const kn7Card = page.locator('[aria-labelledby="book-kn7-title"]')
    const link = kn7Card.locator('a')
    await expect(link).toHaveAttribute('aria-disabled', 'true')
  })

  test('does not have noindex on production home page', async ({ page }) => {
    // Per Андрей mandate cont +39: индексируем все опубликованное
    const robots = await page.locator('meta[name="robots"]').count()
    expect(robots).toBe(0)  // No noindex meta tag
  })
})
