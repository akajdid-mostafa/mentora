"use client";

import { useSyncExternalStore } from "react";
import { goals } from "@/components/marketing/goals";
import { localStore } from "@/lib/local-store";

// What a visitor has told the paths: the hours they have a week, which is one
// number whatever path they look at, the paths they have kept, and the courses
// they said they already know on each. Kept in the browser like the saved
// courses, so the pace set on one path is the pace the next one opens at.
export type PathChoices = {
  pace: number;
  saved: string[];
  known: Record<string, string[]>;
};

// The demo learner is on the data analyst path, halfway through its first
// course, at the nine hours a week the home page's planner opens at. They have
// kept every path, so each path's page opens on its Saved state.
const seed: PathChoices = { pace: 9, saved: goals.map((g) => g.id), known: {} };

export const PACE = { min: 2, max: 20 };

const record = (v: unknown) => Boolean(v) && typeof v === "object" && !Array.isArray(v);

const store = localStore<PathChoices>(
  "mentora:path-choices",
  seed,
  (v): v is PathChoices =>
    record(v) &&
    typeof (v as PathChoices).pace === "number" &&
    Array.isArray((v as PathChoices).saved) &&
    record((v as PathChoices).known),
);

export function usePathChoices() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

const update = (change: (p: PathChoices) => PathChoices) => store.write(change(store.read()));

export function setPace(hours: number) {
  update((p) => ({ ...p, pace: Math.min(PACE.max, Math.max(PACE.min, Math.round(hours))) }));
}

export function toggleSavedPath(id: string) {
  update((p) => ({
    ...p,
    saved: p.saved.includes(id) ? p.saved.filter((x) => x !== id) : [...p.saved, id],
  }));
}

export function toggleKnown(path: string, course: string) {
  update((p) => {
    const now = p.known[path] ?? [];
    const next = now.includes(course) ? now.filter((x) => x !== course) : [...now, course];
    return { ...p, known: { ...p.known, [path]: next } };
  });
}
