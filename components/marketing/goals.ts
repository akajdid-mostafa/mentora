// The four sample goals of row 5 and the arithmetic that turns one of them
// into a date. The legs are content and the canvas is a layout, so a curriculum
// is edited here rather than inside the drawing that shows it.
//
// Each leg is a course in the catalogue, so the path page can send a reader on
// to it, and its hours are the course's own: its weeks at its hours a week, the
// figure the course page plans a finish date from. Row 5, the header's menu
// and the path page then print one number for a leg rather than three.

import type { ComponentType, SVGProps } from "react";
import {
  BanknotesIcon,
  ChartBarIcon,
  CommandLineIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { courses } from "@/components/course/courses";
import { slugify } from "@/lib/utils";

export type Leg = {
  /** The course the leg is, by its id in the catalogue. */
  course: string;
  title: string;
  /** The leg as one line of a schedule, where the full title would wrap. */
  short: string;
  hours: number;
  /** The legs this one builds on, by their place in the path. */
  needs: number[];
  /** Why the tutor put the leg where it is, in a line or two. */
  why: string;
};
export type Goal = {
  id: string;
  label: string;
  /** The role the goal ends in, short enough for four to share a tab bar. */
  short: string;
  blurb: string;
  /** Words a typed goal is matched on, so the field builds a path too. */
  keys: string[];
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  legs: Leg[];
};

/** A leg read off its course, so a title or a length changed in the
 *  catalogue changes here as well. */
function leg(id: string, short: string, why: string, needs: number[] = []): Leg {
  const c = courses.find((x) => x.id === id);
  if (!c) throw new Error(`No course ${id} in components/course/courses.ts`);
  return { course: id, title: c.title, short, hours: c.weeks * c.hours, needs, why };
}

// A leg's number in a `why` is held to the word before it by a no-break
// space, so a narrow card never opens a line on "3." as a list would.
export const goals: Goal[] = [
  {
    id: "analyst",
    label: "Become a data analyst",
    short: "Data analyst",
    blurb: "Spreadsheets to SQL to a dashboard somebody else reads.",
    keys: ["data", "analyst", "analytics", "sql", "excel", "spreadsheet", "dashboard", "statistics", "bi"],
    Icon: ChartBarIcon,
    legs: [
      leg("c1", "SQL for analysis", "First, because legs\u00a03 and\u00a05 read their data through a query."),
      leg("c2", "Statistics", "It needs no SQL, so it can run beside the first. The tests in leg\u00a04 stand on it."),
      leg("c14", "Python for analysis", "It picks up the tables your queries return and cleans them in pandas.", [0]),
      leg("c19", "A/B tests", "The statistics of leg\u00a02, put to work on a decision somebody is waiting for.", [1]),
      leg("c3", "Dashboards", "Last, because a dashboard draws on legs\u00a01 and\u00a03. It is the piece you show.", [0, 2]),
    ],
  },
  {
    id: "backend",
    label: "Ship a backend service",
    short: "Backend engineer",
    blurb: "One language, one database, and the parts that page you at 3am.",
    keys: ["backend", "back end", "engineer", "developer", "python", "api", "server", "software", "code"],
    Icon: CommandLineIcon,
    legs: [
      leg("c4", "Python beyond scripts", "The one language the path is written in, taken from a script to a package."),
      leg("c5", "HTTP and frameworks", "A service answers HTTP first, and here you send every request by hand.", [0]),
      leg("c6", "Data modeling", "The tables a service keeps its state in. It needs no Python, so it can start any week."),
      leg("c17", "Testing with pytest", "Tests for code that talks to a database, which is most of the code in a service.", [0]),
      leg("c30", "Postgres performance", "Last: the slow queries that page you at 3am, read from their query plans.", [2]),
    ],
  },
  {
    id: "design",
    label: "Move into product design",
    short: "Product designer",
    blurb: "Research that changes the brief, not decoration after it.",
    keys: ["design", "designer", "ux", "ui", "product", "figma", "interface", "research"],
    Icon: PaintBrushIcon,
    legs: [
      leg("c24", "User interviews", "First, because every screen after it starts from what five people told you."),
      leg("c7", "Interface basics", "Layout, type and color, taught through forty critiques of real screens."),
      leg("c18", "Interface type", "The type in leg\u00a02 taken further, from a 12px label to a 60px headline.", [1]),
      leg("c8", "Prototyping", "The interviews and the screens meet here, in a test run before anyone builds.", [0, 1]),
      leg("c9", "Design systems", "Last and the longest: the tokens and parts a whole team builds from.", [2, 3]),
    ],
  },
  {
    id: "founder",
    label: "Launch a product people pay for",
    short: "Founder",
    blurb: "From five customer calls to the first hundred who pay.",
    keys: ["founder", "startup", "start-up", "business", "company", "launch", "entrepreneur", "customers", "revenue", "product"],
    Icon: BanknotesIcon,
    legs: [
      leg("c24", "Customer interviews", "Before any price or plan: what five people say the problem costs them."),
      leg("c11", "Pricing", "A first price, set from your costs, the alternatives and those five calls.", [0]),
      leg("c25", "Unit economics", "What one customer costs and earns you at that price, and what has to change.", [1]),
      leg("c10", "Financial model", "The unit economics grown into three years, with every assumption written down.", [2]),
      leg("c12", "First hundred customers", "Last: the price from leg\u00a02, taken to the first hundred people who pay.", [1]),
    ],
  },
];

/** A goal's page. The slug is the role, so the address says where the path
 *  ends: /paths/data-analyst. */
export const pathSlug = (g: Goal) => slugify(g.short);
export const pathHref = (g: Goal) => `/paths/${pathSlug(g)}`;

// Monday of the week the estimate lands in, so the date is a commitment rather
// than a decimal.
export const finishes = (totalHours: number, perWeek: number) => {
  const weeks = Math.ceil(totalHours / perWeek);
  const d = new Date(2026, 8, 21);
  d.setDate(d.getDate() + weeks * 7);
  return {
    weeks,
    label: d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
};

export const totalHours = (g: Goal) => g.legs.reduce((n, l) => n + l.hours, 0);

/** The sample goal a typed one lands on: most matching words wins, and nothing
 *  matching returns null rather than a guess. Words match whole or by their
 *  stem — `designing` finds `design` — so `ui` never fires inside `build`. */
export const matchGoal = (text: string) => {
  const t = text.toLowerCase();
  const words = t.split(/[^a-z]+/).filter(Boolean);
  const hit = (k: string) =>
    k.includes(" ")
      ? t.includes(k)
      : words.some((w) => w === k || (k.length > 3 && w.startsWith(k)));
  const scored = goals
    .map((g) => ({ g, n: g.keys.filter(hit).length }))
    .sort((a, b) => b.n - a.n);
  return scored[0].n > 0 ? scored[0].g : null;
};

/** The weeks each leg runs across at this pace, legs taken in order: a leg
 *  starts in the week the last one ended in, the way a real week is shared. */
export const legWeeks = (g: Goal, perWeek: number) => {
  let before = 0;
  return g.legs.map((l) => {
    const from = Math.floor(before / perWeek) + 1;
    before += l.hours;
    return { from, to: Math.max(from, Math.ceil(before / perWeek)) };
  });
};

// The day each successive hour of a week goes to, Monday as 0: Saturday
// first, then alternate evenings, so six hours reads as three evenings and a
// weekend rather than one long Monday. Twenty slots, the slider's ceiling.
const spread = [5, 0, 2, 5, 3, 6, 1, 5, 0, 6, 2, 3, 4, 5, 1, 6, 0, 2, 3, 4];

/** Hours on each day, Monday first. */
export const weekOf = (perWeek: number) => {
  const days = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < Math.min(perWeek, spread.length); i++) days[spread[i]] += 1;
  return days;
};
