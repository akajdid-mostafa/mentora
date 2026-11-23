"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  CheckmarkBadge01Icon,
  Download04Icon,
  MinusSignIcon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { courseById } from "@/components/course/courses";
import { float } from "@/components/float";
import { download } from "@/components/learn/transcript";
import { reach } from "@/components/reach";
import { plansCopy, teamsCopy } from "@/components/pricing/copy";
import { QUOTE_FROM, teamOf, usd } from "@/components/pricing/math";
import { quoteNumber, quotePage } from "@/components/pricing/quote";
import { SEATS_RANGE, usePricing } from "@/components/pricing/state";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

// Lummi, free licence, hotlinked as the other Lummi photographs are and
// recorded in public/photos/CREDITS.md: a small studio seen through a
// fluted-glass door, a peach wall, a whiteboard of colour swatches and a
// high table ringed with stools. The room is empty, so the cards can sit
// anywhere on it.
const PHOTO =
  "https://assets.lummi.ai/assets/QmfFK1gSARnHmzmGdcX4yKsDWqTKcQX5HiZ42aUigya1uo?auto=format&w=1000";

// Lummi as well: an open office in yellow, teal and blue behind glass, shown
// on the tile over the right edge as a second of the team's rooms.
const ROOM =
  "https://assets.lummi.ai/assets/Qmcjgd3dF4p3G8JkGZDcsiM57W6uGZ3AaydcLUxLmpe4Ee?auto=format&w=400";

// The course the photograph's team is shown taking, on the card at its foot.
const taking = courseById("c13")!;

// A card on the photograph: its own white, the photograph's cast.
const overlay = cn(float, "bg-card");

/** `today` is the date the page was sent on, which the quote is dated by. */
export function TeamsSeats({ today }: { today: string }) {
  const c = teamsCopy;
  const { seats, setSeats, billing, yearly, setBilling } = usePricing();
  // What the field shows while it is typed in; the page's count moves only
  // when it holds a whole number in range.
  const [draft, setDraft] = useState<string | null>(null);
  const t = teamOf(seats, yearly);

  const commit = (raw: string) => {
    const n = Math.round(Number(raw));
    if (Number.isFinite(n) && raw.trim() !== "") setSeats(Math.min(SEATS_RANGE.max, Math.max(SEATS_RANGE.min, n)));
    setDraft(null);
  };
  const step = (by: number) => setSeats(Math.min(SEATS_RANGE.max, Math.max(SEATS_RANGE.min, seats + by)));

  const assigned = Math.max(3, seats - 2);

  return (
    <section id="teams" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="grid gap-12 rounded-lg bg-accent px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[45fr_55fr] lg:gap-8 lg:px-14 lg:py-16">
        {/* the copy column, centred on the photograph beside it */}
        <div className="flex flex-col justify-center">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">
            <Highlight>{c.heading.marked}</Highlight> {c.heading.after}
          </SectionHeading>
          <p className="mt-5 max-w-[28rem] text-base text-muted-foreground">{c.lede}</p>

          {/* The seat card: how many, billed how, and what that comes to.
              White on the band, raised, since on a tinted ground there is no
              rung above white to step to. */}
          <div data-object className="mt-9 rounded-lg bg-card p-5 shadow-soft sm:p-6">
            {/* the seats and the billing side by side wherever the card
                holds both on a line, one over the other where it does not */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start xl:flex-row xl:items-end xl:justify-between">
              <div>
                <label htmlFor="team-seats" className="text-sm text-muted-foreground">
                  {c.seats}
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    disabled={seats <= SEATS_RANGE.min}
                    aria-label={c.fewer}
                    className="flex size-10 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent disabled:cursor-not-allowed disabled:bg-accent disabled:text-muted-foreground disabled:ring-0"
                  >
                    <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                  <input
                    id="team-seats"
                    inputMode="numeric"
                    value={draft ?? String(seats)}
                    onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                    onBlur={(e) => commit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commit(e.currentTarget.value);
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        step(1);
                      }
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        step(-1);
                      }
                    }}
                    aria-describedby="team-seats-hint"
                    className="h-10 w-16 rounded-control bg-card text-center text-base tabular-nums ring-1 ring-inset ring-border outline-none transition-shadow hover:not-focus:ring-foreground/20 focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => step(1)}
                    disabled={seats >= SEATS_RANGE.max}
                    aria-label={c.more}
                    className="flex size-10 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent disabled:cursor-not-allowed disabled:bg-accent disabled:text-muted-foreground disabled:ring-0"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <TabTrack
                kind="radios"
                label="Teams billing"
                idPrefix="teams-billing"
                on="card"
                options={[
                  { id: "monthly", label: plansCopy.billing.monthly },
                  { id: "yearly", label: plansCopy.billing.yearly },
                ]}
                value={billing}
                onChange={(id) => setBilling(id)}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-t pt-5">
              <p className="text-sm text-muted-foreground tabular-nums">{c.times(seats, t.seat, yearly)}</p>
              <p className="flex items-baseline gap-2">
                <span className="font-heading text-3xl tracking-tight tabular-nums">{usd(t.total)}</span>
                <span className="text-sm text-muted-foreground">a {yearly ? "year" : "month"}</span>
              </p>
            </div>
            <p id="team-seats-hint" className="mt-3 text-sm text-muted-foreground">
              {seats >= QUOTE_FROM ? c.quote : yearly ? `${c.saved(t.savedByYear)}. ${c.seatHint}` : (
                <>
                  {c.switchYearly(t.savedByYear)}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      // the link goes as its words come true, so focus moves
                      // to the Yearly it just picked
                      setBilling("yearly");
                      requestAnimationFrame(() => document.getElementById("teams-billing-yearly")?.focus());
                    }}
                    className={cn("text-foreground underline underline-offset-4 press hover:text-muted-foreground", reach)}
                  >
                    {c.toYearly}
                  </button>
                </>
              )}
            </p>
          </div>

          {/* stacked at one width on a phone, side by side from sm */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button render={<Link href={`/contact?topic=teams&seats=${seats}`} />} size="lg" className={reach}>
              {c.talk}
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
            </Button>
            <button
              type="button"
              onClick={() =>
                download(`mentora-${quoteNumber(today, seats).toLowerCase()}.html`, quotePage({ day: today, seats, yearly }), "text/html")
              }
              className="flex h-10 items-center justify-center gap-2 rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
            >
              <HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
              {c.download}
            </button>
          </div>
        </div>

        {/* The photograph, upright in the right column, and what the team's
            admin would see laid over it: the quarter's count at the top
            corner, a second cover at a smaller scale over the right edge, two
            of the admin's lines over the left, and one course's progress at
            the foot. Each on its own white, with the photograph's cast. */}
        <div className="relative mx-auto w-full max-w-[26rem] px-4 sm:px-10 lg:max-w-none lg:px-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg sm:aspect-[5/7]">
            <Image
              src={PHOTO}
              alt={c.photoAlt}
              fill
              sizes="(min-width: 1280px) 462px, (min-width: 1024px) calc(55vw - 242px), (min-width: 640px) 336px, calc(100vw - 128px)"
              className="object-cover"
            />
          </div>

          {/* the quarter's count, over the top-left corner */}
          <div
            aria-hidden="true"
            className={cn(overlay, "absolute left-0 top-6 flex items-center gap-3 rounded-control py-2 pl-2 pr-4 sm:top-8 lg:left-4")}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-chip text-primary-ink">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={18} strokeWidth={1.8} />
            </span>
            <span className="text-sm">
              <span className="font-heading text-base tabular-nums">{c.overlays.finished.figure}</span>{" "}
              {c.overlays.finished.label}
            </span>
          </div>

          {/* a second room at a smaller scale, over the right edge, bare as
              the reference's product tile is */}
          <div
            aria-hidden="true"
            className={cn(overlay, "absolute right-0 top-[12%] hidden w-32 overflow-hidden rounded-sm p-1.5 sm:block lg:right-4 lg:w-36")}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-sm)-6px)]">
              <Image src={ROOM} alt="" fill sizes="(min-width: 1024px) 132px, 116px" className="object-cover object-[62%_50%]" />
            </div>
          </div>

          {/* two of the admin's lines, over the left edge, from sm: on a
              phone's narrower frame they would cover the table */}
          <ul aria-hidden="true" className="absolute left-0 top-[52%] hidden flex-col gap-2 sm:flex lg:left-4">
            <li className={cn(overlay, "flex items-center gap-2.5 rounded-control py-2 pl-2 pr-4 text-sm")}>
              <span className="flex size-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-white">
                <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.2} />
              </span>
              {c.overlays.sso}
            </li>
            <li className={cn(overlay, "flex items-center gap-2.5 rounded-control py-2 pl-2 pr-4 text-sm tabular-nums")}>
              <span className="size-6 rounded-full ring-1 ring-inset ring-border" />
              {c.overlays.assigned(assigned, seats)}
            </li>
          </ul>

          {/* one course's progress, over the foot */}
          <div
            aria-hidden="true"
            className={cn(overlay, "absolute inset-x-0 -bottom-5 flex items-center gap-3 rounded-lg p-2.5 pr-4 sm:inset-x-16 sm:bottom-6 lg:inset-x-24")}
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-sm">
              <Image src={taking.image} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{taking.title}</p>
              <div className="mt-1.5 flex items-center gap-2.5">
                {/* the bar from 360; under it the count alone fits */}
                <span className="hidden h-1.5 min-w-10 flex-1 overflow-hidden rounded-full bg-muted min-[360px]:block">
                  <span className="block h-full w-[70%] rounded-full bg-primary" />
                </span>
                <Caps as="span" className="shrink-0 tabular-nums">
                  {c.overlays.course.progress(Math.round(assigned * 0.7), assigned)}
                </Caps>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
