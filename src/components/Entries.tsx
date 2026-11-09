import type { ReactNode } from 'react'

export type IndexItem = { id: string; title: string; date: string; href: string; sub?: string; image?: string }

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const d = (iso: string) => new Date(iso + 'T00:00:00Z')
export const yearOf = (iso: string) => d(iso).getUTCFullYear()
export const shortDate = (iso: string) => `${String(d(iso).getUTCDate()).padStart(2, '0')} ${SHORT[d(iso).getUTCMonth()]}`
export const longDate = (iso: string) => `${d(iso).getUTCDate()} ${LONG[d(iso).getUTCMonth()]} ${yearOf(iso)}`
export const readMins = (texts: string[]) => Math.max(1, Math.round(texts.join(' ').split(/\s+/).length / 200))

// Without an image, every entry gets its own small block of binary digits, seeded from its id.
function digits(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const rows: string[] = []
  for (let r = 0; r < 6; r++) {
    let line = ''
    for (let c = 0; c < 9; c++) { h = Math.imul(h ^ (h >>> 13), 1274126177); line += (h >>> 7) & 1 ? '1' : '0' }
    rows.push(line)
  }
  return rows
}
function Cover({ seed, image }: { seed: string; image?: string }) {
  if (image) return <img className="ix-cover ix-img" src={image} alt="" loading="lazy" />
  return <span className="ix-cover" aria-hidden="true">{digits(seed).map((row, i) => <span key={i}>{row}</span>)}</span>
}

// A list grouped by year. Each row is a link to the entry's own page.
export function EntryList({ items }: { items: IndexItem[] }) {
  const years = [...new Set(items.map(i => yearOf(i.date)))]
  return <div className="ix">
    {years.map(y => <section className="ix-group" key={y} aria-label={String(y)}>
      <h2 className="ix-year">{y}</h2>
      <ul className="ix-rows">
        {items.filter(i => yearOf(i.date) === y).map(i => <li className="ix-row" key={i.id}>
          <a href={i.href}>
            <Cover seed={i.id} image={i.image} />
            <span className="ix-main"><span className="ix-title">{i.title}</span>{i.sub && <span className="ix-sub">{i.sub}</span>}</span>
            <span className="ix-date">{shortDate(i.date)}</span>
          </a>
        </li>)}
      </ul>
    </section>)}
  </div>
}

type Nav = { title: string; href: string }
// The page a row opens: a quiet, readable reading view.
export function EntryPage(props: { backHref: string; backLabel: string; eyebrow?: string; title: string; date: string; blocks: string[]; code?: string; question?: string; newer?: Nav; older?: Nav; notice?: ReactNode }) {
  const { backHref, backLabel, eyebrow, title, date, blocks, code, question, newer, older, notice } = props
  return <article className="ep">
    <a className="ep-back" href={backHref}>← {backLabel}</a>
    <header className="ep-head">
      {eyebrow && <p className="ep-eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p className="ep-meta">{longDate(date)} · {readMins(blocks)} min read</p>
    </header>
    {notice}
    <div className="ep-body">
      {blocks.map((b, i) => b.startsWith('## ') ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>)}
      {code && <pre><code>{code}</code></pre>}
      {question && <p className="persp-q">{question}</p>}
    </div>
    {(newer || older) && <nav className="ep-nav" aria-label="More entries">
      {older ? <a href={older.href}><span>← Older</span>{older.title}</a> : <i />}
      {newer ? <a className="ep-next" href={newer.href}><span>Newer →</span>{newer.title}</a> : <i />}
    </nav>}
  </article>
}
