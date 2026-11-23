"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  CancelCircleIcon,
  DiscountTag01Icon,
  MoneyReceiveSquareIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { teacherOf, type Course } from "@/components/course/courses";
import { dateLabel, dayLabel, type Start } from "@/components/course-page/start";
import { float } from "@/components/float";
import { tiers } from "@/components/marketing/tiers";
import { coursesOf } from "@/components/paths/paths";
import { reach } from "@/components/reach";
import { checkoutCopy } from "@/components/checkout/copy";
import { judge, suggestionFor, type Code, type Verdict } from "@/components/checkout/codes";
import { canSplit, isPaid, money, targetOf, type Billing, type Order, type Totals } from "@/components/checkout/order";
import type { Country } from "@/components/checkout/tax";
import { Caps } from "@/components/ui/caps";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

const c = checkoutCopy.order;
const k = checkoutCopy.codes;
const plus = tiers[1];

export type Sold = Exclude<Order, { kind: "missing" }>;

/** What the field under the order holds: the words typed into it (`null`
 *  until somebody types, while it rests at the code the learner was sent),
 *  the code that went on, and why the last one tried did not. */
export type CodeState = { typed: string | null; applied: Code | null; refused: Verdict | null };

export const restingCode: CodeState = { typed: null, applied: null, refused: null };

/** The sentence a refused code prints. */
function refusal(v: Verdict) {
  if (v.ok) return "";
  return {
    empty: k.empty,
    unknown: k.unknown(v.typed),
    ended: k.ended(v.typed),
    "course-only": k.courseOnly(v.typed),
    "plus-only": k.plusOnly(v.typed),
    "yearly-only": k.yearlyOnly(v.typed),
  }[v.reason];
}

const textButton = cn("text-foreground underline underline-offset-4 press hover:text-muted-foreground", reach);

/** The order as the card sets it out, top to bottom: what is in it and the
 *  one choice it carries, the code, the money, and the promise under the
 *  money. Every figure comes from `totals`, which the form's last step and the
 *  receipt read as well. */
export function OrderCard({
  order,
  totals,
  country,
  code,
  onCode,
  onStart,
  onBilling,
  split,
  onSplit,
  locked,
  doneLabel,
}: {
  order: Sold;
  totals: Totals;
  country: Country;
  code: CodeState;
  onCode: (next: CodeState) => void;
  onStart: (key: string) => void;
  onBilling: (b: Billing) => void;
  split: boolean;
  onSplit: (three: boolean) => void;
  /** While the order is being paid and once it is, nothing on it moves. */
  locked: boolean;
  /** Once the order has gone through, what happened to it: "Paid". */
  doneLabel?: string;
}) {
  const id = useId();
  // On a phone the card folds to one line and the amount due, above the
  // form, and opens on a press. From lg it is always open beside the form.
  const [open, setOpen] = useState(false);
  const target = targetOf(order);
  const offer = suggestionFor(target);
  const typed = code.typed ?? offer?.code ?? "";
  // A code applied on one order and still on after the order changed, from
  // a year of Plus to a month, is shown with the reason it no longer counts.
  const stale = code.applied ? judge(code.applied.code, target) : null;
  const refused = code.refused && !code.refused.ok ? code.refused : null;

  // A press that takes its own control off the card hands focus to what
  // took its place: the code's remove button once a code is on, the field
  // once it is off again.
  const field = useRef<HTMLInputElement>(null);
  const remove = useRef<HTMLButtonElement>(null);
  const land = useRef<"field" | "remove" | null>(null);
  useEffect(() => {
    if (land.current === "remove") remove.current?.focus();
    if (land.current === "field") field.current?.focus();
    land.current = null;
  }, [code.applied]);

  const apply = (value: string, on = target) => {
    const v = judge(value, on);
    if (v.ok) land.current = "remove";
    onCode(v.ok ? { typed: "", applied: v.code, refused: null } : { ...code, typed: value, refused: v });
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    apply(typed);
  };
  // A yearly code tried on the monthly plan moves the plan, then goes on.
  const toYearly = (value: string) => {
    onBilling("yearly");
    apply(value, "plus-yearly");
  };

  return (
    <div data-object className={cn("rounded-lg bg-card", float)}>
      {/* The fold's own row, on a phone only. No title: the photograph over
          it and the heading under it name the order, and opened, the card's
          first line does. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-body`}
        onClick={() => setOpen((o) => !o)}
        className="group/fold peer flex w-full items-center gap-3 rounded-lg px-5 py-4 text-left transition-colors active:bg-accent lg:hidden"
      >
        <Caps as="span" className="min-w-0 flex-1">
          {c.caps}
        </Caps>
        <span className="shrink-0 font-heading text-xl tracking-tight tabular-nums">{money(totals.today)}</span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control ring-1 ring-inset ring-border">
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 transition-transform group-aria-expanded/fold:rotate-180 motion-reduce:transition-none"
          />
          <span className="sr-only">{open ? checkoutCopy.summary.hide : checkoutCopy.summary.show}</span>
        </span>
      </button>

      <div id={`${id}-body`} className="border-t p-5 peer-not-aria-expanded:max-lg:hidden sm:px-6 lg:border-t-0 lg:p-7">
        <div className="flex min-h-7 items-center justify-between gap-3 max-lg:hidden">
          <Caps>{c.caps}</Caps>
          {doneLabel && (
            <span className="flex h-7 items-center gap-1.5 rounded-control bg-leaf/15 px-2.5 text-xs font-medium text-leaf-ink">
              <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} aria-hidden="true" />
              {doneLabel}
            </span>
          )}
        </div>

        {order.kind === "course" ? <CourseLine course={order.course} /> : <PlusLine billing={order.billing} />}

        {/* the one choice the order carries, set down as a line once paid */}
        {order.kind === "course" &&
          order.starts.length > 1 &&
          (doneLabel ? (
            <Fixed label={c.start} value={startLabel(order.start)} />
          ) : (
            <StartSelect starts={order.starts} value={order.start.key} onChange={onStart} disabled={locked} />
          ))}
        {order.kind === "plus" && order.path && <PathLine path={order.path} />}
        {order.kind === "plus" && !order.path && order.course && (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-primary-ink" />
            {c.includes(order.course.title)}
          </p>
        )}

        {/* The code, while there is money for it to come off: a free course
            has none, and a paid order drops the field once it is paid. */}
        {isPaid(order) && !doneLabel && (
          <div className="mt-5 border-t pt-5">
            {code.applied ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2.5 text-sm">
                    <HugeiconsIcon
                      icon={DiscountTag01Icon}
                      size={18}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground"
                    />
                    <span className="font-mono">{code.applied.code}</span>
                    <span className="truncate text-muted-foreground">{code.applied.note}</span>
                  </span>
                  {/* 36px beside the code's line, as the card rows draw their
                      icon buttons, and reached at 40 */}
                  <button
                    ref={remove}
                    type="button"
                    onClick={() => {
                      land.current = "field";
                      onCode({ typed: "", applied: null, refused: null });
                    }}
                    disabled={locked}
                    aria-label={c.remove(code.applied.code)}
                    className="relative flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground press after:absolute after:-inset-0.5 hover:bg-accent hover:text-foreground"
                  >
                    <XMarkIcon aria-hidden="true" className="size-4" />
                  </button>
                </div>
                {stale && !stale.ok && (
                  <p role="status" className="mt-1 flex flex-wrap items-baseline gap-x-3 text-sm text-destructive">
                    {refusal(stale)}
                    {stale.reason === "yearly-only" && order.kind === "plus" && (
                      <button type="button" onClick={() => onBilling("yearly")} className={textButton}>
                        {k.toYearly}
                      </button>
                    )}
                  </p>
                )}
              </>
            ) : (
              <form noValidate onSubmit={submit} className="flex flex-col gap-2">
                {/* the label's line carries what the code is while the field
                    holds the one the learner was sent, and why a code was
                    refused once one is, so neither grows the card a line */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <label htmlFor={`${id}-code`} className="text-sm">
                    {c.code}
                  </label>
                  {refused ? (
                    <p id={`${id}-code-error`} role="status" className="text-sm text-destructive">
                      {refusal(refused)}
                    </p>
                  ) : (
                    offer &&
                    typed === offer.code && (
                      <p id={`${id}-code-hint`} className="text-sm text-muted-foreground">
                        {c.offered(offer.note)}
                      </p>
                    )
                  )}
                </div>
                {/* The field and its Apply, one hairline round both: the
                    word is drawn at its text's height inside the field's
                    right end and reached at 40px, as the reference's link. */}
                <div
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-control bg-card pl-4 pr-4 ring-inset transition-shadow",
                    refused
                      ? "ring-2 ring-destructive focus-within:ring-[3px]"
                      : "ring-1 ring-border focus-within:ring-2 focus-within:ring-ring hover:not-focus-within:ring-foreground/20",
                  )}
                >
                  <input
                    ref={field}
                    id={`${id}-code`}
                    name="promo"
                    value={typed}
                    onChange={(e) => onCode({ ...code, typed: e.target.value.toUpperCase(), refused: null })}
                    placeholder={c.codePlaceholder}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    disabled={locked}
                    aria-invalid={Boolean(refused) || undefined}
                    aria-describedby={refused ? `${id}-code-error` : offer && typed === offer.code ? `${id}-code-hint` : undefined}
                    className="h-full min-w-0 flex-1 bg-transparent font-mono text-base outline-none placeholder:font-sans placeholder:text-muted-foreground sm:text-sm"
                  />
                  <button type="submit" disabled={locked} className={cn("shrink-0 text-sm font-medium press hover:text-muted-foreground", reach)}>
                    {c.apply}
                  </button>
                </div>
                {refused?.reason === "yearly-only" && order.kind === "plus" && (
                  <p className="text-sm">
                    <button type="button" onClick={() => toYearly(refused.typed)} className={textButton}>
                      {k.toYearly}
                    </button>
                  </p>
                )}
              </form>
            )}
          </div>
        )}

        <Money
          order={order}
          totals={totals}
          country={country}
          code={stale?.ok ? stale.code : null}
          split={split}
          onSplit={onSplit}
          locked={locked}
          id={id}
        />

        <p className="mt-5 flex items-center gap-2.5 border-t pt-5 text-sm text-muted-foreground">
          <HugeiconsIcon
            icon={order.kind === "plus" ? CancelCircleIcon : MoneyReceiveSquareIcon}
            size={18}
            strokeWidth={1.6}
            aria-hidden="true"
            className="shrink-0"
          />
          {order.kind === "plus" ? c.cancel : isPaid(order) ? c.refund : c.free}
        </p>
      </div>
    </div>
  );
}

/** The course as one line of the order: its title and price, and who teaches
 *  it and what it ends in on the line under them. */
function CourseLine({ course }: { course: Course }) {
  const t = teacherOf(course);
  return (
    <div className="mt-4 flex items-start justify-between gap-4 lg:mt-5">
      <div className="min-w-0">
        <p className="text-base font-medium">{course.title}</p>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {t.name} · {course.credential}
        </p>
      </div>
      <p className="shrink-0 font-heading text-xl tracking-tight tabular-nums">
        {course.price ? `$${course.price}` : c.freePrice}
      </p>
    </div>
  );
}

function PlusLine({ billing }: { billing: Billing }) {
  const yearly = billing === "yearly";
  return (
    <div className="mt-4 flex items-start justify-between gap-4 lg:mt-5">
      <div className="min-w-0">
        <p className="text-base font-medium">{c.plus}</p>
        <p className="mt-1 text-sm text-muted-foreground">{c.plusLine}</p>
      </div>
      <p className="shrink-0 text-right">
        <span className="block font-heading text-xl tracking-tight tabular-nums">
          ${yearly ? plus.yearly : plus.monthly}
        </span>
        <span className="block text-sm text-muted-foreground">{yearly ? c.perYear : c.perMonth}</span>
      </p>
    </div>
  );
}

/** A path bought on Plus: its five courses as a stack of photographs, each
 *  on an opaque ring so the one under it never shows through, and what they
 *  add up to. */
function PathLine({ path }: { path: NonNullable<Extract<Order, { kind: "plus" }>["path"]> }) {
  const list = coursesOf(path);
  const hours = path.legs.reduce((n, l) => n + l.hours, 0);
  return (
    <div className="mt-4 flex items-center gap-4 rounded-sm bg-accent p-3">
      <span className="flex shrink-0 -space-x-3">
        {list.map((x) => (
          <span key={x.id} className="relative size-10 overflow-hidden rounded-full bg-card ring-2 ring-accent">
            <Image src={x.image} alt="" fill sizes="40px" className="object-cover" />
          </span>
        ))}
      </span>
      <span className="min-w-0 text-sm">
        <span className="block truncate font-medium">{c.pathName(path.short)}</span>
        <span className="mt-0.5 block truncate text-muted-foreground">{c.path(list.length, hours)}</span>
      </span>
    </div>
  );
}

const startLabel = (s: Start) => (s.kind === "self" ? c.self : c.cohort(dayLabel(s.starts), dateLabel(s.ends)));

/** A choice the order carried, set down once the order has gone through:
 *  a control nobody can use any more reads as a fault, a line reads as a
 *  receipt. */
function Fixed({ label, value }: { label: string; value: string }) {
  return (
    <p className="mt-5 flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </p>
  );
}

/** When to start, as the course page's panel offers it: today at your own
 *  pace, or a cohort on a Monday. A full cohort stays in the list, sunk and
 *  locked, so the list still shows how quickly they go. */
function StartSelect({
  starts,
  value,
  onChange,
  disabled,
}: {
  starts: Start[];
  value: string;
  onChange: (key: string) => void;
  disabled: boolean;
}) {
  return (
    <Select
      items={Object.fromEntries(starts.map((s) => [s.key, startLabel(s)]))}
      value={value}
      onValueChange={(v) => onChange(String(v))}
      disabled={disabled}
    >
      <div className="mt-5 flex flex-col gap-2">
        <SelectFieldLabel className="text-foreground">{c.start}</SelectFieldLabel>
        <SelectTrigger size="field" className="w-full">
          <SelectValue />
        </SelectTrigger>
      </div>
      <SelectContent label={c.start}>
        <SelectGroup>
          <SelectLabel>{c.startGroup}</SelectLabel>
          {starts.map((s) => {
            const full = s.kind === "cohort" && s.left === 0;
            return (
              <SelectItem
                key={s.key}
                value={s.key}
                disabled={full}
                trailing={
                  s.kind === "cohort" ? (
                    <span className="ml-auto shrink-0 pl-4 text-xs text-muted-foreground tabular-nums">
                      {full ? c.full : c.left(s.left)}
                    </span>
                  ) : undefined
                }
              >
                {startLabel(s)}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** The money, a row a line, and the amount that matters most set largest:
 *  the total on a course, what is due today while Plus is free. A course
 *  that can be split carries the choice here, beside the sum it changes, and
 *  the line under the amount says what follows it either way, so picking one
 *  moves nothing under the card. */
function Money({
  order,
  totals,
  country,
  code,
  split,
  onSplit,
  locked,
  id,
}: {
  order: Sold;
  totals: Totals;
  country: Country;
  code: Code | null;
  split: boolean;
  onSplit: (three: boolean) => void;
  locked: boolean;
  id: string;
}) {
  const onPlus = order.kind === "plus";
  const splittable = canSplit(order);
  const rows: { label: string; value: string; mono?: boolean }[] = [];
  if (isPaid(order)) {
    rows.push({ label: onPlus ? c.plusRow(order.billing) : c.subtotal, value: money(totals.price) });
    if (code) rows.push({ label: code.code, value: money(-totals.discount), mono: true });
    rows.push({ label: country.tax ? c.tax(country.tax.name, country.tax.rate) : c.noTax, value: money(totals.tax) });
    if (onPlus && totals.charge) rows.push({ label: c.charge(dateLabel(totals.charge)), value: money(totals.total) });
    else if (splittable) rows.push({ label: c.total, value: money(totals.total) });
  }
  const big = onPlus || splittable ? { label: c.today, value: money(totals.today) } : { label: c.total, value: money(totals.total) };

  return (
    <div className="mt-5 border-t pt-5">
      {rows.length > 0 && (
        <dl className="mb-4 flex flex-col gap-2.5 border-b pb-4 text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-3">
              <dt className={r.mono ? "font-mono" : "text-muted-foreground"}>{r.label}</dt>
              <dd className="tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {splittable && !locked && (
        <TabTrack
          kind="radios"
          on="card"
          label={c.how}
          idPrefix={`${id}-split`}
          options={[
            { id: "full", label: c.inFull },
            { id: "three", label: c.inThree },
          ]}
          value={split ? "three" : "full"}
          onChange={(x) => onSplit(x === "three")}
          className="mb-4 w-full [&>button]:flex-1"
        />
      )}
      <div aria-live="polite" className="flex items-baseline justify-between gap-3">
        <p className="text-base font-medium">{big.label}</p>
        <p className="font-heading text-2xl tracking-tight tabular-nums">{big.value}</p>
      </div>
      {splittable && (
        <p className="mt-1 text-right text-sm text-muted-foreground tabular-nums">
          {totals.schedule
            ? c.then(money(totals.schedule[1].cents), dateLabel(totals.schedule[1].key), dateLabel(totals.schedule[2].key))
            : c.once}
        </p>
      )}
    </div>
  );
}
