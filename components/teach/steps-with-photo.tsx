"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { reach } from "@/components/reach";
import { stepsCopy } from "@/components/teach/copy";
import { Eyebrow } from "@/components/ui/eyebrow";
import { whenSelected } from "@/components/ui/selected";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// Asked for by width alone, wide enough for the frame's cover on a 2x screen.
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&w=2000&q=80`;

export function StepsWithPhoto() {
  const c = stepsCopy;
  const id = useId();
  // The first step stands open until a reader picks another.
  const [at, setAt] = useState(0);

  // A link to #how is pressed by someone asking about the checks, so it
  // opens the first step whichever one was open. It answers the press rather
  // than the hash: a second press leaves the hash as it was, and Back changes
  // it with nobody asking.
  useEffect(() => {
    const press = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a[href$="#how"]')) setAt(0);
    };
    document.addEventListener("click", press);
    return () => document.removeEventListener("click", press);
  }, []);

  const step = c.steps[at];

  return (
    <section id="how" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{c.heading}</SectionHeading>
        </div>
        <p className="max-w-[28rem] text-base text-muted-foreground lg:mb-1">{c.lede}</p>
      </div>

      {/* One frame on the band's tint. The photograph sits 8px in from its
          top, side and foot, with the frame's radius less that 8px so the
          corners run parallel. The rows stand 20px in, from the frame's top
          and side and from the photograph alike, so the open row is as far
          from the top as from the side, and they share the photograph's
          radius. */}
      <div className="mt-12 grid gap-2 rounded-lg bg-accent p-2 lg:grid-cols-2">
        {/* The rows hang from the top of the frame. */}
        <div role="tablist" aria-label={c.heading} aria-orientation="vertical" className="flex flex-col gap-4 p-3">
          {c.steps.map((s, i) => {
            const on = i === at;
            return (
              <button
                key={s.title}
                id={`${id}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`${id}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setAt(i)}
                onKeyDown={(e) => {
                  const by = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                  if (!by) return;
                  e.preventDefault();
                  const to = (i + by + c.steps.length) % c.steps.length;
                  setAt(to);
                  document.getElementById(`${id}-tab-${to}`)?.focus();
                }}
                className={cn(
                  "group/tab grid grid-cols-[2.5rem_1fr] items-center gap-x-4 rounded-[calc(var(--radius-lg)-0.5rem)] p-4 text-left transition-[background-color,box-shadow] sm:grid-cols-[3rem_1fr] sm:gap-x-5 sm:p-5",
                  whenSelected,
                  "aria-selected:hover:shadow-soft aria-selected:active:shadow-none not-aria-selected:hover:bg-card not-aria-selected:active:bg-background",
                )}
              >
                {/* White on the band, and a tint once its row turns white
                    under the pointer, as the open row's is. */}
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-sm bg-card text-sm font-medium tabular-nums transition-colors group-hover/tab:bg-accent group-aria-selected/tab:bg-accent sm:row-span-2 sm:size-12",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xl tracking-tight sm:text-2xl">{s.title}</span>
                <span className="col-span-2 mt-3 text-base text-muted-foreground sm:col-span-1 sm:col-start-2 sm:mt-1">
                  {s.line}
                </span>
              </button>
            );
          })}
        </div>

        {/* The photograph for the open step, all three in the frame from
            the start and faded between, so a switch never waits on the
            network. The glass across its foot is the step's one number
            and the way on from it. On a phone the glass stacks, so the
            frame stands taller there and the glass still leaves most of the
            photograph clear. Beside the rows it takes the row's height, and
            at least 30rem, so the rows never run past its foot where they
            wrap. */}
        <div
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${at}`}
          className="relative isolate aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[30rem]"
        >
          {c.steps.map((s, i) => (
            <Image
              key={s.photo}
              src={photo(s.photo)}
              alt={i === at ? s.alt : ""}
              aria-hidden={i !== at || undefined}
              fill
              style={"focus" in s ? { objectPosition: s.focus } : undefined}
              // What the cover draws, not the frame: a 3:2 photograph filling
              // a 30rem-tall frame is about 730px wide from lg, a little past
              // the screen from sm, and half as wide again as a phone in the
              // phone's 4:5 frame.
              sizes="(min-width: 1024px) 740px, (min-width: 640px) 104vw, 160vw"
              className={cn(
                "object-cover transition-opacity duration-sheet ease-sheet motion-reduce:transition-none",
                i === at ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          {/* 8px in from the photograph's edges, as the photograph is from
              the frame's, so each corner runs parallel to the one around it. */}
          <div className="absolute inset-x-2 bottom-2 flex flex-col gap-4 rounded-[calc(var(--radius-lg)-1rem)] bg-card/75 p-5 ring-1 ring-inset ring-card/60 backdrop-blur-md sm:flex-row sm:items-end sm:justify-between sm:p-6">
            <div>
              <p className="font-heading text-4xl tracking-tighter tabular-nums sm:text-5xl">{step.figure}</p>
              <p className="mt-1.5 text-base">{step.caption}</p>
            </div>
            <GoLink href={step.link.href}>{step.link.label}</GoLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The glass's way on. A step that leads down this page is a plain anchor,
 *  since the router's link does nothing when the address already ends in
 *  its hash; one that leads to another page is the router's. */
function GoLink({ href, children }: { href: string; children: ReactNode }) {
  const className = cn(
    "group/go flex h-10 w-fit shrink-0 items-center gap-2 rounded-control bg-card pr-4 pl-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none",
    reach,
  );
  const arrow = (
    <ArrowRightIcon className="size-4 transition-transform group-hover/go:translate-x-0.5 motion-reduce:transition-none" />
  );
  return href.startsWith("#") ? (
    <a href={href} className={className}>
      {children}
      {arrow}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
      {arrow}
    </Link>
  );
}
