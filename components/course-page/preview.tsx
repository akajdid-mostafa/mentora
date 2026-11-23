"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { ClosedCaptionIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  courseSlug,
  lessonHref,
  priceLabel,
  type Course,
} from "@/components/course/courses";
import type { Lesson } from "@/components/course/detail";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SliderControl,
  SliderIndicator,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/** A lesson the player can show, with the module it sits in. */
export type Clip = Lesson & { module: string };

// Anything on the page that opens the player — the frame at the top, a
// Preview chip in the syllabus — calls this with the lesson it wants.
const Open = createContext<(id?: string) => void>(() => {});
export const usePreview = () => useContext(Open);

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const mmss = (s: number) => `${pad(s / 60)}:${pad(s % 60)}`;
const SPEEDS = [1, 1.25, 1.5, 2, 0.75];

/** Holds the one player the page has and opens it on whichever lesson was
 *  asked for. The dialog lives here rather than beside each trigger, so the
 *  frame and every chip in the syllabus open the same player. */
export function PreviewProvider({
  course,
  clips,
  lang,
  children,
}: {
  course: Course;
  clips: Clip[];
  /** The course's language where it is not English, for the titles the
   *  course wrote. */
  lang?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(clips[0]?.id);
  const show = useCallback((lesson?: string) => {
    if (lesson) setId(lesson);
    setOpen(true);
  }, []);
  const clip = clips.find((c) => c.id === id) ?? clips[0];

  return (
    <Open.Provider value={show}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl">
          <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
            <div className="min-w-0">
              <Caps>Preview</Caps>
              <DialogTitle className="mt-1.5 truncate text-lg">{course.title}</DialogTitle>
            </div>
            <DialogCloseButton label="Close the preview" />
          </div>

          <div className="grid gap-6 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6 md:grid-cols-[minmax(0,1fr)_17rem]">
            {/* Keyed on the lesson, so picking another one starts it from
                the top rather than at the second the last one stopped. */}
            {clip && <Player key={clip.id} clip={clip} course={course} lang={lang} />}

            <div data-object className="flex flex-col">
              <Caps>Free to watch</Caps>
              <ul className="mt-3 flex flex-col gap-1">
                {clips.map((c) => {
                  const on = c.id === clip?.id;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => setId(c.id)}
                        aria-current={on || undefined}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-sm p-2 text-left transition-colors",
                          "aria-[current=true]:bg-accent aria-[current=true]:active:bg-muted not-aria-[current=true]:hover:bg-accent not-aria-[current=true]:active:bg-muted",
                        )}
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-[10px] bg-muted">
                          <Image
                            src={course.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-fixed-dark/25">
                            <PlayIcon aria-hidden="true" className="size-4 translate-x-px text-fixed-light" />
                          </span>
                        </span>
                        <span className="min-w-0">
                          <span lang={lang} className="line-clamp-2 text-sm font-medium">
                            {c.title}
                          </span>
                          <span className="mt-0.5 block text-sm tabular-nums text-muted-foreground">
                            Lesson {c.id} · {c.minutes} min
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <DialogDescription className="mt-auto pt-6">
                The preview is the video on its own. Lesson one opens in full,
                with the tutor and its practice set, and asks for no card.
              </DialogDescription>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <Link
              href={lessonHref(course)}
              className={cn(
                "flex h-10 items-center justify-center rounded-control px-5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent",
                reach,
              )}
            >
              {course.price ? "Start lesson one free" : "Start lesson one"}
            </Link>
            <Button render={<Link href={`/checkout?course=${courseSlug(course)}`} />} className={reach}>
              {course.price ? `Enroll for ${priceLabel(course.price)}` : "Enroll for free"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Open.Provider>
  );
}

/** The player. A demo, so it plays on the clock: from wherever the thumb
 *  stands, a second a second times the speed, stopping on its own at the
 *  end. The poster leans in as the lesson runs, so a playing frame does not
 *  read as a paused one, and a lesson with a transcript shows its captions. */
function Player({ clip, course, lang }: { clip: Clip; course: Course; lang?: string }) {
  const total = clip.minutes * 60;
  const [at, setAt] = useState(0);
  // it opens playing: a reader who asked for a preview asked to watch it
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [cc, setCc] = useState(true);

  const running = playing && at < total;
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setAt((s) => Math.min(total, s + 0.25 * speed)), 250);
    return () => clearInterval(tick);
  }, [running, speed, total]);

  const toggle = () => {
    if (running) return setPlaying(false);
    if (at >= total) setAt(0);
    setPlaying(true);
  };

  const line = clip.captions?.findLast((c) => c.at <= at);
  const fresh = at === 0 && !running;

  return (
    <div className="min-w-0">
      {/* The frame, its dim and the captions are the fixed pair: a video is
          as dark in either half. */}
      <div className="relative aspect-video overflow-hidden rounded-md bg-fixed-dark">
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 660px, 92vw"
          className="object-cover transition-transform ease-linear motion-reduce:transition-none"
          // the length is the player's clock, a tick and a little, not a feel
          style={{ transform: `scale(${1.02 + (0.06 * at) / total})`, transitionDuration: "300ms" }}
        />
        {/* The whole frame is the play control, as it is on every player.
            Its disc and the dim under it step aside while the lesson runs
            and come back under the pointer. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={running ? "Pause the preview" : "Play the preview"}
          className="group/frame absolute inset-0 flex items-center justify-center focus-visible:-outline-offset-4"
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-fixed-dark/20 transition-[opacity,background-color] group-active/frame:bg-fixed-dark/30",
              running && "opacity-0 group-hover/frame:opacity-100",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "relative flex size-16 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition group-hover/frame:shadow-soft-lg",
              running && "opacity-0 group-hover/frame:opacity-100 group-focus-visible/frame:opacity-100",
            )}
          >
            {running ? (
              <PauseIcon className="size-6" />
            ) : (
              <PlayIcon className="size-6 translate-x-0.5" />
            )}
          </span>
        </button>

        {/* The lesson's own title card until it starts: which lesson, and
            from which module, on a surface of its own over the photograph. */}
        {fresh && (
          <div className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-md bg-card px-3.5 py-2.5 shadow-soft sm:left-4 sm:top-4 sm:max-w-sm">
            <Caps>
              Lesson {clip.id} · <span lang={lang}>{clip.module}</span>
            </Caps>
            <p lang={lang} className="mt-1 line-clamp-2 text-sm font-medium">
              {clip.title}
            </p>
          </div>
        )}

        {cc && line && !fresh && (
          <p className="pointer-events-none absolute inset-x-4 bottom-4 text-center sm:inset-x-10">
            <span className="inline-block max-w-full rounded-md bg-fixed-dark/80 px-2.5 py-1 text-sm text-fixed-light">
              {line.text}
            </span>
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={running ? "Pause" : "Play"}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted press hover:bg-secondary"
        >
          {running ? (
            <PauseIcon aria-hidden="true" className="size-4" />
          ) : (
            <PlayIcon aria-hidden="true" className="size-4 translate-x-px" />
          )}
        </button>

        <SliderRoot
          value={at}
          onValueChange={(v) => setAt(v)}
          max={total}
          step={1}
          className="min-w-0 flex-1"
        >
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb aria-label="Position in the lesson" />
            </SliderTrack>
          </SliderControl>
        </SliderRoot>

        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {mmss(at)} / {mmss(total)}
        </span>

        {/* One press steps through the speeds, as the players people already
            know do; the label is the speed it is on. */}
        <button
          type="button"
          onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
          aria-label={`Playback speed, ${speed} times`}
          className="h-10 w-14 shrink-0 rounded-control text-sm tabular-nums ring-1 ring-inset ring-border press hover:bg-accent"
        >
          {speed}×
        </button>

        {clip.captions && (
          <button
            type="button"
            onClick={() => setCc((v) => !v)}
            aria-pressed={cc}
            aria-label="Captions"
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-control press",
              "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80",
              "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
            )}
          >
            <HugeiconsIcon icon={ClosedCaptionIcon} size={18} strokeWidth={1.6} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

/** The frame at the top of the page: the course's photograph as the poster
 *  of its first free lesson, with the lesson named on a plate over it. A
 *  press anywhere opens the player on that lesson. */
export function PreviewFrame({
  course,
  clip,
  count,
  lang,
}: {
  course: Course;
  clip: Clip;
  count: number;
  lang?: string;
}) {
  const show = usePreview();
  return (
    <button
      type="button"
      onClick={() => show(clip.id)}
      aria-label={`Preview ${course.title}: ${count} free lessons`}
      className="group/poster relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted text-left"
    >
      <Image
        src={course.image}
        alt=""
        fill
        preload
        sizes="(min-width: 1280px) 760px, (min-width: 1024px) 560px, 92vw"
        className="object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/poster:[transform:scale(1.03)] motion-safe:group-active/poster:[transform:scale(1)] group-active/poster:duration-answer"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-fixed-dark/10 transition-colors group-hover/poster:bg-fixed-dark/20 group-active/poster:bg-fixed-dark/25"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition group-hover/poster:shadow-soft-lg motion-safe:group-hover/poster:scale-110"
      >
        <PlayIcon className="size-7 translate-x-0.5" />
      </span>

      {course.badge && (
        <span className="absolute left-4 top-4 rounded-control bg-[color-mix(in_oklab,var(--primary)_var(--chip-alpha),var(--card))] px-2.5 py-1 text-xs font-medium text-primary-ink shadow-soft">
          {course.badge}
        </span>
      )}

      {/* The lesson it opens on, on its own white plate: text straight on a
          photograph is unreadable somewhere in it. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-md bg-card p-3 pr-4 shadow-soft sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
          <PlayIcon className="size-4 translate-x-px" />
        </span>
        <span className="min-w-0">
          <Caps as="span" className="block">
            Preview · {count} free lessons
          </Caps>
          <span lang={lang} className="mt-0.5 block truncate text-sm font-medium">
            {clip.title}
          </span>
        </span>
      </span>
    </button>
  );
}
