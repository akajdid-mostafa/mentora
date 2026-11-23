"use client";

import { useState } from "react";
import { Glyph } from "@/components/marketing/glyphs";
import { policies } from "@/components/marketing/objection";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// Ticks of the plot the reference draws its bars on. Drawn rather than
// implied: a bar with no axis under it is a shape, not a measurement.
const ticks = [0, 20, 40, 60, 80, 100];

// Last month's split. Some courses let the tutor hand an answer over — the
// third policy line below is why — so the outright share is small, not nil.
const REPLIES = "52,800";
const OUTRIGHT = 12;

export function ObjectionBars() {
  const [answerMode, setAnswerMode] = useState(false);

  // Answer mode is the instructor's switch, so turning it on is what collapses
  // the split — the section's whole claim, stated as an arithmetic.
  const outright = answerMode ? 100 : OUTRIGHT;
  const askedBack = 100 - outright;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="rounded-lg bg-accent px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>The objection</Eyebrow>
            <SectionHeading className="mt-5">
              It will not give you the answer
            </SectionHeading>
          </div>

          {/* A raised white control rather than the brand's fill: full
              strength is the primary action's, and in the lime this switch
              outshouted the heading it sits beside. The ink goes into the
              track when it is on, and "off" or "on" is written out, so the
              state never rests on the track's tint alone. */}
          <button
            type="button"
            role="switch"
            aria-checked={answerMode}
            onClick={() => setAnswerMode((v) => !v)}
            className="group/switch press flex h-12 w-fit shrink-0 items-center gap-3 rounded-control bg-card pl-2 pr-5 text-sm shadow-soft hover:shadow-soft-lg active:shadow-none"
          >
            <span className="flex h-8 w-14 items-center rounded-full bg-foreground/15 p-1 transition-colors group-aria-checked/switch:bg-foreground">
              <span className="size-6 rounded-full bg-card shadow-soft transition-transform group-aria-checked/switch:translate-x-6" />
            </span>
            <span className="font-medium">
              Answer mode {answerMode ? "on" : "off"}
            </span>
          </button>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[30fr_70fr] lg:gap-16">
          <div>
            <p className="text-balance text-base text-muted-foreground">
              Of {REPLIES} tutor replies last month, this many came back as a
              question
            </p>
            <p className="mt-6 flex items-baseline font-heading text-7xl tracking-tighter text-primary-ink tabular-nums sm:text-8xl">
              {askedBack}
              <span className="text-4xl tracking-tighter sm:text-5xl">%</span>
            </p>
          </div>

          {/* the plot: a dashed grid behind two bars and an axis under them,
              the grid running down to meet the axis rather than stopping
              short of it */}
          <div data-picture data-object className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 bottom-6 flex justify-between"
            >
              {ticks.map((t) => (
                <span key={t} className="w-px border-l border-dashed border-foreground/15" />
              ))}
            </div>

            <div className="relative flex flex-col gap-10 pb-10">
              <Bar
                label="Answered outright"
                value={outright}
                className="bg-coral/15 bg-[repeating-linear-gradient(45deg,var(--coral)_0_1.5px,transparent_1.5px_7px)] ring-1 ring-inset ring-coral/60"
              />
              <Bar
                label="Asked back, and cited a minute"
                value={askedBack}
                className="bg-primary"
              />
            </div>

            {/* Each number is centred on its own line, as the reference sets
                them. Spread with justify-between they drifted: a wider label
                takes more of the row, and "80" stood 12px left of its line. */}
            <div className="absolute inset-x-0 bottom-0 h-6 border-t border-foreground/15">
              {ticks.map((t) => (
                <span
                  key={t}
                  style={{ left: `${t}%` }}
                  className="absolute top-2 -translate-x-1/2 text-xs tabular-nums text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* The three policy lines, each opening on a drawing from the set the
            hero's doors use. Stacked on a phone; from `sm` each drawing sits
            beside its words; from `lg` three columns share their rows, so a
            title that wraps where its neighbours do not still leaves the
            three bodies starting on one line. The columns are spaced by the
            gap and the rules drawn in it: padding would have narrowed the
            middle column, and the first one would have stood in from the
            heading above. */}
        <ul className="mt-16 grid gap-y-16 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-0">
          {policies.map((p, i) => (
            <li
              key={p.policy}
              className="relative sm:flex sm:gap-x-6 lg:row-span-3 lg:grid lg:grid-rows-subgrid"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -top-8 h-px bg-border lg:inset-y-0 lg:right-auto lg:-left-8 lg:h-auto lg:w-px"
                />
              )}
              <Glyph name={p.glyph} className="shrink-0" />
              {/* two lines at every width: the copy is written to it, and
                  beside the drawing the words are held to the width the
                  columns give them */}
              <div className="sm:max-w-80 lg:contents">
                <p className="mt-6 text-balance text-base font-medium sm:mt-0 lg:mt-6">
                  {p.policy}
                </p>
                <p className="mt-2 text-balance text-base text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** One bar on the plot, with its share written where the eye lands: inside
 *  its own end when the bar has room for it, just past the end when not.
 *  A small share keeps a sliver so the bar is still there to see, and a
 *  share of zero draws no bar at all, or answer mode would leave a stub
 *  standing over "0%". */
function Bar({
  label, value, className,
}: { label: string; value: number; className: string }) {
  const inside = value >= 16;
  const share = (
    <span className="rounded-control bg-card px-2 py-0.5 text-sm tabular-nums text-foreground shadow-soft">
      {value}%
    </span>
  );
  return (
    <div>
      {/* on the plot's own tint, so the grid stops at the words */}
      <p className="relative w-fit bg-accent pr-2 text-base">{label}</p>
      <div className="mt-2 flex h-8 items-center gap-2.5 sm:h-10">
        <span
          style={{ width: `${value > 0 ? Math.max(value, 1.5) : 0}%` }}
          className={cn(
            "flex h-full shrink-0 items-center justify-end rounded-sm transition-[width]",
            inside && "pr-1.5",
            className,
          )}
        >
          {inside && share}
        </span>
        {!inside && share}
      </div>
    </div>
  );
}
