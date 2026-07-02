import { test, expect } from '@playwright/test'

/**
 * Visual regression tests — 3 viewports (mobile / tablet / desktop) per
 * ~/.claude/rules/visual-regression-mandate.md.
 *
 * Uses Playwright toHaveScreenshot() built-in comparison per R1 memo.
 * Threshold: 0.1% pixel diff (set in playwright.config.ts).
 */

test.describe('Portal visual regression', () => {
  test('portal home baseline', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('portal-home.png', { fullPage: true })
  })

  test('kn1 book page baseline', async ({ page }) => {
    await page.goto('/kn1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('kn1-book-page.png', { fullPage: true })
  })

  test('kn5 launch target baseline', async ({ page }) => {
    await page.goto('/kn5')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('kn5-book-page.png', { fullPage: true })
  })

  test('kn7 pause page baseline', async ({ page }) => {
    await page.goto('/kn7')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('kn7-book-page.png', { fullPage: true })
  })

  test('404 page baseline', async ({ page }) => {
    await page.goto('/nonexistent-slug')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('404-page.png', { fullPage: true })
  })

  test('no horizontal overflow (Lesson #9)', async ({ page }) => {
    await page.goto('/')

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })

    expect(hasOverflow).toBe(false)
  })

  test('touch targets ≥ 44px (WCAG 2.5.5)', async ({ page }) => {
    await page.goto('/')

    // Check book card links
    const links = page.locator('.book-card__link:not(.book-card__link--disabled)')
    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox()
      expect(box).not.toBeNull()
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })
})
