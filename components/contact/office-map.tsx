"use client";

import { useId, useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { officesCopy } from "@/components/contact/copy";
import {
  clock,
  dayName,
  hoursCovered,
  hoursOn,
  officeById,
  officeOpen,
  offices,
  offsetWords,
  wallClock,
  zoned,
  type Office,
  type OfficeId,
} from "@/components/contact/desks";
import { useClock } from "@/components/contact/use-clock";
import { PINS, WORLD } from "@/components/contact/world";
import { float } from "@/components/float";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { whenPressed } from "@/components/ui/selected";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

type Clock = ReturnType<typeof useClock>;

// Where each point on the grid sits in the stage, as a share of its width
// and height, so a chip and its dot land on the same spot at every width.
const at = (p: { x: number; y: number }) => ({
  left: `${(p.x / WORLD.width) * 100}%`,
  top: `${(p.y / WORLD.height) * 100}%`,
});

// The hand-over the chat makes, city to city, drawn as the arcs between the
// chips: Toronto hands to Singapore across the top of the map, Singapore to
// Lisbon, Lisbon to Toronto. Two of the three are drawn, as the reference
// joins its three chips with two, and the long one would cross every card.
const ARCS: [OfficeId, OfficeId, number][] = [
  ["toronto", "lisbon", -9],
  ["lisbon", "singapore", -14],
];

// The cards laid on the map from lg up: the office to the left under
// Toronto, the figure high on the right, the hours low in the middle, each
// clear of the chip nearest it.
const panel = cn(float, "rounded-[calc(var(--radius-lg)-6px)] bg-card");

export function OfficeMap({ now }: { now: string }) {
  const c = officesCopy;
  const id = useId();
  const time = useClock(now);
  const [picked, setPicked] = useState<OfficeId>("lisbon");
  const office = officeById(picked);

  // The day the hours card shows, on the office's own calendar: today there
  // unless a day in its week is pressed. Kept as an offset from today so it
  // follows the office when another is picked.
  const [dayOffset, setDayOffset] = useState(0);
  const [inMine, setInMine] = useState<"office" | "mine">("office");

  const today = wallClock(time.now, office.tz);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(today.y, today.m - 1, today.d - today.day + i));
    return { offset: i - today.day, day: i, y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
  });
  const shown = week.find((w) => w.offset === dayOffset) ?? week[today.day];
  const covered = hoursCovered("learners", office.tz, shown.y, shown.m, shown.d);
  const shownName = dayName(zoned(office.tz, shown.y, shown.m, shown.d, 720), office.tz, "long");

  const office_ = (
    <OfficeCard office={office} time={time} className="w-full" />
  );
  const figure = (
    <div className="flex flex-col">
      <p className="flex items-baseline gap-2">
        <span className="font-heading text-6xl tabular-nums tracking-tighter">
          {Number.isInteger(covered) ? covered : covered.toFixed(1)}
        </span>
        <span className="text-base">{c.figure}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{c.figureLine(shownName)}</p>
    </div>
  );
  const hours = (
    <HoursCard
      office={office}
      time={time}
      week={week}
      shown={shown}
      todayOffset={0}
      onDay={setDayOffset}
      inMine={inMine}
      onZone={setInMine}
    />
  );

  return (
    <section id="offices" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="text-center">
        <Eyebrow className="justify-center">{c.eyebrow}</Eyebrow>
        <SectionHeading className="mx-auto mt-5">{c.heading}</SectionHeading>
        <p className="mx-auto mt-5 max-w-[34rem] text-base text-muted-foreground">{c.lede}</p>
      </div>

      {/* Under lg the city is picked from a track over the map, which has
          no room for chips a thumb can press. */}
      <TabTrack
        kind="radios"
        label={c.eyebrow}
        idPrefix={`${id}-city`}
        options={offices.map((o) => ({ id: o.id, label: o.city }))}
        value={picked}
        onChange={(o) => {
          setPicked(o);
          setDayOffset(0);
        }}
        className="mx-auto mt-10 w-full max-w-md lg:hidden [&>button]:flex-1"
      />

      <div data-picture className="relative mt-8 lg:mt-14 lg:pb-20">
        <div className="relative aspect-[182/95] w-full">
          <svg
            aria-hidden="true"
            viewBox={`-1 -1 ${WORLD.width + 2} ${WORLD.height + 2}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full text-foreground/20 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          >
            <path d={WORLD.d} fill="none" stroke="currentColor" strokeWidth={0.42} strokeLinecap="round" strokeDasharray="0 1" />
          </svg>
          {/* The hand-over, drawn over the dots and under the cards, dashed
              so it reads as a route rather than a border. */}
          <svg
            aria-hidden="true"
            viewBox={`-1 -1 ${WORLD.width + 2} ${WORLD.height + 2}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible text-foreground/45"
          >
            {ARCS.map(([a, b, lift]) => {
              const p = PINS[a];
              const q = PINS[b];
              return (
                <path
                  key={a + b}
                  d={`M${p.x} ${p.y} Q${(p.x + q.x) / 2} ${Math.min(p.y, q.y) + lift} ${q.x} ${q.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.25}
                  strokeDasharray="4 5"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {offices.map((o) => {
            const on = o.id === picked;
            return (
              <div key={o.id} className="group/pin absolute" style={at(PINS[o.id])}>
                {/* the pin, at the point, where a phone has no room for the
                    chip that stands on it from lg */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-0 left-0 size-3 -translate-1/2 rounded-full bg-foreground/60 ring-4 ring-card transition-colors group-has-[button[aria-pressed=true]]/pin:bg-primary-ink group-has-[button[aria-pressed=true]]/pin:ring-chip lg:hidden",
                  )}
                />
                {/* the chip standing on the point, where the arcs meet it */}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setPicked(o.id);
                    setDayOffset(0);
                  }}
                  className={cn(
                    "absolute top-0 left-0 hidden h-10 -translate-1/2 items-center gap-2 rounded-control px-4 text-sm whitespace-nowrap press active:shadow-none lg:inline-flex",
                    "bg-card shadow-soft hover:shadow-soft-lg",
                    whenPressed,
                  )}
                >
                  <span className="font-medium">{o.city}</span>
                  <span className="text-muted-foreground tabular-nums">{clock(time.now, o.tz)}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* From lg the three cards float on the map; under it they stack
            beneath, the office first. */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:contents">
          <div data-object className={cn(panel, "p-5 lg:absolute lg:top-[46%] lg:left-0 lg:w-[19.5rem]")}>{office_}</div>
          <div data-object className={cn(panel, "px-6 py-5 lg:absolute lg:top-[6%] lg:right-[2%] lg:w-[15.5rem]")}>{figure}</div>
          <div data-object className={cn(panel, "p-5 md:col-span-2 lg:absolute lg:bottom-0 lg:left-[36%] lg:w-[23rem]")}>{hours}</div>
        </div>
      </div>
    </section>
  );
}

function OfficeCard({ office, time, className }: { office: Office; time: Clock; className?: string }) {
  const c = officesCopy;
  const [copied, setCopied] = useState(false);
  const address = office.address.join(", ");
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const wall = clock(time.now, office.tz);
  const day = dayName(time.now, office.tz, "long");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // the address is on the card to be read off
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-xl tracking-tight">{office.city}</p>
        {office.hq && (
          <span className="inline-flex h-7 items-center rounded-control bg-chip px-2.5 text-xs font-medium text-primary-ink">
            {c.hq}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-start gap-2 rounded-sm bg-accent py-3 pr-1.5 pl-4">
          <div className="min-w-0 flex-1">
            <Caps>{c.address}</Caps>
            <p className="mt-1.5 text-sm">
              {office.address[0]}
              <br />
              {office.address[1]}
            </p>
          </div>
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
        <div className="rounded-sm bg-accent px-4 py-3">
          <Caps>{c.localTime}</Caps>
          {/* two lines in every state, the gap to the visitor's zone
              held open until the zone is known */}
          <p className="mt-1.5 text-sm tabular-nums">
            <span className="font-medium">{wall}</span>, {day}
          </p>
          <p className="text-sm text-muted-foreground">{time.live ? offsetWords(time.now, office.tz, time.tz) : "\u00a0"}</p>
        </div>
      </div>

      <Button render={<a href={maps} target="_blank" rel="noreferrer" />} nativeButton={false} className="mt-4 w-full">
        {c.directions}
        <ArrowUpRightIcon data-icon="inline-end" />
      </Button>
    </div>
  );
}

type WeekDay = { offset: number; day: number; y: number; m: number; d: number };

function HoursCard({
  office,
  time,
  week,
  shown,
  todayOffset,
  onDay,
  inMine,
  onZone,
}: {
  office: Office;
  time: Clock;
  week: WeekDay[];
  shown: WeekDay;
  todayOffset: number;
  onDay: (offset: number) => void;
  inMine: "office" | "mine";
  onZone: (z: "office" | "mine") => void;
}) {
  const c = officesCopy;
  const id = useId();
  const tz = inMine === "mine" ? time.tz : office.tz;
  const isToday = shown.offset === todayOffset;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{c.schedule}</p>
          <p className="truncate text-sm text-muted-foreground">{office.city}</p>
        </div>
        <TabTrack
          kind="radios"
          on="card"
          label={c.showIn}
          idPrefix={`${id}-zone`}
          options={[
            { id: "office", label: c.officeTime },
            { id: "mine", label: c.yourTime },
          ]}
          value={inMine}
          onChange={onZone}
          className="shrink-0 [&>button]:px-3"
        />
      </div>

      {/* The office's week, today already picked. */}
      <div role="group" aria-label={c.schedule} className="mt-4 grid grid-cols-7 gap-1">
        {week.map((w) => {
          const on = w.offset === shown.offset;
          const today = w.offset === todayOffset;
          const at = zoned(office.tz, w.y, w.m, w.d, 720);
          return (
            <div key={w.offset} className="flex flex-col items-center gap-1.5">
              <span aria-hidden="true" className="text-xs text-muted-foreground">
                {dayName(at, office.tz)}
              </span>
              {/* today wears the brand's tint whether or not it is the day
                  picked; the picked one adds the ring */}
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${dayName(at, office.tz, "long")} ${w.d}`}
                onClick={() => onDay(w.offset)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-control text-sm tabular-nums press",
                  "aria-pressed:ring-2 aria-pressed:ring-inset aria-pressed:ring-(--frame-ink)",
                  today
                    ? "bg-chip text-primary-ink aria-pressed:hover:shadow-soft not-aria-pressed:hover:ring-1 not-aria-pressed:hover:ring-inset not-aria-pressed:hover:ring-ring"
                    : "hover:bg-accent aria-pressed:bg-card aria-pressed:hover:bg-accent",
                )}
              >
                {w.d}
              </button>
            </div>
          );
        })}
      </div>

      {/* One row a shift, on a rule joining them, each node lit while that
          shift is answering. */}
      <ol className="relative mt-5 flex flex-col gap-4 before:absolute before:top-5 before:bottom-5 before:left-[0.9375rem] before:w-px before:bg-border before:content-['']">
        {office.shifts.map((s) => {
          const hrs = hoursOn(s, shown.day);
          const openNow = isToday && officeOpen(office, s.desk, time.now);
          let span = c.closed;
          if (hrs) {
            const from = zoned(office.tz, shown.y, shown.m, shown.d, hrs.open);
            const to = zoned(office.tz, shown.y, shown.m, shown.d, hrs.close);
            const later = wallClock(to, tz).d !== wallClock(from, tz).d;
            span = `${clock(from, tz)} – ${clock(to, tz)}${later ? ` ${c.nextDay}` : ""}`;
          }
          return (
            <li key={s.label} className="relative flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "relative flex size-8 shrink-0 items-center justify-center rounded-full",
                  openNow ? "bg-chip text-primary-ink" : "bg-card ring-1 ring-inset ring-border",
                )}
              >
                {openNow && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.2} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-sm text-muted-foreground tabular-nums">{span}</p>
              </div>
              {openNow && (
                <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-control bg-leaf/15 px-2.5 text-xs font-medium text-leaf-ink">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-leaf" />
                  {c.openNow}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
