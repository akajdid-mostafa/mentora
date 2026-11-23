"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { recordView } from "@/components/course/recent";
import { suggest } from "@/components/marketing/catalogue";
import { useCombobox } from "@/components/search/use-combobox";
import { cn } from "@/lib/utils";

/** The hero's search as one field: a 44px pill holding a round submit, and the
 *  list of suggestions that drops from it. Where the field sits, and what it
 *  sits on, is the version's business, so the surface comes in through
 *  `fieldClassName` and the default is a card over a light ground.
 *
 *  A real combobox rather than a list of buttons under an input: the arrow keys
 *  walk the suggestions, Enter takes one, Escape and a click anywhere else
 *  close the list, and a screen reader hears which row is current. Taking a
 *  suggestion opens that course; submitting with nothing picked is an
 *  ordinary GET to the catalogue. */
export function HeroSearch({
  className,
  fieldClassName,
}: {
  className?: string;
  fieldClassName?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const hits = suggest(query);
  const combo = useCombobox({
    rows: hits,
    onType: setQuery,
    onTake: (h) => {
      setQuery(h.title);
      recordView(h.id);
      router.push(h.href);
    },
  });

  return (
    <form
      action="/courses"
      role="search"
      className={cn("relative", className)}
      {...combo.root}
    >
      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-control bg-card pl-4 pr-1",
          "ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20",
          "focus-within:ring-2 focus-within:ring-ring",
          fieldClassName,
        )}
      >
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
        <input
          name="q"
          // size={1}, or the input's default width sets the row's min-content
          // and the field cannot shrink inside a narrow column or at 320px.
          size={1}
          value={query}
          {...combo.input}
          aria-label="Search courses"
          placeholder="Try “python”"
          className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Search the catalog"
          className={cn(
            "flex size-10 shrink-0 items-center justify-center bg-primary text-primary-foreground",
            // concentric with the field: its seed less the 4px between them,
            // which is still a circle when the seed is a pill
            "press rounded-[calc(var(--radius-control)-4px)] hover:bg-primary/85",
          )}
        >
          <ArrowRightIcon className="size-4" />
        </button>
      </div>

      {combo.open && (
        <ul
          {...combo.listbox}
          aria-label="Suggested courses"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg bg-popover p-1.5 text-popover-foreground shadow-soft-lg"
        >
          {hits.map((h, i) => (
            <li
              key={h.title}
              {...combo.option(i)}
              data-object
              className="cursor-pointer rounded-sm px-3.5 py-2.5 transition-colors data-[active]:bg-accent"
            >
              <span className="block truncate text-sm">{h.title}</span>
              <span className="block text-sm text-muted-foreground">
                {h.credential} · {h.by}
              </span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
