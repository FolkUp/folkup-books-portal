// build-marker: пишет public/build-info.json для верификации «прод = master» (тикет 25)
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const sh = (c) => { try { return execSync(c, {encoding:'utf8'}).trim() } catch { return '' } }
// CF Pages кладёт sha в env; локально/в CI берём из git
const commit = process.env.CF_PAGES_COMMIT_SHA || sh('git rev-parse HEAD') || 'unknown'
const branch = process.env.CF_PAGES_BRANCH || sh('git rev-parse --abbrev-ref HEAD') || 'unknown'
const info = {
  commit,
  short: commit.slice(0, 7),
  branch,
  builtAt: new Date().toISOString(),
}
writeFileSync('public/build-info.json', JSON.stringify(info, null, 2) + '\n')
console.log('[build-marker]', info.short, info.branch, info.builtAt)
