"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// The full cohorts a visitor asked to hear about, one key each: the course's
// id and the cohort's first day, "c1:2026-10-05". Kept in the browser, as the
// saved courses and the followed teachers are, so the button still reads "On
// the waitlist" when they come back.
const store = localStore<string[]>(
  "mentora:waitlist",
  [],
  (v): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string"),
);

export function useWaitlist() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

export function toggleWaitlist(key: string) {
  const now = store.read();
  store.write(now.includes(key) ? now.filter((x) => x !== key) : [...now, key]);
}
