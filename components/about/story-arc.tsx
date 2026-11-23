"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { storyCopy } from "@/components/about/copy";
import { Caps } from "@/components/ui/caps";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// The arc is one circle and the years ride round its centre, which sits far
// below the band: the picked year at the top, each neighbour a fixed turn to
// its side. Changing the year turns every node at once, so the arc reads as
// one wheel rather than six labels sliding. `--r` is the circle's radius and
// `--turn` the angle between two years, both per width: a phone's arc is
// tighter and shows a year either side, a desktop's is wide and shows all six.
const STAGE = "[--r:260px] [--turn:24] sm:[--r:560px] sm:[--turn:19] lg:[--r:900px] lg:[--turn:9.5]";

export function StoryArc() {
  const c = storyCopy;
  const years = c.years;
  const [picked, setPicked] = useState(years.findIndex((y) => y.year === c.opens));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const y = years[picked];

  const go = (i: number, focus = false) => {
    const to = Math.max(0, Math.min(years.length - 1, i));
    setPicked(to);
    if (focus) tabs.current[to]?.focus();
  };

  const KEYS: Record<string, number> = {
    ArrowRight: picked + 1,
    ArrowLeft: picked - 1,
    Home: 0,
    End: years.length - 1,
  };
  const onKey = (e: KeyboardEvent) => {
    if (!(e.key in KEYS)) return;
    e.preventDefault();
    go(KEYS[e.key], true);
  };

  return (
    <section id="story" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* `slab`: in the dark half this ink band would be the brightest thing
          on the page; the class turns it into a raised dark rung instead. */}
      <div className="slab relative isolate overflow-hidden rounded-lg bg-foreground px-6 pb-12 pt-12 text-background sm:px-12 sm:pb-14 sm:pt-14 lg:px-16 lg:pb-16 lg:pt-16">
        <Doodles />

        {/* The head, over a hairline across the band as the reference rules
            it: the eyebrow in the brand's dot and the band's muted ink, since
            the page's own eyebrow is drawn for a light ground. */}
        <p className="flex items-center gap-2.5">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-primary ring-3 ring-primary/25" />
          <Caps as="span" className="text-background/70">
            {c.eyebrow}
          </Caps>
        </p>
        <SectionHeading className="mt-5 text-background">{c.heading}</SectionHeading>
        <div aria-hidden="true" className="mt-10 h-px bg-background/15 sm:mt-12" />

        {/* The stage: the dashed circle and the six years on it. Its edges
            fade into the band, so a year turning off either end goes rather
            than being cut. */}
        <div
          className={cn(
            "relative mt-4 h-40 sm:h-52 lg:h-56",
            "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
            STAGE,
          )}
        >
          <Sparks />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-24 size-[calc(var(--r)*2)] -translate-x-1/2 rounded-full border border-dashed border-background/30 sm:top-28"
          />

          <div
            role="tablist"
            aria-label={c.heading}
            onKeyDown={onKey}
            className="absolute left-1/2 top-[calc(6rem+var(--r))] sm:top-[calc(7rem+var(--r))]"
          >
            {years.map((node, i) => {
              const on = i === picked;
              return (
                <div
                  key={node.year}
                  style={{ "--at": i - picked } as React.CSSProperties}
                  className="absolute left-0 top-0 size-0 [transform:rotate(calc(var(--at)*var(--turn)*1deg))] transition-transform duration-morph ease-answer motion-reduce:transition-none"
                >
                  <button
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`story-${node.year}`}
                    aria-selected={on}
                    aria-controls="story-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    className={cn(
                      "group/year absolute left-0 top-[calc(var(--r)*-1)] flex -translate-x-1/2 flex-col items-center gap-3 rounded-sm px-3 pb-0 pt-2 outline-none press hover:bg-background/5",
                      // the dot sits on the arc, so the button's foot is the
                      // dot's centre: it overhangs by half the dot
                      "translate-y-[calc(-100%+0.5rem)] focus-visible:ring-3 focus-visible:ring-ring/50",
                    )}
                  >
                    <span className="font-heading text-xl tabular-nums tracking-tight text-background/70 transition-[color,font-size] group-hover/year:text-background group-aria-selected/year:text-3xl group-aria-selected/year:text-background sm:text-2xl sm:group-aria-selected/year:text-4xl">
                      {node.year}
                    </span>
                    <span
                      aria-hidden="true"
                      // edge-role: released template — the picked year's dot grows a soft 4px glow (8px on hover), a halo round a dot rather than a frame, and a 2px inset ring would not read on a 16px dot
                      className="size-4 rounded-full bg-background/40 transition-[background-color,box-shadow] group-aria-selected/year:bg-primary group-aria-selected/year:ring-4 group-aria-selected/year:ring-primary/25 group-aria-selected/year:group-hover/year:ring-8 not-group-aria-selected/year:group-hover/year:bg-background/70"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* What the picked year added: a dashed drop from its dot, then the
            title, the note and the figure the year is measured by. One height
            whichever year is picked, so the page under it holds still. */}
        <div
          id="story-panel"
          role="tabpanel"
          aria-labelledby={`story-${y.year}`}
          className="flex flex-col items-center text-center"
        >
          <span aria-hidden="true" className="h-10 border-l border-dashed border-background/40 sm:h-12" />
          <div key={y.year} className="mt-6 flex min-h-[15rem] flex-col items-center animate-in fade-in duration-sheet ease-sheet motion-reduce:animate-none sm:min-h-[11rem]">
            <p className="flex items-baseline gap-2.5">
              <span className="font-heading text-4xl tracking-tighter tabular-nums sm:text-5xl">{y.figure}</span>
              <span className="text-sm text-background/70">{y.unit}</span>
            </p>
            <h3 className="mt-4 text-xl tracking-tight">{y.title}</h3>
            <p className="mt-2 max-w-md text-base text-background/70">{y.body}</p>
          </div>

          {/* A phone's arc shows a year either side of the picked one, so the
              rest are reached from here as well as by the years themselves. */}
          <div className="mt-6 flex items-center gap-3 sm:hidden">
            <StepButton dir="prev" disabled={picked === 0} onClick={() => go(picked - 1)} label={picked > 0 ? String(years[picked - 1].year) : ""} />
            <StepButton dir="next" disabled={picked === years.length - 1} onClick={() => go(picked + 1)} label={picked < years.length - 1 ? String(years[picked + 1].year) : ""} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepButton({
  dir,
  disabled,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = dir === "prev" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? `Previous year${label ? `, ${label}` : ""}` : `Next year${label ? `, ${label}` : ""}`}
      className="relative flex size-10 items-center justify-center rounded-control bg-background/10 text-background press after:absolute after:-inset-0.5 after:content-[''] hover:bg-background/20 disabled:cursor-not-allowed disabled:text-background/40 disabled:hover:bg-background/10"
    >
      <Icon className="size-4" />
    </button>
  );
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

// Each ray of the sun is a point of one zigzag, the long points a little
// uneven, as a hand draws them.
const sunRays = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const r = i % 2 === 0 ? [40, 37, 42, 38, 41, 36][(i / 2) % 6] : 25;
  return `${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
}).join(" L");

// A five-point star, its points pushed a little off true.
const starPoints = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
  const r = i % 2 === 0 ? [30, 27, 31, 28, 29][i / 2] : 13;
  return `${(60 + r * Math.cos(a)).toFixed(1)} ${(60 + r * Math.sin(a)).toFixed(1)}`;
}).join(" L");

const starTicks = [-80, -35, 10, 55, 100, 145, 190, 235].map((d) => {
  const a = (d * Math.PI) / 180;
  const [r1, r2] = [40, 49];
  return `M${(60 + r1 * Math.cos(a)).toFixed(1)} ${(60 + r1 * Math.sin(a)).toFixed(1)} L${(60 + r2 * Math.cos(a)).toFixed(1)} ${(60 + r2 * Math.sin(a)).toFixed(1)}`;
});

/** The design's corner doodles, on the band behind everything on it. A phone's
 *  band has no corner the copy leaves free, so they start at sm. */
function Doodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden text-primary sm:block">
      {/* the star in its ring of ticks, top-right, tilted as drawn */}
      <svg viewBox="0 0 120 120" className="absolute right-[5%] top-9 w-24 rotate-[14deg] lg:right-[5%] lg:top-10 lg:w-32">
        <path d={`M${starPoints} Z`} {...STROKE} />
        {starTicks.map((d) => (
          <path key={d} d={d} {...STROKE} />
        ))}
      </svg>

      {/* the sun, foot-left */}
      <svg viewBox="0 0 100 100" className="absolute bottom-9 left-[4%] w-20 -rotate-[8deg] lg:bottom-10 lg:left-[5%] lg:w-24">
        <path d={`M${sunRays} Z`} {...STROKE} />
        <circle cx="45" cy="47" r="1.8" fill="currentColor" />
        <circle cx="55" cy="47" r="1.8" fill="currentColor" />
        <path d="M43 54 Q50 60 57 54" {...STROKE} />
      </svg>

      {/* two hearts joined by a looping line, foot-right */}
      <svg viewBox="0 0 100 60" className="absolute bottom-9 right-[4%] w-24 lg:bottom-10 lg:right-[5%] lg:w-32">
        <path d="M14 30C6 24 4 18 8 14c3-3 6-2 7 2 1-4 5-5 7-2 3 4 0 10-8 16Z" {...STROKE} />
        <path d="M14 30c4 12 16 18 24 10 6-7-2-12-5-6-3 7 5 16 16 12 9-3 12-13 5-16-6-2-8 6-3 11 6 6 18 5 26-4" {...STROKE} />
        <path d="M84 36c-7-4-10-9-8-13 2-3 6-3 8 1 1-4 6-5 8-2 3 4-1 10-8 14Z" {...STROKE} />
      </svg>
    </div>
  );
}

/** The design's two sets of three sparkle ticks, flanking the picked year the
 *  way they flank the object in the design. The year always stands at the arc's
 *  top, so the ticks hold still while the years turn under them. */
function Sparks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 z-10 text-primary">
      <svg viewBox="0 0 24 30" className="absolute -left-[4.25rem] top-7 w-6 sm:-left-[5rem] sm:top-9">
        <path d="M3 22 L11 26" {...STROKE} />
        <path d="M6 10 L13 18" {...STROKE} />
        <path d="M17 3 L18 13" {...STROKE} />
      </svg>
      <svg viewBox="0 0 24 30" className="absolute left-[2.75rem] top-7 w-6 -scale-x-100 sm:left-[3.5rem] sm:top-9">
        <path d="M3 22 L11 26" {...STROKE} />
        <path d="M6 10 L13 18" {...STROKE} />
        <path d="M17 3 L18 13" {...STROKE} />
      </svg>
    </div>
  );
}
