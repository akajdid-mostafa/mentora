// Every string the studio page shows, in one place a buyer can find. Figures
// arrive as arguments and are set whole: a no-break space holds a number to
// its unit, so "22 lessons" never splits across a line.

import { heroCopy } from "@/components/teach/copy";

const nb = (n: number | string, unit: string) => `${n} ${unit}`;
const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many);

export const studioMeta = {
  title: "Course studio",
  description:
    "Draft six chapters from one line, cut a recording into lessons, pull a quiz from its transcript and follow the month's payout.",
};

export const overviewCopy = {
  eyebrow: "Course studio",
  title: (first: string) => `Welcome back, ${first}`,
  // Two sentences, each on its own line from sm: the draft with the most
  // left to rewrite, then the next payout.
  drafted: (title: string, n: number) =>
    n === 0
      ? `Every lesson of ${title} is in your words.`
      : `${title} still has ${nb(n, plural(n, "lesson"))} as the studio drafted ${n === 1 ? "it" : "them"}.`,
  payout: (month: string, amount: string, date: string, open: boolean) =>
    open
      ? `Your ${month} payout stands at ${amount} and lands on ${date}.`
      : `Your ${month} payout of ${amount} lands on ${date}.`,
  draft: { label: "Draft a new course", href: "#outline" },
  profile: "View public profile",

  window: {
    label: "Studio",
    // The sidebar's tabs: each switches what the window shows, and each
    // view has its one way down to the step that does the work.
    tabs: {
      overview: "Overview",
      outline: "Outline",
      recordings: "Recordings",
      quizzes: "Quizzes",
      revenue: "Revenue",
    },
    // A count on a tab is what waits there for the instructor.
    waiting: (n: number) => `${n} waiting`,
    profile: "View public profile",
  },

  outlineTab: {
    meta: (chapters: number, lessons: number) =>
      `${nb(chapters, plural(chapters, "chapter"))} · ${nb(lessons, plural(lessons, "lesson"))}`,
    yours: "In your words",
    yoursValue: (yours: number, lessons: number) => `${yours} of ${lessons}`,
    yoursNote: "in the open draft",
    drafted: "Still as drafted",
    draftedNote: (n: number) => (n === 0 ? "Every lesson is yours" : `${n === 1 ? "Gets" : "Each gets"} an AI badge`),
    length: "Running time",
    lengthNote: (level: string) => `${level} level`,
    chapters: "Chapters",
    chapter: (n: number, title: string, yours: number, lessons: number) =>
      `Chapter ${n}, ${title}: ${yours} of ${lessons} in your words`,
    board: "Open the board",
    drafts: "Drafts",
    pick: "Open draft",
  },

  recordingsTab: {
    meta: "Last 30 days",
    recorded: "Recorded",
    recordedNote: (n: number) => `in ${nb(n, plural(n, "take"))}`,
    cut: "Lessons cut",
    cutNote: "from those takes",
    waiting: "Cuts waiting",
    waitingNote: (waiting: number, published: boolean) =>
      published ? "Module 4 published today" : waiting ? "in module 4, take 2" : "Module 4 is ready to publish",
    takes: "Takes",
    state: {
      review: (waiting: number, published: boolean) =>
        published ? "Published" : waiting ? `${nb(waiting, plural(waiting, "cut"))} to review` : "Ready to publish",
      split: (n: number) => `${nb(n, "lessons")}`,
      published: (n: number) => `Published, ${nb(n, "lessons")}`,
    },
    ago: (d: number) => (d === 0 ? "Today" : `${nb(d, plural(d, "day"))} ago`),
    next: "Waiting for you",
    kept: (kept: number, total: number) => `${kept} of ${total} cuts kept`,
    review: "Review the cuts",
  },

  quizzesTab: {
    meta: (course: string) => course,
    live: "Questions live",
    liveNote: (n: number) => `in ${nb(n, "module quizzes")}`,
    right: "Answered right",
    rightNote: "first tries, 30 days",
    waiting: "New questions",
    waitingNote: (pending: number, added: boolean) =>
      added ? "Live with module 4, take 2" : pending ? "wait for you in step 3" : "Decided, not yet added",
    list: "Module quizzes",
    module: (n: number) => `Module ${n}`,
    review: (approved: number, live: number) => `Take 2: ${approved} of ${live} approved`,
    added: "Take 2 set added",
    rightShare: (pct: number) => `${pct}% right`,
    hardest: "Hardest this month",
    source: (lesson: string, at: string) => `From lesson ${lesson} at ${at}`,
    chose: (pct: number) => `${pct}%`,
    answer: "Answer",
    go: "Review the new questions",
  },

  revenueTab: {
    meta: (from: string, to: string) => `${from}–${to}`,
    earned: (month: string, open: boolean) => `${month}${open ? " so far" : ""}`,
    earnedNote: (date: string) => `Lands ${date}`,
    sales: "From sales",
    salesNote: (n: string) => `${n}\u00a0sales`,
    plus: "From Plus",
    plusNote: (n: string) => `${n}\u00a0minutes`,
    courses: "This month by course",
    units: (n: string) => `${n}\u00a0sales`,
    free: (n: string) => `Free · ${n}\u00a0learners`,
    months: "Last six months",
    legend: { sales: "Sales", plus: "Plus" },
    see: "See every month",
  },

  figures: {
    learners: "Learners",
    sales: "Course sales",
    rating: "Rating",
    // Against last month's whole, at this month's pace so far.
    change: (pct: number, month: string) => `${pct >= 0 ? "+" : "−"}${Math.abs(pct)}% on ${month}`,
    ratings: (n: string) => nb(n, "ratings"),
  },

  drafts: {
    heading: "Drafts",
    add: "Draft a new course",
    addShort: "New draft",
    meta: (chapters: number, lessons: number) =>
      `${nb(chapters, plural(chapters, "chapter"))} · ${nb(lessons, plural(lessons, "lesson"))}`,
    stage: { outline: "Outline", recording: "Recording", quizzes: "Quizzes" },
    progress: {
      outline: (yours: number, total: number) => `${yours} of ${nb(total, "in your words")}`,
      recording: (done: number, total: number) => `${done} of ${nb(total, "recorded")}`,
      quizzes: (done: number, total: number) => `${done} of ${total} quizzes approved`,
    },
    // When it was last touched, at the end of its name's line.
    edited: (ago: number | "now") =>
      ago === "now" ? "Just now" : ago === 0 ? "Today" : `${ago}d ago`,
    openLabel: (title: string) => `Open ${title} in the outline`,
    more: (title: string) => `More for ${title}`,
    duplicate: "Duplicate",
    remove: "Delete draft",
    copyOf: (title: string) => `${title}, copy`,
    removed: (title: string) => `${title} deleted.`,
    undo: "Undo",
    read: (title: string, yours: number, lessons: number) =>
      `${title}: ${yours} of the ${lessons} lessons in your words.`,
    empty: "No drafts yet. One line in the outline below becomes six chapters here.",
  },

  // The payout card reads as the one on /teach reads, since it is the same
  // card with the real month in it.
  payoutCard: heroCopy.payout,
  more: "See the month",
};

export const outlineCopy = {
  eyebrow: "Step 1 · Outline",
  /** The heading, and the words the brand's marker swipes through. */
  heading: { before: "One line becomes", marked: "six chapters", after: "you rewrite" },
  // The reference's lede and its one bullet: what the studio does, then the
  // line it will not cross.
  // Measured to 448px, the lede's width from lg: three lines, the last at
  // 94% of the longest.
  lede: "Describe the course as you would to a colleague. The studio orders six chapters by what depends on what, and a lesson you leave as drafted publishes with an AI drafted badge.",
  promise: "Nothing is recorded or published from this board.",

  field: "Course description",
  placeholder: "Who the course is for, and what they can do at the end",
  // Each length with the minutes a lesson runs at it, on average.
  length: {
    label: "Lesson length",
    short: "Short",
    standard: "Standard",
    long: "Long",
    minutes: (n: number) => `${n}\u00a0min`,
  },
  draft: "Draft the outline",
  drafting: "Drafting",
  try: "Try",
  status: {
    drafting: (n: number, of: number) => `Drafting chapter ${n} of ${of}…`,
    drafted: (title: string) => `Six chapters drafted for ${title}.`,
    closest: (title: string) => `Drafted as “${title}”, the closest outline there is.`,
    none: "Nothing to draft from that yet. Name the subject and who it is for, like “SQL for finance analysts”.",
    short: "At least 20 characters, so the studio has something to draft from.",
  },

  board: {
    eyebrow: "Open draft",
    rename: "Rename draft",
    keep: "Keep the new name",
    title: "Draft title",
    meta: (chapters: number, lessons: number, minutes: string, level: string) =>
      `${nb(chapters, plural(chapters, "chapter"))}\u00a0· ${nb(lessons, plural(lessons, "lesson"))}\u00a0· ${minutes}\u00a0· ${level}`,
    yours: "In your words",
    drafted: "As drafted",
    copy: "Copy outline",
    copied: "Outline copied as text.",
    // A message of two sentences is written as two lines, the shorter first:
    // on a phone each takes a line of its own, so the last is the longer.
    blocked: ["Your browser kept the clipboard closed.", "Select the outline and copy it by hand."],
    saved: "All changes saved",
    label: (title: string) => `Chapters of ${title}`,
    back: "Scroll to the earlier chapters",
    on: "Scroll to the later chapters",
    empty: "No draft is open. Describe a course above and the studio drafts it here.",
  },
  chapter: {
    minutes: (m: string, lessons: number) => `${m} · ${nb(lessons, plural(lessons, "lesson"))}`,
    redraft: (n: number) => `Redraft the lessons of chapter ${n} still as drafted`,
    redrafted: (n: number, kept: number) =>
      kept === 0
        ? `Chapter ${n} redrafted.`
        : [`Chapter ${n} redrafted.`, `Your ${kept === 1 ? "lesson stayed" : `${kept} lessons stayed`} as you wrote ${kept === 1 ? "it" : "them"}.`],
    allYours: (n: number) => ["Nothing to redraft.", `Every lesson of chapter ${n} is yours.`],
    rename: (n: number) => `Rename chapter ${n}`,
    add: "Add a lesson",
  },
  lesson: {
    drafted: "Drafted",
    edit: (id: string) => `Rewrite lesson ${id}`,
    field: (id: string) => `Lesson ${id} title`,
    placeholder: "Name the lesson",
    keys: "Enter to save, Esc to cancel",
    save: (id: string) => `Save lesson ${id}`,
    cancel: "Cancel",
    more: (id: string) => `More for lesson ${id}`,
    rewrite: "Rewrite",
    redraft: "Redraft this lesson",
    up: "Move up",
    down: "Move down",
    toChapter: (n: number) => `Move to chapter ${n}`,
    remove: "Delete lesson",
    removed: (id: string) => `Lesson ${id} deleted.`,
    undo: "Undo",
    moved: (id: string, to: string) => `Lesson ${id} is now ${to}.`,
    // Read in place of the drag, and after a drop.
    drag: "Drag to move, or use the lesson's menu",
  },
};

export const takeCopy = {
  eyebrow: "Step 2 · Recording",
  heading: "Record once. The studio finds where each lesson starts.",
  // Measured at the lede's 672px: two lines, the last at 96% of the first.
  lede: "Upload the module as one recording. The studio reads the transcript for where each idea ends and the next begins, then leaves each cut for you to keep, move or take out.",
  alt: "A bright desk set up to record: a microphone on a stand, a monitor with a webcam on top, headphones on a stand and a palm by the wall",
  uploaded: (ago: string) => `Uploaded ${ago}`,
  play: "Play the take",
  pause: "Pause the take",
  seek: "Position in the take",
  transcript: "Transcript",
  lessonAt: (id: string, at: string) => `Lesson ${id} · ${at}`,
  cut: (n: number, at: string) => `Cut ${n} · ${at}`,
  keep: "Keep",
  kept: "Kept",
  drafted: "Drafted",
  cuts: "Cuts",
  opens: (at: string) => `Take opens · ${at}`,
  goToCut: (n: number) => `Go to cut ${n} in the take`,
  earlier: "5 s earlier",
  earlierShort: "−5 s",
  later: "5 s later",
  laterShort: "+5 s",
  earlierLabel: (n: number) => `Move cut ${n} five seconds earlier`,
  laterLabel: (n: number) => `Move cut ${n} five seconds later`,
  merge: "Merge",
  mergeLabel: (n: number) => `Take cut ${n} out and merge the two lessons`,
  found: "Lessons found",
  lessonMeta: (id: string, minutes: number) => `${id} · ${minutes} min`,
  starts: (at: string) => `From ${at}`,
  replaces: (title: string) => `Replaces “${title}”`,
  splitAgain: "Run the split again",
  splitting: "Reading the transcript…",
  keepAll: "Keep all cuts",
  publish: (n: number) => `Publish as ${n} lessons`,
  status: {
    split: (cuts: number, length: string) => `${cuts} cuts found in ${length} of transcript. Each one waits for you.`,
    waiting: (n: number) => `${n} ${n === 1 ? "cut waits" : "cuts wait"} for you before the module can be published.`,
    ready: "Every cut is kept. The take is ready to publish.",
    published: (n: number) => `Module 4 now plays take 2 in ${n} lessons. Learners keep their place in it.`,
    merged: (n: number) => `Cut ${n} is out, and the two lessons around it are one.`,
  },
};

export const quizCopy = {
  eyebrow: "Step 3 · Quiz",
  /** The heading, and the words the brand's marker swipes through. */
  heading: { before: "Every question names", marked: "the minute", after: "it comes from" },
  lede: "The studio cuts questions from what the take says, and each points to the line it came from. None reaches a learner before you approve it.",
  count: "Questions",
  cut: "Cut the questions",
  cutting: "Cutting",
  source: "From the transcript of module 4, take 2.",
  of: (n: number, total: number) => `Question ${n} of ${total}`,
  play: (lesson: string, at: string) => `Play lesson ${lesson} at ${at}`,
  answer: "Answer",
  why: "Why:",
  approve: "Approve",
  swap: "Swap",
  edit: "Edit",
  discard: "Discard",
  save: "Save",
  cancel: "Cancel",
  edited: "Edited",
  stem: "Question",
  approved: (n: number, total: number) => `${n} of ${total} approved`,
  status: {
    cutting: (n: number) => `Cutting ${n} questions from the transcript…`,
    cut: (n: number, lessons: number) => `${n} questions from ${lessons} lessons, each at the minute it comes from.`,
    swapped: (lesson: string, at: string) => `Swapped for a question from ${at} of lesson ${lesson}.`,
    replaced: (lesson: string, at: string) => `A question from ${at} of lesson ${lesson} takes its place.`,
    noSpare: "No more questions to draw from this take. Cut again for a fresh set.",
    // A change of count, taken up by the deck at once.
    more: (n: number, from: { lesson: string; at: string }[]) => {
      if (from.length === 1) return `Now ${n} questions. The new one comes from ${from[0].at} of lesson ${from[0].lesson}.`;
      const lessons = [...new Set(from.map((f) => f.lesson))];
      return `Now ${n} questions. The ${from.length} new ones come from ${lessons.length === 1 ? "lesson" : "lessons"} ${lessons.join(" and ")}.`;
    },
    fewer: (n: number, out: number) =>
      `Now ${n} questions. ${out === 1 ? "The last one waiting goes" : `The last ${out} waiting go`} back to the pool.`,
    held: (n: number) => `A question you decided stays in the set, so it holds ${n}.`,
    added: (n: number) => `${n} questions added to module 4. They reach learners with the take.`,
  },
  done: {
    heading: (n: number) => `${n} questions approved`,
    lede: "They reach learners with module 4 once you add them.",
    add: "Add to module 4",
    added: "Added to module 4",
    learner: "Try it as a learner",
    again: "Cut again",
  },
  learner: {
    mode: "As a learner",
    right: "Right",
    wrong: "Not that one",
    next: "Next question",
    score: (right: number, total: number) => `${right} of ${total} right`,
    back: "Back to the questions",
    retry: "Take it again",
  },
};

export const revenueCopy = {
  eyebrow: "Revenue",
  heading: "What each course paid you, month by month",
  // Measured at the lede's 672px: two lines, the last at 80% of the first.
  lede: (share: string, rate: string) =>
    `Every sale pays you ${share} of its price, and every minute a Plus subscriber watches pays ${rate} at last month's rate. Both land on the 15th of the month after.`,
  filters: {
    range: "Range",
    months: (n: number) => `${n} months`,
    course: "Course",
    all: "All courses",
    view: "View",
    chart: "Chart",
    table: "Table",
    download: "Download CSV",
  },
  payout: {
    label: (month: string) => `${month} payout`,
    open: "so far",
    sales: "From sales",
    plus: "From Plus",
    lands: (date: string) => `Lands ${date}`,
    left: (n: number) => (n === 0 ? "Lands today" : `${n} ${n === 1 ? "day" : "days"} to go`),
    floor: (floor: string) => `A month under ${floor} rolls into the next.`,
    units: (n: string) => `${n}\u00a0sales`,
    minutes: (n: string) => `${n}\u00a0minutes`,
    statement: "Download statement",
  },
  chart: {
    title: (n: number) => `Last ${n} months`,
    total: "Earned in the range",
    sales: "Sales",
    plus: "Plus",
    pace: "On pace for",
    column: (month: string, total: string, sales: string, plus: string) =>
      `${month}: ${total}, ${sales} from sales and ${plus} from Plus`,
    open: (month: string) => `${month}, so far`,
    table: { month: "Month", sales: "Sales", plus: "Plus", total: "Total" },
  },
  courses: {
    heading: "By course",
    hint: "Pick one to see its months alone.",
    again: "Pick it again to see every course.",
    free: "Free",
    learners: (n: string) => `${n}\u00a0learners`,
    pick: (title: string) => `Show ${title} on the chart`,
    unpick: "Show every course on the chart",
  },
  plus: {
    heading: "Plus minutes",
    watched: (month: string, open: boolean) => `Watched in ${month}${open ? " so far" : ""}`,
    rate: (rate: string) => `${rate} a minute last month`,
    how: "How Plus pays",
  },
  statements: {
    heading: "Statements",
    paid: (date: string) => `Paid ${date}`,
    pays: (date: string) => `Pays ${date}`,
    download: (month: string) => `Download the ${month} statement`,
  },
};
