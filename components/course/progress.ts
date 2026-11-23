"use client";

import { useSyncExternalStore } from "react";
import { seed, type Progress } from "@/components/course/progress-seed";
import { localStore } from "@/lib/local-store";

// Where a learner stands in each course: the ones they are enrolled on, the
// syllabus items they have finished, the second each video stopped at, the
// item they had open last, and the day each course was finished. The lesson
// player writes all of it; the dashboard and the checkout read the same
// record, so a lesson finished in the player is finished everywhere. The
// record's shape and the demo learner's seed are in progress-seed.ts.
export type { Progress };

const record = (v: unknown) => Boolean(v) && typeof v === "object" && !Array.isArray(v);

const store = localStore<Progress>(
  "mentora:progress",
  seed,
  (v): v is Progress =>
    record(v) &&
    Array.isArray((v as Progress).enrolled) &&
    record((v as Progress).done) &&
    record((v as Progress).at) &&
    record((v as Progress).last) &&
    // A record without the finished courses was written from the first
    // seed, where the demo learner had one course and no certificate, so it
    // gives way to the seed the dashboard is written for. The seed and every
    // record written from it carry the field, even when it is empty.
    record((v as Progress).finished) &&
    // added after the finished courses, so a record without it is still one
    ((v as Progress).opened === undefined || record((v as Progress).opened)),
);

export function useProgress() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

/** The stored record outside a render, for the moment a page decides which
 *  item to open: during hydration `useProgress` still hands back the seed. */
export const readProgress = () => store.read();

/** The demo's seed, which is what the server renders from. */
export const serverProgress = () => store.server();

const update = (change: (p: Progress) => Progress) => store.write(change(store.read()));

export function setDone(course: string, item: string, done: boolean) {
  update((p) => {
    const now = p.done[course] ?? [];
    const next = done ? [...new Set([...now, item])] : now.filter((x) => x !== item);
    return { ...p, done: { ...p.done, [course]: next } };
  });
}

/** The second a video stopped at, so opening it again resumes there. */
export function setAt(course: string, lesson: string, seconds: number) {
  update((p) => ({
    ...p,
    at: { ...p.at, [course]: { ...p.at[course], [lesson]: Math.floor(seconds) } },
  }));
}

/** The item a learner has open, and the moment they opened it. */
export function setLast(course: string, item: string) {
  update((p) => ({
    ...p,
    last: { ...p.last, [course]: item },
    opened: { ...p.opened, [course]: Date.now() },
  }));
}

/** The day a course's last item was ticked. Kept once: an item ticked off and
 *  on again later leaves the certificate's date where it was. */
export function setFinished(course: string, day: string) {
  if (store.read().finished[course]) return;
  update((p) => ({ ...p, finished: { ...p.finished, [course]: day } }));
}

export function enroll(course: string) {
  update((p) => (p.enrolled.includes(course) ? p : { ...p, enrolled: [...p.enrolled, course] }));
}
