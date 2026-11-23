"use client";

import { useMemo, useSyncExternalStore } from "react";

// One clock for the whole contact page, read by every section that prints an
// hour: which office is on shift, the time on an office's wall, a slot in the
// visitor's own zone. The server has no visitor and no zone, so it renders the
// moment it was asked in UTC, and so does the browser's first frame; the
// visitor's zone and the running time arrive on the render after, which is
// what keeps hydration quiet. It ticks every 15 seconds, often enough for a
// clock that shows minutes.

type Clock = { now: number; tz: string };

const visitorZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

let current: Clock | null = null;
let timer: number | undefined;
const listeners = new Set<() => void>();

const read = () => (current ??= { now: Date.now(), tz: visitorZone() });

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (timer === undefined) {
    timer = window.setInterval(() => {
      current = { now: Date.now(), tz: current?.tz ?? visitorZone() };
      listeners.forEach((l) => l());
    }, 15_000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/** The time now and the visitor's zone. `live` is false on the server's
 *  frame, where the zone is UTC, so a line that names "your time" can hold
 *  its words back until the zone is the visitor's. */
export function useClock(serverNow: string) {
  const server = useMemo(() => ({ now: Date.parse(serverNow), tz: "UTC" }), [serverNow]);
  const c = useSyncExternalStore(subscribe, read, () => server);
  return { now: new Date(c.now), tz: c.tz, live: c !== server };
}
