import { test, expect } from '@playwright/test'

/**
 * SEO regression test coverage — Дьюи cont +42 findings F-SEO-1..9 lock-in.
 * Written cont +17 batch B2c after full SEO ремонт (BKPO-DEWEY-SEO-AUDIT).
 *
 * Prevents regression на:
 *  - useHead SSG bug (main.ts duplicate createHead) — B1
 *  - static sitemap.xml catch-all issue — B3
 *  - og/twitter meta tags per page — B2a
 *  - llms.txt version drift — B4
 *  - robots.txt policy shift F8 GEO A1 — B3
 */

test.describe('SEO — F-SEO-1..9 regression coverage', () => {
  // F-SEO-2: hreflang minimal (Q1 verdict А cont +17 — single-lang + x-default)
  test('F-SEO-2: hreflang ru + x-default on homepage', async ({ page }) => {
    await page.goto('/')
    const hreflangRu = await page.locator('link[rel="alternate"][hreflang="ru"]').getAttribute('href')
    const hreflangDefault = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href')

    expect(hreflangRu).toBe('https://books.folkup.life/')
    expect(hreflangDefault).toBe('https://books.folkup.life/')
  })

  test('F-SEO-2: hreflang per-route on book pages', async ({ page }) => {
    for (const slug of ['kn1', 'kn5', 'kn7']) {
      await page.goto(`/${slug}`)
      const hreflangRu = await page.locator('link[rel="alternate"][hreflang="ru"]').getAttribute('href')
      const hreflangDefault = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href')

      expect(hreflangRu).toContain(`/${slug}`)
      expect(hreflangDefault).toContain(`/${slug}`)
    }
  })

  // F-SEO-6: <html lang="ru"> for Russian-primary content
  test('F-SEO-6: html lang="ru" on all pages', async ({ page }) => {
    for (const url of ['/', '/kn1', '/kn5', '/kn7']) {
      await page.goto(url)
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang, `${url} should have lang="ru"`).toBe('ru')
    }
  })

  // F-SEO-1: canonical URL present + points to books.folkup.life
  test('F-SEO-1: canonical link on homepage', async ({ page }) => {
    await page.goto('/')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe('https://books.folkup.life/')
  })

  test('F-SEO-1: canonical link on all book pages', async ({ page }) => {
    for (const slug of ['kn1', 'kn2', 'kn5', 'kn7']) {
      await page.goto(`/${slug}`)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical, `${slug} canonical should be defined`).toBeTruthy()
      // Post-cutover: all book pages canonical → books.folkup.life/<slug>/
      expect(canonical).toMatch(/^https:\/\/books\.folkup\.life\//)
    }
  })

  // F-SEO-3: Schema.org JSON-LD present + valid types
  test('F-SEO-3: Schema.org BookSeries JSON-LD on homepage', async ({ page }) => {
    await page.goto('/')
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(scripts.length).toBeGreaterThan(0)

    const bookSeries = scripts.map((s) => JSON.parse(s)).find((j) => j['@type'] === 'BookSeries')
    expect(bookSeries).toBeDefined()
    expect(bookSeries.numberOfBooks).toBe(7)
  })

  test('F-SEO-3: Schema.org Book JSON-LD on book pages', async ({ page }) => {
    for (const slug of ['kn1', 'kn5', 'kn7']) {
      await page.goto(`/${slug}`)
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()

      const book = scripts.map((s) => JSON.parse(s)).find((j) => j['@type'] === 'Book')
      expect(book, `${slug} should have Book JSON-LD`).toBeDefined()
      expect(book.isPartOf['@type']).toBe('BookSeries')
    }
  })

  // F-SEO-4: Open Graph tags present
  test('F-SEO-4: OG tags on homepage', async ({ page }) => {
    await page.goto('/')
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')

    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    expect(ogImage).toMatch(/^https:\/\/books\.folkup\.life\//)
    expect(ogType).toBe('website')
  })

  test('F-SEO-4: OG tags on book pages с per-book image', async ({ page }) => {
    await page.goto('/kn1')
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')

    expect(ogType).toBe('book')
    expect(ogImage).toMatch(/^https:\/\/books\.folkup\.life\/covers\//)
  })

  // F-SEO-5: Twitter Card tags present
  test('F-SEO-5: Twitter Card tags on homepage', async ({ page }) => {
    await page.goto('/')
    const twCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    const twImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

    expect(twCard).toBe('summary_large_image')
    expect(twImage).toMatch(/^https:\/\/books\.folkup\.life\//)
  })

  test('F-SEO-5: Twitter Card per-book override on book pages', async ({ page }) => {
    await page.goto('/kn1')
    const twTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    const twDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content')
    const twImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

    expect(twTitle).toBeTruthy()
    expect(twDescription).toBeTruthy()
    expect(twImage).toMatch(/^https:\/\/books\.folkup\.life\/covers\//)
  })

  // F-SEO-7: sitemap.xml is valid XML, not homepage HTML fallback
  test('F-SEO-7: sitemap.xml returns valid XML, not homepage HTML', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()

    // MUST NOT start with <!DOCTYPE html> (was catch-all HTML fallback bug)
    expect(body).not.toMatch(/^<!DOCTYPE html>/i)
    // MUST be XML sitemap
    expect(body).toMatch(/^<\?xml/)
    expect(body).toContain('<urlset')
    expect(body).toContain('books.folkup.life')
  })

  test('F-SEO-7: sitemap contains all book URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const body = await response.text()

    for (const slug of ['/', '/kn1/', '/kn2/', '/kn3/', '/kn4/', '/kn5/', '/kn6/', '/kn7/']) {
      expect(body, `sitemap should contain ${slug}`).toContain(`books.folkup.life${slug}`)
    }
  })

  // F8 GEO A1: robots.txt allows all crawlers + sitemap directive
  test('F8: robots.txt allows all + declares sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()

    expect(body).toMatch(/User-agent:\s*\*/i)
    expect(body).toMatch(/Allow:\s*\//i)
    expect(body).toContain('Sitemap: https://books.folkup.life/sitemap.xml')

    // F8 A1: NO blocked training bots (removed GPTBot/CCBot/Google-Extended/cohere-ai)
    expect(body).not.toMatch(/GPTBot\s*\n\s*Disallow/i)
    expect(body).not.toMatch(/CCBot\s*\n\s*Disallow/i)
  })

  // F-SEO-8: llms.txt has current kn.1 version (no drift)
  test('F-SEO-8: llms.txt has kn.1 v1.0.14 (not drift older versions)', async ({ request }) => {
    const response = await request.get('/llms.txt')
    const body = await response.text()

    expect(body).toContain('v1.0.14')
    expect(body).not.toContain('v1.0.11')
    expect(body).not.toContain('v1.0.10')
  })

  // F-SEO-9: llms.txt kn.5 status matches homepage (no drift)
  test('F-SEO-9: llms.txt kn.5 not stale launch target', async ({ request, page }) => {
    const response = await request.get('/llms.txt')
    const body = await response.text()

    // Should NOT claim launch date 2026-07-04 (deferred per Q1 verdict А cont +16)
    expect(body).not.toMatch(/Кн\.5.*Launch target 2026-07-04/i)
    // Should align с homepage — 'Coming' something
    expect(body).toMatch(/Кн\.5.*Coming/i)
  })
})
