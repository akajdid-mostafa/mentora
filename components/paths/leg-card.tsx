"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { focus } from "@/components/course/course-card";
import { glyph } from "@/components/course/glyph";
import {
  courseHref,
  lessonHref,
  playerHref,
  priceLabel,
  teacherHref,
  topicTint,
  type Course,
} from "@/components/course/courses";
import type { Leg } from "@/components/marketing/goals";
import type { LegPlan } from "@/components/paths/plan";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

export type Need = { n: number; title: string; met: boolean };

/** One leg, as the reference sets a service: the photograph at the left and
 *  beside it the name, the line that sells it and one line of terms. Here
 *  the line is the tutor's reason for the leg's place, the terms are its
 *  weeks at the reader's pace, its hours, its price and its teacher, and a
 *  foot the reference has no need of says where the learner stands on it.
 *  The photograph is the link and its overlay opens the course; the teacher,
 *  the lesson and the two buttons in the foot stand above it. */
export function LegCard({
  n,
  leg,
  course: c,
  plan,
  needs,
  items,
  project,
  finished,
  last,
  onKnown,
}: {
  n: number;
  leg: Leg;
  course: Course;
  plan: LegPlan;
  needs: Need[];
  /** The course's syllabus items, and how many of them the learner has done. */
  items: number;
  finished: number;
  /** The item its project sits at, which a leg marked as known opens. */
  project: string;
  /** The item the learner had open last, where Continue lands. */
  last?: string;
  onKnown: () => void;
}) {
  const known = plan.state === "known";
  const Glyph = glyph[c.topic];
  const tint = topicTint[c.topic];

  return (
    // A grid rather than a row. From sm the photograph runs down the left and
    // everything else stands beside it. On a phone the chip row takes the
    // card's whole width over the photograph and the title beside it, and the
    // lines under them take it too: beside a photograph all the way down, a
    // line at 320px held seventeen characters and the chip lost its words.
    <article
      id={`leg-${n}`}
      data-object
      className="group/card relative grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 rounded-lg bg-card p-2 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-5 xl:grid-cols-[10rem_minmax(0,1fr)]"
    >
      {/* The photograph is the link, named by the title, and its overlay
          opens the course from anywhere on the card, as the course card's
          does; the photograph leans in while it is pointed at. */}
      <Link
        href={courseHref(c)}
        data-card-link
        aria-labelledby={`leg-${n}-title`}
        className="row-start-2 block self-start outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring sm:col-start-1 sm:row-span-3 sm:row-start-1 sm:self-stretch"
      >
        <div className="relative aspect-square overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted sm:aspect-auto sm:h-full sm:min-h-36">
          <Image
            src={c.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 160px, (min-width: 640px) 144px, 72px"
            className={cn(
              "object-cover transition-[transform,opacity] duration-lean ease-lean motion-safe:group-has-[[data-card-link]:hover]/card:[transform:scale(1.04)] motion-safe:group-has-[[data-card-link]:active]/card:[transform:scale(1)]! group-has-[[data-card-link]:active]/card:duration-answer",
              c.focus && focus[c.focus],
              known && "opacity-40",
            )}
          />
          <Step n={n} state={plan.state} />
        </div>
      </Link>

      {/* The course card's row: a chip at one end and its partner at the
          other. The chip is the kind of credential, in the hue and with the
          glyph of the course's subject, as the shelf's chips wear them; the
          partner is what the leg builds on. */}
      {/* The partner is pushed to the end rather than spread to it, so at
          320, where a long credential and "No prerequisite" do not fit
          side by side, it takes the line under the chip, still at the end,
          and the chip keeps its words. */}
      <div className="col-span-2 row-start-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 px-2 pb-3 pt-2 sm:col-span-1 sm:col-start-2 sm:px-0 sm:pb-0 sm:pr-4 sm:pt-3">
        <span
          className={cn(
            "flex min-w-0 items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium",
            tint.lid,
            tint.ink,
          )}
        >
          <Glyph aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{c.credential}</span>
        </span>
        <Needs needs={needs} />
      </div>

      <h3
        id={`leg-${n}-title`}
        className={cn(
          "row-start-2 min-w-0 self-center pr-2 text-lg font-medium sm:col-start-2 sm:mt-1 sm:self-start sm:pr-4",
          known && "text-muted-foreground",
        )}
      >
        {c.title}
      </h3>

      <div className="@container col-span-2 row-start-3 min-w-0 px-2 pb-2 pt-3 sm:col-span-1 sm:col-start-2 sm:px-0 sm:pb-3 sm:pr-4 sm:pt-0">
        <p className="text-sm text-muted-foreground sm:mt-1">{leg.why}</p>

        {/* The terms. The weeks lead them as a chip in the brand, because
            they are what the slider moves: pale when the leg is off the
            schedule, and the tick's iris once it is done. */}
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
          <span
            className={cn(
              "mr-1 inline-flex items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium tabular-nums",
              known
                ? "bg-muted text-muted-foreground"
                : plan.state === "done"
                  ? "bg-iris/15 text-iris-ink"
                  : "bg-chip text-primary-ink",
            )}
          >
            {plan.state === "done" ? (
              <CheckIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
            ) : (
              <HugeiconsIcon icon={Calendar03Icon} size={14} strokeWidth={1.8} aria-hidden="true" />
            )}
            {known
              ? "Off the schedule"
              : plan.state === "done"
                ? "Finished"
                : plan.weeks!.from === plan.weeks!.to
                  ? `Week ${plan.weeks!.from}`
                  : `Weeks ${plan.weeks!.from}–${plan.weeks!.to}`}
          </span>
          {/* the hours and the price held together, so a wrap after the
              "Off the schedule" chip never leaves a dot at a line's end */}
          <span className="inline-flex items-center gap-x-2 whitespace-nowrap tabular-nums">
            {leg.hours} hours
            <span aria-hidden="true">·</span>
            {priceLabel(c.price)}
          </span>
          {/* The whole line runs to about 400px with the longest chip and
              name, and a wrap left its dot hanging at a line's end. In a
              column narrower than that the teacher takes a line of their
              own, on every card at once. */}
          <span aria-hidden="true" className="@max-[25rem]:hidden">
            ·
          </span>
          <span className="@max-[25rem]:basis-full">
            <Link
              href={teacherHref(c.instructor)}
              className={cn(
                "relative z-10 inline-flex items-center gap-1 text-foreground underline-offset-4 press hover:underline",
                reach,
              )}
            >
              {c.instructor}
              <CheckBadgeIcon aria-hidden="true" className="size-4 text-iris-ink" />
              <span className="sr-only">, verified instructor</span>
            </Link>
          </span>
        </p>

        {/* Stacked on a phone; from sm one row, the buttons held to its end
            by their own margin, so a row that has to wrap sends them down
            whole rather than spreading two lines apart. */}
        <div className="mt-4 flex flex-col items-start gap-3 border-t pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
          <Standing
            course={c}
            plan={plan}
            items={items}
            project={project}
            finished={finished}
          />
          <div className="flex items-center gap-2 sm:ml-auto">
            {/* the item the learner stopped at, which is what the button
                names; the planner's Continue opens the course itself */}
            {plan.state === "active" && (
              <Link
                href={last ? `${playerHref(c)}?lesson=${last}` : playerHref(c)}
                className={cn(
                  "relative z-10 flex h-10 items-center gap-2 rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent",
                  reach,
                )}
              >
                {last ? `Continue at ${last}` : "Continue"}
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            )}
            {(plan.state === "open" || known) && (
              <button
                type="button"
                onClick={onKnown}
                aria-pressed={known}
                aria-label={known ? `Put ${c.title} back on the schedule` : `I already know ${c.title}`}
                className={cn(
                  "relative z-10 flex h-10 items-center gap-2 rounded-control px-4 text-sm press",
                  reach,
                  "aria-pressed:bg-iris/15 aria-pressed:text-iris-ink aria-pressed:hover:bg-iris/25",
                  "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
                )}
              >
                {known && <CheckIcon aria-hidden="true" className="size-4" />}
                I know this
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Where the learner stands on the leg, at the foot's left: how much of an
 *  enrolled course is done, the free first lesson of one not begun (or the
 *  whole of a free one), and the project a course marked as known still
 *  asks for. */
function Standing({
  course: c,
  plan,
  items,
  project,
  finished,
}: {
  course: Course;
  plan: LegPlan;
  items: number;
  project: string;
  finished: number;
}) {
  if (plan.state === "active") {
    return (
      <p className="flex items-center gap-3 text-sm">
        <span aria-hidden="true" className="block h-1.5 w-16 overflow-hidden rounded-full bg-muted xl:w-24">
          <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.max(4, plan.done * 100)}%` }} />
        </span>
        <span className="tabular-nums">
          {finished} of {items} done
        </span>
      </p>
    );
  }
  if (plan.state === "known") {
    // off the schedule, and counted once its project is reviewed: the one
    // thing left on it, which the link opens
    return (
      <Link
        href={`${playerHref(c)}?lesson=${project}`}
        className={cn(
          "relative z-10 flex h-10 items-center gap-2 text-sm underline-offset-4 press hover:underline",
          reach,
        )}
      >
        Hand in its project to count it
        <ArrowRightIcon aria-hidden="true" className="size-4" />
      </Link>
    );
  }
  if (plan.state === "done") {
    return (
      <p className="flex items-center gap-2 text-sm">
        <CheckIcon aria-hidden="true" className="size-4 text-iris-ink" />
        All {items} items done
      </p>
    );
  }
  return (
    <Link
      href={lessonHref(c)}
      className={cn(
        "relative z-10 flex h-10 items-center gap-2 text-sm underline-offset-4 press hover:underline",
        reach,
      )}
    >
      <PlayIcon aria-hidden="true" className="size-3.5" />
      {/* a free course is free past lesson one, and says so as its own
          page does */}
      {c.price === 0 ? "Start the free course" : "Lesson one free"}
    </Link>
  );
}

/** The leg's number on its photograph: a white disc while it is ahead, the
 *  site's filled tick once it is done, and a pale one once it is marked as
 *  known and off the schedule. */
function Step({ n, state }: { n: number; state: LegPlan["state"] }) {
  return (
    <span
      className={cn(
        "absolute left-2 top-2 flex size-7 items-center justify-center rounded-full text-sm font-medium tabular-nums shadow-soft",
        state === "done"
          ? "bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card"
          : state === "known"
            ? "bg-card/80 text-muted-foreground"
            : "bg-card",
      )}
    >
      {state === "done" ? <CheckIcon aria-hidden="true" className="size-4" strokeWidth={2.5} /> : n}
      <span className="sr-only">{state === "done" ? `Leg ${n}, finished` : `Leg ${n}`}</span>
    </span>
  );
}

/** The legs this one builds on, by number, each lit once it is done or
 *  known, so the reader sees a prerequisite clear as they go. */
function Needs({ needs }: { needs: Need[] }) {
  if (!needs.length) {
    return <p className="ml-auto shrink-0 text-sm text-muted-foreground">No prerequisite</p>;
  }
  return (
    <p className="ml-auto flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
      After
      {needs.map((x) => (
        <span
          key={x.n}
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-xs font-medium tabular-nums",
            x.met ? "bg-iris/15 text-iris-ink" : "bg-muted text-foreground",
          )}
        >
          {x.n}
          <span className="sr-only">
            {` ${x.title}${x.met ? ", cleared" : ""}`}
          </span>
        </span>
      ))}
    </p>
  );
}
