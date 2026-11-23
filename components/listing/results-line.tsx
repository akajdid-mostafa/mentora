"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type ResultChip = { key: string; label: string };

/** Moves focus to an element once the render that changes the page has
 *  landed. A press that takes its own control off the page, such as a chip
 *  removing itself or an empty state's button, would otherwise drop focus
 *  to the top of the document. */
export const focusAfterRender = (el: RefObject<HTMLElement | null>) =>
  requestAnimationFrame(() => el.current?.focus({ preventScroll: true }));

/** Takes the reader down to the count once a search asked in a list page's
 *  band has landed, since the answer sits below the fold, and hands it the
 *  focus, which reads the count out. After the frame, so the list it lands
 *  on is the new one; the page's scroll-padding keeps the count clear of the
 *  sticky header, and its smooth scrolling is off for a reader who asked for
 *  less motion. */
export const scrollToResults = (el: RefObject<HTMLElement | null>) =>
  requestAnimationFrame(() => {
    el.current?.scrollIntoView({ block: "start" });
    el.current?.focus({ preventScroll: true });
  });

/** How many the filters kept, each filter as a chip that undoes it, and the
 *  link to this exact view. The count is read aloud when it changes, and
 *  takes the focus when the control that had it leaves the page. A removed
 *  chip hands the focus to the chip that took its place, or to the count
 *  when it was the last. */
export function ResultsLine<C extends ResultChip>({
  count,
  noun,
  query,
  chips,
  onRemove,
  onClear,
  headingRef,
}: {
  count: number;
  /** What the count counts, one and many. */
  noun: readonly [string, string];
  query: string;
  chips: C[];
  onRemove: (chip: C) => void;
  onClear: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const list = useRef<HTMLUListElement>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard refused: the address bar already holds the same link.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-5">
      <h2
        ref={headingRef}
        tabIndex={-1}
        aria-live="polite"
        className="text-base font-medium tabular-nums outline-none"
      >
        {count} {count === 1 ? noun[0] : noun[1]}
        {query && <span className="text-muted-foreground"> for “{query}”</span>}
      </h2>
      {chips.length > 0 && (
        <>
          <ul ref={list} aria-label="Filters on" className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(c);
                    const next = chips.length > 1 ? Math.min(i, chips.length - 2) : -1;
                    requestAnimationFrame(() => {
                      const chip = next < 0 ? null : list.current?.querySelectorAll("button")[next];
                      (chip ?? headingRef.current)?.focus({ preventScroll: true });
                    });
                  }}
                  aria-label={`Remove ${c.label}`}
                  className="press flex h-10 items-center gap-2 rounded-control bg-card pl-4 pr-3 text-sm ring-1 ring-inset ring-border hover:bg-accent"
                >
                  {c.label}
                  <XMarkIcon className="size-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              onClear();
              focusAfterRender(headingRef);
            }}
            className="press relative text-sm underline underline-offset-4 hover:text-muted-foreground after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']"
          >
            Clear all
          </button>
        </>
      )}
      <button
        type="button"
        onClick={copyLink}
        className="press ml-auto flex h-10 items-center gap-2 rounded-control px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <HugeiconsIcon icon={copied ? Tick02Icon : Link01Icon} size={16} strokeWidth={1.8} />
        {copied ? "Link copied" : "Copy link to this view"}
      </button>
    </div>
  );
}
