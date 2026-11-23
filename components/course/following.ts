"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// The instructors a visitor follows, by name. Follow on the home page's
// instructor cards and on a course page's instructor block is one list, so a
// teacher followed in one place shows as followed in the other.
const store = localStore<string[]>(
  "mentora:following",
  [],
  (v): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string"),
);

export function useFollowing() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

export function toggleFollow(name: string) {
  const now = store.read();
  store.write(now.includes(name) ? now.filter((x) => x !== name) : [...now, name]);
}
