"use client";

// Where the take is playing, shared by the two sections that point into it:
// the splitter plays and scrubs it, and a quiz question's minute sends it
// there. One value in the page's memory, since nothing about it outlives a
// visit.

import { useSyncExternalStore } from "react";

type State = { t: number; playing: boolean };

// The take opens a minute before its first cut, on the line that closes the
// first lesson, so the transcript shows the first cut the studio made and the
// caption says why it falls there. Server and browser start from the same
// second, so the first frame and the markup agree.
const initial: State = { t: 895, playing: false };
let state = initial;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const player = {
  read: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  seek(t: number) {
    state = { ...state, t: Math.max(0, t) };
    emit();
  },
  play() {
    state = { ...state, playing: true };
    emit();
  },
  pause() {
    state = { ...state, playing: false };
    emit();
  },
};

export function usePlayer() {
  return useSyncExternalStore(player.subscribe, player.read, () => initial);
}

/** A second of the take as a player prints it: 15:58, and 1:01:48 once the
 *  take runs past the hour. A minute inside one lesson is the lesson
 *  player's `clock`, which never reaches an hour. */
export function takeClock(s: number) {
  const whole = Math.max(0, Math.floor(s));
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const sec = String(whole % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${String(m).padStart(2, "0")}:${sec}`;
}
