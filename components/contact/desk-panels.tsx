"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import {
  Building06Icon,
  CalendarAdd01Icon,
  Copy01Icon,
  MinusSignIcon,
  PlusSignIcon,
  Tick02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { learner } from "@/components/dashboard/learner";
import {
  SEATS_MAX,
  SEATS_MIN,
  SEAT_MONTHLY,
  SEAT_YEARLY,
  chatAnswers,
  chatFallback,
  desksCopy,
} from "@/components/contact/copy";
import {
  clock,
  contactLines,
  dayName,
  daysApart,
  nextOpening,
  offices,
  officeOpen,
  onShift,
  wallClock,
  zoneName,
  type DeskId,
} from "@/components/contact/desks";
import { useClock } from "@/components/contact/use-clock";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { whenPressed } from "@/components/ui/selected";
import { TabTrack } from "@/components/ui/tab-track";
import { cn, hash, icsText } from "@/lib/utils";

type Clock = ReturnType<typeof useClock>;

// A white card filling its panel at one inset on every side, its corner 6px
// tighter than the panel's, the step the site's other cards on a panel take,
// and the style's own lift, since on a tinted ground there is no rung above
// white to step to. A column, so what closes each card sits on its foot.
const card = "flex w-full min-w-0 flex-col rounded-[calc(var(--radius-lg)-6px)] bg-card p-5 shadow-soft";


/** The three ways in besides the form, one a visitor picks by who they are:
 *  a chat for learners, a call for instructors, an address for teams. Each
 *  card is the channel working, with the desk's hours read off the clock. */
export function DeskPanels({ now }: { now: string }) {
  const c = desksCopy;
  const time = useClock(now);
  const panels = [
    { key: "learners", surface: "bg-lime-surface", copy: c.learners, body: <ChatCard time={time} /> },
    { key: "instructors", surface: "bg-iris-surface", copy: c.instructors, body: <CallCard time={time} /> },
    { key: "teams", surface: "bg-sun-surface", copy: c.teams, body: <TeamsCard time={time} /> },
  ] as const;

  return (
    <section id="desks" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="text-center">
        <Eyebrow className="justify-center">{c.eyebrow}</Eyebrow>
        <SectionHeading className="mx-auto mt-5">{c.heading}</SectionHeading>
        <p className="mx-auto mt-5 max-w-[34rem] text-base text-muted-foreground">{c.lede}</p>
      </div>

      {/* Each column is two rows of one grid from md, the panel and its
          words, so the three panels share one height whatever each card
          holds, and each card fills its panel to the same inset. */}
      <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {panels.map((p) => (
          <li key={p.key} className="flex min-w-0 flex-col gap-6 md:row-span-2 md:grid md:grid-cols-1 md:grid-rows-subgrid">
            {/* At two columns the third panel stands in a row of its own,
                where the subgrid cannot reach it, so there the three share a
                floor as tall as the tallest card needs. */}
            <div className={cn("flex rounded-lg p-4 sm:p-6 md:max-lg:min-h-[25rem]", p.surface)}>{p.body}</div>
            <div>
              <Caps>{p.copy.kicker}</Caps>
              <h3 className="mt-2.5 text-xl tracking-tight">{p.copy.title}</h3>
              <p className="mt-2 text-base text-muted-foreground">{p.copy.blurb}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "Open now" in the status hue, or when the desk opens next in the
 *  visitor's time, in the grey of a thing that is waiting. */
function Status({ desk, time }: { desk: DeskId; time: Clock }) {
  const open = onShift(desk, time.now);
  if (open)
    return (
      <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-control bg-leaf/15 px-2.5 text-xs font-medium text-leaf-ink">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-leaf" />
        {desksCopy.open}
      </span>
    );
  const next = nextOpening(desk, time.now);
  const when = next ? shortWhen(time.now, next.when, time.tz) : "";
  return (
    <span className="inline-flex h-7 shrink-0 items-center rounded-control bg-muted px-2.5 text-xs font-medium text-muted-foreground">
      {desksCopy.opensAt(when)}
    </span>
  );
}

/** "9 AM" or "9:30 AM" today, "Mon 9 AM" on a later day: short enough for a
 *  chip beside a card's title. */
const shortWhen = (now: Date, at: Date, tz: string) => {
  const t = clock(at, tz).replace(":00", "");
  return daysApart(now, at, tz) <= 0 ? t : `${dayName(at, tz)} ${t}`;
};

function CardHead({
  mark,
  title,
  sub,
  desk,
  time,
}: {
  mark: React.ReactNode;
  title: string;
  sub: string;
  desk: DeskId;
  time: Clock;
}) {
  return (
    // On a phone narrower than 390 the chip left the title four letters, so
    // there the title keeps the width of its words and the chip wraps under.
    <div className="flex items-center gap-3 max-sm:flex-wrap">
      {/* three cards abreast under xl leave the title no room beside the
          chip, so the glyph steps aside there */}
      <span className="contents lg:max-xl:hidden">{mark}</span>
      <div className="min-w-0 flex-1 max-sm:min-w-28">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-sm text-muted-foreground">{sub}</p>
      </div>
      <Status desk={desk} time={time} />
    </div>
  );
}

const glyphDisc = "flex size-10 shrink-0 items-center justify-center rounded-full";

// ─── Learners: the chat ─────────────────────────────────────────────────────

type Line = { from: "agent" | "you" | "note"; text: string };

function ChatCard({ time }: { time: Clock }) {
  const c = desksCopy.learners;
  const id = useId();
  const shift = onShift("learners", time.now);
  // Who greets: the city on shift, or the one that opens next.
  const next = shift ? null : nextOpening("learners", time.now);
  const office = shift ?? next?.office ?? offices[0];
  const [thread, setThread] = useState<Line[]>([]);
  const [draft, setDraft] = useState<string>(c.draft);
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  // The thread keeps its newest line in view, scrolled inside its own box so
  // the page never moves under the reader.
  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread, typing]);

  const first: Line = shift
    ? { from: "agent", text: c.hello(office.agent, learner.first) }
    : { from: "note", text: c.closed(next ? shortWhen(time.now, next.when, time.tz) : "") };

  const send = () => {
    const text = draft.trim();
    if (!text || typing) return;
    setThread((t) => [...t, { from: "you", text }]);
    setDraft("");
    document.getElementById(`${id}-draft`)?.focus();
    if (!shift) {
      const when = next ? shortWhen(time.now, next.when, time.tz) : "";
      setThread((t) => [...t, { from: "note", text: c.queued(office.agent, when) }]);
      return;
    }
    setTyping(true);
    const answer = chatAnswers.find((a) => a.match.test(text));
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setThread((t) => [...t, { from: "agent", text: answer ? answer.reply(office.agent) : chatFallback(office.agent) }]);
    }, 1400);
  };

  const lines = [first, ...thread];
  return (
    <div data-object className={card}>
      <CardHead
        mark={
          <span className={cn(glyphDisc, "bg-chip font-heading text-base text-primary-ink")}>
            {office.agent[0]}
          </span>
        }
        title={c.header}
        sub={c.from(office.agent, office.city)}
        desk="learners"
        time={time}
      />

      {/* The box takes whatever height the card has left, and scrolls
          inside, so a long answer or a long draft never grows the card or
          the panel under it. */}
      <div
        ref={box}
        role="log"
        aria-live="polite"
        aria-label={c.header}
        className="no-scrollbar mt-4 flex min-h-24 flex-1 basis-0 flex-col gap-2 overflow-y-auto rounded-sm bg-accent p-3"
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[85%] rounded-sm px-3 py-2 text-sm",
              l.from === "you" && "self-end bg-chip text-foreground",
              l.from === "agent" && "self-start bg-card text-foreground",
              l.from === "note" && "self-center bg-transparent px-1 text-center text-muted-foreground",
            )}
          >
            {l.from === "you" && <span className="sr-only">{c.you}: </span>}
            {l.text}
          </p>
        ))}
        {typing && (
          <p className="flex items-center gap-2 self-start rounded-sm bg-card px-3 py-2 text-sm text-muted-foreground">
            <span aria-hidden="true" className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                  style={{ animationDelay: `${d * 140}ms` }}
                />
              ))}
            </span>
            <span className="sr-only">{c.typing(office.agent)}</span>
          </p>
        )}
      </div>

      <form
        className="relative mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor={`${id}-draft`} className="sr-only">
          {c.field}
        </label>
        {/* The lesson tutor's field: one line at rest, growing with what
            is typed up to five, Enter to send and Shift+Enter for a new
            line. */}
        <textarea
          id={`${id}-draft`}
          name="message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Not while an input method is composing: there Enter picks the
            // word, and sending then would cut the message short.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          autoComplete="off"
          className="no-scrollbar field-sizing-content block max-h-32 min-h-12 w-full resize-none rounded-control bg-card py-3 pr-13 pl-4 text-base ring-1 ring-inset ring-border outline-none transition-shadow placeholder:text-muted-foreground hover:not-focus:ring-foreground/20 focus:ring-2 focus:ring-ring sm:text-sm"
        />
        {/* Locked while the box is empty or an answer is coming, as the
            lesson tutor's is; the press hands focus back to the box, so the
            next line is typed straight after the last. */}
        <button
          type="submit"
          aria-label={c.send}
          disabled={!draft.trim() || typing}
          className="absolute right-1.5 bottom-1.5 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground press hover:bg-primary/80 disabled:bg-muted disabled:text-muted-foreground"
        >
          <ArrowUpIcon aria-hidden="true" className="size-4" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}

// ─── Instructors: the call ──────────────────────────────────────────────────

type Slot = { iso: string; taken: boolean };
type Day = { key: string; label: string; long: string; slots: Slot[] };

const HALF_HOUR = 30 * 60_000;

/** The next three days in the visitor's calendar with six free half hours
 *  or more on the instructor desk, each thinned to six times spread across
 *  the hours the desk is open. A fixed share of them are taken, read off the
 *  time itself, so a slot keeps its state from one visit to the next. */
function callDays(now: Date, tz: string): Day[] {
  const days: Day[] = [];
  const today = wallClock(now, tz);
  for (let ahead = 1; days.length < 3 && ahead < 14; ahead++) {
    const start = Date.UTC(today.y, today.m - 1, today.d + ahead);
    const open: Date[] = [];
    // every half hour on that date in the visitor's zone, found by walking
    // the instants whose wall date is that date
    for (let t = start - 16 * 3_600_000; t < start + 40 * 3_600_000; t += HALF_HOUR) {
      const when = new Date(t);
      const w = wallClock(when, tz);
      if (Date.UTC(w.y, w.m - 1, w.d) !== start || w.minutes % 30 !== 0) continue;
      const end = new Date(t + 20 * 60_000);
      if (offices.some((o) => officeOpen(o, "instructors", when) && officeOpen(o, "instructors", end))) open.push(when);
    }
    if (open.length < 6) continue;
    const six = [0, 1, 2, 3, 4, 5].map((i) => open[Math.round((i * (open.length - 1)) / 5)]);
    const at = six[0];
    days.push({
      key: `${ahead}`,
      label: `${dayName(at, tz)} ${wallClock(at, tz).d}`,
      long: new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" }).format(at),
      slots: six.map((s, i) => ({ iso: s.toISOString(), taken: i !== 0 && hash(s.toISOString()) % 4 === 0 })),
    });
  }
  return days;
}

function CallCard({ time }: { time: Clock }) {
  const c = desksCopy.instructors;
  const id = useId();
  const days = useMemo(() => callDays(time.now, time.tz), [time.now, time.tz]);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  const bookedHeading = useRef<HTMLParagraphElement>(null);
  const bookButton = useRef<HTMLButtonElement>(null);

  // What is picked, or the first of what is on offer when the list has moved
  // under the pick: the zone arriving after hydration, or a new day.
  const day = days.find((d) => d.key === dayKey) ?? days[0];
  const free = day?.slots.filter((s) => !s.taken) ?? [];
  const slot = free.find((s) => s.iso === slotIso) ?? free[0];

  useEffect(() => {
    if (booked) bookedHeading.current?.focus();
  }, [booked]);

  if (!day || !slot) return null;
  const at = new Date(slot.iso);
  const label = `${day.long.replace(/,.*$/, "")}, ${clock(at, time.tz)}`;
  const when = `${day.long} at ${clock(at, time.tz)}`;

  const ics = () => {
    const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(at.getTime() + 20 * 60_000);
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mentora//Contact//EN",
      "BEGIN:VEVENT",
      `UID:instructor-call-${stamp(at)}@mentora`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(at)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${icsText("Mentora instructor call, 20 minutes")}`,
      `DESCRIPTION:${icsText("The video link arrives by email an hour before the call.")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentora-instructor-call.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-object className={cn(card, "grid grid-cols-1")}>
      {/* The picker and the booking share one cell, so the card keeps one
          height whichever is showing. */}
      <div inert={Boolean(booked)} className={cn("flex flex-col [grid-area:1/1]", booked && "invisible")}>
        <CardHead
          mark={
            <span className={cn(glyphDisc, "bg-iris/15 text-iris-ink")}>
              <HugeiconsIcon icon={Video01Icon} size={18} strokeWidth={1.7} aria-hidden="true" />
            </span>
          }
          title={c.header}
          sub={c.with}
          desk="instructors"
          time={time}
        />
        <span id={`${id}-day`} className="sr-only">
          {c.days}
        </span>
        <TabTrack
          kind="radios"
          on="card"
          labelledBy={`${id}-day`}
          idPrefix={`${id}-day`}
          options={days.map((d) => ({ id: d.key, label: d.label }))}
          value={day.key}
          onChange={(k) => setDayKey(k)}
          className="mt-4 w-full [&>button]:flex-1 [&>button]:px-1"
        />
        <p id={`${id}-slots`} className="mt-4 text-sm text-muted-foreground">
          {c.slots(time.live ? zoneName(at, time.tz) : undefined)}
        </p>
        <div role="group" aria-labelledby={`${id}-slots`} className="mt-2 grid grid-cols-2 gap-2 min-[360px]:grid-cols-3">
          {day.slots.map((s) => {
            const on = s.iso === slot.iso;
            return (
              <button
                key={s.iso}
                type="button"
                aria-pressed={on}
                disabled={s.taken}
                aria-label={s.taken ? `${clock(new Date(s.iso), time.tz)}, ${c.taken}` : undefined}
                onClick={() => setSlotIso(s.iso)}
                className={cn(
                  "h-10 rounded-control text-sm whitespace-nowrap tabular-nums press",
                  s.taken
                    ? "bg-accent text-muted-foreground"
                    : cn("ring-1 ring-inset ring-border hover:bg-accent", whenPressed, "aria-pressed:hover:bg-accent"),
                )}
              >
                {clock(new Date(s.iso), time.tz)}
              </button>
            );
          })}
        </div>
        <div className="mt-auto pt-4">
          <Button ref={bookButton} className="w-full" onClick={() => setBooked(slot.iso)}>
            {c.book(label)}
          </Button>
        </div>
      </div>

      <div inert={!booked} className={cn("flex flex-col justify-center [grid-area:1/1]", !booked && "invisible")}>
        <span className={cn(glyphDisc, "size-12 bg-chip text-primary-ink")}>
          <HugeiconsIcon icon={Tick02Icon} size={22} strokeWidth={2} aria-hidden="true" />
        </span>
        <p ref={bookedHeading} tabIndex={-1} className="mt-4 font-heading text-xl tracking-tight outline-none">
          {c.booked}
        </p>
        <p aria-live="polite" className="mt-1.5 text-sm text-muted-foreground">
          {booked ? c.bookedLine(when) : ""}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={ics}>
            <HugeiconsIcon icon={CalendarAdd01Icon} size={16} strokeWidth={1.8} aria-hidden="true" data-icon="inline-start" />
            {c.calendar}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setBooked(null);
              window.setTimeout(() => bookButton.current?.focus(), 0);
            }}
          >
            {c.change}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Teams: the address ─────────────────────────────────────────────────────

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function TeamsCard({ time }: { time: Clock }) {
  const c = desksCopy.teams;
  const id = useId();
  const [seats, setSeats] = useState(25);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const yearly = seats * SEAT_YEARLY;
  const saving = seats * SEAT_MONTHLY * 12 - yearly;
  const toronto = offices.find((o) => o.id === "toronto")!;
  const mail = `mailto:${contactLines.teams}?subject=${encodeURIComponent(c.subject(seats))}&body=${encodeURIComponent(c.body(seats, money(yearly)))}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactLines.teams);
    } catch {
      // the address stays on the card to be read off
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const step = (by: number) => setSeats((n) => Math.min(SEATS_MAX, Math.max(SEATS_MIN, n + by)));

  return (
    <div data-object className={card}>
      <CardHead
        mark={
          <span className={cn(glyphDisc, "bg-sun/15 text-sun-ink")}>
            <HugeiconsIcon icon={Building06Icon} size={18} strokeWidth={1.7} aria-hidden="true" />
          </span>
        }
        title={c.header}
        sub={toronto.city}
        desk="teams"
        time={time}
      />

      <div className="mt-4 flex h-12 items-center gap-2 rounded-sm bg-accent pr-1.5 pl-4">
        <span className="min-w-0 flex-1 truncate text-sm">{contactLines.teams}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? c.copied : c.copy}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground press after:absolute after:-inset-0.5 hover:bg-card hover:text-foreground"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? c.copied : ""}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span id={`${id}-seats`} className="text-sm">
          {c.seats}
        </span>
        <div role="group" aria-labelledby={`${id}-seats`} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-5)}
            disabled={seats <= SEATS_MIN}
            aria-label={c.fewer}
            className="flex size-10 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent disabled:bg-accent disabled:text-muted-foreground disabled:ring-0"
          >
            <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <output aria-live="polite" className="w-12 text-center font-heading text-xl tabular-nums tracking-tight">
            {seats}
          </output>
          <button
            type="button"
            onClick={() => step(5)}
            disabled={seats >= SEATS_MAX}
            aria-label={c.more}
            className="flex size-10 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent disabled:bg-accent disabled:text-muted-foreground disabled:ring-0"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="font-heading text-2xl tabular-nums tracking-tight">{c.yearly(money(yearly))}</p>
        <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">{c.saving(money(saving))}</p>
      </div>

      <div className="mt-auto pt-5">
        <Button render={<a href={mail} />} nativeButton={false} className="w-full">
          {c.quote}
        </Button>
      </div>
    </div>
  );
}
