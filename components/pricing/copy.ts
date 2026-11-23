// Every string the pricing page prints that is not a price. Prices come from
// `components/marketing/tiers.ts` through `math.ts`; a sentence that states
// one is a function of it here, so changing a price changes the sentence.

import type { ClosingCopy } from "@/components/marketing/closing";
import { faqs, type Faq } from "@/components/marketing/faqs";
import { SPLIT_FROM } from "@/components/checkout/order";
import { perMonth, plus, teams, usd, yearlySaving } from "@/components/pricing/math";

const splitFrom = usd(SPLIT_FROM / 100);

// ---------------------------------------------------------------------------
// §1 Plans

export type PlanKey = "single" | "plus" | "teams";

export const plansCopy = {
  // The phrase the page turns on, drawn under with the marker.
  title: ["Priced by", "what you'll finish"] as const,
  lede: "Buy a course and keep it for good, or open all 12,400 on Plus. On all three plans, the AI tutor sits in every lesson you open.",
  logos: "Teams learning on Mentora",
  billing: { monthly: "Monthly", yearly: "Yearly", saving: `−${yearlySaving}%` },
  popular: "Popular",
  plans: {
    single: {
      unit: { monthly: "avg. course", yearly: "avg. course" },
      under: { monthly: "From $19 to $149. Free courses stay free.", yearly: "From $19 to $149. Nothing renews." },
      lead: "Every course you buy comes with",
      ticks: [
        "Access for good, not a rental",
        "The AI tutor in every lesson",
        "A certificate, where it has one",
        `Three payments from ${splitFrom}`,
        "The option to send it as a gift",
      ],
      cta: "Browse courses",
    },
    plus: {
      unit: { monthly: "month", yearly: "year" },
      under: {
        monthly: "Billed monthly after 7 days free.",
        yearly: `${usd(perMonth(plus.yearly))} a month, billed as one charge.`,
      },
      lead: "All 12,400 courses, and",
      ticks: [
        "Every path, start to finish",
        "A certificate for every course",
        "Offline lessons on the apps",
        "New courses the day they launch",
        "Cancel in one click",
      ],
      cta: "Start 7 days free",
    },
    teams: {
      unit: { monthly: "seat / month", yearly: "seat / year" },
      under: {
        monthly: "From 5 seats, by card each month.",
        yearly: `${usd(perMonth(teams.yearly))} a seat a month, on one invoice.`,
      },
      lead: "Everything in Plus, and",
      ticks: [
        "Seats you assign and move",
        "Single sign-on on day one",
        "A weekly report of who finished what",
        "Courses and paths set for the team",
        "A named contact, not a queue",
      ],
      cta: "Price a team",
    },
  } satisfies Record<PlanKey, unknown>,
  teach: { line: "Teaching instead? Instructors keep 70% of every sale.", link: "See what teaching pays" },
  promises: ["Refund within 30 days", "Cancel in one click", "Tax shown up front"],
};

// ---------------------------------------------------------------------------
// §2 Calculator

const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const monthLong = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });

/** The name of the month `n` months into the visitor's year, counting the
 *  month the page was sent in as the first. */
export function monthName(start: string, n: number, long = false) {
  const [y, m] = start.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n - 1, 15));
  return (long ? monthLong : month).format(d);
}

export const calculatorCopy = {
  eyebrow: "Calculator",
  heading: "Which plan costs you less this year",
  courses: "Courses you'll finish in 12 months",
  spend: "What a course usually costs you",
  billing: "Plus billed",
  cheaper: "Cheaper for you",
  plusName: (yearly: boolean) => `Mentora Plus, ${yearly ? "yearly" : "monthly"}`,
  singleName: "Buying course by course",
  plusSum: (plus: number, single: number, saving: number) =>
    `${usd(plus)} on Plus against ${usd(single)} bought one by one. You keep ${usd(saving)}.`,
  singleSum: (courses: number, single: number, plus: number, saving: number) =>
    `${usd(single)} for ${courses === 1 ? "one course" : `${courses} courses`} against ${usd(plus)} on Plus. You keep ${usd(saving)}.`,
  even: "The two cost the same over the year, so the tie goes to keeping what you buy.",
  lede: "A course is a purchase and Plus is a subscription, so the cheaper one depends on how many you finish in a year.",
  copy: "Copy this estimate",
  copied: "Link copied",
  manual: "Copy the link below",
  chart: {
    title: "Spent by the end of each month",
    single: "Course by course",
    plus: (yearly: boolean) => `Plus, ${yearly ? "yearly" : "monthly"}`,
    overtakes: (m: string) => `Plus costs less from ${m}`,
    ahead: (saving: number) => `Course by course, ${usd(saving)} less`,
    foot: "Each course bought as you start it, spread across the year.",
    total: "At month 12",
  },
};

// ---------------------------------------------------------------------------
// §3 Compare

/** A cell: a tick, a dash, or a few words. */
export type Cell = boolean | string;

export type Feature = {
  name: string;
  /** What the line means, opened from the ⓘ beside it. */
  about: string;
  cells: [Cell, Cell, Cell];
};

export type Group = { name: string; features: Feature[] };

export const compareCopy = {
  eyebrow: "Compare",
  heading: "Every feature, plan by plan",
  lede: "The tutor, the transcripts and a certificate's verify link are the same on all three. Differences sinks every line like those, so the rest stand out.",
  views: { all: "All features", diff: "Differences" },
  feature: "Feature",
  about: (name: string) => `About ${name.toLowerCase()}`,
  yes: "Included",
  no: "Not included",
};

export const groups: Group[] = [
  {
    name: "Courses",
    features: [
      {
        name: "Courses you can open",
        about: "Plus and Teams open every course in the catalog, including ones published after you join. On Per course a course opens once it is paid for, and its first lesson is free before that.",
        cells: ["The ones you buy", "All 12,400", "All 12,400"],
      },
      {
        name: "How long you keep them",
        about: "A course bought on its own stays in your library for good, even if its instructor later retires it. On Plus and Teams access ends with the subscription, and your notes and progress wait for you if you come back.",
        cells: ["For good", "While subscribed", "While the seat is yours"],
      },
      {
        name: "Guided paths",
        about: "A path strings five courses into one plan with a finish date. On Per course you follow one by buying its courses one at a time; Plus opens all four paths at once.",
        cells: ["Course by course", true, true],
      },
      {
        name: "Cohort review calls",
        about: "Weekly calls with the instructor, on courses that run in cohorts. A seat on the call comes with the course however it was paid for.",
        cells: [true, true, true],
      },
    ],
  },
  {
    name: "AI tutor",
    features: [
      {
        name: "Tutor in every lesson",
        about: "The tutor answers from the transcript of the lesson on screen, and every answer cites the minute it came from.",
        cells: [true, true, true],
      },
      {
        name: "Hints, never graded answers",
        about: "On a quiz or a project it asks you the next question rather than handing over the answer. Your instructor sets what it may reveal.",
        cells: [true, true, true],
      },
      {
        name: "Answers linked to the minute",
        about: "Press the time on an answer and the player jumps to the moment of the lesson the answer came from.",
        cells: [true, true, true],
      },
    ],
  },
  {
    name: "Certificates",
    features: [
      {
        name: "Certificate of completion",
        about: "Guided projects and a few short courses end without a certificate when bought alone. On Plus and Teams every course you finish issues one.",
        cells: ["Where the course has one", "Every course", "Every course"],
      },
      {
        name: "Verify link for employers",
        about: "Each certificate has a public page that shows what you completed and on which date.",
        cells: [true, true, true],
      },
      {
        name: "Path certificate",
        about: "Issued once all five courses of a path are finished, listing the project from each one.",
        cells: [false, true, true],
      },
    ],
  },
  {
    name: "Watching",
    features: [
      {
        name: "Offline lessons",
        about: "Lessons download to the iOS and Android apps with their transcripts and notes, and expire 30 days after you last signed in.",
        cells: [false, true, true],
      },
      {
        name: "Transcripts and timed notes",
        about: "Every lesson has a transcript you can search and press to jump, and notes pinned to the second you wrote them.",
        cells: [true, true, true],
      },
      {
        name: "New courses at launch",
        about: "Courses published after you join open the day they launch, with no second purchase.",
        cells: [false, true, true],
      },
    ],
  },
  {
    name: "Teams",
    features: [
      {
        name: "Seats you manage",
        about: "Add a seat whenever someone joins, move a seat to someone else at any time, and remove seats at renewal.",
        cells: [false, false, "From 5 seats"],
      },
      {
        name: "Single sign-on",
        about: "SAML sign-in through Okta, Microsoft Entra or Google Workspace, set up with your named contact on the first day.",
        cells: [false, false, "SAML, Okta, Google"],
      },
      {
        name: "Progress reports",
        about: "A weekly email of who started and who finished what, and the same table as a CSV whenever you ask for it.",
        cells: [false, false, "Weekly, and CSV"],
      },
      {
        name: "Assigned courses and paths",
        about: "Put a course or a path on someone's list with a date to finish by. It shows first on their dashboard.",
        cells: [false, false, true],
      },
      {
        name: "A named contact",
        about: "One person at Mentora who knows your account, answers within a working day and handles invoices and refunds.",
        cells: [false, false, true],
      },
    ],
  },
  {
    name: "Billing",
    features: [
      {
        name: "Ways to pay",
        about: "Cards, PayPal and, on Teams billed yearly, an invoice with 30 days to pay it.",
        cells: ["Card or PayPal", "Card or PayPal", "Invoice or card"],
      },
      {
        name: "Three payments",
        about: `A course from ${splitFrom} up can be split into three monthly payments at checkout, with nothing added.`,
        cells: [`From ${splitFrom}`, false, false],
      },
      {
        name: "Free to start",
        about: "Every course opens its first lesson with no card. Plus runs seven days before the first charge, and Teams can start with five seats for seven days.",
        cells: ["First lesson", "7 days", "7 days, 5 seats"],
      },
      {
        name: "Refund",
        about: "Thirty days from purchase, however much you watched. On Teams it goes through your named contact, who squares the seat count first.",
        cells: ["30 days", "30 days", "Through your contact"],
      },
      {
        name: "Send as a gift",
        about: "Pay for a course in someone else's name at checkout, with a note and the day the email goes out.",
        cells: [true, false, false],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// §4 Teams

export const teamsCopy = {
  eyebrow: "Teams",
  // The first words carry the marker: one bill is what a team buys here.
  heading: { marked: "One invoice", after: "for the whole team" },
  lede: "Seats from five, single sign-on on the first day, and a weekly report of who finished what. Seats move when people do.",
  seats: "Seats",
  fewer: "One seat fewer",
  more: "One seat more",
  seatHint: "Remove seats at renewal.",
  times: (seats: number, seat: number, yearly: boolean) =>
    `${seats} seats × ${usd(seat)} a ${yearly ? "year" : "month"}`,
  saved: (n: number) => `${usd(n)} less than paying monthly`,
  switchYearly: (n: number) => `Billed yearly, the same seats cost ${usd(n)} less.`,
  toYearly: "Switch to yearly",
  quote: `From 100 seats a named contact prices the contract, so this is the list price.`,
  talk: "Talk to us",
  download: "Download the quote",
  photoAlt: "A small studio through a fluted-glass door, a whiteboard of colour swatches above a high table and stools",
  overlays: {
    finished: { figure: "38", label: "courses finished this quarter" },
    sso: "Single sign-on with Okta",
    assigned: (n: number, of: number) => `${n} of ${of} seats assigned`,
    course: { progress: (done: number, of: number) => `${done} of ${of} done` },
  },
};

// ---------------------------------------------------------------------------
// §5 FAQ

export const pricingFaqCopy = {
  eyebrow: "Questions",
  heading: "What the price does and does not cover",
  foot: "A person on the billing team answers anything this list does not.",
  footLink: "Write to billing",
};

// The refund is the home page's own answer, word for word, so the two pages
// cannot drift; it goes first because the home page's "Refund within 30 days"
// lands here with the first row open.
const refund = faqs.find((f) => f.group === "Money" && f.q.startsWith("What does the refund"))!;

export const pricingFaqs: Faq[] = [
  refund,
  {
    group: "Money",
    q: "Is tax included in the price?",
    a: "No. The prices here are before tax. At checkout the VAT or GST for your country is added on its own line above the total, so you see the whole amount before you pay. Buyers in the United States pay no sales tax on a course, so their total is the price.",
  },
  {
    group: "Money",
    q: "Can I pay for a course in parts?",
    a: `A course from ${splitFrom} up can be split into three monthly payments at checkout, with nothing added. The first comes off the card that day and the other two on the same date in each of the next two months.`,
  },
  {
    group: "Plus",
    q: "Can I switch between monthly and yearly?",
    a: `Yes. Moving to yearly takes effect the same day, and what is left of your month comes off the ${usd(plus.yearly)}. Moving to monthly starts when the paid year ends, so the months already paid for are never refunded.`,
  },
  {
    group: "Plus",
    q: "What happens to courses I bought before Plus?",
    a: "They stay yours. Plus opens the rest of the catalog beside them, and if you cancel, the courses you paid for stay in your library. The ones you only opened on Plus lock again, with your notes kept.",
  },
  {
    group: "Teams",
    q: "How do seats work on Teams?",
    a: "Five seats is the smallest team. Add one whenever someone joins and pay only for the days left in the period; remove seats at renewal. A seat can move to someone else at any time, and the progress stays with the person rather than with the seat they sat in.",
  },
];

// ---------------------------------------------------------------------------
// §6 Closing

export const pricingClosing: ClosingCopy = {
  heading: "Open a lesson before you pay for any",
  lede: "Every course plays its first lesson with the tutor switched on. Plus then gives you seven days of the whole catalog before the first charge.",
  learn: { label: "Start 7 days free", href: "/checkout" },
  teach: { label: "Browse courses", href: "/courses" },
  risk: "30 days to ask for a refund, on every plan.",
};
