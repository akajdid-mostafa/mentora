"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { courseHref, playerHref } from "@/components/course/courses";
import { goals, pathSlug } from "@/components/marketing/goals";
import { tiers } from "@/components/marketing/tiers";
import { coursesOf } from "@/components/paths/paths";
import { costOf, longDate, shortDate, type Plan, type Standing } from "@/components/paths/plan";
import { PACE, setPace, usePathChoices } from "@/components/paths/store";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import {
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderSteps,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { cn, count } from "@/lib/utils";
import { viewportObserver } from "@/lib/viewport-observer";

/** The reference's floating price card, grown into the path's planner: the
 *  day it ends at the hours the reader gives it, the whole path as one bar
 *  with the finished share filled in, the slider that moves both, what the
 *  rest costs on Plus at that pace against buying it, and the one thing to
 *  do next. */
export function Planner({
  id,
  plan,
  standing,
  projects,
}: {
  id: string;
  plan: Plan;
  standing: Standing;
  /** Each leg's project, by its item in the syllabus. */
  projects: string[];
}) {
  const g = goals.find((x) => x.id === id) ?? goals[0];
  const list = coursesOf(g);
  const pace = usePathChoices().pace;
  const cost = costOf(
    list.map((c) => c.price),
    plan,
    standing,
  );

  // The next thing to do: go on with the course under way, open the first
  // leg still ahead on its own page, which is where a reader buys it, or hand
  // in the project of the first leg marked as known.
  const active = plan.legs.findIndex((l) => l.state === "active");
  const ahead = plan.legs.findIndex((l) => l.state === "open");
  const known = plan.legs.findIndex((l) => l.state === "known");
  const next =
    active >= 0
      ? { href: playerHref(list[active]), label: `Continue ${list[active].title}` }
      : ahead >= 0
        ? { href: courseHref(list[ahead]), label: `Start with ${list[ahead].title}` }
        : known >= 0
          ? { href: `${playerHref(list[known])}?lesson=${projects[known]}`, label: "Open the first project" }
          : { href: "#certificate", label: "See the certificate" };

  const finished = plan.total - plan.left;
  const cheaper = cost.plus < cost.separately ? "plus" : "separately";

  // With nothing left to schedule, what the card heads with is what is left
  // to do: the project of every leg marked as known, or nothing at all.
  const handIn = plan.legs.filter((l) => l.state === "known").length;
  const head = plan.weeks
    ? { caps: "Finishes", title: longDate(plan.finish), line: `${count(plan.weeks, "week")} at ${count(pace, "hour")} a week` }
    : handIn
      ? { caps: "Left to do", title: count(handIn, "project"), line: "One for each course you marked as known." }
      : { caps: "Finished", title: "Every leg is done", line: "The path's certificate is yours." };

  const cta = useRef<HTMLAnchorElement>(null);
  const [away, setAway] = useState(false);
  useEffect(() => {
    const el = cta.current;
    if (!el) return;
    // The phone's bar, as the course page keeps one: on once the button has
    // gone off the top of the screen, and the root runs far below the screen
    // so a jump back to the top is a change the observer sees.
    const io = viewportObserver(([e]) => setAway(!e.isIntersecting), {
      rootMargin: "0px 0px 10000px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Held to the screen's height less the header, so on a short laptop
          its foot is never under the screen's edge while it rides. */}
      <div
        data-object
        className="no-scrollbar rounded-lg bg-card p-5 shadow-soft sm:p-6 lg:max-h-[calc(100dvh_-_6.5rem)] lg:overflow-y-auto"
      >
        <Caps>{head.caps}</Caps>
        <p aria-live="polite" className="mt-2 font-heading text-3xl tracking-tighter tabular-nums">
          {head.title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground tabular-nums">{head.line}</p>

        <PathBar plan={plan} hours={g.legs.map((l) => l.hours)} />
        <p className="mt-2 flex items-baseline justify-between gap-3 text-sm tabular-nums">
          {/* covered rather than done: a leg marked as known is off the
              list without having been taken here */}
          <span>
            {finished} of {plan.total} hours covered
          </span>
          <span className="text-muted-foreground">{plan.left} to go</span>
        </p>

        {/* with nothing left to schedule the hours move nothing, so the
            slider goes with the price rows */}
        {plan.weeks > 0 && (
          <SliderRoot
            value={pace}
            onValueChange={(v) => setPace(v as number)}
            min={PACE.min}
            max={PACE.max}
            step={1}
            className="mt-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <SliderLabel>Hours you have a week</SliderLabel>
              <span className="text-sm tabular-nums">{count(pace, "hour")}</span>
            </div>
            {/* the hours in steps, a dash an hour, as the course page's
                panel draws its own: the week reads as a count */}
            <SliderControl className="mt-1">
              <SliderTrack className="relative bg-transparent">
                <SliderSteps value={pace} min={PACE.min} max={PACE.max} />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </SliderRoot>
        )}

        {/* What the rest costs, the two ways it can be paid for, the
            cheaper one marked: Plus moves with the slider, the courses do
            not. With every course ahead owned or free there is nothing to
            weigh, and one line says so. */}
        {plan.weeks > 0 &&
          (cost.buying > 0 ? (
            <dl className="mt-6 flex flex-col gap-2.5 border-t pt-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2">
                  Plus, {count(cost.months, "month")}
                  {cheaper === "plus" && <Cheaper />}
                </dt>
                <dd className="font-heading text-lg tracking-tight tabular-nums">${cost.plus}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2">
                  {cost.all && cost.buying > 1
                    ? `${count(cost.buying, "course")}, one by one`
                    : `${count(cost.buying, "course")} left to buy`}
                  {cheaper === "separately" && <Cheaper />}
                </dt>
                <dd className="font-heading text-lg tracking-tight tabular-nums">${cost.separately}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-6 border-t pt-5 text-sm">Every course ahead is already yours or free.</p>
          ))}

        {/* The label names the course, and at 320 and 360 the longest
            ("Start with Interface fundamentals") outruns the button, so it
            takes a second line there rather than losing its end: the
            Button's fixed height and single line give way to a floor. */}
        <Button
          render={<Link ref={cta} href={next.href} />}
          size="lg"
          className={cn("mt-5 h-auto min-h-11 w-full whitespace-normal py-2.5 text-center", reach)}
        >
          <span className="text-balance">{next.label}</span>
          <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4 shrink-0" />
        </Button>
        {/* Plus's trial under the one button, named as the closing band and
            the pricing table name it, while there is something it would
            pay for */}
        {cost.buying > 0 && (
          <Link
            href={`/checkout?plan=plus&path=${pathSlug(g)}`}
            className={cn(
              "mt-2.5 flex h-10 w-full items-center justify-center rounded-control px-5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent",
              reach,
            )}
          >
            {tiers[1].cta}
          </Link>
        )}
      </div>

      {/* the phone's bar: the date and the same next step, once the
          planner's own button has scrolled off the top */}
      <div
        aria-hidden={!away}
        inert={!away}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t bg-background px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-soft-lg transition-[translate,transform,visibility] duration-sheet ease-sheet motion-reduce:transition-none lg:hidden",
          away ? "visible translate-y-0" : "invisible translate-y-full",
        )}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <p className="min-w-0">
            {/* a step down under 360, where "Done May 23, 2028" beside
                Continue ran 5px past its room and cut the year */}
            <span className="block truncate font-heading text-xl tracking-tight tabular-nums max-[359px]:text-lg">
              {plan.weeks ? `Done ${shortDate(plan.finish)}` : handIn ? `${head.title} left` : head.title}
            </span>
            {plan.weeks > 0 && (
              <span className="block truncate text-sm text-muted-foreground tabular-nums">
                {count(pace, "hour")} a week
              </span>
            )}
          </p>
          <Button render={<Link href={next.href} />} className="shrink-0">
            {active >= 0 ? "Continue" : ahead >= 0 ? "Start" : known >= 0 ? "Project" : "Certificate"}
          </Button>
        </div>
      </div>
    </>
  );
}

function Cheaper() {
  return (
    <span className="rounded-control bg-chip px-2 py-0.5 text-xs font-medium text-primary-ink">
      Cheaper
    </span>
  );
}

/** The path as one bar, a segment a leg, each as long as its hours: the
 *  finished share of each filled in, a leg marked as known left hollow. */
function PathBar({ plan, hours }: { plan: Plan; hours: number[] }) {
  return (
    <div aria-hidden="true" className="mt-5 flex h-2 gap-1">
      {plan.legs.map((l, i) => (
        <span
          key={i}
          style={{ flexGrow: hours[i], flexBasis: 0 }}
          className={cn(
            "relative overflow-hidden rounded-full",
            l.state === "known" ? "ring-1 ring-inset ring-border" : "bg-muted",
          )}
        >
          {l.state !== "known" && (
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] motion-reduce:transition-none"
              style={{ width: `${l.state === "done" ? 100 : l.done * 100}%` }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
