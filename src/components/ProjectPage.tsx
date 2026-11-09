import { useEffect, useMemo, useState } from 'react'
import { ArticleFigure, Blocks, countPlaceholders, parseArticle, readMinutes } from '../lib/article'
import { projects, type Project } from '../content/projects'
import ProjectArt from './ProjectArt'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ProjectPage({ project }: { project: Project }) {
  const { blocks, headings } = useMemo(() => parseArticle(project.body), [project.body])
  const [active, setActive] = useState('')
  const todo = countPlaceholders(blocks)
  const i = projects.findIndex(p => p.slug === project.slug)
  const prev = projects[i - 1], next = projects[i + 1]

  // Highlight the section being read in the table of contents.
  useEffect(() => {
    const els = headings.map(h => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e)
    if (!els.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(entries => {
      const seen = entries.filter(e => e.isIntersecting)
      if (seen.length) setActive(seen[0].target.id)
    }, { rootMargin: '-15% 0px -70% 0px' })
    els.forEach(e => io.observe(e))
    return () => io.disconnect()
  }, [headings])

  // Hash routing owns the URL, so the table of contents scrolls instead of changing the hash.
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
    document.getElementById(id)?.focus({ preventScroll: true })
    setActive(id)
  }

  return <article className="pa" data-project={project.slug}>
    <a className="back-link" href="#projects">← All projects</a>
    <header className="pa-head">
      <p className="pa-eyebrow">{project.status}</p>
      <h1>{project.title}</h1>
      <p className="pa-summary">{project.summary}</p>
      <dl className="pa-meta">
        <div><dt>Date</dt><dd>{project.period}</dd></div>
        <div><dt>Role</dt><dd>{project.role}</dd></div>
        <div><dt>Read</dt><dd>{readMinutes(blocks)} min</dd></div>
      </dl>
      <ul className="pa-tags" aria-label="Technologies">{project.tags.map(t => <li className="tag" key={t}>{t}</li>)}</ul>
      {project.links.length > 0 && <p className="pa-links">{project.links.map(l => <a className="text-link" key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}</p>}
      {todo > 0 && <p className="pa-todo">{project.draft ? 'Draft. ' : ''}{todo} placeholder{todo === 1 ? '' : 's'} left to fill in</p>}
    </header>
    {project.hero ? <div className="pa-hero"><ArticleFigure src={project.hero.src} alt={project.hero.alt} caption={project.hero.caption} width={project.hero.width} height={project.hero.height} priority /></div> : <ProjectArt project={project.art} />}
    <div className="pa-layout">
      <aside className="pa-toc" aria-label="On this page">
        <nav>
          <p>On this page</p>
          <ol>{headings.map(h => <li key={h.id}><a href={`#projects/${project.slug}`} onClick={jump(h.id)} aria-current={active === h.id ? 'true' : undefined}>{h.text}</a></li>)}</ol>
        </nav>
      </aside>
      <div className="pa-body"><Blocks blocks={blocks} /></div>
    </div>
    <nav className="ep-nav pa-more" aria-label="More projects">
      {prev ? <a href={`#projects/${prev.slug}`}><span>← Previous</span>{prev.title}</a> : <i />}
      {next ? <a className="ep-next" href={`#projects/${next.slug}`}><span>Next →</span>{next.title}</a> : <i />}
    </nav>
    <a className="text-link pa-ask" href="mailto:saayanw008@gmail.com">Ask me about {project.title} <span aria-hidden="true">↗</span></a>
  </article>
}
