"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { courseById, courseHref, teacherHref, teachers } from "@/components/course/courses";
import { portrait } from "@/components/marketing/quotes";
import { reach } from "@/components/reach";
import { storiesCopy } from "@/components/teach/copy";
import { Button } from "@/components/ui/button";
import { CarouselBars } from "@/components/ui/carousel-bars";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { viewportObserver } from "@/lib/viewport-observer";

// Each story joined to the catalogue: the face and trade the directory
// prints, and the course it names. A story whose teacher or course has left
// the catalogue drops out rather than printing a stranger.
const stories = storiesCopy.stories
  .map((s) => {
    const t = teachers.find((x) => x.name === s.name);
    const course = courseById(s.course);
    return t?.portrait && course ? { ...s, trade: t.trade, face: t.portrait, course } : null;
  })
  .filter((s) => s !== null);

// One URL per face, card and sliver alike, so the photograph a sliver has
// already fetched is the one its card opens on.
const photo = (face: string) => portrait(face, 960);

// How long a story stands before the next takes its place.
const DWELL = 4000;

// A reader's ask for less motion, read as it stands and followed if it
// changes while the page is open. The server draws the carousel turning, as
// most readers get it, and it stands still once the page has loaded for a
// reader who asked.
const STILL = "(prefers-reduced-motion: reduce)";
const prefersStill = () => window.matchMedia(STILL).matches;
function onMotionChange(tell: () => void) {
  const m = window.matchMedia(STILL);
  m.addEventListener("change", tell);
  return () => m.removeEventListener("change", tell);
}

export function StoriesCarousel() {
  const c = storiesCopy;
  const n = stories.length;
  const [at, setAt] = useState(0);
  const start = useRef<number | null>(null);
  // The stories turn over on their own until a reader picks one, and hold
  // while the keyboard is inside the carousel or it is off the screen. A
  // pointer over it does not hold them. A reader who asks for less motion
  // gets the first story and the choice.
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const still = useSyncExternalStore(onMotionChange, prefersStill, () => false);
  const turning = auto && !still;
  const frame = useRef<HTMLDivElement>(null);
  // Each story's course link, and whether an arrow key was pressed on one:
  // the story it sat in is about to go inert, so the keys follow the new one.
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const follow = useRef(false);

  useEffect(() => {
    if (!follow.current) return;
    follow.current = false;
    links.current[at]?.focus();
  }, [at]);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    // A quarter in view counts as seen: a phone held sideways never shows
    // much more of a card this tall. By its ratio, since a card leaving
    // the screen still intersects on its way out.
    const io = viewportObserver(([e]) => setSeen(e.intersectionRatio >= 0.25), {
      threshold: [0, 0.25],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    setAuto(false);
    setAt(i);
  };
  const go = (by: number) => {
    setAuto(false);
    setAt((i) => (i + by + n) % n);
  };

  // The neighbours drawn at the card's sides, nearest first: two a side when
  // five or more stories stand, fewer when fewer do, the odd one on the
  // right, so no face is ever drawn twice.
  const left = Math.min(2, Math.floor((n - 1) / 2));
  const right = Math.min(2, n - 1 - left);
  const side = (dir: 1 | -1, k: number) =>
    Array.from({ length: k }, (_, j) => (at + dir * (j + 1) + n * 3) % n);

  if (!n) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow className="justify-center">{c.eyebrow}</Eyebrow>
      <SectionHeading className="mx-auto mt-5 text-center">{c.heading}</SectionHeading>
      <p className="mx-auto mt-4 max-w-[26rem] text-center text-base text-muted-foreground">{c.lede}</p>

      {/* The card and its controls as one: focus anywhere in them holds
          the stories, so a reader on the keys is never moved on from the
          story they are reading, and the arrow keys move the stories from
          anywhere in them. */}
      <div
        ref={frame}
        onFocus={() => setHeld(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false);
        }}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          follow.current = e.target instanceof Element && e.target.closest("article") !== null;
          go(e.key === "ArrowRight" ? 1 : -1);
        }}
      >
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={c.heading}
          className="mt-12 flex items-center justify-center gap-3 lg:gap-4"
        >
          <Slivers ids={side(-1, left).reverse()} near="end" onPick={pick} />

          {/* One card, and every story stacked in it: the card holds the
              height of the tallest at every width, so the controls under it
              never move, and each story's photograph has loaded before it is
              opened. The words and the photograph cross-fade; the card itself
              stays put. A shorter story gives its spare height to the space
              above its quote, so the figure keeps its place under the
              photograph and the names keep theirs at the foot. A swipe on a
              phone moves it on, as the arrows do. */}
          <div
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse") start.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (start.current === null) return;
              const dx = e.clientX - start.current;
              start.current = null;
              if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              start.current = null;
            }}
            className="grid w-full max-w-[50rem] min-w-0 touch-pan-y rounded-lg bg-card p-2 shadow-soft"
          >
            {stories.map((s, i) => {
              const on = i === at;
              return (
                <article
                  key={s.name}
                  inert={!on}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}: ${s.name}`}
                  className={cn(
                    "grid grid-cols-1 grid-rows-[auto_1fr] gap-2 transition-opacity duration-sheet ease-sheet [grid-area:1/1] md:grid-cols-[1fr_0.92fr] md:grid-rows-1 motion-reduce:transition-none",
                    on ? "opacity-100" : "opacity-0",
                  )}
                >
                  <div className="order-last flex flex-col p-5 sm:p-7 md:order-none">
                    <p className="font-heading text-4xl tracking-tighter tabular-nums sm:text-5xl">{s.figure}</p>
                    <p className="mt-2 max-w-[20rem] text-base text-muted-foreground">{s.caption}</p>
                    {/* The opening mark hangs in the margin, so every line of
                        the quote starts on one edge. It keeps the caption's
                        measure, so it breaks the same way where the card
                        narrows beside the slivers at lg as at its full width. */}
                    <blockquote className="mt-auto pt-10 text-xl tracking-tight lg:text-2xl">
                      <p className="max-w-[20rem] -indent-[0.37em]">&ldquo;{s.quote}&rdquo;</p>
                    </blockquote>
                    {/* The name opens the profile, where the four checks behind
                        the badge are; the trade beside it is a label. */}
                    <p className="mt-6 flex flex-wrap gap-2">
                      <Link
                        href={teacherHref(s.name)}
                        className={cn(
                          "inline-flex h-8 items-center rounded-control bg-muted px-3 text-sm font-medium press hover:bg-secondary",
                          reach,
                        )}
                      >
                        {s.name}
                      </Link>
                      <span className="inline-flex h-8 items-center rounded-control bg-muted px-3 text-sm">
                        {s.trade}
                      </span>
                    </p>
                  </div>

                  <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] bg-muted sm:aspect-[4/3] md:aspect-auto md:min-h-[30rem]">
                    <Image
                      src={photo(s.face)}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 420px, 92vw"
                      className="object-cover object-[50%_20%]"
                    />
                    {/* The course the story is about, where the reference sets
                        the customer's wordmark: a white card a reader can
                        follow, its title given two lines rather than cut. */}
                    <Link
                      ref={(el) => {
                        links.current[i] = el;
                      }}
                      href={courseHref(s.course)}
                      className="group/course absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3 rounded-control bg-card py-2.5 pr-3 pl-4 shadow-soft press hover:shadow-soft-lg active:shadow-none sm:left-auto sm:max-w-[calc(100%-1.5rem)]"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs text-muted-foreground">{c.teaches}</span>
                        <span className="line-clamp-2 text-sm font-medium">{s.course.title}</span>
                      </span>
                      <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover/course:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <Slivers ids={side(1, right)} near="start" onPick={pick} />
        </div>

        {/* The bars keep the time while the stories turn over: the open one
            fills, and the next story opens when it is full. */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label={c.prev}>
            <ChevronLeftIcon />
          </Button>
          <CarouselBars
            count={n}
            at={at}
            onPick={pick}
            label={(i) => `Show ${stories[i].name}`}
            dwell={turning ? DWELL : undefined}
            paused={held || !seen}
            onDone={() => setAt((i) => (i + 1) % n)}
            // five 44px cells and the two arrows ran 26px past each edge at
            // 320; below 360 the cells close up to 32px, still a fair target
            className="max-[359px]:[&>button]:w-8 max-[359px]:[&>button>span]:w-7"
          />
          <Button variant="outline" size="icon" onClick={() => go(1)} aria-label={c.next}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      {/* Read out when a reader moves the stories, and quiet while they turn
          over on their own, which would speak every four seconds. */}
      <p aria-live={turning ? "off" : "polite"} className="sr-only">
        {stories[at].name}, {stories[at].figure} {stories[at].caption}
      </p>
    </section>
  );
}

/** The next cards waiting at the card's side: a narrow crop of each one's
 *  photograph in a white frame, the one beside the card taller than the one
 *  past it. The near pair is drawn from lg and the far pair from xl, where
 *  the row has room for them beside a card that keeps its two columns.
 *  Pressing one brings its story forward. They are a pointer's shortcut and
 *  out of the tab order: the bars already name every story for the keys and
 *  a screen reader. Every face stands in every frame and the one on show
 *  fades in, so the sides turn over with the card rather than a beat before
 *  it. `ids` runs left to right. */
function Slivers({
  ids,
  near,
  onPick,
}: {
  ids: number[];
  /** Which end of `ids` stands beside the card. */
  near: "start" | "end";
  onPick: (i: number) => void;
}) {
  return (
    <div aria-hidden="true" className="hidden shrink-0 items-center gap-3 lg:flex">
      {ids.map((i, k) => {
        const beside = near === "start" ? k === 0 : k === ids.length - 1;
        return (
          <button
            key={k}
            type="button"
            tabIndex={-1}
            onClick={() => onPick(i)}
            className={cn(
              "group/sliver rounded-[calc(var(--radius-lg)-0.25rem)] bg-card p-1.5 shadow-soft transition-shadow hover:shadow-soft-lg active:shadow-none",
              !beside && "hidden xl:block",
            )}
          >
            <span
              className={cn(
                "relative block overflow-hidden rounded-[calc(var(--radius-lg)-0.625rem)] bg-muted",
                beside ? "h-[22rem] w-20" : "h-64 w-13",
              )}
            >
              {stories.map((y, j) => (
                <Image
                  key={y.name}
                  src={photo(y.face)}
                  alt=""
                  fill
                  unoptimized
                  sizes="80px"
                  className={cn(
                    "object-cover object-[50%_20%] grayscale-[35%] transition-[filter,opacity] duration-sheet ease-sheet group-hover/sliver:grayscale-0 motion-reduce:transition-none",
                    j === i ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}
