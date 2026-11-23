"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { faqCopy, faqs, type Faq } from "@/components/marketing/faqs";
import { reach } from "@/components/reach";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// The home page's six by default; another page hands in its own list and the
// words around it, and the rows stay the same object. A page that links to
// its questions from higher up names the section with `anchor`.
export function FaqStepRows({
  items = faqs,
  copy = faqCopy,
  anchor,
}: { items?: Faq[]; copy?: typeof faqCopy & { footHref?: string }; anchor?: string } = {}) {
  // 0, not -1: the reference opens with a row already open, and a stack of
  // six closed rows reads as a list rather than as something that opens.
  const [open, setOpen] = useState(0);
  const id = useId();

  // A link to the anchor lands on the rows as they stand on arrival, the
  // first one open, whichever row the reader has opened since: the page
  // that links here writes its first question for that link. A link that
  // names a question with `data-faq` opens that one instead: the contact
  // form points at the answer to the topic picked in it.
  useEffect(() => {
    if (!anchor) return;
    const press = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest(`a[href$="#${anchor}"]`) : null;
      if (link) setOpen(Number(link.getAttribute("data-faq") ?? 0));
    };
    document.addEventListener("click", press);
    return () => document.removeEventListener("click", press);
  }, [anchor]);

  return (
    <section id={anchor} className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{copy.heading}</SectionHeading>
        </div>
        <p className="max-w-md text-base text-muted-foreground lg:mb-1">
          {copy.foot}{" "}
          {/* The contact page's own list points back up at its form rather
              than at the page it is already on. */}
          <a
            href={copy.footHref ?? "/contact"}
            className={cn(
              "text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground",
              reach,
            )}
          >
            {copy.footLink}
          </a>
          .
        </p>
      </div>

      <ul className="mt-14">
        {items.map((f, i) => {
          const on = open === i;
          // The rules run between closed rows only. The open row is a slab
          // with its own edge, so the rule under it and the one closing the
          // list beneath it would each be a second edge drawn on the first.
          // They are drawn as their own hairlines rather than as borders, so
          // the row can keep the slab's corner at rest and a rule never bends
          // round it.
          const last = i === items.length - 1;
          return (
            <li
              key={f.q}
              className={cn(
                "group/item relative rounded-lg transition-[margin,background-color] duration-sheet ease-sheet motion-reduce:transition-none",
                "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border before:opacity-100 before:transition-opacity before:content-['']",
                "has-[button[aria-expanded=true]]:my-3 has-[button[aria-expanded=true]]:bg-tint has-[button[aria-expanded=true]]:before:opacity-0",
                "[li:has(button[aria-expanded=true])+&]:before:opacity-0",
                last &&
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border after:opacity-100 after:transition-opacity after:content-[''] has-[button[aria-expanded=true]]:after:opacity-0",
              )}
            >
              {/* The first column holds the longest group label on one line
                  with room to spare — "03 · What you get" in the mono capitals
                  is 143px, and 9rem would leave it a single pixel — and the
                  open answer is indented by it plus the gap. The 4px around
                  the control are padding on a wrapper rather than a margin on
                  it, which would collapse through the row and land outside. */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  aria-controls={`${id}-${i}`}
                  className={cn(
                    "group group/faq grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 rounded-lg px-4 py-5 text-left transition-colors sm:grid-cols-[10rem_1fr_auto] sm:px-6 lg:py-6",
                    // a closed row takes the rung below the page, 4px clear of
                    // the rules so its corner never runs into one; the open
                    // row is already a slab, so its answer is the disc alone.
                    // A press moves either one a step further down.
                    "aria-expanded:active:bg-foreground/5 not-aria-expanded:hover:bg-accent not-aria-expanded:active:bg-muted",
                    reach,
                  )}
                >
                  <Caps
                    as="span"
                    className="col-span-2 tabular-nums group-aria-expanded/faq:text-foreground sm:col-span-1"
                  >
                    {String(i + 1).padStart(2, "0")} · {f.group}
                  </Caps>
                  <span className="font-heading text-xl tracking-tight sm:text-2xl lg:text-3xl">
                    {f.q}
                  </span>
                  {/* the reference's disc: an arrow pointing on, that turns
                      down to the answer as the row opens */}
                  <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-full transition-colors group-aria-expanded/faq:bg-foreground group-aria-expanded/faq:text-background group-aria-expanded/faq:group-hover:bg-foreground/80 not-group-aria-expanded/faq:ring-1 not-group-aria-expanded/faq:ring-inset not-group-aria-expanded/faq:ring-border not-group-aria-expanded/faq:group-hover:bg-card"
                  >
                    <ArrowRightIcon className="size-4 transition-transform group-aria-expanded/faq:rotate-90 motion-reduce:transition-none" />
                  </span>
                </button>
              </div>

              {/* The answer eases open to its own height rather than
                  appearing: the rows beneath it slide rather than jump. It is
                  inert while closed, so a screen reader does not read six
                  answers nobody opened. */}
              <div
                id={`${id}-${i}`}
                inert={!on}
                className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-sheet ease-sheet group-has-[button[aria-expanded=true]]/item:grid-rows-[1fr] motion-reduce:transition-none"
              >
                <div className="overflow-hidden">
                  <p className="max-w-[35rem] px-4 pb-8 text-base sm:ml-[calc(10rem+1.5rem)] sm:px-6 sm:pb-10">
                    {f.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
