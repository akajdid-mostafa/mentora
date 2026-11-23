// The arithmetic behind a path's page: what is left of each leg, the weeks it
// takes at the reader's pace, the day the last one ends and what the rest
// costs. Pure functions of the path and the learner's record, so the page,
// its planner and its schedule agree without passing a result around.
//
// Dates are "YYYY-MM-DD" keys read back at noon UTC, as the course page's
// start rows keep theirs, so a date never slips a day between the server's
// clock and the visitor's.

import type { Progress } from "@/components/course/progress-seed";
import { tiers } from "@/components/marketing/tiers";
import type { Goal } from "@/components/marketing/goals";

export type LegState = "known" | "done" | "active" | "open";

/** One leg as the learner stands on it. */
export type LegPlan = {
  state: LegState;
  /** Share of the course's syllabus items finished, 0 to 1. */
  done: number;
  /** Hours still to go, after what is finished or marked as known. */
  left: number;
  /** The weeks of the schedule this leg runs across; none once it is off it. */
  weeks: { from: number; to: number } | null;
};

export type Plan = {
  legs: LegPlan[];
  /** Every hour the path holds, and the ones still ahead. */
  total: number;
  left: number;
  weeks: number;
  finish: string;
};

/** What the learner's record says about each leg's course. */
export type Standing = { done: number; enrolled: boolean }[];

/** The learner's record read onto a path's legs: whether each course is
 *  bought, and the share of its syllabus items finished, `items` being each
 *  leg's count. The path's own page and its card under "More paths" read it
 *  the same way, so the two never quote different weeks. */
export function standingOf(g: Goal, record: Pick<Progress, "enrolled" | "done">, items: number[]): Standing {
  return g.legs.map((l, i) => ({
    enrolled: record.enrolled.includes(l.course),
    done: Math.min(1, (record.done[l.course]?.length ?? 0) / items[i]),
  }));
}

const DAY = 86_400_000;
const at = (key: string) => new Date(`${key}T12:00:00Z`);
export const addDays = (key: string, days: number) =>
  new Date(at(key).getTime() + days * DAY).toISOString().slice(0, 10);

export function planOf(g: Goal, standing: Standing, known: string[], perWeek: number, today: string): Plan {
  let before = 0;
  const legs = g.legs.map((leg, i): LegPlan => {
    const { done, enrolled } = standing[i] ?? { done: 0, enrolled: false };
    const state: LegState = known.includes(leg.course)
      ? "known"
      : done >= 1
        ? "done"
        : enrolled
          ? "active"
          : "open";
    const left = state === "known" || state === "done" ? 0 : Math.round(leg.hours * (1 - done));
    if (!left) return { state, done, left, weeks: null };
    // a leg starts in the week the one before it ended in, the way a real
    // week is shared between two courses
    const from = Math.floor(before / perWeek) + 1;
    before += left;
    return { state, done, left, weeks: { from, to: Math.max(from, Math.ceil(before / perWeek)) } };
  });
  const weeks = Math.ceil(before / perWeek);
  return {
    legs,
    total: g.legs.reduce((n, l) => n + l.hours, 0),
    left: before,
    weeks,
    finish: addDays(today, weeks * 7),
  };
}

const plus = tiers[1];

/** What the legs still ahead cost on Plus at this pace, against buying the
 *  courses not yet owned one by one. Plus is billed by the month the path
 *  runs, so its price moves with the slider and the other one does not. A
 *  free course is never bought, so it is never counted. */
export function costOf(prices: number[], plan: Plan, standing: Standing) {
  const months = plan.weeks ? Math.max(1, Math.ceil((plan.weeks * 7) / 30.44)) : 0;
  const ahead = plan.legs.flatMap((l, i) => (l.state === "active" || l.state === "open" ? [i] : []));
  const toBuy = ahead.filter((i) => !standing[i]?.enrolled && prices[i] > 0);
  return {
    months,
    plus: months * plus.monthly,
    separately: toBuy.reduce((n, i) => n + prices[i], 0),
    buying: toBuy.length,
    /** Whether every leg ahead is still to be bought: none owned, none free. */
    all: toBuy.length === ahead.length,
  };
}

const long = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const short = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "January 18, 2027" */
export const longDate = (key: string) => long.format(at(key));
/** "Jan 18, 2027": a finish is set whole, with its year, wherever it shows. */
export const shortDate = (key: string) => short.format(at(key));
