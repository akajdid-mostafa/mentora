"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// A learner's notes, each pinned to the second of the lesson it was written
// at, so a click on one plays that moment again. Kept in the browser like the
// rest of a visitor's state; the lesson player is the only thing that writes
// them.
export type Note = {
  id: string;
  course: string;
  lesson: string;
  /** Seconds into the lesson. */
  at: number;
  text: string;
};

// Two notes on the lesson the demo learner stopped in, and one from the
// module before, so the tab and the markers on the scrubber open with
// something to show.
const seed: Note[] = [
  {
    id: "seed-1",
    course: "c1",
    lesson: "4.2",
    at: 252,
    text: "LEFT JOIN keeps every customer; the nulls never placed an order.",
  },
  {
    id: "seed-2",
    course: "c1",
    lesson: "4.2",
    at: 324,
    text: "Count the rows both ways before you trust a join.",
  },
  {
    id: "seed-3",
    course: "c1",
    lesson: "3.3",
    at: 402,
    text: "WHERE runs before the grouping, HAVING after it. A filter on a total goes in HAVING.",
  },
];

const store = localStore<Note[]>(
  "mentora:notes",
  seed,
  (v): v is Note[] =>
    Array.isArray(v) &&
    v.every(
      (n) =>
        n &&
        typeof n === "object" &&
        typeof (n as Note).id === "string" &&
        typeof (n as Note).lesson === "string" &&
        typeof (n as Note).at === "number" &&
        typeof (n as Note).text === "string",
    ),
);

export function useNotes() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

export function addNote(note: Omit<Note, "id">) {
  const id = `n${Date.now().toString(36)}`;
  store.write([...store.read(), { ...note, id }]);
  return id;
}

export function updateNote(id: string, text: string) {
  store.write(store.read().map((n) => (n.id === id ? { ...n, text } : n)));
}

export function removeNote(id: string) {
  const all = store.read();
  const gone = all.find((n) => n.id === id);
  store.write(all.filter((n) => n.id !== id));
  return gone;
}

/** Puts a deleted note back where it was, for the undo beside the delete. */
export function restoreNote(note: Note) {
  if (store.read().some((n) => n.id === note.id)) return;
  store.write([...store.read(), note]);
}
