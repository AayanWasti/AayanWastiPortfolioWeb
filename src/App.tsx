import { useEffect, useState } from "react"
import { ACTIVITIES, EDUCATION, EXPERIENCE } from "./data"
import Universe from "./components/Universe"
import HomeCollections from "./components/HomeCollections"
import FieldNotes, { noteTitle } from './components/FieldNotes'
import ProjectPage from './components/ProjectPage'
import { projects, getProject } from './content/projects'
import Perspectives, { perspectiveTitle } from './components/Perspectives'
import CollectionPage from "./components/CollectionPage"
import { collections } from "./content/collections"
import ProjectArt from "./components/ProjectArt"
import resume from "./imports/Aayan_Wasti_Resume.pdf"

const pages = ["Home", "Projects", "Field Notes", "Favourites", "Perspectives"]
const pageHash = (name: string) => name.toLowerCase().replace(/ /g, "-")
const currentRoute = () => window.location.hash.slice(1) || "home"
const categories = [
  "Architecture",
  "Space",
  "Books",
  "Movies",
  "Music",
  "Websites",
]
const arrows = ["⌂", "✧", "▤", "▹", "♬", "↗"]
function Arrow() {
  return <span aria-hidden="true">↗</span>
}
function Socials() {
  return (
    <div className="social-links flex flex-wrap items-center gap-x-5 gap-y-3">
      <a href="https://github.com/AayanWasti" target="_blank" rel="noreferrer">
        GitHub <Arrow />
      </a>
      <a
        href="https://linkedin.com/in/aayan-wasti"
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn <Arrow />
      </a>
      <a href="mailto:saayanw008@gmail.com">
        Email <Arrow />
      </a>
      <a href={resume} target="_blank" rel="noreferrer">
        Résumé <Arrow />
      </a>
    </div>
  )
}
function ProjectGrid() {
  return <div className="project-grid grid grid-cols-1 sm:grid-cols-2">
    {projects.map((project) => <a className="project" href={`#projects/${project.slug}`} key={project.slug}>
      <ProjectArt project={project.art} />
      <div className="project-meta"><h3>{project.title}</h3><span>{project.year}</span></div>
    </a>)}
  </div>
}
function Home() {
  return <>
    <section className="intro" aria-label="Introduction">
      <h1 className="sr-only">Aayan Wasti</h1>
      <p>I’m a Computer Science Co-op student at <a href="https://www.mcmaster.ca/" target="_blank" rel="noreferrer">McMaster University</a>.</p>
      <p>Currently, I’m building <a href="#projects/placdai">PlacdAI</a>, an AI interior design platform. Previously, I founded <a href="#projects/healthbot">AIHealth</a> and built HealthBot, a personal AI healthcare assistant. <a className="read-more" href="#about">Read more</a></p>
      <p className="intro-contact">You can find me on <a href="https://github.com/AayanWasti" target="_blank" rel="noreferrer">GitHub</a> and <a href="https://linkedin.com/in/aayan-wasti" target="_blank" rel="noreferrer">LinkedIn</a>, or reach me via <a href="mailto:saayanw008@gmail.com">email</a>.</p>
    </section>
    <HomeCollections />
  </>
}
function Projects({ slug }: { slug?: string }) {
  const project = getProject(slug)
  if (slug && !project)
    return (
      <>
        <PageTitle
          label="A WRONG TURN"
          title="Nothing in this orbit."
          description="That project couldn’t be found."
        />
        <a className="text-link" href="#projects">
          ← Back to projects
        </a>
      </>
    )
  if (project) return <ProjectPage project={project} />
  return (
    <>
      <PageTitle
        label="THINGS I’VE BUILT"
        title="Projects"
        description="A few ideas I’ve turned into software. From healthcare to the spaces we live in."
      />
      <ProjectGrid />
    </>
  )
}
function PageTitle({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description: string
}) {
  return (
    <div className="page-title">
      <div className="eyebrow">{label}</div>
      <h1>
        {title}
        <span className="gold">.</span>
      </h1>
      <p>{description}</p>
    </div>
  )
}
function Favourites() {
  const [category, setCategory] = useState("Architecture")
  return (
    <>
      <PageTitle
        label="BEYOND THE CODE"
        title="Favourites"
        description="Architecture, distant galaxies, and everything in between. A collection in progress."
      />
      <div
        className="favourite-categories grid grid-cols-2 sm:grid-cols-3"
        role="group"
        aria-label="Favourite categories"
      >
        {categories.map((name, i) => (
          <button
            key={name}
            onClick={() => setCategory(name)}
            aria-pressed={category === name}
            className={category === name ? "chosen" : ""}
          >
            <span aria-hidden="true">{arrows[i]}</span>
            {name}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <section className="collection-state" aria-live="polite">
        <span className="eyebrow">
          THE COLLECTION /{" "}
          {String(categories.indexOf(category) + 1).padStart(2, "0")}
        </span>
        <h2>{category}</h2>
        <p>No favourites added here yet.</p>
      </section>
    </>
  )
}
function About() {
  return (
    <>
      <PageTitle
        label="THE PERSON BEHIND THE PROJECTS"
        title="A little about me"
        description="CS student, founder, and builder. Based in Hamilton and Oakville, Ontario."
      />
      <div className="about-prose">
        <p>
          I’m a first-year Computer Science Co-op student at McMaster University
          with a background in AI, full-stack development, and applied
          engineering. I’ve founded two companies, shipped production software,
          and led teams.
        </p>
        <p>
          I’m driven by problems that matter: healthcare access, intelligent
          interfaces, and software that helps people. I enjoy working at the
          intersection of technical depth and product thinking.
        </p>
      </div>
      <div className="availability">
        <span /> Open to internships{" "}
        <span className="availability-location">
          Hamilton, Ontario · Canadian citizen
        </span>
      </div>
      <section className="about-section">
        <h2>Experience</h2>
        {EXPERIENCE.map((e) => (
          <details key={e.org} className="experience-row">
            <summary>
              <span>
                <strong>{e.org}</strong>
                <span className="row-description">{e.role}</span>
              </span>
              <span className="row-date">
                {e.period}
                <span className="expand-icon">+</span>
              </span>
            </summary>
            <ul>
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </details>
        ))}
      </section>
      <section className="about-section">
        <h2>Education</h2>
        {EDUCATION.map((e) => (
          <div className="education-row" key={e.school}>
            <div className="flex justify-between flex-wrap gap-2">
              <strong>{e.school}</strong>
              <span className="row-date">{e.period}</span>
            </div>
            <p>{e.degree}</p>
            {e.note && <p className="gold">{e.note}</p>}
          </div>
        ))}
      </section>
      <section className="about-section">
        <h2>Tools of the trade</h2>
        <p className="skills-label">Programming</p>
        <div className="flex flex-wrap gap-2">
          {EDUCATION[0].skills.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
        <p className="skills-label">Tools & platforms</p>
        <div className="flex flex-wrap gap-2">
          {EDUCATION[0].tools.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </section>
      <section className="about-section">
        <h2>Outside the classroom</h2>
        {ACTIVITIES.map((a) => (
          <details className="experience-row" key={a.org}>
            <summary>
              <span>
                <strong>{a.org}</strong>
                <span className="row-description">{a.role}</span>
              </span>
              <span className="expand-icon">+</span>
            </summary>
            <p>{a.bullet}</p>
            <span className="row-date">{a.period}</span>
          </details>
        ))}
      </section>
      <section className="about-section contact">
        <h2>Say hello.</h2>
        <p>
          For a project, an internship opportunity, or an interesting
          conversation.
        </p>
        <a className="email-link" href="mailto:saayanw008@gmail.com">
          saayanw008@gmail.com <Arrow />
        </a>
        <Socials />
      </section>
    </>
  )
}
export default function App() {
  const [route, setRoute] = useState(currentRoute)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark' }
    catch { return 'dark' }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#ffffff' : '#06050d')
    try { localStorage.setItem('portfolio-theme', theme) } catch { /* Optional persistence. */ }
  }, [theme])
  useEffect(() => {
    const ready = requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'))
    const syncTheme = (event: StorageEvent) => {
      if (event.key === 'portfolio-theme' || event.key === null) setTheme(event.newValue === 'light' ? 'light' : 'dark')
    }
    window.addEventListener('storage', syncTheme)
    return () => { cancelAnimationFrame(ready); window.removeEventListener('storage', syncTheme) }
  }, [])
  useEffect(() => {
    const navigate = () => {
      setRoute(currentRoute())
      window.scrollTo({ top: 0, behavior: "instant" })
    }
    window.addEventListener("hashchange", navigate)
    return () => window.removeEventListener("hashchange", navigate)
  }, [])
  const [page, slug] = route.split("/")
  useEffect(() => {
    const entry = slug ? (page === "projects" ? getProject(slug)?.title : page === "perspectives" ? perspectiveTitle(slug) : page === "field-notes" ? noteTitle(slug) : undefined) : undefined
    if (entry) { document.title = `${entry} — Aayan Wasti`; return }
    document.title = `${
      page === "home"
        ? "Aayan Wasti"
        : `${(Object.prototype.hasOwnProperty.call(collections, page) ? collections[page].title : undefined) || pages.find((p) => pageHash(p) === page) || (page === "about" ? "About" : undefined) || "Portfolio"} — Aayan Wasti`
    }`
  }, [page, slug])
  return (
    <>
      <Universe theme={theme} />
      <a
        href="#main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById("main")?.focus()
          document.getElementById("main")?.scrollIntoView()
        }}
      >
        Skip to content
      </a>
      <div className="site-shell relative mx-auto">
        <header className="site-header flex justify-between items-center gap-6">
          <a href="#home" className="wordmark">
            Aayan Wasti

          </a>
          <nav aria-label="Main navigation" className="flex items-center gap-6">
            {pages.map((name) => (
              <a
                key={name}
                href={`#${pageHash(name)}`}
                aria-current={page === pageHash(name) || (name === "Field Notes" && page === "engineering-notes") ? "page" : undefined}
              >
                {name}
              </a>
            ))}
          </nav>
        </header>
        <main id="main" tabIndex={-1}>
          {page === "home" ? (
            <Home />
          ) : page === "projects" ? (
            <Projects slug={slug} />
          ) : Object.prototype.hasOwnProperty.call(collections, page) ? (
            <CollectionPage collection={collections[page]} route={page} entrySlug={slug} />
          ) : page === "field-notes" ? (
            <FieldNotes entrySlug={slug} />
          ) : page === "favourites" ? (
            <Favourites />
          ) : page === "perspectives" ? (
            <Perspectives entrySlug={slug} />
          ) : page === "about" ? (
            <About />
          ) : (
            <PageTitle
              label="404"
              title="Lost in space"
              description="Use the navigation to find your way back."
            />
          )}
        </main>
        <footer className="site-footer">
          <a className="source-download" href="/aayan-wasti-source.zip" download>Source code <span aria-hidden="true">↓</span></a>
          <button className="theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(current => current === 'light' ? 'dark' : 'light')}>
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☼'}</span>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </footer>
      </div>
    </>
  )
}
