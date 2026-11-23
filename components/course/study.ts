"use client";

import { useSyncExternalStore } from "react";
import { localStore } from "@/lib/local-store";

// How long the learner has studied, day by day: what the dashboard's week and
// its streak are drawn from. The lesson player adds to today while a video
// plays, a few seconds at a time, and the record keeps seconds by local day.
//
// The demo learner's history is kept apart from that record and counted in
// days before today rather than dated, so the demo opens on a week under way
// and a streak still alive whatever day it is opened. What the visitor adds
// lands on top of it.
export type StudyLog = Record<string, number>;

// Minutes a day, today first, going back ten weeks. Nothing yet today; the
// last seven days hold 7 h 50 min, 70 minutes short of the nine-hour goal;
// each of the seven weeks before them holds nine hours or more, and the
// eighth fell short, which is where the streak begins.
const HISTORY = [
  0, 95, 80, 0, 110, 75, 110,
  90, 0, 120, 85, 100, 0, 150,
  110, 95, 0, 130, 80, 70, 90,
  0, 140, 90, 0, 120, 110, 95,
  100, 80, 105, 0, 95, 0, 180,
  85, 120, 0, 90, 75, 130, 60,
  0, 110, 95, 100, 0, 140, 110,
  120, 0, 90, 85, 110, 0, 145,
  60, 0, 75, 50, 0, 90, 45,
  80, 95, 0, 110, 60, 0, 100,
];

/** The goal the history was studied against, in minutes a week. A goal the
 *  visitor sets counts from this week on; the weeks already past keep the
 *  one they were measured by. */
const PAST_GOAL = 9 * 60;

const store = localStore<StudyLog>(
  "mentora:study",
  {},
  (v): v is StudyLog =>
    Boolean(v) &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.values(v as object).every((n) => typeof n === "number"),
);

export function useStudyLog() {
  return useSyncExternalStore(store.subscribe, store.read, store.server);
}

/** Seconds studied, added to the visitor's own today. */
export function logStudy(seconds: number, today: string) {
  const log = store.read();
  store.write({ ...log, [today]: (log[today] ?? 0) + seconds });
}

const DAY = 86_400_000;
const back = (today: string, days: number) =>
  new Date(new Date(`${today}T12:00:00Z`).getTime() - days * DAY).toISOString().slice(0, 10);

const minutesOn = (log: StudyLog, today: string, ago: number) =>
  (HISTORY[ago] ?? 0) + Math.floor((log[back(today, ago)] ?? 0) / 60);

export type Day = { key: string; ago: number; minutes: number };

/** The last seven days, oldest first and today last. */
export function lastWeek(log: StudyLog, today: string): Day[] {
  return Array.from({ length: 7 }, (_, i) => {
    const ago = 6 - i;
    return { key: back(today, ago), ago, minutes: minutesOn(log, today, ago) };
  });
}

/** Minutes in the seven days `weeks` weeks before the last seven: 0 is the
 *  week under way. */
function weekTotal(log: StudyLog, today: string, weeks: number) {
  let sum = 0;
  for (let d = 0; d < 7; d++) sum += minutesOn(log, today, weeks * 7 + d);
  return sum;
}

export type Streak = {
  /** Weeks in a row at the goal, the week under way counted once it is met. */
  weeks: number;
  /** Whether the week under way has reached the goal. */
  met: boolean;
  /** The first day of the oldest week the streak counts. */
  since: string;
  /** The last eight finished weeks, oldest first: at the goal or short of it. */
  history: boolean[];
};

export function streakOf(log: StudyLog, today: string, goal: number): Streak {
  let past = 0;
  while (past < 52 && weekTotal(log, today, past + 1) >= PAST_GOAL) past++;
  const met = weekTotal(log, today, 0) >= goal;
  return {
    weeks: past + (met ? 1 : 0),
    met,
    since: back(today, met && past === 0 ? 6 : past * 7 + 6),
    history: Array.from({ length: 8 }, (_, i) => weekTotal(log, today, 8 - i) >= PAST_GOAL),
  };
}
