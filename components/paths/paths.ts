// What a path's page says beyond the legs row 5 already plans: the photograph
// it is shown with, what a learner needs before the first course, and the three
// figures its certificate is weighed by. The legs, their order and their hours
// stay in `components/marketing/goals.ts`, so the planner on the home page and
// this page never hold two versions of one path.
//
// Every figure is Mentora's own, measured on its own learners, as the home
// page's outcome row says of its three.

import {
  courses,
  levels,
  type Course,
  type Level,
  type Topic,
} from "@/components/course/courses";
import { careers } from "@/components/marketing/credential";
import { goals, pathSlug, type Goal } from "@/components/marketing/goals";

export type Figure = { figure: string; label: string; note: string };

/** Where a photograph is held when a frame crops it, for a subject off its
 *  centre. The cards' 4:3 crops a 3:2 photograph's sides and the cover's 2:1
 *  its top and bottom, so each of these moves the one frame that crops it. */
export const photoFocus = { right: "object-[80%_50%]" } as const;

export type PathDetail = {
  /** The job the path ends in, at its desk or in a pair of hands, and never a
   *  face: an Unsplash photograph, by id. Faces on this site come from Lummi. */
  photo: string;
  focus?: keyof typeof photoFocus;
  /** What to bring to the first course, for "Before you start": three lines
   *  in its 224px column at xl, as the two notes beside it run. */
  needs: string;
  /** The three figures under the path's certificate, in one order on all
   *  four: what it pays, how many, and how many get there. A path's card
   *  under "More paths" shows the first and the last. */
  figures: Figure[];
};

const details: Record<string, PathDetail> = {
  analyst: {
    photo: "1712904322016-9c8f5aef351f",
    // the laptop sits right of centre, and its screen is the subject
    focus: "right",
    needs: "A spreadsheet you have filtered and totaled. No code: the first course starts at SELECT.",
    // the home page's outcome row measures this path, so it is quoted
    // rather than written twice
    figures: careers,
  },
  backend: {
    photo: "1617471346061-5d329ab9c574",
    needs: "Scripts in any language, and a terminal. The first course starts from a script and builds up.",
    figures: [
      { figure: "$118,000", label: "Median salary", note: "First backend role, reported by 960 graduates twelve months out." },
      { figure: "12,600", label: "Open roles", note: "Named these five skills in their posting, on the boards we track." },
      { figure: "64%", label: "Hired within a year", note: "Of those who finished all five courses and their projects." },
    ],
  },
  design: {
    photo: "1581291518633-83b4ebd1d83e",
    needs: "Opinions on the apps you use every day. The first course needs a notebook and five people.",
    figures: [
      { figure: "$102,000", label: "Median salary", note: "First product design role, reported by 610 graduates twelve months out." },
      { figure: "3,900", label: "Open roles", note: "Asked for research and a design system, on the boards we track." },
      { figure: "58%", label: "Hired within a year", note: "Of those who finished all five courses and their projects." },
    ],
  },
  founder: {
    photo: "1601572600427-697b5dd96b12",
    needs: "A problem you keep running into, and five people who share it. The spreadsheets start from sums.",
    figures: [
      { figure: "$38,000", label: "First-year revenue", note: "The median, reported by 420 founders twelve months after the path." },
      { figure: "140", label: "Customers at a year", note: "The median count of paying ones, reported by the founders themselves." },
      { figure: "74%", label: "Launched in a year", note: "A paid product with a price on it and at least one customer." },
    ],
  },
};

export const detailOf = (g: Goal) => details[g.id];

// Unsplash, free licence, hotlinked as the catalogue's photographs are until
// the packaging step decides whether the files ship. The id is the licence
// record. A path's photograph is its own rather than one of its courses', so
// it never stands beside the same picture on the first leg's card.
export const photoOf = (g: Goal) =>
  `https://images.unsplash.com/photo-${details[g.id].photo}?auto=format&fit=crop&w=1600&q=80`;

/** The object-position class a path's photograph is framed with, if any. */
export const focusOf = (g: Goal) => {
  const f = details[g.id].focus;
  return f && photoFocus[f];
};

export const findPath = (slug: string) => goals.find((g) => pathSlug(g) === slug);

/** The courses a path is made of, in its order. */
export const coursesOf = (g: Goal): Course[] =>
  g.legs.map((l) => courses.find((c) => c.id === l.course) as Course);

/** The subject most of a path's courses are filed under, whose hue and glyph
 *  the path wears, as a course wears its own. */
export function topicOf(g: Goal): Topic {
  const tally = new Map<Topic, number>();
  for (const c of coursesOf(g)) tally.set(c.topic, (tally.get(c.topic) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** "Beginner to Intermediate": the easiest course a path holds to the
 *  hardest, or one word where they share a level. */
export function levelSpan(g: Goal) {
  const held = coursesOf(g).map((c) => levels.indexOf(c.level));
  const low: Level = levels[Math.min(...held)];
  const high: Level = levels[Math.max(...held)];
  return low === high ? low : `${low} to ${high}`;
}

/** Everyone who teaches on a path, the one with the most legs first. */
export function teachersOf(g: Goal) {
  const tally = new Map<string, number>();
  for (const c of coursesOf(g)) tally.set(c.instructor, (tally.get(c.instructor) ?? 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}
