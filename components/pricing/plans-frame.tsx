"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  CancelCircleIcon,
  MoneyReceiveCircleIcon,
  ShoppingBag01Icon,
  SparklesIcon,
  TaxesIcon,
  Tick02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { reach } from "@/components/reach";
import { plansCopy, type PlanKey } from "@/components/pricing/copy";
import { perCourse, plus, plusHref, teams, usd } from "@/components/pricing/math";
import { usePricing } from "@/components/pricing/state";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Highlight } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

// Six logoipsum marks, flattened to one ink as a logo wall
// is here (the overlap of 224's two rings knocked out to white, or the pair
// reads as one blob). Each is drawn at one optical area, about 2,000px² from
// sm, so the long wordmarks sit lower than the compact ones; the three compact
// marks are held at 28px, where area alone would stand them taller than the
// row. On a phone a column is 98px and every one steps down to fit it. `w`
// and `h` are the sm size, from each file's viewBox; `name` is read out as
// the logo's alt, the same one the home page's hirers give a shared mark.
const logos = [
  { file: "logoipsum-411", name: "Pinwheel", w: 28, h: 28, size: "h-5.5 sm:h-7" },
  { file: "logoipsum-221", name: "Northfield", w: 87, h: 22, size: "h-4.5 sm:h-5.5" },
  { file: "logoipsum-224", name: "Twin Ring", w: 42, h: 28, size: "h-5.5 sm:h-7" },
  { file: "logoipsum-317", name: "Kestrel", w: 92, h: 21, size: "h-4.25 sm:h-5.25" },
  { file: "logoipsum-332", name: "Marlow", w: 57, h: 28, size: "h-5.5 sm:h-7" },
  { file: "logoipsum-220", name: "Ostra", w: 89, h: 23, size: "h-4.5 sm:h-5.75" },
];

const promiseIcons = [MoneyReceiveCircleIcon, CancelCircleIcon, TaxesIcon];

type Plan = {
  key: PlanKey;
  name: string;
  icon: IconSvgElement;
  amount: number;
};

export function PlansFrame() {
  const c = plansCopy;
  const { billing, yearly, setBilling } = usePricing();

  const plans: Plan[] = [
    { key: "single", name: perCourse.name, icon: ShoppingBag01Icon, amount: perCourse.monthly },
    { key: "plus", name: plus.name, icon: SparklesIcon, amount: yearly ? plus.yearly : plus.monthly },
    { key: "teams", name: teams.name, icon: UserGroupIcon, amount: yearly ? teams.yearly : teams.monthly },
  ];

  return (
    <section id="plans" className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-8 sm:pt-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
          {c.title[0]} <Highlight>{c.title[1]}</Highlight>
        </h1>
        <p className="mt-6 max-w-[33rem] text-base text-muted-foreground">{c.lede}</p>
      </div>

      {/* The reference's row of customers between the headline and the
          toggle: who buys Teams, in the muted ink every logo wall here takes,
          three a row on a phone and six abreast from md. The files are drawn
          in the light half's ink, so the dark half turns them over. */}
      <div className="mx-auto mt-12 max-w-4xl">
        <Caps className="text-center">{c.logos}</Caps>
        <ul className="mt-6 grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-6 md:grid-cols-6">
          {logos.map((l) => (
            <li key={l.file} className="flex h-7 items-center">
              <Image
                src={`/logos/${l.file}.svg`}
                alt={l.name}
                width={l.w}
                height={l.h}
                className={cn("w-auto opacity-60 dark:invert", l.size)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* one billing for the whole page: the calculator, the table's head and
          the team's quote read this same toggle */}
      <div className="mt-14 flex justify-center">
        <TabTrack
          kind="radios"
          label="Billing"
          idPrefix="plans-billing"
          options={[
            { id: "monthly", label: c.billing.monthly },
            {
              id: "yearly",
              label: (
                <>
                  {c.billing.yearly}
                  <span className="text-xs text-muted-foreground">{c.billing.saving}</span>
                </>
              ),
            },
          ]}
          value={billing}
          onChange={(id) => setBilling(id)}
        />
      </div>

      {/* The frame: the three plans share one hairline and one white ground,
          and Plus stands out of it — a card of the brand's tint in the
          brand's ring, lifted past the frame's top and foot as the
          reference lifts its middle tier. Each plan takes the frame's six
          rows as a subgrid, so the prices, the lines under them and the
          ticks run level across all three whatever each one holds. */}
      <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto_1fr_auto] lg:gap-0 lg:rounded-lg lg:bg-card lg:ring-1 lg:ring-inset lg:ring-border">
        {plans.map((p) => (
          <PlanColumn key={p.key} plan={p} yearly={yearly} />
        ))}
      </div>

      <p className="mt-12 text-center text-base text-muted-foreground lg:mt-14">
        {c.teach.line}{" "}
        <Link
          href="/teach"
          className={cn(
            "whitespace-nowrap text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground",
            reach,
          )}
        >
          {c.teach.link}
        </Link>
      </p>

      {/* the reference's three reassurances, in the page's small capitals
          with a glyph each, on one line from sm */}
      <ul className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
        {c.promises.map((line, i) => (
          <li key={line} className="flex items-center gap-2.5">
            <HugeiconsIcon
              icon={promiseIcons[i]}
              size={18}
              strokeWidth={1.6}
              aria-hidden="true"
              className="text-muted-foreground"
            />
            <Caps as="span">{line}</Caps>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlanColumn({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const c = plansCopy;
  const copy = c.plans[plan.key];
  const lifted = plan.key === "plus";
  const period = yearly ? "yearly" : "monthly";

  return (
    <article
      aria-labelledby={`plan-${plan.key}`}
      data-object
      className={cn(
        "flex flex-col rounded-lg p-6 sm:p-8 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-y-0",
        lifted
          ? // the brand's tint, in the brand's ring, over the frame's edges;
            // on a surface the ink is the foreground alone
            "relative z-10 bg-tint text-foreground shadow-soft-lg ring-2 ring-inset ring-primary lg:-my-5 lg:py-13"
          : "bg-card ring-1 ring-inset ring-border lg:rounded-none lg:bg-transparent lg:ring-0",
      )}
    >
      {/* the glyph in its disc, the name, and on Plus the chip saying most
          people pick it — white, since a chip on a tinted surface is */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            lifted ? "bg-card" : "bg-accent",
          )}
        >
          <HugeiconsIcon icon={plan.icon} size={20} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h2 id={`plan-${plan.key}`} className="text-base font-medium">
          {plan.name}
        </h2>
        {lifted && (
          <span className="ml-auto rounded-control bg-card px-2.5 py-0.5 text-xs font-medium text-primary-ink">
            {c.popular}
          </span>
        )}
      </div>

      <p className="mt-8 flex items-baseline gap-2">
        <span className="font-heading text-5xl tracking-tighter tabular-nums sm:text-6xl">
          {usd(plan.amount)}
        </span>
        <Caps as="span" className={cn(lifted && "text-foreground")}>
          / {copy.unit[period]}
        </Caps>
      </p>

      <p className={cn("mt-3 text-sm", !lifted && "text-muted-foreground")}>{copy.under[period]}</p>

      <p className={cn("mt-8 border-t pt-6 text-sm font-medium", lifted && "border-foreground/10")}>
        {copy.lead}
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {copy.ticks.map((t) => (
          <li key={t} className="flex gap-3 text-sm">
            <HugeiconsIcon
              icon={Tick02Icon}
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className={cn("mt-0.5 shrink-0", lifted ? "text-foreground" : "text-iris-ink")}
            />
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-2">
        <PlanAction plan={plan.key} yearly={yearly} label={copy.cta} />
      </div>
    </article>
  );
}

function PlanAction({ plan, yearly, label }: { plan: PlanKey; yearly: boolean; label: string }) {
  // Plus is the section's one call at 44px, filled with the brand; the other
  // two are white doors at 40, one to the catalog and one down the page to
  // the team's quote.
  if (plan === "plus")
    return (
      <Button render={<Link href={plusHref(yearly)} />} size="lg" className={cn("w-full", reach)}>
        {label}
        <ArrowRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
      </Button>
    );

  const Icon = plan === "teams" ? ArrowDownIcon : ArrowRightIcon;
  return (
    <Link
      href={plan === "teams" ? "#teams" : "/courses"}
      className="flex h-10 w-full items-center justify-center gap-2 rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
    >
      {label}
      <Icon aria-hidden="true" className="size-4" />
    </Link>
  );
}
