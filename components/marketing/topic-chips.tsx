import Link from "next/link";
import { topics } from "@/components/marketing/catalogue";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

/** The five doors into the catalogue by subject, each opening it already
 *  narrowed to that subject. Each carries its Subject hue as a dot beside the
 *  label rather than as a fill, so the row reads as five peers rather than
 *  five buttons competing with the search above it. */
export function TopicChips({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {topics.map((t) => (
        <li key={t.label}>
          <Link
            href={t.href}
            className={cn(
              "press flex h-10 items-center gap-2 rounded-control bg-card px-3.5 text-sm ring-1 ring-inset ring-border hover:bg-accent",
              reach,
            )}
          >
            <span aria-hidden="true" className={cn("size-2 rounded-full", t.accent)} />
            {t.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
