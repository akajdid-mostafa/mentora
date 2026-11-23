"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePortalRoot } from "@/components/ui/portal-root";
import { cn } from "@/lib/utils";

// A panel a visitor opens on purpose — the full filter set, a comparison —
// over the page, which it leaves inert behind a light scrim. On a phone it
// rises from the foot of the screen as a sheet, where a thumb already is; from
// sm it sits in the middle of the page. One component for both, so the two
// never drift apart in radius, scrim or close control.
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  const root = usePortalRoot();
  return (
    <DialogPrimitive.Portal container={root}>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 min-h-dvh bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
          "transition-opacity duration-sheet ease-sheet data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none",
        )}
      />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            // A floating surface: the page's popover rung and its cast, no
            // border. The sheet squares its bottom corners where it meets the
            // edge of the screen.
            "relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-t-xl bg-popover text-popover-foreground shadow-soft-lg outline-none",
            "sm:max-h-[min(54rem,calc(100dvh-3rem))] sm:rounded-lg",
            "transition-[transform,opacity] duration-sheet ease-sheet motion-reduce:transition-none",
            "data-starting-style:translate-y-10 data-starting-style:opacity-0 data-ending-style:translate-y-10 data-ending-style:opacity-0",
            "sm:data-starting-style:translate-y-3 sm:data-ending-style:translate-y-3",
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** The dismiss control every panel carries: an icon on the control seed,
 *  drawn at 40px with a 44px reach, resting on a rung and darkening one step
 *  when pointed at. */
function DialogCloseButton({
  className,
  label = "Close",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <DialogPrimitive.Close
      aria-label={label}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-control bg-muted press hover:bg-secondary",
        "after:absolute after:-inset-0.5 after:content-['']",
        className,
      )}
    >
      <XMarkIcon className="size-4" />
    </DialogPrimitive.Close>
  );
}

export {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
};
