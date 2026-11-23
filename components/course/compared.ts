"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// The courses a visitor has picked to lay side by side, by id, in the order
// they were picked. The home shelf and the catalogue keep one list, so a
// course picked on one page is waiting in the tray on the other. Nothing
// starts picked: a tray on a first visit would be asking for a comparison
// nobody began.
export const COMPARE_MAX = 3;

const store = localStore<string[]>(
  "mentora:compare",
  [],
  (v): v is string[] =>
    Array.isArray(v) && v.length <= COMPARE_MAX && v.every((x) => typeof x === "string"),
);

export function useCompared() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

/** Out if it is picked, in if there is room; a full list stays as it is. */
export function toggleCompared(id: string) {
  const now = store.read();
  if (now.includes(id)) store.write(now.filter((x) => x !== id));
  else if (now.length < COMPARE_MAX) store.write([...now, id]);
}

export function removeCompared(id: string) {
  store.write(store.read().filter((x) => x !== id));
}

export function clearCompared() {
  store.write([]);
}
