// The outlines the studio drafts from: one line in, six chapters out. There is
// no model behind the demo. A brief typed into the studio lands on the written
// outline it shares the most words with, the way the home page's planner lands
// a typed goal on a sample path, and says so when nothing matches.
//
// Written rather than generated, and each has to be a course somebody could
// teach: an outline that reads as filler makes the studio's claim worse than
// no claim at all. Every lesson carries a second drafted title, `alt`, which
// is what Redraft swaps in; a lesson already in the instructor's words is never
// touched by it.
//
// Mock data. A buyer replaces these with their own, or with a call to their
// own model that returns the same shape.

import { chapters as homeChapters } from "@/components/marketing/draft";
import { words } from "@/components/learn/tutor";

export type Level = "Beginner" | "Intermediate" | "Advanced";

export type LessonSeed = {
  title: string;
  /** The studio's second draft of the same lesson, for Redraft. */
  alt: string;
  /** At the standard lesson length; the composer's setting scales it. */
  minutes: number;
};

export type ChapterSeed = { title: string; lessons: LessonSeed[] };

export type OutlineSeed = {
  id: string;
  /** The working title a new draft opens under. */
  title: string;
  /** The one line this outline answers. */
  brief: string;
  level: Level;
  /** Words a typed brief is matched on, stemmed the way the tutor stems a
   *  question, so "cohort" meets "cohorts". */
  keys: string[];
  chapters: ChapterSeed[];
};

const lessons = (rows: [string, string, number][]): LessonSeed[] =>
  rows.map(([title, alt, minutes]) => ({ title, alt, minutes }));

// The home page's studio drafts this one, and it is the syllabus SQL for
// analysis runs today, so the chapters and their lessons come from there and
// only the second drafts are written here. A chapter's minutes are split
// across its lessons, the remainder to the first, as the course page splits
// them.
const homeAlts = [
  [
    "A sheet, a table, and the rule that separates them",
    "Why the database refuses a date typed as text",
    "SELECT on an orders table you already know",
  ],
  [
    "AND before OR: the bracket that changes the count",
    "Three kinds of nothing: NULL, zero and an empty cell",
    "IN, BETWEEN, LIKE, and the rows each one misses",
  ],
  [
    "Picking the column a total is taken over",
    "GROUP BY as the pivot table you used to build",
    "Filtering after the totals with HAVING",
  ],
  [
    "The lookup column, rebuilt as a join",
    "Which rows a left join keeps",
    "Counting rows at every join",
    "When a join returns more rows than it was given",
  ],
  [
    "A subquery for a number you need twice",
    "Naming each step with WITH",
    "Running totals without a helper column",
  ],
  [
    "Turning a manager's question into a query",
    "Three checks before a number leaves your laptop",
    "A saved view, a weekly run and a note on its limits",
  ],
];

const spreadsheets: OutlineSeed = {
  id: "sql-sheets",
  title: "SQL for people who outgrew spreadsheets",
  brief:
    "A practical SQL course for people who already live in spreadsheets and have outgrown them",
  level: "Beginner",
  keys: ["spreadsheet", "sheet", "excel", "sql", "query", "database", "select", "table"],
  chapters: homeChapters.map((c, ci) => ({
    title: c.title,
    lessons: c.lessons.map((title, li) => ({
      title,
      alt: homeAlts[ci][li],
      minutes:
        Math.floor(c.minutes / c.lessons.length) + (li < c.minutes % c.lessons.length ? 1 : 0),
    })),
  })),
};

// The course Mina Park proposes on the /teach application, from the one line
// she wrote there, so the studio she opens while her checks run drafts her own
// course first.
const wayfinding: OutlineSeed = {
  id: "wayfinding",
  title: "Wayfinding for product designers",
  brief:
    "Designers who inherit a navigation nobody can find anything in, and have to fix it without a redesign.",
  level: "Intermediate",
  keys: ["wayfinding", "navigation", "menu", "findability", "designer", "design", "information", "architecture", "ux", "label"],
  chapters: [
    {
      title: "Where people get lost, and how you find out",
      lessons: lessons([
        ["Reading a navigation the way a newcomer does", "A first visit, narrated out loud", 11],
        ["Tree tests on the menu you inherited", "Testing the menu without the page around it", 14],
        ["Search logs as a map of what nobody found", "What the search box says the menu hides", 12],
      ]),
    },
    {
      title: "Names before structure",
      lessons: lessons([
        ["Labels that match the words people type", "Borrowing labels from support tickets", 12],
        ["Card sorts with the team that owns each page", "Running a card sort inside the company", 15],
        ["When two sections mean the same thing", "Merging sections nobody could tell apart", 10],
      ]),
    },
    {
      title: "Structure you can change on a Tuesday",
      lessons: lessons([
        ["Moving one branch without breaking every link", "Relocating a section and keeping its URLs", 13],
        ["Depth, breadth and the three-click myth", "How deep a menu goes before people turn back", 11],
        ["Redirects, breadcrumbs and the old bookmarks", "Keeping old bookmarks working after a move", 12],
      ]),
    },
    {
      title: "Signposts on the page",
      lessons: lessons([
        ["Headers, breadcrumbs and the current page", "Showing people where they stand", 12],
        ["Links that say where they go", "Link text a stranger can predict", 10],
        ["Empty states that point somewhere", "Dead ends turned into directions", 9],
      ]),
    },
    {
      title: "Search as a second navigation",
      lessons: lessons([
        ["Zero-result searches, sorted by cost", "The searches that come back empty, ranked", 13],
        ["Synonyms, typos and the words of other teams", "Teaching search the words people use", 12],
        ["When search should send people to a page", "Pinning the one right page to a search", 10],
      ]),
    },
    {
      title: "Proving the fix",
      lessons: lessons([
        ["Before and after, measured on the same tasks", "Timing the same tasks before and after", 14],
        ["A migration plan the engineers will sign", "Shipping the new menu in three releases", 12],
        ["Handing the map to whoever comes next", "Documenting the structure for the next designer", 9],
      ]),
    },
  ],
};

// Ana's three drafts. The first is the one her studio opens on; the other two
// are further along, every title already hers.
const windowFunctions: OutlineSeed = {
  id: "window-functions",
  title: "Window functions for analysts",
  brief:
    "Window functions for analysts who already write GROUP BY and still export to a sheet for running totals",
  level: "Intermediate",
  keys: ["window", "over", "partition", "rank", "running", "lag", "lead", "moving", "average", "total"],
  chapters: [
    {
      title: "What GROUP BY throws away",
      lessons: lessons([
        ["One row per group, and the detail you lose", "The rows GROUP BY collapses", 12],
        ["OVER(): a total that keeps every row", "Totals beside the rows they came from", 13],
        ["Reading PARTITION BY as a sentence", "PARTITION BY, said out loud", 11],
      ]),
    },
    {
      title: "Ranking without a spreadsheet",
      lessons: lessons([
        ["ROW_NUMBER, RANK and DENSE_RANK side by side", "Three ways to number rows, compared", 14],
        ["Top three per region in one query", "The best seller in every region", 12],
        ["Ties, and the order you forgot to state", "Deciding what a tie means", 10],
        ["Percentiles with NTILE and PERCENT_RANK", "Quartiles without exporting to a sheet", 13],
      ]),
    },
    {
      title: "Running totals and moving averages",
      lessons: lessons([
        ["A running total with SUM() OVER", "SUM() OVER, row by row", 12],
        ["Frames: ROWS BETWEEN, spelled out", "Choosing the rows a window sees", 15],
        ["A seven-day average that skips no days", "A moving average over gapless dates", 14],
        ["Resetting the total each month", "Month-to-date totals in one column", 10],
      ]),
    },
    {
      title: "Looking back and ahead",
      lessons: lessons([
        ["LAG and LEAD on a daily sales table", "Yesterday's sales on today's row", 13],
        ["Growth on the previous month, as a column", "Month-on-month change in one column", 12],
        ["First and last values in a group", "The first order and the latest one", 11],
      ]),
    },
    {
      title: "Sessions, streaks and gaps",
      lessons: lessons([
        ["Splitting clicks into sessions", "Grouping clicks by the gap between them", 15],
        ["Counting a customer's longest streak", "The longest run of weekly orders", 14],
        ["Finding the days with no orders", "Dates missing from the calendar", 11],
        ["Churn dates from the last order", "When a customer counts as gone", 12],
      ]),
    },
    {
      title: "Window functions in the reports you hand over",
      lessons: lessons([
        ["Percent of total without a second query", "Shares of a total, per row", 11],
        ["When a window is slower than a join", "Window or join: timing both", 12],
        ["A monthly report rebuilt from exports to SQL", "One query in place of a spreadsheet report", 16],
        ["Checking a window result by hand", "Checking three rows by hand", 10],
      ]),
    },
  ],
};

const retention: OutlineSeed = {
  id: "retention",
  title: "Cohorts and retention in SQL",
  brief:
    "Retention analysis in SQL for analysts whose product team asks every Monday whether users come back",
  level: "Intermediate",
  keys: ["cohort", "retention", "churn", "retain", "returning", "product", "engagement", "active"],
  chapters: [
    {
      title: "What retention shows, and what it hides",
      lessons: lessons([
        ["Active, returning, retained: three words, three queries", "Active, returning and retained, defined in SQL", 13],
        ["Choosing the event that counts as coming back", "The event that proves a user came back", 11],
        ["Why an average retention rate misleads", "What an average retention rate hides", 10],
      ]),
    },
    {
      title: "Building cohorts",
      lessons: lessons([
        ["Signup week as a cohort key", "Grouping users by the week they signed up", 12],
        ["DATE_TRUNC and the week that starts on Sunday", "Weeks that start on Monday, on purpose", 10],
        ["A cohort table from an events table", "Cohorts built from raw events", 15],
      ]),
    },
    {
      title: "The retention triangle",
      lessons: lessons([
        ["Weeks since signup, as a column", "Counting weeks since signup", 11],
        ["Pivoting cohorts into a triangle", "A retention triangle in one query", 14],
        ["Reading the diagonal and the last column", "What the triangle's edges tell you", 12],
      ]),
    },
    {
      title: "Curves you can compare",
      lessons: lessons([
        ["From counts to percentages without rounding errors", "Percentages that add up", 12],
        ["Comparing two cohorts fairly", "Two cohorts on the same footing", 13],
        ["Small cohorts and the noise in them", "How small is too small for a cohort", 10],
        ["Plotting curves the product team will read", "Charts a manager reads at a glance", 11],
      ]),
    },
    {
      title: "Churn and resurrection",
      lessons: lessons([
        ["When a user counts as churned", "Defining churn before you count it", 11],
        ["Resurrected users and where they came from", "Users who came back after leaving", 12],
        ["Revenue retention beside user retention", "Net revenue retention, step by step", 14],
      ]),
    },
    {
      title: "The Monday report",
      lessons: lessons([
        ["One query the team can rerun", "A Monday query anyone can rerun", 12],
        ["Annotating launches on the curve", "Marking launches on the curve", 10],
        ["What to say when retention drops", "Explaining a drop to the product team", 11],
        ["Handing over the definitions", "Writing the definitions down", 9],
      ]),
    },
  ],
};

const fraud: OutlineSeed = {
  id: "fraud",
  title: "Fraud signals in payment data",
  brief:
    "Spotting fraud in card payment data with SQL, for analysts at fintechs who hear about chargebacks a month late",
  level: "Advanced",
  keys: ["fraud", "payment", "chargeback", "card", "fintech", "risk", "transaction", "decline"],
  chapters: [
    {
      title: "What fraud looks like in a payments table",
      lessons: lessons([
        ["Authorizations, captures and chargebacks", "The life of a card payment, row by row", 12],
        ["Why the label arrives sixty days late", "Chargebacks and the two-month delay", 10],
        ["A fraud rate you can defend", "Measuring fraud in basis points", 11],
      ]),
    },
    {
      title: "Velocity",
      lessons: lessons([
        ["Cards used five times in ten minutes", "Five uses in ten minutes", 13],
        ["Counting per card, per device, per address", "Velocity by card, device and address", 12],
        ["Thresholds from your own history", "Setting limits from past fraud", 11],
      ]),
    },
    {
      title: "Mismatches",
      lessons: lessons([
        ["Billing country, card country, IP country", "When three countries disagree", 12],
        ["New accounts with old cards", "Fresh accounts carrying old cards", 10],
        ["Emails that were created this week", "Email addresses made this week", 9],
      ]),
    },
    {
      title: "Networks of accounts",
      lessons: lessons([
        ["Shared devices across accounts", "One device, many accounts", 13],
        ["Linking accounts through shared cards", "Accounts joined by a card", 14],
        ["Rings, and the query that finds them", "Finding a fraud ring with a self-join", 15],
      ]),
    },
    {
      title: "Scoring and review",
      lessons: lessons([
        ["A points score before any model", "A simple points score", 12],
        ["Precision, recall and the review queue", "Sizing the review queue", 13],
        ["What each false positive costs", "The price of blocking a good customer", 10],
      ]),
    },
    {
      title: "Keeping it honest",
      lessons: lessons([
        ["Backtesting a rule on last quarter", "Replaying a rule on last quarter", 12],
        ["Rules that stop working", "Spotting a rule that went stale", 10],
        ["Explaining a decline to support", "What to tell a declined customer", 9],
      ]),
    },
  ],
};

// The order ties are broken in: the narrower subjects first, so "SQL window
// functions" lands on window functions rather than on the course that
// teaches SQL from the start.
export const outlines: OutlineSeed[] = [windowFunctions, retention, fraud, wayfinding, spreadsheets];

export const outlineById = (id: string) => outlines.find((o) => o.id === id);

/** The two briefs offered under the field: Mina's from the /teach
 *  application, and the one the home page's studio drafts. */
export const samples = [wayfinding, spreadsheets];

const keyStems = new Map(outlines.map((o) => [o.id, new Set(o.keys.flatMap(words))]));

/** The written outline a typed brief lands on: the most shared words wins,
 *  ties go to the narrower subject, and nothing shared returns null rather
 *  than a guess. */
export function matchOutline(brief: string): OutlineSeed | null {
  const typed = new Set(words(brief));
  let best: OutlineSeed | null = null;
  let score = 0;
  for (const o of outlines) {
    const keys = keyStems.get(o.id) as Set<string>;
    const n = [...typed].filter((w) => keys.has(w)).length;
    if (n > score) {
      best = o;
      score = n;
    }
  }
  return best;
}
