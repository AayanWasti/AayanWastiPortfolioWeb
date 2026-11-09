import { Fragment, useState, type ReactNode } from 'react'

/* A tiny, dependency-free Markdown renderer for project write-ups.
   Supported: ## / ### headings, paragraphs, **bold**, *italic*, `code`, [links](url), lists, > quotes,
   ``` code fences (```cpp title="file.cpp"), ![alt](src "caption") figures, --- rules,
   :::note / :::limit / :::placeholder boxes, and ```flow diagrams. */

export type Block =
  | { t: 'h2' | 'h3'; id: string; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'quote'; text: string }
  | { t: 'code'; lang: string; title?: string; code: string }
  | { t: 'img'; alt: string; src: string; caption?: string }
  | { t: 'flow'; title?: string; rows: string[][] }
  | { t: 'box'; kind: 'note' | 'limit' | 'placeholder'; title: string; paras: string[] }
  | { t: 'press'; title: string; publication: string; headline: string; date: string; author: string; description: string; url: string }
  | { t: 'hr' }
export type Heading = { id: string; text: string }

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m[2] }
}

export function parseArticle(body: string): { blocks: Block[]; headings: Heading[] } {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = [], headings: Heading[] = []
  const used = new Set<string>()
  let i = 0
  const isSpecial = (l: string) => /^(#{2,3} |```|:::|> |- |\d+\. |---$|!\[)/.test(l)
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    let m: RegExpMatchArray | null
    if ((m = line.match(/^(#{2,3}) (.+)$/))) {
      let id = slugify(m[2]) || 'section'; let n = 2
      while (used.has(id)) id = `${slugify(m[2])}-${n++}`
      used.add(id)
      blocks.push({ t: m[1].length === 2 ? 'h2' : 'h3', id, text: m[2] })
      if (m[1].length === 2) headings.push({ id, text: m[2] })
      i++
    } else if ((m = line.match(/^```(\w*)\s*(?:title="([^"]*)")?\s*$/))) {
      const buf: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      if (m[1] === 'flow') {
        let title: string | undefined
        const rows: string[][] = []
        for (const l of buf) {
          if (!l.trim()) continue
          if (l.startsWith('# ')) title = l.slice(2).trim()
          else rows.push(l.split('->').map(s => s.trim()).filter(Boolean))
        }
        blocks.push({ t: 'flow', title, rows })
      } else blocks.push({ t: 'code', lang: m[1], title: m[2], code: buf.join('\n') })
    } else if ((m = line.match(/^:::press\s*(.*)$/))) {
      const fields: Record<string, string> = {}; i++
      while (i < lines.length && lines[i].trim() !== ':::') {
        const at = lines[i].indexOf(':')
        if (at > 0) fields[lines[i].slice(0, at).trim()] = lines[i].slice(at + 1).trim()
        i++
      }
      i++
      blocks.push({ t: 'press', title: m[1].trim(), publication: fields.publication || '', headline: fields.headline || '', date: fields.date || '', author: fields.author || '', description: fields.description || '', url: /^https?:\/\//i.test(fields.url || '') ? fields.url : '' })
    } else if ((m = line.match(/^:::(note|limit|placeholder)\s*(.*)$/))) {
      const buf: string[] = []; i++
      while (i < lines.length && lines[i].trim() !== ':::') buf.push(lines[i++])
      i++
      blocks.push({ t: 'box', kind: m[1] as 'note' | 'limit' | 'placeholder', title: m[2].trim(), paras: buf.join('\n').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean) })
    } else if ((m = line.match(/^!\[(.*?)\]\((\S+?)(?:\s+"(.*)")?\)\s*$/))) {
      blocks.push({ t: 'img', alt: m[1], src: m[2], caption: m[3] }); i++
    } else if (line.trim() === '---') { blocks.push({ t: 'hr' }); i++
    } else if (line.startsWith('> ')) {
      const buf: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) buf.push(lines[i++].slice(2))
      blocks.push({ t: 'quote', text: buf.join(' ') })
    } else if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line), items: string[] = []
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith('- '))) items.push(lines[i++].replace(/^(- |\d+\. )/, ''))
      blocks.push({ t: ordered ? 'ol' : 'ul', items })
    } else {
      const buf = [line]; i++
      while (i < lines.length && lines[i].trim() && !isSpecial(lines[i])) buf.push(lines[i++])
      blocks.push({ t: 'p', text: buf.join(' ') })
    }
  }
  return { blocks, headings }
}

/* ---------- inline ---------- */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)]+\))/g
  let last = 0, m: RegExpExecArray | null, k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const s = m[0]
    if (m[1]) out.push(<code key={k++}>{s.slice(1, -1)}</code>)
    else if (m[2]) out.push(<strong key={k++}>{s.slice(2, -2)}</strong>)
    else if (m[3]) out.push(<em key={k++}>{s.slice(1, -1)}</em>)
    else {
      const [, label, url] = s.match(/\[([^\]]+)\]\(([^)]+)\)/)!
      const ext = /^https?:/.test(url)
      out.push(<a key={k++} href={url} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>)
    }
    last = m.index + s.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/* ---------- syntax highlighting (small and generic) ---------- */
const KW = new Set('const let var function return if else for while import from export default async await try catch new class interface type void int float long char bool boolean string number true false null undefined include define static extends public private this typeof as'.split(' '))
function highlight(code: string, lang: string): ReactNode[] {
  const cLike = /^(c|cpp|ino|arduino)$/.test(lang)
  const re = new RegExp(`(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|(${cLike ? '#[a-z]+[^\\n]*|' : ''}"(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*'|\`(?:\\\\.|[^\`\\\\])*\`)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_]\\w*)`, 'g')
  const out: ReactNode[] = []
  let last = 0, m: RegExpExecArray | null, k = 0
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const s = m[0]
    if (m[1]) out.push(<span key={k++} className="tk-cm">{s}</span>)
    else if (m[2]) out.push(<span key={k++} className={s.startsWith('#') ? 'tk-kw' : 'tk-st'}>{s}</span>)
    else if (m[3]) out.push(<span key={k++} className="tk-nm">{s}</span>)
    else if (KW.has(s)) out.push(<span key={k++} className="tk-kw">{s}</span>)
    else out.push(s)
    last = m.index + s.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

/* ---------- blocks ---------- */
export function ArticleFigure({ src, alt, caption, priority = false, width, height }: { src: string; alt: string; caption?: string; priority?: boolean; width?: number; height?: number }) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const failed = failedSource === src
  return <figure className="pa-fig">
    {failed
      ? <div className="pa-box pa-ph pa-imgph"><span className="pa-boxlabel">Image to add</span><p>{alt || 'Screenshot'} could not be loaded. {/^https?:/.test(src) ? <>Check the image address, or download it and use a local file.</> : <>Save the file as <code>public{src.startsWith('/') ? src : `/${src}`}</code> to show it here.</>}</p></div>
      : <img src={src} alt={alt} width={width} height={height} loading={priority ? "eager" : "lazy"} decoding="async" onError={() => setFailedSource(src)} />}
    {caption && <figcaption>{inline(caption)}</figcaption>}
  </figure>
}

function Flow({ title, rows }: { title?: string; rows: string[][] }) {
  return <figure className="pa-flow" role="group" aria-label={title || 'Diagram'}>
    {title && <figcaption>{title}</figcaption>}
    {rows.map((row, r) => <div className="pa-flow-row" key={r}>
      {row.map((raw, c) => {
        const dashed = raw.startsWith('?'), [head, sub] = raw.replace(/^\?/, '').split('|')
        return <Fragment key={c}>
          {c > 0 && <span className="pa-arrow" aria-hidden="true">→</span>}
          <div className={`pa-node${dashed ? ' pa-ph' : ''}`}><b>{head}</b>{sub && <span>{sub}</span>}</div>
        </Fragment>
      })}
    </div>)}
  </figure>
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => {
    switch (b.t) {
      case 'h2': return <h2 id={b.id} tabIndex={-1} key={i}>{b.text}</h2>
      case 'h3': return <h3 id={b.id} tabIndex={-1} key={i}>{b.text}</h3>
      case 'p': return <p key={i}>{inline(b.text)}</p>
      case 'ul': return <ul key={i}>{b.items.map((t, k) => <li key={k}>{inline(t)}</li>)}</ul>
      case 'ol': return <ol key={i}>{b.items.map((t, k) => <li key={k}>{inline(t)}</li>)}</ol>
      case 'quote': return <blockquote key={i}>{inline(b.text)}</blockquote>
      case 'hr': return <hr key={i} />
      case 'img': return <ArticleFigure key={i} src={b.src} alt={b.alt} caption={b.caption} />
      case 'flow': return <Flow key={i} title={b.title} rows={b.rows} />
      case 'code': return <figure className="pa-code" key={i}>
        {b.title && <figcaption>{b.title}</figcaption>}
        <pre tabIndex={0}><code>{highlight(b.code, b.lang)}</code></pre>
      </figure>
      case 'press': return <aside className="pa-press" aria-label={b.title || `Featured in ${b.publication}`} key={i}>
        <p className="pa-press-kicker">{b.title || `Featured in ${b.publication}`}</p>
        <div className="pa-press-meta"><span>{b.publication}</span><span>{b.date}{b.author ? ` · ${b.author}` : ''}</span></div>
        <p className="pa-press-headline">{b.headline}</p>
        <p className="pa-press-description">{b.description}</p>
        {b.url && <a className="pa-press-link" href={b.url} target="_blank" rel="noopener noreferrer">Read the {b.publication} article <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
      </aside>
      case 'box': return <aside className={`pa-box pa-${b.kind}`} key={i}>
        <span className="pa-boxlabel">{b.kind === 'placeholder' ? 'Placeholder' : b.kind === 'limit' ? 'Limits' : 'Note'}{b.title ? ` · ${b.title}` : ''}</span>
        {b.paras.map((p, k) => <p key={k}>{inline(p)}</p>)}
      </aside>
    }
  })}</>
}

export const countPlaceholders = (blocks: Block[]) => blocks.filter(b => b.t === 'box' && b.kind === 'placeholder').length
export const readMinutes = (blocks: Block[]) => Math.max(1, Math.round(blocks.map(b => b.t === 'p' ? b.text : b.t === 'ul' || b.t === 'ol' ? b.items.join(' ') : b.t === 'box' ? b.paras.join(' ') : '').join(' ').split(/\s+/).length / 210))
