"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

// A setting picked from a few values: a row of pills under a label that
// names the setting, the picked one inside the brand's line. The label and
// the words on each pill say it is a choice the next action applies, so the
// pills carry no mark of their own.
//
// Every pill holds the width of its label in the picked weight, so picking
// one widens nothing and nothing on the row moves. On a white card the pills
// rest on a hairline and hover a rung down; on a tinted band they rest white
// and lift, since the band is already the rung below.

export type Pill<T extends string> = { id: T; label: ReactNode; hint?: ReactNode };

const REST = {
  card: "not-aria-checked:ring-1 not-aria-checked:ring-inset not-aria-checked:ring-border not-aria-checked:hover:bg-accent",
  tint: "not-aria-checked:bg-card not-aria-checked:ring-1 not-aria-checked:ring-inset not-aria-checked:ring-border not-aria-checked:hover:shadow-soft",
};

export function RadioPills<T extends string>({
  options,
  value,
  onChange,
  idPrefix,
  labelledBy,
  on = "card",
  fill,
  className,
}: {
  options: Pill<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Each pill's element id is `${idPrefix}-${id}`. */
  idPrefix: string;
  labelledBy: string;
  on?: keyof typeof REST;
  /** Under sm, a list: each pill the width of the row with its hint at the
   *  end, since three with their hints do not share a phone's line. */
  fill?: boolean;
  className?: string;
}) {
  // The arrow keys move along the pills and pick as they go, and only the
  // picked one is in the tab order, as a radio group's keys are.
  const move = (e: KeyboardEvent, by: number) => {
    e.preventDefault();
    const i = options.findIndex((o) => o.id === value);
    const to = options[(i + by + options.length) % options.length];
    onChange(to.id);
    document.getElementById(`${idPrefix}-${to.id}`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") move(e, 1);
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(e, -1);
      }}
      className={cn("flex flex-wrap gap-2", fill && "max-sm:grid max-sm:w-full", className)}
    >
      {options.map((o) => {
        const picked = o.id === value;
        return (
          <button
            key={o.id}
            id={`${idPrefix}-${o.id}`}
            type="button"
            role="radio"
            aria-checked={picked}
            tabIndex={picked ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-control px-5 text-sm whitespace-nowrap press",
              fill && "max-sm:justify-start max-sm:px-4",
              "aria-checked:bg-card aria-checked:font-medium aria-checked:ring-2 aria-checked:ring-inset aria-checked:ring-primary aria-checked:hover:ring-primary/70",
              REST[on],
            )}
          >
            {/* The weight of the picked label is held in every pill by an
                unseen bold copy, so picking one widens nothing. */}
            <span className="grid">
              <span className="col-start-1 row-start-1">{o.label}</span>
              <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-medium">
                {o.label}
              </span>
            </span>
            {o.hint && <span className={cn("font-normal tabular-nums text-muted-foreground", fill && "max-sm:ml-auto")}>{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
