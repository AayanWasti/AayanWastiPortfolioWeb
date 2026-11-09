# Aayan Wasti — Portfolio

Personal portfolio with a narrow, content-first reference layout using the existing React 19, Vite 8, TypeScript, and Tailwind CSS 4 setup.

For Windows setup and the latest local HealthBot preview, start with `WINDOWS-START-HERE.md`.

## Run locally

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npx tsc --noEmit
npm run build
```

Deploy `dist/` to any static host. Pages use hash routes; no server rewrite rules are needed.

## Content and components

- `src/data.ts`: existing projects, education, experience, and activities.
- `src/App.tsx`: introduction, contact links, navigation, Field Notes and Favourites. The homepage collections open dedicated pages; new content is labelled as editable samples.
- `src/components/HomeCollections.tsx`: the four homepage previews, links to dedicated pages in new tabs, and On My Desk. Missing writing and reading content is explicitly marked.
- `src/components/ProjectArt.tsx`: original illustrative covers, not product screenshots.
- `src/components/Universe.tsx`: lightweight binary starfield, two-arm binary spiral galaxy, and shooting stars; capped pixel ratio and particle count, reduced-motion support, hidden-tab pause, and an enlarged rotating binary galaxy with a luminous core and independently twinkling binary stars.
- `src/index.css`: typography, navy palette, gold accents, and responsive layouts. Dark navy is the default for new visitors; the existing theme switch preserves a saved light or dark preference.

No personal recommendations, articles, project URLs, or metrics were invented. The original Twitter link pointed to the service homepage, so it is not presented as a personal profile.

Validation: TypeScript, production build, and server-render checks of all pages and project detail routes. Interactive desktop/mobile browser QA was unavailable in the build environment.

## Source download

The Source code link at the bottom of the website downloads the complete React/Vite project. It excludes dependencies, Git history, hosting identity, and compiled output. Run `npm ci` and `npm run dev` after extracting. The original GitHub repository is unchanged.

## Homepage collections

The homepage now shows The Drawing Board, Engineering Notes, Currently Exploring, and Things I’ve Built. All four collection actions open dedicated pages in new tabs. The Drawing Board, Engineering Notes, and Currently Exploring contain clearly labelled sample content; Things I’ve Built opens the existing Projects page. On My Desk uses PlacdAI and clearly marked idea/learning placeholders; unprovided learning content is marked as not added yet.

The binary starfield has more depth and particles, with small distant stars and fainter stars behind the reading column. The existing galaxy, theme switch, and occasional shooting stars remain.

Regenerate the downloadable source after editing (Python 3, no extra packages):

```sh
python3 scripts/package-source.py
```

This writes `public/aayan-wasti-source.zip`, served by Vite locally and copied into `dist/` on build. The archive excludes itself. The archive includes the dedicated collection pages and theme-transition improvements.

The Drawing Board is for ideas and unfinished concepts; Engineering Notes remains a separate place for lessons learned. The new example ideas, technical notes, and exploration entries are explicitly labelled placeholders rather than claims about completed work or published writing. The galaxy uses two logarithmic spiral arms, seeded stellar clusters, a diffuse disk, and a concentrated warm core; all visible stars remain binary digits.

## Editing the new collection pages

Edit `src/content/collections.ts`. There are three sample ideas, three sample technical notes, and four sample explorations. Each entry has a title, description, category, placeholder label, and detail sections. Replace these with real content and update the labels and page notice when ready. The existing real projects remain in `src/data.ts`.

Routes: `#drawing-board`, `#engineering-notes`, `#currently-exploring`, and `#projects`. Each homepage action uses a normal link with `target="_blank"` and `rel="noopener noreferrer"`. Entry links preserve the collection route and support direct navigation. `#field-notes` also shows Engineering Notes, preserving the existing navigation.

Theme preference is restored before first paint, saved in localStorage, and synchronized across open tabs. CSS color transitions last 280 ms after initial load. The galaxy blends its palette without restarting its motion; reduced-motion mode switches instantly. Publication is performed separately from local builds.


## Perspectives page

The nav item **About** has been replaced by **Perspectives** (`#perspectives`). Its content lives in `src/content/perspectives.ts`: add, edit, reorder or delete entries there, and set `showSampleNotice` to `false` once the writing is your own. Each entry is also linkable as `#perspectives/<id>`. The old About page still exists at `#about` (it is no longer in the nav, but the homepage "Read more" link uses it).

## Index lists and entry pages

Field Notes and Perspectives both use the same year-grouped list (`src/components/Entries.tsx`). Each row opens its own page at `#field-notes/<slug>` or `#perspectives/<id>`. To use a real thumbnail instead of the generated digit tile, add `image: '/your-image.jpg'` to an entry (put the file in `public/`). In a perspective's `body`, start a paragraph with `## ` to make a subheading.

## Project write-ups

Every project is one Markdown file in `src/content/projects/` (`carenest.md`, `healthbot.md`, `placdai.md`, `datumguard.md`). Add a file to add a project: it appears on the Projects page and opens at `#projects/<file-name>`. No code changes needed.

**Frontmatter** (top of the file, between `---` lines): `title`, `year` (shown on the card), `period`, `role`, `status`, `summary`, `tags` (comma separated), `links` (`Label|https://url ; Label|https://url`), `order` (card order), `art` (cover art key: `healthbot`, `placdai`, `carenest`, `datumguard`), `draft` (`true` shows a "Draft" label).

**Body syntax**
- `## Heading` builds the sticky table of contents (`###` is a small subheading that is not listed).
- Normal Markdown: paragraphs, `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, `- ` and `1. ` lists, `> quotes`, `---`.
- Code: a fenced block with a language and optional file name, e.g. ```` ```ts title="src/api.ts" ````.
- Figures: `![alt text](/projects/name/shot.png "Caption")`. Put local images in `public/projects/<name>/`. If an image is missing or fails to load, a clearly marked placeholder is shown instead.
- Diagrams: a ```` ```flow ```` block. One line per row; boxes are separated by `->`; `Title|small text` adds a second line; start a box with `?` to draw it dashed (a gap to fill in); a first line starting with `# ` is the caption.
- Boxes: `:::note Title`, `:::limit Title` (for limitations and safety notes) and `:::placeholder Title`, each closed with `:::`.

Every `:::placeholder` is counted and shown at the top of the page ("N placeholders left to fill in"), so you can see what is still unwritten. Search the files for `[FILL IN` and `[CONFIRM` to find everything.

**CareNest images** are bundled locally in `public/projects/carenest/`, with their Devpost captions retained. The source download includes the images. Screenshots not provided for the other projects retain their marked placeholders.

`contrast-audit.py` checks the colour contrast of every page in light mode (run `vite preview`, then the script).

## Compact galaxy and deeper starfield

The background now uses a smaller cached binary galaxy with two uneven spiral arms, branching clusters, a compact warm bulge, and faint dust lanes. Both palette sprites share the same star distribution, so theme changes crossfade without shifting the galaxy. The sky has more, smaller distant binary stars, with adaptive density and muted brightness behind text. Shooting-star timing and reduced-motion support are preserved.

## Latest local HealthBot revision

The HealthBot case study includes the independently built initial version, later team collaboration, the user-reported incomplete-response problem, architecture verified against the March 2025 source, an Oakville News feature, and locally bundled historical screenshots. One editorial follow-up box identifies the two remaining unknowns: the exact response-cutoff resolution and individual ownership of later team work. The current changes have not been deployed. Optional hero frontmatter fields are `hero`, `heroAlt`, `heroCaption`, `heroWidth`, and `heroHeight`; `:::press` blocks provide a source-linked publication feature.
