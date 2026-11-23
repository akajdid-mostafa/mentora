import type { ReactNode } from "react";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

// The line over a section's heading, one treatment across the page: the
// capitals in a chip of the brand's tint, with a dot of its dark ink. The root
// is a flex line, so a centred head passes `justify-center`.
// Chosen over a haloed dot beside the capitals in full ink, and over the
// capitals alone in the muted ink: on a page of photographs and tinted bands,
// the chip is the one that still reads as the section's label.
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("flex", className)}>
      <span className="inline-flex h-7 items-center gap-2 rounded-control bg-chip pl-2.5 pr-3">
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-primary-ink"
        />
        <Caps as="span" className="text-primary-ink">
          {children}
        </Caps>
      </span>
    </p>
  );
}
