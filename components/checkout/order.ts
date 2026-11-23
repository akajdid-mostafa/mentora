// What is being bought, read from the address the rest of the site links
// with, and what it costs: the lines of the order card and the money under
// them. Pure functions, so the card, the form's last step and the receipt
// print one set of numbers.
//
// The links that arrive here:
//   /checkout?course=sql-for-analysis&start=2026-10-12   a course, from its page
//   /checkout?course=sql-for-analysis                     a course, self-paced
//   /checkout?plan=plus&path=data-analyst                 Plus, from a path
//   /checkout                                             Plus, from the pricing row
//
// Money is kept in cents, so a split into three payments or a 15% code never
// leaves a fraction of a cent for a rounding to lose.

import { courses, courseSlug, type Course } from "@/components/course/courses";
import { startsFor, type Start } from "@/components/course-page/start";
import { goals, pathSlug, type Goal } from "@/components/marketing/goals";
import { tiers } from "@/components/marketing/tiers";
import { discountOn, type Code, type Target } from "@/components/checkout/codes";
import { taxOn, type Country } from "@/components/checkout/tax";

export type Billing = "monthly" | "yearly";

/** The order as the address carries it. Every key is optional: an empty
 *  address is Plus by the month, which is where the pricing row's trial
 *  button lands. */
export type Query = {
  course?: string;
  start?: string;
  plan?: "plus";
  billing?: Billing;
  path?: string;
};

export function readQuery(p: Record<string, string>): Query {
  return {
    course: p.course || undefined,
    start: p.start || undefined,
    plan: p.plan === "plus" ? "plus" : undefined,
    billing: p.billing === "yearly" || p.billing === "monthly" ? p.billing : undefined,
    path: p.path || undefined,
  };
}

/** The address for an order, keys in the order the site's links write them,
 *  so a link read and written again is the same link. */
export function writeQuery(q: Query) {
  const s = new URLSearchParams();
  if (q.course) s.set("course", q.course);
  if (q.start) s.set("start", q.start);
  if (q.plan) s.set("plan", q.plan);
  if (q.billing) s.set("billing", q.billing);
  if (q.path) s.set("path", q.path);
  const out = s.toString();
  return out ? `?${out}` : "";
}

export type Order =
  | { kind: "course"; course: Course; start: Start; starts: Start[] }
  | { kind: "plus"; billing: Billing; course?: Course; path?: Goal }
  | { kind: "missing"; slug: string };

export const courseBySlug = (slug?: string) =>
  slug ? courses.find((c) => courseSlug(c) === slug) : undefined;
export const pathBySlug = (slug?: string) =>
  slug ? goals.find((g) => pathSlug(g) === slug) : undefined;

/** The order the address names, on `today` ("YYYY-MM-DD"), which is what the
 *  cohorts on offer are counted from. A start the course no longer offers, or
 *  a cohort that has filled, falls back to starting today at your own pace. */
export function orderOf(q: Query, today: string): Order {
  const course = courseBySlug(q.course);
  if (q.plan === "plus" || !q.course) {
    return { kind: "plus", billing: q.billing ?? "monthly", course, path: pathBySlug(q.path) };
  }
  if (!course) return { kind: "missing", slug: q.course };
  const starts = startsFor(course, today);
  const asked = starts.find((s) => s.key === q.start);
  const open = asked && (asked.kind === "self" || asked.left > 0) ? asked : starts[0];
  return { kind: "course", course, start: open, starts };
}

/** What a code on this order is judged against. */
export const targetOf = (o: Order): Target =>
  o.kind === "plus" ? (o.billing === "yearly" ? "plus-yearly" : "plus-monthly") : "course";

const plus = tiers[1];

/** The price of what is in the order, in cents: the course, or Plus for the
 *  period picked, which is what the first charge after the trial is. */
export const priceOf = (o: Order) =>
  o.kind === "course" ? o.course.price * 100 : o.kind === "plus" ? (o.billing === "yearly" ? plus.yearly : plus.monthly) * 100 : 0;

/** Every order the demo sells is paid for, except a free course. */
export const isPaid = (o: Order) => priceOf(o) > 0;

/** Three payments are offered on a course from this price up, in cents. */
export const SPLIT_FROM = 6000;
export const canSplit = (o: Order) => o.kind === "course" && priceOf(o) >= SPLIT_FROM;

/** Plus is free for its first week; the first charge falls on the eighth day. */
export const TRIAL_DAYS = 7;

const DAY = 86_400_000;
const at = (key: string) => new Date(`${key}T12:00:00Z`);
const keyOf = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (key: string, n: number) => keyOf(new Date(at(key).getTime() + n * DAY));

/** The same day `n` months on, or that month's last day when it is shorter. */
export function addMonths(key: string, n: number) {
  const [y, m, d] = key.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1 + n, 1, 12));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0, 12)).getUTCDate();
  first.setUTCDate(Math.min(d, last));
  return keyOf(first);
}

/** An amount split in three whole cents, the odd cents all on the first, so
 *  the three add back up to the amount exactly and the two still to come are
 *  one figure: "then $29.66 on Oct 29 and Nov 29". */
export function thirds(cents: number) {
  const base = Math.floor(cents / 3);
  return [cents - base * 2, base, base];
}

export type Totals = {
  price: number;
  discount: number;
  tax: number;
  /** What the order comes to: the course, or the first charge of Plus. */
  total: number;
  /** What leaves the card today. */
  today: number;
  /** The three payments and their days, when the course is paid in three. */
  schedule?: { key: string; cents: number }[];
  /** The day the trial ends and the first charge is taken, on Plus. */
  charge?: string;
};

export function totalsOf(
  o: Order,
  { code, country, split, today }: { code: Code | null; country: Country; split: boolean; today: string },
): Totals {
  const price = priceOf(o);
  const discount = code ? discountOn(price, code) : 0;
  const tax = taxOn(price - discount, country);
  const total = price - discount + tax;
  if (o.kind === "plus") {
    return { price, discount, tax, total, today: 0, charge: addDays(today, TRIAL_DAYS) };
  }
  if (split && canSplit(o)) {
    const schedule = thirds(total).map((cents, i) => ({ key: addMonths(today, i), cents }));
    return { price, discount, tax, total, today: schedule[0].cents, schedule };
  }
  return { price, discount, tax, total, today: total };
}

/** "$89.00", "$0.00", "−$13.35": the order card and the receipt set money to
 *  the cent, where the rest of the site prints whole dollars. */
export function money(cents: number) {
  const sign = cents < 0 ? "−" : "";
  return `${sign}$${(Math.abs(cents) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
