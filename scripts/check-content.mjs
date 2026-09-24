import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { load } from 'js-yaml'

const ROOT = 'src/activity'
const FRONT = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const ASSET = /(?:\.\/)?assets\/([^"')\s]+)/g

const problems = []
const note = (where, what) => problems.push(`${where}: ${what}`)

function span(value) {
  const pair = Array.isArray(value) ? value : [value, value]
  return pair.map((v) => new Date(String(v)))
}

function checkDir(dir) {
  const card = join(dir, 'card.md')
  if (!existsSync(card)) return note(dir, '缺少 card.md')

  const text = readFileSync(card, 'utf8')
  const head = text.match(FRONT)
  if (!head) return note(card, '缺少 frontmatter')

  let data
  try {
    data = load(head[1]) ?? {}
  } catch (e) {
    return note(card, `frontmatter 不是合法 YAML：${e.message.split('\n')[0]}`)
  }

  if (!data.title) note(card, '缺少 title')
  if (!data.during) note(card, '缺少 during')

  for (const key of ['during', 'enroll']) {
    if (!data[key]) continue
    const [from, to] = span(data[key])
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
      note(card, `${key} 日期无法解析，应形如 2026-10-18T19:00:00+08:00`)
    else if (to < from) note(card, `${key} 的结束早于开始`)
  }

  if (data.weight !== undefined && !Number.isFinite(Number(data.weight)))
    note(card, 'weight 不是数字')

  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md')) continue
    const body = readFileSync(join(dir, name), 'utf8')
    for (const [, file] of body.matchAll(ASSET)) {
      if (!existsSync(join(dir, 'assets', file)))
        note(join(dir, name), `引用了不存在的资料 assets/${file}`)
    }
  }
}

for (const stage of ['new', 'history']) {
  const base = join(ROOT, stage)
  if (!existsSync(base)) continue
  for (const name of readdirSync(base)) {
    const dir = join(base, name)
    if (statSync(dir).isDirectory()) checkDir(relative('.', dir))
  }
}

if (problems.length) {
  console.error('活动内容有问题：\n')
  for (const line of problems) console.error('  - ' + line)
  console.error('\n写法见 docs/维护指南.md')
  process.exit(1)
}

console.log('活动内容检查通过')
