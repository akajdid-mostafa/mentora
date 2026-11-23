"use client";

// The instructor's drafts, kept in the visitor's browser like every other
// store on the site: the studio's overview lists them, the board edits the
// open one, and a reload finds both where they were left. What a draft is made
// of is the outline it was drafted from, with every lesson either still as the
// studio drafted it or rewritten in the instructor's words.
//
// Mock data and demo state: a buyer replaces the seed below with the drafts
// their backend returns, and the actions with calls that save them.

import { useSyncExternalStore } from "react";
import { outlineById, outlines, type Level, type OutlineSeed } from "@/components/studio/outlines";
import { localStore } from "@/lib/local-store";

export type Length = "short" | "standard" | "long";

/** What the composer's lesson length does to the standard minutes. */
export const LENGTHS: Record<Length, number> = { short: 0.8, standard: 1, long: 1.25 };

// A lesson's minutes across every written outline, at the standard length:
// what the composer quotes beside each length.
const seeds = outlines.flatMap((o) => o.chapters.flatMap((c) => c.lessons));
const mean = seeds.reduce((n, l) => n + l.minutes, 0) / seeds.length;

/** How long a lesson runs at a length, on average, in whole minutes. */
export const minutesAt = (length: Length) => Math.round(mean * LENGTHS[length]);

export type Card = {
  id: string;
  title: string;
  /** The studio's other draft of this lesson, which Redraft swaps in. */
  alt: string;
  minutes: number;
  /** Rewritten by the instructor: Redraft leaves it alone, and it publishes
   *  without the AI drafted badge. */
  yours: boolean;
};

export type Column = { title: string; lessons: Card[] };

export type Stage = "outline" | "recording" | "quizzes";

export type Draft = {
  id: string;
  /** The written outline it was drafted from. */
  outline: string;
  title: string;
  brief: string;
  level: Level;
  stage: Stage;
  /** How far a stage past the outline has got: lessons recorded, quizzes
   *  approved. */
  progress?: { done: number; total: number };
  /** A seed's age in days, or the moment an edit was made. */
  edited: { ago: number } | { at: number };
  chapters: Column[];
};

type Studio = { v: 1; open: string; drafts: Draft[] };

function fromOutline(
  o: OutlineSeed,
  id: string,
  length: Length,
  mine: Record<string, string> = {},
): Column[] {
  return o.chapters.map((c, ci) => ({
    title: c.title,
    lessons: c.lessons.map((l, li) => {
      const key = `${ci + 1}.${li + 1}`;
      return {
        id: `${id}.${key}`,
        title: mine[key] ?? l.title,
        alt: l.alt,
        minutes: Math.max(5, Math.round(l.minutes * LENGTHS[length])),
        yours: key in mine,
      };
    }),
  }));
}

// Every lesson of an outline, as the instructor rewrote it: the drafted
// title kept word for word, which is how the two drafts further along read.
const allMine = (o: OutlineSeed) =>
  Object.fromEntries(
    o.chapters.flatMap((c, ci) => c.lessons.map((l, li) => [`${ci + 1}.${li + 1}`, l.title])),
  );

function seedDraft(
  outlineId: string,
  id: string,
  rest: Pick<Draft, "stage" | "progress" | "edited">,
  mine?: Record<string, string>,
): Draft {
  const o = outlineById(outlineId) as OutlineSeed;
  return {
    id,
    outline: o.id,
    title: o.title,
    brief: o.brief,
    level: o.level,
    ...rest,
    chapters: fromOutline(o, id, "standard", mine ?? allMine(o)),
  };
}

const retention = outlineById("retention") as OutlineSeed;
const fraud = outlineById("fraud") as OutlineSeed;

const seed: Studio = {
  v: 1,
  open: "window",
  drafts: [
    // Eight of twenty-two rewritten: the first chapter in full, the start of
    // the next three, the last two still as the studio drafted them.
    seedDraft("window-functions", "window", { stage: "outline", edited: { ago: 0 } }, {
      "1.1": "The detail GROUP BY throws away",
      "1.2": "OVER(), and a total that keeps its rows",
      "1.3": "PARTITION BY, one group at a time",
      "2.1": "RANK and DENSE_RANK on one table",
      "2.2": "Top three products in every region",
      "3.1": "Running totals with SUM() OVER",
      "3.2": "Window frames, one clause at a time",
      "4.1": "LAG on the daily sales table",
    }),
    seedDraft("retention", "retention", {
      stage: "recording",
      progress: { done: 6, total: retention.chapters.reduce((n, c) => n + c.lessons.length, 0) },
      edited: { ago: 2 },
    }),
    seedDraft("fraud", "fraud", {
      stage: "quizzes",
      progress: { done: 3, total: fraud.chapters.length },
      edited: { ago: 5 },
    }),
  ],
};

const valid = (v: unknown): v is Studio =>
  typeof v === "object" &&
  v !== null &&
  (v as Studio).v === 1 &&
  typeof (v as Studio).open === "string" &&
  Array.isArray((v as Studio).drafts) &&
  (v as Studio).drafts.every(
    (d) =>
      typeof d?.id === "string" &&
      typeof d.title === "string" &&
      Array.isArray(d.chapters) &&
      d.chapters.every((c) => Array.isArray(c?.lessons)),
  );

const store = localStore<Studio>("mentora.studio", seed, valid);

export function useStudio() {
  const s = useSyncExternalStore(store.subscribe, store.read, store.server);
  const open = s.drafts.find((d) => d.id === s.open) ?? s.drafts[0];
  return { drafts: s.drafts, open };
}

// ---------------------------------------------------------------------------
// Actions. Each writes the whole studio back, stamped with the moment of the
// edit, and moves the draft it touched to the head of the list, the order the
// overview reads them in.

function write(draftId: string, change: (d: Draft) => Draft | null, open?: string) {
  const s = store.read();
  const i = s.drafts.findIndex((d) => d.id === draftId);
  if (i < 0) return;
  const next = change(structuredClone(s.drafts[i]));
  const rest = s.drafts.filter((_, k) => k !== i);
  store.write({
    ...s,
    open: open ?? s.open,
    drafts: next ? [{ ...next, edited: { at: Date.now() } }, ...rest] : rest,
  });
}

export const openDraft = (id: string) => store.write({ ...store.read(), open: id });

/** A new draft from a written outline, opened on the board. An untouched
 *  draft the composer made a moment ago is replaced rather than piled up, so
 *  trying three briefs in a row leaves one draft, not three. */
export function draftFrom(o: OutlineSeed, brief: string, length: Length) {
  const s = store.read();
  const id = `d${Date.now().toString(36)}`;
  const draft: Draft = {
    id,
    outline: o.id,
    title: o.title,
    brief,
    level: o.level,
    stage: "outline",
    edited: { at: Date.now() },
    chapters: fromOutline(o, id, length),
  };
  const stale = (d: Draft) =>
    d.id === s.open && d.id.startsWith("d") && d.chapters.every((c) => c.lessons.every((l) => !l.yours));
  store.write({ ...s, open: id, drafts: [draft, ...s.drafts.filter((d) => !stale(d))] });
  return draft;
}

export const renameDraft = (draftId: string, title: string) =>
  write(draftId, (d) => ({ ...d, title }));

export const renameChapter = (draftId: string, ci: number, title: string) =>
  write(draftId, (d) => {
    d.chapters[ci].title = title;
    return d;
  });

/** A lesson in new words, which makes it the instructor's. The same words
 *  back again change nothing. */
export const rewriteLesson = (draftId: string, cardId: string, title: string) =>
  write(draftId, (d) => {
    for (const c of d.chapters)
      for (const l of c.lessons)
        if (l.id === cardId && l.title !== title) Object.assign(l, { title, yours: true });
    return d;
  });

/** Swap the studio's two drafts of every lesson in a chapter that is still
 *  as drafted. The instructor's own lessons stay as they are. */
export const redraftChapter = (draftId: string, ci: number) =>
  write(draftId, (d) => {
    for (const l of d.chapters[ci].lessons) if (!l.yours) [l.title, l.alt] = [l.alt, l.title];
    return d;
  });

export const redraftLesson = (draftId: string, cardId: string) =>
  write(draftId, (d) => {
    for (const c of d.chapters)
      for (const l of c.lessons) if (l.id === cardId && !l.yours) [l.title, l.alt] = [l.alt, l.title];
    return d;
  });

/** Move a lesson to a place in any chapter; `to` counts the target chapter's
 *  lessons as they stand once the lesson has left its own place. */
export const moveLesson = (draftId: string, cardId: string, chapter: number, to: number) =>
  write(draftId, (d) => {
    let card: Card | undefined;
    for (const c of d.chapters) {
      const i = c.lessons.findIndex((l) => l.id === cardId);
      if (i >= 0) [card] = c.lessons.splice(i, 1);
    }
    if (!card) return d;
    const target = d.chapters[chapter].lessons;
    target.splice(Math.max(0, Math.min(to, target.length)), 0, card);
    return d;
  });

/** Take a lesson out, and hand back what puts it back where it was. */
export function deleteLesson(draftId: string, cardId: string) {
  const d = store.read().drafts.find((x) => x.id === draftId);
  if (!d) return null;
  const ci = d.chapters.findIndex((c) => c.lessons.some((l) => l.id === cardId));
  if (ci < 0) return null;
  const li = d.chapters[ci].lessons.findIndex((l) => l.id === cardId);
  const card = d.chapters[ci].lessons[li];
  write(draftId, (x) => {
    x.chapters[ci].lessons.splice(li, 1);
    return x;
  });
  return () =>
    write(draftId, (x) => {
      x.chapters[ci].lessons.splice(Math.min(li, x.chapters[ci].lessons.length), 0, card);
      return x;
    });
}

/** A new, empty lesson at the foot of a chapter, in the instructor's words
 *  from the start: the studio did not draft it. */
export function addLesson(draftId: string, ci: number) {
  const id = `${draftId}.n${Date.now().toString(36)}`;
  write(draftId, (d) => {
    d.chapters[ci].lessons.push({ id, title: "", alt: "", minutes: 10, yours: true });
    return d;
  });
  return id;
}

/** A second copy of a draft beside the first, under its own name, with the
 *  lesson ids made its own so the two are edited apart. */
export function duplicateDraft(draftId: string, title: string) {
  const s = store.read();
  const i = s.drafts.findIndex((d) => d.id === draftId);
  if (i < 0) return;
  const id = `c${Date.now().toString(36)}`;
  const copy: Draft = structuredClone(s.drafts[i]);
  copy.id = id;
  copy.title = title;
  copy.edited = { at: Date.now() };
  copy.chapters.forEach((c) => c.lessons.forEach((l) => (l.id = `${id}.${l.id.split(".").slice(1).join(".")}`)));
  const drafts = [...s.drafts];
  drafts.splice(i + 1, 0, copy);
  store.write({ ...s, drafts });
}

/** Take a draft out of the studio, and hand back what brings it back. */
export function deleteDraft(draftId: string) {
  const s = store.read();
  const i = s.drafts.findIndex((d) => d.id === draftId);
  if (i < 0) return null;
  const gone = s.drafts[i];
  const rest = s.drafts.filter((d) => d.id !== draftId);
  store.write({ ...s, open: s.open === draftId ? (rest[0]?.id ?? "") : s.open, drafts: rest });
  return () => {
    const now = store.read();
    const drafts = [...now.drafts];
    drafts.splice(Math.min(i, drafts.length), 0, gone);
    store.write({ ...now, drafts, open: now.open || gone.id });
  };
}

// ---------------------------------------------------------------------------
// Readings the overview and the board share.

export const lessonsOf = (d: Draft) => d.chapters.flatMap((c) => c.lessons);

export const countsOf = (d: Draft) => {
  const all = lessonsOf(d);
  const yours = all.filter((l) => l.yours).length;
  return {
    lessons: all.length,
    yours,
    drafted: all.length - yours,
    minutes: all.reduce((n, l) => n + l.minutes, 0),
  };
};

/** The lattice's reading of a draft: per chapter, its lessons and how many
 *  are the instructor's. */
export const columnsOf = (d: Draft) =>
  d.chapters.map((c) => ({ lessons: c.lessons.length, yours: c.lessons.filter((l) => l.yours).length }));
