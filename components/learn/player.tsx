"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import {
  ClosedCaptionIcon,
  GoBackward10SecIcon,
  GoForward10SecIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Course } from "@/components/course/courses";
import type { Lesson } from "@/components/course/detail";
import type { Line } from "@/components/course/lessons/types";
import { clock, learnCopy } from "@/components/learn/copy";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import {
  SliderControl,
  SliderIndicator,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const SPEEDS = [1, 1.25, 1.5, 2, 0.75];

export type UpNext = {
  /** "Lesson 4.3 · 15 min", or the quiz's line. */
  label: string;
  title: string;
  /** The item after this one is shut until the learner enrolls. */
  locked?: boolean;
};

/** The player. A demo, so it plays on the clock the section runs: from
 *  wherever the thumb stands, a second a second times the speed. Everything
 *  else on the page reads the same clock, which is how a transcript line
 *  lights up as it is spoken and a note keeps the minute it was written at. */
export function LessonPlayer({
  course,
  lesson,
  lang,
  at,
  playing,
  speed,
  cc,
  lines,
  cites,
  notes,
  countdown,
  upNext,
  enrollHref,
  onSeek,
  onToggle,
  onSkip,
  onSpeed,
  onCc,
  onUpNext,
  onStay,
}: {
  course: Course;
  lesson: Lesson;
  lang?: string;
  at: number;
  playing: boolean;
  speed: number;
  cc: boolean;
  lines?: Line[];
  /** Minutes the tutor has cited in this lesson, as seconds. */
  cites: number[];
  /** Minutes the learner has notes at, as seconds. */
  notes: number[];
  /** Seconds left before the next item opens by itself, while the lesson
   *  that just ended counts down to it. */
  countdown: number | null;
  upNext?: UpNext;
  enrollHref: string;
  onSeek: (at: number) => void;
  onToggle: () => void;
  onSkip: (by: number) => void;
  onSpeed: (speed: number) => void;
  onCc: (on: boolean) => void;
  onUpNext: () => void;
  onStay: () => void;
}) {
  const total = lesson.minutes * 60;
  const running = playing && at < total;
  // One mark a second: two notes written at one second, or two answers from
  // one minute, draw one mark rather than two on top of each other.
  const noteMarks = [...new Set(notes)];
  const citeMarks = [...new Set(cites)];
  const line = lines?.findLast((l) => l.at <= at);
  const ended = countdown !== null;

  return (
    <div className="rounded-lg bg-card p-2 shadow-soft">
      {/* 16:9, and taller only while the card that closes a lesson needs
          it: on a phone the frame is 183px, shorter than that card. */}
      <div className="relative grid grid-cols-1 overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] bg-fixed-dark before:col-start-1 before:row-start-1 before:aspect-video before:self-start before:content-['']">
        <Image
          src={course.image}
          alt=""
          fill
          preload
          sizes="(min-width: 1280px) 820px, (min-width: 1024px) 60vw, 100vw"
          // The still leans in as the lesson plays, and holds still for a
          // reader who asked for less motion. The length is the clock's: a
          // little over its 250ms tick, so the lean runs on between ticks.
          className={cn(
            "scale-[1.02] object-cover transition-transform ease-linear motion-safe:scale-(--lean)",
            course.focus === "bottom" && "object-bottom",
          )}
          style={{ "--lean": 1.02 + (0.06 * at) / total, transitionDuration: "300ms" } as CSSProperties}
        />

        {/* The whole frame is the play control, as it is on every player.
            Its disc and the dim under it step aside while the lesson runs
            and come back under the pointer. Out of the tab order: the play
            button in the row below is the same control, one stop later. */}
        <button
          type="button"
          tabIndex={-1}
          onClick={onToggle}
          aria-label={
            running ? learnCopy.player.pause(lesson.title) : learnCopy.player.play(lesson.title)
          }
          className="group/frame absolute inset-0 flex items-center justify-center focus-visible:-outline-offset-4"
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-fixed-dark/20 transition-opacity group-hover/frame:bg-fixed-dark/30 group-active/frame:bg-fixed-dark/40",
              running && "opacity-0 group-hover/frame:opacity-100",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "relative flex size-12 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition group-hover/frame:shadow-soft-lg motion-safe:group-hover/frame:scale-105 motion-safe:group-active/frame:scale-100 sm:size-16",
              running && "opacity-0 group-hover/frame:opacity-100 group-focus-visible/frame:opacity-100",
            )}
          >
            {running ? (
              <PauseIcon className="size-5 sm:size-6" />
            ) : (
              <PlayIcon className="size-5 translate-x-0.5 sm:size-6" />
            )}
          </span>
        </button>

        {/* The lesson's own plate while it stands still: which lesson and
            which module before it starts, the minute it stopped at once it
            has run. On a surface of its own, since text straight on a
            photograph is unreadable somewhere in it. */}
        {/* Not on a phone: in a frame 192px tall the plate, the disc and a
            caption stood on one another, and the title is right under it. */}
        {!running && !ended && (
          <div className="pointer-events-none absolute left-4 top-4 hidden max-w-sm rounded-md bg-card px-3.5 py-2.5 shadow-soft sm:block">
            <Caps>{at > 0 ? learnCopy.player.paused(clock(at)) : learnCopy.lesson(lesson.id)}</Caps>
            <p lang={lang} className="mt-1 line-clamp-2 text-sm font-medium">
              {lesson.title}
            </p>
          </div>
        )}

        {cc && line && at > 0 && !ended && (
          <p className="pointer-events-none absolute inset-x-4 bottom-4 text-center sm:inset-x-12">
            <span lang={lang} className="inline-block max-w-full text-balance rounded-md bg-fixed-dark/80 px-2.5 py-1 text-sm text-fixed-light">
              {line.text}
            </span>
          </p>
        )}

        {ended && upNext && (
          <UpNextCard
            lesson={lesson.id}
            upNext={upNext}
            countdown={countdown}
            enrollHref={enrollHref}
            price={course.price}
            onUpNext={onUpNext}
            onStay={onStay}
          />
        )}
      </div>

      <div className="px-2 pb-1 pt-2 sm:px-3">
        <SliderRoot value={at} onValueChange={(v) => onSeek(v)} max={total} step={1}>
          <SliderControl>
            <SliderTrack className="relative">
              <SliderIndicator />
              {/* The minutes the tutor answered from in iris, the learner's
                  notes in ink: both left on the rail so they can be found
                  again once the thumb moves off them. */}
              {noteMarks.map((s) => (
                <span
                  key={`n${s}`}
                  aria-hidden="true"
                  className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-card"
                  style={{ left: `${(s / total) * 100}%` }}
                />
              ))}
              {citeMarks.map((s) => (
                <span
                  key={`c${s}`}
                  aria-hidden="true"
                  className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris ring-2 ring-card"
                  style={{ left: `${(s / total) * 100}%` }}
                />
              ))}
              <SliderThumb aria-label={learnCopy.player.position} />
            </SliderTrack>
          </SliderControl>
        </SliderRoot>

        {/* The reference's control row: the play disc in the middle with the
            two skips beside it, the clock at one end, speed and captions at
            the other. On a phone the skips step out, since the row has room
            for the clock or for them and the scrubber does their work. */}
        <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <span className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground">
            {clock(at)} / {clock(total)}
          </span>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onSkip(-10)}
              aria-label={learnCopy.player.back}
              className="hidden size-10 items-center justify-center rounded-full press hover:bg-accent sm:flex"
            >
              <HugeiconsIcon icon={GoBackward10SecIcon} size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onToggle}
              aria-label={
                running ? learnCopy.player.pause(lesson.title) : learnCopy.player.play(lesson.title)
              }
              className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground press hover:bg-primary/80"
            >
              {running ? (
                <PauseIcon aria-hidden="true" className="size-5" />
              ) : (
                <PlayIcon aria-hidden="true" className="size-5 translate-x-px" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onSkip(10)}
              aria-label={learnCopy.player.forward}
              className="hidden size-10 items-center justify-center rounded-full press hover:bg-accent sm:flex"
            >
              <HugeiconsIcon icon={GoForward10SecIcon} size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            {/* One press steps through the speeds, as the players people
                already know do; the label is the speed it is on. 48px wide
                on a phone, where the column beside the play disc is 96. */}
            <button
              type="button"
              onClick={() => onSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
              aria-label={learnCopy.player.speed(speed)}
              className="h-10 w-12 rounded-control text-sm tabular-nums press hover:bg-accent sm:w-14"
            >
              {speed}×
            </button>
            {lines && (
              <button
                type="button"
                onClick={() => onCc(!cc)}
                aria-pressed={cc}
                aria-label={learnCopy.player.captions}
                className={cn(
                  "flex size-10 items-center justify-center rounded-control press",
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80 not-aria-pressed:hover:bg-accent",
                )}
              >
                <HugeiconsIcon icon={ClosedCaptionIcon} size={18} strokeWidth={1.6} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** What the frame shows once a lesson ends: the item after it, opening by
 *  itself when the count reaches nought, or the door to enrolling when that
 *  item is shut. */
function UpNextCard({
  lesson,
  upNext,
  countdown,
  enrollHref,
  price,
  onUpNext,
  onStay,
}: {
  lesson: string;
  upNext: UpNext;
  countdown: number | null;
  enrollHref: string;
  price: number;
  onUpNext: () => void;
  onStay: () => void;
}) {
  const left = countdown ?? 0;
  return (
    <div className="relative col-start-1 row-start-1 flex items-center justify-center bg-fixed-dark/55 p-4">
      <div role="status" className="w-full max-w-sm rounded-lg bg-card p-5 shadow-soft-lg">
        {upNext.locked ? (
          <>
            <Caps>{learnCopy.player.finished(lesson)}</Caps>
            <p className="mt-2 text-base font-medium">{learnCopy.player.finishedBody}</p>
          </>
        ) : (
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <Caps>{learnCopy.player.upNext}</Caps>
              <p className="mt-2 line-clamp-2 text-base font-medium">{upNext.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{upNext.label}</p>
              <span className="sr-only">{learnCopy.player.autoplay}</span>
            </div>
            {/* the count as a ring that empties, with the seconds inside;
                silent, or the status would be read out again every second */}
            <span aria-hidden="true" className="relative flex size-12 shrink-0 items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
                <circle cx="24" cy="24" r="21" fill="none" strokeWidth="3" className="stroke-muted" />
                <circle
                  cx="24"
                  cy="24"
                  r="21"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - left / 5}
                  className="stroke-primary transition-[stroke-dashoffset] ease-linear motion-reduce:transition-none"
                  // The length is the countdown's own second, not a feel.
                  style={{ transitionDuration: "1000ms" }}
                />
              </svg>
              <span className="font-heading text-lg tabular-nums">{left}</span>
            </span>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {upNext.locked ? (
            <Button render={<a href={enrollHref} />}>{learnCopy.enroll(price)}</Button>
          ) : (
            <Button type="button" onClick={onUpNext}>
              <PlayIcon data-icon="inline-start" aria-hidden="true" className="size-4" />
              {learnCopy.player.playNow}
            </Button>
          )}
          <button
            type="button"
            onClick={onStay}
            className="flex h-10 items-center rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
          >
            {learnCopy.player.stay}
          </button>
        </div>
      </div>
    </div>
  );
}
