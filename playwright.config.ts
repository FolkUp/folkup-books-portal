import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config для folkup-books-portal.
 * Per ~/.claude/rules/visual-regression-mandate.md:
 *   - Mandatory 3-viewport testing (mobile 375 / tablet 768 / desktop 1280+)
 *   - toHaveScreenshot() для visual regression (per R1 memo Playwright best practice)
 *   - axe-core для a11y (via @axe-core/playwright)
 *   - Bundle gate: 60KB gzip max (verified in CI)
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:4173',  // vite preview port
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // 3-viewport mandatory per visual-regression-mandate.md
  projects: [
    {
      name: 'mobile',
      testDir: './tests/e2e',
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'tablet',
      testDir: './tests/e2e',
      use: { ...devices['iPad'] },
    },
    {
      name: 'desktop',
      testDir: './tests/e2e',
      use: {
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      },
    },
    {
      name: 'visual-mobile',
      testDir: './tests/visual',
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'visual-tablet',
      testDir: './tests/visual',
      use: { ...devices['iPad'] },
    },
    {
      name: 'visual-desktop',
      testDir: './tests/visual',
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  expect: {
    toHaveScreenshot: {
      // 0.1% pixel diff threshold per visual-regression-mandate.md §2.3
      maxDiffPixelRatio: 0.001,
    },
  },
})
