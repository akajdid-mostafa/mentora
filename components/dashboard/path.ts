// Which path the dashboard follows, and where the learner stands on it, read
// off the same two records the path's own page reads: the progress store for
// each leg's course and the path choices for the pace and the courses marked
// as known.

import type { Progress } from "@/components/course/progress-seed";
import { goals, type Goal } from "@/components/marketing/goals";
import type { PathChoices } from "@/components/paths/store";
import type { Standing as LegStanding } from "@/components/paths/plan";
import { standingOf, type Shelf } from "@/components/dashboard/shelf";

/** Each leg's course as the learner stands on it: the share finished, and
 *  whether they are enrolled. */
export function legStanding(g: Goal, p: Progress, shelf: Shelf): LegStanding {
  return g.legs.map((l) => {
    const s = standingOf(l.course, p, shelf);
    return { done: s ? s.finished / s.total : 0, enrolled: p.enrolled.includes(l.course) };
  });
}

/** The path the learner is on: of the paths they kept, the one holding most
 *  of the courses they enrolled on, the first kept one where none holds any. */
export function pathOf(p: Progress, choices: PathChoices): Goal | null {
  const kept = goals.filter((g) => choices.saved.includes(g.id));
  if (!kept.length) return null;
  const held = (g: Goal) => g.legs.filter((l) => p.enrolled.includes(l.course)).length;
  return [...kept].sort((a, b) => held(b) - held(a))[0];
}
