"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { reach } from "@/components/reach";
import { calculatorCopy, monthName, plansCopy } from "@/components/pricing/copy";
import { axisOf, plusHref, usd, verdictOf, yearOf, type MonthRow } from "@/components/pricing/math";
import { COURSES_RANGE, SPEND_RANGE, toQuery, usePricing } from "@/components/pricing/state";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderSteps,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { TabTrack } from "@/components/ui/tab-track";
import { useCopyLink } from "@/components/ui/use-copy-link";
import { cn } from "@/lib/utils";

/** `start` is the month the page was sent in, "2026-09", which the chart
 *  counts as the first of the visitor's twelve. */
export function PlanCalculator({ start }: { start: string }) {
  const c = calculatorCopy;
  const p = usePricing();
  const { courses, spend, yearly } = p;
  const { state: copied, copy: copyTo, reset: resetCopy, field } = useCopyLink();

  const rows = yearOf(courses, spend, yearly);
  const v = verdictOf(courses, spend, yearly);
  const tie = v.single === v.plus;

  // The month the chart reads out, until the visitor presses another: the
  // one Plus pulls ahead in, or the year's end when there is no such turn —
  // Plus never catches up, or it is ahead from the first month.
  const resting = v.overtakes && v.overtakes > 1 ? v.overtakes : 12;
  const [picked, setPicked] = useState<number | null>(null);
  const reading = picked ?? resting;

  const change = (f: () => void) => {
    resetCopy();
    setPicked(null);
    f();
  };

  const href = () => {
    const url = new URL("/pricing", window.location.origin);
    url.search = toQuery(p);
    url.hash = "calculator";
    return url.toString();
  };

  return (
    <section id="calculator" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="grid overflow-hidden rounded-lg bg-sun-band lg:grid-cols-[45fr_55fr]">
        {/* the copy column: the reference's chip and headline at the top,
            its paragraph and two buttons at the foot, and the inputs in the
            room it leaves between them */}
        <div className="flex flex-col px-6 pb-10 pt-10 sm:px-10 sm:pt-12 lg:py-14 lg:pl-12 lg:pr-6">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{c.heading}</SectionHeading>

          <div className="mt-10 flex flex-col gap-7">
            <Stepped
              label={c.courses}
              value={courses}
              range={COURSES_RANGE}
              reads={String(courses)}
              onChange={(n) => change(() => p.setCourses(n))}
            />
            <Stepped
              label={c.spend}
              value={spend}
              range={SPEND_RANGE}
              reads={usd(spend)}
              onChange={(n) => change(() => p.setSpend(n))}
            />
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span id="calc-billing" className="text-sm text-muted-foreground">
                {c.billing}
              </span>
              <TabTrack
                kind="radios"
                labelledBy="calc-billing"
                idPrefix="calc-billing"
                on="card"
                options={[
                  { id: "monthly", label: plansCopy.billing.monthly },
                  { id: "yearly", label: plansCopy.billing.yearly },
                ]}
                value={p.billing}
                onChange={(id) => change(() => p.setBilling(id))}
              />
            </div>
          </div>

          <p className="mt-10 max-w-[28rem] text-base text-muted-foreground lg:mt-auto lg:pt-12">{c.lede}</p>

          {/* stacked at one width on a phone, side by side from sm */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button render={<Link href={v.plusWins ? plusHref(yearly) : "/courses"} />} size="lg" className={reach}>
              {v.plusWins ? plansCopy.plans.plus.cta : plansCopy.plans.single.cta}
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
            </Button>
            <button
              type="button"
              onClick={() => copyTo(href())}
              className="flex h-10 items-center justify-center gap-2 rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
            >
              <HugeiconsIcon
                icon={copied === "copied" ? Tick02Icon : Link01Icon}
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
                className={cn(copied === "copied" && "text-iris-ink")}
              />
              {/* both labels in one cell, so the button keeps the longer
                  one's width and the pointer stays on it as the words swap */}
              <span className="grid">
                <span className={cn("[grid-area:1/1]", copied === "copied" && "invisible")}>{c.copy}</span>
                <span
                  aria-hidden={copied !== "copied"}
                  className={cn("[grid-area:1/1]", copied !== "copied" && "invisible")}
                >
                  {c.copied}
                </span>
              </span>
            </button>
            <p aria-live="polite" className="sr-only">
              {copied === "copied" ? c.copied : ""}
            </p>
          </div>
          {copied === "manual" && (
            <label className="mt-4 flex w-full max-w-md flex-col gap-1.5 text-sm text-muted-foreground">
              {c.manual}
              <input
                ref={field}
                readOnly
                value={href()}
                onFocus={(e) => e.currentTarget.select()}
                className="h-10 w-full rounded-control bg-card px-3 font-mono text-xs text-foreground ring-1 ring-inset ring-border outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}
        </div>

        {/* The chart card runs off the panel's right edge, as the reference's
            does off the page: its left corners are its own, its right side
            is cut by the panel. What it plots stays inside the cut. */}
        <div className="pb-6 pl-6 sm:pb-10 sm:pl-10 lg:py-14 lg:pl-6">
          <div data-picture className="flex h-full flex-col rounded-l-lg bg-card py-6 pl-5 pr-6 shadow-soft sm:py-8 sm:pl-8 sm:pr-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div aria-live="polite">
                <Caps>{c.cheaper}</Caps>
                <p className="mt-2 font-heading text-2xl tracking-tight sm:text-3xl">
                  {v.plusWins ? c.plusName(yearly) : c.singleName}
                </p>
                <p className="mt-2 max-w-[26rem] text-sm text-muted-foreground">
                  {tie
                    ? c.even
                    : v.plusWins
                      ? c.plusSum(v.plus, v.single, v.saving)
                      : c.singleSum(courses, v.single, v.plus, v.saving)}
                </p>
              </div>
              <ul className="flex shrink-0 gap-4 text-sm sm:flex-col sm:gap-1.5 sm:pt-1">
                <li className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-foreground" />
                  {c.chart.single}
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-primary" />
                  {c.chart.plus(yearly)}
                </li>
              </ul>
            </div>

            <Chart
              rows={rows}
              start={start}
              reading={reading}
              overtakes={v.overtakes}
              onPick={setPicked}
              yearly={yearly}
            />

            <p className="mt-5 text-sm text-muted-foreground">{c.chart.foot}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A slider over a few whole values, drawn as the site draws them: a dash a
 *  step, the taken ones in the brand. */
function Stepped({
  label,
  value,
  range,
  reads,
  onChange,
}: {
  label: string;
  value: number;
  range: { min: number; max: number; step: number };
  reads: string;
  onChange: (n: number) => void;
}) {
  return (
    <SliderRoot value={value} onValueChange={onChange} min={range.min} max={range.max} step={range.step}>
      <div className="flex items-baseline justify-between gap-3">
        <SliderLabel>{label}</SliderLabel>
        <span className="shrink-0 font-heading text-xl tracking-tight tabular-nums">{reads}</span>
      </div>
      <SliderControl className="mt-1">
        <SliderTrack className="relative bg-transparent">
          <SliderSteps value={value} min={range.min} max={range.max} step={range.step} />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
}

/** Twelve pairs of bars on a dollar axis: what course-by-course and Plus
 *  have cost by the end of each month. Each month is a button that reads its
 *  two figures out in the pill over it. */
function Chart({
  rows,
  start,
  reading,
  overtakes,
  onPick,
  yearly,
}: {
  rows: MonthRow[];
  start: string;
  reading: number;
  overtakes: number | null;
  onPick: (m: number) => void;
  yearly: boolean;
}) {
  const c = calculatorCopy;
  const max = Math.max(...rows.map((r) => Math.max(r.single, r.plus)));
  const axis = axisOf(max);
  const h = (n: number) => `${(n / axis.top) * 100}%`;
  const read = rows[reading - 1];

  return (
    <>
      {/* the reading on a phone: the month and its two figures in a row */}
      <dl aria-hidden="true" className="mt-6 flex items-baseline justify-between gap-3 rounded-sm bg-accent px-4 py-3 text-sm sm:hidden">
        <dt className="font-medium">{monthName(start, reading, true)}</dt>
        <dd className="flex gap-4 tabular-nums">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground" />
            {usd(read.single)}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            {usd(read.plus)}
          </span>
        </dd>
      </dl>
      <div className="mt-6 flex gap-3 sm:mt-8 sm:gap-4">
        {/* the axis, its stops level with the dashed rules they name */}
        <div aria-hidden="true" className="relative h-64 w-10 shrink-0 sm:h-72 sm:w-12 lg:h-80">
          {axis.ticks.map((t) => (
            <span
              key={t}
              style={{ bottom: h(t) }}
              className="absolute right-0 translate-y-1/2 text-xs text-muted-foreground tabular-nums"
            >
              {t >= 1000 ? `$${t / 1000}K` : `$${t}`}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-64 sm:h-72 lg:h-80">
            {axis.ticks.map((t) => (
              <span
                key={t}
                aria-hidden="true"
                style={{ bottom: h(t) }}
                className={cn(
                  "absolute inset-x-0 h-px",
                  t === 0 ? "bg-border" : "border-t border-dashed border-border",
                )}
              />
            ))}

            <ol className="absolute inset-0 grid grid-cols-12">
              {rows.map((r) => {
                const on = r.month === reading;
                const name = monthName(start, r.month, true);
                return (
                  <li key={r.month} className="relative">
                    <button
                      type="button"
                      onClick={() => onPick(r.month)}
                      aria-pressed={on}
                      aria-label={`${name}: ${usd(r.single)} ${c.chart.single.toLowerCase()}, ${usd(r.plus)} on Plus`}
                      // a whisper behind the month read out or under the
                      // pointer, inset so two months never touch
                      className={cn(
                        "absolute inset-x-0.5 inset-y-0 flex items-end justify-center gap-0.5 rounded-sm transition-colors sm:inset-x-1 sm:gap-1",
                        "aria-pressed:bg-accent aria-pressed:hover:bg-muted aria-pressed:active:bg-secondary not-aria-pressed:hover:bg-accent not-aria-pressed:active:bg-muted",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        style={{ height: h(r.single) }}
                        className="relative w-1.5 rounded-t-[3px] bg-foreground transition-[height] duration-answer ease-answer motion-reduce:transition-none sm:w-2.5 md:w-3"
                      />
                      <span
                        aria-hidden="true"
                        style={{ height: h(r.plus) }}
                        className="relative w-1.5 rounded-t-[3px] bg-primary transition-[height] duration-answer ease-answer motion-reduce:transition-none sm:w-2.5 md:w-3"
                      />
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* the reading: a dark pill over the month, the reference's
                tooltip, saying what the two had cost by then. From sm; a
                phone's plot is too narrow to float it, and reads it above. */}
            <div
              aria-hidden="true"
              style={{
                left: `${((reading - 0.5) / 12) * 100}%`,
                bottom: `calc(${h(Math.max(read.single, read.plus))} + 12px)`,
              }}
              className={cn(
                "pointer-events-none absolute z-10 hidden w-max -translate-x-1/2 rounded-sm sm:block bg-foreground px-3 py-2 text-xs text-background shadow-soft-lg transition-[left,bottom] duration-answer ease-answer motion-reduce:transition-none",
                "after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[5px] after:border-t-[5px] after:border-x-transparent after:border-t-foreground after:content-['']",
                reading <= 2 && "translate-x-[-20%] after:left-[20%]",
                reading >= 11 && "translate-x-[-80%] after:left-[80%]",
              )}
            >
              <p className="font-medium">
                {reading === overtakes
                  ? c.chart.overtakes(monthName(start, reading, true))
                  : monthName(start, reading, true)}
              </p>
              <dl className="mt-1.5 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5">
                <dt>{c.chart.single}</dt>
                <dd className="text-right tabular-nums">{usd(read.single)}</dd>
                <dt>{c.chart.plus(yearly)}</dt>
                <dd className="text-right tabular-nums">{usd(read.plus)}</dd>
              </dl>
            </div>
          </div>

          {/* the months, initials on a phone and three letters from sm */}
          <ol aria-hidden="true" className="mt-3 grid grid-cols-12 text-center text-xs text-muted-foreground">
            {rows.map((r) => (
              <li key={r.month} className={cn(r.month === reading && "text-foreground")}>
                <span className="sm:hidden">{monthName(start, r.month).slice(0, 1)}</span>
                <span className="hidden sm:inline">{monthName(start, r.month)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
