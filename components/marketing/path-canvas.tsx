"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useId, useRef, useState } from "react";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  finishes,
  goals,
  legWeeks,
  matchGoal,
  pathHref,
  totalHours,
  weekOf,
  type Goal,
} from "@/components/marketing/goals";
import { setPace, usePathChoices } from "@/components/paths/store";
import {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { reach } from "@/components/reach";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

const HOURS = { min: 2, max: 20 };

// Where the scribbled arrow under the slider points: the hours a week a
// first visit opens at, the seed of the paths' store (components/paths/store.ts).
const START = 9;

// What the line under the goal field says until a build has something to
// report, so the form never opens on an empty gap.
const HINT = "Type a job title, or pick an example goal.";

export function PathCanvas() {
  const [goalId, setGoalId] = useState(goals[0].id);
  // The paths' own hours a week, kept in the browser, so the pace set here
  // is the pace the path's page opens at, and the other way round.
  const perWeek = usePathChoices().pace;
  const [typed, setTyped] = useState(goals[0].label);
  const [note, setNote] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const field = useRef<HTMLInputElement>(null);

  const goal = goals.find((g) => g.id === goalId) ?? goals[0];
  const total = totalHours(goal);
  const { weeks, label: finishLabel } = finishes(total, perWeek);

  const choose = (g: Goal) => {
    setGoalId(g.id);
    setTyped(g.label);
    setNote(null);
    setSaved(false);
  };

  // A typed goal builds a path too: it lands on the sample it shares the most
  // words with, and says so when that is not what was typed.
  const build = () => {
    const g = matchGoal(typed);
    if (!g) {
      setNote("Nothing to build from that yet. Try the job you want, like “data analyst”.");
      return;
    }
    setGoalId(g.id);
    setSaved(false);
    // Always a line back, so a press on the goal already built still answers.
    const done = finishes(totalHours(g), perWeek).label;
    setNote(
      g.label === typed
        ? `Built: ${g.label}, done by ${done}.`
        : `Built as “${g.label}”, the closest path there is.`,
    );
  };

  // The head's button opens the planner, two blocks down: it brings the field
  // into view, then hands it the caret with the goal selected for retyping.
  const toPlanner = () => {
    const f = field.current;
    if (!f) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    f.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
    f.focus({ preventScroll: true });
    f.select();
  };

  return (
    // `paths` is where the header's "Start from your own goal" lands
    <section id="paths" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* the reference's copy band, moved up to be the head: the claim on the
          left, its two doors on the right */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <Eyebrow>Drafted by the tutor</Eyebrow>
          {/* the second sentence kept whole, so a phone breaks the line at
              the full stop rather than leaving "The" at the end of it */}
          <SectionHeading className="mt-5">
            Name a goal.{" "}
            <span className="inline-block">The courses line up.</span>
          </SectionHeading>
          <p className="mt-4 max-w-md text-balance text-base text-muted-foreground">
            Five courses, each after the one it builds on, and a finish date set
            by the hours you can spare.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          <Button type="button" onClick={toPlanner} size="lg" className="h-12 px-7 text-base font-normal">
            Build my path
          </Button>
          {/* the path the chosen goal drafts, on a page of its own */}
          <Link
            href={pathHref(goal)}
            className={cn(
              "press group flex h-10 items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground",
              reach,
            )}
          >
            See the full path
            <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* The examples strip over the two panels it drives, the way row 3's
          questions sit over its card: the goals on the left, the chosen
          one's pitch across from them. It is the planner's own picker, so
          its line is data at 14 — which is what `data-object` says. */}
      <div
        data-object
        className="mt-12 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-10"
      >
        <GoalTabs goal={goal} onPick={choose} />
        {/* Held to 16rem so every pitch breaks into two even lines: at the
            width of the tray's row the longest ran 416px on one, a long thin
            rule of grey beside the tabs. */}
        <p className="max-w-64 text-balance text-sm text-muted-foreground xl:text-right">
          {goal.blurb}
        </p>
      </div>

      {/* The reference's two saturated panels, in the brand's pastel: the
          deeper one holds what a reader gives the planner, the paler one what
          it gives back. Stacked until there is room for both side by side
          with their wheels. Each sits in a wrapper that carries its wheel's
          outer half, behind the panel and free of its clip, and each is at
          least as tall as the wheel's rim needs to leave it at the corners.
          Together they are the panel the goal tabs drive, and the section's
          picture. */}
      <div
        id="path-plan"
        role="tabpanel"
        aria-labelledby={`goal-tab-${goal.id}`}
        data-picture
        className="relative isolate mt-8 grid gap-4 xl:grid-cols-2"
      >
        <div className="relative">
          <Wheel side="left" layer="outer" value={perWeek} min={HOURS.min} max={HOURS.max} />
          <div className="relative isolate h-full overflow-hidden rounded-lg bg-lime-surface px-5 py-8 sm:p-10 lg:min-h-[42.5rem] lg:pl-72 xl:pl-52">
            <Wheel side="left" layer="inner" value={perWeek} min={HOURS.min} max={HOURS.max} caption="hours a week" />
            <div className="relative lg:mx-auto lg:max-w-md xl:mx-0">
              <div data-object className="rounded-lg bg-card p-6 shadow-soft sm:p-7">
                <Caps>Path planner</Caps>
                <p className="mt-3 text-xl tracking-tight">What is the job, and how much of your week can it have?</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    build();
                  }}
                  className="mt-6"
                >
                  <label htmlFor="path-goal" className="text-sm text-muted-foreground">
                    Your goal
                  </label>
                  <div className="mt-2 flex h-12 items-center rounded-control bg-accent pl-4 pr-1.5 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring">
                    <input
                      ref={field}
                      id="path-goal"
                      name="goal"
                      size={1}
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-base outline-none"
                    />
                    {/* The AI glyph in the light ink, on iris a step deeper,
                        halfway to its ink: on the plain fill the near-white
                        read 2.7:1 and its outline went thin. */}
                    <button
                      type="submit"
                      aria-label="Build the path"
                      className="press flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-background hover:bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))]/80"
                    >
                      <AiIcon size={18} />
                    </button>
                  </div>
                  <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted-foreground">
                    {note ?? HINT}
                  </p>
                </form>

                <Week perWeek={perWeek} />

                <SliderRoot
                  value={perWeek}
                  onValueChange={(v) => setPace(v as number)}
                  min={HOURS.min}
                  max={HOURS.max}
                  step={1}
                  className="mt-6"
                >
                  <div className="flex items-baseline justify-between">
                    <SliderLabel>Hours free each week</SliderLabel>
                    <span className="text-sm tabular-nums">{perWeek} hours</span>
                  </div>
                  <SliderControl className="mt-1">
                    <SliderTrack>
                      <SliderIndicator />
                      <SliderThumb />
                    </SliderTrack>
                  </SliderControl>
                </SliderRoot>
              </div>
              <Scribble />
            </div>
          </div>
        </div>

        <div className="relative">
          <Wheel
            side="right"
            layer="outer"
            value={weeks}
            min={Math.ceil(total / HOURS.max)}
            max={Math.ceil(total / HOURS.min)}
          />
          <div className="relative isolate h-full overflow-hidden rounded-lg bg-lime-band px-5 py-8 sm:p-10 lg:min-h-[42.5rem] lg:pr-72 xl:pr-52">
            <Wheel
              side="right"
              layer="inner"
              value={weeks}
              min={Math.ceil(total / HOURS.max)}
              max={Math.ceil(total / HOURS.min)}
              caption="weeks"
            />
            <div data-object className="relative rounded-lg bg-card p-6 shadow-soft sm:p-7 lg:mx-auto lg:max-w-md xl:mx-0">
              <Caps>Finishes</Caps>
              <p aria-live="polite" className="mt-2 font-heading text-3xl tracking-tighter">
                {finishLabel}
              </p>
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                {weeks} weeks at {perWeek} hours a week
              </p>

              {/* Three tiles in a row, two lines each: the icon, then the
                  figure with its word. At 1440 a tile has 69px for that line,
                  which "5 courses" fills and "1 certificate" overruns, so the
                  long word goes short there and stays whole for a screen
                  reader. On a phone, three rows with the whole word first and
                  the figure at the end.
                  The words sit a step under the figure, in the muted ink. On a
                  pastel surface the house keeps to one ink, since a 200 step
                  takes the muted one under 4.5; lime keeps its 100 step at
                  both strengths, where the muted ink reads 5.2 — the reading
                  controls-check's Rule E takes at candy.
                  One lime panel cut in three rather than three lime tiles:
                  the figures are one plan's summary, not peers to tell apart. */}
              <ul className="mt-6 grid divide-y divide-card overflow-hidden rounded-sm bg-lime-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  { Icon: BookOpenIcon, figure: goal.legs.length, word: "courses" },
                  { Icon: ClockIcon, figure: total, word: "hours" },
                  { Icon: AcademicCapIcon, figure: 1, word: "certificate", short: "cert" },
                ].map(({ Icon, figure, word, short }) => (
                  <li
                    key={word}
                    className="flex items-center gap-3 px-3.5 py-2.5 sm:block sm:px-3 sm:py-3"
                  >
                    <Icon aria-hidden="true" className="size-5 shrink-0 text-lime-ink" />
                    <p className="text-sm capitalize text-muted-foreground sm:hidden">{word}</p>
                    <p className="ml-auto flex items-baseline gap-1 whitespace-nowrap sm:ml-0 sm:mt-2">
                      <span className="font-heading text-xl tracking-tight tabular-nums">{figure}</span>
                      <span aria-hidden={short ? true : undefined} className="text-sm text-muted-foreground max-sm:hidden">
                        {short ?? word}
                      </span>
                      {short && <span className="sr-only max-sm:hidden">{word}</span>}
                    </p>
                  </li>
                ))}
              </ul>

              {/* the schedule as a two-column list: each leg on one line by
                  its short name, the weeks it runs across under one heading */}
              <Caps as="div" className="mt-6 flex items-baseline justify-between">
                <p>The five legs</p>
                <p aria-hidden="true">Weeks</p>
              </Caps>
              <ol className="mt-2">
                {legWeeks(goal, perWeek).map((w, i) => (
                  // The rule between legs is dashed, five on and six off, and
                  // a fifth lighter than the hairline, so the rows read as one
                  // schedule rather than a stack of cells.
                  <li
                    key={goal.legs[i].title}
                    className="flex items-center gap-3 border-b py-2.5 text-sm [border-image:repeating-linear-gradient(to_right,color-mix(in_oklab,var(--border)_80%,transparent)_0_5px,transparent_5px_11px)_1] last:border-b-0"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{goal.legs[i].short}</span>
                    <span className="shrink-0 text-muted-foreground tabular-nums">
                      <span className="sr-only">{w.from === w.to ? "Week " : "Weeks "}</span>
                      {w.from === w.to ? w.from : `${w.from}–${w.to}`}
                    </span>
                  </li>
                ))}
              </ol>

              <button
                type="button"
                aria-pressed={saved}
                onClick={() => setSaved((v) => !v)}
                className={cn(
                  "press mt-5 flex h-10 w-fit items-center gap-2 whitespace-nowrap rounded-control px-4 text-sm",
                  reach,
                  "aria-pressed:bg-iris/15 aria-pressed:text-iris-ink aria-pressed:hover:bg-iris/25",
                  "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
                )}
              >
                {saved ? (
                  <CheckIcon aria-hidden="true" className="size-4" />
                ) : (
                  <CalendarDaysIcon aria-hidden="true" className="size-4" />
                )}
                {saved ? "In your calendar" : "Add to your calendar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The reference's strip: a label, then the examples in the site's track.
 *  Each tab carries the role its goal ends in, so four share a row once the
 *  frame is wide enough and sit two by two until then, and nothing has to
 *  scroll out of sight. */
function GoalTabs({ goal, onPick }: { goal: Goal; onPick: (g: Goal) => void }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
      <Caps id="goal-tabs" className="shrink-0">
        Example goals
      </Caps>
      <TabTrack
        labelledBy="goal-tabs"
        idPrefix="goal-tab"
        controls="path-plan"
        // Two by two on a phone, in a well cornered like a card rather than
        // a control; the tabs take its corner less the padding, so the two
        // curves run parallel.
        options={goals.map((g) => ({
          id: g.id,
          label: g.short,
          icon: <g.Icon className="size-4" />,
          className: "max-md:rounded-[calc(var(--radius-lg)-4px)]",
        }))}
        value={goal.id}
        onChange={(id) => onPick(goals.find((g) => g.id === id) ?? goal)}
        className="grid w-full grid-cols-2 rounded-lg md:inline-flex md:w-fit md:rounded-control"
      />
    </div>
  );
}

const days = ["M", "T", "W", "T", "F", "S", "S"];

/** The week the slider describes, a day at a time: one block an hour, so the
 *  number on the slider turns into evenings a reader can picture. A day holds
 *  four at most — Saturday's share at twenty hours — so the well is four
 *  blocks tall. */
function Week({ perWeek }: { perWeek: number }) {
  const week = weekOf(perWeek);
  return (
    <div className="mt-6">
      <p className="text-sm text-muted-foreground">Your week</p>
      <ol className="mt-3 grid grid-cols-7 gap-2">
        {week.map((h, i) => (
          <li key={i} className="flex flex-col items-center gap-2">
            <span className="flex h-[4.25rem] w-full flex-col-reverse gap-1 rounded-sm bg-accent p-1">
              {Array.from({ length: h }, (_, j) => (
                <span key={j} className="h-3 shrink-0 rounded-[3px] bg-primary" />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">{days[i]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The rim's strength along its circle, by degrees from the pick: full level
// with the chosen numeral and falling away as the numerals do, so the far side
// of the wheel dissolves instead of closing into a ring.
const RIM_FADE = [
  [0, 1],
  [20, 0.85],
  [40, 0.55],
  [60, 0.3],
  [90, 0.12],
  [120, 0.04],
  [150, 0],
];

/** The design's wheel: a rim too big for its panel, so one arc shows at the
 *  panel's outer edge, and the numerals inside it turning with the value.
 *
 *  One geometry, drawn twice. The inner layer sits in the panel and is
 *  clipped by it, at full strength. The outer layer sits behind the panel,
 *  free of its clip, and a step softer, so past the panel's edge the wheel
 *  carries on to the screen's edge without competing with what is inside.
 *  The rim is sized so it leaves the panel at the corners, where nothing else
 *  is: above and below the panel it rises into the margin, never into the
 *  goals row over it.
 *
 *  The chosen numeral sits level with the wheel's centre in ink; each step
 *  away is paler and smaller. Inside, the fourth numeral is already at the
 *  panel's edge; outside, one more shows before the next would turn past
 *  upright. The rim fades the same way, by a radial gradient centred on its
 *  point level with the pick: distance from that point grows with the angle
 *  round the circle, so the gradient's offsets are the chord of each angle,
 *  sin(θ/2) of the diameter. */
function Wheel({
  side, layer, value, min, max, caption,
}: {
  side: "left" | "right";
  layer: "inner" | "outer";
  value: number;
  min: number;
  max: number;
  caption?: string;
}) {
  const W = 260;
  const H = 760;
  const R = 330; // rim centreline
  const RN = R - 106; // numerals
  const STEP = 20; // degrees between numerals
  const INTO = 200; // how far the rim reaches into the panel
  const left = side === "left";
  const outer = layer === "outer";
  const cx = left ? INTO - R : W - INTO + R;
  const cy = H / 2;
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const at = left ? cx + RN : cx - RN;
  const last = outer ? 4 : 3;
  const shade = outer ? [0.5, 0.14, 0.08, 0.05, 0.035] : [1, 0.28, 0.16, 0.09];
  // Outside the panel the rim steps down as the numerals do, about half.
  const strength = outer ? 0.6 : 1;
  const rim = `rim-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      className={cn(
        "pointer-events-none absolute top-1/2 hidden h-[47.5rem] w-[16.25rem] -translate-y-1/2 overflow-visible",
        "lg:block",
        outer && "-z-10",
        left ? "left-0" : "right-0",
      )}
    >
      <defs>
        <radialGradient
          id={rim}
          gradientUnits="userSpaceOnUse"
          cx={left ? cx + R : cx - R}
          cy={cy}
          r={2 * R}
        >
          {RIM_FADE.map(([deg, o]) => (
            <stop
              key={deg}
              offset={Math.sin((deg * Math.PI) / 360)}
              style={{ stopColor: "var(--lime-mark)", stopOpacity: o * strength }}
            />
          ))}
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={R} fill="none" strokeWidth="64" stroke={`url(#${rim})`} />
      {values.map((v) => {
        const d = Math.abs(v - value);
        const turn = (left ? -1 : 1) * (v - value) * STEP;
        return (
          <g
            key={v}
            style={{
              transform: `rotate(${turn}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: "transform var(--duration-morph) var(--ease-answer)",
            }}
          >
            <text
              x={at}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground font-heading tabular-nums"
              style={{
                fontSize: d === 0 ? 64 : 52,
                fillOpacity: shade[d] ?? 0,
                visibility: d > last ? "hidden" : "visible",
                letterSpacing: "-0.04em",
                transition:
                  "fill-opacity var(--duration-morph) var(--ease-answer), font-size var(--duration-morph) var(--ease-answer), visibility var(--duration-morph) var(--ease-answer)",
              }}
            >
              {String(v).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      {caption && (
        <text
          x={at}
          y={cy + 38}
          textAnchor="middle"
          className="fill-foreground font-sans text-xs"
        >
          {caption}
        </text>
      )}
    </svg>
  );
}

/** The design's handwritten label and its scribbled arrow, under the control it
 *  points at. The arrow leaves the words, bows under them and climbs over the
 *  card's edge to stop just short of the thumb where the planner opens, so it
 *  is pointing at the thing to drag rather than at the card around it. Drawn
 *  words would not read as a hand in this face, so the words are real text and
 *  only the arrow is drawn — and it draws itself again every few seconds,
 *  which a reader who asked for stillness sees as the arrow alone. */
function Scribble() {
  // Where the thumb sits at the opening value, across the card: the track
  // runs inside the card's padding, which is 1.75rem wherever this shows.
  const at = (START - HOURS.min) / (HOURS.max - HOURS.min);
  return (
    <p
      style={{ "--at": `calc(1.75rem + (100% - 3.5rem) * ${at})` } as CSSProperties}
      className="relative mt-5 hidden pl-[calc(var(--at)+2.75rem)] font-heading text-xl tracking-tight text-foreground sm:block"
    >
      {/* The tip is at (13, 4) in the drawing, so the drawing sits 13px left
          of the thumb's centre and 38px up, which puts the tip 14px under the
          thumb and the tail beside the first line of the words. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 52 64"
        fill="none"
        className="pointer-events-none absolute -top-9.5 left-[calc(var(--at)-0.8125rem)] h-16 w-13 overflow-visible motion-safe:animate-scribble"
      >
        <path
          d="M47 52C33 57 15 50 13 6"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="motion-safe:animate-scribble-shaft"
        />
        <path
          d="M6.5 14Q10.2 8.8 13 4.5Q16 9.2 20 13"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="motion-safe:animate-scribble-head"
        />
      </svg>
      <span className="inline-block -rotate-2">
        drag me,
        <br />
        the date moves
      </span>
    </p>
  );
}
