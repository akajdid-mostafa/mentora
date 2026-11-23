// What each lesson hands out, as files written in the browser: the lesson's
// transcript, the learner's notes on it and, on SQL for analysis, the slice
// of the course's dataset every lesson queries and the schema it sits in.
// The rows are worked out rather than typed, from a hash, so they come out the
// same on every download.

import type { Course } from "@/components/course/courses";
import type { Lesson } from "@/components/course/detail";
import type { Line } from "@/components/course/lessons/types";
import { clock, learnCopy } from "@/components/learn/copy";
import type { Note } from "@/components/learn/notes";
import type { Resource } from "@/components/learn/resources";
import { hash, slugify } from "@/lib/utils";

export function filesFor({
  course,
  lesson,
  lines,
  notes,
}: {
  course: Course;
  lesson: Lesson;
  lines?: Line[];
  notes: Note[];
}): Resource[] {
  const base = `${slugify(course.title)}-${lesson.id.replace(".", "-")}`;
  const files: Resource[] = [];

  if (lines?.length) {
    files.push({
      name: `${base}-transcript.txt`,
      about: learnCopy.resources.transcript,
      kind: "text",
      type: "text/plain",
      body: () => transcriptText(course, lesson, lines),
    });
  }
  if (notes.length) {
    files.push({
      name: `${base}-notes.md`,
      about: learnCopy.resources.notes,
      kind: "text",
      type: "text/markdown",
      body: () =>
        [
          `# ${course.title}, lesson ${lesson.id}: notes`,
          "",
          ...[...notes].sort((a, b) => a.at - b.at).map((n) => `- **${clock(n.at)}** ${n.text}`),
          "",
        ].join("\n"),
    });
  }
  if (course.id === "c1") files.push(...sqlFiles);
  return files;
}

export function transcriptText(course: Course, lesson: Lesson, lines: Line[]) {
  return [
    `${course.title} · Lesson ${lesson.id}`,
    lesson.title,
    `${course.instructor}`,
    "",
    ...lines.map((l) => `[${clock(l.at)}] ${l.text}`),
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// SQL for analysis: the dataset the whole course runs on
// ---------------------------------------------------------------------------

const cities = ["Leeds", "Porto", "Austin", "Lyon", "Denver", "Seville", "Toronto", "Utrecht"];
const people = [
  "Maya Ortiz", "Jonah Pike", "Aiko Mori", "Tariq Haddad", "Lena Vogel", "Owen Blake",
  "Priti Shah", "Marco Ricci", "Zoe Adler", "Kwame Asante", "Elif Demir", "Nora Quinn",
  "Rui Santos", "Hanna Berg", "Luis Navarro",
];
// The three who signed up and never ordered: lesson 4.2's inner join drops them.
const never = new Set([7, 11, 14]);

const customers = people.map((name, i) => ({
  id: i + 1,
  name,
  city: cities[hash(name) % cities.length],
  signup: day(20 + ((hash(`${name}signup`) % 300) - 300)),
}));

const statuses = ["paid", "paid", "paid", "shipped", "shipped", "refunded"];
const buyers = customers.filter((c) => !never.has(c.id));
const orders = Array.from({ length: 40 }, (_, i) => {
  const h = hash(`order${i}`);
  return {
    id: 10001 + i,
    customer: buyers[h % buyers.length].id,
    date: day(i * 2 + (h % 2)),
    status: statuses[h % statuses.length],
    total: ((1250 + (h % 46750)) / 100).toFixed(2),
  };
});

/** A date so many days after the first of January 2026. */
function day(n: number) {
  const d = new Date(Date.UTC(2026, 0, 1 + n));
  return d.toISOString().slice(0, 10);
}

const sqlFiles: Resource[] = [
  {
    name: "orders-sample.csv",
    about: "40 rows of the orders table",
    kind: "table",
    type: "text/csv",
    body: () =>
      [
        "order_id,customer_id,order_date,status,total",
        ...orders.map((o) => `${o.id},${o.customer},${o.date},${o.status},${o.total}`),
        "",
      ].join("\n"),
  },
  {
    name: "customers-sample.csv",
    about: "15 customers, three who never ordered",
    kind: "table",
    type: "text/csv",
    body: () =>
      [
        "customer_id,name,city,signup_date",
        ...customers.map((c) => `${c.id},${c.name},${c.city},${c.signup}`),
        "",
      ].join("\n"),
  },
  {
    name: "schema.sql",
    about: "The four tables every lesson queries",
    kind: "code",
    type: "application/sql",
    body: () =>
      `-- SQL for analysis: the retail dataset every lesson runs on.

CREATE TABLE customers (
  customer_id  INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  city         TEXT NOT NULL,
  signup_date  DATE NOT NULL
);

CREATE TABLE products (
  product_id  INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL
);

CREATE TABLE orders (
  order_id     INTEGER PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers (customer_id),
  order_date   DATE NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('paid', 'shipped', 'refunded')),
  total        NUMERIC(10, 2) NOT NULL
);

CREATE TABLE order_items (
  order_id    INTEGER NOT NULL REFERENCES orders (order_id),
  product_id  INTEGER NOT NULL REFERENCES products (product_id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
`,
  },
];
