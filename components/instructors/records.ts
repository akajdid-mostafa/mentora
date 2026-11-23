// What Mentora checked before each teacher's first course went live: the
// badge on every card, spelled out. Four checks, the same four for everyone,
// and the evidence for each written for the person it was checked on, so the
// record reads as a record rather than as a promise. The directory's band
// shows one at a time and the profile page shows its owner's.
//
// Mock data. A buyer swapping in their own people swaps these sentences and
// dates and nothing else.

export type BadgeRecord = {
  /** The day the last check passed and the badge went on, some weeks before
   *  the teacher's first course opened. */
  on: string;
  /** How many days the four checks took, first to last. */
  took: number;
  /** Who confirmed the job the teacher says they do. */
  role: string;
  /** The piece of their own work two people in the field reviewed. */
  work: string;
  /** The identity document matched on the video call. */
  document: "a passport" | "a national ID card" | "a residence permit";
  /** The ten-minute sample lesson: its title, and what twenty learners gave
   *  it out of 5. */
  sample: string;
  lesson: number;
};

export const records: Record<string, BadgeRecord> = {
  "Ana Reyes": {
    on: "2024-12-09",
    took: 11,
    role: "Her employer, a payments firm, confirmed it",
    work: "Two analysts reviewed her fraud dashboard",
    document: "a passport",
    sample: "Window functions",
    lesson: 4.8,
  },
  "Priya Raman": {
    on: "2025-05-26",
    took: 13,
    role: "The trading desk confirmed her eight years",
    work: "Two quants reviewed a risk model she built",
    document: "a passport",
    sample: "Discounted cash flow",
    lesson: 4.6,
  },
  "Tomás Oliveira": {
    on: "2025-01-20",
    took: 9,
    role: "His employer confirmed the role",
    work: "Two engineers reviewed his ledger migration",
    document: "a national ID card",
    sample: "Test fixtures",
    lesson: 4.9,
  },
  "Mara Lindqvist": {
    on: "2025-01-06",
    took: 10,
    role: "Her employer confirmed the role",
    work: "Two designers reviewed her design system",
    document: "a national ID card",
    sample: "Design tokens",
    lesson: 4.8,
  },
  "Ibrahim Salah": {
    on: "2025-06-23",
    took: 14,
    role: "The logistics firm confirmed the role",
    work: "Two ML engineers reviewed his routing model",
    document: "a residence permit",
    sample: "Sample sizes",
    lesson: 4.7,
  },
  "Dan Whitfield": {
    on: "2025-12-08",
    took: 8,
    role: "The retailer confirmed the role",
    work: "Two analysts reviewed three of his reports",
    document: "a passport",
    sample: "Scheduled reports",
    lesson: 4.6,
  },
  "Lucía Ferrer": {
    on: "2025-09-15",
    took: 15,
    role: "The health service confirmed the role",
    work: "Two analysts reviewed her rollout dashboard",
    document: "a national ID card",
    sample: "Cleaning survey data",
    lesson: 4.8,
  },
  "Kofi Mensah": {
    on: "2025-10-20",
    took: 10,
    role: "The streaming service confirmed the role",
    work: "Two engineers reviewed his cloud cost report",
    document: "a residence permit",
    sample: "Reading a cloud bill",
    lesson: 4.6,
  },
  "Hana Sato": {
    on: "2025-07-21",
    took: 9,
    role: "The grocer confirmed the role",
    work: "Two engineers reviewed two checkout audits",
    document: "a passport",
    sample: "Keyboard focus",
    lesson: 4.7,
  },
  "Rafael Costa": {
    on: "2025-12-01",
    took: 12,
    role: "The bank confirmed the role",
    work: "Two engineers reviewed his versioning rules",
    document: "a national ID card",
    sample: "Versioning an API",
    lesson: 4.7,
  },
  "Noor Aziz": {
    on: "2025-09-22",
    took: 11,
    role: "The foundry confirmed the role",
    work: "Two type designers reviewed a headline face",
    document: "a residence permit",
    sample: "Line length",
    lesson: 4.9,
  },
  "Inés Soler": {
    on: "2025-12-15",
    took: 13,
    role: "The regional government confirmed the role",
    work: "Two designers reviewed two of her services",
    document: "a national ID card",
    sample: "Accessible forms",
    lesson: 4.7,
  },
  "Sam Okafor": {
    on: "2025-10-13",
    took: 12,
    role: "Company filings show both sales",
    work: "Two founders reviewed his pricing model",
    document: "a passport",
    sample: "Unit economics",
    lesson: 4.8,
  },
  "Eva Brandt": {
    on: "2025-04-28",
    took: 10,
    role: "Both marketplaces confirmed the roles",
    work: "Two product leads reviewed her specs",
    document: "a national ID card",
    sample: "Writing a product brief",
    lesson: 4.6,
  },
  "Claire Dubois": {
    on: "2026-04-13",
    took: 14,
    role: "Her company's chair confirmed the role",
    work: "Two CFOs reviewed her fundraising model",
    document: "a national ID card",
    sample: "Burn rate",
    lesson: 4.7,
  },
};

export type Check = { title: string; text: string; date: string };

const DAY = 86_400_000;
const back = (iso: string, days: number) =>
  new Date(Date.parse(iso) - days * DAY).toISOString().slice(0, 10);

/** A record as the four rows it is read in, each dated: the identity check
 *  opens it, the sample lesson closes it on the day the badge went on, and
 *  the two between fall where they would in a check that took `took` days.
 *  Each line of evidence fits one line of the profile's card at 1280.
 *
 *  `named: false` leaves the sample lesson's title out of its row, for a
 *  page that prints the title beside the record already, as the profile's
 *  About does in its third card. */
export function checksOf(r: BadgeRecord, { named = true }: { named?: boolean } = {}): Check[] {
  const rated = named
    ? `Twenty learners rated “${r.sample}” ${r.lesson.toFixed(1)}`
    : `Twenty learners rated it ${r.lesson.toFixed(1)}`;
  return [
    { title: "Identity", text: `We matched ${r.document} over video`, date: back(r.on, r.took) },
    { title: "Current role", text: r.role, date: back(r.on, Math.round(r.took * 0.6)) },
    { title: "Work sample", text: r.work, date: back(r.on, Math.round(r.took * 0.25)) },
    { title: "Sample lesson", text: rated, date: r.on },
  ];
}
