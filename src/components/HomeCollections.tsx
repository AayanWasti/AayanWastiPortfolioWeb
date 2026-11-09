

function CollectionPreview({ kind }: { kind: 'drawing' | 'notes' | 'exploring' | 'built' }) {
  if (kind === 'drawing') return <div className="collection-preview preview-drawing" aria-hidden="true">
    <span className="preview-small">loose thoughts / unfinished pages</span>
    <div className="drawing-notebook">
      <span className="drawing-question">what if…</span>
      <span className="drawing-pencil-line" />
      <span className="drawing-annotation">an idea, still taking shape</span>
      <svg viewBox="0 0 160 75" fill="none"><path d="M7 39c22-25 39-24 61-7s34 23 52 6M111 34l11 4-8 7M24 58c15-3 37-2 54-1" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" /><circle cx="143" cy="26" r="17" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 4" /></svg>
    </div>
    <span className="preview-foot">ideas · questions · possibilities</span>
  </div>
  if (kind === 'notes') return <div className="collection-preview preview-notes" aria-hidden="true">
    <span className="preview-small">the working notebook</span>
    <div className="notebook-lines"><span><i>01</i> a question</span><span><i>02</i> a few attempts</span><span><i>03</i> something learned<span className="note-cursor">_</span></span></div>
    <span className="preview-foot">understanding, one page at a time</span>
  </div>
  if (kind === 'exploring') return <div className="collection-preview preview-exploring" aria-hidden="true">
    <span className="preview-small">following a few threads</span>
    <svg viewBox="0 0 340 210" fill="none"><path d="m46 151 81-74 84 41 78-60M127 77l31 93 53-52 56 57" stroke="currentColor" strokeWidth=".7" /><circle cx="127" cy="77" r="3" fill="currentColor" /><circle cx="211" cy="118" r="3" fill="currentColor" /><circle cx="46" cy="151" r="2" fill="currentColor" /><circle cx="289" cy="58" r="2" fill="currentColor" /><circle cx="158" cy="170" r="2" fill="currentColor" /><circle cx="267" cy="175" r="2" fill="currentColor" /><text x="106" y="61">AI</text><text x="181" y="103">images</text><text x="167" y="191">recommendations</text></svg>
  </div>
  return <div className="collection-preview preview-built" aria-hidden="true">
    <span className="preview-small">from an idea to something real</span>
    <div className="built-spines"><span><small>01</small>PlacdAI<span>2026</span></span><span><small>02</small>HealthBot<span>2024–25</span></span></div>
    <span className="preview-foot">selected software projects</span>
  </div>
}

export default function HomeCollections() {
  return <>
    <section className="home-collections grid grid-cols-1 sm:grid-cols-2" aria-label="A few corners of my world">
      <article className="collection-entry">
        <CollectionPreview kind="drawing" />
        <h2>The Drawing Board</h2>
        <p>A collection of ideas, interesting problems, and things I might build someday.</p>
        <a className="collection-action" href="#drawing-board" target="_blank" rel="noopener noreferrer">Explore ideas <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
      <article className="collection-entry">
        <CollectionPreview kind="notes" />
        <h2>Engineering Notes</h2>
        <p>Technical rabbit holes, things that broke, and the parts that finally clicked.</p>
        <a className="collection-action" href="#engineering-notes" target="_blank" rel="noopener noreferrer">Inside the notebook <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
      <article className="collection-entry">
        <CollectionPreview kind="exploring" />
        <h2>Currently Exploring</h2>
        <p>A few threads to follow, starting with the ideas behind what I’m building.</p>
        <a className="collection-action" href="#currently-exploring" target="_blank" rel="noopener noreferrer">Follow the threads <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
      <article className="collection-entry">
        <a className="collection-project-link" href="#projects" target="_blank" rel="noopener noreferrer"><CollectionPreview kind="built" /><h2>Things I’ve Built <span aria-hidden="true">↗</span></h2></a>
        <p>Software I’ve taken from an idea to a working product, including PlacdAI and HealthBot.</p>
        <a className="collection-action" href="#projects" target="_blank" rel="noopener noreferrer">Browse the projects <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
      </article>
    </section>
    <section className="on-my-desk" aria-labelledby="desk-title">
      <h2 id="desk-title">On my desk</h2>
      <dl>
        <div><dt>Building</dt><dd><a href="#projects/placdai">PlacdAI <span aria-hidden="true">↗</span></a><span>AI interior design & product recommendations.</span></dd></div>
        <div><dt>Learning</dt><dd><span className="desk-placeholder">Reading list not added yet.</span></dd></div>
        <div><dt>Thinking about</dt><dd><span className="desk-placeholder">Ideas not added yet.</span></dd></div>
      </dl>
    </section>
  </>
}
