"use client";

import { useState, useSyncExternalStore } from "react";
import { Popover } from "@base-ui/react/popover";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Link01Icon, Mail01Icon, Share03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { reach } from "@/components/reach";
import { usePortalRoot } from "@/components/ui/portal-root";
import { cn } from "@/lib/utils";

const never = () => () => {};

/** Share, as a small menu of the ways a page gets passed on: its link on
 *  the clipboard, an email with the link in it, and the phone's own share
 *  sheet where the browser has one. */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const root = usePortalRoot();
  const [copied, setCopied] = useState(false);
  const native = useSyncExternalStore(
    never,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );
  const url = () => new URL(path, window.location.origin).toString();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // a blocked clipboard leaves the row as it was rather than claiming a copy
    }
  };

  const row =
    "flex h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-sm transition-colors hover:bg-accent active:bg-muted";

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "flex h-10 items-center gap-2 rounded-control px-4 text-sm ring-1 ring-inset ring-border transition-colors hover:bg-accent data-[popup-open]:bg-accent",
          reach,
        )}
      >
        <HugeiconsIcon icon={Share03Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
        Share
      </Popover.Trigger>
      <Popover.Portal container={root}>
        <Popover.Positioner side="bottom" align="center" sideOffset={8} collisionPadding={16} className="z-50">
          <Popover.Popup
            className={cn(
              "w-60 origin-(--transform-origin) rounded-lg bg-popover p-1.5 text-popover-foreground shadow-soft-lg outline-none",
              "transition-[opacity,scale] duration-spring ease-spring data-ending-style:duration-answer data-ending-style:ease-answer data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 motion-reduce:transition-none",
            )}
          >
            <Popover.Title className="sr-only">Share {title}</Popover.Title>
            <button type="button" onClick={copy} className={row}>
              {copied ? (
                <CheckIcon aria-hidden="true" className="size-4 text-iris-ink" />
              ) : (
                <HugeiconsIcon icon={Link01Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
              )}
              {copied ? "Link copied" : "Copy the link"}
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title} on Mentora: ${url()}`)}`;
              }}
              className={row}
            >
              <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
              Send it by email
            </button>
            {/* first-paint: the popup is shut in the first paint; the server draws no extra row, because only the browser knows whether it has a share sheet, and the two rows every browser has are drawn whole */}
            {native && (
              <button
                type="button"
                onClick={() => navigator.share({ title, url: url() }).catch(() => {})}
                className={row}
              >
                <HugeiconsIcon icon={Share03Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
                More ways to share
              </button>
            )}
            <p aria-live="polite" className="sr-only">
              {copied ? "Link copied" : ""}
            </p>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
