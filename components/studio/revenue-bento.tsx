"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Download04Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useToday } from "@/components/dashboard/today";
import { revenueCopy as copy } from "@/components/studio/copy";
import {
  COURSES,
  courseOf,
  monthsOf,
  payoutMonth,
  statementCsv,
  totalOf,
  type CourseId,
  type Month,
} from "@/components/studio/revenue";
import { figure, nextPayday, PAYDAY, PAYOUT_FLOOR, PLUS_RATE, SHARE, usd } from "@/components/teach/earnings";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

// The two series, validated together against the ink tile they are drawn on
// (dataviz validator: lightness band, chroma, CVD and contrast all pass):
// sales in the brand at the chart's middle step, Plus in the studio's iris a
// step deeper, the mix every solid iris disc on the site uses.
const SALES = "bg-chart-2";
const PLUS = "bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))]";
const PLUS_STROKE = "color-mix(in oklab, var(--iris), var(--iris-ink))";

type Range = "6" | "12";

const pct = `${Math.round(SHARE * 100)}%`;
// What a minute of Plus paid, to the tenth of a cent it is quoted in.
const rate = `$${PLUS_RATE.toFixed(3)}`;

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The 15th after a month closes, when its payout lands. */
// A month's statement is paid on the 15th of the next: "Paid" once that day
// has come, "Pays" before it, so on the first of October September's reads
// "Pays Oct 15" rather than a payment two weeks off as made. The year shows
// only when it is not this one.
const payout = (m: Month, today: string) => {
  const [y, mo] = m.key.split("-").map(Number);
  const paid = new Date(Date.UTC(y, mo, PAYDAY));
  const year = paid.getUTCFullYear() === Number(today.slice(0, 4)) ? undefined : "numeric";
  const date = paid.toLocaleDateString("en-US", { month: "short", day: "numeric", year, timeZone: "UTC" });
  return paid.toISOString().slice(0, 10) <= today ? copy.statements.paid(date) : copy.statements.pays(date);
};

export function RevenueBento({ today: serverToday }: { today: string }) {
  const today = useToday(serverToday);
  const months = monthsOf(today);
  const [range, setRange] = useState<Range>("12");
  const [course, setCourse] = useState<CourseId | "all">("all");
  const [view, setView] = useState<"chart" | "table">("chart");
  const only = course === "all" ? undefined : course;
  const shown = months.slice(12 - Number(range));

  const csv = () => {
    const head = ["Month", "Sales", "From sales", "Plus minutes", "From Plus", "Total"];
    const rows = shown.map((m) => {
      const t = totalOf(m, only);
      return [m.long, t.units, t.sales.toFixed(2), t.minutes, t.plus.toFixed(2), t.total.toFixed(2)];
    });
    const name = only ? courseOf(only).title : copy.filters.all;
    download(
      `mentora-revenue-${range}-months-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`,
      [head, ...rows].map((r) => r.join(",")).join("\n"),
    );
  };

  return (
    <section id="revenue" aria-labelledby="revenue-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <SectionHeading className="mt-5">
        <span id="revenue-title">{copy.heading}</span>
      </SectionHeading>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground">{copy.lede(pct, rate)}</p>

      {/* One row of filters over everything it scopes: the range first.
          Under lg it breaks in two full rows, what is shown and how. */}
      <div className="mt-24 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-3 lg:contents">
          <TabTrack<Range>
            kind="radios"
            label={copy.filters.range}
            idPrefix="range"
            value={range}
            onChange={setRange}
            options={[
              { id: "6", label: copy.filters.months(6) },
              { id: "12", label: copy.filters.months(12) },
            ]}
          />
          <Select value={course} onValueChange={(v) => setCourse(v as CourseId | "all")}>
            <SelectTrigger aria-label={copy.filters.course} className="min-w-52 max-lg:flex-1">
              <SelectValue>{(v: string) => (v === "all" ? copy.filters.all : courseOf(v as CourseId).title)}</SelectValue>
            </SelectTrigger>
            <SelectContent label={copy.filters.course}>
              <SelectGroup>
                <SelectLabel>{copy.filters.course}</SelectLabel>
                <SelectItem value="all">{copy.filters.all}</SelectItem>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {courseOf(c).title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 lg:contents">
          <TabTrack<"chart" | "table">
            kind="radios"
            label={copy.filters.view}
            idPrefix="view"
            value={view}
            onChange={setView}
            options={[
              { id: "chart", label: copy.filters.chart },
              { id: "table", label: copy.filters.table },
            ]}
          />
          <button
            type="button"
            onClick={csv}
            className="ml-auto flex h-10 items-center gap-2 rounded-control bg-card px-4 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none max-[359px]:px-3"
          >
            <HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
            <span className="max-[359px]:sr-only">{copy.filters.download}</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-12">
        <PayoutTile months={months} today={today} only={only} />
        {/* Keyed by the range: a column index means nothing across ranges, so
            the tab stop starts over on the open month. */}
        <ChartTile key={range} shown={shown} range={Number(range)} only={only} view={view} />
        <CoursesTile month={months[11]} course={course} onPick={setCourse} />
        <PlusTile months={shown} only={only} />
        <StatementsTile months={months} today={today} />
      </div>
    </section>
  );
}

const tile = "min-w-0 rounded-lg bg-card p-5 ring-1 ring-border sm:p-6";

function PayoutTile({ months, today, only }: { months: Month[]; today: string; only?: CourseId }) {
  const m = payoutMonth(months, today);
  const t = totalOf(m, only);
  const due = nextPayday(today);
  const name = m.long.split(" ")[0];
  const salesShare = t.total ? t.sales / t.total : 0;
  return (
    <div className={cn(tile, "flex flex-col lg:col-span-5")}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-sm font-medium">{copy.payout.label(name)}</h3>
          {m.run < 1 && <span className="text-sm text-muted-foreground">{copy.payout.open}</span>}
        </div>
        <span className="text-sm text-muted-foreground">{copy.payout.lands(due.label)}</span>
      </div>
      <p className="mt-4 font-heading text-5xl tracking-tighter tabular-nums">{usd(t.total, true)}</p>
      {/* The month split into its two sources, in the chart's two colours,
          with a 2px gap between them. */}
      <div aria-hidden="true" className="mt-6 flex h-3 gap-0.5 overflow-hidden rounded-full">
        <span className={cn("h-full rounded-l-full", SALES)} style={{ width: `${salesShare * 100}%` }} />
        <span className={cn("h-full flex-1 rounded-r-full", PLUS)} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="flex items-center gap-2 text-muted-foreground">
            <span aria-hidden="true" className={cn("size-2.5 rounded-[3px]", SALES)} />
            {copy.payout.sales}
          </dt>
          <dd className="mt-1 font-medium tabular-nums">{usd(t.sales, true)}</dd>
          <dd className="text-muted-foreground tabular-nums">{copy.payout.units(figure(t.units))}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-2 text-muted-foreground">
            <span aria-hidden="true" className={cn("size-2.5 rounded-[3px]", PLUS)} />
            {copy.payout.plus}
          </dt>
          <dd className="mt-1 font-medium tabular-nums">{usd(t.plus, true)}</dd>
          <dd className="text-muted-foreground tabular-nums">{copy.payout.minutes(figure(t.minutes))}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <span aria-hidden="true" className="block h-1.5 overflow-hidden rounded-full bg-muted">
          <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.round(due.run * 100)}%` }} />
        </span>
        <p className="mt-2 flex flex-wrap justify-between gap-x-3 text-sm tabular-nums text-muted-foreground">
          <span>{copy.payout.left(due.left)}</span>
          <span>{copy.payout.floor(usd(PAYOUT_FLOOR))}</span>
        </p>
      </div>
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => download(`mentora-statement-${m.key}.csv`, statementCsv(m))}
          className="flex h-10 items-center gap-2 rounded-control bg-muted px-4 text-sm font-medium press hover:bg-secondary"
        >
          <HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
          {copy.payout.statement}
        </button>
      </div>
    </div>
  );
}

/** Round up to a scale a reader reads at a glance: steps of 1, 2 or 5
 *  thousand, three to four gridlines. */
function scaleOf(max: number) {
  const raw = max / 3;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((n) => n * pow).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

const short = (n: number) => (n >= 1000 ? `$${n / 1000}K` : `$${n}`);

function ChartTile({ shown, range, only, view }: { shown: Month[]; range: number; only?: CourseId; view: "chart" | "table" }) {
  const totals = shown.map((m) => ({ m, ...totalOf(m, only) }));
  const sum = totals.reduce((n, t) => n + t.total, 0);
  const open = shown[shown.length - 1];
  const paceOf = (m: Month) => (m.pace === undefined ? undefined : only ? totalOf(m, only).total / m.run : m.pace);
  const max = Math.max(...totals.map((t) => Math.max(t.total, paceOf(t.m) ?? 0)), 1);
  const { top, ticks } = scaleOf(max);
  const [active, setActive] = useState<number | null>(null);
  const [focus, setFocus] = useState(totals.length - 1);

  const keys = (e: KeyboardEvent) => {
    const by = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!by) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(totals.length - 1, focus + by));
    setFocus(next);
    setActive(next);
    document.getElementById(`month-${next}`)?.focus();
  };

  return (
    // A slab, so the ink tile stays a raised dark panel in the dark half; the
    // white tooltip inside it takes the page's two values back.
    <div data-picture className="slab flex min-w-0 flex-col rounded-lg bg-foreground p-5 text-background sm:p-6 lg:col-span-7">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <h3 className="text-sm text-background/70">{copy.chart.title(range)}</h3>
          <p className="mt-1 font-heading text-4xl tracking-tighter tabular-nums">{usd(sum)}</p>
        </div>
        <ul className="flex gap-4 text-sm">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className={cn("size-2.5 rounded-[3px]", SALES)} />
            {copy.chart.sales}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className={cn("size-2.5 rounded-[3px]", PLUS)} />
            {copy.chart.plus}
          </li>
        </ul>
      </div>

      {view === "table" ? (
        <div className="no-scrollbar mt-6 h-64 overflow-y-auto">
          <table className="w-full text-sm tabular-nums">
            <thead className="text-left text-background/70">
              <tr>
                <th className="py-2 pr-4 font-normal">{copy.chart.table.month}</th>
                <th className="py-2 pr-4 text-right font-normal">{copy.chart.table.sales}</th>
                <th className="py-2 pr-4 text-right font-normal">{copy.chart.table.plus}</th>
                <th className="py-2 text-right font-normal">{copy.chart.table.total}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background/10">
              {totals.map((t) => (
                <tr key={t.m.key}>
                  <td className="py-2 pr-4">{t.m.run < 1 ? copy.chart.open(t.m.long) : t.m.long}</td>
                  <td className="py-2 pr-4 text-right">{usd(t.sales)}</td>
                  <td className="py-2 pr-4 text-right">{usd(t.plus)}</td>
                  <td className="py-2 text-right font-medium">{usd(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 flex h-64 flex-col">
          <div className="relative min-h-0 flex-1" onMouseLeave={() => setActive(null)}>
            {/* Gridlines: solid hairlines one step off the tile, with their
                values at the left. */}
            {ticks.map((v) => (
              <div
                key={v}
                aria-hidden="true"
                className="absolute inset-x-0 flex items-center gap-3"
                style={{ bottom: `${(v / top) * 100}%` }}
              >
                <span className="w-10 -translate-y-px text-right text-xs tabular-nums text-background/60">{short(v)}</span>
                <span className="h-px flex-1 bg-background/10" />
              </div>
            ))}
            <div role="group" aria-label={copy.chart.title(range)} onKeyDown={keys} className="absolute inset-y-0 right-0 left-13 flex items-end justify-around gap-1 sm:gap-1.5">
              {totals.map((t, i) => {
                const pace = paceOf(t.m);
                const h = (t.total / top) * 100;
                const salesH = t.total ? (t.sales / t.total) * 100 : 0;
                const label = copy.chart.column(t.m.run < 1 ? copy.chart.open(t.m.long) : t.m.long, usd(t.total), usd(t.sales), usd(t.plus));
                return (
                  <button
                    key={t.m.key}
                    id={`month-${i}`}
                    type="button"
                    tabIndex={i === focus ? 0 : -1}
                    aria-label={label}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => {
                      setFocus(i);
                      setActive(i);
                    }}
                    onBlur={() => setActive(null)}
                    className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end rounded-sm outline-none transition-colors hover:bg-background/[0.06] active:bg-background/10 focus-visible:ring-2 focus-visible:ring-background/60"
                  >
                    {/* The rest of the open month at its pace so far: an
                        outline, since it is a projection. */}
                    {pace !== undefined && pace > t.total && (
                      <span
                        aria-hidden="true"
                        className="w-full max-w-5 rounded-t-[4px] border border-b-0 border-dashed border-background/40"
                        style={{ height: `${((pace - t.total) / top) * 100}%` }}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className={cn("flex w-full max-w-5 flex-col gap-0.5 transition-opacity", active !== null && active !== i && "opacity-50")}
                      style={{ height: `${h}%` }}
                    >
                      <span className={cn("w-full rounded-t-[4px]", PLUS, pace !== undefined && pace > t.total && "rounded-t-none")} style={{ height: `${100 - salesH}%` }} />
                      <span className={cn("w-full", SALES)} style={{ height: `${salesH}%` }} />
                    </span>
                    {/* The last month's total rides its cap. */}
                    {i === totals.length - 1 && active === null && (
                      <span
                        aria-hidden="true"
                        className="absolute right-0 pb-1.5 text-xs font-medium tabular-nums whitespace-nowrap"
                        style={{ bottom: `${(Math.max(t.total, pace ?? 0) / top) * 100}%` }}
                      >
                        {short(Math.round(t.total / 100) * 100)}
                      </span>
                    )}
                    {active === i && (
                      <span
                        role="tooltip"
                        className={cn(
                          "slab-reset pointer-events-none absolute z-10 w-44 rounded-md bg-card p-3 text-left text-foreground shadow-soft-lg",
                          i < totals.length / 2 ? "left-0" : "right-0",
                        )}
                        style={{ bottom: `calc(${(Math.max(t.total, pace ?? 0) / top) * 100}% + 8px)` }}
                      >
                        <span className="block text-xs text-muted-foreground">{t.m.run < 1 ? copy.chart.open(t.m.long) : t.m.long}</span>
                        <span className="mt-1 block font-heading text-xl tracking-tight tabular-nums">{usd(t.total)}</span>
                        <span className="mt-2 flex items-center justify-between gap-2 text-sm tabular-nums">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span aria-hidden="true" className={cn("h-0.5 w-3 rounded-full", SALES)} />
                            {copy.chart.sales}
                          </span>
                          {usd(t.sales)}
                        </span>
                        <span className="mt-1 flex items-center justify-between gap-2 text-sm tabular-nums">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span aria-hidden="true" className={cn("h-0.5 w-3 rounded-full", PLUS)} />
                            {copy.chart.plus}
                          </span>
                          {usd(t.plus)}
                        </span>
                        {pace !== undefined && (
                          <span className="mt-2 block border-t pt-2 text-xs text-muted-foreground">
                            {copy.chart.pace} <span className="text-foreground tabular-nums">{usd(pace)}</span>
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Every month named from sm; on a phone every other one, the
              last always, so twelve labels never run into each other. */}
          <div aria-hidden="true" className="mt-2 ml-13 flex justify-around gap-1 text-xs text-background/60">
            {totals.map((t, i) => (
              <span
                key={t.m.key}
                className={cn("min-w-0 flex-1 text-center", (totals.length - 1 - i) % 2 === 1 && "max-sm:invisible")}
              >
                {t.m.short}
              </span>
            ))}
          </div>
        </div>
      )}
      {open.run < 1 && (
        <p className="mt-4 text-xs text-background/60">{copy.chart.open(open.long.split(" ")[0])}</p>
      )}
    </div>
  );
}

function CoursesTile({ month, course, onPick }: { month: Month; course: CourseId | "all"; onPick: (c: CourseId | "all") => void }) {
  const t = totalOf(month);
  // Each row filters the chart and the tiles to its course. Said once under
  // the heading, and drawn on every row: an empty ring at rest, the brand's
  // disc with a tick once picked, centred on the row's name and its bar. The
  // rows run out into the tile's padding so their ring stands under the
  // heading's first letter.
  return (
    <div className={cn(tile, "lg:col-span-4")}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium">{copy.courses.heading}</h3>
        <span className="text-sm text-muted-foreground">{month.long.split(" ")[0]}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{course === "all" ? copy.courses.hint : copy.courses.again}</p>
      <ul className="-mx-3 mt-3 flex flex-col gap-1">
        {COURSES.map((c) => {
          const earned = month.fromSales[c] + month.fromPlus[c];
          const picked = course === c;
          const free = courseOf(c).price === 0;
          return (
            <li key={c}>
              <button
                type="button"
                aria-pressed={picked}
                aria-label={picked ? copy.courses.unpick : copy.courses.pick(courseOf(c).title)}
                onClick={() => onPick(picked ? "all" : c)}
                className={cn(
                  "group/row flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent active:bg-muted",
                  "aria-pressed:bg-card aria-pressed:ring-2 aria-pressed:ring-inset aria-pressed:ring-(--frame-ink) aria-pressed:hover:bg-accent aria-pressed:active:bg-muted",
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center rounded-full transition-colors group-aria-pressed/row:bg-primary group-aria-pressed/row:text-primary-foreground not-group-aria-pressed/row:ring-1 not-group-aria-pressed/row:ring-inset not-group-aria-pressed/row:ring-foreground/20 not-group-aria-pressed/row:group-hover/row:ring-foreground/40"
                >
                  {picked && <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.6} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 text-pretty">{courseOf(c).title}</span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {free ? copy.courses.free : usd(earned)}
                    </span>
                  </span>
                  {/* A free course earns nothing, so where the others draw their
                      share it says how many it is teaching. */}
                  {free ? (
                    <span className="mt-1 block text-sm tabular-nums text-muted-foreground">
                      {copy.courses.learners(figure(month.learners[c]))}
                    </span>
                  ) : (
                    <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-muted">
                      <span className={cn("block h-full rounded-full", SALES)} style={{ width: `${t.total ? (earned / t.total) * 100 : 0}%` }} />
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PlusTile({ months, only }: { months: Month[]; only?: CourseId }) {
  const series = months.map((m) => totalOf(m, only).minutes / m.run);
  const now = totalOf(months[months.length - 1], only).minutes;
  const max = Math.max(...series, 1);
  const w = 240;
  const h = 96;
  const pts = series.map((v, i) => [(i / Math.max(1, series.length - 1)) * (w - 8) + 4, h - 4 - (v / max) * (h - 12)]);
  const last = pts[pts.length - 1];
  return (
    <div className={cn(tile, "flex flex-col lg:col-span-4")}>
      <h3 className="text-sm font-medium">{copy.plus.heading}</h3>
      <p className="mt-3 font-heading text-4xl tracking-tighter tabular-nums">{figure(now)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{copy.plus.watched(months[months.length - 1].long.split(" ")[0], months[months.length - 1].run < 1)}</p>
      <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="mt-5 h-24 w-full" preserveAspectRatio="none">
        <polygon points={`4,${h} ${pts.map((p) => p.join(",")).join(" ")} ${w - 4},${h}`} fill={PLUS_STROKE} opacity="0.1" />
        <polyline
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={PLUS_STROKE}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* the end dot, drawn in HTML so the stretched drawing keeps it round */}
      <div className="relative -mt-24 h-24" aria-hidden="true">
        <span
          className={cn("absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card", PLUS)}
          style={{ left: `${(last[0] / w) * 100}%`, top: `${(last[1] / h) * 100}%` }}
        />
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4 text-sm">
        <span className="text-muted-foreground">{copy.plus.rate(rate)}</span>
        <Link href="/teach#earnings" className="relative inline-flex items-center gap-1 font-medium underline-offset-4 press after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 hover:underline">
          {copy.plus.how}
          <ArrowUpRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function StatementsTile({ months, today }: { months: Month[]; today: string }) {
  const closed = [months[10], months[9], months[8], months[7]];
  return (
    <div className={cn(tile, "lg:col-span-4")}>
      <h3 className="text-sm font-medium">{copy.statements.heading}</h3>
      <ul className="mt-3 divide-y">
        {closed.map((m) => (
          <li key={m.key} className="flex items-center gap-3 py-2.5">
            <span className="min-w-0 flex-1">
              <span className="block text-sm">{m.long}</span>
              <span className="block text-sm text-muted-foreground">{payout(m, today)}</span>
            </span>
            <span className="text-sm font-medium tabular-nums">{usd(totalOf(m).total)}</span>
            <button
              type="button"
              aria-label={copy.statements.download(m.long)}
              onClick={() => download(`mentora-statement-${m.key}.csv`, statementCsv(m))}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground press after:absolute after:-inset-0.5 hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={Download04Icon} size={18} strokeWidth={1.6} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

