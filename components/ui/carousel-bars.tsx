"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** The row of bars under a carousel, one a slide and set close, the way a
 *  story viewer sets them: the slides already passed stand full in the brand,
 *  the ones to come are a pale track, and the open one fills over `dwell`
 *  while the carousel turns over on its own, calling `onDone` once it is
 *  full. Without a dwell the open bar stands full.
 *
 *  Each bar is a 40px-tall target around its 6px stroke. The fill slides in
 *  from the left inside its track rather than stretching, so both its ends
 *  stay round, and it moves by transform alone, so the clock costs the main
 *  thread nothing. The open bar answers no hover and no press, marked
 *  disabled: it is already where a press would take the reader. */
export function CarouselBars({
  count,
  at,
  onPick,
  label,
  dwell,
  paused = false,
  onDone,
  className,
}: {
  count: number;
  at: number;
  onPick: (i: number) => void;
  /** What a bar is called to a screen reader, from its index. */
  label: (i: number) => string;
  /** How long the open slide stands, in ms, while the carousel turns over. */
  dwell?: number;
  /** Holds the open bar's fill where it has reached. */
  paused?: boolean;
  onDone?: () => void;
  className?: string;
}) {
  const fill = useRef<HTMLSpanElement>(null);
  const clock = useRef<Animation | null>(null);
  const done = useRef(onDone);
  const held = useRef(paused);
  useEffect(() => {
    done.current = onDone;
    held.current = paused;
  });

  // The open bar's clock, started from empty on every slide and gone once
  // the carousel stops turning over.
  useEffect(() => {
    const el = fill.current;
    if (!el || !dwell) return;
    const run = el.animate([{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }], {
      duration: dwell,
      easing: "linear",
      fill: "forwards",
    });
    if (held.current) run.pause();
    run.onfinish = () => done.current?.();
    clock.current = run;
    return () => {
      run.cancel();
      clock.current = null;
    };
  }, [at, dwell]);

  useEffect(() => {
    const run = clock.current;
    if (!run) return;
    if (paused) run.pause();
    else run.play();
  }, [paused]);

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: count }, (_, i) => {
        const on = i === at;
        const full = i < at || (on && !dwell);
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (!on) onPick(i);
            }}
            aria-label={label(i)}
            aria-current={on || undefined}
            aria-disabled={on || undefined}
            className="group/bar press flex h-10 w-11 items-center justify-center aria-[current=true]:cursor-default"
          >
            {/* Contrast: a bar is foreground/15, 1.4:1 on the page, and the
                open one fills with the brand, 1.1:1 against that, under
                WCAG's 3:1 for a graphic; aria-current names the open one. */}
            <span
              aria-hidden="true"
              className="relative h-1.5 w-10 overflow-hidden rounded-full bg-foreground/15 transition-colors not-group-aria-[current=true]/bar:group-hover/bar:bg-foreground/30"
            >
              <span
                ref={on ? fill : undefined}
                className="absolute inset-0 rounded-full bg-primary transition-colors not-group-aria-[current=true]/bar:group-hover/bar:bg-[color-mix(in_oklab,var(--primary),var(--foreground)_15%)]"
                style={{ transform: full ? "translateX(0)" : "translateX(-100%)" }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
