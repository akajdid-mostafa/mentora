// The promo codes the demo knows, and what each is good for. A real store
// checks a code on its server, where the list is not readable by anybody who
// opens the page's source; the demo keeps them here so every outcome of the
// field can be walked through: a code taken off a course, one off the first
// charge of Plus, one that only a year of Plus takes, one that has ended, and
// one that was never issued.

/** What a code is judged against: a course, or Plus by the month or year. */
export type Target = "course" | "plus-monthly" | "plus-yearly";

export type Code = {
  code: string;
  /** Percent off, or a fixed amount off in cents. */
  off: { percent: number } | { cents: number };
  /** The orders it can be spent on. */
  on: "course" | "plus" | "plus-yearly";
  /** What it takes off, in a few words, for the line under the field. */
  note: string;
  ended?: boolean;
};

export const codes: Code[] = [
  { code: "AUTUMN15", off: { percent: 15 }, on: "course", note: "15% off any single course" },
  { code: "FRIEND10", off: { cents: 1000 }, on: "plus", note: "$10 off your first Plus charge" },
  { code: "YEAR40", off: { cents: 4000 }, on: "plus-yearly", note: "$40 off a year of Plus" },
  { code: "SUMMER20", off: { percent: 20 }, on: "course", note: "20% off any single course", ended: true },
];

/** The code the field rests at, one per kind of order: the one a signed-in
 *  learner would have been sent, so Apply works on the first press. */
export const suggestionFor = (target: Target) =>
  codes.find((c) => !c.ended && (target === "course" ? c.on === "course" : c.on === "plus"));

export type Refusal = "empty" | "unknown" | "ended" | "course-only" | "plus-only" | "yearly-only";

export type Verdict = { ok: true; code: Code } | { ok: false; reason: Refusal; typed: string };

/** What the field says to a code typed into it, for the order it is on. */
export function judge(typed: string, target: Target): Verdict {
  const clean = typed.trim().toUpperCase();
  if (!clean) return { ok: false, reason: "empty", typed: clean };
  const code = codes.find((c) => c.code === clean);
  if (!code) return { ok: false, reason: "unknown", typed: clean };
  if (code.ended) return { ok: false, reason: "ended", typed: clean };
  if (code.on === "course" && target !== "course") return { ok: false, reason: "course-only", typed: clean };
  if (code.on !== "course" && target === "course") return { ok: false, reason: "plus-only", typed: clean };
  if (code.on === "plus-yearly" && target !== "plus-yearly") return { ok: false, reason: "yearly-only", typed: clean };
  return { ok: true, code };
}

/** What a code takes off an amount in cents, never more than the amount. */
export function discountOn(cents: number, code: Code) {
  const off = "percent" in code.off ? Math.round((cents * code.off.percent) / 100) : code.off.cents;
  return Math.min(off, cents);
}
