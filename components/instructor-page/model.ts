// What a teacher's profile page works out on the server from the data the rest
// of the site already holds: whose page a slug opens, their reviews gathered
// from every course they teach, and the spread of their stars. No markup, and
// nothing here is typed twice: a course's rating and its reviews are the ones
// its own page prints. The cohorts are worked out in cohorts.ts, which the
// browser reads too, since a date there follows the visitor's calendar.

import { courseHref, type Course } from "@/components/course/courses";
import { spread } from "@/components/course/detail";
import { reviewsOf, type Review } from "@/components/course/reviews";
import { roster, type Entry } from "@/components/instructors/directory";
import { slugify } from "@/lib/utils";

export const entryBySlug = (slug: string) => roster.find((e) => slugify(e.name) === slug);

export const firstName = (name: string) => name.split(" ")[0];

/** A review as the profile lists it, with the course it was left on: its
 *  title and page, which is all the list prints of it. */
export type TeacherReview = Review & { course: { id: string; title: string; href: string } };

/** Every review the teacher's courses list, each once. The courses in one
 *  subject draw on one pool, so the same learner can stand on two of them; a
 *  review goes with the course where it stands highest in the list, the one
 *  a visitor to that course reads first. Most helpful first. */
export function reviewsFor(e: Entry): TeacherReview[] {
  const best = new Map<string, { review: Review; course: Course; rank: number }>();
  for (const course of e.courses) {
    reviewsOf(course).forEach((review, rank) => {
      const held = best.get(review.name);
      if (!held || rank < held.rank) best.set(review.name, { review, course, rank });
    });
  }
  return [...best.values()]
    .map(({ review, course }) => ({
      ...review,
      course: { id: course.id, title: course.title, href: courseHref(course) },
    }))
    .sort((a, b) => b.helpful - a.helpful || a.weeks - b.weeks);
}

/** The teacher's stars across every course, each course's spread counted by
 *  its reviews, as whole percentages adding to 100. */
export function spreadFor(e: Entry) {
  const counts = [5, 4, 3, 2, 1].map((stars) =>
    e.courses.reduce((n, c) => n + (spread(c).find((s) => s.stars === stars)?.count ?? 0), 0),
  );
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const raw = counts.map((n) => (n / total) * 100);
  const pct = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; k < 100 - pct.reduce((a, b) => a + b, 0); k++) pct[order[k][1]] += 1;
  return pct.map((p, i) => ({ stars: 5 - i, pct: p, count: counts[i] }));
}
