"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { teacherHref } from "@/components/course/courses";
import { ChecksList } from "@/components/instructors/checks-list";
import { directoryCopy } from "@/components/instructors/copy";
import { entryOf } from "@/components/instructors/directory";
import { checksOf, records } from "@/components/instructors/records";
import { face } from "@/components/marketing/quotes";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

// The five badges that went on last, newest first: the record reads as the
// latest entries in a log rather than as five teachers picked to flatter it.
const PEOPLE = Object.entries(records)
  .sort(([, a], [, b]) => b.on.localeCompare(a.on))
  .slice(0, 5)
  .map(([name]) => name);

// The badge's own day is written in UTC, the zone it is stored in, so the
// day printed is the day recorded wherever the page is read.
const withYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** What the badge on every card stands for, as the records behind the
 *  latest ones: the four checks in the order they ran, each with the
 *  evidence and the day it passed, and a row of faces to read another
 *  teacher's. The faces are tabs, and the arrow keys walk them. */
export function BadgeRecord({ className }: { className?: string }) {
  const [shown, setShown] = useState(PEOPLE[0]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  const onKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const i = PEOPLE.indexOf(shown);
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
    const to =
      ev.key === "Home" ? 0 : ev.key === "End" ? PEOPLE.length - 1 : step ? (i + step + PEOPLE.length) % PEOPLE.length : -1;
    if (to < 0) return;
    ev.preventDefault();
    setShown(PEOPLE[to]);
    tabs.current[to]?.focus();
  };

  return (
    <figure
      data-object
      className={cn("rounded-lg bg-card p-6 shadow-soft sm:p-7", className)}
    >
      {/* The caption and the faces share a line where the card has room
          for both, and stack where it does not, rather than wrapping with
          the faces flung to the far edge. */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Caps as="figcaption" id={`${base}-caption`}>
          {directoryCopy.record}
        </Caps>
        {/* Five faces at 32px under 360, where the card holds 176px for
            them, and 36px from there. */}
        <div
          role="tablist"
          aria-labelledby={`${base}-caption`}
          onKeyDown={onKey}
          className="flex gap-1 min-[360px]:gap-1.5"
        >
          {PEOPLE.map((name, i) => {
            const on = name === shown;
            const who = entryOf(name)!;
            return (
              <button
                key={name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${i}`}
                aria-selected={on}
                aria-controls={`${base}-panel-${i}`}
                aria-label={name}
                tabIndex={on ? 0 : -1}
                onClick={() => setShown(name)}
                className={cn(
                  "relative size-8 shrink-0 rounded-full press after:absolute after:-inset-1 after:content-[''] min-[360px]:size-9 min-[360px]:after:-inset-0.5",
                  // The face being read wears the picked ring and lifts under
                  // the pointer; the others sit back and come forward. Focus
                  // draws its outline outside the picked ring, which it would
                  // otherwise sit exactly on top of.
                  "focus-visible:outline-offset-4",
                  "aria-selected:ring-2 aria-selected:ring-(--frame-ink) aria-selected:ring-offset-2 aria-selected:ring-offset-card aria-selected:hover:shadow-soft-lg",
                  "not-aria-selected:opacity-70 not-aria-selected:hover:opacity-100",
                )}
              >
                {who.portrait && (
                  <Image
                    src={face(who.portrait, 72)}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="size-8 rounded-full object-cover min-[360px]:size-9"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Every record is drawn, one over another in the same cell, and only
          the chosen one shows: the card is as tall as its longest record
          whoever is chosen, so a tap on a face never moves the filters and
          cards under it. A hidden record is out of the reading order too. */}
      <div className="grid">
        {PEOPLE.map((name, i) => (
          <Record
            key={name}
            name={name}
            id={`${base}-panel-${i}`}
            labelledBy={`${base}-tab-${i}`}
            shown={name === shown}
          />
        ))}
      </div>
    </figure>
  );
}

function Record({
  name,
  id,
  labelledBy,
  shown,
}: {
  name: string;
  id: string;
  labelledBy: string;
  shown: boolean;
}) {
  const e = entryOf(name)!;
  const r = records[name];
  const checks = checksOf(r);
  const first = name.split(" ")[0];

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      className={cn("flex flex-col [grid-area:1/1]", !shown && "invisible")}
    >
      <div className="mt-6 flex items-center gap-4">
        <span className="relative shrink-0">
          {e.portrait && (
            <Image
              src={face(e.portrait, 112)}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="size-14 rounded-full object-cover"
            />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-card">
            <CheckBadgeIcon aria-hidden="true" className="size-5 text-iris-ink" />
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-lg font-medium">
            {e.name}
            <span className="sr-only">, verified instructor</span>
          </p>
          <p className="text-sm text-muted-foreground">{e.trade}</p>
        </div>
      </div>

      <ChecksList checks={checks} className="mt-5" />

      {/* The foot keeps to the card's foot, so a shorter record leaves its
          slack above the rule rather than under the link. 16px above the
          rule at the least, the last step's own 10 and 6, to match the 16
          under it. */}
      <div className="mt-auto pt-1.5">
        <div className="flex flex-col items-start gap-2 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-muted-foreground">Verified {withYear.format(new Date(r.on))}</p>
          <Link
            href={teacherHref(name)}
            className="group/link relative flex items-center gap-1.5 font-medium press after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']"
          >
            Open {first}&rsquo;s profile
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover/link:[transform:translateX(2px)] motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
