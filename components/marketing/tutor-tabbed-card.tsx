"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { HugeiconsIcon } from "@hugeicons/react";
import { COURSE, LESSON, TEACHER, TOTAL, foot, mmss, questions } from "@/components/marketing/lesson";
import {
  SliderControl,
  SliderIndicator,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { reach } from "@/components/reach";
import { AiIcon } from "@/components/ui/ai-icon";
import { Caps } from "@/components/ui/caps";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { whenPressed } from "@/components/ui/selected";
import { cn } from "@/lib/utils";

// The line of the transcript each answer was taken from, so the player half
// can show the words rather than assert that it read them.
const spoken: Record<number, string> = {
  252: "A left join keeps every row on the left, and the right side comes back null.",
  698: "The same subquery twice is a WITH clause waiting to happen.",
  1085: "WHERE filters rows on the way in. HAVING filters groups on the way out.",
};

export function TutorTabbedCard() {
  const [asked, setAsked] = useState(0);
  const [at, setAt] = useState(questions[0].a.seconds);
  const [playing, setPlaying] = useState(false);
  const answer = questions[asked].a;

  // The player is a demo, so it plays on the clock: a second a second from
  // wherever the thumb stands, stopping by itself at the end of the lesson.
  const running = playing && at < TOTAL;
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setAt((s) => Math.min(s + 1, TOTAL)), 1000);
    return () => clearInterval(tick);
  }, [running]);

  const toggle = () => {
    if (running) {
      setPlaying(false);
      return;
    }
    if (at >= TOTAL) setAt(0);
    setPlaying(true);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <SectionHeading className="mx-auto text-center">
        The tutor has read <Highlight>the lesson you are on</Highlight>
      </SectionHeading>
      <p className="mx-auto mt-4 max-w-[22rem] text-center text-base text-muted-foreground">
        Pick one of the three questions and watch the answer cite the minute it
        came from.
      </p>

      {/* The tab row, floating clear of the card as the reference has it. It
          scrolls sideways where the three do not fit instead of wrapping: a
          wrapped row stands the tail over the tab below it rather than over
          the card. The vertical padding is room for the tail and the focus
          ring, taken back off the layout by the bottom margin. */}
      <div className="no-scrollbar -mx-6 -mb-2 mt-10 flex justify-center-safe gap-2 overflow-x-auto px-6 py-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        {questions.map((item, i) => {
          const on = asked === i;
          return (
            <button
              key={item.q}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setAsked(i);
                setAt(item.a.seconds);
                setPlaying(false);
              }}
              className={cn(
                "press group relative flex h-10 shrink-0 items-center whitespace-nowrap rounded-control px-5 text-sm",
                "bg-card ring-1 ring-inset ring-border hover:bg-accent",
                whenPressed,
                "aria-pressed:hover:bg-accent",
                reach,
              )}
            >
              {item.q.replace(/\?$/, "")}
              {/* the reference's tail: it is what ties the open panel to the
                  chip that opened it, and without it the row reads as a filter */}
              {on && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-1/2 size-0 -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-ring"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* The card carries 8px of its own edge around the preview half and full
          padding only around the copy. Corners, from the radius seed: the
          card's own, the frame 6px under it, the player one step rounder than
          the frame since it stands well clear of it, and the transcript row
          4px under the small step. On a phone there is no room for the frame
          to show around the player, so it stands down and the player takes
          its place and its corner. */}
      <div className="mt-6 grid rounded-lg bg-card p-2 shadow-soft lg:grid-cols-[40fr_60fr]">
        {/* copy half: the reference's product chip, heading, paragraph and a
            bare arrow link */}
        <div className="flex flex-col px-4 pb-7 pt-4 sm:max-w-xl sm:px-6 sm:pb-8 sm:pt-6 lg:max-w-none lg:py-8 lg:pl-8 lg:pr-12">
          <p className="flex items-center gap-2">
            <Caps
              as="span"
              className="inline-flex items-center gap-1.5 rounded-control bg-iris/15 px-2.5 py-1 text-iris-ink"
            >
              <AiIcon />
              AI
            </Caps>
            <span className="text-xs tabular-nums text-muted-foreground">
              from {answer.at}
            </span>
          </p>

          {/* Every question and answer in one cell, the others unseen, so the
              card stands as tall as its longest answer and nothing under it
              moves when a tab is pressed. */}
          <div className="mt-5 grid">
            {questions.map((x, i) => (
              <div
                key={x.q}
                aria-hidden={i !== asked || undefined}
                className={cn("[grid-area:1/1]", i !== asked && "invisible")}
              >
                {/* a heading for the one shown; the others only hold the
                    room, in the heading face so they measure the same */}
                {i === asked ? (
                  <h3 className="text-2xl tracking-tight">{x.q}</h3>
                ) : (
                  <div className="font-heading text-2xl tracking-tight">{x.q}</div>
                )}
                <p className="mt-3 text-base text-muted-foreground">{x.a.body}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setAt(answer.seconds);
              setPlaying(true);
            }}
            className={cn(
              "mt-6 inline-flex h-10 w-fit items-center gap-2 text-sm font-medium",
              "press hover:text-muted-foreground",
              reach,
            )}
          >
            Play from {answer.at}
            <ArrowRightIcon className="size-4" />
          </button>

          <ul className="mt-auto flex flex-col gap-4 pt-10">
            {foot.map((f) => (
              <li key={f.label} className="flex gap-3 border-t pt-4 first:border-t-0 first:pt-0">
                {/* a line box tall, so the glyph centres on the first line */}
                <span className="flex h-6 shrink-0 items-center">
                  <HugeiconsIcon icon={f.icon} size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="text-base">
                  <span className="font-medium">{f.label}.</span>{" "}
                  <span className="text-muted-foreground">{f.body}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* The preview half, on the reference's tinted inner frame. The
            player stretches to the frame's height rather than centring in it,
            so it stands the same distance from all four sides whichever column
            sets the row; height the copy adds lands above the transcript. */}
        <div className="flex rounded-[calc(var(--radius-lg)-6px)] sm:bg-accent sm:p-8 lg:p-12">
          <div className="flex w-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)-6px)] bg-card sm:rounded-md sm:p-2 sm:shadow-soft">
            {/* The poster is the desk the lesson is taught from, which is
                what a course platform puts on a player and what two
                near-greys behind a play button says it could not find. The
                title under it carries the instructor, so the frame does not
                have to be her face to say whose lesson this is. The whole
                frame is the play control, as it is on every player. It is
                inset in the card and rounded at all four corners, as a
                course card's photograph is: the card's radius less the 8px
                between them from sm, where the card is a white panel on the
                tint, and the course card's own 16px on a phone, where the
                panel has no edge of its own to be inset from. */}
            <button
              type="button"
              onClick={toggle}
              aria-label={running ? `Pause ${LESSON}` : `Play ${LESSON} from ${mmss(at)}`}
              className="group/poster relative flex aspect-video w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[calc(var(--radius)-0.5rem)] focus-visible:outline-offset-2 sm:rounded-[calc(var(--radius)*0.8-0.5rem)]"
            >
              {/* dark until the photograph lands, on a layer of its own so
                  the control itself carries no fill; the fixed ink, since a
                  photograph's ground is dark in both halves */}
              <span aria-hidden="true" className="absolute inset-0 bg-fixed-dark" />
              {/* Unsplash, free licence, hotlinked until the packaging step
                  downloads it; the id in the address is the licence record */}
              <Image
                src="https://images.unsplash.com/photo-1629317337307-e37f95ebc372?auto=format&fit=crop&w=1600&q=80"
                alt=""
                fill
                sizes="(min-width: 1280px) 608px, (min-width: 1024px) calc(60vw - 160px), (min-width: 640px) calc(100vw - 160px), calc(100vw - 64px)"
                className="object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/poster:scale-[1.04]"
              />
              {/* a play disc needs a ground under it, and a quarter is the
                  least that gives it one without turning the frame grey. A
                  hover deepens it a step so the disc comes forward as the
                  frame leans in, and a press sets the disc back down; both
                  step aside while the lesson plays and come back on a
                  hover. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 bg-fixed-dark/25 transition group-hover/poster:bg-fixed-dark/35",
                  running && "opacity-0 group-hover/poster:opacity-100",
                )}
              />
              <span
                className={cn(
                  "relative flex size-16 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition group-hover/poster:shadow-soft-lg motion-safe:group-hover/poster:scale-110 motion-safe:group-active/poster:scale-100",
                  running && "opacity-0 group-hover/poster:opacity-100 group-focus-visible/poster:opacity-100",
                )}
              >
                {running ? (
                  <PauseIcon aria-hidden="true" className="size-6" />
                ) : (
                  <PlayIcon aria-hidden="true" className="size-6 translate-x-0.5" />
                )}
              </span>
              <span className="absolute bottom-3 right-3 rounded-control bg-fixed-dark/70 px-2 py-1 font-mono text-xs tabular-nums text-fixed-light">
                {mmss(TOTAL)}
              </span>
            </button>

            <div className="flex flex-1 flex-col p-4 sm:px-3 sm:pb-3 sm:pt-5">
              <p className="line-clamp-1 text-sm font-medium">{LESSON}</p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {TEACHER.name} · {COURSE}
              </p>

              <SliderRoot
                value={at}
                onValueChange={setAt}
                max={TOTAL}
                step={1}
                className="mt-4"
              >
                <SliderControl>
                  <SliderTrack className="relative">
                    <SliderIndicator />
                    {/* the minute the answer was taken from, left on the rail
                        so it can be found again once the thumb moves off it */}
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris ring-2 ring-card"
                      style={{ left: `${(answer.seconds / TOTAL) * 100}%` }}
                    />
                    <SliderThumb aria-label="Lesson position" />
                  </SliderTrack>
                </SliderControl>
              </SliderRoot>

              <p className="mb-5 flex items-baseline justify-between font-mono text-xs tabular-nums text-muted-foreground">
                <span>{mmss(at)}</span>
                <span>{mmss(TOTAL)}</span>
              </p>

              {/* The transcript line the answer was taken from, set on the
                  content's own edges. It keeps one ground wherever the thumb
                  stands: the line is the citation, and a citation does not
                  fade because the reader scrubbed away from it. */}
              <div className="mt-auto rounded-[calc(var(--radius-sm)-4px)] bg-iris/15 p-3 sm:p-4">
                <Caps>Transcript · {answer.at}</Caps>
                {/* the three lines in one cell, for the same reason */}
                <div className="mt-2 grid">
                  {questions.map((x, i) => (
                    <p
                      key={x.q}
                      aria-hidden={i !== asked || undefined}
                      className={cn("text-sm [grid-area:1/1]", i !== asked && "invisible")}
                    >
                      {spoken[x.a.seconds]}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
