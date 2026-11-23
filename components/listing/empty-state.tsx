import type { ReactNode } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

/** An empty list says what emptied it and offers the way back that fits: a
 *  glyph on a white disc, one line saying what happened, one saying what to
 *  do, and the controls the page chose for it under them. */
export function EmptyState({
  icon,
  title,
  text,
  children,
}: {
  icon: IconSvgElement;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-col items-center rounded-lg bg-accent px-6 py-16 text-center sm:py-20">
      <span className="flex size-14 items-center justify-center rounded-full bg-card shadow-soft">
        <HugeiconsIcon icon={icon} size={24} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-xl font-medium">{title}</h3>
      <p className="mt-2 max-w-md text-base text-muted-foreground">{text}</p>
      {children}
    </div>
  );
}
