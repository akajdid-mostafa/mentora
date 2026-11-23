"use client";

import Link from "next/link";
import { useId } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Calendar03Icon, Link01Icon, Tag01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAddressState } from "@/components/listing/use-address-state";
import { reach } from "@/components/reach";
import { earningsCopy } from "@/components/teach/copy";
import {
  estimateDefaults,
  figure,
  fromQuery,
  MINUTES_RANGE,
  monthOf,
  PLUS_RATE,
  PRICES,
  SALES_RANGE,
  SHARE,
  splitOf,
  toQuery,
  usd,
  type Estimate,
  type Price,
} from "@/components/teach/earnings";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { TabTrack } from "@/components/ui/tab-track";
import { useCopyLink } from "@/components/ui/use-copy-link";
import { cn } from "@/lib/utils";

const pct = `${Math.round(SHARE * 100)}%`;

// The address carries the estimate once it differs from the one the page
// opens on, so a reload or a shared link opens on the same three numbers and
// a first visit keeps a clean address. Kept by the listing pages' hook: it
// writes in place, never pushing an entry Back would step through, and when
// a link to this page from this page, the footer's, moves the address, the
// calculator takes the address's numbers.
const writeEstimate = (e: Estimate) =>
  e.price === estimateDefaults.price &&
  e.sales === estimateDefaults.sales &&
  e.minutes === estimateDefaults.minutes
    ? ""
    : `?${toQuery(e)}`;

// Each card takes two of the grid's rows as its own, a subgrid: what it
// holds, then its foot. Cards side by side share both rows, so their feet
// start on one line whatever each holds above or below it.
const card = "row-span-2 grid grid-rows-subgrid gap-y-0";

// Where an input card's foot starts: the hairline across it and what stands
// under it, with at least 32px above.
const foot = "flex flex-col gap-2 border-t pt-6";

export function EarningsBento() {
  const c = earningsCopy;
  const [e, setE] = useAddressState(fromQuery, writeEstimate);
  const { state: copy, copy: copyTo, reset: resetCopy, field: manual } = useCopyLink();

  const split = splitOf(e.price);
  const month = monthOf(e);
  const link = () => {
    const url = new URL("/teach", window.location.origin);
    url.search = toQuery(e);
    url.hash = "earnings";
    return url.toString();
  };

  const set = (patch: Partial<Estimate>) => {
    resetCopy();
    setE((was) => ({ ...was, ...patch }));
  };

  const copyLink = () => copyTo(link());

  return (
    <section id="earnings" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{c.heading}</SectionHeading>
          <p className="mt-4 max-w-[28rem] text-base text-muted-foreground">{c.lede}</p>
        </div>
        <div className="lg:mb-1">
          <Button variant="outline" onClick={copyLink}>
            <HugeiconsIcon
              data-icon="inline-start"
              icon={copy === "copied" ? Tick02Icon : Link01Icon}
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
              className={cn(copy === "copied" && "text-iris-ink")}
            />
            {/* Both labels in one cell, the one not showing kept invisible,
                so the button holds the width of the longer and a pointer
                resting on it is still on it when the words change. */}
            <span className="grid">
              <span className={cn("[grid-area:1/1]", copy === "copied" && "invisible")}>{c.copy}</span>
              <span aria-hidden={copy !== "copied"} className={cn("[grid-area:1/1]", copy !== "copied" && "invisible")}>
                {c.copied}
              </span>
            </span>
          </Button>
          <p aria-live="polite" className="sr-only">
            {copy === "copied" ? c.copied : ""}
          </p>
        </div>
      </div>
      {/* Under the row rather than in it, so the button a reader just
          pressed stays where it was when the field opens under it. */}
      {copy === "manual" && (
        <label className="mt-4 flex w-full max-w-md flex-col gap-1.5 text-sm text-muted-foreground lg:ml-auto">
          {c.manual}
          <input
            ref={manual}
            readOnly
            value={link()}
            onFocus={(ev) => ev.currentTarget.select()}
            className="h-10 w-full rounded-control bg-card px-3 font-mono text-xs text-foreground ring-1 ring-inset ring-border outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      )}

      {/* In the markup as it is read: the price, the month, then the answer.
          From xl the answer stands between the two as the reference's focal
          card; from lg to xl the two inputs share a row and the answer runs
          the width under them. */}
      <div data-object className="mt-12 grid gap-4 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
        <SaleCard price={e.price} onPrice={(price) => set({ price })} split={split} className="xl:order-1" />
        <MonthCard
          sales={e.sales}
          minutes={e.minutes}
          fromPlus={month.fromPlus}
          onSales={(sales) => set({ sales })}
          onMinutes={(minutes) => set({ minutes })}
          className="xl:order-3"
        />
        <ResultCard month={month} className="lg:col-span-2 xl:order-2 xl:col-span-1" />
      </div>
    </section>
  );
}

/** A card's head: its name, the line under it, and its glyph on a tinted
 *  disc in the corner. The disc is filled rather than ringed, so it cannot
 *  be taken for the ringed arrows further down the page, which are buttons. */
function CardHead({
  title,
  caption,
  icon,
}: {
  title: string;
  caption: string;
  icon: typeof Tag01Icon;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
      </div>
      <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent">
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.6} />
      </span>
    </div>
  );
}

function SaleCard({
  price,
  onPrice,
  split,
  className,
}: {
  price: Price;
  onPrice: (p: Price) => void;
  split: { yours: number; ours: number };
  className?: string;
}) {
  const c = earningsCopy.sale;
  const id = useId();
  const tenths = Math.round(SHARE * 10);
  return (
    <div id="split" className={cn(card, "rounded-lg bg-card p-6 ring-1 ring-inset ring-border sm:p-7", className)}>
      <div className="flex flex-col">
        <CardHead title={c.title} caption={c.caption} icon={Tag01Icon} />

        <p className="mt-8 font-heading text-6xl tracking-tighter tabular-nums">
          {usd(split.yours, true)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{c.keep(pct, usd(price))}</p>

        {/* The price in tenths, the instructor's seven in the brand and
            Mentora's three pale, with the split marked where it falls. */}
        <div className="mt-6">
          <div aria-hidden="true" className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={cn("h-2.5 flex-1 rounded-full", i < tenths ? "bg-primary" : "bg-muted")}
              />
            ))}
          </div>
          <div aria-hidden="true" className="relative mt-2 h-5 text-xs tabular-nums text-muted-foreground">
            <span className="absolute left-0">$0</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${SHARE * 100}%` }}>
              {usd(split.yours, true)}
            </span>
            <span className="absolute right-0">{usd(price)}</span>
          </div>
          <p className="sr-only">{c.said(usd(price), usd(split.yours, true), usd(split.ours, true))}</p>
        </div>

        <div className="mt-7">
          <Caps id={`${id}-price`}>{c.price}</Caps>
          <TabTrack
            kind="radios"
            on="card"
            labelledBy={`${id}-price`}
            idPrefix={`${id}-p`}
            options={PRICES.map((p) => ({ id: String(p), label: `$${p}` }))}
            value={String(price)}
            onChange={(v) => onPrice(Number(v) as Price)}
            className="mt-3 w-full [&>button]:flex-1 [&>button]:px-0 sm:[&>button]:px-0"
          />
        </div>

        <div aria-hidden="true" className="min-h-8 grow" />
      </div>
      <div className={foot}>
        <div className="flex items-end justify-between gap-4">
          {/* The figure reads first and its name under it, as the
              reference's two stats do; the markup keeps the name first. */}
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex flex-col-reverse gap-0.5">
              <dt className="text-sm text-muted-foreground">{c.oursLabel}</dt>
              <dd className="font-heading text-xl tracking-tight tabular-nums">{usd(split.ours, true)}</dd>
            </div>
            <div className="flex flex-col-reverse gap-0.5">
              <dt className="text-sm text-muted-foreground">{c.list}</dt>
              <dd className="font-heading text-xl tracking-tight tabular-nums">$0</dd>
            </div>
          </dl>
          {/* A plain anchor, so a second press still jumps; the questions
              hear the press and open the row on what the 30% pays for. */}
          <a
            href="#questions"
            aria-label={c.why}
            title={c.why}
            className="flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-border press hover:bg-accent"
          >
            <ArrowDownIcon aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  month,
  className,
}: {
  month: ReturnType<typeof monthOf>;
  className?: string;
}) {
  const c = earningsCopy.result;
  // Each source's share of the month, for the bar under the figure. A month
  // with nothing in it draws an empty track rather than dividing by zero.
  const salesShare = month.total ? (month.fromSales / month.total) * 100 : 0;
  return (
    // A slab: in the dark half the ink card stays a raised dark panel rather
    // than turning into the lightest thing on the page.
    <div className={cn(card, "slab rounded-lg bg-foreground p-6 text-background sm:p-7", className)}>
      {/* The figure and its two sources. On their own row, from lg to xl,
          the figure stands left and the sources right. Beside the inputs
          from xl the pair stacks under a head as tall as theirs, so the
          month's figure stands on the same line as the sale's: a level row
          of figures reads as one sum, where one lower than its neighbour
          reads as a card out of step. On a phone and a tablet the sources
          keep a reading width under the figure. */}
      <div className="flex flex-col">
        <div>
          <h3 className="text-xl tracking-tight">{c.title}</h3>
          <p className="mt-1 text-sm text-background/70">{c.caption}</p>
        </div>

        <div className="lg:mt-10 lg:grid lg:grid-cols-2 lg:items-end lg:gap-x-12 xl:mt-0 xl:block">
          <div className="mt-8 text-center lg:mt-0 lg:text-left xl:mt-8 xl:text-center">
            <p aria-live="polite" className="font-heading text-6xl tracking-tighter tabular-nums">
              {usd(Math.round(month.total))}
            </p>
            <p className="mt-2 text-sm text-background/70">
              {c.unit}, {usd(Math.round(month.year))} {c.year}
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md lg:mx-0 lg:mt-0 lg:max-w-none xl:mt-8">
            <span aria-hidden="true" className="flex h-2.5 gap-1">
              {month.fromSales > 0 && (
                <span className="rounded-full bg-primary" style={{ flexGrow: salesShare }} />
              )}
              {month.fromPlus > 0 && (
                <span
                  className="rounded-full bg-[color-mix(in_oklab,var(--iris),white_20%)]"
                  style={{ flexGrow: 100 - salesShare }}
                />
              )}
              {month.total === 0 && <span className="flex-1 rounded-full bg-background/15" />}
            </span>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
                <dt className="flex-1 text-background/70">{c.sales}</dt>
                <dd className="tabular-nums">{usd(Math.round(month.fromSales))}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-[color-mix(in_oklab,var(--iris),white_20%)]"
                />
                <dt className="flex-1 text-background/70">{c.plus}</dt>
                <dd className="tabular-nums">{usd(Math.round(month.fromPlus))}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* The way on: the studio, where flow three goes next, and the form
          at the foot of this page, a plain anchor so a second press still
          jumps. On the ink the second door is a white ring rather than a
          raised white button, which would read as a second primary. Each
          keeps its words on one line and the pair wraps rather than
          squeezing them. They fill a phone's width and the narrow card
          beside the inputs from xl; between, where the card is wide, each
          holds its own width. It sits on the card's floor, at the foot of
          the row it shares with the input cards' feet. */}
      <div className="flex flex-wrap gap-3 self-end pt-8 sm:justify-center lg:justify-start">
        <Button render={<Link href={c.studio.href} />} className="flex-auto sm:flex-none xl:flex-auto">
          {c.studio.label}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <a
          href={c.apply.href}
          className={cn(
            "flex h-10 flex-auto items-center justify-center rounded-control px-5 text-sm font-medium whitespace-nowrap ring-1 ring-inset ring-background/25 press hover:bg-background/10 sm:flex-none xl:flex-auto",
            reach,
          )}
        >
          {c.apply.label}
        </a>
      </div>
    </div>
  );
}

function MonthCard({
  sales,
  minutes,
  fromPlus,
  onSales,
  onMinutes,
  className,
}: {
  sales: number;
  minutes: number;
  fromPlus: number;
  onSales: (n: number) => void;
  onMinutes: (n: number) => void;
  className?: string;
}) {
  const c = earningsCopy.month;
  return (
    <div className={cn(card, "rounded-lg bg-card p-6 ring-1 ring-inset ring-border sm:p-7", className)}>
      <div className="flex flex-col">
        <CardHead title={c.title} caption={c.caption} icon={Calendar03Icon} />
        <Ruler value={sales} onChange={onSales} label={c.sales} unit={c.salesUnit} said={c.salesSaid} />

        <SliderRoot
          value={minutes}
          onValueChange={(v) => onMinutes(v as number)}
          min={MINUTES_RANGE.min}
          max={MINUTES_RANGE.max}
          step={MINUTES_RANGE.step}
          className="mt-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <SliderLabel>
              <Caps as="span">{c.minutes}</Caps>
            </SliderLabel>
            <span className="text-sm tabular-nums">
              {figure(minutes)} {c.minutesUnit}
            </span>
          </div>
          <SliderControl className="mt-1">
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb getAriaValueText={(_, v) => c.minutesSaid(figure(v))} />
            </SliderTrack>
          </SliderControl>
        </SliderRoot>
        {/* What a minute is worth, under the minutes it prices, so the foot
            holds one line as the sale card's does. */}
        <p className="mt-3 text-sm text-muted-foreground">{c.rate(`$${PLUS_RATE.toFixed(3)}`)}</p>

        <div aria-hidden="true" className="min-h-8 grow" />
      </div>
      <div className={foot}>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-heading text-5xl tracking-tighter tabular-nums">+{usd(Math.round(fromPlus))}</span>
          <span className="text-sm text-muted-foreground">{c.plus}</span>
        </p>
      </div>
    </div>
  );
}

/** The reference's ruler: a run of ticks the width of the card, the value
 *  read off a needle with its figure in a pill above it. The ticks up to the
 *  needle are the brand's and the rest a pale ink, as the site's stepped
 *  sliders draw what was chosen against what is left. The pill slides along
 *  its needle as the value does, left-aligned at the bottom of the range and
 *  right-aligned at the top, so it never leaves the card. Pointed at or
 *  dragged, the needle thickens and the pill takes the thumb's pale ring. A
 *  needle is a hairline, so the hit area is the thumb's pseudo-element, and
 *  the keys are the slider's own. */
function Ruler({
  value,
  onChange,
  label,
  unit,
  said,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  unit: string;
  said: (n: number) => string;
}) {
  const { min, max, step } = SALES_RANGE;
  const n = Math.round((max - min) / step);
  const taken = Math.round((value - min) / step);
  const along = ((value - min) / (max - min)) * 100;
  return (
    <SliderRoot
      value={value}
      onValueChange={(v) => onChange(v as number)}
      min={min}
      max={max}
      step={step}
      className="mt-8"
    >
      <SliderLabel>
        <Caps as="span">{label}</Caps>
      </SliderLabel>
      <SliderControl className="h-24 items-end py-0">
        <SliderTrack className="relative h-12 bg-transparent">
          <span aria-hidden="true" className="pointer-events-none absolute inset-0">
            {Array.from({ length: n + 1 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "absolute bottom-0 w-0.5 -translate-x-1/2 rounded-full transition-colors",
                  i % 5 === 0 ? "h-7" : "h-4",
                  i <= taken ? "bg-primary" : "bg-foreground/15",
                )}
                style={{ left: `${(i / n) * 100}%` }}
              />
            ))}
          </span>
          <SliderPrimitive.Thumb
            aria-label={label}
            getAriaValueText={(_, v) => said(v)}
            className={cn(
              "group/needle h-12 w-0.5 rounded-full bg-foreground transition-[width]",
              "group-hover/slider:w-1 data-[dragging]:w-1",
              "after:absolute after:-inset-x-4 after:-inset-y-2 after:content-['']",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring",
            )}
          >
            <span
              className="pointer-events-none absolute bottom-full left-1/2 mb-2 flex h-8 items-center rounded-control bg-foreground px-3 text-sm font-medium whitespace-nowrap text-background tabular-nums transition-shadow group-hover/slider:ring-3 group-hover/slider:ring-chip group-data-[dragging]/needle:ring-3 group-data-[dragging]/needle:ring-chip"
              style={{ transform: `translateX(-${along}%)` }}
            >
              {value} {unit}
            </span>
          </SliderPrimitive.Thumb>
        </SliderTrack>
      </SliderControl>
      <div aria-hidden="true" className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </SliderRoot>
  );
}
