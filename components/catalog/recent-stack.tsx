"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  courseById,
  courseHref,
  courses,
  lessonHref,
  priceLabel,
  teacherOf,
  type Course,
} from "@/components/course/courses";
import { clearRecent, recordView, useRecent, viewedLabel, type Viewed } from "@/components/course/recent";
import { float } from "@/components/float";
import { face } from "@/components/marketing/quotes";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

// When this page view began, for "Viewed 2 hours ago". Read once rather than
// on every render, so the labels hold still while somebody pages the deck.
const OPENED = Date.now();

// The fan, front to back. Each card sits a little lower and further right than
// the one in front of it and turns a few degrees more, and the step is smaller
// than the card's own corner radius, which is what makes three cards read as
// one deck rather than as three things.
const fan = [
  "z-30",
  "z-20 translate-x-1.5 translate-y-3 rotate-[1.5deg]",
  "z-10 translate-x-3 translate-y-6 rotate-[3deg]",
];

// How long a card stays at the front before the deck turns, which the bar
// over its photograph counts down.
const TURN = 6000;

/** The courses a visitor opened last, as a deck: the newest on top with its
 *  free first lesson a click away, the two before it fanned behind, and a bar
 *  of one segment a card at the top of the front card's photograph, the way a
 *  story reel is paged: the segments before the front card full, its own
 *  filling as the count runs down to the next, and every segment a way to
 *  jump. */
export function RecentStack({ className }: { className?: string }) {
  const history = useRecent();
  const deck = history
    .map((v) => ({ v, c: courseById(v.id) }))
    .filter((x): x is { v: Viewed; c: Course } => Boolean(x.c))
    .slice(0, 3);
  const [front, setFront] = useState(0);
  // The deck turns on its own until somebody takes it in hand: tabbing into
  // it holds the count where it is, and picking a card stops the turning for
  // good, with that card's segment left full. Nothing
  // turns for a reader who asked for less motion, or while the tab is out of
  // sight.
  const [held, setHeld] = useState(false);
  const [taken, setTaken] = useState(false);
  const [away, setAway] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const run = useRef<Animation | null>(null);
  const n = deck.length;
  // A deck that shrank under the bar (history cleared in another tab) falls
  // back to its first card rather than to nothing.
  const at = n ? front % n : 0;

  useEffect(() => {
    const look = () => setAway(document.hidden);
    document.addEventListener("visibilitychange", look);
    return () => document.removeEventListener("visibilitychange", look);
  }, []);

  // The count for the card at the front: its segment fills across over TURN,
  // and the deck turns when it arrives. Run on the Web Animations API, so the
  // compositor draws it and a pause holds it exactly where it is, rather than
  // a timer that restarts from nothing after every hold. It animates `scale`,
  // the property Tailwind's scale-x-* classes write, so the animation wins
  // over the class while it runs; animating `transform` instead left the
  // class's scale of 0 multiplied into every frame, and the fill invisible.
  useEffect(() => {
    const el = fill.current;
    if (n < 2 || taken || !el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = el.animate([{ scale: "0 1" }, { scale: "1 1" }], {
      duration: TURN,
      easing: "linear",
      fill: "forwards",
    });
    count.onfinish = () => setFront((f) => (f + 1) % n);
    run.current = count;
    return () => {
      count.cancel();
      run.current = null;
    };
  }, [at, n, taken]);

  useEffect(() => {
    const count = run.current;
    if (!count) return;
    if (held || away) count.pause();
    else count.play();
  }, [held, away, at, taken]);

  if (!n) return <EmptyDeck className={className} />;

  return (
    <div
      ref={box}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
      // isolate: the fan's z-indexes and the bar's stay inside the deck.
      // Below lg the deck stands straight under the search, and loose they
      // painted over its suggestions from the second row down. The padding
      // is the fan's: the lowest card's corner hangs 38px under the front
      // card at the widest the deck is drawn.
      data-recent-deck
      className={cn("relative isolate pb-10", className)}
    >
      {/* Named for a screen reader, which reaches the deck between the page's
          heading and the cards' own; the bar says it to the eye. */}
      <h2 className="sr-only">Recently viewed</h2>
      <ol aria-label="Recently viewed courses" className="grid grid-cols-1">
        {deck.map(({ v, c }, i) => {
          const pos = (i - at + n) % n;
          return (
            <li
              key={c.id}
              aria-hidden={pos !== 0 || undefined}
              inert={pos !== 0}
              className={cn(
                "col-start-1 row-start-1 transition-[translate,rotate] duration-morph ease-answer motion-reduce:transition-none",
                fan[pos],
              )}
            >
              <RecentCard course={c} viewed={v} front={pos === 0} lead={i === 0} />
            </li>
          );
        })}
      </ol>

      {n > 1 && (
        // Over the front card's photograph and not inside it, so the bar
        // holds still while the cards turn under it. The shade under it is
        // the reel's own: photographs of white desks leave a white bar on
        // nothing, so the top of the frame darkens enough to carry it. Shade
        // and bar are the fixed pair: the picture is as dark in either half.
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 rounded-t-lg bg-linear-to-b from-fixed-dark/50 via-fixed-dark/15 to-transparent pb-14">
          <div role="group" aria-label="Recently viewed, one card at a time" className="flex justify-center gap-1.5 pt-4">
            {deck.map(({ c }, i) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Show ${c.title}, ${i + 1} of ${n}`}
                aria-current={i === at || undefined}
                onClick={() => {
                  setTaken(true);
                  setFront(i);
                }}
                // 64px a segment and centered, rather than the frame's width
                // shared out: run edge to edge, three segments were a rule
                // across the photograph more than a count. 4px drawn and
                // 40px to press: the reach runs 18px above and below. It
                // thickens under the pointer, which reads on a full segment
                // and an empty one alike, written as a transform, the
                // property the hover gate reads, where Tailwind's scale
                // utility writes `scale`.
                className="pointer-events-auto relative h-1 w-16 rounded-full bg-fixed-light/45 transition-[transform,background-color] after:absolute after:inset-x-0 after:-inset-y-4.5 after:content-[''] hover:[transform:scaleY(1.5)] active:bg-fixed-light/70"
              >
                <span
                  ref={i === at ? fill : undefined}
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 origin-left rounded-full bg-fixed-light",
                    i < at || (i === at && taken)
                      ? "scale-x-100"
                      : i === at
                        ? "scale-x-0 motion-reduce:scale-x-100"
                        : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Said aloud only once somebody has hold of the deck: a line read out
          every six seconds, over whatever they were reading, is noise. */}
      <p aria-live={held || taken ? "polite" : "off"} className="sr-only">
        {deck[at].c.title}, viewed {at + 1} of {n}
      </p>
    </div>
  );
}

function RecentCard({
  course: c,
  viewed,
  front,
  lead,
}: {
  course: Course;
  /** When it was opened. Absent on the card that stands in for an empty
   *  history, which says so at the end of its chip row instead. */
  viewed?: Viewed;
  front: boolean;
  /** The newest course, whose photograph is the page's first large image
   *  and is fetched first; the two behind it wait their turn. */
  lead: boolean;
}) {
  const teacher = teacherOf(c);
  return (
    <article data-object className="overflow-hidden rounded-lg bg-card shadow-soft">
      {/* A card behind the front one shows its edge and nothing else, the
          way a deck does: its photograph peeking past the front card's edge
          read as a smudge rather than as a card. It comes up as it turns to
          the front. */}
      <div
        className={cn(
          "transition-opacity duration-sheet ease-sheet motion-reduce:transition-none",
          front ? "opacity-100 delay-150" : "opacity-0",
        )}
      >
      {/* The reference's upper half, a picture carrying the people: here the
          course's own photograph with its teacher's plate on it, and the
          play control for the lesson that costs nothing. Below sm the frame
          stands taller and the play control moves up to the middle of the
          photograph, between the bar and the plate: at 16:9 on a phone the
          two sat side by side along the foot and the plate ran under it. */}
      <div className="relative aspect-[4/3] bg-muted sm:aspect-[16/9]">
        <Image
          src={c.image}
          alt=""
          fill
          loading={lead ? "eager" : undefined}
          fetchPriority={lead ? "high" : undefined}
          sizes="(min-width: 1280px) 524px, (min-width: 1024px) calc(50vw - 116px), (min-width: 640px) 544px, calc(100vw - 96px)"
          className={cn("object-cover", c.focus === "bottom" && "object-bottom")}
        />
        {teacher.portrait && (
          <p
            className={cn(
              "absolute bottom-4 left-4 flex items-center gap-2.5 rounded-sm bg-card py-1.5 pl-1.5 pr-4",
              float,
            )}
          >
            <Image
              src={face(teacher.portrait, 96)}
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-full object-cover"
            />
            <span>
              <span className="block text-sm font-medium">{teacher.name}</span>
              <span className="block text-xs text-muted-foreground">{teacher.trade}</span>
            </span>
          </p>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-10 bottom-16 grid place-items-center sm:inset-auto sm:bottom-4 sm:right-4 sm:block">
          <Link
            href={lessonHref(c)}
            onClick={() => recordView(c.id)}
            aria-label={`Play lesson one of ${c.title}, free`}
            className={cn(
              "pointer-events-auto flex size-12 items-center justify-center rounded-full bg-card text-foreground transition-transform motion-safe:hover:[transform:scale(1.08)] motion-safe:active:[transform:scale(1.04)] sm:size-10",
              float,
            )}
          >
            <PlayIcon aria-hidden="true" className="size-5 translate-x-px sm:size-4" />
          </Link>
        </div>
      </div>

      <div className="p-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span className="inline-flex h-7 items-center whitespace-nowrap rounded-control bg-chip px-3 text-xs font-medium text-primary-ink">
            {viewed ? viewedLabel(viewed, OPENED) : "Most enrolled"}
          </span>
          {viewed ? (
            <button
              type="button"
              onClick={() => {
                // The deck gives way to the most enrolled course, and the
                // caret goes to its title rather than to the top of the page.
                clearRecent();
                requestAnimationFrame(() =>
                  document.querySelector<HTMLElement>("[data-recent-deck] h3 a")?.focus(),
                );
              }}
              className={cn(
                "whitespace-nowrap text-sm text-muted-foreground underline-offset-4 press hover:text-foreground hover:underline",
                reach,
              )}
            >
              Clear history
            </button>
          ) : (
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Nothing viewed yet
            </span>
          )}
        </div>
        {/* the focus ring's reach as padding, taken back by the margins, so
            the clip the ellipsis needs does not cut the ring */}
        <h3 className="-mx-1 -mb-0.5 mt-3 truncate px-1 py-0.5 text-xl font-medium">
          <Link
            href={courseHref(c)}
            onClick={() => recordView(c.id)}
            className="underline-offset-4 transition-colors hover:underline"
          >
            {c.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {c.school} · {c.credential}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
          <Link
            href={lessonHref(c)}
            onClick={() => recordView(c.id)}
            className={cn(
              "group/go inline-flex items-center gap-1.5 text-sm font-medium press hover:text-primary-ink",
              reach,
            )}
          >
            Watch lesson one, free
            <ArrowRightIcon className="size-4 transition-transform group-hover/go:translate-x-0.5" />
          </Link>
          <span className="font-heading text-xl tracking-tight tabular-nums">
            {priceLabel(c.price)}
          </span>
        </div>
      </div>
      </div>
    </article>
  );
}

// The course most learners open first, offered when there is no history.
const starter = [...courses].sort((a, b) => b.learners - a.learners)[0];

/** An empty history keeps the deck's card: the most enrolled course stands in
 *  the newest one's place, its free first lesson the one way on, and the chip
 *  row says there is nothing viewed yet. The grey tile with a clock that was
 *  here took the band's only photograph with it. */
function EmptyDeck({ className }: { className?: string }) {
  return (
    <div data-recent-deck className={cn("pb-10", className)}>
      <h2 className="sr-only">Recently viewed</h2>
      <RecentCard course={starter} front lead />
    </div>
  );
}
