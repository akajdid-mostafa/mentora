// Every string the contact page reads, beside the rows it reads them against:
// the desks and their hours are in desks.ts, the learner in
// components/dashboard/learner.ts.
import type { Faq } from "@/components/marketing/faqs";
import { tiers } from "@/components/marketing/tiers";
import type { DeskId } from "@/components/contact/desks";

export const contactMeta = {
  title: "Contact",
  description:
    "Chat with learner support around the clock on weekdays, book a call with the instructor team, or write to one address for team seats. Three offices, one inbox.",
};

// ─── §1 Write to us ─────────────────────────────────────────────────────────

export type Role = "learner" | "instructor" | "team";

export type Topic = { id: string; label: string; desk: DeskId; faq?: number };

/** What each kind of writer asks about, and the desk each question goes to.
 *  `faq` is the question below that answers it most often, by its place in
 *  `contactFaqs`. */
export const topicsFor: Record<Role, Topic[]> = {
  learner: [
    { id: "lesson", label: "A lesson or a quiz", desk: "learners" },
    { id: "refund", label: "A refund or a charge", desk: "learners", faq: 0 },
    { id: "certificate", label: "My certificate", desk: "learners", faq: 1 },
    { id: "account", label: "Signing in", desk: "learners", faq: 2 },
  ],
  instructor: [
    { id: "payout", label: "A payout", desk: "instructors" },
    { id: "studio", label: "The course studio", desk: "instructors" },
    { id: "application", label: "My application", desk: "instructors" },
    { id: "review", label: "A review of my course", desk: "instructors" },
  ],
  team: [
    { id: "quote", label: "A quote for seats", desk: "teams", faq: 3 },
    { id: "invoice", label: "An invoice", desk: "teams", faq: 3 },
    { id: "sso", label: "Single sign-on", desk: "teams" },
    { id: "progress", label: "Team progress reports", desk: "teams" },
  ],
};

export const deskNames: Record<DeskId, string> = {
  learners: "Learner support",
  instructors: "The instructor team",
  teams: "The teams desk",
};

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 1000;

export const formCopy = {
  // The display line, split round the phrase the marker swipes.
  heading: { before: "Write to us, and", marked: "a person", after: "writes back" },
  // The promise under the heading, read from who is on the chat right now.
  onShift: (city: string) => `Learner chat is open in ${city} right now.`,
  offShift: (when: string) => `Learner chat opens again at ${when} your time.`,
  mailReply: "Email gets a reply in about three hours.",
  officesLine: "Lisbon · Toronto · Singapore",
  fields: {
    name: "Full name",
    email: "Email",
    role: "I'm writing as",
    topic: "What's this about?",
    message: "Message",
  },
  roles: [
    { id: "learner" as Role, label: "Learner" },
    { id: "instructor" as Role, label: "Instructor" },
    { id: "team" as Role, label: "Team" },
  ],
  // Where the message goes once the topic is picked, and how soon.
  route: (desk: string, wait: string) => `${desk} answers these in ${wait}.`,
  seeAnswer: "Read the answer",
  errors: {
    name: "Tell us what to call you",
    email: "That address is missing an @ or a domain",
    message: `Twenty characters or more, so we know where to start`,
  },
  // The message the form rests at, so Send works on the first press.
  resting: {
    role: "learner" as Role,
    topic: "certificate",
    message:
      "I finished SQL for analysis last week, but my certificate shows my old surname. Can it be changed to Ellis, my married name?",
  },
  // A link from elsewhere on the site opens the form already addressed: a
  // profile's "Write to …" on the about page, its hiring tile, and the teams
  // quote on the pricing page. Each message is long enough to send as it
  // stands, so the first press works there too.
  asked: {
    to: "To",
    change: "Write to support instead",
    person: (first: string, about: string) =>
      `Hi ${first}, I read your profile on the about page and would like to ask you about ${about.toLowerCase()}.`,
    personRoute: (first: string) => `${first} reads these personally and answers within two days.`,
    hiring: { name: "The hiring team", line: "Five open roles" },
    careers:
      "I'd like to hear more about the open roles, the frontend engineer one in Lisbon in particular.",
    hiringRoute: "The hiring team answers within two days.",
    seats: (n: number) =>
      `We're putting ${n} people on Teams and would like a quote, billed yearly, starting next month.`,
  },
  send: "Send message",
  sending: "Sending",
  counter: (n: number) => `${n} / ${MESSAGE_MAX}`,
  done: {
    eyebrow: "Message sent",
    heading: (first: string) => `Thanks, ${first}. It's with a person now.`,
    ticket: "Ticket",
    copy: "Copy ticket number",
    copied: "Copied",
    desk: "Goes to",
    expect: "Reply expected by",
    copyTo: (email: string) => `A copy is on its way to ${email}. Reply to it and the thread stays in one place.`,
    again: "Write another message",
  },
};

// ─── §2 Three desks ─────────────────────────────────────────────────────────

const teamTier = tiers.find((t) => t.name === "Teams")!;
export const SEAT_MONTHLY = teamTier.monthly;
export const SEAT_YEARLY = teamTier.yearly;
export const SEATS_MIN = 5;
export const SEATS_MAX = 500;

export const desksCopy = {
  eyebrow: "Three desks",
  heading: "Pick the desk that knows your question",
  lede: "Learners chat, instructors book a call, and teams write to one address. Each desk shows when it opens in your own time zone.",
  open: "Open now",
  opensAt: (when: string) => `Opens ${when}`,
  learners: {
    kicker: "Learners · Live chat",
    title: "Stuck mid-lesson? Chat now",
    blurb: "Open 24 hours on weekdays and 20 at weekends. The first reply comes in about four minutes.",
    header: "Learner support",
    from: (agent: string, city: string) => `${agent} in ${city}`,
    hello: (agent: string, first: string) => `Hi ${first}, I'm ${agent}. What are you working on?`,
    closed: (when: string) => `The chat is quiet until ${when}. Leave a message and it opens the thread.`,
    field: "Message learner support",
    draft: "Can I move my cohort start to November?",
    send: "Send",
    typing: (agent: string) => `${agent} is typing`,
    queued: (agent: string, when: string) => `Queued. ${agent} picks it up at ${when}, and the reply lands here and in your email.`,
    you: "You",
  },
  instructors: {
    kicker: "Instructors · Video call",
    title: "Talk through payouts or the studio",
    blurb: "Twenty minutes with someone who has published here, from Lisbon or Singapore on weekdays.",
    header: "Book 20 minutes",
    with: "Instructor team",
    days: "Day",
    slots: (zone?: string) => (zone ? `Times in your zone, ${zone}` : "Times in your zone"),
    taken: "Taken",
    book: (label: string) => `Book ${label}`,
    booked: "Booked",
    bookedLine: (when: string) => `${when}. The link arrives by email an hour before.`,
    calendar: "Add to calendar",
    change: "Pick another time",
  },
  teams: {
    kicker: "Teams · Email",
    title: "Quotes, invoices and single sign-on",
    blurb: "Weekdays 9 to 6 in Toronto. A quote for your seat count arrives within four working hours.",
    header: "The teams desk",
    address: "Address",
    copy: "Copy address",
    copied: "Copied",
    seats: "Seats",
    fewer: "One seat fewer",
    more: "One seat more",
    yearly: (n: string) => `${n} a year`,
    saving: (n: string) => `${n} under paying monthly`,
    quote: "Ask for this quote",
    subject: (seats: number) => `A quote for ${seats} Mentora seats`,
    body: (seats: number, total: string) =>
      `Hello,\n\nWe'd like a quote for ${seats} seats of Mentora for teams, billed yearly (${total} at list price).\n\nThanks`,
  },
};

// Canned answers the chat gives, matched on whole words in the message, so
// "I started" is not a question about a start date. A real product sends the
// line to a person; the demo shows what that person typically writes back.
export const chatAnswers: { match: RegExp; reply: (agent: string) => string }[] = [
  {
    match: /\bcohorts?\b|\bstart date\b|\bnovember\b/i,
    reply: () =>
      "Yes. Open the course in My learning, press Change start date, and pick any cohort with seats left. Your progress comes with you.",
  },
  {
    match: /\brefund|\bmoney\b|\bcharged?\b/i,
    reply: () =>
      "Refunds are in My learning under the course's menu for 30 days after you buy. The money is back on your card in five to ten working days.",
  },
  {
    match: /\bcertificates?\b|\bsurname\b/i,
    reply: () =>
      "I can change the name on it once for you. Send the spelling you want and the certificate is reissued within the hour, with the same verify link.",
  },
  {
    match: /\bpassword\b|\bsign(ing)? in\b|\blog ?in\b/i,
    reply: () =>
      "Try the sign-in link on the Sign in page first. It works even if you never set a password. If the email doesn't arrive in two minutes, tell me the address and I'll look.",
  },
];

export const chatFallback = (agent: string) =>
  `Thanks, that's with me now. I'll read the lesson you mean and answer here, usually within a few minutes. ${agent}`;

// ─── §3 Offices ─────────────────────────────────────────────────────────────

export const officesCopy = {
  eyebrow: "Offices",
  heading: "Three cities keep the chat open",
  lede: "Each city's shift starts before the last one ends. Pick one to see its address, its hours and the local time on its wall.",
  hq: "Head office",
  address: "Address",
  localTime: "Local time",
  directions: "Get directions",
  copy: "Copy address",
  copied: "Address copied",
  figure: "hours",
  figureLine: (day: string) => `of learner chat on ${day}, across three time zones`,
  schedule: "Hours",
  showIn: "Show hours in",
  officeTime: "Office time",
  yourTime: "Your time",
  openNow: "Open now",
  closed: "Closed",
  // the mark a close carries when it falls after midnight in the zone shown
  nextDay: "+1",
};

// ─── §4 Questions ───────────────────────────────────────────────────────────

export const contactFaqCopy = {
  eyebrow: "Before you write",
  heading: "Six answers that save you the wait",
  foot: "Nothing here fits? The form at the top goes straight to a person.",
  footLink: "Write to us",
  footHref: "#write",
};

export const contactFaqs: Faq[] = [
  {
    group: "Payments",
    q: "How do I get a refund?",
    a: "From My learning, in the course's own menu, for 30\u00a0days after you buy it. The money is back on your card in five to ten working days. Plus has no refund to ask for: it cancels in one click, any day.",
  },
  {
    group: "Certificates",
    q: "Can the name on my certificate be changed?",
    a: "Once, by learner support. The reissued certificate keeps its verify link, so anywhere you shared it now shows the new name. Write from your account's address and spell the name as it should read.",
  },
  {
    group: "Your account",
    q: "I can't sign in. What now?",
    a: "Ask for a sign-in link on the Sign in page. It works whether or not you ever set a password, and it lasts fifteen minutes. If no email arrives, the chat can check which address your account is under.",
  },
  {
    group: "Teams",
    q: "Can a company pay by invoice?",
    a: `Yes, from five seats, billed once a year at $${SEAT_YEARLY} a seat. The teams desk sends a quote with your company's details on it, and the invoice follows on the day you sign. Card and bank transfer both work.`,
  },
  {
    group: "Your account",
    q: "How do I delete my account and my data?",
    a: "Settings, then Privacy, then Delete account. Everything goes within 30 days, except receipts we are required to keep for tax. Certificates you earned stop verifying, so download them first.",
  },
  {
    group: "Instructors",
    q: "Can I message an instructor directly?",
    a: "Through the Q&A tab under each lesson, which the instructor and their reviewers answer. Direct messages stay off, so an instructor with 40,000 learners can keep up with every question asked.",
  },
];
