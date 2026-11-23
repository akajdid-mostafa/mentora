import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, PlayIcon, StarIcon } from "@heroicons/react/24/solid";
import { proof } from "@/components/marketing/catalogue";
import { Cutout, portraits } from "@/components/marketing/cutout";
import { Glyph } from "@/components/marketing/glyphs";
import { doors, headline, lede } from "@/components/marketing/hero-copy";
import { HeroSearch } from "@/components/marketing/hero-search";
import { LESSON, TEACHER, TOTAL, questions } from "@/components/marketing/lesson";
import { face } from "@/components/marketing/quotes";
import { TopicChips } from "@/components/marketing/topic-chips";
import { AiIcon } from "@/components/ui/ai-icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { float } from "@/components/float";
import { cn } from "@/lib/utils";

const HEAD = 0.15;
const CY = (HEAD + 0.5) / (1 + HEAD);
const RY = 0.5 / (1 + HEAD);

const answer = questions[0].a;
const played = `${((answer.seconds / TOTAL) * 100).toFixed(1)}%`;


export function HeroPortraitColumns() {
  return (
    <section className="overflow-x-clip">
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-8 sm:pt-14">
        {/* one column of minmax(0, 1fr) under lg: an implicit track took the
            304px cutout's width at 320, and the words and the search field
            under them ran 8px past the screen's edge */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
          <div>
            <Eyebrow>Courses with a tutor</Eyebrow>
            <h1 className="mt-5 max-w-[14ch] text-5xl tracking-tighter sm:text-6xl lg:text-7xl">
              {headline}
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">{lede}</p>
            <HeroSearch className="mt-10 w-full max-w-md" />
            <p className="mt-3 text-sm text-muted-foreground tabular-nums">{proof}</p>
            <TopicChips className="mt-6 max-w-md" />
          </div>

          <Figure />
        </div>

        <ul className="mt-20 grid sm:mt-24 lg:grid-cols-3">
          {doors.map((d, i) => (
            <li
              key={d.title}
              className={cn(
                "border-t py-8 lg:border-t-0 lg:py-2",
                i > 0 && "lg:border-l lg:pl-10",
                i < doors.length - 1 && "lg:pr-10",
              )}
            >
              <Link href={d.href} className="group block">
                <Glyph name={d.glyph} />
                <p className="mt-6 flex items-center gap-2 text-base">
                  {d.title}
                  {/* a door has no fill to sink, so a press carries the
                      arrow the rest of the way */}
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground group-active:translate-x-1"
                  />
                </p>
                {/* held to 20rem, so a row stacked full width keeps the two
                    lines its column has beside the others */}
                <p className="mt-2 max-w-xs text-balance text-base text-muted-foreground">
                  {d.body}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The disc, the learner standing in it, the three cards around her and the
 *  hand drawn about them — all measured in `--d`, the width of the disc, so
 *  one number per breakpoint scales the lot. */
function Figure() {
  return (
    <div className="relative mx-auto mb-[calc(var(--d)*0.12)] h-[calc(var(--d)*1.15)] w-[var(--d)] [--d:19rem] sm:mb-0 sm:[--d:26rem] xl:ml-0 xl:[--d:34rem]">
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <clipPath id="hero-circle-clip" clipPathUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height={CY} />
            <ellipse cx="0.5" cy={CY} rx="0.5" ry={RY} />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "url(#hero-circle-clip)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 aspect-square rounded-full bg-[color-mix(in_oklab,var(--primary)_62%,var(--background))]"
        />
        <Cutout
          portrait={portraits.glasses}
          px={1066}
          className="absolute -left-[calc(var(--d)*0.02)] -top-[calc(var(--d)*0.566)] w-[calc(var(--d)*0.98)]"
        />
      </div>

      {/* Over the disc rather than under it: the squiggle's far end crosses
          onto it, as the design's does onto its slab. */}
      <Marks />

      {/* The tutor's side of the exchange, at her shoulder: the one dark
          thing in the frame, since it is the one thing the page is about. */}
      <div
        data-object
        className={cn(
          float,
          "absolute -left-[calc(var(--d)*0.04)] top-[calc(var(--d)*0.64)] w-52 -rotate-2 rounded-lg rounded-br-sm bg-foreground p-4 text-background sm:-left-[calc(var(--d)*0.14)] sm:top-[calc(var(--d)*0.62)] sm:w-56 lg:-left-[calc(var(--d)*0.08)] xl:-left-[calc(var(--d)*0.2)] xl:top-[calc(var(--d)*0.56)]",
        )}
      >
        <p className="flex items-center gap-2 text-xs">
          {/* iris a step deeper, halfway to its ink: the light glyph read
              2.7:1 on the plain fill */}
          <span className="flex size-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-background">
            <AiIcon />
          </span>
          <span className="flex-1 text-background/70">Tutor</span>
          <span className="font-mono tabular-nums">{answer.at}</span>
        </p>
        <p className="mt-3 text-sm">Which table do you want every row from?</p>
      </div>

      {/* Who taught the minute she is asking about, level with her hair. This
          pill and the lesson's below are rounded to their round picture's 20px
          plus the 8px round it, so the corner holds the disc inside it. */}
      <div
        data-object
        className={cn(
          float,
          "absolute left-[calc(var(--d)*0.72)] top-[calc(var(--d)*0.19)] hidden w-max rotate-3 items-center gap-3 rounded-[1.75rem] bg-card py-2 pl-2 pr-5 text-foreground sm:flex lg:hidden xl:flex",
        )}
      >
        <Image
          src={face(TEACHER.id, 96)}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="size-10 rounded-full object-cover"
        />
        <p className="text-sm">
          <span className="flex items-center gap-1">
            {TEACHER.name}
            <CheckBadgeIcon aria-hidden="true" className="size-4 text-iris-ink" />
            <span className="sr-only">, verified instructor</span>
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <StarIcon aria-hidden="true" className="size-3.5 text-sun" />
            <span className="text-foreground tabular-nums">{TEACHER.rating}</span>
            <span className="tabular-nums">· {TEACHER.learners} learners</span>
          </span>
        </p>
      </div>

      {/* The lesson, stopped on the minute the answer cites, across the foot
          of the disc — and the way back into it. */}
      <Link
        href="/learn/sql-for-analysis"
        data-object
        aria-label={`Resume ${LESSON} at ${answer.at}`}
        className={cn(
          float,
          "absolute left-[calc(var(--d)*0.1)] top-[calc(var(--d)*1.08)] flex w-[calc(var(--d)*0.84)] -rotate-1 items-center gap-3 rounded-[1.75rem] bg-card py-2 pl-2 pr-5 text-foreground press hover:bg-accent sm:left-[calc(var(--d)*0.4)] sm:top-[calc(var(--d)*1.03)] sm:w-[calc(var(--d)*0.66)]",
        )}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <PlayIcon aria-hidden="true" className="size-4 translate-x-px" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm">{LESSON}</span>
          <span className="mt-2 flex items-center gap-3 text-xs">
            <span aria-hidden="true" className="relative h-1 flex-1 rounded-full bg-foreground/10">
              <span className="absolute inset-y-0 left-0 rounded-full bg-foreground" style={{ width: played }} />
              <span
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card"
                style={{ left: played }}
              />
            </span>
            <span className="font-mono tabular-nums">{answer.at}</span>
          </span>
        </span>
      </Link>
    </div>
  );
}

// Five tapered rays at the angles a hand leaves rather than a compass: thick
// at the centre, a hair at the tip, each side drawn slightly in.
const spark = [
  [-115, 21],
  [-44, 21],
  [28, 22],
  [97, 22],
  [169, 20],
]
  .map(([deg, len]) => {
    const a = (deg * Math.PI) / 180;
    const [x, y] = [Math.cos(a), Math.sin(a)];
    const pt = (along: number, across: number) =>
      `${(24 + x * along - y * across).toFixed(2)} ${(24 + y * along + x * across).toFixed(2)}`;
    return `M${pt(0, 1.7)}Q${pt(len * 0.45, 0.55)} ${pt(len, 0)}Q${pt(len * 0.45, -0.55)} ${pt(0, -1.7)}Z`;
  })
  .join("");

/** The design's hand, drawn on the ground around the figure and touching it
 *  once, where the squiggle crosses the disc. The squiggle and the second
 *  spark live in the gap between the columns, so they are drawn only where
 *  there is a gap to hold them. */
function Marks() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="pointer-events-none absolute -left-[calc(var(--d)*0.06)] top-[calc(var(--d)*0.1)] w-[calc(var(--d)*0.09)] fill-foreground sm:-left-[calc(var(--d)*0.2)] lg:hidden xl:block"
      >
        <path d={spark} />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="pointer-events-none absolute -left-[calc(var(--d)*0.36)] top-[calc(var(--d)*1.1)] hidden w-[calc(var(--d)*0.065)] rotate-12 fill-foreground xl:block"
      >
        <path d={spark} />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 210 180"
        fill="none"
        className="pointer-events-none absolute -left-[calc(var(--d)*0.15)] top-[calc(var(--d)*0.92)] hidden w-[calc(var(--d)*0.4)] text-foreground sm:block lg:hidden xl:top-[calc(var(--d)*0.82)] xl:block"
      >
        <path
          d="M9.5 58.3C30 40 58 16 82.5 13c14.5-2 19.5 9 18.7 23-.7 24-5.2 64-4.7 99 .5 15 3.5 20 7.5 18 14-7 41-63 61-86 7-7 14-1 14 13 0 20-4 50-3 75 1 15 10 16 17 5 4-6 9-13 12-19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="28.3" cy="74.3" r="10.5" className="fill-primary" />
        <path
          d="M26 81c-6-2-6-13 2-18 7-4 16 1 15 9-1 8-11 11-18 7-5-4-3-15 7-17 6-1 12 4 14.5 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 80 60"
        fill="none"
        strokeLinecap="round"
        className="pointer-events-none absolute left-[calc(var(--d)*0.86)] top-[calc(var(--d)*0.01)] w-[calc(var(--d)*0.15)] stroke-[color-mix(in_oklab,var(--primary),var(--primary-ink))]"
      >
        <g strokeWidth="2">
          <path
            d="M4 11.3c3-1.8 9-3.3 12.5-.8s4 10.5 3 13.5c-.9 2-1.7-3 1-6.5 3-4 8.5-5.5 13.5-5.3 8 .3 15 6.8 16.8 17.8 1 7-.3 15-2 21.3"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M50 45.5c6-11.5 13-23.5 22.5-33.2" vectorEffect="non-scaling-stroke" />
          <path d="M59.4 20l6.2-7.5" vectorEffect="non-scaling-stroke" />
          <path d="M54 48.1c3-2.1 6.5-4.1 9.8-5.8" vectorEffect="non-scaling-stroke" />
          <path d="M58.1 52.8c5.9.2 12.9 1.2 18.4 3.5" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </>
  );
}
