"use client";

import type { ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { GridViewIcon, LeftToRightListBulletIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PRICE_CEILING, PRICE_STEP, ratings } from "@/components/course/courses";
import {
  BUCKET,
  priceLabel,
  ratingLabel,
  type Counts,
  type View,
} from "@/components/catalog/state";
import { chip, CountBadge } from "@/components/listing/chip";
import { reach } from "@/components/reach";
import { usePortalRoot } from "@/components/ui/portal-root";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  triggerRing,
} from "@/components/ui/select";
import {
  SliderControl,
  SliderIndicator,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { whenPressed } from "@/components/ui/selected";
import { cn } from "@/lib/utils";

// Every list here is built as the home page's Field select is (instructors-
// ranked.tsx): the value inside the trigger, so the popup opens with the
// chosen row laid over it, a group label that heads both columns, and the
// count at each row's end, which a screen reader hears with its noun.

/** The number beside an option: how many courses it would leave. */
function Tally({ n }: { n: number }) {
  return (
    <span className="ml-auto pl-6 text-sm tabular-nums text-muted-foreground">
      {n}
      <span className="sr-only"> {n === 1 ? "course" : "courses"}</span>
    </span>
  );
}

// A list whose rows carry counts is labelled with two heads: the facet's name,
// and "Courses" over the figures down the right edge, for the eye only, since
// every figure already says "courses" to a screen reader.
const heads = "flex justify-between gap-4 pr-8";

/** One facet as a list of options, any number of them chosen at once. An
 *  option that would empty the page is locked, unless it is already on. */
export function FacetSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  counts,
  render,
}: {
  label: string;
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  counts: Map<T, number>;
  render?: (option: T) => ReactNode;
}) {
  return (
    <Select multiple value={value} onValueChange={(v) => onChange(v as T[])}>
      <SelectTrigger
        aria-label={value.length ? `${label}, ${value.length} chosen` : label}
        className={chip}
      >
        {/* The facet's name however many are chosen: the count rides the
            corner. It is the Select's own value slot all the same, which is
            what the popup lines its chosen row up against. */}
        <SelectValue>{() => label}</SelectValue>
        {value.length > 0 && <CountBadge n={value.length} />}
      </SelectTrigger>
      <SelectContent label={label} className="min-w-64">
        <SelectGroup>
          <SelectLabel className={heads}>
            <span>{label}</span>
            <span aria-hidden="true">Courses</span>
          </SelectLabel>
          {options.map((o) => (
            <SelectItem
              key={o}
              value={o}
              disabled={!value.includes(o) && (counts.get(o) ?? 0) === 0}
              trailing={<Tally n={counts.get(o) ?? 0} />}
            >
              {render ? render(o) : o}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const ANY = "any";

const ratingItems: Record<string, string> = {
  [ANY]: "Any rating",
  ...Object.fromEntries(ratings.map((r) => [String(r), ratingLabel(r)])),
};

/** The lowest rating let through. One of four, so the chip names its value
 *  rather than carrying a count. */
export function RatingSelect({
  value,
  onChange,
  counts,
  all,
}: {
  value: number | null;
  onChange: (next: number | null) => void;
  counts: Counts["rating"];
  all: number;
}) {
  return (
    <Select
      items={ratingItems}
      value={value === null ? ANY : String(value)}
      onValueChange={(v) => onChange(v === ANY ? null : Number(v))}
    >
      <SelectTrigger aria-label="Rating" className={chip}>
        <SelectValue>
          {(v: string) =>
            v === ANY ? (
              "Rating"
            ) : (
              <span className="flex items-center gap-1">
                <StarSolid className="size-3.5 text-sun-ink" />
                {Number(v).toFixed(1)}+
              </span>
            )
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent label="Rating" className="min-w-56">
        <SelectGroup>
          <SelectLabel className={heads}>
            <span>Rating</span>
            <span aria-hidden="true">Courses</span>
          </SelectLabel>
          <SelectItem value={ANY} trailing={<Tally n={all} />}>
            Any rating
          </SelectItem>
          {ratings.map((r) => (
            <SelectItem
              key={r}
              value={String(r)}
              disabled={value !== r && (counts.get(r) ?? 0) === 0}
              trailing={<Tally n={counts.get(r) ?? 0} />}
            >
              <span className="flex items-center gap-1.5">
                <StarSolid className="size-3.5 text-sun-ink" />
                {ratingLabel(r)}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** Grid or list, as two icon controls. No well behind them: the chosen one
 *  wears the site's picked look, white on the brand's line. */
export function ViewToggle({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const views = [
    { id: "grid" as const, label: "Show as a grid", icon: GridViewIcon },
    { id: "list" as const, label: "Show as a list", icon: LeftToRightListBulletIcon },
  ];
  return (
    <div role="group" aria-label="Layout" className="flex shrink-0 gap-1">
      {views.map((v) => (
        <button
          key={v.id}
          type="button"
          aria-pressed={value === v.id}
          aria-label={v.label}
          onClick={() => onChange(v.id)}
          className={cn(
            "flex size-10 items-center justify-center rounded-control press",
            "text-muted-foreground hover:bg-accent hover:text-foreground",
            whenPressed,
            "aria-pressed:hover:bg-accent",
          )}
        >
          <HugeiconsIcon icon={v.icon} size={18} strokeWidth={1.6} />
        </button>
      ))}
    </div>
  );
}

/** Price as a histogram over a two-thumb range: the bars say where courses
 *  sit, the thumbs say which of them to keep, and the bars inside the range
 *  take the brand's fill so the two read as one instrument. */
export function PriceControl({
  value,
  onChange,
  histogram,
  found,
}: {
  value: [number, number];
  onChange: (next: [number, number]) => void;
  histogram: number[];
  found: number;
}) {
  const tallest = Math.max(1, ...histogram);
  const ends = [
    { label: "Minimum", text: `$${value[0]}` },
    { label: "Maximum", text: value[1] >= PRICE_CEILING ? `$${PRICE_CEILING}+` : `$${value[1]}` },
  ];
  return (
    <div>
      {/* Thin bars standing on the rail below them, softened at the top
          only, so they read as a histogram rather than as a row of pills.
          An empty ten dollars keeps a stub, so the axis stays unbroken. */}
      <div aria-hidden="true" className="flex h-16 items-end gap-1 px-3">
        {histogram.map((n, i) => {
          const lo = i * BUCKET;
          const inside = lo + BUCKET - 1 >= value[0] && lo <= value[1];
          return (
            <span
              key={i}
              style={{ height: n ? `${Math.max(14, (n / tallest) * 100)}%` : "3px" }}
              className={cn(
                "flex-1 rounded-t-[4px] transition-colors",
                inside && n ? "bg-primary" : "bg-muted",
              )}
            />
          );
        })}
      </div>
      {/* The rail stands 1px under the bars, as the reference's does, so the
          histogram reads as sitting on the slider it describes. The control
          keeps its 8px above the rail for the thumbs' reach and is pulled up
          by 7 of them; the thumbs lap the bars' feet, which is the point. */}
      <SliderRoot
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        min={0}
        max={PRICE_CEILING}
        step={PRICE_STEP}
        minStepsBetweenValues={0}
        className="-mt-1.75"
      >
        <SliderControl className="px-3">
          <SliderTrack>
            <SliderIndicator />
            {/* This slider only ever sits on white, in the popover and in
                the Filters panel, where a white thumb's own soft shadow has
                nothing to part it from: at the full range both thumbs sat
                past the rail's ends and read as no control at all. So each
                one draws its edge as a hairline at 16% ink. */}
            {[
              { index: 0, label: "Minimum price" },
              { index: 1, label: "Maximum price" },
            ].map((t) => (
              <SliderThumb
                key={t.index}
                index={t.index}
                aria-label={t.label}
                className="ring-1 ring-foreground/15"
              />
            ))}
          </SliderTrack>
        </SliderControl>
      </SliderRoot>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {ends.map((e) => (
          <p key={e.label} className="rounded-sm bg-accent px-4 py-2.5">
            <span className="block text-xs text-muted-foreground">{e.label}</span>
            <span className="text-sm tabular-nums">{e.text}</span>
          </p>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(
          [
            { label: "Free only", range: [0, 0] },
            { label: "Under $50", range: [0, 50] },
            { label: "Under $100", range: [0, 100] },
          ] as { label: string; range: [number, number] }[]
        ).map((q) => {
          const on = value[0] === q.range[0] && value[1] === q.range[1];
          return (
            <button
              key={q.label}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? [0, PRICE_CEILING] : q.range)}
              className={cn(
                "h-10 rounded-control px-4 text-sm press",
                "bg-card ring-1 ring-inset ring-border hover:bg-accent",
                whenPressed,
                "aria-pressed:hover:bg-accent",
              )}
            >
              {q.label}
            </button>
          );
        })}
        <p aria-live="polite" className="ml-auto text-sm tabular-nums text-muted-foreground">
          {found} {found === 1 ? "course" : "courses"}
        </p>
      </div>
    </div>
  );
}

/** Price as a chip, for the filter row: the instrument above in a popover. */
export function PricePopover({
  value,
  onChange,
  histogram,
  found,
}: {
  value: [number, number];
  onChange: (next: [number, number]) => void;
  histogram: number[];
  found: number;
}) {
  const root = usePortalRoot();
  const narrowed = !(value[0] === 0 && value[1] >= PRICE_CEILING);
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={narrowed ? `Price, ${priceLabel(value)}` : "Price"}
        className={cn(
          "group flex shrink-0 items-center whitespace-nowrap transition-[color,background-color,box-shadow]",
          chip,
          triggerRing,
          reach,
        )}
      >
        {narrowed ? priceLabel(value) : "Price"}
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180 motion-reduce:transition-none" />
      </Popover.Trigger>
      <Popover.Portal container={root}>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={16} className="z-50">
          <Popover.Popup
            className={cn(
              "w-[min(calc(100vw-2rem),24rem)] origin-(--transform-origin) rounded-lg bg-popover p-5 text-popover-foreground shadow-soft-lg outline-none",
              "transition-[opacity,scale] duration-spring ease-spring data-ending-style:duration-answer data-ending-style:ease-answer data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 motion-reduce:transition-none",
            )}
          >
            <Popover.Title className="text-sm font-medium">Price per course</Popover.Title>
            <Popover.Description className="mt-1 text-sm text-muted-foreground">
              In US dollars, before any Plus discount.
            </Popover.Description>
            <div className="mt-5">
              <PriceControl value={value} onChange={onChange} histogram={histogram} found={found} />
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
