"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CheckIcon,
  SparklesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  AVERAGE_COURSE,
  compare,
  priceOf,
  tiers,
  yearlySaving,
} from "@/components/marketing/tiers";
import {
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

const icons = [Squares2X2Icon, SparklesIcon, BuildingOffice2Icon];

// In the page's own locale, not the reader's: a Vietnamese browser printed
// $1,068 as $1.068.
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function PricingSelector() {
  const [yearly, setYearly] = useState(false);
  const [picked, setPicked] = useState(1);
  const [courses, setCourses] = useState(4);

  const tier = tiers[picked];
  const price = priceOf(tier, yearly);
  const plusYearly = yearly ? tiers[1].yearly : tiers[1].monthly * 12;
  const c = compare(courses, plusYearly);
  // the row the calculator argues for: Plus, or buying course by course
  const winner = c.plusWins ? 1 : 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionHeading>
            Three ways to pay. One never renews.
          </SectionHeading>
          <p className="mt-4 max-w-[26rem] text-base text-muted-foreground">
            The AI tutor is on every plan, including the one where you buy a
            single course and never come back.
          </p>
        </div>

        {/* the month / year toggle, in the site's track */}
        <TabTrack
          kind="radios"
          label="Billing"
          idPrefix="billing"
          options={[
            { id: "monthly", label: "Monthly" },
            {
              id: "yearly",
              label: (
                <>
                  Yearly
                  <span className="text-xs text-muted-foreground">−{yearlySaving}%</span>
                </>
              ),
            },
          ]}
          value={yearly ? "yearly" : "monthly"}
          onChange={(id) => setYearly(id === "yearly")}
          className="shrink-0"
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[45fr_55fr]">
        <div className="flex flex-col gap-5">
          {/* the rows: an icon, the name and the price line; the chosen one wears the ring */}
          <ul className="flex flex-col gap-3">
            {tiers.map((t, i) => {
              const Icon = icons[i];
              const on = picked === i;
              const { amount, unit } = priceOf(t, yearly);
              return (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => setPicked(i)}
                    aria-pressed={on}
                    data-object
                    className={cn(
                      "flex w-full items-center gap-4 rounded-lg bg-card p-5 text-left ring-inset transition-[background-color,box-shadow] active:bg-accent",
                      // the chosen row takes the brand's ring, the colour of
                      // the button in the panel beside it; a row is wider
                      // than a control, so a press moves its fill
                      "aria-pressed:shadow-soft-lg aria-pressed:ring-2 aria-pressed:ring-primary aria-pressed:hover:ring-primary/70",
                      "not-aria-pressed:shadow-soft not-aria-pressed:ring-1 not-aria-pressed:ring-border not-aria-pressed:hover:shadow-soft-lg",
                    )}
                  >
                    {/* a disc, as every icon ground on the page is: a 44px
                        square at the container radius read as a circle that
                        had not made up its mind */}
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-base font-medium">{t.name}</span>
                        {t.featured && (
                          <span className="rounded-control bg-chip px-2 py-0.5 text-xs font-medium text-primary-ink">
                            Popular
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {usd(amount)} <span className="text-xs">/ {unit}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Which plan is cheaper for you, the question the sitemap asks
              this row: Per course against a year of Plus, at the toggle's
              setting. It stands under the rows it chooses between, and its
              answer is taken with one press. Teams is priced by the seat and
              stays out of the sum. On the whisper tint rather than white, so
              it reads as a tool beside the plans and not as a fourth one. */}
          <div className="rounded-lg bg-accent p-5 sm:p-6">
            <SliderRoot
              value={courses}
              onValueChange={setCourses}
              min={1}
              max={20}
              step={1}
            >
              <div className="flex items-baseline justify-between gap-3">
                <SliderLabel>Courses you expect to finish this year</SliderLabel>
                <span className="shrink-0 text-sm tabular-nums">{courses}</span>
              </div>
              <SliderControl className="mt-1">
                <SliderTrack>
                  <SliderIndicator />
                  <SliderThumb />
                </SliderTrack>
              </SliderControl>
            </SliderRoot>

            {/* the sum as two lines of a bill, one a plan, so each fits on
                a line at every width; a sentence of it broke at 390 with an
                "A" left hanging */}
            <dl className="mt-4 flex flex-col gap-1.5 text-sm">
              {[
                {
                  line: `Per course · ${courses} × ${usd(AVERAGE_COURSE)}`,
                  total: c.separately,
                  wins: !c.plusWins,
                },
                {
                  line: `Mentora Plus · ${yearly ? "billed yearly" : `12 × ${usd(tiers[1].monthly)}`}`,
                  total: c.plus,
                  wins: c.plusWins,
                },
              ].map(({ line, total, wins }) => (
                <div key={line} className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">{line}</dt>
                  <dd className={cn("tabular-nums", wins ? "font-medium" : "text-muted-foreground")}>
                    {usd(total)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-4">
              <p className="text-base">
                <span className="text-muted-foreground">Cheaper for you: </span>
                <span className="font-medium">{tiers[winner].name}</span>
                <span className="text-muted-foreground">
                  , by {usd(c.saving)}
                </span>
              </p>
              {picked === winner ? (
                <span className="flex h-10 items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="size-4" />
                  Already selected
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setPicked(winner)}
                  className="press h-10 rounded-control bg-card px-4 text-sm font-medium shadow-soft hover:shadow-soft-lg active:shadow-none"
                >
                  Select {tiers[winner].name}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* The panel: what the selected plan costs and includes. It is the
            tier itself, so its blurb and ticks are the plan's data, set at
            14 — which is what `data-object` says. It sits on the brand's
            tint, the ground the FAQ's open row takes too, rather than the
            brand at full strength, which outweighed everything else in the
            row; the full hue is left to what acts, the button here and the
            chosen row's ring. Mixed from --primary rather than
            taken from the accent palette: the palette's lime is twelve
            degrees yellower than the brand, and beside the button it read as
            a second green. Ink on it is `text-foreground` alone. */}
        <div data-object className="flex flex-col rounded-lg bg-tint p-6 text-foreground sm:p-8 lg:p-10">
          <Caps className="text-foreground">{tier.name}</Caps>
          <p className="mt-4 flex items-baseline gap-3">
            <span className="font-heading text-5xl tracking-tighter tabular-nums sm:text-6xl">
              {usd(price.amount)}
            </span>
            <span className="text-sm">/ {price.unit}</span>
          </p>
          {/* Every plan's blurb in one cell, and below every plan's ticks,
              the others unseen: the panel keeps the tallest plan's height, so
              on a phone, where it stands under the rows, nothing moves when
              a row is picked. */}
          <div className="mt-3 grid max-w-[19rem]">
            {tiers.map((t) => (
              <p
                key={t.name}
                aria-hidden={t !== tier || undefined}
                className={cn("text-sm [grid-area:1/1]", t !== tier && "invisible")}
              >
                {t.blurb}
              </p>
            ))}
          </div>

          <Button
            render={
              <Link
                // the checkout opens on the period the toggle is set to
                href={tier.href === "/checkout" && yearly ? "/checkout?billing=yearly" : tier.href}
              />
            }
            size="lg"
            className={cn("mt-6 h-12 w-full", reach)}
          >
            {tier.cta}
            <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
          </Button>
          <p className="mt-3 text-center text-sm">
            <Link
              href="/pricing#questions"
              // the underline lifts on hover: on a pastel surface the ink
              // stays `text-foreground`, so the hover cannot be a colour
              className={cn("underline underline-offset-4 hover:no-underline", reach)}
            >
              Refund within 30 days
            </Link>{" "}
            on every plan.
          </p>

          {/* the ticks stand at the foot: where the rows and the calculator
              beside the panel run taller, as they do at 1024, the air opens
              between the button and the list rather than under the list */}
          <div className="mt-auto pt-8">
            <div className="grid border-t border-foreground/10 pt-6">
              {tiers.map((x) => (
                <ul
                  key={x.name}
                  aria-hidden={x !== tier || undefined}
                  className={cn("grid content-start gap-2.5 [grid-area:1/1] sm:grid-cols-2", x !== tier && "invisible")}
                >
                  {x.ticks.map((t) => (
                    <li key={t} className="flex gap-2.5 text-sm">
                      <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
