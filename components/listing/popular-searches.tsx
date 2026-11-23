"use client";

import { whenPressed } from "@/components/ui/selected";
import { cn } from "@/lib/utils";

/** A search most visitors begin with, and the dot of the subject most of its
 *  results sit in. */
export type PopularSearch = { q: string; dot: string };

/** The searches most visitors begin with, drawn as the home hero's topic
 *  chips are: a dot in the subject's hue beside the words. The one in force
 *  is pressed, and pressing it again clears it. They stand on a list page's
 *  tinted band, so a hover darkens a chip to the rung under the band rather
 *  than to the band itself, where it would read as the chip going out. 12px
 *  a side rather than the hero's 14: at 1024 four need 386px of a 396px
 *  column, and at 14 the last one dropped to a line of its own. */
export function PopularSearches({
  items,
  value,
  onPick,
  className,
}: {
  items: PopularSearch[];
  value: string;
  onPick: (q: string) => void;
  className?: string;
}) {
  const now = value.trim().toLowerCase();
  return (
    <ul aria-label="Popular searches" className={cn("flex flex-wrap gap-2", className)}>
      {items.map((s) => {
        const on = now === s.q.toLowerCase();
        return (
          <li key={s.q}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => onPick(on ? "" : s.q)}
              className={cn(
                "press flex h-10 items-center gap-2 rounded-control px-3 text-sm",
                "bg-card ring-1 ring-inset ring-border hover:bg-muted",
                whenPressed,
                "aria-pressed:hover:bg-muted",
              )}
            >
              <span aria-hidden="true" className={cn("size-2 rounded-full", s.dot)} />
              {s.q}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
