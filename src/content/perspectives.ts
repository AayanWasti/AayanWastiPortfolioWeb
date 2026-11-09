// Perspectives: a personal notebook of how I think.
//
// HOW TO EDIT
//  - Add a perspective: copy one object below, give it a new unique `id`, and edit the text.
//    The `id` becomes the link: #perspectives/<id>
//  - Remove one: delete its object. Reorder: move the object (the list shows in this order).
//  - `body` is a list of paragraphs, one string each. Start a string with '## ' to make a subheading.
//  - `date` is YYYY-MM-DD. The list is grouped by year and shown newest first.
//  - Each perspective opens as its own page when clicked, so it can be as long as you like.
//  - `question` is optional. Delete the line if you don't want one.
//  - Set `showSampleNotice` to false once the writing is really yours.

export type Perspective = {
  id: string
  date: string // YYYY-MM-DD, used for the year grouping and the date on the right
  image?: string // optional thumbnail, e.g. '/perspectives/building.jpg' placed in /public
  title: string
  body: string[]
  question?: string
}

export const perspectivesPage = {
  title: 'Perspectives',
  description: 'A running notebook of how I think about technology, building and curiosity. Drafts, not conclusions.',
  showSampleNotice: true,
  sampleNotice: 'Sample writing and sample dates. These are placeholder drafts for me to rewrite, not my confirmed views.',
}

export const perspectives: Perspective[] = [
  {
    id: 'on-building-things',
    date: '2026-10-30',
    title: 'On building things',
    body: [
      'There is a kind of understanding you only get once something you made is in front of another person. A sketch, a prototype, even a demo that half works, will answer questions an idea never can, mostly because an idea is always kinder to itself than reality is.',
      'I think that is why building appeals to me. It turns opinions into evidence. I also suspect I like the in-between stage more than I admit, when something is rough but real enough to argue with.',
    ],
    question: 'How rough is too rough to show someone?',
  },
  {
    id: 'on-curiosity',
    date: '2026-09-22',
    title: 'On curiosity',
    body: [
      'Computer science is what I’m studying, but it is rarely the only thing I’m looking at. Space keeps pulling my attention outward, partly because the scale is absurd, and partly because it asks the same questions software does, about patterns and limits, just from further away.',
      'Architecture does something close to the opposite. It is about how a place makes you feel before you have worked out why. I like the habit of noticing first and explaining later, and I’d like to carry it into everything else I make.',
    ],
    question: 'What am I not looking at yet?',
  },
  {
    id: 'on-artificial-intelligence',
    date: '2026-08-15',
    title: 'On artificial intelligence',
    body: [
      'AI has changed how fast software can be written, and I’m not sure we have worked out what that does to how well it is understood. Writing code and understanding code used to be tangled together. Now they can come apart, which I find exciting and a little uncomfortable at the same time.',
      'My current guess is that taste matters more as typing matters less: knowing what to ask for, and noticing when an answer is subtly wrong. I’d be happy to find out I’m mistaken.',
    ],
    question: 'If the code is cheap, what is the scarce part?',
  },
  {
    id: 'on-ambition',
    date: '2026-07-04',
    title: 'On ambition',
    body: [
      'I want to get properly good at things, and I also want to be careful about what I’m measuring. It is easy to let a list of achievements become the definition of progress, because a list is easy to read and easy to compare. Learning is slower and mostly invisible.',
      'For now, a good year looks like understanding something I couldn’t have explained twelve months earlier. Ask me again later. I expect this answer to change.',
    ],
    question: 'How do I tell ambition apart from restlessness?',
  },
]
