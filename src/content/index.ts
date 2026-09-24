import MarkdownIt from 'markdown-it'
import { load as parseYaml } from 'js-yaml'

const md = new MarkdownIt({ html: true, linkify: true })

export type Status = '报名中' | '进行中' | '已结束'

/** 圆点的动效档位：聚集、纯环、发散、无 */
export type Beat = 'gather' | 'plain' | 'spread' | 'none'

export type Stage = 'new' | 'history'

export interface Activity {
  id: string
  stage: Stage
  title: string
  enroll?: [Date, Date]
  during: [Date, Date]
  date: Date
  status: Status
  beat: Beat
  weight: number
  sp: boolean
  venue?: string
  online: [string, string][]
  action?: string
  detail?: string
  signup?: string
  recap?: string
  back?: string
}

const ORDER: Status[] = ['报名中', '进行中', '已结束']

const raw = import.meta.glob('../activity/*/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const assets = import.meta.glob('../activity/*/*/assets/**', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

const FRONT = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function split(text: string) {
  const m = text.match(FRONT)
  return m
    ? { data: (parseYaml(m[1]) ?? {}) as Record<string, unknown>, body: text.slice(m[0].length) }
    : { data: {}, body: text }
}

function render(body: string, dir: string) {
  const html = md.render(body)
  return html.replace(/(?:\.\/)?assets\/([^"')\s]+)/g, (hit, file) => assets[`${dir}/assets/${file}`] ?? hit)
}

function span(value: unknown): [Date, Date] | undefined {
  const pair = Array.isArray(value) ? value : [value, value]
  const [from, to] = pair.map((v) => new Date(String(v)))
  return Number.isNaN(from.getTime()) ? undefined : [from, Number.isNaN(to.getTime()) ? from : to]
}

/** 报名截止到活动开场这段空档也算进行中，只是不该有涟漪 */
function phase(enroll: [Date, Date] | undefined, during: [Date, Date], now: number) {
  if (now >= during[1].getTime()) return { status: '已结束' as Status, beat: 'none' as Beat }
  if (enroll && now < enroll[1].getTime()) return { status: '报名中' as Status, beat: 'gather' as Beat }
  const beat: Beat = now < during[0].getTime() ? 'plain' : 'spread'
  return { status: '进行中' as Status, beat }
}

function build(): Activity[] {
  const now = Date.now()
  const dirs = new Map<string, Record<string, string>>()
  for (const [path, text] of Object.entries(raw)) {
    const at = path.lastIndexOf('/')
    const dir = path.slice(0, at)
    const name = path.slice(at + 1, -3)
    ;(dirs.get(dir) ?? dirs.set(dir, {}).get(dir)!)[name] = text
  }

  const list: Activity[] = []
  for (const [dir, files] of dirs) {
    if (!files.card) continue
    const { data } = split(files.card)
    const [, stage, id] = dir.split('/').slice(-3)
    const pick = (k: string) => (files[k] ? render(split(files[k]).body, dir) : undefined)

    const during = span(data.during) ?? span(data.date)
    if (!during) continue
    const enroll = span(data.enroll)

    list.push({
      id,
      stage: stage as Stage,
      title: String(data.title ?? id),
      enroll,
      during,
      date: during[0],
      ...phase(enroll, during, now),
      weight: Number(data.weight ?? 50),
      sp: data.sp === true,
      venue: data.venue ? String(data.venue) : undefined,
      online: Array.isArray(data.online) ? (data.online as [string, string][]) : [],
      action: data.action ? String(data.action) : undefined,
      detail: pick('detail'),
      signup: pick('signup'),
      recap: pick('recap'),
      back: pick('back'),
    })
  }
  return list
}

/** SP 条目脱离类别，在拼平序列里插到第一个自身权重不低于对方的位置之前 */
function promote(sorted: Activity[], sp: Activity[]) {
  for (const item of sp) {
    const at = sorted.findIndex((other) => item.weight >= other.weight)
    sorted.splice(at < 0 ? sorted.length : at, 0, item)
  }
  return sorted
}

function byCategory(list: Activity[]) {
  return [...list].sort(
    (a, b) =>
      ORDER.indexOf(a.status) - ORDER.indexOf(b.status) ||
      b.weight - a.weight ||
      b.date.getTime() - a.date.getTime(),
  )
}

export const activities = build()

/** 已结束的只留在历史栏，除非挂了 SP——那是为公示一类内容准备的 */
export const upcoming = promote(
  byCategory(activities.filter((a) => a.status !== '已结束')),
  activities.filter((a) => a.status === '已结束' && a.sp),
)

export const history = byCategory(activities.filter((a) => a.status === '已结束'))
