"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// The courses a visitor has saved, by id. Three start saved so a first visit
// shows the saved state beside the unsaved one, on the shelf and in the
// header's count alike.
const store = localStore<string[]>(
  "mentora:saved",
  ["c11", "c4", "c12"],
  (v): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string"),
);

export function useSaved() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

export function toggleSaved(id: string) {
  const now = store.read();
  store.write(now.includes(id) ? now.filter((x) => x !== id) : [...now, id]);
}
