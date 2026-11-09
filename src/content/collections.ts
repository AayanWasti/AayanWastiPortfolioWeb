// All entries below are editable sample content, not claims about Aayan's work.
// Replace an entry with real content and change its `label` when ready.
export type CollectionEntry = {
  slug: string
  date?: string
  image?: string // optional thumbnail, e.g. '/notes/my-note.jpg' placed in /public
  title: string
  category: string
  label: string
  description: string
  sections: { heading: string; text: string }[]
  code?: string
}
export type Collection = {
  title: string
  description: string
  notice: string
  entries: CollectionEntry[]
}
export const collections: Record<string, Collection> = {
  'drawing-board': {
    title: 'The Drawing Board',
    description: 'A collection of ideas, interesting problems, and things I might build someday.',
    notice: 'Sample ideas only. These are editable prompts, not projects I have built or committed to building.',
    entries: [
      { slug: 'paper-trails', date: '2025-08-21', title: 'A reading assistant that shows its work', category: 'AI · research', label: 'Sample idea · not built',
        description: 'A way to ask questions across a small reading collection without losing the original sources.',
        sections: [
          { heading: 'The interesting problem', text: 'A fluent answer is not necessarily a reliable one. Could every answer point to the exact passages that support it, and admit when the collection has no answer?' },
          { heading: 'A small starting point', text: 'Try a local folder of five papers, passage-level search, and a side-by-side source view. Start with retrieval before adding generated summaries.' },
          { heading: 'Open question', text: 'How should conflicting sources and uncertainty appear without making reading harder?' },
        ] },
      { slug: 'campus-repair', date: '2026-08-03', title: 'A smaller repair loop for campus problems', category: 'Software · startup', label: 'Sample idea · not built',
        description: 'A lightweight way for students to report small campus issues and see what happens next.',
        sections: [
          { heading: 'The interesting problem', text: 'Reports often disappear into a form. A useful tool would need a clear owner, privacy boundaries, and an honest progress history.' },
          { heading: 'A small starting point', text: 'Prototype one category of issue with a simple report, triage queue, and status updates. Validate the workflow with potential users before building more.' },
          { heading: 'Open question', text: 'Who would maintain the system, and would it improve an existing process enough to be adopted?' },
        ] },
      { slug: 'api-workbench', date: '2025-10-02', title: 'An API workbench for awkward failures', category: 'Developer tools', label: 'Sample idea · not built',
        description: 'A sandbox for seeing how an interface behaves when requests are slow, duplicated, or arrive out of order.',
        sections: [
          { heading: 'The interesting problem', text: 'Happy-path demos rarely show stale responses or partial failures. Those cases are easier to understand when they can be reproduced deliberately.' },
          { heading: 'A small starting point', text: 'Make a local mock endpoint with adjustable latency and failure responses. Keep the first experiment to one search interface.' },
          { heading: 'Open question', text: 'Could a shared, reproducible failure scenario make debugging with a teammate less frustrating?' },
        ] },
    ],
  },
  'engineering-notes': {
    title: 'Engineering Notes',
    description: 'Programming, debugging, and the small lessons that make software easier to reason about.',
    notice: 'Sample technical notes. The scenarios below illustrate the format; they are not accounts of my own published work or experience.',
    entries: [
      { slug: 'stale-responses', date: '2026-09-12', title: 'When the older request finishes last', category: 'Debugging · async code', label: 'Sample note · replace with a real experience',
        description: 'An example of a search interface that sometimes shows results for the previous query.',
        sections: [
          { heading: 'Example problem', text: 'Typing two queries quickly can launch overlapping requests. If the older one finishes last, it can overwrite the newer result.' },
          { heading: 'An approach', text: 'Give each request an identity and only apply results from the latest request. Cancel superseded work where supported, and handle aborts separately from actual failures.' },
          { heading: 'Takeaway', text: 'Completion order is not intent order. Reproduce the race with controlled latency, rather than relying on a fast local connection.' },
        ] },
      { slug: 'small-reproductions', date: '2026-06-18', title: 'Make the bug smaller before making it disappear', category: 'Programming · debugging', label: 'Sample note · replace with a real experience',
        description: 'A repeatable approach to a bug that seems tied to an entire application.',
        sections: [
          { heading: 'Example problem', text: 'A component behaves differently after a sequence of navigation and input events. Logs show symptoms but do not identify the first incorrect state.' },
          { heading: 'An approach', text: 'Write down expected and actual behavior, preserve a failing input, then remove unrelated dependencies one at a time. Add a focused regression check once the failure is understood.' },
          { heading: 'Takeaway', text: 'A small reproduction is both a debugging tool and a clearer explanation for the next person investigating the issue.' },
        ] },
      { slug: 'measure-before-indexing', date: '2025-12-14', title: 'Measure the query before adding an index', category: 'Databases · lessons learned', label: 'Sample note · replace with a real experience',
        description: 'An example investigation into a slow list endpoint, without guessing at the bottleneck.',
        sections: [
          { heading: 'Example problem', text: 'An endpoint feels slow as the dataset grows. It is tempting to add indexes before checking whether the delay comes from the query, network, or application code.' },
          { heading: 'An approach', text: 'Measure request stages, inspect the query plan with representative data, and check filter and sort patterns. Compare the plan before and after a proposed index.' },
          { heading: 'Takeaway', text: 'Indexes can speed reads but add storage and write costs. Keep the change tied to a measured query pattern rather than a general rule.' },
        ] },
    ],
  },
  'currently-exploring': {
    title: 'Currently Exploring',
    description: 'A few threads in computing and beyond. Questions first, expertise later.',
    notice: 'Sample exploration entries. These suggested topics and next steps are placeholders for my own reading and learning notes.',
    entries: [
      { slug: 'ai-agents', date: '2026-10-24', title: 'AI agents and useful boundaries', category: 'Artificial intelligence', label: 'Sample exploration',
        description: 'Understanding what changes when a model can use tools and keep working across several steps.',
        sections: [{ heading: 'A question to follow', text: 'How can an agent make its actions inspectable and recover when a tool fails?' }, { heading: 'Possible next step', text: 'Compare a plain workflow with a tool-using agent on one small, repeatable task. Track failures and human intervention, not just successful outputs.' }] },
      { slug: 'open-source', date: '2025-06-30', title: 'Finding a way into open source', category: 'People · code', label: 'Sample exploration',
        description: 'Learning how unfamiliar codebases and their communities fit together.',
        sections: [{ heading: 'A question to follow', text: 'What makes a first contribution helpful to maintainers rather than simply easy to submit?' }, { heading: 'Possible next step', text: 'Run a small project locally, read its contribution guide, and reproduce a documented issue before proposing a change.' }] },
      { slug: 'software-engineering', date: '2025-03-11', title: 'Software that stays understandable', category: 'Software engineering', label: 'Sample exploration',
        description: 'Interfaces, testing, and the trade-offs behind systems that other people can maintain.',
        sections: [{ heading: 'A question to follow', text: 'Where does a useful abstraction become an extra layer that hides the behavior someone needs to debug?' }, { heading: 'Possible next step', text: 'Compare two implementations of a small feature and write down what each makes easier to change, inspect, and test.' }] },
      { slug: 'astronomy', date: '2026-04-09', title: 'Reading the observable universe', category: 'Astronomy', label: 'Sample exploration',
        description: 'Light, distance, and how observations become a picture of galaxies far beyond our own.',
        sections: [{ heading: 'A question to follow', text: 'How do astronomers infer a galaxy’s distance and structure from the light that reaches a telescope?' }, { heading: 'Possible next step', text: 'Start with the difference between light-travel time and present-day distance, then explore a public sky survey and how its images are assembled.' }] },
    ],
  },
}
