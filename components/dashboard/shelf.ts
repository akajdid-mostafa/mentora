// The syllabus of every course, cut down to what the dashboard reads: each
// module's items with their kind, title and length. The page builds it on the
// server from `detail.ts`, so the browser never downloads the full syllabi,
// and hands over every course rather than the demo learner's four, because a
// course enrolled on in the checkout has to show here as well.

import type { LessonKind } from "@/components/course/detail";
import type { Progress } from "@/components/course/progress-seed";
import type { Line } from "@/components/course/lessons/types";

export type ShelfItem = {
  id: string;
  kind: LessonKind;
  title: string;
  minutes: number;
  questions?: number;
};
export type ShelfModule = { title: string; items: ShelfItem[] };
export type Shelf = Record<string, ShelfModule[]>;

/** The transcript lines of the lessons the seed has open, keyed
 *  `course:lesson`, so the first frame can quote the minute the learner
 *  stopped at. Any other lesson's lines load when they are needed. */
export type Lines = Record<string, Line[]>;

export type Standing = {
  modules: ShelfModule[];
  items: ShelfItem[];
  done: Set<string>;
  /** Items finished, of all of them. */
  finished: number;
  total: number;
  pct: number;
  complete: boolean;
  /** The item the player opens on next, and the module it is in. */
  current: ShelfItem;
  module: number;
  /** The second the current video stopped at. */
  at: number;
  /** The second every video of the course stopped at, for the marks of the
   *  ones begun and left. */
  seconds: Record<string, number>;
};

/** Where a learner stands in one course, read the way the player reads it:
 *  the item last opened if it is still in the syllabus, otherwise the first
 *  one not finished. */
export function standingOf(id: string, p: Progress, shelf: Shelf): Standing | null {
  const modules = shelf[id];
  if (!modules) return null;
  const items = modules.flatMap((m) => m.items);
  const done = new Set(p.done[id] ?? []);
  const finished = items.filter((i) => done.has(i.id)).length;
  const current =
    items.find((i) => i.id === p.last[id]) ?? items.find((i) => !done.has(i.id)) ?? items[0];
  return {
    modules,
    items,
    done,
    finished,
    total: items.length,
    pct: Math.round((finished / items.length) * 100),
    complete: finished === items.length,
    current,
    module: modules.findIndex((m) => m.items.includes(current)),
    at: p.at[id]?.[current.id] ?? 0,
    seconds: p.at[id] ?? {},
  };
}

/** The courses under way, the one opened most recently first, and the
 *  enrolment order where nothing has been opened yet. */
export function inProgress(p: Progress, shelf: Shelf) {
  return p.enrolled
    .map((id, order) => ({ id, order, standing: standingOf(id, p, shelf) }))
    .filter((x): x is { id: string; order: number; standing: Standing } =>
      Boolean(x.standing && !x.standing.complete),
    )
    .sort((a, b) => (p.opened?.[b.id] ?? 0) - (p.opened?.[a.id] ?? 0) || a.order - b.order);
}

/** The finished courses, most recently finished first. */
export function finishedCourses(p: Progress, shelf: Shelf) {
  return p.enrolled
    .filter((id) => standingOf(id, p, shelf)?.complete)
    .sort((a, b) => (p.finished[b] ?? "").localeCompare(p.finished[a] ?? ""));
}
