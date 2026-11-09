import { useMemo, useState } from 'react'
import { collections } from '../content/collections'
import { EntryList, EntryPage } from './Entries'

type Kind = 'idea' | 'note' | 'exploring'
const KINDS: { id: Kind; label: string; plural: string }[] = [
  { id: 'note', label: 'Note', plural: 'Notes' },
  { id: 'exploring', label: 'Exploring', plural: 'Exploring' },
  { id: 'idea', label: 'Idea', plural: 'Ideas' },
]
const kindOf: Record<string, Kind> = { 'drawing-board': 'idea', 'engineering-notes': 'note', 'currently-exploring': 'exploring' }

function getNotes() {
  return Object.entries(collections).flatMap(([key, col]) => col.entries.map(e => ({ ...e, date: e.date ?? '2025-01-01', kind: kindOf[key] ?? 'note' as Kind })))
    .sort((a, b) => b.date.localeCompare(a.date))
}
export const noteTitle = (slug: string) => getNotes().find(n => n.slug === slug)?.title
const href = (slug: string) => `#field-notes/${slug}`
const label = (k: Kind) => KINDS.find(x => x.id === k)!.label

export default function FieldNotes({ entrySlug }: { entrySlug?: string }) {
  const all = useMemo(getNotes, [])
  const [filter, setFilter] = useState<Kind | 'all'>('all')
  const i = all.findIndex(n => n.slug === entrySlug)
  const notice = <p className="sample-notice"><span>Placeholder entries</span>These are editable samples, not claims about my work. Replace them (and their dates) in <code>src/content/collections.ts</code>.</p>
  if (i >= 0) {
    const n = all[i], newer = all[i - 1], older = all[i + 1]
    const blocks = n.sections.flatMap(s => [`## ${s.heading}`, s.text])
    return <EntryPage backHref="#field-notes" backLabel="Field notes" eyebrow={`${label(n.kind)} · ${n.category}`} title={n.title} date={n.date} blocks={blocks} code={n.code} notice={notice}
      newer={newer && { title: newer.title, href: href(newer.slug) }} older={older && { title: older.title, href: href(older.slug) }} />
  }
  const shown = all.filter(n => filter === 'all' || n.kind === filter)
  return <section className="fn" aria-labelledby="fn-title">
    <header className="page-title">
      <h1 id="fn-title">Field notes</h1>
      <p>Things I’m learning, debugging and wondering about, filed in one place.</p>
    </header>
    {notice}
    <div className="fn-filters" role="group" aria-label="Filter notes">
      <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
      {KINDS.map(k => <button key={k.id} aria-pressed={filter === k.id} onClick={() => setFilter(k.id)}>{k.plural}</button>)}
    </div>
    <EntryList items={shown.map(n => ({ id: n.slug, title: n.title, sub: `${label(n.kind)} · ${n.category}`, date: n.date, href: href(n.slug), image: n.image }))} />
  </section>
}
