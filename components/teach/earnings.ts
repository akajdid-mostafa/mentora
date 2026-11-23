// What teaching pays, as arithmetic: the share of a sale an instructor keeps,
// what a minute of Plus viewing is worth, when the money lands, and the
// calculator's ranges. Every figure on /teach that is worked out rather than
// quoted runs through here, so the calculator, the payout card in the hero and
// the step that says when you are paid cannot disagree with each other.
//
// Mock data. A buyer running a different split changes the constants below and
// every sentence that states them follows.

/** Of every single-course sale, what the instructor keeps. The home page's
 *  FAQ promises the same 70%. */
export const SHARE = 0.7;

/** What Plus paid for one minute a learner watched, last month. Plus puts 70%
 *  of its subscriptions into a pool and splits it by minutes watched, so the
 *  rate moves month to month, and the page names it as last month's rather
 *  than by a month that would go stale. */
export const PLUS_RATE = 0.042;

/** The day of the month payouts land, for the month before. */
export const PAYDAY = 15;

/** Payouts under this roll into the next month. */
export const PAYOUT_FLOOR = 50;

// The calculator's three inputs: where each starts and how far it runs. The
// resting values are a typical first year, about $900 a month and so close to
// the $9,800 median the numbers row quotes, not the best case, so the figure a
// visitor meets first is one they can believe before they touch anything.
export const PRICES = [29, 49, 69, 89, 129] as const;
export type Price = (typeof PRICES)[number];

export const estimateDefaults = { price: 49 as Price, sales: 20, minutes: 5000 };

export const SALES_RANGE = { min: 0, max: 400, step: 10 };
export const MINUTES_RANGE = { min: 0, max: 100000, step: 2500 };

export type Estimate = { price: Price; sales: number; minutes: number };

/** One sale split in two: the instructor's part and Mentora's. */
export function splitOf(price: number) {
  const yours = round2(price * SHARE);
  return { yours, ours: round2(price - yours) };
}

/** A month at the estimate's pace, both sources and their sum. */
export function monthOf({ price, sales, minutes }: Estimate) {
  const fromSales = round2(splitOf(price).yours * sales);
  const fromPlus = round2(minutes * PLUS_RATE);
  const total = round2(fromSales + fromPlus);
  return { fromSales, fromPlus, total, year: round2(total * 12) };
}

// The address bar carries an estimate, so a link sent to a colleague opens on
// the same three numbers. A number that is missing, empty or not a number
// falls back to the resting value; one past either end of its range is held
// at the nearest end; a price off the list falls back.
export function fromQuery(q: Record<string, string | string[] | undefined>): Estimate {
  const num = (k: string) => {
    const v = q[k];
    const raw = Array.isArray(v) ? v[0] : v;
    if (raw === undefined || raw.trim() === "") return NaN;
    const n = Number(raw);
    return Number.isFinite(n) ? n : NaN;
  };
  const price = PRICES.find((p) => p === num("price")) ?? estimateDefaults.price;
  const sales = clampTo(num("sales"), SALES_RANGE, estimateDefaults.sales);
  const minutes = clampTo(num("minutes"), MINUTES_RANGE, estimateDefaults.minutes);
  return { price, sales, minutes };
}

export const toQuery = (e: Estimate) =>
  `price=${e.price}&sales=${e.sales}&minutes=${e.minutes}`;

function clampTo(n: number, r: { min: number; max: number; step: number }, fallback: number) {
  if (Number.isNaN(n)) return fallback;
  const stepped = Math.round((n - r.min) / r.step) * r.step + r.min;
  return Math.min(r.max, Math.max(r.min, stepped));
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// In the page's own locale, never the reader's: a Vietnamese browser prints
// $1,068 as $1.068.
export const usd = (n: number, cents = false) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })}`;

export const figure = (n: number) => n.toLocaleString("en-US");

/** The next payday on or after `today`, and how far the month has run
 *  towards it, for the hero's payout card. Worked from an ISO date so the
 *  server and the browser agree on the same day. */
export function nextPayday(today: string) {
  const [y, m, d] = today.split("-").map(Number);
  const due = d <= PAYDAY ? new Date(Date.UTC(y, m - 1, PAYDAY)) : new Date(Date.UTC(y, m, PAYDAY));
  const last = new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth() - 1, PAYDAY));
  const now = Date.UTC(y, m - 1, d);
  const day = 86_400_000;
  const span = Math.round((due.getTime() - last.getTime()) / day);
  const left = Math.round((due.getTime() - now) / day);
  const short = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return {
    label: short(due),
    /** The payday before, where the bar starts. */
    since: short(last),
    /** The month the payout covers, the one before it lands. */
    covers: last.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }),
    left,
    run: (span - left) / span,
  };
}
