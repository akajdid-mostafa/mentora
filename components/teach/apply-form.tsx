"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import {
  Briefcase01Icon,
  IdVerifiedIcon,
  Loading03Icon,
  Mortarboard02Icon,
  Tick02Icon,
  UserGroup02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { topicTint, topics, type Topic } from "@/components/course/courses";
import { applicant, applyCopy, countries, slots, years } from "@/components/teach/copy";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
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
import { Checkbox } from "@/components/ui/checkbox";
import { StepRule } from "@/components/ui/step-rule";
import { TabTrack } from "@/components/ui/tab-track";
import { TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";

type Values = typeof applicant;
type Key = keyof Values;

// What each step asks for, in the order Continue checks it, so the first
// field it stops on is the first one on the screen.
const STEP_FIELDS: Key[][] = [
  ["name", "email", "country", "slot"],
  ["role", "company", "years", "work"],
  ["field", "title", "who", "consent"],
];

const valid: Partial<Record<Key, (v: Values) => boolean>> = {
  name: (v) => v.name.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()),
  role: (v) => v.role.trim().length >= 2,
  company: (v) => v.company.trim().length >= 2,
  work: (v) => /^https:\/\/[^\s/]+\.[^\s]{2,}/.test(v.work.trim()),
  title: (v) => v.title.trim().length >= 8,
  who: (v) => v.who.trim().length >= 20,
  consent: (v) => v.consent,
};

const failing = (v: Values, step: number) =>
  STEP_FIELDS[step].filter((k) => valid[k] && !valid[k]!(v));

/** Today on the visitor's own calendar, as an ISO date. */
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** `n` working days after an ISO date, Saturdays and Sundays skipped. */
function workingDaysAfter(today: string, n: number) {
  const d = new Date(`${today}T00:00:00Z`);
  let left = n;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

// The four checks after an application lands: the identity call the next
// working day, then the rest at the pace the median of eleven days keeps.
const CHECKS = [
  { icon: IdVerifiedIcon, after: 1 },
  { icon: Briefcase01Icon, after: 4 },
  { icon: UserGroup02Icon, after: 6 },
  { icon: Mortarboard02Icon, after: 9 },
];

const selfEmployed = (company: string) => /self[\s-]?employed|freelance/i.test(company);

export function ApplyForm({ today }: { today: string }) {
  const c = applyCopy;
  const id = useId();
  const [v, setV] = useState<Values>(applicant);
  const [step, setStep] = useState(0);
  const [shown, setShown] = useState<Key[]>([]);
  const [state, setState] = useState<"form" | "sending" | "done">("form");
  // The day the application went out, on the visitor's calendar rather than
  // the server's, so "the next working day" is theirs wherever they are.
  const [sentOn, setSentOn] = useState<string | null>(null);
  // Where focus goes once the step now showing has drawn: its first field,
  // after a move back or a restart, when the control that was pressed has
  // gone; the success screen's heading, once the application is in.
  const land = useRef<"first" | "done" | null>(null);
  const doneHeading = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const sending = state === "sending";
  const done = state === "done";

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (land.current === "done") doneHeading.current?.focus();
    if (land.current === "first") {
      const first = STEP_FIELDS[step][0];
      const el =
        document.getElementById(`${id}-${first}`) ??
        document.getElementById(`${id}-${first}-${v[first]}`);
      el?.focus();
    }
    land.current = null;
  }, [step, state, id, v]);

  const set = <K extends Key>(k: K, value: Values[K]) => {
    setV((was) => ({ ...was, [k]: value }));
  };
  const error = (k: Key) =>
    shown.includes(k) && valid[k] && !valid[k]!(v) ? c.errors[k as keyof typeof c.errors] : undefined;

  const goBack = (to: number) => {
    if (sending || to >= step) return;
    setShown([]);
    land.current = "first";
    setStep(to);
  };

  const next = () => {
    if (sending) return;
    const bad = failing(v, step);
    if (bad.length) {
      setShown(bad);
      document.getElementById(`${id}-${bad[0]}`)?.focus();
      return;
    }
    setShown([]);
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setState("sending");
    setSentOn(localToday());
    timer.current = window.setTimeout(() => {
      land.current = "done";
      setState("done");
    }, 900);
  };

  const restart = () => {
    setV(applicant);
    setSentOn(null);
    setShown([]);
    land.current = "first";
    setStep(0);
    setState("form");
  };

  const first = v.name.trim().split(" ")[0] || v.name;
  const dates = CHECKS.map((k) => workingDaysAfter(sentOn ?? today, k.after));
  const field = (k: Key) => `${id}-${k}`;

  return (
    <section id="apply" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="grid grid-cols-1 gap-2 rounded-lg bg-accent p-2 lg:grid-cols-2 [&>*]:min-w-0">
        {/* The working half: a white sheet on the band, as the reference's
            darker panel sits in its frame. The form and the success screen
            share one cell, and so do the form's three steps, so the sheet
            keeps the height of the tallest of them and nothing beside or
            under it moves on Continue. What is not showing is inert. Both
            stacks are one column that may narrow below the widest thing in
            them, so the track of fields scrolls inside the sheet on a phone
            rather than pushing the form past its edge. */}
        <div className="grid grid-cols-1 rounded-[calc(var(--radius-lg)-0.5rem)] bg-card px-6 py-12 sm:px-12 sm:py-14 lg:px-16">
          <form
            noValidate
            inert={done}
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
            className={cn("mx-auto w-full max-w-md [grid-area:1/1]", done && "invisible")}
          >
            <div className="text-center">
              <Eyebrow className="justify-center">{c.eyebrow}</Eyebrow>
              <SectionHeading className="mx-auto mt-5">{c.heading}</SectionHeading>
              <p className="mx-auto mt-4 max-w-[24rem] text-base text-balance text-muted-foreground">{c.lede}</p>
            </div>

            {/* The three steps as the reference's segmented rule, each
                named under its segment. */}
            <StepRule steps={c.steps} current={step} onPick={goBack} locked={sending} className="mt-10" />

            <fieldset disabled={sending} className="mt-8 grid min-w-0 grid-cols-1">
              <legend className="sr-only">{c.steps[step]}</legend>

              <div inert={step !== 0} className={cn("flex flex-col gap-5 [grid-area:1/1]", step !== 0 && "invisible")}>
                <TextField id={field("name")} name="name" label={c.fields.name} value={v.name} onChange={(x) => set("name", x)} error={error("name")} autoComplete="name" />
                <TextField id={field("email")} name="email" label={c.fields.email} type="email" value={v.email} onChange={(x) => set("email", x)} error={error("email")} autoComplete="email" />
                <Select name="country" value={v.country} onValueChange={(x) => set("country", String(x))}>
                  <div className="flex flex-col gap-2">
                    <SelectFieldLabel className="text-foreground">{c.fields.country}</SelectFieldLabel>
                    <SelectTrigger id={field("country")} size="field" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </div>
                  <SelectContent label={c.fields.country}>
                    <SelectGroup>
                      <SelectLabel>{c.fields.country}</SelectLabel>
                      {countries.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* When the identity call suits, which the success screen
                    prints beside the call's day. */}
                <div className="flex flex-col gap-2">
                  <span id={`${id}-slot-label`} className="text-sm">{c.fields.slot}</span>
                  <TabTrack
                    kind="radios"
                    on="card"
                    labelledBy={`${id}-slot-label`}
                    idPrefix={field("slot")}
                    options={slots.map((s) => ({ id: s, label: s }))}
                    value={v.slot}
                    onChange={(s) => set("slot", s)}
                    // the three share the width; under 360 their padding
                    // steps down to 4px, so "Afternoon" fits a 320 screen
                    className="w-full [&>button]:flex-1 [&>button]:px-1 min-[360px]:[&>button]:px-2"
                  />
                </div>
              </div>

              <div inert={step !== 1} className={cn("flex flex-col gap-5 [grid-area:1/1]", step !== 1 && "invisible")}>
                <TextField id={field("role")} name="role" label={c.fields.role} value={v.role} onChange={(x) => set("role", x)} error={error("role")} autoComplete="organization-title" />
                <TextField id={field("company")} name="company" label={c.fields.company} value={v.company} onChange={(x) => set("company", x)} error={error("company")} autoComplete="organization" />
                <div className="flex flex-col gap-2">
                  <span id={`${id}-years-label`} className="text-sm">{c.fields.years}</span>
                  <input type="hidden" name="years" value={v.years} />
                  <TabTrack
                    kind="radios"
                    on="card"
                    labelledBy={`${id}-years-label`}
                    idPrefix={field("years")}
                    options={years.map((y) => ({ id: y, label: y }))}
                    value={v.years}
                    onChange={(y) => set("years", y)}
                    // the three share the width, so their own inline padding
                    // only sets how narrow the track can go: 320 wide at 8px
                    className="w-full [&>button]:flex-1 [&>button]:px-2"
                  />
                </div>
                <TextField
                  id={field("work")} name="work"
                  label={c.fields.work}
                  type="url"
                  value={v.work}
                  onChange={(x) => set("work", x)}
                  error={error("work")}
                  hint={c.hints.work}
                  autoComplete="url"
                />
              </div>

              <div inert={step !== 2} className={cn("flex flex-col gap-5 [grid-area:1/1]", step !== 2 && "invisible")}>
                {/* Four fields do not fit a phone's sheet side by side, so
                    under sm the track runs on sideways inside it. */}
                <div className="flex min-w-0 flex-col gap-2">
                  <span id={`${id}-field-label`} className="text-sm">{c.fields.field}</span>
                  <input type="hidden" name="field" value={v.field} />
                  <TabTrack
                    kind="radios"
                    on="card"
                    labelledBy={`${id}-field-label`}
                    idPrefix={field("field")}
                    options={topics.map((t) => ({ id: t, label: t }))}
                    value={v.field as Topic}
                    onChange={(t) => set("field", t)}
                    className="no-scrollbar w-full max-sm:overflow-x-auto sm:[&>button]:flex-1"
                  />
                </div>
                <TextField id={field("title")} name="title" label={c.fields.title} value={v.title} onChange={(x) => set("title", x)} error={error("title")} />
                <TextField
                  id={field("who")} name="who"
                  label={c.fields.who}
                  value={v.who}
                  onChange={(x) => set("who", x)}
                  error={error("who")}
                  hint={c.hints.who}
                  multiline
                />
                <Checkbox
                  id={field("consent")} name="consent"
                  checked={v.consent}
                  onChange={(x) => set("consent", x)}
                  error={error("consent")}
                >
                  {c.fields.consent}
                </Checkbox>
              </div>
            </fieldset>

            {/* Continue keeps its full ink while the application goes out:
                it stops taking presses rather than fading, and the fields
                above it are the ones that go still. */}
            <div className="mt-9 flex items-center gap-3">
              {step > 0 && (
                <Button type="button" variant="outline" disabled={sending} onClick={() => goBack(step - 1)}>
                  <ArrowLeftIcon data-icon="inline-start" />
                  {c.back}
                </Button>
              )}
              <Button
                type="submit"
                aria-disabled={sending || undefined}
                className={cn("flex-1", sending && "pointer-events-none")}
              >
                {sending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      data-icon="inline-start"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    {c.sending}
                  </>
                ) : step < 2 ? (
                  <>
                    {c.next}
                    <ArrowRightIcon data-icon="inline-end" />
                  </>
                ) : (
                  c.send
                )}
              </Button>
            </div>
          </form>

          <div inert={!done} className={cn("mx-auto w-full max-w-md [grid-area:1/1]", !done && "invisible")}>
            <Done
              headingRef={doneHeading}
              first={first}
              slot={v.slot}
              company={v.company}
              dates={dates}
              brief={`${v.title.trim()}, for ${v.who.trim()}`}
              onAgain={restart}
            />
          </div>
        </div>

        {/* The card this application becomes, filling in as it is typed:
            the hand and the card centred in the panel, and the line about
            the badge at its foot, as the reference pins its caption. */}
        <div className="flex flex-col items-center px-6 py-12 sm:px-10 lg:py-14">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
            <CardNote />
            <PreviewCard v={v} booked={done ? dates[0] : undefined} />
          </div>
          <p className="mt-10 max-w-[22rem] text-center text-base text-muted-foreground">{c.preview.caption}</p>
        </div>
      </div>
    </section>
  );
}

function Done({
  headingRef,
  first,
  slot,
  company,
  dates,
  brief,
  onAgain,
}: {
  headingRef: React.RefObject<HTMLSpanElement | null>;
  first: string;
  slot: string;
  company: string;
  dates: string[];
  /** The course the applicant described, which the studio opens on. */
  brief: string;
  onAgain: () => void;
}) {
  const c = applyCopy.done;
  const job = selfEmployed(company) ? c.selfEmployed : c.job(company.trim());
  return (
    <div className="text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-chip text-primary-ink">
        <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2} aria-hidden="true" />
      </span>
      <Eyebrow className="mt-6 justify-center">{c.eyebrow}</Eyebrow>
      <SectionHeading className="mx-auto mt-5">
        <span ref={headingRef} tabIndex={-1} className="outline-none">
          {c.heading(first)}
        </span>
      </SectionHeading>
      <p aria-live="polite" className="mx-auto mt-4 max-w-[24rem] text-base text-muted-foreground">
        {c.lede(dates[3])}
      </p>

      {/* The four checks in the order they run, each on the day it is
          booked for; the rule down their left edge joins them into one
          run. On a phone the day goes under its check, so the words keep
          the row's width. */}
      <ol className="relative mt-10 flex flex-col gap-2 text-left before:absolute before:top-6 before:bottom-6 before:left-[1.625rem] before:w-px before:bg-border before:content-['']">
        {c.checks.map((label, i) => (
          <li key={label} className="relative flex items-center gap-4 rounded-sm px-2 py-2">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                i === 0 ? "bg-chip text-primary-ink" : "bg-card ring-1 ring-inset ring-border",
              )}
            >
              <HugeiconsIcon icon={CHECKS[i].icon} size={18} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-4">
              <span className="min-w-0 flex-1 text-base">{i === 1 ? job : label}</span>
              <span className={cn("shrink-0 text-sm tabular-nums", i === 0 ? "text-foreground" : "text-muted-foreground")}>
                {i === 0 ? c.call(dates[0], slot) : dates[i]}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t pt-6 text-base">
        {c.badge} <span className="font-medium">{dates[3]}</span> {c.badgeTail}.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
        {/* The studio opens on the course just described, its line already
            in the brief's field, rather than on Ana's drafts. */}
        <Button render={<Link href={`${c.studio.href}?brief=${encodeURIComponent(brief)}#outline`} />}>
          {c.studio.label}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="outline" onClick={onAgain}>
          {c.again}
        </Button>
      </div>
    </div>
  );
}

// The directory card's notch, the same bay its portraits sit in (see
// components/instructors/instructor-card.tsx), so the preview reads as that
// card rather than as a sketch of one.
const NOTCH =
  "M0 38 L0 37 A12 12 0 0 0 11.634 27.939 A37 37 0 0 1 83.382 27.939 A12 12 0 0 0 95.016 37 L95.016 38 Z";

/** The card the directory will draw for this applicant: a cover in the
 *  field's tint carrying the working title until a first course has a
 *  photograph, the initials in the notch with the badge still an outline,
 *  the name and role, and the directory's two figures, the checks standing
 *  where the rating will. */
function PreviewCard({ v, booked }: { v: Values; booked?: string }) {
  const c = applyCopy.preview;
  const tint = topicTint[(v.field as Topic) ?? "Design"] ?? topicTint.Design;
  const initials =
    v.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?";
  // The dot keeps to the role before it, as the directory's cards set it,
  // so a long role breaks after the dot rather than opening a line on one.
  const trade = [v.role.trim(), v.company.trim()].filter(Boolean).join(" · ");
  return (
    <div data-object className="w-full max-w-[18rem] rounded-lg bg-card p-1.5 shadow-soft">
      <div className="relative">
        <div className={cn("relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-[calc(var(--radius)-0.375rem)] p-4", tint.lid)}>
          <span className={cn("inline-flex h-7 w-fit items-center rounded-control bg-card px-3 text-xs font-medium", tint.ink)}>
            {v.field} · {c.draft}
          </span>
          <p className="line-clamp-2 pb-5 text-lg font-medium tracking-tight">{v.title.trim() || " "}</p>
          <svg
            aria-hidden="true"
            viewBox="0 0 95.016 38"
            className="pointer-events-none absolute -bottom-px left-1/2 h-[38px] w-[95.016px] -translate-x-1/2 fill-card"
          >
            <path d={NOTCH} />
          </svg>
        </div>
        <span className="absolute left-1/2 top-full size-16 -translate-x-1/2 -translate-y-1/2">
          <span className={cn("flex size-16 items-center justify-center rounded-full font-heading text-lg tracking-tight", tint.lid, tint.ink)}>
            {initials}
          </span>
          {/* the badge's place, drawn as the directory's mark in outline:
              the same badge, not yet earned */}
          <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-card">
            <CheckBadgeIcon aria-hidden="true" className="size-6 text-muted-foreground" />
          </span>
        </span>
      </div>
      <div className="px-4 pb-5 pt-11 text-center">
        <p className="truncate text-base font-medium">{v.name.trim() || " "}</p>
        <p className="mt-0.5 line-clamp-2 min-h-10 text-sm text-balance text-muted-foreground">{trade || " "}</p>
      </div>
      <dl className="mx-2.5 mb-2.5 grid grid-cols-2 divide-x rounded-sm bg-accent py-3 text-center">
        <div className="flex flex-col gap-0.5">
          <dt className="order-2 text-xs text-muted-foreground">{booked ? c.call : c.checksLabel}</dt>
          <dd className="font-heading text-base tabular-nums">{booked ?? c.checks}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="order-2 text-xs text-muted-foreground">{c.learnersLabel}</dt>
          <dd className="font-heading text-base tabular-nums">0</dd>
        </div>
      </dl>
    </div>
  );
}

/** The hand naming the card, as the catalog and the directory point at the
 *  object beside their search: two lines in the heading face turned a couple
 *  of degrees, and an arrow drawn fresh for this spot, leaving the words,
 *  looping once and coming down onto the card's shoulder. It draws itself
 *  again every few seconds on the same clock as theirs; a reader who asked
 *  for stillness sees it drawn. */
function CardNote() {
  const [a, b] = applyCopy.preview.note;
  return (
    <p className="flex items-start gap-1 self-center sm:-translate-x-10">
      <span className="inline-block -rotate-2 font-heading text-xl tracking-tight text-foreground">
        {a}
        <br />
        {b}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 96 80"
        fill="none"
        className="pointer-events-none mt-5 h-20 w-24 shrink-0 overflow-visible text-foreground motion-safe:animate-scribble"
      >
        <path
          d="M4 12C22 4 44 6 54 18C62 28 56 38 48 34C40 30 46 18 58 20C72 22 78 40 76 70"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="motion-safe:animate-scribble-shaft"
        />
        <path
          d="M69.5 63.5Q73 67.4 76 71Q78.6 66.6 82.4 62.8"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="motion-safe:animate-scribble-head"
        />
      </svg>
    </p>
  );
}
