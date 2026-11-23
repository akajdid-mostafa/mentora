// The search the hero and the header carry: the suggestions it offers for
// what has been typed so far, read off the course catalogue itself, so a
// suggestion is always a course the catalogue page can show when the search
// is sent there. How the field behaves is `useCombobox`'s, in
// components/search/.
//
// The markup is deliberately not here. The field's size, its place in the
// column and whether it sits under a centred headline or beside one belong to
// the section; the strings belong to whoever is editing the copy.

import { courseHref, courses, matchesQuery } from "@/components/course/courses";

/** A suggested course, and where taking it goes: the course's own page. */
export type Suggestion = { id: string; title: string; credential: string; by: string; href: string };

// Most enrolled first, so the first letters somebody types surface the
// courses most learners chose.
const byLearners = [...courses].sort((a, b) => b.learners - a.learners);

/** Up to five courses for what has been typed so far. */
export const suggest = (query: string): Suggestion[] =>
  query.trim()
    ? byLearners
        .filter((c) => matchesQuery(c, query))
        .slice(0, 5)
        .map((c) => ({ id: c.id, title: c.title, credential: c.credential, by: c.instructor, href: courseHref(c) }))
    : [];

// Each topic opens the catalogue already narrowed to it: a subject the
// catalogue files courses under goes in as a filter, anything else as a
// search.
export const topics = [
  { label: "Python", accent: "bg-iris", href: "/courses?q=python" },
  { label: "Data analysis", accent: "bg-sky", href: "/courses?topic=data" },
  { label: "Product design", accent: "bg-coral", href: "/courses?topic=design" },
  { label: "Machine learning", accent: "bg-leaf", href: "/courses?q=machine+learning" },
  { label: "Finance", accent: "bg-sun", href: "/courses?q=finance" },
];

export const proof = "12,400 courses · 3,100 verified instructors";
