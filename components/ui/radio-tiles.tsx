"use client";

import type { KeyboardEvent } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export type RadioTile = {
  id: string;
  title: string;
  line: string;
  icon?: IconSvgElement;
};

/** Choices laid out as tiles, the picked one in the brand's ring and no
 *  mark inside, since each tile's words already say what it is. Two side by
 *  side at every width, as the checkout's reference draws its two payment
 *  methods: the name and its glyph on the first line, the line under it free
 *  to wrap. A pair stacked on a phone made a step the tallest step and left
 *  a gap under every other. One tab stop for the set, on the tile that is
 *  picked, and the arrow keys to move it. Written for the checkout, and
 *  shared with the sign-up's second step. */
export function RadioTiles({
  label,
  labelId,
  name,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  labelId: string;
  /** The key the picked tile's id is sent under when the form is
   *  submitted: the tiles are buttons, so the set carries one hidden field. */
  name?: string;
  value: string;
  onChange: (id: string) => void;
  options: RadioTile[];
  className?: string;
}) {
  const step = (e: KeyboardEvent<HTMLButtonElement>, from: number) => {
    const by = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[
      e.key
    ];
    if (!by) return;
    e.preventDefault();
    const next = options[(from + by + options.length) % options.length];
    onChange(next.id);
    e.currentTarget.parentElement
      ?.querySelector<HTMLElement>(`[data-tile="${next.id}"]`)
      ?.focus();
  };
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span id={labelId} className="text-sm">
        {label}
      </span>
      {name && <input type="hidden" name={name} value={value} />}
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="grid grid-cols-2 gap-2"
      >
        {options.map((o, i) => {
          const on = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              data-tile={o.id}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.id)}
              onKeyDown={(e) => step(e, i)}
              className={cn(
                "flex w-full flex-col rounded-sm px-4 py-3.5 text-left transition-[box-shadow,background-color]",
                // a tile is larger than a control, so a press moves its fill
                // a rung below the hover rather than shrinking it
                "ring-1 ring-inset ring-border hover:bg-accent active:bg-muted",
                "aria-checked:bg-card aria-checked:ring-2 aria-checked:ring-(--frame-ink) aria-checked:hover:bg-accent aria-checked:active:bg-muted",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0 text-sm font-medium">{o.title}</span>
                {o.icon && (
                  <HugeiconsIcon
                    icon={o.icon}
                    size={20}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground"
                  />
                )}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {o.line}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
