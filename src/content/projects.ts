import { parseFrontmatter } from '../lib/article'

// Each project is a Markdown file in src/content/projects/. Add a file to add a project.
// Frontmatter keys: title, year, period, role, status, summary, tags (comma separated),
// links ("Label|https://url ; Label|https://url"), order (card order), art (cover art key), draft (true/false).
const files = import.meta.glob('./projects/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export type ProjectLink = { label: string; url: string }
export type Project = {
  slug: string; title: string; year: string; period: string; role: string; status: string; summary: string
  tags: string[]; links: ProjectLink[]; order: number; art: string; draft: boolean; body: string
  hero?: { src: string; alt: string; caption?: string; width?: number; height?: number }
}

export const projects: Project[] = Object.entries(files).map(([path, raw]) => {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const { meta, body } = parseFrontmatter(raw)
  return {
    slug, title: meta.title || slug, year: meta.year || '', period: meta.period || '', role: meta.role || '', status: meta.status || '',
    summary: meta.summary || '', tags: (meta.tags || '').split(',').map(s => s.trim()).filter(Boolean),
    links: (meta.links || '').split(';').map(s => s.trim()).filter(Boolean).map(s => { const [label, ...u] = s.split('|'); return { label: label.trim(), url: u.join('|').trim() } }),
    hero: meta.hero ? { src: meta.hero, alt: meta.heroAlt || meta.title || slug, caption: meta.heroCaption, width: Number(meta.heroWidth) || undefined, height: Number(meta.heroHeight) || undefined } : undefined,
    order: Number(meta.order || 99), art: meta.art || slug, draft: meta.draft === 'true', body,
  }
}).sort((a, b) => a.order - b.order)

export const getProject = (slug?: string) => projects.find(p => p.slug === slug)
