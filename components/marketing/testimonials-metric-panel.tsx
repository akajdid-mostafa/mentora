"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Mortarboard02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { face, maker, mmss, portrait, quotes } from "@/components/marketing/quotes";
import { Logo } from "@/components/site/logo";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { CarouselBars } from "@/components/ui/carousel-bars";
import { cn } from "@/lib/utils";

export function TestimonialsMetricPanel() {
  const [at, setAt] = useState(0);
  const q = quotes[at];

  // The small face beside the quote is its own file, and only the current one
  // is mounted. All three are fetched up front, about 15KB, so a dot never
  // swaps in an empty circle while its face arrives.
  useEffect(() => {
    quotes.forEach((x) => {
      new window.Image().src = face(x.id, 96);
    });
  }, []);

  // Joel's clip is a demo, so it plays on the clock: a second a second, and
  // it stops by itself at the end. It opens a quarter of the way in, so the
  // bar reads as a clip somebody has already started rather than an empty rule.
  const [clip, setClip] = useState(Math.round(maker.seconds / 4));
  const [playing, setPlaying] = useState(false);
  const running = playing && clip < maker.seconds;
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setClip((s) => Math.min(s + 1, maker.seconds)), 1000);
    return () => clearInterval(tick);
  }, [running]);

  const toggle = () => {
    if (running) {
      setPlaying(false);
      return;
    }
    if (clip >= maker.seconds) setClip(0);
    setPlaying(true);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="rounded-lg bg-accent px-4 py-14 sm:px-10 sm:py-16 lg:px-12">
        <Eyebrow className="justify-center">Testimonials</Eyebrow>
        <SectionHeading className="mx-auto mt-5 text-center">
          Nobody here is giving it <Highlight>five stars</Highlight>
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-[22rem] text-center text-base text-muted-foreground">
          They are giving it a number they can check on a payslip, a calendar or
          a headcount.
        </p>

        <div className="mt-12 grid gap-5 xl:grid-cols-[62fr_38fr] [&>*]:min-w-0">
          {/* The quote card: the portrait with the result overlaid on its foot,
              and the words beside it. The card keeps 8px of its own edge
              around the portrait and full padding around the words, so the
              frame's corner is the card's less 6px and the result card's is
              the frame's less 2px. */}
          <div className="grid rounded-lg bg-card p-2 shadow-soft sm:grid-cols-[9fr_11fr] [&>*]:min-w-0">
            {/* 32rem, not 28: a frame has to clear a twelfth of a screen to count as
                a picture, and at 28rem this one measured 12.4% — inside the
                floor by four tenths of a point, which is not a margin. On a
                phone it is a portrait in its own right, so the face stays
                clear of the result card on its foot. All three portraits are
                in the frame from the start and the dots cross-fade between
                them, so a switch never waits on the network: at the size
                they are fetched, the three weigh about 200KB together. Each
                is the photograph as it was taken, room and all; only the
                small avatar beside the quote is cropped to the face. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-lg)-6px)] bg-muted sm:aspect-auto sm:min-h-[26rem] xl:min-h-[32rem]">
              {quotes.map((x, i) => (
                <Image
                  key={x.id}
                  src={portrait(x.id, 1024)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 330px, (min-width: 640px) 45vw, 90vw"
                  className={cn(
                    "object-cover transition-opacity duration-sheet ease-sheet",
                    i === at ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              {/* the reference's overlay card: the figure, what it is measured
                  against, and a bar under both that slides to the next share
                  when the dots move on */}
              <div className="absolute inset-x-2 bottom-2 rounded-[calc(var(--radius-lg)-8px)] bg-card/95 p-4 backdrop-blur-sm">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-heading text-2xl tracking-tighter tabular-nums">
                    {q.figure}
                  </span>
                  <span className="whitespace-nowrap text-sm text-muted-foreground">{q.of}</span>
                </p>
                {/* the groove, and the share of it the figure covers */}
                <span
                  aria-hidden="true"
                  className="mt-3 block h-3 overflow-hidden rounded-full bg-iris/20"
                >
                  <span
                    style={{ width: `${q.pct}%` }}
                    className="block h-full rounded-full bg-iris transition-[width]"
                  />
                </span>
              </div>
            </div>

            {/* The words, the reference's way round: its label at the top, and
                the badge pair, the quote and who said it together at the foot,
                level with the result card across the portrait. */}
            <div
              aria-live="polite"
              className="flex flex-col px-3 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6 xl:px-8"
            >
              <p className="text-sm text-muted-foreground">Learner&rsquo;s story</p>

              <div key={q.id} className="mt-6 sm:mt-auto motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-sheet motion-safe:ease-sheet">
                {/* the reference's badge pair: a quote mark beside the face */}
                <div className="flex items-center gap-2">
                  <span className="flex size-11 items-center justify-center rounded-full bg-foreground text-background">
                    <QuoteMark />
                  </span>
                  {/* the face alone, fetched at twice the size it is drawn */}
                  <Image
                    src={face(q.id, 96)}
                    alt=""
                    width={44}
                    height={44}
                    unoptimized
                    className="size-11 rounded-full object-cover"
                  />
                </div>

                <blockquote className="mt-5 max-w-[19rem] font-heading text-xl tracking-tight sm:text-2xl">
                  {q.body}
                </blockquote>

                <p className="mt-6 text-sm">
                  <span className="font-medium">{q.name}</span>
                  <span className="text-muted-foreground"> · {q.role}</span>
                </p>
              </div>
            </div>
          </div>

          {/* The metric panel, a second white card beside the quote: the
              wordmark, two rows and the teaching half centred in the height
              the quote card gives it, and the dots that move between the three
              at its foot. Every disc in it is 48px and sits 8px inside its
              row, and the wordmark and the dots hang on the same line as the
              discs, so the panel reads down one edge. The reference draws the
              rows as hard capsules; here they read the corner seed, because a
              capsule with padding is a box the Radius knob has to be able to
              square — only the discs inside them are actually circles. */}
          <div className="flex flex-col rounded-lg bg-card p-4 shadow-soft sm:p-6">
            <p className="pl-2 font-heading text-lg tracking-tighter">
              <Logo />
            </p>

            <div className="my-8 grid gap-3 md:grid-cols-2 xl:my-auto xl:grid-cols-1 xl:py-8">
              <div className="flex items-center gap-4 rounded-control bg-accent p-2 pr-6 md:col-start-1">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <ArrowTrendingUpIcon className="size-5" />
                </span>
                <span className="min-w-0">
                  <Caps as="span" className="block">
                    What changed
                  </Caps>
                  <span className="block text-base">{q.result}</span>
                </span>
              </div>

              {/* iris, the page's second colour, at a chip's strength: a
                  second green beside the brand's would read as the brand */}
              <div className="flex items-center gap-4 rounded-control bg-iris/15 p-2 pr-6 md:col-start-1">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card text-iris-ink">
                  <HugeiconsIcon icon={Mortarboard02Icon} size={20} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <Caps as="span" className="block text-iris-ink">
                    Course finished
                  </Caps>
                  <span className="block line-clamp-1 text-base">{q.course}</span>
                </span>
              </div>

              {/* the teaching half, in the same panel rather than in a row of
                  its own: under the two rows where the panel is a column, and
                  beside them where it runs the width of the band. Its disc
                  and its words stand where the rows' do, and what follows
                  hangs from the words' edge — from the disc's on a phone,
                  where the words' column is too narrow to hold the result on
                  one line. */}
              <div className="rounded-[calc(var(--radius-lg)-6px)] bg-accent p-2 pr-6 md:col-start-2 md:row-span-2 md:row-start-1 xl:col-start-1 xl:row-span-1 xl:row-start-auto">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={`${running ? "Pause" : "Play"} ${maker.name}'s clip`}
                    className="press flex size-12 shrink-0 items-center justify-center rounded-full bg-card shadow-soft hover:shadow-soft-lg active:shadow-none"
                  >
                    {running ? (
                      <PauseIcon aria-hidden="true" className="size-5" />
                    ) : (
                      <PlayIcon aria-hidden="true" className="size-5 translate-x-px" />
                    )}
                  </button>
                  <span className="min-w-0 flex-1">
                    {/* on a phone the clock wraps under the name rather
                        than cut it to two letters at 320 */}
                    <span className="flex items-baseline justify-between gap-x-3 max-sm:flex-wrap">
                      <span className="max-w-full truncate text-base font-medium max-sm:shrink-0">{maker.name}</span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {clip > 0 ? `${mmss(clip)} / ` : ""}
                        {mmss(maker.seconds)}
                      </span>
                    </span>
                    <span className="block text-sm text-muted-foreground">{maker.role}</span>
                  </span>
                </div>
                <div className="pb-2 sm:ml-16">
                  {/* how far into the clip, drawn the way the player on row 3
                      draws its played part */}
                  <span aria-hidden="true" className="mt-3 block h-1 overflow-hidden rounded-full bg-card">
                    {/* the length is the clip's one-second tick, not a feel */}
                    <span
                      style={{ width: `${(clip / maker.seconds) * 100}%`, transitionDuration: "1000ms" }}
                      className="block h-full rounded-full bg-primary transition-[width] ease-linear"
                    />
                  </span>
                  <p className="mt-3 text-sm text-muted-foreground">{maker.result}</p>
                </div>
              </div>
            </div>

            {/* the bars every carousel on the site turns with: here a press
                turns the quote, and the open one stands full */}
            <CarouselBars
              count={quotes.length}
              at={at}
              onPick={setAt}
              label={(i) => `Read ${quotes[i].name}`}
              className="mt-auto xl:mt-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// An opening quote drawn as the reference draws it: two filled marks, each a
// round head with its tail rising to the right. Drawn rather than taken from
// the icon set, whose quote is an outline that reads as "66" at this size, and
// rather than set as a character, whose place in the em box moves with the face.
function QuoteMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M3 15.4C3 10.6 5.7 6.9 9.7 5.3L10.5 7C8.1 8.2 6.9 9.8 6.6 11.5C8.9 11.5 10.7 13.2 10.7 15.4C10.7 17.6 8.9 19.3 6.9 19.3C4.7 19.3 3 17.6 3 15.4Z" />
      <path d="M13.5 15.4C13.5 10.6 16.2 6.9 20.2 5.3L21 7C18.6 8.2 17.4 9.8 17.1 11.5C19.4 11.5 21.2 13.2 21.2 15.4C21.2 17.6 19.4 19.3 17.4 19.3C15.2 19.3 13.5 17.6 13.5 15.4Z" />
    </svg>
  );
}
