"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { heroCopy } from "@/components/about/copy";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// Where each card sits by its depth in the deck, front first: an angle and a
// sideways step, both multiplied by `--spread`, which the container sets per
// width so the fan closes on a phone instead of running off it. The cards
// turn about their foot, the way a hand fans a deck.
const FAN = [
  { a: 12, x: 68, y: 0 },
  { a: 4, x: 38, y: -8 },
  { a: -4, x: 10, y: -11 },
  { a: -12, x: -18, y: -9 },
  { a: -20, x: -46, y: -3 },
  { a: -28, x: -72, y: 7 },
];

export function HeroFan() {
  const c = heroCopy;
  const n = c.snapshots.length;
  // Which photograph is at the front; the rest follow it in order.
  const [front, setFront] = useState(0);
  const current = c.snapshots[front];

  const deal = () => setFront((f) => (f + 1) % n);

  return (
    <section id="top" className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10 lg:pt-16">
      <div className="flex flex-col items-center text-center">
        {/* The deck. Each card knows its depth from the front, so dealing
            only moves the front index and every card turns to its new place
            at once. */}
        <div
          className={cn(
            "relative h-[21rem] w-full max-w-md [--spread:0.4] sm:h-[25rem] sm:[--spread:0.8] lg:h-[25rem] lg:[--spread:1]",
          )}
        >
          {c.snapshots.map((s, i) => {
            const depth = (i - front + n) % n;
            const at = FAN[depth];
            return (
              <div
                key={s.src}
                aria-hidden={depth !== 0}
                style={
                  {
                    "--a": at.a,
                    "--x": at.x,
                    "--y": at.y,
                    zIndex: n - depth,
                  } as React.CSSProperties
                }
                className={cn(
                  "absolute bottom-6 left-1/2 w-56 -ml-28 origin-bottom overflow-hidden rounded-lg bg-muted shadow-soft-lg sm:w-64 sm:-ml-32 lg:w-72 lg:-ml-36",
                  "aspect-[4/5] [transform:translate(calc(var(--x)*var(--spread)*1px),calc(var(--y)*1px))_rotate(calc(var(--a)*var(--spread)*1deg))]",
                  "transition-transform duration-morph ease-answer motion-reduce:transition-none",
                )}
              >
                <Image
                  src={s.src}
                  alt={depth === 0 ? s.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 224px"
                  // The front card is the one drawn whole on the first frame,
                  // and the largest paint; it alone is preloaded. The cards
                  // behind it are in view too and load as soon as the page is
                  // laid out, without five more preloads racing it.
                  preload={i === 0}
                  className="object-cover"
                />
                {/* The paler cards behind are the deck's depth: a veil in the
                    page's own colour, thicker the further back. */}
                <span
                  aria-hidden="true"
                  style={{ opacity: depth * 0.08 }}
                  className="absolute inset-0 bg-background transition-opacity duration-morph ease-answer"
                />
              </div>
            );
          })}

          {/* The front card's caption and the control that turns the deck,
              drawn over the front card's foot rather than inside it, so a
              card turning away carries nothing with it. */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2">
            <p
              aria-live="polite"
              className="flex h-10 min-w-0 items-center gap-2 rounded-control bg-card pl-4 pr-4 text-sm shadow-soft"
            >
              <span className="truncate font-medium">{current.caption}</span>
              <span className="hidden shrink-0 text-muted-foreground sm:inline">{current.place}</span>
            </p>
            <button
              type="button"
              onClick={deal}
              aria-label={`${c.deal}, ${front + 1} of ${n}`}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-control bg-card shadow-soft press hover:shadow-soft-lg active:shadow-none",
                "relative after:absolute after:-inset-0.5 after:content-['']",
              )}
            >
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>

        <Eyebrow className="mt-10 justify-center">{c.eyebrow}</Eyebrow>

        {/* the second beat's verb carries the brand's swoosh: it is the
            word the line turns on */}
        <h1 className="mt-5 max-w-[18ch] text-4xl tracking-tighter sm:max-w-none sm:text-5xl lg:text-6xl">
          {c.title[0]} <br className="hidden sm:block" />
          {c.title[1][0]}
          <Highlight>{c.title[1][1]}</Highlight>
          {c.title[1][2]}
        </h1>

        <p className="mt-6 max-w-xl text-base text-muted-foreground">{c.lede}</p>


        {/* The one call to action at 44px, and the second door as a line of
            text with its arrow, so the pair keeps one weight between them. */}
        <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
          <Button render={<a href={c.primary.href}>{c.primary.label}</a>} size="lg" />
          <a
            href={c.secondary.href}
            className={cn(
              "group/door flex items-center gap-1.5 text-sm font-medium underline-offset-4 press hover:underline",
              reach,
            )}
          >
            {c.secondary.label}
            <ArrowRightIcon className="size-4 transition-transform group-hover/door:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        </div>
      </div>
    </section>
  );
}
