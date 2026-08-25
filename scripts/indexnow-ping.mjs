#!/usr/bin/env node
/**
 * IndexNow ping script — notifies Bing + Yandex about URL changes.
 *
 * IndexNow — open protocol lets sites push URL changes к search engines
 * instantly, no auth, free, just URL ownership via `<key>.txt` file в public/.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs              # ping URLs from dist/sitemap.xml
 *   INDEXNOW_DRY_RUN=1 node scripts/indexnow-ping.mjs   # print payload, don't POST
 *
 * Key rotation: replace `public/<old-key>.txt` с new generated hex string. Both
 * remain valid until search engines re-verify (~7 days).
 *
 * Hook integration: invoke post-deploy в GitHub Action deploy.yml. Not в build
 * chain — local build ≠ production deploy.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const HOST = 'https://books.folkup.life'
const HOSTNAME = 'books.folkup.life'

// Discover IndexNow key file. Convention: <hex-key>.txt с key inside matches filename.
const PUBLIC_DIR = 'public'
const candidates = readdirSync(PUBLIC_DIR).filter((f) =>
  /^[a-f0-9]{8,128}\.txt$/i.test(f),
)
if (candidates.length === 0) {
  console.error('✗ No IndexNow key file found in public/<hex>.txt')
  process.exit(1)
}
const keyFile = candidates.sort()[0]
const key = readFileSync(join(PUBLIC_DIR, keyFile), 'utf8').trim()
const keyLocation = `${HOST}/${keyFile}`

// Discover URLs from sitemap.xml. Sitemap built at prebuild → dist/sitemap.xml.
// Fallback к public/sitemap.xml (source of truth) если dist ещё не built.
const sitemapPaths = ['dist/sitemap.xml', 'public/sitemap.xml']
let sitemapPath = sitemapPaths.find((p) => existsSync(p))
if (!sitemapPath) {
  console.error(`✗ No sitemap found (checked: ${sitemapPaths.join(', ')})`)
  process.exit(1)
}
const sitemapXml = readFileSync(sitemapPath, 'utf8')
const URLS = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (URLS.length === 0) {
  console.error(`✗ No <loc> URLs found in ${sitemapPath}`)
  process.exit(1)
}
console.log(`[indexnow-ping] Loaded ${URLS.length} URLs from ${sitemapPath}`)

const payload = { host: HOSTNAME, key, keyLocation, urlList: URLS }

if (process.env.INDEXNOW_DRY_RUN === '1' || process.argv.includes('--dry-run')) {
  console.log('[DRY RUN] would POST to IndexNow endpoints:')
  console.log(JSON.stringify({ ...payload, key: `${key.slice(0, 4)}...${key.slice(-4)}` }, null, 2))
  process.exit(0)
}

// Generic endpoint propagates к all participating engines (Bing, Yandex, Seznam,
// Naver). Plus direct pings к Bing + Yandex для belt-and-suspenders coverage.
const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

let successCount = 0
for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    const ok = res.status >= 200 && res.status < 300
    console.log(`${ok ? '✓' : '!'} ${endpoint}: HTTP ${res.status} ${res.statusText}`)
    if (ok) successCount++
  } catch (e) {
    console.error(`✗ ${endpoint}: ${e.message}`)
  }
}

console.log(`\n${successCount}/${ENDPOINTS.length} endpoints accepted (${URLS.length} URLs)`)
process.exit(successCount > 0 ? 0 : 1)
