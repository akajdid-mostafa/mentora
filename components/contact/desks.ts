// The three offices and the desks they staff, and the clock every line on the
// contact page is read from. Hours are written in each office's own time, as
// the office keeps them; everything a visitor sees is worked out from these
// rows by `Intl`, so "open now", "back at 2:00 AM your time" and the hours of
// chat in a day are never typed anywhere else. A buyer who moves an office
// changes its row here and the page follows.

export type OfficeId = "lisbon" | "toronto" | "singapore";
export type DeskId = "learners" | "instructors" | "teams";

/** Open and close in minutes after the office's midnight, on the listed
 *  weekdays (0 is Sunday). */
type Hours = { days: number[]; open: number; close: number };

const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKEND = [0, 6];
const h = (hour: number) => hour * 60;

export type Shift = { desk: DeskId; label: string; hours: Hours[] };

export type Office = {
  id: OfficeId;
  city: string;
  country: string;
  tz: string;
  hq?: boolean;
  /** Two lines, as an envelope takes them. */
  address: [string, string];
  /** Who answers the chat from here, the name the chat card greets with. */
  agent: string;
  shifts: [Shift, Shift];
};

// Learner chat runs 8 to 8 on weekdays in all three cities. Singapore opens as
// Toronto's evening begins and Lisbon opens before Singapore closes, so the
// three shifts meet with no gap between Monday and Friday. At weekends each
// city keeps 10 to 6, which leaves a few hours at night, and the page says
// so rather than claiming a round clock.
const chat = (): Shift => ({
  desk: "learners",
  label: "Learner chat",
  hours: [
    { days: WEEKDAYS, open: h(8), close: h(20) },
    { days: WEEKEND, open: h(10), close: h(18) },
  ],
});

export const offices: Office[] = [
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    tz: "Europe/Lisbon",
    hq: true,
    address: ["Rua da Boavista 71, 3rd floor", "1200-066 Lisbon, Portugal"],
    agent: "Inês",
    shifts: [
      chat(),
      { desk: "instructors", label: "Instructor calls", hours: [{ days: WEEKDAYS, open: h(9), close: h(18) }] },
    ],
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    tz: "America/Toronto",
    address: ["171 Spadina Avenue, Suite 500", "Toronto, ON M5T 2C6, Canada"],
    agent: "Noah",
    shifts: [
      chat(),
      { desk: "teams", label: "Teams desk", hours: [{ days: WEEKDAYS, open: h(9), close: h(18) }] },
    ],
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    tz: "Asia/Singapore",
    address: ["18 Telok Ayer Street, #04-02", "Singapore 048440"],
    agent: "Mei",
    shifts: [
      chat(),
      { desk: "instructors", label: "Instructor calls", hours: [{ days: WEEKDAYS, open: h(9), close: h(18) }] },
    ],
  },
];

export const officeById = (id: OfficeId) => offices.find((o) => o.id === id)!;

/** The addresses and numbers the page prints, in one place. `.example` is a
 *  reserved domain, so nothing sent from the demo reaches anybody. */
export const contactLines = {
  email: "help@mentora.example",
  phone: "+1 (416) 555-0148",
  phoneHref: "tel:+14165550148",
  teams: "teams@mentora.example",
};

/** How long each desk takes to answer a written message, as a median over
 *  the last 30 days. Minutes of the clock, not working minutes. */
export const replyMinutes: Record<DeskId, number> = {
  learners: 170,
  instructors: 360,
  teams: 225,
};

/** The median wait for a first line on the chat, over the same 30 days. */
export const chatReplyMinutes = 4;

// ─── The clock ──────────────────────────────────────────────────────────────

type Wall = { y: number; m: number; d: number; day: number; minutes: number };

const formatters = new Map<string, Intl.DateTimeFormat>();
const partsFormat = (tz: string) => {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    formatters.set(tz, f);
  }
  return f;
};

const DAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** The date and the time on the wall of a room in `tz` at `at`. */
export function wallClock(at: Date, tz: string): Wall & { s: number } {
  const p: Record<string, string> = {};
  for (const part of partsFormat(tz).formatToParts(at)) p[part.type] = part.value;
  return {
    y: Number(p.year),
    m: Number(p.month),
    d: Number(p.day),
    day: DAY_INDEX[p.weekday],
    minutes: Number(p.hour) * 60 + Number(p.minute),
    s: Number(p.second),
  };
}

/** The instant a clock in `tz` reads `minutes` past midnight on y-m-d. Two
 *  passes, so a date on the far side of a daylight-saving change still
 *  lands on the hour it names. */
export function zoned(tz: string, y: number, m: number, d: number, minutes: number) {
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  const offset = (t: number) => {
    const w = wallClock(new Date(t), tz);
    return Date.UTC(w.y, w.m - 1, w.d, 0, w.minutes, w.s) - Math.floor(t / 1000) * 1000;
  };
  let t = guess - offset(guess);
  t = guess - offset(t);
  return new Date(t);
}

const openIn = (hours: Hours[], w: Wall) =>
  hours.some((x) => x.days.includes(w.day) && w.minutes >= x.open && w.minutes < x.close);

/** The shift of `desk` an office keeps, if it keeps one. */
export const shiftOf = (o: Office, desk: DeskId) => o.shifts.find((s) => s.desk === desk);

/** Whether an office's shift of `desk` is answering at `at`. */
export const officeOpen = (o: Office, desk: DeskId, at: Date) => {
  const s = shiftOf(o, desk);
  return Boolean(s && openIn(s.hours, wallClock(at, o.tz)));
};

/** The office answering `desk` at `at`, the one that opened earliest when
 *  two overlap, since that is who picks up a waiting chat. */
export function onShift(desk: DeskId, at: Date) {
  return offices.find((o) => officeOpen(o, desk, at)) ?? null;
}

const STEP = 15 * 60 * 1000;

/** When `desk` next opens anywhere after `at`, and where, in quarter hours
 *  up to eight days out. */
export function nextOpening(desk: DeskId, at: Date) {
  let t = Math.ceil(at.getTime() / STEP) * STEP;
  const end = t + 8 * 24 * 60 * 60 * 1000;
  for (; t < end; t += STEP) {
    const when = new Date(t);
    const office = onShift(desk, when);
    if (office) return { when, office };
  }
  return null;
}

/** When the desk answering at `at` stops answering, with every hand-over
 *  counted as one run. */
export function openUntil(desk: DeskId, at: Date) {
  let t = Math.ceil(at.getTime() / STEP) * STEP;
  const end = t + 8 * 24 * 60 * 60 * 1000;
  for (; t < end; t += STEP) if (!onShift(desk, new Date(t))) return new Date(t);
  return null;
}

/** Hours `desk` is answering somewhere during one office-local day, counted
 *  in quarter hours: the figure the offices section prints for the day. */
export function hoursCovered(desk: DeskId, tz: string, y: number, m: number, d: number) {
  const start = zoned(tz, y, m, d, 0).getTime();
  const next = zoned(tz, y, m, d + 1, 0).getTime();
  let quarters = 0;
  for (let t = start; t < next; t += STEP) if (onShift(desk, new Date(t))) quarters += 1;
  return quarters / 4;
}

/** The shift's opening hours on a weekday, if it opens that day. */
export const hoursOn = (s: Shift, day: number) => s.hours.find((x) => x.days.includes(day)) ?? null;

// ─── Words for a time ───────────────────────────────────────────────────────

const timeFormats = new Map<string, Intl.DateTimeFormat>();
/** "3:30 PM" on the wall in `tz`. */
export function clock(at: Date, tz: string) {
  let f = timeFormats.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });
    timeFormats.set(tz, f);
  }
  return f.format(at);
}

/** "Wed", "Thursday" or "Oct 2" in `tz`. */
export const dayName = (at: Date, tz: string, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: style }).format(at);
export const monthDay = (at: Date, tz: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, month: "short", day: "numeric" }).format(at);

/** The zone's short name as a clock would print it: "GMT+7", "EDT", "UTC". */
export const zoneName = (at: Date, tz: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value ?? tz;

/** How many whole days `b` falls after `a` on the calendar in `tz`. */
export function daysApart(a: Date, b: Date, tz: string) {
  const x = wallClock(a, tz);
  const y = wallClock(b, tz);
  return Math.round((Date.UTC(y.y, y.m - 1, y.d) - Date.UTC(x.y, x.m - 1, x.d)) / 86_400_000);
}

/** "2:00 AM", "tomorrow at 2:00 AM" or "Monday at 9:00 AM", read from `now`
 *  on the calendar in `tz`. */
export function whenFrom(now: Date, at: Date, tz: string) {
  const apart = daysApart(now, at, tz);
  if (apart <= 0) return clock(at, tz);
  if (apart === 1) return `tomorrow at ${clock(at, tz)}`;
  return `${dayName(at, tz, "long")} at ${clock(at, tz)}`;
}

/** "3 hours", "about 4 hours", "6 minutes" for a count of minutes. */
export function span(minutes: number) {
  // the figure and its unit kept on one line
  if (minutes < 60) return `${minutes}\u00a0minute${minutes === 1 ? "" : "s"}`;
  const hours = minutes / 60;
  const whole = Math.round(hours);
  return Math.abs(hours - whole) < 0.1 ? `${whole}\u00a0hour${whole === 1 ? "" : "s"}` : `about ${whole}\u00a0hours`;
}

/** The difference between two zones at `at`, in words: "7 hours ahead of
 *  you", "the same time as you". */
export function offsetWords(at: Date, office: string, visitor: string) {
  const a = wallClock(at, office);
  const b = wallClock(at, visitor);
  const diff = (Date.UTC(a.y, a.m - 1, a.d, 0, a.minutes) - Date.UTC(b.y, b.m - 1, b.d, 0, b.minutes)) / 60_000;
  if (diff === 0) return "the same time as you";
  const hrs = Math.abs(diff) / 60;
  const n = Number.isInteger(hrs) ? String(hrs) : hrs.toFixed(1);
  return `${n} hour${hrs === 1 ? "" : "s"} ${diff > 0 ? "ahead of" : "behind"} you`;
}
