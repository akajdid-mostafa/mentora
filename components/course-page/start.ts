// When a course can start, worked out from today: at the learner's own pace
// from today, or with a cohort on a Monday. A cohort runs the course's weeks
// with a live review of the week's work on Thursdays and a finish date it
// keeps; the longer courses carry them, a short course or a guided project
// is self-paced only.
//
// Dates are kept as "YYYY-MM-DD" keys and read back at noon UTC, so a date
// never slips a day between the server's clock and the visitor's.

import { hash } from "@/lib/utils";
import type { Course } from "@/components/course/courses";

export type Start =
  | { kind: "self"; key: "self" }
  | { kind: "cohort"; key: string; starts: string; ends: string; seats: number; left: number };

export const SEATS = 30;

const DAY = 86_400_000;
const at = (key: string) => new Date(`${key}T12:00:00Z`);
const keyOf = (d: Date) => d.toISOString().slice(0, 10);
const plus = (key: string, days: number) => keyOf(new Date(at(key).getTime() + days * DAY));

/** The first Monday at least `min` days after `key`. */
function monday(key: string, min: number) {
  const d = at(plus(key, min));
  const ahead = (8 - d.getUTCDay()) % 7;
  return keyOf(new Date(d.getTime() + ahead * DAY));
}

export const cohorts = (c: Course) =>
  c.credential !== "Guided Project" && c.weeks >= 5;

/** Self-paced first, then the cohorts in date order. The first cohort is
 *  already full, so the list shows the state a sold-out row takes. */
export function startsFor(c: Course, today: string): Start[] {
  const self: Start = { kind: "self", key: "self" };
  if (!cohorts(c)) return [self];
  const h = hash(c.id);
  const first = monday(today, 1);
  const runs = [
    { starts: first, left: 0 },
    { starts: plus(first, 7), left: 3 + (h % 10) },
    { starts: plus(first, 35), left: 14 + (h % 12) },
  ];
  return [
    self,
    ...runs.map(({ starts, left }) => ({
      kind: "cohort" as const,
      key: starts,
      starts,
      // the Friday of the course's last week
      ends: plus(starts, c.weeks * 7 - 3),
      seats: SEATS,
      left,
    })),
  ];
}

/** The day a self-paced learner finishes at `perWeek` hours a week, if the
 *  course takes its planned weeks at its planned hours. */
export function finishAt(c: Course, today: string, perWeek: number) {
  const weeks = Math.ceil((c.weeks * c.hours) / perWeek);
  return { weeks, key: plus(today, weeks * 7) };
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" });
const long = fmt({ weekday: "short", day: "numeric", month: "short" });
const short = fmt({ day: "numeric", month: "short" });

/** "Mon, Oct 5" */
export const dayLabel = (key: string) => long.format(at(key));
/** "Oct 5" */
export const dateLabel = (key: string) => short.format(at(key));

/** Today in the visitor's own calendar, as a key. */
export function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
