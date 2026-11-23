// Row 7's four instructors, shared with the header's search and with row 3,
// whose lesson one of them teaches. The avatar is a Lummi id rather than a
// file: faces never
// ship inside a template that is sold, so they are hotlinked and the remote
// host is allowed in `next.config.ts`.
//
// `field` maps each one onto a subject, so the chip on a teacher's card and the lid on their course's
// card carry the same hue.

import { figure, teacherStats } from "@/components/course/courses";

export type Instructor = {
  name: string;
  /** The role and the field it is practised in. Row 7 sets it on one line,
   *  and the narrowest card is 185px inside at 14px, so about 28 characters. */
  trade: string;
  field: "Data" | "Engineering" | "Design" | "Business";
  /** Worked out from the catalogue in courses.ts, so the card, the hero's
   *  plate and the course page all print the same two figures. */
  rating: number;
  learners: string;
  teaches: string[];
  id: string;
};

// How many instructors each field holds in the whole directory. Row 7's Field
// select prints them beside its options, and the four add up to the 3,100
// verified instructors on the proof strip, which is what "Every field" shows.
export const directory: Record<Instructor["field"], number> = {
  Data: 740,
  Engineering: 1120,
  Design: 560,
  Business: 680,
};

// A teacher's two figures, off their courses rather than typed: every learner
// across them, and the rating weighted by how many learners left one.
const stats = (name: string) => {
  const t = teacherStats(name);
  return { rating: t.rating, learners: figure(t.learners) };
};

export const instructors: Instructor[] = [
  {
    name: "Ana Reyes",
    field: "Data",
    trade: "Data lead · fintech",
    ...stats("Ana Reyes"),
    teaches: ["SQL for analysis", "Dashboards people act on"],
    id: "QmeMZG4MBNSedvw1VKfvSaa4gtvjT5ZrQFj9UWxyFL7ubm",
  },
  {
    name: "Priya Raman",
    field: "Business",
    trade: "Quant · trading desk",
    ...stats("Priya Raman"),
    teaches: ["Financial modeling", "Pricing what you build"],
    id: "QmesJxZ78A5iXStQ9G1KXZNcwLo4SfwTc36uyM6SJbxfVy",
  },
  {
    name: "Tomás Oliveira",
    field: "Engineering",
    trade: "Staff engineer · payments",
    ...stats("Tomás Oliveira"),
    teaches: ["Python beyond scripts", "Relational data modeling"],
    id: "QmRBa7eL2PP6veUJvczAYFSeuvU3J4yakpXJDaxppaJUbP",
  },
  {
    name: "Mara Lindqvist",
    field: "Design",
    trade: "Design director · systems",
    ...stats("Mara Lindqvist"),
    teaches: ["Interface fundamentals", "Design systems in practice"],
    id: "QmSsEjkNCgfH2SxvNAW27fN9gG6LFGVpQMfn3utW1NNbHb",
  },
];
