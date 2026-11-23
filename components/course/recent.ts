"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// The courses a visitor has opened, newest first. A card records itself when
// its link is followed, so the history fills from the home shelf and the
// catalogue alike.
//
// `ago` is how long before the first visit the three starting entries were
// "viewed", in hours, so the demo opens with a history to page through; an
// entry the visitor made carries `at`, the moment it was opened.
export type Viewed = { id: string; at?: number; ago?: number };

const MAX = 6;

const store = localStore<Viewed[]>(
  "mentora:recent",
  [
    { id: "c1", ago: 26 },
    { id: "c7", ago: 74 },
    { id: "c10", ago: 122 },
  ],
  (v): v is Viewed[] =>
    Array.isArray(v) &&
    v.every((x) => x && typeof x === "object" && typeof (x as Viewed).id === "string"),
);

export function useRecent() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

export function recordView(id: string) {
  const rest = store.read().filter((v) => v.id !== id);
  store.write([{ id, at: Date.now() }, ...rest].slice(0, MAX));
}

export function clearRecent() {
  store.write([]);
}

/** "Viewed yesterday", from however long ago the entry was made. */
export function viewedLabel(v: Viewed, now: number) {
  const hours = v.at !== undefined ? (now - v.at) / 3_600_000 : (v.ago ?? 0);
  if (hours < 1) return "Viewed just now";
  if (hours < 24) return `Viewed ${Math.floor(hours)} hour${hours < 2 ? "" : "s"} ago`;
  if (hours < 48) return "Viewed yesterday";
  return `Viewed ${Math.floor(hours / 24)} days ago`;
}
