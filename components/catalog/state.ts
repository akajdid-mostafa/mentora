// The catalogue page's filter model: what a set of filters is, how it travels
// in the address bar, which courses it lets through, and how many each option
// would leave. No markup here, so the rules can be read in one place and a
// real search backend can replace `results` and `counts` without touching the
// page.

import {
  courses,
  credentials,
  durations,
  inDuration,
  languages,
  levels,
  matchesQuery,
  PRICE_CEILING,
  PRICE_STEP,
  ratings,
  searchText,
  topics,
  type Course,
  type Credential,
  type Duration,
  type Language,
  type Level,
  type Topic,
} from "@/components/course/courses";
import { slugify } from "@/lib/utils";

export type Sort =
  | "recommended"
  | "popular"
  | "rating"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "shortest";

export const sorts: { id: Sort; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "popular", label: "Most enrolled" },
  { id: "rating", label: "Highest rated" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "shortest", label: "Shortest first" },
];

export type View = "grid" | "list";

export type Filters = {
  q: string;
  topic: Topic | null;
  level: Level[];
  duration: Duration[];
  /** Inclusive, in dollars. The full range is no price filter at all. */
  price: [number, number];
  /** The lowest rating let through, or none. */
  rating: number | null;
  language: Language[];
  credential: Credential[];
};

export type Group = Exclude<keyof Filters, "q">;

export const EMPTY: Filters = {
  q: "",
  topic: null,
  level: [],
  duration: [],
  price: [0, PRICE_CEILING],
  rating: null,
  language: [],
  credential: [],
};

export type State = { filters: Filters; sort: Sort; view: View };

// ---------------------------------------------------------------------------
// The address bar. Every filter is in the URL, so a filtered catalogue can be
// bookmarked, shared and opened from a link elsewhere on the site: the
// header's subject menu writes `?topic=data`, the hero's search writes `?q=`.
// ---------------------------------------------------------------------------

export type Query = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const many = <T extends string>(v: string | string[] | undefined, options: readonly T[]) => {
  const wanted = one(v).split(",").filter(Boolean);
  return options.filter((o) => wanted.includes(slugify(o)));
};

export function fromQuery(query: Query): State {
  const topic = topics.find((t) => slugify(t) === one(query.topic)) ?? null;

  const [lo, hi] = one(query.price).split("-").map(Number);
  const price: [number, number] =
    Number.isFinite(lo) && Number.isFinite(hi) && lo <= hi
      ? [Math.max(0, lo), Math.min(PRICE_CEILING, hi)]
      : [0, PRICE_CEILING];

  const r = Number(one(query.rating));
  const sort = sorts.find((s) => s.id === one(query.sort))?.id ?? "recommended";

  return {
    filters: {
      q: one(query.q).trim(),
      topic,
      level: many(query.level, levels),
      duration: many(query.duration, durations),
      price,
      rating: ratings.find((x) => x === r) ?? null,
      language: many(query.language, languages),
      credential: many(query.credential, credentials),
    },
    sort,
    view: one(query.view) === "list" ? "list" : "grid",
  };
}

export function toQuery({ filters: f, sort, view }: State) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.topic) p.set("topic", slugify(f.topic));
  if (f.level.length) p.set("level", f.level.map(slugify).join(","));
  if (f.duration.length) p.set("duration", f.duration.map(slugify).join(","));
  if (!isFullPrice(f.price)) p.set("price", `${f.price[0]}-${f.price[1]}`);
  if (f.rating !== null) p.set("rating", String(f.rating));
  if (f.language.length) p.set("language", f.language.map(slugify).join(","));
  if (f.credential.length) p.set("credential", f.credential.map(slugify).join(","));
  if (sort !== "recommended") p.set("sort", sort);
  if (view !== "grid") p.set("view", view);
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------------------
// Matching and counting
// ---------------------------------------------------------------------------

export const isFullPrice = ([lo, hi]: [number, number]) => lo === 0 && hi >= PRICE_CEILING;

/** Whether a course passes every filter, leaving one group out when asked:
 *  an option's count is what the page would show with that option added to
 *  everything else already chosen, which means reading its own group away. */
export function passes(c: Course, f: Filters, skip?: Group) {
  if (!matchesQuery(c, f.q)) return false;
  if (skip !== "topic" && f.topic && c.topic !== f.topic) return false;
  if (skip !== "level" && f.level.length && !f.level.includes(c.level)) return false;
  if (skip !== "duration" && f.duration.length && !f.duration.some((d) => inDuration(c.weeks, d)))
    return false;
  if (skip !== "price" && (c.price < f.price[0] || c.price > f.price[1])) return false;
  if (skip !== "rating" && f.rating !== null && c.rating < f.rating) return false;
  if (skip !== "language" && f.language.length && !f.language.includes(c.language)) return false;
  if (skip !== "credential" && f.credential.length && !f.credential.includes(c.credential))
    return false;
  return true;
}

/** What `passes` reads from a course, as `data-*` for the item that shows it,
 *  so a page holding the cards can filter them without the course array.
 *  Keep it in step with `passes`. */
export const courseData = (c: Course) => ({
  "data-topic": c.topic,
  "data-level": c.level,
  "data-weeks": c.weeks,
  "data-price": c.price,
  "data-rating": c.rating,
  "data-language": c.language,
  "data-credential": c.credential,
  "data-search": searchText(c),
});

const order = new Map(courses.map((c, i) => [c.id, i]));

const comparators: Record<Sort, (a: Course, b: Course) => number> = {
  recommended: (a, b) => order.get(a.id)! - order.get(b.id)!,
  popular: (a, b) => b.learners - a.learners,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  newest: (a, b) => b.added.localeCompare(a.added),
  "price-asc": (a, b) => a.price - b.price || b.rating - a.rating,
  "price-desc": (a, b) => b.price - a.price || b.rating - a.rating,
  shortest: (a, b) => a.weeks - b.weeks || a.hours - b.hours,
};

export function results(f: Filters, sort: Sort) {
  return courses.filter((c) => passes(c, f)).sort(comparators[sort]);
}

const tally = <T extends string | number>(
  pool: Course[],
  options: readonly T[],
  test: (c: Course, o: T) => boolean,
) => new Map(options.map((o) => [o, pool.filter((c) => test(c, o)).length]));

/** How far each bar of the price histogram reaches, in dollars. */
export const BUCKET = 10;

export function counts(f: Filters) {
  const without = (g: Group) => courses.filter((c) => passes(c, f, g));
  const byPrice = without("price");
  return {
    topicAll: without("topic").length,
    ratingAll: without("rating").length,
    topic: tally(without("topic"), topics, (c, t) => c.topic === t),
    level: tally(without("level"), levels, (c, l) => c.level === l),
    duration: tally(without("duration"), durations, (c, d) => inDuration(c.weeks, d)),
    rating: tally(without("rating"), ratings, (c, r) => c.rating >= r),
    language: tally(without("language"), languages, (c, l) => c.language === l),
    credential: tally(without("credential"), credentials, (c, k) => c.credential === k),
    // One bar per ten dollars, drawn from every course the other filters
    // leave, so the bars show where prices sit whatever the slider says.
    histogram: Array.from({ length: PRICE_CEILING / BUCKET }, (_, i) =>
      byPrice.filter((c) => c.price >= i * BUCKET && c.price < (i + 1) * BUCKET).length,
    ),
    priceIn: (range: [number, number]) =>
      byPrice.filter((c) => c.price >= range[0] && c.price <= range[1]).length,
  };
}

export type Counts = ReturnType<typeof counts>;

// ---------------------------------------------------------------------------
// Labels, and the chips that undo one filter each
// ---------------------------------------------------------------------------

export function priceLabel([lo, hi]: [number, number]) {
  if (lo === 0 && hi === 0) return "Free only";
  if (hi >= PRICE_CEILING) return `$${lo} and up`;
  if (lo === 0) return `Up to $${hi}`;
  return `$${lo} to $${hi}`;
}

export const ratingLabel = (r: number) => `${r.toFixed(1)} and up`;

export type Chip = {
  key: string;
  label: string;
  /** The chip as a sentence names it, quoted once: a search's label already
   *  wears its quotation marks, and quoting it again printed ““python””. */
  said: string;
  clear: (f: Filters) => Filters;
};

/** Every filter in force, one chip each, in the order the controls are drawn. */
export function chips(f: Filters): Chip[] {
  const out: Chip[] = [];
  const add = (key: string, label: string, clear: Chip["clear"], quoted = false) =>
    out.push({ key, label, said: quoted ? label : `“${label}”`, clear });
  if (f.q) add("q", `“${f.q}”`, (x) => ({ ...x, q: "" }), true);
  if (f.topic) add("topic", f.topic, (x) => ({ ...x, topic: null }));
  const list = <K extends "level" | "duration" | "language" | "credential">(k: K) => {
    for (const v of f[k] as string[])
      add(`${k}:${v}`, v, (x) => ({ ...x, [k]: (x[k] as string[]).filter((y) => y !== v) }));
  };
  list("level");
  list("duration");
  if (!isFullPrice(f.price))
    add("price", priceLabel(f.price), (x) => ({ ...x, price: [0, PRICE_CEILING] }));
  if (f.rating !== null)
    add("rating", `Rated ${ratingLabel(f.rating)}`, (x) => ({ ...x, rating: null }));
  list("language");
  list("credential");
  return out;
}

/** The one chip whose removal brings the most courses back, for an empty
 *  result to offer as its single way out. */
export function bestUndo(f: Filters) {
  let best: { chip: Chip; found: number } | null = null;
  for (const chip of chips(f)) {
    const found = results(chip.clear(f), "recommended").length;
    if (!best || found > best.found) best = { chip, found };
  }
  return best;
}

export const snap = (v: number) => Math.round(v / PRICE_STEP) * PRICE_STEP;
