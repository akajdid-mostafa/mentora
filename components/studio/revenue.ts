// What Ana's four courses earned, month by month, for the studio's overview
// and its revenue section. Counted in things that happen, sales, minutes of
// Plus watched and learners who enrolled, and turned into money through the
// same split the /teach calculator uses, so the studio and the page that
// promised it cannot disagree.
//
// The twelve months end with the one the visitor opens the page in, counted
// back from today, as the dashboard's study log is: the demo never opens on a
// chart that stopped last year. The month under way is counted to date.
//
// Mock data. A buyer's payouts come from their payment provider; the shape
// below is what the studio draws from them.

import { courseById, type Course } from "@/components/course/courses";
import { PAYDAY, PLUS_RATE, SHARE } from "@/components/teach/earnings";

/** Ana's courses, in the order of what they earn. Dashboards people act on
 *  is free, so it brings learners and no money. */
export const COURSES = ["c1", "c14", "c33", "c3"] as const;
export type CourseId = (typeof COURSES)[number];

// Each series runs oldest first, twelve months, the last the month under way
// at the pace it has kept so far. Pandas and NumPy opened five months ago.
const SALES: Record<CourseId, number[]> = {
  c1: [70, 74, 62, 88, 84, 80, 78, 76, 72, 81, 86, 92],
  c14: [44, 46, 38, 58, 55, 52, 50, 49, 47, 51, 55, 58],
  c33: [0, 0, 0, 0, 0, 0, 0, 24, 38, 44, 49, 52],
  c3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

// Minutes of Plus watched on each paid course. A free course's minutes are
// not paid for, so it has none here.
const PLUS: Record<CourseId, number[]> = {
  c1: [27000, 29000, 24500, 32500, 31500, 30500, 29500, 29500, 30000, 30500, 31500, 32000],
  c14: [21000, 22500, 19500, 26000, 25500, 25000, 24500, 23500, 23500, 23500, 24000, 24500],
  c33: [0, 0, 0, 0, 0, 0, 0, 2000, 3000, 4000, 4500, 5000],
  c3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const LEARNERS: Record<CourseId, number[]> = {
  c1: [1050, 1120, 980, 1310, 1260, 1200, 1170, 1150, 1100, 1180, 1240, 1290],
  c14: [610, 640, 560, 780, 750, 720, 700, 690, 660, 700, 740, 770],
  c33: [0, 0, 0, 0, 0, 0, 0, 240, 320, 350, 380, 400],
  c3: [380, 400, 350, 460, 450, 430, 420, 410, 400, 420, 440, 460],
};

// What Plus paid for a minute, month by month. Last month's is the rate
// /teach quotes; the month under way is estimated at it until it closes.
const RATES = [0.039, 0.04, 0.041, 0.038, 0.039, 0.04, 0.04, 0.041, 0.041, 0.042, PLUS_RATE, PLUS_RATE];

export type Month = {
  /** "2026-09". */
  key: string;
  short: string;
  long: string;
  /** How much of the month has gone by: 1 once it has closed. */
  run: number;
  rate: number;
  sales: Record<CourseId, number>;
  minutes: Record<CourseId, number>;
  learners: Record<CourseId, number>;
  /** Earned from sales and from Plus, by course, in dollars. */
  fromSales: Record<CourseId, number>;
  fromPlus: Record<CourseId, number>;
  /** For the month under way, what it comes to at the pace so far. */
  pace?: number;
};

const cents = (n: number) => Math.round(n * 100) / 100;
const course = (id: CourseId) => courseById(id) as Course;
/** The instructor's part of one sale of a course. */
export const perSale = (id: CourseId) => cents(course(id).price * SHARE);

/** The twelve months up to the one `today` falls in, oldest first. */
export function monthsOf(today: string): Month[] {
  const [y, m, d] = today.split("-").map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(Date.UTC(y, m - 1 - (11 - i), 1));
    const open = i === 11;
    const run = open ? d / days : 1;
    const by = (series: Record<CourseId, number[]>, round: (n: number) => number) =>
      Object.fromEntries(COURSES.map((c) => [c, round(series[c][i] * run)])) as Record<CourseId, number>;
    const sales = by(SALES, Math.round);
    const minutes = by(PLUS, (n) => Math.round(n / 50) * 50);
    const learners = by(LEARNERS, Math.round);
    const fromSales = Object.fromEntries(COURSES.map((c) => [c, cents(sales[c] * perSale(c))])) as Record<CourseId, number>;
    const fromPlus = Object.fromEntries(COURSES.map((c) => [c, cents(minutes[c] * RATES[i])])) as Record<CourseId, number>;
    const month: Month = {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`,
      short: date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      long: date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
      run,
      rate: RATES[i],
      sales,
      minutes,
      learners,
      fromSales,
      fromPlus,
    };
    if (open) {
      const full = COURSES.reduce((n, c) => n + SALES[c][i] * perSale(c) + PLUS[c][i] * RATES[i], 0);
      month.pace = cents(full);
    }
    return month;
  });
}

const sum = (r: Record<CourseId, number>, only?: CourseId) =>
  cents(only ? r[only] : COURSES.reduce((n, c) => n + r[c], 0));

/** What a month came to, for one course or all four. */
export function totalOf(m: Month, only?: CourseId) {
  const sales = sum(m.fromSales, only);
  const plus = sum(m.fromPlus, only);
  return {
    sales,
    plus,
    total: cents(sales + plus),
    units: sum(m.sales, only),
    minutes: sum(m.minutes, only),
    learners: sum(m.learners, only),
  };
}

/** The month the next payout covers: on or before the 15th it is last
 *  month's, closed; after it, this month's, still counting. */
export function payoutMonth(months: Month[], today: string) {
  const day = Number(today.slice(8, 10));
  return day <= PAYDAY ? months[10] : months[11];
}

/** A statement as a spreadsheet opens it: one row a course, then the total. */
export function statementCsv(m: Month) {
  const head = ["Course", "Sales", "Your part a sale", "From sales", "Plus minutes", "Rate a minute", "From Plus", "Total"];
  const rows = COURSES.map((c) => [
    course(c).title,
    m.sales[c],
    perSale(c).toFixed(2),
    m.fromSales[c].toFixed(2),
    m.minutes[c],
    m.rate.toFixed(3),
    m.fromPlus[c].toFixed(2),
    cents(m.fromSales[c] + m.fromPlus[c]).toFixed(2),
  ]);
  const t = totalOf(m);
  rows.push(["All courses", t.units, "", t.sales.toFixed(2), t.minutes, m.rate.toFixed(3), t.plus.toFixed(2), t.total.toFixed(2)]);
  const cell = (v: string | number) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [head, ...rows].map((r) => r.map(cell).join(",")).join("\n");
}

export const courseTitle = (id: CourseId) => course(id).title;
export const courseOf = course;
