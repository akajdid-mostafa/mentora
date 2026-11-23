"use client";

import type { ComponentType } from "react";
import { whenPressed } from "@/components/ui/selected";
import { cn } from "@/lib/utils";

export type FacetTab<T> = {
  label: string;
  value: T | null;
  Icon: ComponentType<{ className?: string }>;
  count: number;
};

/** A list's subjects as a row of pills, each saying how many results it holds
 *  under the other filters. The one in force is picked the way every chip on
 *  the site is picked. One that would empty the page is locked, and stays
 *  still under the pointer. Below lg the row scrolls to the screen's edge
 *  where it runs out of room. */
export function FacetTabs<T>({
  label,
  tabs,
  value,
  onChange,
  className,
}: {
  label: string;
  tabs: FacetTab<T>[];
  value: T | null;
  onChange: (next: T | null) => void;
  className?: string;
}) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "no-scrollbar -mx-6 -my-1 flex min-w-0 gap-2 overflow-x-auto px-6 py-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0",
        className,
      )}
    >
      {tabs.map((t) => {
        const on = value === t.value;
        return (
          <li key={t.label}>
            <button
              type="button"
              aria-pressed={on}
              disabled={!on && t.count === 0}
              onClick={() => onChange(t.value)}
              className={cn(
                "group/tab press flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-control px-4 text-sm",
                "bg-card ring-1 ring-inset ring-border hover:bg-accent",
                whenPressed,
                "aria-pressed:hover:bg-accent",
                "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-card",
              )}
            >
              <t.Icon className="size-4 shrink-0" />
              {t.label}
              <span className="tabular-nums not-group-aria-pressed/tab:text-muted-foreground">{t.count}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
