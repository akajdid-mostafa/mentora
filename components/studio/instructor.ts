// The instructor the studio belongs to. Ana teaches four courses and has a
// public profile, which is what the studio's first door leads to. One place,
// so a buyer renames the studio's owner once.

import { courses, teacherHref, teacherStats, teachers, type Teacher } from "@/components/course/courses";

const NAME = "Ana Reyes";

const person = teachers.find((t) => t.name === NAME) as Teacher;
const stats = teacherStats(NAME);

export const instructor = {
  name: person.name,
  first: person.name.split(" ")[0],
  trade: person.trade,
  portrait: person.portrait,
  href: teacherHref(person.name),
  rating: stats.rating,
  learners: stats.learners,
  /** Every rating left across the instructor's courses. */
  ratings: courses.filter((c) => c.instructor === NAME).reduce((n, c) => n + c.reviews, 0),
};
