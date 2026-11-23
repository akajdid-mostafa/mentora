"use client";

// Where the take's cuts and the quiz stand, shared between the sections that
// do the work and the studio's window, which reports on both: the splitter
// and the deck write here as they change, and the window's Recordings and
// Quizzes tabs read it. One value in the page's memory, as the player is.

import { useSyncExternalStore } from "react";

export type Progress = {
  cuts: { waiting: number; total: number; published: boolean };
  quiz: { approved: number; live: number; pending: number; added: boolean };
};

// What both sections open on, so the server's markup and the first frame
// agree: three cuts drafted and none kept, five questions dealt and none
// decided.
const initial: Progress = {
  cuts: { waiting: 3, total: 3, published: false },
  quiz: { approved: 0, live: 5, pending: 5, added: false },
};
let state = initial;
const listeners = new Set<() => void>();

export const progress = {
  read: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  set<K extends keyof Progress>(key: K, value: Progress[K]) {
    const now = state[key];
    if (Object.keys(value).every((k) => now[k as keyof typeof now] === value[k as keyof typeof value])) return;
    state = { ...state, [key]: value };
    listeners.forEach((l) => l());
  },
};

export function useProgress() {
  return useSyncExternalStore(progress.subscribe, progress.read, () => initial);
}
