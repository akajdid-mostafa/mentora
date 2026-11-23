// Every word on /teach that is not a figure worked out in earnings.ts: the
// hero, the five numbers, the calculator's labels, the three steps, the four
// instructors, the application form, the questions and the closing band. The
// FAQ rows and the closing band are the home page's own components holding
// this page's words.
//
// Mock data, written for the demo. A buyer changes a sentence here and every
// place that prints it follows.

import type { ClosingCopy } from "@/components/marketing/closing";
import type { Faq } from "@/components/marketing/faqs";
import { PAYDAY, PAYOUT_FLOOR, SHARE } from "@/components/teach/earnings";

const pct = `${Math.round(SHARE * 100)}%`;
const cut = `${Math.round((1 - SHARE) * 100)}%`;
const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;
export const payday = ordinal(PAYDAY);
// Learners on the platform, as the numbers band prints it and the third step
// quotes it.
const learners = "680K";

export const heroCopy = {
  eyebrow: "Teach on Mentora",
  // The second line's promise is the phrase the marker swipes through.
  heading: { lead: "Teach the job you do.", keep: "Keep", marked: `${pct} of sales`, stop: "." },
  lede: `Pass four checks and your name carries a badge in about 11 days. The studio turns one line into six chapters, and payouts land on the ${payday}.`,
  apply: { label: "Apply to teach", href: "#apply" },
  earnings: { label: "Work out your earnings", href: "#earnings" },
  alt: "A spiral staircase climbing into a pink cloud over a hill of blue grass and red flowers, white clouds banked on either side under a clear sky",
  // The studio's card, over the photograph's upper left: a course drafted
  // from one line, and how much of it the instructor has rewritten.
  // `yours` is how many of a chapter's lesson titles are in their words now;
  // the rest still read as the studio drafted them.
  draft: {
    label: "Studio draft",
    took: ["Drafted in", "4\u00a0min"] as const,
    title: "Modern CSS layout for designers",
    chapters: [
      { title: "Markup that means something", lessons: 4, yours: 4 },
      { title: "The box model and the flow", lessons: 5, yours: 5 },
      { title: "Flexbox and grid", lessons: 4, yours: 4 },
      { title: "Type and space that scale", lessons: 3, yours: 2 },
      { title: "Components you can reuse", lessons: 4, yours: 2 },
      { title: "A landing page, shipped", lessons: 4, yours: 1 },
    ],
    meta: (chapters: number, lessons: number) => `${chapters} chapters · ${lessons} lessons`,
    yours: "In your words",
    drafted: "As drafted",
    empty: "No lesson",
    // Read out in place of the grid of lessons, which is drawn for the eye.
    read: (yours: number, lessons: number) =>
      `${yours} of the ${lessons} lesson titles are in your words; ${lessons - yours} still read as the studio drafted them.`,
  },
  payout: {
    // "{month} payout", the month the money was earned in
    label: "payout",
    lands: "Lands",
    today: "Lands today",
    left: (n: number) => `${n} ${n === 1 ? "day" : "days"} to go`,
    made: (sales: number, minutes: string) =>
      `Your ${pct} of ${sales}\u00a0course\u00a0sales, and ${minutes}\u00a0Plus\u00a0minutes.`,
    more: { label: "See the split", href: "#split" },
  },
};

export const numbersCopy = {
  eyebrow: "Who teaches here",
  heading: "Every instructor here holds the job they teach",
  lede: "We confirm the job with the employer before a first course opens, so a learner can see who they are paying. Your name goes through the same four checks, and it carries the same badge once it passes.",
  ghost: "Verified instructors",
  meet: { label: "Meet the instructors", href: "/instructors" },
  how: { label: "How applying works", href: "#how" },
  // Four of the five numbers; the fifth is the instructors behind the faces.
  // The captions are fitted to two lines at 15rem, the width they keep at
  // every size.
  cards: [
    {
      figure: learners,
      label: "Learners on Mentora",
      body: "We pay for every minute a Plus learner spends in your lessons.",
      pills: ["41 languages", "96K on Plus"],
    },
    {
      figure: "$38.6M",
      label: "Instructor payouts, 2025",
      body: `We send them on the ${payday} of each month, by bank or PayPal.`,
      pills: ["+42% on 2024", "38 currencies"],
    },
    {
      figure: "$9,800",
      label: "Median first year",
      body: "What one course earned in its first twelve months.",
      pills: ["2024 cohort", "Top 10%: $41K"],
    },
    {
      figure: "11 days",
      label: "From application to badge",
      body: "The median for all four checks. One applicant in five passes.",
      pills: ["ID and job", "Work and lesson"],
    },
  ],
};

export const earningsCopy = {
  eyebrow: "Earnings",
  heading: "Work out what a course pays",
  lede: `Pick a price, then set your sales and Plus minutes a month. The ${pct} share is written into the contract you sign.`,
  copy: "Copy link to this estimate",
  copied: "Link copied",
  manual: "Your browser kept the clipboard closed. Copy the link from here:",
  sale: {
    title: "One sale",
    caption: "At the price you set",
    keep: (share: string, price: string) => `You keep ${share} of a ${price} sale`,
    said: (price: string, yours: string, ours: string) =>
      `For a sale at ${price}, you keep ${yours} and Mentora keeps ${ours}.`,
    price: "Course price",
    oursLabel: `Mentora's ${cut}`,
    list: "Listing fee",
    why: `What the ${cut} pays for`,
  },
  month: {
    title: "Your month",
    caption: "Before refunds, which ran at 2.1% last year",
    sales: "Course sales a month",
    salesSaid: (n: number) => `${n} course sales a month`,
    minutes: "Plus minutes watched",
    minutesSaid: (n: string) => `${n} minutes a month`,
    salesUnit: "sales",
    minutesUnit: "min",
    plus: "from Plus",
    rate: (rate: string) => `At ${rate} a minute, last month's rate.`,
  },
  result: {
    title: "You'd keep",
    caption: "Sales and Plus together, before tax",
    unit: "a month",
    year: "a year at this pace",
    sales: "Course sales",
    plus: "Plus minutes",
    studio: { label: "Open the studio", href: "/studio" },
    apply: { label: "Apply to teach", href: "#apply" },
  },
};

export const stepsCopy = {
  eyebrow: "How it works",
  heading: "Three steps to a first payout",
  lede: "Most instructors draft in the studio while the checks run, so the course is ready the week the badge lands.",
  steps: [
    {
      title: "Apply with your work",
      line: "Four checks confirm who you are and the job you hold.",
      figure: "11 days",
      caption: "median from application to badge",
      link: { label: "Apply to teach", href: "#apply" },
      photo: "1674505921901-e54fe119f0a4",
      alt: "A wooden desk with a wide monitor on a riser, a microphone on a stand, headphones on a hook and a keyboard, a mesh chair and a palm in a pot beside it",
    },
    {
      title: "Draft in the studio",
      line: "One line becomes six chapters. You record every lesson.",
      figure: "4 min",
      caption: "from one line to a syllabus",
      link: { label: "Open the studio", href: "/studio" },
      photo: "1764664035176-8e92ff4f128e",
      alt: "A camera on a small tripod, a microphone and a tablet set up on a desk in front of a wall of instant photographs",
    },
    {
      title: "Publish and get paid",
      line: `It opens to ${learners} learners. Payouts land on the ${payday}.`,
      figure: payday,
      caption: "of each month, for the month before",
      link: { label: "Work out your earnings", href: "#earnings" },
      photo: "1742827871480-4962b0653e1d",
      // The person at the screen stands right of centre; a narrow frame
      // would otherwise keep only the wall.
      focus: "72% 50%",
      alt: "Someone in headphones working at a large monitor in a sunlit studio, a pegboard of scissors and sketches on the wall and a yellow cabinet by the window",
    },
  ],
};

// The five at the foot of the page, found by name in the catalog so their
// faces, trades and courses are the ones every other page prints. `course` is
// the course id the story is about.
export const storiesCopy = {
  eyebrow: "Instructors",
  heading: "All five kept the day job",
  lede: "They record after work and teach what they do all week, from payments engineering to type design.",
  prev: "Previous instructor",
  next: "Next instructor",
  teaches: "Teaches",
  stories: [
    {
      name: "Tomás Oliveira",
      figure: "$184,300",
      caption: "paid out in his first twelve months",
      quote: "I built the course from the questions I kept answering in code review. Now the tutor answers them at 2am, from my transcript, while I sleep.",
      course: "c4",
    },
    {
      name: "Noor Aziz",
      figure: "4 min",
      caption: "from one line to her first syllabus",
      quote: "The studio gave me six chapters in the order a type class runs. I folded them into four and recorded thirteen lessons over two weekends.",
      course: "c18",
    },
    {
      name: "Ibrahim Salah",
      figure: "203 of 212",
      caption: "questions the tutor answered in September",
      quote: "In September I read the nine it couldn't answer. Two of them turned into a new lesson on sampling, which is now the most replayed in the course.",
      course: "c2",
    },
    {
      name: "Lucía Ferrer",
      figure: "12,600",
      caption: "learners on a course she taught in Spanish",
      quote: "I taught it in Spanish because that is how my team talks about data. Learners in Lisbon and São Paulo found it through the Portuguese captions.",
      course: "c29",
    },
    {
      name: "Claire Dubois",
      figure: "11 evenings",
      caption: "to record a course in French",
      quote: "I recorded after the children were asleep. Before the kettle had boiled, the studio had cut the transcript into chapters.",
      course: "c31",
    },
  ],
};

export const applyCopy = {
  eyebrow: "Apply",
  heading: "Tell us the job you do",
  lede: "Your identity check is booked for the next working day, on a short video call.",
  // Short enough to sit on one line each under a phone's three segments.
  steps: ["You", "Work", "Course"] as const,
  fields: {
    name: "Full name",
    email: "Email",
    country: "Where you work from",
    slot: "Best time for the identity call",
    role: "Current role",
    company: "Company",
    years: "Years in the field",
    work: "Link to your work",
    field: "Field",
    title: "Working title",
    who: "Who it's for",
    consent: "I'll record every lesson myself and use the studio for structure.",
  },
  hints: {
    work: "Two peers in your field review it: a case study, a repo or a paper.",
    who: "One sentence. The studio drafts the outline from it.",
  },
  // Set on the label's line, beside the label they answer, so a field in
  // error grows no line and nothing under it moves; the red ring round the
  // field says the rest.
  errors: {
    name: "As it reads on your ID",
    email: "Like name@studio.com",
    role: "The role you hold now",
    company: "Or Self-employed",
    work: "Start with https://",
    title: "At least 8 characters",
    who: "At least 20 characters",
    consent: "Tick this to send the application",
  },
  back: "Back",
  next: "Continue",
  send: "Send application",
  sending: "Sending",
  preview: {
    // The hand beside the card, naming it the way somebody pointing would.
    note: ["Your card,", "as the directory draws it"] as const,
    draft: "Draft",
    checksLabel: "Checks",
    checks: "0 of 4",
    call: "Identity call",
    learnersLabel: "Learners",
    caption: "Every instructor starts as this card with an empty badge. The four checks fill it, and learners see it once your first course opens.",
  },
  done: {
    eyebrow: "Application sent",
    heading: (first: string) => `${first}, your first check is booked`,
    // What the list under it leaves out: where the call's link goes, and the
    // one thing to make before the last check.
    lede: (due: string) =>
      `The call link is on its way to your inbox. Record your sample lesson in the studio before ${due}.`,
    checks: [
      "Identity document on a video call",
      "Job confirmed with your employer",
      "Two people in your field review your work",
      // a non-breaking hyphen, so "ten-minute" never splits across lines
      "Twenty learners rate your ten\u2011minute sample lesson",
    ],
    job: (company: string) => `Job confirmed with ${company}`,
    selfEmployed: "Job confirmed from your company filings",
    // The identity call's day with the part of it the applicant picked.
    call: (date: string, slot: string) => `${date}, ${slot.toLowerCase()}`,
    badge: "Badge by",
    badgeTail: "if all four pass",
    studio: { label: "Open the studio", href: "/studio" },
    again: "Start over",
  },
};

// The resting answers, so Continue and Send work from the first click and a
// visitor walks the whole form to its success screen. Emptying a field is how
// the error states show.
export const applicant = {
  name: "Mina Park",
  email: "mina@parkstudio.design",
  country: "United States",
  slot: "Morning",
  role: "Senior product designer",
  company: "Tessellate Health",
  years: "5 to 9",
  work: "https://parkstudio.design/wayfinding",
  field: "Design",
  title: "Wayfinding for product designers",
  who: "Designers who inherit a navigation nobody can find anything in, and have to fix it without a redesign.",
  consent: true,
};

export const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Mexico",
  "India",
  "South Korea",
  "Japan",
  "Somewhere else",
];

export const years = ["2 to 4", "5 to 9", "10 or more"] as const;

export const slots = ["Morning", "Afternoon", "Evening"] as const;

export const teachFaqCopy = {
  eyebrow: "Questions",
  heading: "What instructors ask before they apply",
  foot: "Anything this list leaves out, a person on the instructor team answers within a working day.",
  footLink: "Write to them",
};

export const teachFaqs: Faq[] = [
  {
    group: "Money",
    q: `What does the ${cut} pay for?`,
    a: `Card fees and currency conversion, video hosting, captions in 41\u00a0languages and the tutor's answers to your learners. The rest pays for the catalog that puts your course in front of ${learners}\u00a0learners.`,
  },
  {
    group: "Money",
    q: "When and how am I paid?",
    a: `On the ${payday}, for the month before, by bank transfer in 38\u00a0currencies or by PayPal. The statement lists every sale, refund and Plus minute, course by course. A balance under $${PAYOUT_FLOOR} rolls into the next month.`,
  },
  {
    group: "Your course",
    q: "Who owns the course?",
    a: "You do. Mentora holds a license to sell and stream it while it is listed, and you can unpublish it with 30\u00a0days' notice. Learners who bought it before then keep their access for as long as they have an account.",
  },
  {
    group: "Your course",
    q: "Can I sell it elsewhere?",
    a: "Yes. Mentora asks for no exclusivity, sets no price floor and takes nothing from sales you make elsewhere, on your own site or anyone else's. The one rule is that a Mentora coupon cannot be resold.",
  },
  {
    group: "The studio",
    q: "Will learners see that the studio drafted my outline?",
    a: "You record every lesson, so the video carries no label. Studio text you left as it was, a quiz question or a chapter summary, carries an AI drafted badge until you edit it. 41\u00a0lessons carry one today.",
  },
  {
    group: "The checks",
    q: "What happens if I fail a check?",
    a: "You hear which check and why within two working days, and you can apply again after 90\u00a0days. Most people who come back failed the sample lesson the first time and recorded it again.",
  },
];

export const teachClosing: ClosingCopy = {
  heading: "Your first course can open in five weeks",
  lede: "The badge stays yours after that, and every later course opens the day you publish it.",
  learn: { label: "Apply to teach", href: "#apply" },
  teach: { label: "Open the studio", href: "/studio" },
  risk: "No fee to apply, to list a course or to leave.",
};
