import { useEffect } from 'react'
import type { Collection } from '../content/collections'

export default function CollectionPage({ collection, route, entrySlug }: { collection: Collection; route: string; entrySlug?: string }) {
  useEffect(() => {
    if (!entrySlug) return
    const frame = requestAnimationFrame(() => {
      const entry = document.getElementById(entrySlug)
      entry?.scrollIntoView({ behavior: 'instant', block: 'start' })
      entry?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [entrySlug])
  return <section className="collection-page" aria-labelledby="collection-title">
    <a className="back-link" href="#home">← Back home</a>
    <header className="page-title"><h1 id="collection-title">{collection.title}</h1><p>{collection.description}</p></header>
    <p className="sample-notice"><span>Placeholder collection</span>{collection.notice}</p>
    <nav className="collection-index" aria-label={`On this ${collection.title} page`}>
      {collection.entries.map((entry, index) => <a href={`#${route}/${entry.slug}`} key={entry.slug}><span>{String(index + 1).padStart(2, '0')}</span>{entry.title}<span aria-hidden="true">↓</span></a>)}
    </nav>
    <div className="collection-articles">
      {collection.entries.map((entry, index) => <article id={entry.slug} className="collection-article" tabIndex={-1} key={entry.slug}>
        <div className="article-meta"><span>{String(index + 1).padStart(2, '0')} / {entry.category}</span><span>{entry.label}</span></div>
        <h2>{entry.title}</h2><p className="article-description">{entry.description}</p>
        <div className="article-sections">{entry.sections.map(section => <section key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></section>)}</div>
        {entry.code && <pre><code>{entry.code}</code></pre>}
      </article>)}
    </div>
    <a className="back-link collection-end" href="#home">← Back to the homepage</a>
  </section>
}
