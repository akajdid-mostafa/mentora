// The instructor directory's model: who is in it and what each card says,
// what a set of filters is, how it travels in the address bar, who it lets
// through, and how many each option would leave. No markup here, the way the
// catalogue keeps its own in components/catalog/state.ts, so a real search
// backend can replace `results` and `counts` without touching the page.
//
// Every figure is worked out from the courses a teacher teaches, the same way
// the home page's cards and the course page get theirs, so no page states a
// teacher's numbers differently from another.

import {
  languages,
  teachers,
  teacherStats,
  topics,
  type Course,
  type Language,
  type Topic,
} from "@/components/course/courses";
import { slugify } from "@/lib/utils";

export type Entry = {
  name: string;
  trade: string;
  portrait?: string;
  /** The subject their courses sit in. */
  field: Topic;
  /** The languages their courses are recorded in. */
  languages: Language[];
  /** Most learners first. */
  courses: Course[];
  learners: number;
  rating: number;
  /** How many learners left the ratings above, across every course. */
  reviews: number;
  /** Whether one of their courses costs nothing. */
  free: boolean;
  /** When their first course opened, for the Newest sort. */
  since: string;
};

const most = <T,>(items: T[]) =>
  items.reduce(
    (best, x) => (items.filter((y) => y === x).length > items.filter((y) => y === best).length ? x : best),
    items[0],
  );

export const roster: Entry[] = teachers.map((t) => {
  const s = teacherStats(t.name);
  const taught = [...s.courses].sort((a, b) => b.learners - a.learners);
  return {
    name: t.name,
    trade: t.trade,
    portrait: t.portrait,
    field: most(taught.map((c) => c.topic)),
    languages: languages.filter((l) => taught.some((c) => c.language === l)),
    courses: taught,
    learners: s.learners,
    rating: s.rating,
    reviews: taught.reduce((n, c) => n + c.reviews, 0),
    free: taught.some((c) => c.price === 0),
    since: taught.map((c) => c.added).sort()[0],
  };
});

export const entryOf = (name: string) => roster.find((e) => e.name === name);

// ---------------------------------------------------------------------------
// Filters and sorts
// ---------------------------------------------------------------------------

export type Sort = "learners" | "rating" | "courses" | "newest" | "name";

export const sorts: { id: Sort; label: string }[] = [
  { id: "learners", label: "Most learners" },
  { id: "rating", label: "Highest rated" },
  { id: "courses", label: "Most courses" },
  { id: "newest", label: "Newest on Mentora" },
  { id: "name", label: "Name, A to Z" },
];

/** The lowest rating the Rating chip lets through. A teacher's rating is an
 *  average over thousands of reviews, so the steps are a tenth apart, where a
 *  single course's are half a star. */
export const ratings = [4.8, 4.7, 4.6] as const;

export type Filters = {
  q: string;
  field: Topic | null;
  language: Language[];
  rating: number | null;
  /** Teaches at least one course that costs nothing. */
  free: boolean;
  /** Only the teachers this visitor follows. */
  following: boolean;
};

export type Group = Exclude<keyof Filters, "q">;

export const EMPTY: Filters = {
  q: "",
  field: null,
  language: [],
  rating: null,
  free: false,
  following: false,
};

export type State = { filters: Filters; sort: Sort };

// ---------------------------------------------------------------------------
// The address bar. The home page's instructor row links here with `?field=`,
// and every other filter rides along, so a filtered directory can be shared.
// ---------------------------------------------------------------------------

export type Query = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function fromQuery(query: Query): State {
  const wanted = one(query.language).split(",").filter(Boolean);
  const r = Number(one(query.rating));
  return {
    filters: {
      q: one(query.q).trim(),
      field: topics.find((t) => slugify(t) === one(query.field)) ?? null,
      language: languages.filter((l) => wanted.includes(slugify(l))),
      rating: ratings.find((x) => x === r) ?? null,
      free: one(query.free) === "1",
      following: one(query.following) === "1",
    },
    sort: sorts.find((s) => s.id === one(query.sort))?.id ?? "learners",
  };
}

export function toQuery({ filters: f, sort }: State) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.field) p.set("field", slugify(f.field));
  if (f.language.length) p.set("language", f.language.map(slugify).join(","));
  if (f.rating !== null) p.set("rating", String(f.rating));
  if (f.free) p.set("free", "1");
  if (f.following) p.set("following", "1");
  if (sort !== "learners") p.set("sort", sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------------------
// Matching and counting
// ---------------------------------------------------------------------------

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

// What the search reads: the person, their trade and field, and everything
// they teach, so "sql" finds the teachers whose courses practise it.
export const searchText = (e: Entry) =>
  fold(
    [
      e.name,
      e.trade,
      e.field,
      ...e.languages,
      ...e.courses.flatMap((c) => [c.title, ...c.skills]),
    ].join(" "),
  );

const haystacks = new Map(roster.map((e) => [e.name, searchText(e)]));

export function matchesQuery(e: Entry, q: string) {
  const words = fold(q).split(/\s+/).filter(Boolean);
  const text = haystacks.get(e.name) ?? "";
  return words.every((w) => text.includes(w));
}

/** What `passes` reads from a teacher, as `data-*` for the card that shows
 *  them. The followed list is the visitor's own and lives in the browser, so
 *  it is not here. Keep it in step with `passes`. */
export const entryData = (e: Entry) => ({
  "data-field": e.field,
  "data-languages": e.languages.join(","),
  "data-rating": e.rating,
  "data-free": e.free,
  "data-search": searchText(e),
});

/** Whether a teacher passes every filter, leaving one group out when asked:
 *  an option's count is what the page would show with it added to the rest. */
export function passes(e: Entry, f: Filters, followed: string[], skip?: Group) {
  if (!matchesQuery(e, f.q)) return false;
  if (skip !== "field" && f.field && e.field !== f.field) return false;
  if (skip !== "language" && f.language.length && !e.languages.some((l) => f.language.includes(l)))
    return false;
  if (skip !== "rating" && f.rating !== null && e.rating < f.rating) return false;
  if (skip !== "free" && f.free && !e.free) return false;
  if (skip !== "following" && f.following && !followed.includes(e.name)) return false;
  return true;
}

const comparators: Record<Sort, (a: Entry, b: Entry) => number> = {
  learners: (a, b) => b.learners - a.learners,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  courses: (a, b) => b.courses.length - a.courses.length || b.learners - a.learners,
  newest: (a, b) => b.since.localeCompare(a.since),
  name: (a, b) => a.name.localeCompare(b.name),
};

export function results(f: Filters, sort: Sort, followed: string[]) {
  return roster.filter((e) => passes(e, f, followed)).sort(comparators[sort]);
}

export function counts(f: Filters, followed: string[]) {
  const without = (g: Group) => roster.filter((e) => passes(e, f, followed, g));
  const tally = <T extends string | number>(
    pool: Entry[],
    options: readonly T[],
    test: (e: Entry, o: T) => boolean,
  ) => new Map(options.map((o) => [o, pool.filter((e) => test(e, o)).length]));
  return {
    fieldAll: without("field").length,
    field: tally(without("field"), topics, (e, t) => e.field === t),
    language: tally(without("language"), languages, (e, l) => e.languages.includes(l)),
    ratingAll: without("rating").length,
    rating: tally(without("rating"), ratings, (e, r) => e.rating >= r),
    free: without("free").filter((e) => e.free).length,
    following: without("following").filter((e) => followed.includes(e.name)).length,
  };
}

export type Counts = ReturnType<typeof counts>;

// ---------------------------------------------------------------------------
// The chips that undo one filter each
// ---------------------------------------------------------------------------

export const ratingLabel = (r: number) => `${r.toFixed(1)} and up`;

export type Chip = {
  key: string;
  label: string;
  /** The chip as a sentence names it, quoted once. */
  said: string;
  clear: (f: Filters) => Filters;
};

/** Every filter in force, one chip each, in the order the controls are drawn. */
export function chips(f: Filters): Chip[] {
  const out: Chip[] = [];
  const add = (key: string, label: string, clear: Chip["clear"], quoted = false) =>
    out.push({ key, label, said: quoted ? label : `“${label}”`, clear });
  if (f.q) add("q", `“${f.q}”`, (x) => ({ ...x, q: "" }), true);
  if (f.field) add("field", f.field, (x) => ({ ...x, field: null }));
  for (const l of f.language)
    add(`language:${l}`, `Teaches in ${l}`, (x) => ({ ...x, language: x.language.filter((y) => y !== l) }));
  if (f.rating !== null)
    add("rating", `Rated ${ratingLabel(f.rating)}`, (x) => ({ ...x, rating: null }));
  if (f.free) add("free", "Has a free course", (x) => ({ ...x, free: false }));
  if (f.following) add("following", "Following", (x) => ({ ...x, following: false }));
  return out;
}

/** The one chip whose removal brings the most teachers back, for an empty
 *  result to offer as its single way out. */
export function bestUndo(f: Filters, followed: string[]) {
  let best: { chip: Chip; found: number } | null = null;
  for (const chip of chips(f)) {
    const found = results(chip.clear(f), "learners", followed).length;
    if (!best || found > best.found) best = { chip, found };
  }
  return best;
}
