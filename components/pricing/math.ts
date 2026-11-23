// The pricing page's arithmetic: what each plan costs at the page's billing,
// the calculator's year month by month, and a team's quote. The prices
// themselves stay in `components/marketing/tiers.ts`, the one list the home
// page's plans read too, so the two pages cannot quote different numbers.

import { tiers, yearlySaving } from "@/components/marketing/tiers";

export { yearlySaving };

export const [perCourse, plus, teams] = tiers;

// In the page's own locale, never the reader's: a Vietnamese browser prints
// $1,068 as $1.068.
export const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: Number.isInteger(n) ? 0 : 2, minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}`;

/** A yearly price as a month of it, to the cent: $290 is $24.17. */
export const perMonth = (yearly: number) => Math.round((yearly / 12) * 100) / 100;

/** Plus for a year at the billing chosen: twelve months, or the one charge. */
export const plusYear = (yearly: boolean) => (yearly ? plus.yearly : plus.monthly * 12);

/** Where /checkout opens Plus: the month by default, the year when asked. */
export const plusHref = (yearly: boolean) => (yearly ? "/checkout?billing=yearly" : "/checkout");

// ---------------------------------------------------------------------------
// The calculator

export const MONTHS = 12;

/** The month each course is bought in, counted from 1: one as each is
 *  started, spread evenly over the year. Four courses land in months 1, 4, 7
 *  and 10 — bought as they are begun, not all on the first day, which is how
 *  a person paying course by course actually pays. */
export function buyMonths(courses: number) {
  return Array.from({ length: courses }, (_, k) => Math.floor((k * MONTHS) / courses) + 1);
}

export type MonthRow = { month: number; single: number; plus: number };

/** What each way of paying has cost by the end of every month: course by
 *  course as they are started, and Plus by the month or in one charge. */
export function yearOf(courses: number, spend: number, yearly: boolean): MonthRow[] {
  const bought = buyMonths(courses);
  return Array.from({ length: MONTHS }, (_, i) => {
    const month = i + 1;
    return {
      month,
      single: bought.filter((m) => m <= month).length * spend,
      plus: yearly ? plus.yearly : plus.monthly * month,
    };
  });
}

export type Verdict = {
  single: number;
  plus: number;
  plusWins: boolean;
  /** How much the cheaper way keeps in the visitor's pocket over the year. */
  saving: number;
  /** The first month from which Plus has cost less and stays that way, or
   *  null when buying course by course is cheaper at the year's end. */
  overtakes: number | null;
  /** What one course works out at on Plus. */
  perCourseOnPlus: number;
};

export function verdictOf(courses: number, spend: number, yearly: boolean): Verdict {
  const rows = yearOf(courses, spend, yearly);
  const end = rows[rows.length - 1];
  const plusWins = end.plus < end.single;
  let overtakes: number | null = null;
  if (plusWins) {
    for (let i = rows.length - 1; i >= 0 && rows[i].plus < rows[i].single; i--) overtakes = rows[i].month;
  }
  return {
    single: end.single,
    plus: end.plus,
    plusWins,
    saving: Math.abs(end.single - end.plus),
    overtakes,
    perCourseOnPlus: Math.round((end.plus / courses) * 100) / 100,
  };
}

/** Axis stops for a chart topping out at `max`: about five, on a round
 *  step, with a third again of headroom so the reading's pill over the
 *  tallest bar stays inside the plot. */
export function axisOf(max: number) {
  const room = max * 1.35;
  const steps = [50, 100, 200, 250, 500, 1000];
  const step = steps.find((s) => room / s <= 5) ?? 1000;
  const top = Math.max(step, Math.ceil(room / step) * step);
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

// ---------------------------------------------------------------------------
// Teams

/** From this many seats a named contact prices the contract. */
export const QUOTE_FROM = 100;

export function teamOf(seats: number, yearly: boolean) {
  const seat = yearly ? teams.yearly : teams.monthly;
  const total = seats * seat;
  const monthlyYear = seats * teams.monthly * 12;
  return {
    seat,
    total,
    /** A year at this price, and what paying yearly saves on it. */
    year: yearly ? total : monthlyYear,
    savedByYear: monthlyYear - seats * teams.yearly,
  };
}
