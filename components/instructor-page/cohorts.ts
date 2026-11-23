// The cohorts a teacher runs in the weeks ahead, across every course that has
// them. Kept apart from model.ts because the browser works these out again on
// the visitor's own calendar, as the course page's start rows do, and it should
// not have to load every syllabus and review pool to do it.

import type { Course } from "@/components/course/courses";
import { cohorts, startsFor } from "@/components/course-page/start";

export type Cohort = {
  course: Course;
  /** The course's start key, which the checkout reads. */
  key: string;
  starts: string;
  ends: string;
  seats: number;
  left: number;
};

/** The cohorts of every course the teacher runs them on, in the order they
 *  start, and on one day the course more learners have taken first. The
 *  dates and seats are the ones the course page's start rows show. */
export function cohortsFor(taught: Course[], today: string): Cohort[] {
  return taught
    .filter(cohorts)
    .flatMap((course) =>
      startsFor(course, today).flatMap((s) =>
        s.kind === "cohort"
          ? [{ course, key: s.key, starts: s.starts, ends: s.ends, seats: s.seats, left: s.left }]
          : [],
      ),
    )
    .sort((a, b) => a.starts.localeCompare(b.starts) || b.course.learners - a.course.learners);
}
