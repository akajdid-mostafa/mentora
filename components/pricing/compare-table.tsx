"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { reach } from "@/components/reach";
import { compareCopy, groups, plansCopy, type Cell, type Feature, type PlanKey } from "@/components/pricing/copy";
import { perCourse, plus, plusHref, teams, usd } from "@/components/pricing/math";
import { usePricing } from "@/components/pricing/state";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { usePortalRoot } from "@/components/ui/portal-root";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

type View = "all" | "diff";

const same = (f: Feature) => f.cells.every((x) => x === f.cells[0]);

// Plus's column wears the brand's tint from its head to its foot, the card it
// is in the plans above, so the eye can run down it. From sm: on a phone the
// label takes a row of its own across all three, and a tint broken at every
// label would read as stripes.
const plusCol = "sm:bg-tint";

export function CompareTable() {
  const c = compareCopy;
  const { yearly } = usePricing();
  const [view, setView] = useState<View>("all");

  const plans: { key: PlanKey; name: string; amount: number; unit: string }[] = [
    { key: "single", name: perCourse.name, amount: perCourse.monthly, unit: plansCopy.plans.single.unit.monthly },
    {
      key: "plus",
      name: plus.name,
      amount: yearly ? plus.yearly : plus.monthly,
      unit: plansCopy.plans.plus.unit[yearly ? "yearly" : "monthly"],
    },
    {
      key: "teams",
      name: teams.name,
      amount: yearly ? teams.yearly : teams.monthly,
      unit: plansCopy.plans.teams.unit[yearly ? "yearly" : "monthly"],
    },
  ];

  return (
    <section id="compare" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{c.heading}</SectionHeading>
          <p className="mt-4 max-w-[34rem] text-base text-muted-foreground">{c.lede}</p>
        </div>
        <TabTrack
          kind="radios"
          label="Show"
          idPrefix="compare-view"
          options={[
            { id: "all", label: c.views.all },
            { id: "diff", label: c.views.diff },
          ]}
          value={view}
          onChange={setView}
          className="shrink-0 lg:mb-1"
        />
      </div>

      <table className="mt-12 w-full table-fixed border-separate border-spacing-0 text-left text-sm">
        <caption className="sr-only">Mentora&apos;s three plans, compared line by line</caption>
        <colgroup>
          <col className="max-sm:hidden sm:w-[32%] lg:w-[34%]" />
          <col />
          <col />
          <col />
        </colgroup>

        {/* The head stays under the site's header while the table scrolls
            past, so a line far down still says whose column is whose. */}
        <thead>
          <tr>
            <th scope="col" className="sticky top-14 z-10 border-b bg-background pb-5 align-bottom max-sm:hidden sm:top-16">
              <Caps as="span">{c.feature}</Caps>
            </th>
            {plans.map((p) => (
              <th
                key={p.key}
                scope="col"
                className={cn(
                  "sticky top-14 z-10 border-b bg-background pb-5 pr-3 pt-4 align-bottom font-normal sm:top-16 sm:px-5 sm:pt-6",
                  p.key === "plus" && cn(plusCol, "sm:rounded-t-lg"),
                )}
              >
                <span className="block text-sm font-medium sm:text-base">{p.name}</span>
                {/* the unit on a line of its own on a phone, so the three
                    heads stand the same three lines tall */}
                <span className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-1.5">
                  <span className="font-heading text-xl tracking-tight tabular-nums sm:text-2xl">{usd(p.amount)}</span>
                  <span className="text-xs text-muted-foreground">/ {p.unit}</span>
                </span>
                <HeadAction plan={p.key} yearly={yearly} />
              </th>
            ))}
          </tr>
        </thead>

        {groups.map((g) => (
          <tbody key={g.name}>
            <tr>
              <th scope="colgroup" colSpan={1} className="pb-3 pt-10 text-left max-sm:hidden">
                <Caps as="span" className="text-foreground">
                  {g.name}
                </Caps>
              </th>
              {/* on a phone the group's name spans the row */}
              <th scope="colgroup" colSpan={3} className="pb-3 pt-10 text-left sm:hidden">
                <Caps as="span" className="text-foreground">
                  {g.name}
                </Caps>
              </th>
              <td className="max-sm:hidden" />
              <td className={cn("max-sm:hidden", plusCol)} />
              <td className="max-sm:hidden" />
            </tr>

            {g.features.map((f) => {
              // Differences sinks a line that reads the same on all three
              // rather than taking it out, so the table keeps its height and
              // nothing under it moves as the view changes.
              const sunk = view === "diff" && same(f);
              const ink = cn("transition-colors", sunk && "text-muted-foreground");
              return (
                <Fragment key={f.name}>
                  {/* a phone's label row, across all three columns */}
                  <tr className="sm:hidden">
                    <th scope="colgroup" colSpan={3} className={cn("border-t pb-1 pt-4 text-left font-normal", ink)}>
                      <FeatureName feature={f} />
                    </th>
                  </tr>
                  <tr>
                    <th scope="row" className={cn("border-t py-4 pr-6 text-left align-top font-normal max-sm:hidden", ink)}>
                      <FeatureName feature={f} />
                    </th>
                    {f.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={cn(
                          // flush with the label above it on a phone
                          "pb-4 pr-3 align-top sm:border-t sm:px-5 sm:pt-4",
                          i === 1 && plusCol,
                          ink,
                        )}
                      >
                        <Value cell={cell} sunk={sunk} />
                      </td>
                    ))}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        ))}

        {/* the tint's foot, so Plus's column closes on its own corner */}
        <tfoot aria-hidden="true">
          <tr>
            <td className="h-6 border-t max-sm:hidden" />
            <td className="h-6 border-t" />
            <td className={cn("h-6 border-t", plusCol, "sm:rounded-b-lg")} />
            <td className="h-6 border-t" />
          </tr>
        </tfoot>
      </table>
    </section>
  );
}

/** A line's name, and the ⓘ beside it that opens what the line means. */
function FeatureName({ feature }: { feature: Feature }) {
  const root = usePortalRoot();
  return (
    <span className="flex items-center gap-1.5">
      <span>{feature.name}</span>
      <Popover.Root>
        <Popover.Trigger
          aria-label={compareCopy.about(feature.name)}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[popup-open]:bg-accent data-[popup-open]:text-foreground",
            "relative after:absolute after:-inset-2 after:content-['']",
          )}
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={1.6} aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Portal container={root}>
          <Popover.Positioner side="top" align="start" sideOffset={8} collisionPadding={16} className="z-50">
            <Popover.Popup
              className={cn(
                "w-72 origin-(--transform-origin) rounded-lg bg-popover p-5 text-popover-foreground shadow-soft-lg outline-none",
                "transition-[opacity,scale] duration-spring ease-spring data-ending-style:duration-answer data-ending-style:ease-answer data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 motion-reduce:transition-none",
              )}
            >
              <Popover.Title className="text-sm font-medium">{feature.name}</Popover.Title>
              <Popover.Description className="mt-2 text-sm text-muted-foreground">{feature.about}</Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </span>
  );
}

function Value({ cell, sunk }: { cell: Cell; sunk: boolean }) {
  if (cell === true)
    return (
      <span className="flex h-6 items-center">
        <HugeiconsIcon
          icon={Tick02Icon}
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={cn("transition-colors", sunk ? "text-muted-foreground" : "text-iris-ink")}
        />
        <span className="sr-only">{compareCopy.yes}</span>
      </span>
    );
  if (cell === false)
    return (
      <span className="flex h-6 items-center">
        <span aria-hidden="true" className="h-px w-3 bg-muted-foreground" />
        <span className="sr-only">{compareCopy.no}</span>
      </span>
    );
  // a line of words sits on the label's 24px line, which the ⓘ sets
  return <span className="block py-0.5">{cell}</span>;
}

/** Each plan's door, from lg where a column has room for its words. */
function HeadAction({ plan, yearly }: { plan: PlanKey; yearly: boolean }) {
  const label = plansCopy.plans[plan].cta;
  if (plan === "plus")
    return (
      <Button render={<Link href={plusHref(yearly)} />} className={cn("mt-5 hidden w-full lg:flex", reach)}>
        {label}
        <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
      </Button>
    );
  const Icon = plan === "teams" ? ArrowDownIcon : ArrowRightIcon;
  return (
    <Link
      href={plan === "teams" ? "#teams" : "/courses"}
      className="mt-5 hidden h-10 w-full items-center justify-center gap-2 rounded-control bg-card px-4 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none lg:flex"
    >
      {label}
      <Icon aria-hidden="true" className="size-4" />
    </Link>
  );
}
