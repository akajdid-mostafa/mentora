"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// The way into the dark half. The site opens light whatever the visitor's
// system says — the provider in app/layout.tsx — and a press here is
// remembered. The server cannot know the stored mode, so the switch renders
// off until the page has mounted and then reads the stored one.
const subscribe = () => () => {};

/** A small switch under the footer's blurb: the header is full, and a mode is
 *  a setting a visitor changes once rather than an action they come back to.
 *  Drawn like the tutor section's Answer mode switch — an ink track when on,
 *  a card-coloured knob — at the size of a line of footer text. */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "group/mode press -ml-2 flex h-10 w-fit items-center gap-2.5 rounded-control px-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-5 w-9 shrink-0 items-center rounded-full bg-foreground/15 p-0.5 transition-colors group-aria-checked/mode:bg-foreground"
      >
        <span className="size-4 rounded-full bg-card shadow-soft transition-transform group-aria-checked/mode:translate-x-4" />
      </span>
      Dark mode
    </button>
  );
}
