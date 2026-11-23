"use client";

import Image from "next/image";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  instructors,
  type Instructor,
} from "@/components/marketing/instructors-data";
import { face } from "@/components/marketing/quotes";
import {
  Instrument,
  promises,
  steps,
  studioCopy,
  useStudio,
} from "@/components/marketing/studio-kit";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export function StudioStepCards() {
  const studio = useStudio();
  const { step, open, drafting, drafted } = studio;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* Three cells, not two columns. From lg the copy and the drawing
          share the left column, the drawing centred in whatever height the
          steps leave under the copy, and the steps span both rows on the
          right. On a phone the source order is the reading order: the claim,
          then the studio to try, then the drawing as the row's close, rather
          than 380px of drawing between a reader and the thing to press. */}
      <div className="grid gap-12 rounded-lg bg-iris-surface px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[45fr_55fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-12 lg:p-16">
        <div>
          <Eyebrow>{studioCopy.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{studioCopy.heading}</SectionHeading>
          <p className="mt-6 max-w-[26rem] text-base">{studioCopy.lede}</p>
        </div>

        {/* The three steps as the reference's stacked cards, one open at a
            time. The open card is the instrument itself, so it is the
            section's picture: a working studio at real size. A closed one
            sits a step paler than the panel, on the hue's opaque soft step
            rather than a see-through white, so its muted lines are read
            against a colour of their own.

            Every step opens. 02 and 03 used to be disabled until a draft
            existed, and a reader who tried them first met two cards that did
            nothing; now either one runs the draft and opens on it. The open
            card's own header cannot close it, so it is marked disabled
            rather than wearing a hover that promises a click. The studio
            is a product object, so its 14px lines are data. */}
        <ol
          data-picture
          data-object
          className="flex flex-col gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          {steps.map((s, i) => {
            const isOpen = step === s.id;
            return (
              <li
                key={s.id}
                className="rounded-lg bg-iris-soft transition-colors has-[>button[aria-expanded=true]]:bg-card has-[>button[aria-expanded=true]]:shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => open(s.id)}
                  data-step={s.id}
                  aria-expanded={isOpen}
                  aria-disabled={isOpen || undefined}
                  className={cn(
                    "group/step flex w-full items-center gap-5 p-5 text-left sm:p-6",
                    "aria-expanded:cursor-default not-aria-expanded:rounded-lg not-aria-expanded:transition-colors not-aria-expanded:hover:bg-card/60 not-aria-expanded:active:bg-card/30",
                    reach,
                  )}
                >
                  <span
                    className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-card group-aria-expanded/step:bg-accent"
                  >
                    <s.Icon className="size-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs tabular-nums text-muted-foreground">
                      0{i + 1}
                    </span>
                    <span className="mt-1 block text-2xl tracking-tighter">
                      {s.label}
                    </span>
                  </span>
                  {!isOpen && (
                    <ChevronDownIcon className="ml-auto size-5 shrink-0 text-muted-foreground transition-transform group-hover/step:translate-y-0.5 motion-reduce:transition-none" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 sm:pl-[6.5rem]">
                    <p className="text-base text-muted-foreground">{s.title}</p>
                    <Instrument studio={studio} className="mt-5" />
                    {(s.id === "describe" || drafted) && (
                      <ul className="mt-6 flex flex-col gap-2 border-t pt-5">
                        {promises[s.id].map((t) => (
                          <li key={t} className="flex gap-2.5 text-base text-muted-foreground">
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-iris" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* the way on, so the three read as one flow rather
                        than three cards to guess between */}
                    {drafted && s.id === "outline" && (
                      <Button variant="outline" className="mt-6" onClick={() => open("quiz")}>
                        Next: cut the quiz
                        <ArrowRightIcon data-icon="inline-end" />
                      </Button>
                    )}
                    {drafted && s.id === "quiz" && (
                      <Button variant="outline" className="mt-6" onClick={studio.reset}>
                        Start over
                        <ArrowPathIcon data-icon="inline-end" />
                      </Button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* The instructors who teach, at the foot of the copy where the
            reference keeps its pair, with the hero's hand drawn round them.
            Under lg the cell follows the steps, and the extra 24px above it
            is the room the sprout grows in. */}
        <div className="relative mt-6 flex flex-col justify-end lg:mt-0">
          <Spark d={sparks.large} className="top-12 left-56 hidden w-14 lg:block" />
          <div className="relative w-fit">
            <div aria-hidden="true" className="flex">
              {trio.map((p, i) => (
                <Image
                  key={p.name}
                  src={face(p.id, 224)}
                  alt=""
                  width={112}
                  height={112}
                  unoptimized
                  className={cn(
                    "size-20 rounded-full object-cover ring-4 ring-iris-surface sm:size-28",
                    i > 0 && "-ml-4",
                  )}
                />
              ))}
            </div>
            <Sprout className="-top-14 -left-5 w-16 -scale-x-100 sm:-top-16 sm:-left-6 sm:w-20" />
            <Squiggle className="bottom-[-0.5rem] left-[calc(100%+0.25rem)] hidden w-50 sm:block lg:hidden xl:block" />
            <Spark
              d={sparks.small}
              className="-top-10 right-0 w-8 rotate-12 sm:top-auto sm:right-auto sm:bottom-[8.5rem] sm:left-[calc(100%+10rem)] lg:bottom-[5.5rem] lg:left-[calc(100%+0.25rem)] xl:bottom-[9.5rem] xl:left-[calc(100%+10.5rem)]"
            />
          </div>
          <p className="mt-4 text-sm">{studioCopy.credit}</p>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {drafting
          ? "Drafting the outline."
          : drafted
            ? "Drafted: six chapters and four quiz questions."
            : ""}
      </p>
    </section>
  );
}

// The three at the foot, found by name rather than by place for the reason
// lesson.ts gives: the instructor rows can be reordered. They stand in the
// order the credit under them names them.
const trio = ["Ana Reyes", "Tomás Oliveira", "Mara Lindqvist"]
  .map((n) => instructors.find((p) => p.name === n))
  .filter((p): p is Instructor => Boolean(p));

// The hero's hand, drawn round the faces. Every mark is placed against the row
// of faces rather than the panel, since the row is the one thing here of a
// fixed size — 304px from sm, 208 under it — while the column beside it runs
// from 224px on a phone to 461 at xl.
//
// The squiggle is 200px wide and needs that much beside the faces: from xl it
// leaves the last face and ends in the gap short of the steps, from sm to lg
// it runs along the row that closes the panel, and at lg, where the column
// leaves it 42 to 156px, it is not drawn — the hero drops its own squiggle at
// lg for the same want of room. The small spark takes the room it leaves
// there, beside the last face; from xl it sits in the gap by the steps, from
// sm over the squiggle's tail, and under sm over the last face. The large
// spark is drawn only from lg, in the height the steps leave under the copy;
// under lg the steps fill it.

// Five tapered rays, thick at the centre and a hair at the tip, each side
// drawn slightly in: the hero's spark, drawn again at angles of its own rather
// than stamped, since a hand never draws the same star twice.
function spark(rays: [deg: number, len: number][]) {
  return rays
    .map(([deg, len]) => {
      const a = (deg * Math.PI) / 180;
      const [x, y] = [Math.cos(a), Math.sin(a)];
      const pt = (along: number, across: number) =>
        `${(24 + x * along - y * across).toFixed(2)} ${(24 + y * along + x * across).toFixed(2)}`;
      return `M${pt(0, 1.7)}Q${pt(len * 0.45, 0.55)} ${pt(len, 0)}Q${pt(len * 0.45, -0.55)} ${pt(0, -1.7)}Z`;
    })
    .join("");
}

const sparks = {
  large: spark([
    [-104, 21],
    [-36, 22],
    [33, 21],
    [104, 20],
    [174, 22],
  ]),
  small: spark([
    [-120, 20],
    [-50, 22],
    [22, 21],
    [92, 22],
    [163, 21],
  ]),
};

function Spark({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={cn("pointer-events-none absolute fill-foreground", className)}
    >
      <path d={d} />
    </svg>
  );
}

// One ink hairline out of the dot, up into a tall loop, down across itself,
// into a smaller loop and away to the right. The dot and the loop scribbled
// round it are the hero's, at the same size.
function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 220"
      fill="none"
      strokeLinecap="round"
      className={cn("pointer-events-none absolute text-foreground", className)}
    >
      <path
        d="M8 196C40 186 78 150 88 104 96 64 74 40 58 58 42 78 64 134 110 138 146 140 168 110 162 88 156 70 136 74 140 96 144 122 176 136 214 112"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="24.8" cy="206.3" r="10.5" className="fill-primary" />
      <path
        d="M22.5 213c-6-2-6-13 2-18 7-4 16 1 15 9-1 8-11 11-18 7-5-4-3-15 7-17 6-1 12 4 14.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// The hero's sprout, stroke for stroke: a hooked wave, an arc down to a
// point, an arm back up and three short dashes.
function Sprout({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 60"
      fill="none"
      strokeLinecap="round"
      strokeWidth="2"
      className={cn(
        "pointer-events-none absolute stroke-[color-mix(in_oklab,var(--primary),var(--primary-ink))]",
        className,
      )}
    >
      <path
        d="M4 11.3c3-1.8 9-3.3 12.5-.8s4 10.5 3 13.5c-.9 2-1.7-3 1-6.5 3-4 8.5-5.5 13.5-5.3 8 .3 15 6.8 16.8 17.8 1 7-.3 15-2 21.3"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M50 45.5c6-11.5 13-23.5 22.5-33.2" vectorEffect="non-scaling-stroke" />
      <path d="M59.4 20l6.2-7.5" vectorEffect="non-scaling-stroke" />
      <path d="M54 48.1c3-2.1 6.5-4.1 9.8-5.8" vectorEffect="non-scaling-stroke" />
      <path d="M58.1 52.8c5.9.2 12.9 1.2 18.4 3.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
