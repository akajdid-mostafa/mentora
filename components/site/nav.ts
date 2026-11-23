// The header's routes and every word its menus carry. The bar's three menus and
// the phone's drawer all read from here, so a route renamed or moved changes in
// one place. The counts are summed from the records the page's own rows print,
// so the menu cannot drift from the catalogue it points into.

import {
  Analytics01Icon,
  Briefcase01Icon,
  CodeIcon,
  PenTool03Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { catalogue, credentials as credentialKinds, topicTint, type Topic } from "@/components/course/courses";
import { goals, pathHref, totalHours } from "@/components/marketing/goals";
import { directory } from "@/components/marketing/instructors-data";
import { slugify } from "@/lib/utils";

export type NavLink = {
  href: string;
  label: string;
  /** a figure at the row's end, in the muted ink */
  count?: string;
  /** the page is one of the two the AI works on, tutor or studio */
  ai?: boolean;
  /** Off for an address that answers 404 on purpose: a prefetch of it logs
   *  a failed request in the console of whoever only opened the menu. */
  prefetch?: false;
};

const figure = (n: number) => n.toLocaleString("en-US");
const sum = (r: Record<string, number>) =>
  Object.values(r).reduce((n, v) => n + v, 0);

export const courseTotal = figure(sum(catalogue));

// Explore: every route the template ships, grouped by the kind of page each one
// is. Listings beside their detail pages, the learner's screens, the
// instructor's, and the pages every site carries. A detail route is named for
// the page it opens, "Course page", because the menu is where a visitor goes to
// see what the product has in it.
export const explore: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Browse",
    links: [
      { href: "/courses", label: "Courses", count: courseTotal },
      { href: "/courses/sql-for-analysis", label: "Course page" },
      { href: "/instructors", label: "Instructors", count: figure(sum(directory)) },
      { href: "/instructors/ana-reyes", label: "Instructor profile" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/learn/sql-for-analysis", label: "Lesson player", ai: true },
      { href: "/paths/data-analyst", label: "Career path" },
      { href: "/dashboard", label: "My learning" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    heading: "Teach",
    links: [
      { href: "/teach", label: "Teach on Mentora" },
      { href: "/studio", label: "Course studio", ai: true },
      { href: "/teach#earnings", label: "Earnings calculator" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/404", label: "404 page", prefetch: false },
    ],
  },
];

// Courses: the catalogue cut the two ways a learner arrives at it, by what the
// subject is and by what they walk away holding. Each subject keeps the hue its
// course cards wear on the shelf below.
const subjectIcon: Record<Topic, IconSvgElement> = {
  Data: Analytics01Icon,
  Engineering: CodeIcon,
  Design: PenTool03Icon,
  Business: Briefcase01Icon,
};

export const subjects = (Object.keys(catalogue) as Topic[]).map((t) => ({
  href: `/courses?topic=${slugify(t)}`,
  label: t,
  count: figure(catalogue[t]),
  icon: subjectIcon[t],
  tint: topicTint[t],
}));

export const credentials: NavLink[] = credentialKinds.map((c) => ({
  href: `/courses?credential=${slugify(c)}`,
  label: c,
}));

export const coursesFoot = "The first lesson of every course is free.";

// Paths: the four goals row 5 plans from, each opening the path it lays out,
// and the planner itself for a goal that is none of them. A path into a
// subject draws that subject's glyph, so the two menus agree about what data
// and design look like.
const pathIcon: Record<string, IconSvgElement> = {
  analyst: Analytics01Icon,
  backend: TerminalIcon,
  design: PenTool03Icon,
  founder: Briefcase01Icon,
};

export const paths = goals.map((g) => ({
  href: pathHref(g),
  label: g.short,
  hours: `${totalHours(g)} hours`,
  icon: pathIcon[g.id],
}));

export const ownGoal = { href: "/#paths", label: "Start from your own goal" };

// The two plain links the bar carries beside the three menus. Pricing is
// reached from the Company column and the footer.
export const links: NavLink[] = [
  { href: "/teach", label: "Teach" },
  { href: "/studio", label: "Studio" },
];

/** Everything the bar's menus and the phone's drawer print, in one object.
 *  `SiteHeader` reads it on the server and hands it to the bar as a prop:
 *  the counts are summed from the path and instructor records, and importing
 *  this file into a client component puts those records in the JavaScript
 *  every page loads, about 5 KB gzipped. */
export const nav = { explore, subjects, credentials, courseTotal, coursesFoot, paths, ownGoal, links };
export type Nav = typeof nav;
