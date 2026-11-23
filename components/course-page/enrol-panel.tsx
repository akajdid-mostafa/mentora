"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  courseSlug,
  lessonHref,
  priceLabel,
  type Course,
} from "@/components/course/courses";
import { tiers } from "@/components/marketing/tiers";
import {
  dateLabel,
  dayLabel,
  finishAt,
  localToday,
  startsFor,
  type Start,
} from "@/components/course-page/start";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import {
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderSteps,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { viewportObserver } from "@/lib/viewport-observer";

const never = () => () => {};

/** Today as the visitor's calendar has it. The server's date renders first,
 *  so the page hydrates on the markup it was sent, and the visitor's own day
 *  replaces it on the render after — the difference only shows around
 *  midnight, and only for as long as that one render. */
function useToday(server: string) {
  return useSyncExternalStore(never, localToday, () => server);
}

/** Whether a scrolling box has more below its fold, so its foot can fade
 *  and say so. Read on scroll and whenever the box or its list resizes. */
function useMoreBelow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [more, setMore] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener("scroll", read, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", read);
    };
  }, []);
  return [ref, more] as const;
}

/** The panel that buys the course: the price, the two ways in, and when to
 *  start. Beside the syllabus it rides down the page; on a phone it sits in
 *  the flow, and once it has scrolled away a bar at the foot of the screen
 *  keeps the price and the button in reach. */
export function EnrolPanel({ course: c, today: serverToday }: { course: Course; today: string }) {
  const today = useToday(serverToday);
  const starts = startsFor(c, today);
  const [picked, setPicked] = useState<string>("self");
  const [pace, setPace] = useState(c.hours);
  const start = starts.find((s) => s.key === picked) ?? starts[0];
  const [list, more] = useMoreBelow<HTMLDivElement>();

  const cta = useRef<HTMLAnchorElement>(null);
  const [away, setAway] = useState(false);
  useEffect(() => {
    const el = cta.current;
    if (!el) return;
    // Away means scrolled past, above the top of the screen: the bar is for
    // the reader who has gone on down the syllabus, not for one who has not
    // reached the button yet. The root runs far below the screen, so the
    // button counts as in view all the way down there and only leaving past
    // the top turns the bar on; a jump straight back to the top of the page
    // is then a change the observer sees, and the bar goes away with it.
    const io = viewportObserver(([e]) => setAway(!e.isIntersecting), {
      rootMargin: "0px 0px 10000px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paid = c.price > 0;
  const href = `/checkout?course=${courseSlug(c)}&start=${start.key}`;
  const label = paid ? `Enroll for ${priceLabel(c.price)}` : "Enroll for free";
  const finish = finishAt(c, today, pace);
  // The pace runs to twice the course's own hours, and never under twelve.
  const most = Math.max(12, c.hours * 2);

  // One tab stop for the whole choice, on the row that is chosen, and the
  // arrow keys to move it, as a set of radios works everywhere else. A full
  // cohort is passed over.
  const open = starts.filter((s) => s.kind === "self" || s.left > 0);
  const step = (e: KeyboardEvent<HTMLButtonElement>, from: string) => {
    const by = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!by) return;
    e.preventDefault();
    const at = open.findIndex((s) => s.key === from);
    const next = open[(at + by + open.length) % open.length];
    setPicked(next.key);
    e.currentTarget
      .closest("[role=radiogroup]")
      ?.querySelector<HTMLElement>(`[data-start="${next.key}"]`)
      ?.focus();
  };
  const row = (s: Start) => (
    <StartRow
      key={s.key}
      start={s}
      on={s.key === start.key}
      onPick={() => setPicked(s.key)}
      onKeyDown={(e) => step(e, s.key)}
      finish={s.kind === "self" ? dayLabel(finish.key) : undefined}
    />
  );
  const self = starts.find((s) => s.kind === "self");
  const cohortRows = starts.filter((s) => s.kind === "cohort");

  return (
    <>
      {/* Beside the syllabus the panel is held to the screen's height, less
          the header above it and a margin below, so on a short laptop its
          foot is never under the screen's edge: the price and the buttons
          stay whole, and the ways to start scroll inside it instead. */}
      <div
        data-object
        className="rounded-lg bg-card p-5 shadow-soft sm:p-6 lg:flex lg:max-h-[calc(100dvh_-_7rem)] lg:flex-col"
      >
        <div className="shrink-0">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-heading text-4xl tracking-tighter tabular-nums">
              {priceLabel(c.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {paid ? "once, yours to keep" : "tutor included"}
            </span>
          </p>
          {paid && (
            <p className="mt-1 text-sm text-muted-foreground">
              Or in{" "}
              <Link
                href="/pricing"
                className={cn("text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground", reach)}
              >
                {tiers[1].name}
              </Link>{" "}
              for ${tiers[1].monthly} a month
            </p>
          )}

          <Button
            render={<Link ref={cta} href={href} />}
            size="lg"
            className={cn("mt-5 w-full", reach)}
          >
            {label}
            <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
          </Button>
          <Link
            href={lessonHref(c)}
            className={cn(
              "mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-control px-5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent",
              reach,
            )}
          >
            <PlayIcon aria-hidden="true" className="size-3.5" />
            {paid ? "Start lesson one free" : "Start lesson one"}
          </Link>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {paid ? "Your money back within 30 days" : "No card, now or later"}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="When to start"
          className="mt-5 border-t pt-5 lg:flex lg:min-h-0 lg:flex-col"
        >
          <Caps className="shrink-0">Start</Caps>
          {/* The margin and padding that cancel each other leave room for a
              focus ring at the scrolling box's edges, which would cut it. */}
          <div
            ref={list}
            className={cn(
              "no-scrollbar -m-1 mt-2 p-1 lg:min-h-0 lg:overflow-y-auto",
              more && "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_2.5rem),transparent)]",
            )}
          >
            <div>
              {self && row(self)}
              {/* The pace belongs to the self-paced row, so it sits under
                  it and moves that row's finish date as it is dragged. It
                  stays while a cohort is picked, locked, so the rows under
                  it never move when the start changes. */}
              {self && (
                <SliderRoot
                  value={pace}
                  onValueChange={(v) => setPace(v)}
                  disabled={start.kind !== "self"}
                  min={1}
                  max={most}
                  step={1}
                  className="px-5 pb-1 pt-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <SliderLabel>Hours you have a week</SliderLabel>
                    <span className="text-sm tabular-nums">
                      {pace} {pace === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                  {/* the hours in steps, a dash an hour, the ones taken in
                      the brand and the rest pale, so the week reads as a
                      count */}
                  <SliderControl>
                    <SliderTrack className="relative bg-transparent">
                      <SliderSteps value={pace} min={1} max={most} />
                      <SliderThumb />
                    </SliderTrack>
                  </SliderControl>
                </SliderRoot>
              )}

              {/* What every cohort shares is said once, over the rows,
                  which leaves each row its dates and its seats. */}
              {cohortRows.length > 0 && (
                <>
                  <Caps className="mt-5">Cohorts · live Thursdays</Caps>
                  <div className="mt-2 flex flex-col gap-2">{cohortRows.map(row)}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* The phone's bar: the price and the same button, once the panel's
          own button has scrolled off the top. Solid rather than frosted —
          the header already spends the page's blur. */}
      <div
        aria-hidden={!away}
        inert={!away}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t bg-background px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-soft-lg transition-[translate,transform,visibility] duration-sheet ease-sheet motion-reduce:transition-none lg:hidden",
          // hidden as well as moved, so nothing of it is ever drawn below the
          // screen's edge, where an overscroll or a tall capture would show it
          away ? "visible translate-y-0" : "invisible translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <p className="min-w-0">
            <span className="font-heading text-2xl tracking-tight tabular-nums">
              {priceLabel(c.price)}
            </span>
            <span className="block truncate text-sm text-muted-foreground">
              {start.kind === "self" ? "Start today, at your pace" : `Cohort from ${dateLabel(start.starts)}`}
            </span>
          </p>
          <Button render={<Link href={href} />} className="shrink-0">
            {paid ? "Enroll" : "Enroll free"}
          </Button>
        </div>
      </div>
    </>
  );
}

/** One way to start, as the reference's date rows are drawn. The self-paced
 *  row carries its finish date under it; a cohort row is one line, its first
 *  day in the ink that is read first and its last in the muted one, with the
 *  seats on the right. A full cohort keeps its row, sunk into the panel the
 *  way a disabled control is: no ring, the whisper fill, and muted ink, so the list still shows how quickly they go. */
function StartRow({
  start,
  on,
  onPick,
  onKeyDown,
  finish,
}: {
  start: Start;
  on: boolean;
  onPick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  finish?: string;
}) {
  const full = start.kind === "cohort" && start.left === 0;
  const few = start.kind === "cohort" && start.left > 0 && start.left <= 10;

  return (
    <button
      type="button"
      role="radio"
      data-start={start.key}
      aria-checked={on}
      aria-disabled={full || undefined}
      tabIndex={on ? 0 : -1}
      onClick={full ? undefined : onPick}
      onKeyDown={onKeyDown}
      className={cn(
        "flex w-full items-center gap-3 rounded-sm px-5 py-3.5 text-left transition-[box-shadow,background-color]",
        full
          ? "cursor-not-allowed bg-accent"
          : "aria-checked:bg-card aria-checked:ring-2 aria-checked:ring-inset aria-checked:ring-primary aria-checked:hover:ring-primary/70 aria-checked:active:bg-accent not-aria-checked:ring-1 not-aria-checked:ring-inset not-aria-checked:ring-border not-aria-checked:hover:bg-accent not-aria-checked:active:bg-muted",
      )}
    >
      {start.kind === "self" ? (
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">Today, at your own pace</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">Finish around {finish}</span>
        </span>
      ) : (
        <span className="min-w-0 flex-1 text-sm">
          <span className="sr-only">Cohort, </span>
          <span className={full ? "text-muted-foreground" : "font-medium"}>{dayLabel(start.starts)}</span>
          <span className="text-muted-foreground"> – {dateLabel(start.ends)}</span>
        </span>
      )}
      {start.kind === "cohort" && (
        <span
          className={cn(
            "shrink-0 text-sm tabular-nums",
            few ? "text-coral-ink" : "text-muted-foreground",
          )}
        >
          {full ? "Full" : `${start.left} left`}
        </span>
      )}
    </button>
  );
}
