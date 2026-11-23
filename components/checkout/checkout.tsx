"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  BookOpen01Icon,
  Calendar03Icon,
  CalendarCheckIn01Icon,
  Certificate01Icon,
  CreditCardIcon,
  GiftIcon,
  Loading03Icon,
  Mail01Icon,
  MoneyReceiveSquareIcon,
  Search01Icon,
  SquareUnlock01Icon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { courseHref, lessonHref, teacherOf } from "@/components/course/courses";
import { enroll } from "@/components/course/progress";
import { dateLabel, dayLabel, localToday } from "@/components/course-page/start";
import { learner } from "@/components/dashboard/learner";
import { download } from "@/components/learn/transcript";
import { EmptyState } from "@/components/listing/empty-state";
import { useAddressState } from "@/components/listing/use-address-state";
import { pathHref } from "@/components/marketing/goals";
import { tiers } from "@/components/marketing/tiers";
import { focusOf, photoOf } from "@/components/paths/paths";
import { reach } from "@/components/reach";
import { Breadcrumb, type Crumb } from "@/components/site/breadcrumb";
import { brandOf, cvcOf, expiryProblem, formatExpiry, formatNumber, lastFour, lengthOf, luhn, restingExpiry } from "@/components/checkout/card";
import { judge } from "@/components/checkout/codes";
import { checkoutCopy } from "@/components/checkout/copy";
import { cohortCalendar, orderNumber, receiptDate, receiptPage } from "@/components/checkout/files";
import { OrderCard, restingCode, type CodeState, type Sold } from "@/components/checkout/order-card";
import {
  addDays,
  isPaid,
  money,
  orderOf,
  readQuery,
  targetOf,
  totalsOf,
  writeQuery,
  type Billing,
  type Query,
  type Totals,
} from "@/components/checkout/order";
import { countries, countryOf } from "@/components/checkout/tax";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioTiles } from "@/components/ui/radio-tiles";
import { StepRule } from "@/components/ui/step-rule";
import { TextField } from "@/components/ui/text-field";
import { cn, hash } from "@/lib/utils";

const copy = checkoutCopy;
const plus = tiers[1];

type StepId = "you" | "gift" | "payment" | "review";

type Values = {
  email: string;
  name: string;
  country: string;
  gift: boolean;
  giftName: string;
  giftEmail: string;
  note: string;
  sendOn: string;
  method: "card" | "paypal";
  number: string;
  expiry: string;
  cvc: string;
  holder: string;
  postal: string;
  save: boolean;
  split: boolean;
  terms: boolean;
};
type Key = keyof Values;

const NOTE_MAX = 140;

/** Where every field rests: the demo learner's own details and the payment
 *  provider's public test card, so Continue and Pay work on the first press
 *  from the first step to the last. Emptying a field is how a reader sees
 *  its error. The gift's fields rest filled too, for whoever turns it on. */
function resting(today: string): Values {
  return {
    email: learner.email,
    name: learner.name,
    country: "US",
    gift: false,
    giftName: "Riley Chen",
    giftEmail: "riley.chen@example.com",
    note: "Happy birthday, Riley. Tell me what you build first.",
    sendOn: today,
    method: "card",
    number: "4242 4242 4242 4242",
    expiry: restingExpiry(today),
    cvc: "123",
    holder: learner.name,
    postal: countryOf("US").postal?.example ?? "",
    save: true,
    split: false,
    terms: true,
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Every field of a step that will not do, with the sentence it prints, in
 *  the order the step shows them, so Continue stops on the first one. */
function problemsOf(v: Values, step: StepId, today: string) {
  const e = copy.errors;
  const out: [Key, string][] = [];
  if (step === "you") {
    if (!EMAIL.test(v.email.trim())) out.push(["email", e.email]);
    if (v.name.trim().length < 2) out.push(["name", e.name]);
  }
  if (step === "gift") {
    if (v.giftName.trim().length < 2) out.push(["giftName", e.giftName]);
    if (!EMAIL.test(v.giftEmail.trim())) out.push(["giftEmail", e.giftEmail]);
    else if (v.giftEmail.trim().toLowerCase() === v.email.trim().toLowerCase()) out.push(["giftEmail", e.giftSame]);
  }
  if (step === "payment" && v.method === "card") {
    const digits = v.number.replace(/\D/g, "");
    const brand = brandOf(digits);
    if (digits.length !== lengthOf(brand)) out.push(["number", brand === "Amex" ? e.numberAmex : e.number]);
    else if (!luhn(digits)) out.push(["number", e.luhn]);
    const exp = expiryProblem(v.expiry, today);
    if (exp) out.push(["expiry", { format: e.expiry, month: e.month, past: e.past }[exp]]);
    if (v.cvc.length !== cvcOf(brand)) out.push(["cvc", e.cvc(cvcOf(brand))]);
    if (v.holder.trim().length < 2) out.push(["holder", e.holder]);
    const postal = countryOf(v.country).postal;
    if (postal && !postal.pattern.test(v.postal.trim())) out.push(["postal", e.postal(postal.label, postal.example)]);
  }
  if (step === "review" && !v.terms) out.push(["terms", copy.review.termsError]);
  return out;
}

const never = () => () => {};
/** Today on the visitor's calendar, after the server's day has hydrated. */
function useToday(server: string) {
  return useSyncExternalStore(never, localToday, () => server);
}

/** The day a gift goes out, as a sentence says it: "today", "tomorrow" or
 *  "on Thu, Oct 1". */
function sendWhen(key: string, today: string) {
  if (key === today) return "today";
  if (key === addDays(today, 1)) return "tomorrow";
  return `on ${dayLabel(key)}`;
}
/** The same day as a list names it: "Today", "Tomorrow", "Thu, Oct 1". */
function sendName(key: string, today: string) {
  if (key === today) return copy.you.today;
  if (key === addDays(today, 1)) return copy.you.tomorrow;
  return dayLabel(key);
}

/** What the success screen and the receipt print, taken at the moment of
 *  paying so nothing changed after it can move them. */
type Receipt = {
  number: string;
  day: string;
  order: Sold;
  totals: Totals;
  v: Values;
  gift: boolean;
};

/** A panel stacked with its neighbours in one cell, shown or hidden. With no
 *  transition, so a panel shown in the same moment it is focused is not
 *  still hidden to the browser while one runs: the reduced-motion rule
 *  gives every element a transition of its own. */
const stacked = (on: boolean) => cn("[grid-area:1/1] transition-none", !on && "invisible");

export function Checkout({ today: serverToday }: { today: string }) {
  const today = useToday(serverToday);
  const id = useId();
  const [query, setQuery] = useAddressState(readQuery, writeQuery);
  const order = orderOf(query, today);

  const [v, setV] = useState<Values>(() => resting(serverToday));
  const [code, setCode] = useState<CodeState>(restingCode);
  const [at, setAt] = useState(0);
  const [shown, setShown] = useState<Key[]>([]);
  const [state, setState] = useState<"form" | "paying" | "done">("form");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const land = useRef<"first" | "done" | null>(null);
  const doneHeading = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const sold = order.kind === "missing" ? null : order;
  const paid = sold ? isPaid(sold) : false;
  const giftable = sold?.kind === "course" && paid;
  const gift = giftable && v.gift;
  // The steps a reader walks, and the panels drawn: a course that could be a
  // gift always draws the gift's panel, so turning the gift on adds a step
  // to the rule without making the form any taller.
  const steps: StepId[] = ["you", ...(gift ? ["gift" as const] : []), ...(paid ? ["payment" as const] : []), "review"];
  const panels: StepId[] = ["you", ...(giftable ? ["gift" as const] : []), ...(paid ? ["payment" as const] : []), "review"];
  const step = steps[Math.min(at, steps.length - 1)];
  const country = countryOf(v.country);
  const locked = state !== "form";
  const done = state === "done";

  // The code on the order, counted only while it suits it.
  const totals = sold
    ? totalsOf(sold, {
        code: code.applied && judge(code.applied.code, targetOf(sold)).ok ? code.applied : null,
        country,
        split: v.split,
        today,
      })
    : null;

  useEffect(() => {
    if (land.current === "done") doneHeading.current?.focus();
    if (land.current === "first") {
      document.querySelector<HTMLElement>(`[data-step="${step}"] :is(input, button[aria-checked=true])`)?.focus();
    }
    land.current = null;
  }, [step, state]);

  const set = <K extends Key>(k: K, value: Values[K]) => setV((was) => ({ ...was, [k]: value }));
  const errorOf = (k: Key) => {
    if (!shown.includes(k)) return undefined;
    return problemsOf(v, step, today).find(([key]) => key === k)?.[1];
  };

  const goTo = (i: number) => {
    if (locked || i >= at) return;
    setShown([]);
    land.current = "first";
    setAt(i);
  };

  const next = () => {
    if (!sold || locked) return;
    const bad = problemsOf(v, step, today);
    if (bad.length) {
      setShown(bad.map(([k]) => k));
      document.getElementById(`${id}-${bad[0][0]}`)?.focus();
      return;
    }
    setShown([]);
    if (at < steps.length - 1) {
      setAt(at + 1);
      return;
    }
    pay(sold);
  };

  const pay = (o: Sold) => {
    if (!totals) return;
    setState("paying");
    const day = localToday();
    const snapshot = { day, order: o, totals, v, gift };
    const wait = paid && v.method === "paypal" ? 2200 : 1300;
    timer.current = window.setTimeout(() => {
      // The course goes on the buyer's record, so the player opens every
      // lesson and the dashboard lists it. A gift goes to somebody else.
      if (o.kind === "course" && !gift) enroll(o.course.id);
      // numbered at the moment it went through, as a payment provider would
      setReceipt({ ...snapshot, number: orderNumber(day, hash(`${v.email}${Date.now()}`)) });
      land.current = "done";
      setState("done");
    }, wait);
  };

  const onStart = (key: string) => setQuery((q) => ({ ...q, start: key }));
  const onBilling = (b: Billing) => setQuery((q) => ({ ...q, billing: b === "monthly" ? undefined : b }));

  if (!sold || !totals) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8">
        <Breadcrumb trail={[{ label: copy.crumbs.courses, href: "/courses" }, { label: copy.crumbs.checkout }]} />
        <h1 className="mt-6 text-3xl tracking-tighter sm:text-4xl">{copy.crumbs.checkout}</h1>
        <EmptyState icon={Search01Icon} title={copy.missing.title} text={copy.missing.text(order.kind === "missing" ? order.slug : "")}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/courses" />}>
              {copy.missing.browse}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline" render={<Link href="/checkout" />}>
              {copy.missing.plus}
            </Button>
          </div>
        </EmptyState>
      </section>
    );
  }

  const head = headOf(sold);
  const photo = photoOfOrder(sold);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8">
      <Breadcrumb trail={head.trail} />

      {/* The reference's one card split by a seam: the order on the tinted
          half, the form on the white one. */}
      <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-lg ring-1 ring-border lg:grid-cols-2 xl:grid-cols-[45fr_55fr] [&>*]:min-w-0">
        <div className="relative bg-accent">
          {/* The order's photograph opens the half, and the card laps its
              foot, so what is being bought is the first thing in view. */}
          <div className="relative aspect-[2/1] bg-muted sm:aspect-[5/2] lg:aspect-[2/1]">
            <Image
              src={photo.src}
              alt=""
              fill
              preload
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 50vw, 100vw"
              className={cn("object-cover", photo.focus)}
            />
          </div>
          <div className="relative -mt-12 px-4 pb-4 sm:-mt-20 sm:px-8 sm:pb-8 lg:-mt-32 lg:px-10 lg:pb-10 xl:px-12">
            <OrderCard
              order={sold}
              totals={totals}
              country={country}
              code={code}
              onCode={setCode}
              onStart={onStart}
              onBilling={onBilling}
              split={v.split}
              onSplit={(three) => set("split", three)}
              locked={locked}
              doneLabel={done && receipt ? copy.done.caps[kindOf(receipt)] : undefined}
            />
            {!locked && <Offer order={sold} query={query} onSwitch={setQuery} />}
          </div>
        </div>

        {/* The form and the finished order share one cell, and the steps
            share one frame inside the form, so the block keeps one height
            and the buttons under the steps never move on Continue. The block
            sits in the middle of the half, as the reference centres its
            fields in theirs. What is not showing is inert. */}
        <div className="grid grid-cols-1 content-center bg-card px-4 py-10 sm:px-12 sm:py-12 lg:px-10 xl:px-16">
          <form
            noValidate
            inert={done}
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className={cn("mx-auto w-full max-w-md", stacked(!done))}
          >
            {/* The page's heading opens the form it names, as the reference
                runs its fields from the top of the white half. */}
            <h1 className="text-3xl tracking-tighter text-balance sm:text-4xl">{head.title}</h1>
            <p className="mt-3 text-base text-muted-foreground">{head.lede}</p>
            <StepRule steps={steps.map((s) => copy.steps[s])} current={at} onPick={goTo} locked={locked} className="mt-8" />

            <fieldset disabled={locked} className="mt-8 grid min-w-0 grid-cols-1">
              <legend className="sr-only">{copy.steps[step]}</legend>
              {panels.map((s) => (
                <div
                  key={s}
                  data-step={s}
                  inert={s !== step}
                  className={cn("flex min-w-0 flex-col gap-5", stacked(s === step))}
                >
                  {s === "you" && <YouStep id={id} v={v} set={set} error={errorOf} giftable={giftable} order={sold} onBilling={onBilling} />}
                  {s === "gift" && <GiftStep id={id} v={v} set={set} error={errorOf} today={today} />}
                  {s === "payment" && <PaymentStep id={id} v={v} set={set} error={errorOf} order={sold} totals={totals} />}
                  {s === "review" && (
                    <ReviewStep
                      id={id}
                      v={v}
                      set={set}
                      error={errorOf}
                      order={sold}
                      totals={totals}
                      gift={gift}
                      steps={steps}
                      today={today}
                      onEdit={goTo}
                    />
                  )}
                </div>
              ))}
            </fieldset>

            <div className="mt-9 flex items-center gap-3">
              {at > 0 && (
                // on a phone the arrow alone, so Pay keeps its whole label
                // beside it at 320
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={locked}
                  onClick={() => goTo(at - 1)}
                  className="max-sm:size-11 max-sm:px-0!"
                >
                  <ArrowLeftIcon data-icon="inline-start" />
                  <span className="max-sm:sr-only">{copy.buttons.back}</span>
                </Button>
              )}
              {/* The page's one call to action, at the large height. It keeps
                  its full ink while the order goes through: it stops taking
                  presses rather than fading. */}
              <Button type="submit" size="lg" aria-disabled={locked || undefined} className={cn("flex-1", locked && "pointer-events-none")}>
                {state === "paying" ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      data-icon="inline-start"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    {busyLabel(sold, v)}
                  </>
                ) : (
                  <>
                    {labelOf(sold, step, v, totals)}
                    {step !== "review" && <ArrowRightIcon data-icon="inline-end" />}
                  </>
                )}
              </Button>
            </div>
          </form>

          <div inert={!done} className={cn("mx-auto w-full max-w-md", stacked(done))}>
            {receipt && <Done receipt={receipt} headingRef={doneHeading} country={country.name} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The trail, the heading and the lede the order is sold under. */
function headOf(o: Sold): { trail: Crumb[]; title: string; lede: string } {
  const h = copy.heading;
  const l = copy.lede;
  const checkout = { label: copy.crumbs.checkout };
  if (o.kind === "course") {
    const trail = [{ label: copy.crumbs.courses, href: "/courses" }, { label: o.course.title, href: courseHref(o.course) }, checkout];
    const lede = !isPaid(o) ? l.free : o.start.kind === "cohort" ? l.cohort(dayLabel(o.start.starts)) : l.self;
    return { trail, title: h.course(o.course.title), lede };
  }
  const price = o.billing === "yearly" ? `$${plus.yearly}` : `$${plus.monthly}`;
  const unit = o.billing === "yearly" ? "year" : "month";
  if (o.path) {
    return {
      trail: [{ label: o.path.short, href: pathHref(o.path) }, checkout],
      title: h.path(o.path.short),
      lede: l.path(o.path.legs.length, price, unit),
    };
  }
  const trail = o.course
    ? [{ label: copy.crumbs.courses, href: "/courses" }, { label: o.course.title, href: courseHref(o.course) }, checkout]
    : [{ label: copy.crumbs.pricing, href: "/pricing" }, checkout];
  return { trail, title: h.plus, lede: l.plus(price, unit) };
}

// Unsplash, free licence, hotlinked like the course photographs: a clock and
// a succulent on a white desk, for Plus alone.
const PLUS_PHOTO =
  "https://images.unsplash.com/photo-1679165806491-56e5f18d60a6?auto=format&fit=crop&w=1600&q=80";

/** The photograph the order opens on: the course's, the path's, or for Plus
 *  alone a clock on a desk, the time Plus leaves free for any course. */
function photoOfOrder(o: Sold): { src: string; focus?: string } {
  if (o.kind === "course") return { src: o.course.image };
  if (o.path) return { src: photoOf(o.path), focus: focusOf(o.path) };
  if (o.course) return { src: o.course.image };
  // the card laps the frame's lower half, so the frame shows the photograph's
  // foot and the clock's face stands clear of the card
  return { src: PLUS_PHOTO, focus: "object-[50%_85%] lg:object-bottom" };
}

/** What the form's one button says on each step. */
function labelOf(o: Sold, step: StepId, v: Values, totals: Totals) {
  const b = copy.buttons;
  if (step !== "review") return b.next;
  if (!isPaid(o)) return b.free;
  if (o.kind === "plus") return b.trial;
  if (v.method === "paypal") return b.paypal;
  return totals.schedule ? b.payToday(money(totals.today)) : b.pay(money(totals.total));
}

function busyLabel(o: Sold, v: Values) {
  const b = copy.buttons;
  if (!isPaid(o)) return b.enrolling;
  if (o.kind === "plus") return b.starting;
  return v.method === "paypal" ? b.approving : b.paying;
}

type StepProps = {
  id: string;
  v: Values;
  set: <K extends Key>(k: K, value: Values[K]) => void;
  error: (k: Key) => string | undefined;
};

function YouStep({
  id,
  v,
  set,
  error,
  giftable,
  order,
  onBilling,
}: StepProps & { giftable: boolean; order: Sold; onBilling: (b: Billing) => void }) {
  const y = copy.you;
  const field = (k: Key) => `${id}-${k}`;
  return (
    <>
      <TextField
        id={field("email")} name="email"
        label={y.email}
        type="email"
        value={v.email}
        onChange={(x) => set("email", x)}
        error={error("email")}
        hint={y.emailHint}
        autoComplete="email"
        spellCheck={false}
      />
      <TextField id={field("name")} name="name" label={y.name} value={v.name} onChange={(x) => set("name", x)} error={error("name")} autoComplete="name" />
      <Select
        name="country"
        items={Object.fromEntries(countries.map((c) => [c.code, c.name]))}
        value={v.country}
        onValueChange={(x) => {
          const next = countryOf(String(x));
          set("country", next.code);
          // the postal code the card step asks for rests at one that fits
          set("postal", next.postal?.example ?? "");
        }}
      >
        <div className="flex flex-col gap-2">
          <SelectFieldLabel className="text-foreground">{y.country}</SelectFieldLabel>
          <SelectTrigger id={field("country")} size="field" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <p className="text-sm text-muted-foreground">{y.countryHint}</p>
        </div>
        <SelectContent label={y.country}>
          <SelectGroup>
            <SelectLabel>{y.country}</SelectLabel>
            {countries.map((c) => (
              <SelectItem
                key={c.code}
                value={c.code}
                trailing={
                  c.tax ? (
                    <span className="ml-auto shrink-0 pl-4 text-xs text-muted-foreground tabular-nums">
                      {c.tax.name} {c.tax.rate}%
                    </span>
                  ) : undefined
                }
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* The order's own question: who a course is for, or how often Plus
          is billed, which is the one decision a subscription asks for. */}
      {order.kind === "plus" && (
        <RadioTiles
          label={y.plan}
          labelId={`${id}-plan-label`}
          name="billing"
          value={order.billing}
          onChange={(b) => onBilling(b === "yearly" ? "yearly" : "monthly")}
          options={[
            { id: "monthly", icon: Calendar03Icon, title: y.monthly, line: y.monthlyLine },
            { id: "yearly", icon: CalendarCheckIn01Icon, title: y.yearly, line: y.yearlyLine },
          ]}
        />
      )}
      {giftable && (
        <RadioTiles
          label={y.for}
          labelId={`${id}-for-label`}
          name="for"
          value={v.gift ? "gift" : "me"}
          onChange={(x) => set("gift", x === "gift")}
          options={[
            { id: "me", icon: UserIcon, title: y.me, line: y.meLine },
            { id: "gift", icon: GiftIcon, title: y.gift, line: y.giftLine },
          ]}
        />
      )}
    </>
  );
}

function GiftStep({ id, v, set, error, today }: StepProps & { today: string }) {
  const y = copy.you;
  const field = (k: Key) => `${id}-${k}`;
  // The next fortnight, today first, for the day the gift arrives.
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={field("giftName")} name="giftName" label={y.giftName} value={v.giftName} onChange={(x) => set("giftName", x)} error={error("giftName")} autoComplete="off" />
        <TextField
          id={field("giftEmail")} name="giftEmail"
          label={y.giftEmail}
          type="email"
          value={v.giftEmail}
          onChange={(x) => set("giftEmail", x)}
          error={error("giftEmail")}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <TextField
        id={field("note")} name="note"
        label={y.note}
        value={v.note}
        onChange={(x) => set("note", x.slice(0, NOTE_MAX))}
        aside={y.optional}
        hint={y.noteLeft(NOTE_MAX - v.note.length)}
        maxLength={NOTE_MAX}
        multiline
      />
      <Select name="sendOn" items={Object.fromEntries(days.map((d) => [d, sendName(d, today)]))} value={v.sendOn} onValueChange={(x) => set("sendOn", String(x))}>
        <div className="flex flex-col gap-2">
          <SelectFieldLabel className="text-foreground">{y.sendOn}</SelectFieldLabel>
          <SelectTrigger id={field("sendOn")} size="field" className="w-full">
            <SelectValue />
          </SelectTrigger>
        </div>
        <SelectContent label={y.sendOn}>
          <SelectGroup>
            <SelectLabel>{y.sendOn}</SelectLabel>
            {days.map((d) => (
              <SelectItem key={d} value={d}>
                {sendName(d, today)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

function PaymentStep({ id, v, set, error, order, totals }: StepProps & { order: Sold; totals: Totals }) {
  const p = copy.payment;
  const field = (k: Key) => `${id}-${k}`;
  const brand = brandOf(v.number.replace(/\D/g, ""));
  const postal = countryOf(v.country).postal;
  const card = v.method === "card";
  return (
    <>
      <RadioTiles
        label={p.with}
        labelId={`${id}-with-label`}
        name="method"
        value={v.method}
        onChange={(m) => set("method", m === "paypal" ? "paypal" : "card")}
        options={[
          { id: "card", icon: CreditCardIcon, title: p.card, line: p.cardLine },
          { id: "paypal", icon: Wallet01Icon, title: p.paypal, line: p.paypalLine },
        ]}
      />

      {/* The card's fields and PayPal's note in one frame, so moving between
          them moves nothing under it. */}
      <div className="grid min-w-0 grid-cols-1">
        <div inert={!card} className={cn("flex min-w-0 flex-col gap-5", stacked(card))}>
          <TextField
            id={field("number")} name="number"
            label={p.number}
            value={v.number}
            onChange={(x) => set("number", formatNumber(x))}
            error={error("number")}
            autoComplete="cc-number"
            inputMode="numeric"
            spellCheck={false}
            leading={<HugeiconsIcon icon={CreditCardIcon} size={20} strokeWidth={1.6} />}
            aside={brand}
          />
          <div className="grid grid-cols-2 gap-5">
            <TextField
              id={field("expiry")} name="expiry"
              label={p.expiry}
              value={v.expiry}
              onChange={(x) => set("expiry", formatExpiry(x))}
              error={error("expiry")}
              placeholder={p.expiryPlaceholder}
              autoComplete="cc-exp"
              inputMode="numeric"
            />
            <TextField
              id={field("cvc")} name="cvc"
              label={p.cvc}
              value={v.cvc}
              onChange={(x) => set("cvc", x.replace(/\D/g, "").slice(0, cvcOf(brand)))}
              error={error("cvc")}
              autoComplete="cc-csc"
              inputMode="numeric"
              hint={p.cvcHint(cvcOf(brand))}
            />
          </div>
          {/* side by side from 360; at 320 the name would be cut to its first
              five letters beside a postal code, so each takes the line */}
          <div className={cn("grid gap-5", postal && "min-[360px]:grid-cols-[minmax(0,1fr)_8rem]")}>
            <TextField id={field("holder")} name="holder" label={p.holder} value={v.holder} onChange={(x) => set("holder", x)} error={error("holder")} autoComplete="cc-name" />
            {postal && (
              <TextField
                id={field("postal")} name="postal"
                label={postal.label}
                value={v.postal}
                onChange={(x) => set("postal", x.toUpperCase())}
                error={error("postal")}
                autoComplete="postal-code"
              />
            )}
          </div>
          {order.kind === "plus" && totals.charge ? (
            <p className="text-sm text-muted-foreground">{p.trialNote(dateLabel(totals.charge))}</p>
          ) : (
            <Checkbox id={field("save")} name="save" checked={v.save} onChange={(x) => set("save", x)}>
              {p.save}
            </Checkbox>
          )}
        </div>
        <p inert={card} className={cn("flex h-fit gap-3 rounded-sm bg-accent p-4 text-sm", stacked(!card))}>
          <HugeiconsIcon icon={Wallet01Icon} size={20} strokeWidth={1.6} aria-hidden="true" className="shrink-0 text-muted-foreground" />
          {order.kind === "plus" && totals.charge
            ? p.paypalTrial(money(totals.total), dateLabel(totals.charge))
            : p.paypalNote(money(totals.today))}
        </p>
      </div>
    </>
  );
}

function ReviewStep({
  id,
  v,
  set,
  error,
  order,
  totals,
  gift,
  steps,
  today,
  onEdit,
}: StepProps & { order: Sold; totals: Totals; gift: boolean; steps: StepId[]; today: string; onEdit: (i: number) => void }) {
  const r = copy.review;
  const brand = brandOf(v.number.replace(/\D/g, ""));
  const rows: { label: string; value: string; detail: string; step: StepId }[] = [
    { label: r.you, value: v.name, detail: `${v.email} · ${countryOf(v.country).name}`, step: "you" },
  ];
  if (gift) rows.push({ label: r.gift, value: r.giftTo(v.giftName), detail: r.giftWhen(v.giftEmail, sendName(v.sendOn, today)), step: "gift" });
  if (steps.includes("payment")) {
    const method = v.method === "paypal" ? r.paypal : brand ? r.card(brand, lastFour(v.number)) : r.anyCard(lastFour(v.number));
    const how = order.kind === "plus" ? copy.order.charge(dateLabel(totals.charge ?? today)) : totals.schedule ? r.inThreeLine(money(totals.today)) : r.inFull;
    rows.push({ label: r.payment, value: method, detail: how, step: "payment" });
  }

  return (
    <>
      {/* Each row names what was entered, says it back and offers the step
          again. On a phone the answer takes the line with Edit and wraps
          whole rather than losing its end, and the row's name is left to a
          screen reader: the answer says which it is, and a line for the name
          made the gift's review the tallest step. From sm the three stand in
          columns. */}
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-b py-3.5 first:pt-0 sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
          >
            <dt className="text-sm text-muted-foreground max-sm:sr-only">{row.label}</dt>
            <dd className="text-sm [overflow-wrap:anywhere]">
              <span className="block sm:truncate">{row.value}</span>
              <span className="mt-0.5 block text-muted-foreground sm:truncate">{row.detail}</span>
            </dd>
            <dd>
              <button
                type="button"
                onClick={() => onEdit(steps.indexOf(row.step))}
                aria-label={r.editLabel(row.label)}
                className={cn("text-sm underline underline-offset-4 press hover:text-muted-foreground", reach)}
              >
                {r.edit}
              </button>
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <Caps>{r.next}</Caps>
        <ol className="relative mt-4 flex flex-col gap-4 before:absolute before:top-4 before:bottom-4 before:left-[1.125rem] before:w-px before:bg-border before:content-['']">
          {timelineOf(order, totals, v, gift, today).map((t) => (
            <li key={t.text} className="relative flex items-center gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card ring-1 ring-inset ring-border">
                <HugeiconsIcon icon={t.icon} size={18} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="text-sm">{t.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* in the timeline's columns: the box centred under the 36px discs
          and the sentence starting where theirs do, 8 + 20 + 22 = 36 + 14 */}
      <Checkbox
        id={`${id}-terms`} name="terms"
        checked={v.terms}
        onChange={(x) => set("terms", x)}
        error={error("terms")}
        className="gap-[1.375rem] pl-2"
      >
        {r.terms}{" "}
        <Link href="/about#terms" className="underline underline-offset-4 hover:text-muted-foreground">
          {r.termsLink}
        </Link>{" "}
        {r.termsTail}
      </Checkbox>
    </>
  );
}

/** What the last step says will happen once the button is pressed, in the
 *  order it happens. */
function timelineOf(o: Sold, totals: Totals, v: Values, gift: boolean, today: string): { icon: IconSvgElement; text: string }[] {
  const t = copy.timeline;
  if (o.kind === "plus") {
    const charge = totals.charge ?? today;
    return [
      { icon: SquareUnlock01Icon, text: t.trialToday },
      { icon: Mail01Icon, text: t.trialReminder(dateLabel(addDays(charge, -2))) },
      { icon: CreditCardIcon, text: t.trialCharge(dateLabel(charge), money(totals.total)) },
    ];
  }
  if (!isPaid(o)) {
    return [
      { icon: BookOpen01Icon, text: t.free },
      { icon: Certificate01Icon, text: t.certificate(o.course.credential) },
    ];
  }
  if (gift) {
    return [
      { icon: GiftIcon, text: t.gift(v.giftName.trim().split(" ")[0] || v.giftName, sendWhen(v.sendOn, today)) },
      { icon: MoneyReceiveSquareIcon, text: t.refund(money(totals.total)) },
    ];
  }
  const list: { icon: IconSvgElement; text: string }[] = [
    o.start.kind === "cohort" ? { icon: Calendar03Icon, text: t.cohort(dayLabel(o.start.starts)) } : { icon: BookOpen01Icon, text: t.lesson },
  ];
  if (totals.schedule) {
    list.push({ icon: CreditCardIcon, text: t.split(dateLabel(totals.schedule[1].key), dateLabel(totals.schedule[2].key), money(totals.schedule[1].cents)) });
  }
  list.push({ icon: Certificate01Icon, text: t.certificate(o.course.credential) });
  list.push({ icon: MoneyReceiveSquareIcon, text: t.refund(money(totals.total)) });
  return list;
}

/** The other way to buy what is in the order, under the card: every course
 *  on Plus instead of the one, or the one alone instead of Plus. The offer
 *  on the left and the switch at the row's far end, which falls under it
 *  where the card is narrow. Both offers are one element, so the switch
 *  keeps focus when the order it made brings up the other. */
function Offer({ order, query, onSwitch }: { order: Sold; query: Query; onSwitch: (to: Query) => void }) {
  const o = copy.order;
  const offer =
    order.kind === "course" && isPaid(order)
      ? { line: o.toPlus.line, button: o.toPlus.button, to: { ...query, plan: "plus" as const } }
      : order.kind === "plus" && order.course && order.course.price > 0 && !order.path
        ? { line: o.alone.line(order.course.title, `$${order.course.price}`), button: o.alone.button, to: { course: query.course, start: query.start } }
        : null;
  if (!offer) return null;
  // both labels in one cell, the one not in use hidden, so the switch keeps
  // one width whichever it says
  const labels = [o.toPlus.button, o.alone.button];
  return (
    <p className="mt-5 flex flex-col items-start gap-1 px-1 text-sm xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-baseline xl:gap-x-4">
      <span className="text-muted-foreground">{offer.line}</span>
      <button
        type="button"
        onClick={() => onSwitch(offer.to)}
        className={cn("grid shrink-0 underline underline-offset-4 press hover:text-muted-foreground", reach)}
      >
        {labels.map((l) => (
          <span key={l} aria-hidden={l !== offer.button || undefined} className={cn("[grid-area:1/1]", l !== offer.button && "invisible")}>
            {l}
          </span>
        ))}
      </button>
    </p>
  );
}

/** What the finished order was, for the chip on the card and the line over
 *  the success heading. */
function kindOf(r: Receipt) {
  return r.order.kind === "plus" ? "plus" : r.gift ? "gift" : isPaid(r.order) ? "course" : "free";
}

/** The finished order: what went through, the receipt to keep, and the way
 *  on to what was bought. */
function Done({ receipt, headingRef, country }: { receipt: Receipt; headingRef: RefObject<HTMLSpanElement | null>; country: string }) {
  const d = copy.done;
  const { order, totals, v, gift, number, day } = receipt;
  const brand = brandOf(v.number.replace(/\D/g, ""));
  const paidWith = !isPaid(order)
    ? ""
    : v.method === "paypal"
      ? copy.review.paypal
      : brand
        ? copy.review.card(brand, lastFour(v.number))
        : copy.review.anyCard(lastFour(v.number));

  const kind = kindOf(receipt);
  const giftFirst = v.giftName.trim().split(" ")[0] || v.giftName;
  const cohort = order.kind === "course" && order.start.kind === "cohort" ? order.start : null;
  const heading =
    kind === "plus" ? d.heading.plus(learner.first) : kind === "gift" ? d.heading.gift(giftFirst, sendWhen(v.sendOn, day)) : d.heading.course(learner.first);
  const lede =
    kind === "plus"
      ? d.lede.plus(dateLabel(totals.charge ?? day))
      : kind === "gift"
        ? d.lede.gift(giftFirst, v.giftEmail, v.email, v.sendOn === day)
        : kind === "free"
          ? d.lede.free()
          : cohort
            ? d.lede.cohort(v.email, dayLabel(cohort.starts))
            : d.lede.course(v.email);

  const rows: { label: string; value: ReactNode }[] = [
    { label: d.order, value: <span className="font-mono">{number}</span> },
    { label: d.date, value: receiptDate(day) },
  ];
  if (isPaid(order)) {
    rows.push({ label: d.paid, value: `${money(totals.today)} · ${paidWith}` });
    if (totals.schedule) {
      rows.push({ label: d.nextPayments, value: `${money(totals.schedule[1].cents)} on ${dateLabel(totals.schedule[1].key)} and ${dateLabel(totals.schedule[2].key)}` });
    }
    if (totals.charge) rows.push({ label: d.firstCharge, value: `${money(totals.total)} on ${dateLabel(totals.charge)}` });
  }

  const saveReceipt = () => {
    const title = order.kind === "course" ? order.course.title : order.path ? `${plus.name}, ${order.path.short} path` : plus.name;
    const detail =
      order.kind === "course"
        ? `${order.course.credential} with ${teacherOf(order.course).name}. ${
            cohort ? `Cohort from ${dayLabel(cohort.starts)} to ${dateLabel(cohort.ends)}.` : "Self-paced, from today."
          }${gift ? ` A gift for ${v.giftName}, sent ${sendName(v.sendOn, day).toLowerCase()}.` : ""}`
        : `${order.billing === "yearly" ? "Yearly" : "Monthly"} plan, seven days free.`;
    const lines = [{ label: copy.order.subtotal, value: money(totals.price) }];
    if (totals.discount) lines.push({ label: "Discount", value: money(-totals.discount) });
    lines.push({ label: "Tax", value: money(totals.tax) });
    lines.push({ label: copy.order.total, value: money(totals.total) });
    const page = receiptPage({
      number,
      day,
      buyer: [v.name, v.email, country],
      item: { title, detail },
      lines,
      totals,
      paidWith: paidWith || "nothing, the course is free",
      footer: "Ask within 30 days and we refund a course in full. Plus cancels in one click from your account.",
    });
    download(`mentora-receipt-${number}.html`, page, "text/html");
  };

  const saveCalendar = () => {
    if (!cohort || order.kind !== "course") return;
    const ics = cohortCalendar({
      id: order.course.id,
      title: order.course.title,
      teacher: teacherOf(order.course).name,
      starts: cohort.starts,
      ends: cohort.ends,
      url: new URL(courseHref(order.course), window.location.origin).toString(),
    });
    download(`${order.course.id}-cohort-${cohort.key}.ics`, ics, "text/calendar");
  };

  const primary =
    order.kind === "course"
      ? gift
        ? { href: courseHref(order.course), label: d.course }
        : { href: lessonHref(order.course), label: d.start }
      : order.path
        ? { href: pathHref(order.path), label: d.openPath(order.path.short) }
        : order.course
          ? { href: lessonHref(order.course), label: d.start }
          : { href: "/courses", label: d.browse };

  return (
    <div>
      <Caps>{d.caps[kind]}</Caps>
      <h2 className="mt-4 text-3xl tracking-tighter sm:text-4xl">
        <span ref={headingRef} tabIndex={-1} className="outline-none">
          {heading}
        </span>
      </h2>
      <p aria-live="polite" className="mt-3 text-base text-muted-foreground">
        <span className="sm:block">{lede[0]}</span> <span className="sm:block">{lede[1]}</span>
      </p>

      <dl className="mt-8 flex flex-col gap-3 rounded-sm bg-accent p-5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">{r.label}</dt>
            <dd className="min-w-0 text-right tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3">
        <Button size="lg" render={<Link href={primary.href} />}>
          {primary.label}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <div className="grid gap-3 sm:grid-cols-2">
          {cohort && !gift ? (
            <Button variant="outline" onClick={saveCalendar}>
              <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.6} aria-hidden="true" data-icon="inline-start" />
              {d.calendar}
            </Button>
          ) : (
            <Button variant="outline" render={<Link href="/dashboard" />}>
              {d.dashboard}
            </Button>
          )}
          {isPaid(order) ? (
            <Button variant="outline" onClick={saveReceipt}>
              {d.download}
            </Button>
          ) : (
            <Button variant="outline" render={<Link href="/courses" />}>
              {d.browse}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
