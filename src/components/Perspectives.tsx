import { perspectives, perspectivesPage } from '../content/perspectives'
import { EntryList, EntryPage } from './Entries'

const sorted = [...perspectives].sort((a, b) => b.date.localeCompare(a.date))
export const perspectiveTitle = (id: string) => perspectives.find(p => p.id === id)?.title
const href = (id: string) => `#perspectives/${id}`
const notice = perspectivesPage.showSampleNotice ? <p className="sample-notice"><span>Placeholder</span>{perspectivesPage.sampleNotice}</p> : null

export default function Perspectives({ entrySlug }: { entrySlug?: string }) {
  const i = sorted.findIndex(p => p.id === entrySlug)
  if (i >= 0) {
    const p = sorted[i], newer = sorted[i - 1], older = sorted[i + 1]
    return <EntryPage backHref="#perspectives" backLabel="Perspectives" eyebrow={`Perspective ${String(perspectives.indexOf(p) + 1).padStart(2, '0')}`} title={p.title} date={p.date}
      blocks={p.body} question={p.question} notice={notice}
      newer={newer && { title: newer.title, href: href(newer.id) }} older={older && { title: older.title, href: href(older.id) }} />
  }
  return <section className="persp" aria-labelledby="persp-title">
    <header className="page-title">
      <h1 id="persp-title">{perspectivesPage.title}</h1>
      <p>{perspectivesPage.description}</p>
    </header>
    {notice}
    <EntryList items={sorted.map(p => ({ id: p.id, title: p.title, date: p.date, href: href(p.id), image: p.image }))} />
  </section>
}
