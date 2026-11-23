// Every string the about page prints, and the people and figures behind them.
// One file, as the other pages keep theirs, so a buyer rewriting the company
// finds the whole company in one place. Figures the rest of the site already
// prints (12,400 courses, 680K learners, 3,100 teachers, 41 languages, the 70%
// share, the eleven days the checks take) are the same numbers here.

import type { ClosingCopy } from "@/components/marketing/closing";

// Hotlinked, as the catalogue's photographs are: Unsplash for rooms, each
// linked as the studio handed it over, and Lummi for faces. Neither ships
// inside the download.
export const face = (id: string, w: number) =>
  `https://assets.lummi.ai/assets/${id}?w=${w}&fm=jpg&q=80`;

// ---------------------------------------------------------------------------
// §1 Hero

export type Snapshot = { src: string; alt: string; caption: string; place: string };

export const heroCopy = {
  eyebrow: "About Mentora",
  // two beats, one to a line from sm
  title: ["AI drafts the outline.", ["A person ", "grades", " your project."]] as const,
  lede: "Mentora began in 2021 as twelve courses recorded in one room in Lisbon. Sixty-four of us now run 12,400, on the rule we started with.",
  primary: { label: "Meet the team", href: "#team" },
  secondary: { label: "How we use AI", href: "#ai" },
  deal: "Next photo",
  // The front of the deck first. Each card is a week somewhere at Mentora,
  // told by where it was taken and what was on the table.
  // The studio's own six, in the order they were handed over, each linked as
  // given: a photograph supplied by URL keeps the framing it arrived with.
  snapshots: [
    {
      src: "https://images.unsplash.com/photo-1668584086740-d4804b8836c0?q=80&w=1365&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A black metal shelf against a white wall, with potted plants in yellow pots and a stack of paperbacks",
      caption: "The shelf teachers leave books on",
      place: "Lisbon office",
    },
    {
      src: "https://images.unsplash.com/photo-1601656269222-fda862e6dc7d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
      alt: "A pale desk with a monitor, a laptop on a stand, a phone in a dock and a small plant, lit from one side",
      caption: "Where the first player was written",
      place: "Lisbon office",
    },
    {
      src: "https://images.unsplash.com/photo-1724402024508-8f0f7d19a865?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM4fHx8ZW58MHx8fHx8",
      alt: "An editing desk with a monitor and a laptop both showing a video timeline, two speakers and a camera lens",
      caption: "Cutting module 4 of SQL for analysis",
      place: "Lisbon studio",
    },
    {
      src: "https://images.unsplash.com/photo-1563605990484-8d4c1fa9c3d2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg1fHx8ZW58MHx8fHx8",
      alt: "A desk under a pink wall light, with a webcam on a large monitor, a keyboard, earbuds and a phone",
      caption: "A teacher's desk, set up to record",
      place: "At home, Porto",
    },
    {
      src: "https://images.unsplash.com/photo-1542546068979-b6affb46ea8f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExM3x8fGVufDB8fHx8fA%3D%3D",
      alt: "A white desk with a curved monitor showing code beside a colorful wallpaper, a white chair and a floor lamp",
      caption: "Where the tutor's answers get checked",
      place: "Toronto office",
    },
    {
      src: "https://images.unsplash.com/photo-1623276234990-c74be03fd36a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGJvb2tzaGVsZnxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Two thin wooden shelves hung on a white wall, holding a book, two ceramic vases and a sprig of dried flowers",
      caption: "The quiet room between two floors",
      place: "Toronto office",
    },
  ] satisfies Snapshot[],
};

// ---------------------------------------------------------------------------
// §2 Story

export type Year = { year: number; title: string; body: string; figure: string; unit: string };

export const storyCopy = {
  eyebrow: "Since 2021",
  heading: "Six years, and what each one added",
  // Opens on the year the tutor arrived, the one the rest of the page is
  // about, so two years sit on the arc to its right and three to its left.
  opens: 2024,
  years: [
    {
      year: 2021,
      title: "Twelve courses in one rented room",
      body: "Ingrid and Karim recorded the first twelve courses in a rented room in Lisbon, and graded every project themselves.",
      figure: "12",
      unit: "courses",
    },
    {
      year: 2022,
      title: "Every teacher checked by hand",
      body: "No course went live until we had checked the teacher's ID, work history, one reference and a sample lesson.",
      figure: "400",
      unit: "teachers verified",
    },
    {
      year: 2023,
      title: "Transcripts you can click",
      body: "Every lesson got a transcript that jumps the video to the line you press, translated into the languages learners asked for.",
      figure: "41",
      unit: "languages",
    },
    {
      year: 2024,
      title: "A tutor that reads the lesson first",
      body: "We opened the AI tutor on thirty courses. It answers from the lesson on screen and names the minute it used.",
      figure: "30",
      unit: "pilot courses",
    },
    {
      year: 2025,
      title: "The studio opens to every teacher",
      body: "Teachers paste a transcript and get six chapters and a quiz to rewrite. Nothing publishes until they do.",
      figure: "3,100",
      unit: "teachers",
    },
    {
      year: 2026,
      title: "A second office, in Toronto",
      body: "We moved closer to the teachers we work with in the Americas, and passed 680K learners on the way.",
      figure: "12,400",
      unit: "courses",
    },
  ] satisfies Year[],
};

// ---------------------------------------------------------------------------
// §3 AI

export type AiTool = "tutor" | "studio" | "planner";

export type AiPanel = {
  tab: string;
  title: string;
  body: string;
  figures: { value: string; label: string }[];
  chart: {
    title: string;
    /** The series a person makes, then the one the model makes. */
    person: string;
    model: string;
    /** Model first in the legend when the model's bar leads each pair. */
    modelFirst: boolean;
    unit: string;
    rows: { label: string; long: string; person: number; model: number }[];
    /** The pair the tooltip rests on before anybody points at one. */
    rests: number;
  };
};

export const aiCopy = {
  eyebrow: "How we use AI",
  // the phrase in the middle carries the brand's swoosh
  heading: ["Where the model stops and ", "a person", " takes over"] as const,
  lede: "Three tools on Mentora run on a language model. Each one has a line it does not cross, and a person waiting on the other side of it.",
  label: "Three tools that run on a model",
  panels: {
    tutor: {
      tab: "The tutor",
      title: "It answers from the lesson you have open",
      body: "The tutor reads the transcript, the slides and your notes on the lesson in front of you. Ask it for the answer to a graded quiz and it asks you a question back instead.",
      figures: [
        { value: "94%", label: "of answers name the minute" },
        { value: "0", label: "graded answers handed out" },
      ],
      chart: {
        title: "Questions asked last week",
        person: "Asked by learners",
        model: "Answered from the lesson",
        modelFirst: false,
        unit: "questions",
        rows: [
          { label: "Mon", long: "Monday", person: 8200, model: 7710 },
          { label: "Tue", long: "Tuesday", person: 9100, model: 8560 },
          { label: "Wed", long: "Wednesday", person: 8700, model: 8180 },
          { label: "Thu", long: "Thursday", person: 9600, model: 9070 },
          { label: "Fri", long: "Friday", person: 7400, model: 6950 },
          { label: "Sat", long: "Saturday", person: 4100, model: 3850 },
          { label: "Sun", long: "Sunday", person: 5300, model: 4990 },
        ],
        rests: 3,
      },
    },
    studio: {
      tab: "The studio",
      title: "It drafts the outline, and the teacher rewrites it",
      body: "Paste a transcript and the studio returns six chapters, a quiz for each module and a course description. Every drafted line stays marked in the editor until the teacher rewrites it.",
      figures: [
        { value: "71%", label: "of drafted lines rewritten" },
        { value: "0", label: "courses published as drafted" },
      ],
      chart: {
        title: "Words a chapter, one course",
        person: "Kept by the teacher",
        model: "Drafted by the studio",
        modelFirst: true,
        unit: "words",
        rows: [
          { label: "Ch 1", long: "Chapter 1", person: 240, model: 610 },
          { label: "Ch 2", long: "Chapter 2", person: 380, model: 580 },
          { label: "Ch 3", long: "Chapter 3", person: 150, model: 640 },
          { label: "Ch 4", long: "Chapter 4", person: 420, model: 560 },
          { label: "Ch 5", long: "Chapter 5", person: 210, model: 600 },
          { label: "Ch 6", long: "Chapter 6", person: 330, model: 520 },
          { label: "Quiz", long: "The quiz", person: 180, model: 450 },
        ],
        rests: 2,
      },
    },
    planner: {
      tab: "The path planner",
      title: "It orders the courses, and you pick the goal",
      body: "Type a goal and the planner lays out five legs in the order they build on each other. It never picks the job for you, and you can drag any leg into a different place.",
      figures: [
        { value: "38%", label: "of learners move a leg" },
        { value: "5", label: "legs in every path it drafts" },
      ],
      chart: {
        title: "Hours a week, first seven weeks",
        person: "Logged by learners",
        model: "Planned by the planner",
        modelFirst: true,
        unit: "hours",
        rows: [
          { label: "W1", long: "Week 1", person: 5.1, model: 6 },
          { label: "W2", long: "Week 2", person: 5.6, model: 6 },
          { label: "W3", long: "Week 3", person: 4.2, model: 6 },
          { label: "W4", long: "Week 4", person: 6.4, model: 7 },
          { label: "W5", long: "Week 5", person: 6.9, model: 7 },
          { label: "W6", long: "Week 6", person: 5.8, model: 7 },
          { label: "W7", long: "Week 7", person: 7.3, model: 8 },
        ],
        rests: 2,
      },
    },
  } satisfies Record<AiTool, AiPanel>,
};

// ---------------------------------------------------------------------------
// §4 Team

export type Person = {
  slug: string;
  name: string;
  first: string;
  role: string;
  city: "Lisbon" | "Toronto";
  /** A Lummi asset id, from one shoot on a warm backdrop, which keeps the
   *  staff apart from the teachers' grey one. */
  face: string;
  bio: string;
  before: string;
  askAbout: string[];
};

export const teamCopy = {
  eyebrow: "The team",
  heading: "Seven of the sixty‑four people who run it",
  lede: "Most of us taught before we built software. Open a profile to see what each person did before Mentora, and what to ask them about.",
  open: (first: string) => `Open ${first}'s profile`,
  dialog: {
    before: "Before Mentora",
    ask: "Ask about",
    write: (first: string) => `Write to ${first}`,
    share: "Copy profile link",
    copied: "Link copied",
    manual: "Copy the link below",
  },
  hiring: {
    tag: "Hiring",
    title: "Five open roles",
    roles: [
      { title: "Frontend engineer", where: "Lisbon" },
      { title: "Spanish editor", where: "Remote" },
      { title: "ML engineer", where: "Toronto" },
    ],
    cta: { label: "See all five roles", short: "Roles",
      mid: "See roles", href: "/contact?topic=careers" },
  },
  people: [
    {
      slug: "ingrid-solberg",
      name: "Ingrid Solberg",
      first: "Ingrid",
      role: "Co-founder, CEO",
      city: "Lisbon",
      face: "QmReJEXRnzkLhfj7pwo7riaHmFXUu36TKczVXiNd3auhqM",
      bio: "Ingrid recorded the first twelve courses with Karim. She still grades one project a week, to see what learners hand in.",
      before: "Taught statistics at a university in Bergen for nine years.",
      askAbout: ["Pricing", "Teacher payouts", "Why Lisbon"],
    },
    {
      slug: "karim-nassar",
      name: "Karim Nassar",
      first: "Karim",
      role: "Co-founder, CTO",
      city: "Lisbon",
      face: "QmaPxM6jucyTTMhSQMe16a9ZhXZZvLZz5buDgEjBFyPUsB",
      bio: "Karim wrote the first player and the transcript sync. His team keeps a lesson loading in under a second on a phone.",
      before: "Built video pipelines for a streaming service in Berlin.",
      askAbout: ["The player", "Offline lessons", "Hiring engineers"],
    },
    {
      slug: "adaeze-nwosu",
      name: "Adaeze Nwosu",
      first: "Adaeze",
      role: "Head of learning",
      city: "Toronto",
      face: "QmSn3afWFpMbtJvt5KNhXwvokb2h5XKNpmeVznehupgTnT",
      bio: "Adaeze sets how a path is ordered and what counts as finished. Every certificate carries a rubric her team wrote.",
      before: "Designed bootcamp curricula in Lagos and Toronto for six years.",
      askAbout: ["Paths", "Certificates", "Rubrics"],
    },
    {
      slug: "mei-tanaka",
      name: "Mei Tanaka",
      first: "Mei",
      role: "Head of AI",
      city: "Toronto",
      face: "QmbmXgr5iDzJLqu1fHPGnARqxQY11quuWDwXPLiuwbDeY2",
      bio: "Mei's team built the tutor to answer from the lesson and name the minute. She keeps the list of questions it refuses.",
      before: "Research engineer on search and retrieval systems.",
      askAbout: ["The tutor", "The studio", "What the model sees"],
    },
    {
      slug: "freya-lund",
      name: "Freya Lund",
      first: "Freya",
      role: "Head of course review",
      city: "Lisbon",
      face: "QmRDWYpKx9Su12Ze3No3GBkAChKHYQAYa6W1MaEyrPrxPx",
      bio: "Freya's editors watch lesson one of every course before it goes live. About one in five goes back with notes.",
      before: "Cut documentaries for public television in Copenhagen.",
      askAbout: ["Course review", "Audio", "Lesson length"],
    },
    {
      slug: "mateo-ruiz",
      name: "Mateo Ruiz",
      first: "Mateo",
      role: "Head of teacher success",
      city: "Toronto",
      face: "QmRcEHgXfJK24t8J4BBFqtmh1MQ3fQDK1KQhc7V5ZbFj1A",
      bio: "Mateo gets new teachers from a raw transcript to a first course, and answers the questions about payouts.",
      before: "Taught high school chemistry, then ran a science channel.",
      askAbout: ["Applying to teach", "Recording at home", "Payouts"],
    },
    {
      slug: "nikos-petrakis",
      name: "Nikos Petrakis",
      first: "Nikos",
      role: "Head of safety",
      city: "Lisbon",
      face: "QmWeCXx93juWPiQQoCGHLP55qgN3m3fWFzwu7oTv9kRwoF",
      bio: "Nikos runs the four checks on every teacher, and settles each refund dispute over $100 himself.",
      before: "Twelve years in payments fraud at a bank in Athens.",
      askAbout: ["Verification", "Refunds", "Reporting a course"],
    },
  ] satisfies Person[],
};

// ---------------------------------------------------------------------------
// §5 Standards

export type Standard = {
  tag: string;
  title: string;
  body: string;
  checks: string[];
  quote: string;
  /** A `teamCopy.people` slug: the person who holds this check. */
  by: string;
};

export const standardsCopy = {
  eyebrow: "Course standards",
  // the phrase in the middle carries the brand's swoosh
  heading: ["What a course ", "passes", " before you can buy it"] as const,
  lede: "Four checks, run in this order before a course goes on sale. About one course in five goes back to its teacher at the second check.",
  checksLabel: "What we check",
  counter: (n: number, of: number) => `${String(n).padStart(2, "0")} / ${String(of).padStart(2, "0")}`,
  prev: "Previous standard",
  next: "Next standard",
  cta: { label: "Submit a course for review", href: "/teach#apply" },
  photoAlt: "A reading corner against a slate-blue wall: two framed mountain prints, a wooden chair, a small bookcase with a plant and a vase, and a black floor lamp",
  // the studio's pick, linked as given
  photo:
    "https://images.unsplash.com/photo-1640132219022-e7a98b4c92e9?q=80&w=1409&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  standards: [
    {
      tag: "The teacher",
      title: "The teacher is who they say they are",
      body: "We check the teacher's ID, work history, one reference and a ten‑minute sample lesson before the studio drafts a thing. The four checks take about eleven days to finish.",
      checks: ["Government ID", "Work history", "One reference", "Sample lesson"],
      quote: "We phone every reference. A letter anyone could write proves nothing.",
      by: "nikos-petrakis",
    },
    {
      tag: "Lesson one",
      title: "An editor watches lesson one in full",
      body: "An editor checks the sound, the pacing, and whether the lesson keeps the promise in its title. A first lesson that needs work goes back with notes pinned to the minute.",
      checks: ["Audio levels", "Pacing", "Title matches content", "Captions", "Free preview"],
      quote: "If I pause lesson one to work out what they meant, a learner has gone.",
      by: "freya-lund",
    },
    {
      tag: "AI labels",
      title: "Anything the studio drafted says so",
      body: "Chapters, quiz questions and descriptions drafted by the studio carry a label until the teacher rewrites them, so learners can see which lines a person wrote.",
      checks: ["Drafted lines marked", "Quiz answers checked", "Description rewritten"],
      quote: "The label comes off when a person edits the line. Pressing approve leaves it on.",
      by: "mei-tanaka",
    },
    {
      tag: "Grading",
      title: "A person grades every project",
      body: "The tutor can explain a mistake, and it never grades. The teacher, or a reviewer the teacher names, marks every project within five working days and writes back.",
      checks: ["Published rubric", "Named grader", "Five-day turnaround", "Written feedback"],
      quote: "A certificate says a person read your work, so it carries their name.",
      by: "adaeze-nwosu",
    },
  ] satisfies Standard[],
};

// ---------------------------------------------------------------------------
// §6 Policies

export type Policy = "privacy" | "terms";

export type Clause = { title: string; short: string; full: string };

export const policiesCopy = {
  eyebrow: "The fine print",
  heading: "Privacy and terms, written to be read",
  lede: "Each clause opens with the short version, and the full text sits beside it.",
  updated: "Updated March 18, 2026",
  label: "Which policy to read",
  short: "In short",
  print: "Print",
  copy: "Copy link",
  copied: "Link copied",
  manual: "Copy the link below",
  tabs: { privacy: "Privacy", terms: "Terms" } satisfies Record<Policy, string>,
  clauses: {
    privacy: [
      {
        title: "What we keep",
        short: "Your account, what you watch, and your notes.",
        full: "We store your email, the lessons you open and how far you get, your notes, your quiz answers and your receipts. Card numbers stay with our payment processor, and we never see them.",
      },
      {
        title: "What the tutor sees",
        short: "The lesson on screen and your question.",
        full: "A question to the tutor sends it the open lesson's transcript, your notes on that lesson and the question. It never sees your other courses or payments, and we delete its conversations after 90 days.",
      },
      {
        title: "What teachers see",
        short: "Your first name, your progress and your projects.",
        full: "A teacher sees your first name, how far you are in their course, your quiz scores and the projects you submit to them. Your email stays hidden from a teacher until you write to them first.",
      },
      {
        title: "What we never sell",
        short: "Your data, to anyone, for any price.",
        full: "We do not sell or rent personal data, and we do not train models on your notes or your projects. Totals, such as how many learners finish a path, appear on this site with nobody in them named.",
      },
      {
        title: "Deleting your account",
        short: "One button in Settings, and 30 days.",
        full: "Delete your account in Settings and we erase everything tied to it within 30 days, apart from receipts, which tax law makes us keep for seven years. Certificates you downloaded stay yours.",
      },
    ],
    terms: [
      {
        title: "Buying a course",
        short: "Yours for good, updates included.",
        full: "A course you buy stays in your library for good, with every update its teacher makes. If a teacher takes a course down, you keep the version you bought, with its certificate and every file that came with it.",
      },
      {
        title: "Refunds",
        short: "Within 30 days, in full, with no questions.",
        full: "Ask within 30 days of buying and we refund the whole price, however much you watched. After 30 days we decide case by case, and Nikos's team answers every request within two working days.",
      },
      {
        title: "Plus",
        short: "Cancel any day, and it runs to the end.",
        full: "Plus renews each month or year until you cancel it. Cancel in one step from Settings and Plus stays open until the period you paid for ends. Courses you finished keep their certificates for good.",
      },
      {
        title: "Teaching",
        short: "You own your course, and you keep 70%.",
        full: "You keep the rights to everything you record and write. We keep 30% of a single-course sale, and share Plus revenue by minutes watched. Either side can end the agreement with 60 days' notice.",
      },
      {
        title: "Conduct",
        short: "Honest projects, and kind reviews.",
        full: "Handing in someone else's work, sharing a paid course or harassing anyone on Mentora closes an account. We tell you why in writing, and you can appeal the decision within 14 days of hearing it.",
      },
    ],
  } satisfies Record<Policy, Clause[]>,
};

// ---------------------------------------------------------------------------
// §7 Closing

export const aboutClosing: ClosingCopy = {
  heading: "Watch lesson one, or send us yours",
  lede: "Every course opens its first lesson without a card. Teachers can paste a transcript into the studio and read a draft before they apply.",
  learn: { label: "Browse courses", href: "/courses" },
  teach: { label: "Teach on Mentora", href: "/teach" },
  risk: "Free first lesson on every course. No card.",
};
