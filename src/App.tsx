import { useState, useEffect } from 'react'
import mcmasterLogo from './imports/image-1.png'
import aayanwastiLogo from './imports/newinitials.png'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ['about', 'education', 'experience', 'projects', 'contact']

const EDUCATION = [
  {
    school: 'McMaster University',
    location: 'Hamilton, Ontario',
    degree: 'B.A.Sc in Honours Computer Science Co-op',
    period: 'Expected April 2030',
    note: '',
    skills: ['Java', 'Python', 'JavaScript', 'HTML/CSS', 'SQL', 'Node.js', 'React.js', 'MATLAB'],
    tools: ['Git', 'GitHub', 'VS Code', 'MongoDB', 'REST APIs', 'Google Gemini API', 'OpenAI API', 'Supabase'],
  },
  {
    school: 'White Oaks Secondary School',
    location: 'Oakville, Ontario',
    degree: 'Ontario Secondary School Diploma',
    period: 'Sep 2022 – Jun 2026',
    note: 'Ontario Scholar · 96% average',
    skills: [],
    tools: [],
  },
]

const EXPERIENCE = [
  {
    role: 'Quality Assurance (AI) Intern',
    org: 'vFairs.com',
    location: 'Oakville, Ontario',
    period: 'Jul 2025 – Aug 2025',
    bullets: [
      'Performed QA testing on AI-driven product features for a global virtual events platform.',
      'Identified, reproduced, and documented software defects while collaborating with developers.',
      'Improved product reliability through structured manual and exploratory testing.',
    ],
  },
  {
    role: 'Founder & Lead Developer',
    org: 'AIHealth',
    location: 'Oakville, Ontario',
    period: 'May 2024 – Sep 2025',
    bullets: [
      'Founded and led development of an AI healthcare platform, driving product strategy and technical execution.',
      'Designed system architecture, managed backend development, and delivered core platform features.',
      'Built and launched HealthBot, improving AI response quality and reliability through iterative testing.',
      'Featured in Oakville News for community impact.',
    ],
  },
  {
    role: 'Engineering Team Member',
    org: 'WOSS Electrathon',
    location: 'Oakville, Ontario',
    period: 'Sep 2024 – Jun 2025',
    bullets: [
      'Assisted in designing and assembling the frame of a competitive electric vehicle for Electrathon.',
      'Tested vehicle components and supported troubleshooting during build and preparation phases.',
      'Collaborated with a multidisciplinary team to improve vehicle reliability and competition readiness.',
    ],
  },
]

const PROJECTS = [
  {
    name: 'HealthBot',
    role: 'Founder & Lead Developer',
    period: 'May 2024 – Sep 2025',
    description:
      'Full-stack AI medical assistant built with JavaScript and MongoDB to deliver personalized healthcare guidance. Designed the frontend, backend, database architecture, and deployment pipeline from scratch.',
    tags: ['JavaScript', 'MongoDB', 'Node.js', 'AI/ML', 'Full-Stack'],
  },
  {
    name: 'PlacdAI',
    role: 'Founder & Developer',
    period: 'May 2026 – Present',
    description:
      'AI interior design platform that generates personalized room concepts from user preferences and images. Building a product recommendation system connecting AI-generated designs with real furniture and decor products.',
    tags: ['AI', 'React.js', 'Image Processing', 'Product Rec Systems'],
  },
]

const ACTIVITIES = [
  {
    role: 'Vice President',
    org: 'Data and Machine Learning Club',
    period: 'Aug 2025 – Jun 2026',
    bullet: 'Organized sessions and workshops on machine learning concepts, growing member engagement and technical skills.',
  },
  {
    role: 'Executive',
    org: 'Engineering Club',
    period: 'Sep 2025 – Jun 2026',
    bullet: 'Contributed to club initiatives bridging software and hardware engineering, supporting project planning and execution.',
  },
  {
    role: 'Lead Builder & Programmer',
    org: 'WOSS VEX Robotics Club',
    period: 'Sep 2024 – Jun 2025',
    bullet: 'Led robot programming, developing autonomous systems and troubleshooting hardware/software issues.',
  },
]

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/AayanWasti',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/aayan-wasti',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Gmail',
    href: 'mailto:saayanw008@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
]

// ─── Scroll spy ───────────────────────────────────────────────────────────────

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    NAV_LINKS.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])
  return active
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#F7F1E6]/92 backdrop-blur-sm border-b border-[rgba(26,15,8,0.08)]">
      <div className="flex items-center gap-3">
        <img src={aayanwastiLogo} alt="McMaster University crest" className="h-8 w-auto" />
        <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-sm font-semibold text-[#7A003C]">
          Aayan Wasti
        </span>
      </div>

      <ul className="hidden md:flex gap-8">
        {NAV_LINKS.map((l) => (
          <li key={l}>
            <a
              href={`#${l}`}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className={`text-[11px] tracking-widest uppercase transition-colors duration-200 ${active === l ? 'text-[#7A003C]' : 'text-[#7A6A58] hover:text-[#1A0F08]'}`}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>

      <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span className={`block w-5 h-px bg-[#1A0F08]/60 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-px bg-[#1A0F08]/60 transition-all ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-px bg-[#1A0F08]/60 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#F7F1E6] border-b border-[rgba(26,15,8,0.08)] py-6 flex flex-col items-center gap-5">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l}`} onClick={() => setOpen(false)}
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-[11px] tracking-widest uppercase text-[#7A6A58] hover:text-[#7A003C] transition-colors">
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FDBF57]" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(122,0,60,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(122,0,60,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }} />

      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-center">
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-[11px] tracking-widest text-[#7A003C] uppercase mb-6 flex items-center gap-3">
              <span className="w-5 h-px bg-[#7A003C] inline-block" />
              McMaster University · B.A.Sc CS Co-op · Class of 2030
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[0.9] tracking-tight text-[#1A0F08] mb-6">
              Aayan<br />
              <em className="not-italic text-[#7A003C]">Wasti</em>
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif" }}
              className="text-[#7A6A58] text-base md:text-lg leading-relaxed max-w-lg mb-10 font-light">
              CS student, founder, and builder — focused on AI, full-stack systems, and turning
              ideas into products people actually use.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a href="#projects"
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="inline-flex items-center gap-3 bg-[#7A003C] text-[#FDFAF3] text-[11px] tracking-widest uppercase px-6 py-3.5 hover:bg-[#5C002D] transition-colors duration-200">
                View Projects
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="mailto:saayanw008@gmail.com"
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="inline-flex items-center gap-3 border border-[rgba(26,15,8,0.15)] text-[#7A6A58] text-[11px] tracking-widest uppercase px-6 py-3.5 hover:border-[#7A003C] hover:text-[#7A003C] transition-all duration-200">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Crest card */}
          <div className="flex flex-col items-center md:items-end gap-5">
            <div className="bg-[#FDFAF3] border border-[rgba(26,15,8,0.08)] p-8 flex flex-col items-center gap-4 shadow-sm w-[200px]">
              <img src={mcmasterLogo} alt="McMaster University crest" className="w-20 h-auto object-contain" />
              <div className="w-full h-px bg-[rgba(26,15,8,0.07)]" />
              <div className="text-center">
                <div style={{ fontFamily: "'Playfair Display', serif" }} className="text-sm font-semibold text-[#1A0F08]">McMaster University</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] tracking-widest mt-1.5 uppercase">CS Co-op</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] mt-1">Grad. April 2030</div>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-[#FDFAF3] border border-[rgba(26,15,8,0.1)] text-[#7A6A58] hover:text-[#7A003C] hover:border-[#7A003C]/30 transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-[rgba(26,15,8,0.12)] animate-pulse" />
        <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[9px] text-[#7A6A58] tracking-widest uppercase">scroll</span>
      </div>
    </section>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 py-20 border-t border-[rgba(26,15,8,0.08)]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline gap-4 mb-14">
          <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[11px] text-[#FDBF57] font-medium">{index}</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl md:text-4xl font-bold text-[#1A0F08]">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <Section id="about" index="01 /" title="About">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#7A6A58] leading-relaxed mb-5 font-light">
            I'm a first-year Computer Science Co-op student at McMaster University with a strong
            background in AI, full-stack development, and applied engineering. I've founded two
            companies, shipped production software, and led teams — all before my first year of
            university.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#7A6A58] leading-relaxed font-light">
            I'm driven by problems that matter: healthcare access, intelligent interfaces, and
            software that actually helps people. I thrive at the intersection of technical depth
            and product thinking.
          </p>
        </div>
        <div className="space-y-0">
          {[
            { label: 'University', value: 'McMaster University' },
            { label: 'Degree', value: 'B.A.Sc Computer Science Co-op' },
            { label: 'Location', value: 'Hamilton, Ontario' },
            { label: 'Hometown', value: 'Oakville, Ontario' },
            { label: 'Status', value: 'Open to Internships' },
            { label: 'Citizenship', value: 'Canadian Citizen' },
          ].map((row) => (
            <div key={row.label} className="flex items-baseline gap-4 py-4 border-b border-[rgba(26,15,8,0.07)] last:border-0">
              <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] tracking-widest uppercase w-24 shrink-0">{row.label}</span>
              <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-[#1A0F08] font-light">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────

function Education() {
  return (
    <Section id="education" index="02 /" title="Education">
      <div className="space-y-px">
        {EDUCATION.map((edu) => (
          <div key={edu.school} className="bg-[#FDFAF3] border border-[rgba(26,15,8,0.07)] p-8 hover:bg-[#F7F1E6] transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-[#1A0F08] mb-1">{edu.school}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-[#7A6A58] italic font-light">{edu.degree}</p>
              </div>
              <div className="text-right shrink-0">
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58]">{edu.location}</div>
                <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] mt-1">{edu.period}</div>
              </div>
            </div>

            {edu.note && (
              <div className="inline-block bg-[#FDBF57]/20 border border-[#FDBF57]/40 px-3 py-1 mb-5">
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] tracking-wide">{edu.note}</span>
              </div>
            )}

            {edu.skills.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[rgba(26,15,8,0.07)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] tracking-widest uppercase mb-3 flex items-center gap-2">
                      <span className="w-3 h-px bg-[#FDBF57] inline-block" />
                      Programming
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {edu.skills.map((s) => (
                        <span key={s} style={{ fontFamily: "'Inter', sans-serif" }}
                          className="text-xs text-[#1A0F08] bg-[#EDE4D3] hover:bg-[#FDBF57]/30 transition-colors px-3 py-1.5 font-medium cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] tracking-widest uppercase mb-3 flex items-center gap-2">
                      <span className="w-3 h-px bg-[#FDBF57] inline-block" />
                      Tools & Platforms
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {edu.tools.map((t) => (
                        <span key={t} style={{ fontFamily: "'Inter', sans-serif" }}
                          className="text-xs text-[#1A0F08] bg-[#EDE4D3] hover:bg-[#FDBF57]/30 transition-colors px-3 py-1.5 font-medium cursor-default">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Section id="experience" index="03 /" title="Experience">
      <div className="space-y-px">
        {EXPERIENCE.map((exp, i) => (
          <div key={i} className="bg-[#FDFAF3] border border-[rgba(26,15,8,0.07)] overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-6 md:px-8 py-5 flex items-start md:items-center gap-6 hover:bg-[#F7F1E6] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="font-semibold text-[#1A0F08] text-base">{exp.role}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-[#7A003C] font-medium">{exp.org}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] hidden md:block">{exp.period}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`text-[#7A6A58] transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                  <path d="M3 7h8M7 3v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </button>
            {open === i && (
              <div className="px-6 md:px-8 pb-7 border-t border-[rgba(26,15,8,0.06)]">
                <span style={{ fontFamily: "'DM Mono', monospace" }} className="block text-[10px] text-[#7A003C] mt-4 mb-4 md:hidden">{exp.period}</span>
                <ul className="space-y-2.5 mt-4">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-[7px] w-1 h-1 rounded-full bg-[#FDBF57] shrink-0" />
                      <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-[#7A6A58] leading-relaxed font-light">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-[#1A0F08] mb-6">Activities & Leadership</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(26,15,8,0.06)]">
          {ACTIVITIES.map((a) => (
            <div key={a.org} className="bg-[#FDFAF3] p-6 hover:bg-[#F7F1E6] transition-colors">
              <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] tracking-widest uppercase mb-2">{a.role}</div>
              <div style={{ fontFamily: "'Playfair Display', serif" }} className="font-semibold text-[#1A0F08] text-sm mb-1">{a.org}</div>
              <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] mb-4">{a.period}</div>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-[#7A6A58] leading-relaxed font-light">{a.bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects() {
  return (
    <Section id="projects" index="04 /" title="Projects">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(26,15,8,0.06)]">
        {PROJECTS.map((p) => (
          <div key={p.name} className="group bg-[#FDFAF3] p-8 hover:bg-[#F7F1E6] transition-colors flex flex-col">
            <div className="w-8 h-0.5 bg-[#FDBF57] mb-6" />
            <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A003C] tracking-widest uppercase mb-2">{p.role}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#1A0F08] mb-1 group-hover:text-[#7A003C] transition-colors">{p.name}</h3>
            <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] mb-5">{p.period}</div>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-[#7A6A58] leading-relaxed font-light flex-1 mb-6">{p.description}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} style={{ fontFamily: "'DM Mono', monospace" }}
                  className="text-[10px] text-[#7A003C] border border-[#7A003C]/20 px-2.5 py-1 tracking-wide group-hover:border-[#7A003C]/40 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <Section id="contact" index="05 /" title="Contact">
      <div className="max-w-xl">
        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#7A6A58] leading-relaxed mb-12 font-light">
          I'm always open to interesting conversations — whether about a project, internship
          opportunity, or just to connect. Reach out anytime.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOCIAL_LINKS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 bg-[#FDFAF3] border border-[rgba(26,15,8,0.08)] p-6 hover:border-[#7A003C]/30 hover:bg-[#F7F1E6] transition-all duration-200">
              <span className="text-[#7A6A58] group-hover:text-[#7A003C] transition-colors">{s.icon}</span>
              <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] group-hover:text-[#7A003C] tracking-widest uppercase transition-colors">{s.label}</span>
            </a>
          ))}
        </div>

        <div className="mt-10 pt-10 border-t border-[rgba(26,15,8,0.07)]">
          <div style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] tracking-widest uppercase mb-2">Direct email</div>
          <a href="mailto:saayanw008@gmail.com"
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-xl font-semibold text-[#1A0F08] hover:text-[#7A003C] transition-colors">
            saayanw008@gmail.com
          </a>
        </div>
      </div>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-6 md:px-12 py-8 border-t border-[rgba(26,15,8,0.08)] flex flex-col md:flex-row justify-between items-center gap-3">
      <div className="flex items-center gap-3">
        <img src={aayanwastiLogo} alt="McMaster crest" className="h-5 w-auto opacity-80" />
        <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] tracking-widest">
          Aayan Wasti · McMaster University · CS Co-op
        </span>
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace" }} className="text-[10px] text-[#7A6A58] tracking-widest">
        Oakville & Hamilton, Ontario
      </span>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const active = useActiveSection()
  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#1A0F08]">
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-[#FDBF57] z-[60]" />
      <Nav active={active} />
      <Hero />
      <About />
      <Education />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
