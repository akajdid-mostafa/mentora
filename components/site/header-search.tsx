"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { recordView } from "@/components/course/recent";
// Imported at the top, though it brings the course list into the JavaScript
// every page loads (about 16 KB gzipped). Measured against a build that
// loaded it on first focus instead, this is the lighter one: off the shared
// chunk, the list was bundled again into each route that shows courses, and
// every such route came out 3 to 10 KB heavier than it is with it here.
import { suggest, topics, type Suggestion } from "@/components/marketing/catalogue";
import { useCombobox } from "@/components/search/use-combobox";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

// One option row, for a suggested course and a popular topic alike.
const option =
  "flex cursor-pointer rounded-[calc(var(--radius-lg)-6px)] px-3 transition-colors data-active:bg-accent";

/** The bar's search: a combobox over the course catalogue, the one the hero
 *  carries, at the header's size. The arrow keys walk the options, Enter takes
 *  one, Escape and a click anywhere else close the list. An empty field with
 *  focus lists the hero's five topics, so the list has something to offer
 *  before anybody types, and taking one fills the field with it. Taking a
 *  course opens its page.
 *
 *  `inline` sets the list inside whatever holds the field, for the popover the
 *  bar opens below xl; otherwise it drops from the field on its own surface. */
export function HeaderSearch({
  inline = false,
  className,
}: {
  inline?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const typed = query.trim();
  const rows: (Suggestion | (typeof topics)[number])[] = typed ? suggest(query) : topics;
  const combo = useCombobox({
    rows,
    onType: setQuery,
    onTake: (o) => {
      if (!("title" in o)) return setQuery(o.label);
      setQuery(o.title);
      recordView(o.id);
      router.push(o.href);
    },
    // a topic only fills the field, and the list stays to offer its courses
    keepOpen: (o) => !("title" in o),
  });

  return (
    <form
      action="/courses"
      role="search"
      className={cn("relative", className)}
      {...combo.root}
    >
      <div className="flex h-10 items-center rounded-control bg-accent pl-3 pr-1 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring">
        <input
          name="q"
          // size={1}, or the input's default width sets the row's min-content
          // and the bar cannot shrink below it
          size={1}
          value={query}
          {...combo.input}
          onKeyDown={(e) => {
            // In the popover the topics are the panel itself rather than a
            // list dropped over the page, so Escape passes them by and closes
            // the popover.
            if (e.key === "Escape" && inline && !typed) return;
            combo.input.onKeyDown(e);
          }}
          aria-label="Search courses"
          placeholder="Search courses"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
        />
        <button
          type="submit"
          aria-label="Search the catalog"
          className="flex size-8 shrink-0 items-center justify-center rounded-[calc(var(--radius-control)-4px)] bg-primary text-primary-foreground press hover:bg-primary/80"
        >
          <MagnifyingGlassIcon className="size-4" />
        </button>
      </div>

      {combo.open && (
        <div
          className={cn(
            inline
              ? "mt-2"
              : "absolute inset-x-0 top-full z-10 mt-2 rounded-lg bg-popover p-2 text-popover-foreground shadow-soft-lg",
          )}
        >
          {!typed && <Caps className="px-3 pb-2 pt-2">Popular</Caps>}
          <ul
            {...combo.listbox}
            aria-label={typed ? "Suggested courses" : "Popular topics"}
          >
            {rows.map((o, i) => (
              <li
                key={"title" in o ? o.title : o.label}
                {...combo.option(i)}
                className={cn(
                  option,
                  "title" in o ? "flex-col py-2.5" : "h-9 items-center gap-3 text-sm",
                )}
              >
                {"title" in o ? (
                  <>
                    <span className="truncate text-sm">{o.title}</span>
                    <span className="truncate text-sm text-muted-foreground">
                      {o.credential} · {o.by}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn("size-1.5 shrink-0 rounded-full", o.accent)}
                    />
                    {o.label}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

/** Below xl the bar has no width for the field, so it keeps a glyph that opens
 *  the same search in a panel 8px under the bar's edge. */
export function SearchPopover({
  bar,
  className,
}: {
  bar: HTMLElement | null;
  className?: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Search courses"
        className={cn(
          "relative flex size-10 shrink-0 items-center justify-center rounded-control",
          "text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          "data-popup-open:bg-accent data-popup-open:text-foreground",
          "after:absolute after:-inset-0.5 after:content-['']",
          className,
        )}
      >
        <MagnifyingGlassIcon className="size-5" />
      </Popover.Trigger>
      <Popover.Portal container={bar}>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={() => under(bar)}
          collisionPadding={16}
          className="z-50"
        >
          <Popover.Popup
            aria-label="Search courses"
            className={cn(
              "w-[min(calc(100vw-2rem),24rem)] origin-(--transform-origin) rounded-lg bg-popover p-2 text-popover-foreground shadow-soft-lg outline-none",
              "transition-[opacity,scale] duration-spring ease-spring data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer motion-reduce:transition-none",
            )}
          >
            <HeaderSearch inline />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** How far below a 40px control in the bar a panel has to start to clear the
 *  bar's edge by 8px, whichever of its two heights the bar is at. */
export const under = (bar: HTMLElement | null) =>
  ((bar?.offsetHeight ?? 64) - 40) / 2 + 8;
