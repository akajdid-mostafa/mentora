"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Analytics01Icon,
  Briefcase01Icon,
  CodeIcon,
  Mortarboard02Icon,
  PenTool03Icon,
  Presentation01Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { authCopy, signUpCopy } from "@/components/auth/copy";
import { AuthFrame } from "@/components/auth/frame";
import {
  BusyLabel,
  EMAIL,
  OrLine,
  PasswordField,
  Providers,
  StrengthMeter,
  ViewHead,
  stacked,
} from "@/components/auth/parts";
import { rulesOf, scoreOf } from "@/components/auth/strength";
import {
  draftDate,
  freshPlan,
  goalOf,
  liveIn,
  restingSignUp,
  topics,
  type SignUpKey,
  type SignUpValues,
} from "@/components/auth/sign-up-model";
import { SignUpPreview } from "@/components/auth/sign-up-preview";
import type { Topic } from "@/components/course/courses";
import { useToday } from "@/components/dashboard/today";
import { goals, pathHref } from "@/components/marketing/goals";
import {
  PACE,
  setPace,
  toggleSavedPath,
  usePathChoices,
} from "@/components/paths/store";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioTiles } from "@/components/ui/radio-tiles";
import {
  SliderControl,
  SliderLabel,
  SliderRoot,
  SliderSteps,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { StepRule } from "@/components/ui/step-rule";
import { TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";

const copy = signUpCopy;
const e = authCopy.errors;

// The glyphs the header's Paths and Courses menus draw for the same four
// goals and four subjects, so the sign-up and the menus agree.
const goalIcon: Record<string, IconSvgElement> = {
  analyst: Analytics01Icon,
  backend: TerminalIcon,
  design: PenTool03Icon,
  founder: Briefcase01Icon,
};
const topicIcon: Record<Topic, IconSvgElement> = {
  Data: Analytics01Icon,
  Engineering: CodeIcon,
  Design: PenTool03Icon,
  Business: Briefcase01Icon,
};

/** The fields of a step that will not do, in the order the step shows
 *  them, so Continue stops on the first one. */
function problemsOf(v: SignUpValues, at: number): [SignUpKey, string][] {
  const out: [SignUpKey, string][] = [];
  if (at === 0) {
    if (v.name.trim().length < 2) out.push(["name", e.name]);
    if (!EMAIL.test(v.email.trim())) out.push(["email", e.email]);
    if (rulesOf(v.password, v.name, v.email).some((r) => !r.met))
      out.push(["password", e.rules]);
  }
  if (at === 1 && v.role === "teach" && v.idea.trim().length < 8)
    out.push(["idea", e.idea]);
  if (at === 2 && !v.terms) out.push(["terms", e.terms]);
  return out;
}

export function SignUp({ today: serverToday }: { today: string }) {
  const id = useId();
  const today = useToday(serverToday);
  const saved = usePathChoices().saved;
  const [v, setV] = useState<SignUpValues>(restingSignUp);
  const [at, setAt] = useState(0);
  const [shown, setShown] = useState<SignUpKey[]>([]);
  const [state, setState] = useState<"form" | "busy" | "done">("form");
  const [provider, setProvider] = useState<string | null>(null);
  const land = useRef<"step" | "done" | null>(null);
  const heads = useRef<(HTMLHeadingElement | null)[]>([]);
  const doneHead = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A step reached by a press takes the focus on its heading, and the
  // finished screen on its own.
  useEffect(() => {
    if (land.current === "step") heads.current[at]?.focus();
    if (land.current === "done") doneHead.current?.focus();
    land.current = null;
  }, [at, state]);

  const set = <K extends SignUpKey>(k: K, value: SignUpValues[K]) =>
    setV((was) => ({ ...was, [k]: value }));
  const errorOf = (k: SignUpKey) =>
    shown.includes(k)
      ? problemsOf(v, at).find(([key]) => key === k)?.[1]
      : undefined;
  const locked = state !== "form" || provider !== null;
  const done = state === "done";

  const goTo = (i: number) => {
    if (locked || i >= at) return;
    setShown([]);
    land.current = "step";
    setAt(i);
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (locked) return;
    const bad = problemsOf(v, at);
    if (bad.length) {
      setShown(bad.map(([k]) => k));
      document.getElementById(`${id}-${bad[0][0]}`)?.focus();
      return;
    }
    setShown([]);
    if (at < 2) {
      land.current = "step";
      setAt(at + 1);
      return;
    }
    create();
  };

  const create = () => {
    setState("busy");
    timer.current = window.setTimeout(() => {
      // The answers go where the rest of the site reads them: the hours are
      // the pace every path and the dashboard plan with, and the path picked
      // joins the ones the learner keeps.
      setPace(v.pace);
      if (v.role === "learn" && !saved.includes(v.goal))
        toggleSavedPath(v.goal);
      land.current = "done";
      setState("done");
    }, 1300);
  };

  // A provider fills the first step from the account it lends, so the form
  // moves on to the questions only a person can answer.
  const pick = (name: string) => {
    setProvider(name);
    timer.current = window.setTimeout(() => {
      setProvider(null);
      setShown([]);
      land.current = "step";
      setAt(1);
    }, 1200);
  };

  const g = goalOf(v.goal);
  const plan = freshPlan(g, v.pace, today);
  const draft = draftDate(v.pace, today);
  const rules = rulesOf(v.password, v.name, v.email);
  const heads3 = [copy.account, copy.goal, copy.week];

  return (
    <AuthFrame
      legal={false}
      panel={
        <SignUpPreview v={v} at={done ? 3 : at} plan={plan} draft={draft} today={today} />
      }
      foot={
        !done && (
          <p className="text-center text-sm text-muted-foreground">
            {copy.have}{" "}
            <Link
              href="/sign-in"
              className={cn(
                "font-medium text-foreground underline-offset-4 hover:underline",
                reach,
              )}
            >
              {copy.signIn}
            </Link>
          </p>
        )
      }
    >
      {/* The form and the finished screen share one cell, and the steps one
          frame inside the form, so the column keeps one height and the
          buttons never move on Continue. What is not showing is inert. */}
      <div className="grid grid-cols-1">
        <form
          noValidate
          onSubmit={submit}
          inert={done}
          aria-hidden={done || undefined}
          className={cn("flex min-w-0 flex-col", stacked(!done))}
        >
          {/* The three heads share a cell, sat on its floor: where one
              wraps a line more than the others, the room goes above the
              shorter heads rather than between them and the steps. */}
          <div className="grid grid-cols-1">
            {heads3.map((h, i) => (
              <div
                key={h.title}
                className={cn("self-end", stacked(i === at))}
                aria-hidden={i !== at || undefined}
              >
                <ViewHead
                  on={i === at && !done}
                  title={h.title}
                  lede={h.lede}
                  headingRef={(el) => {
                    heads.current[i] = el;
                  }}
                />
              </div>
            ))}
          </div>

          <StepRule
            steps={copy.steps}
            current={at}
            onPick={goTo}
            locked={locked}
            className="mt-8"
          />

          <fieldset
            disabled={state === "busy"}
            className="mt-8 grid min-w-0 grid-cols-1"
          >
            <legend className="sr-only">{copy.steps[at]}</legend>

            {/* 1 · Account */}
            <div
              inert={at !== 0}
              className={cn("flex min-w-0 flex-col", stacked(at === 0))}
            >
              <Providers busy={provider} onPick={pick} />
              <OrLine className="mt-6" />
              <div className="mt-6 flex flex-col gap-5">
                <TextField
                  id={`${id}-name`} name="name"
                  label={copy.account.name}
                  value={v.name}
                  onChange={(x) => set("name", x)}
                  error={errorOf("name")}
                  autoComplete="name"
                />
                <TextField
                  id={`${id}-email`} name="email"
                  label={authCopy.fields.email}
                  type="email"
                  value={v.email}
                  onChange={(x) => set("email", x)}
                  error={errorOf("email")}
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  autoCapitalize="off"
                />
                <PasswordField
                  id={`${id}-password`}
                  label={authCopy.fields.password}
                  value={v.password}
                  onChange={(x) => set("password", x)}
                  error={errorOf("password")}
                  autoComplete="new-password"
                />
                <StrengthMeter
                  id={`${id}-meter`}
                  score={scoreOf(v.password, rules)}
                  rules={rules}
                />
              </div>
            </div>

            {/* 2 · Goal */}
            <div
              inert={at !== 1}
              className={cn("flex min-w-0 flex-col gap-6", stacked(at === 1))}
            >
              <RadioTiles
                label={copy.goal.role}
                labelId={`${id}-role-label`}
                name="role"
                value={v.role}
                onChange={(x) => set("role", x === "teach" ? "teach" : "learn")}
                options={[
                  { id: "learn", icon: Mortarboard02Icon, ...copy.goal.learn },
                  { id: "teach", icon: Presentation01Icon, ...copy.goal.teach },
                ]}
              />
              {/* The two follow-ups share a cell, so switching between
                  learning and teaching moves nothing under them. */}
              <div className="grid grid-cols-1">
                <div
                  inert={v.role !== "learn"}
                  className={stacked(v.role === "learn")}
                >
                  <RadioTiles
                    label={copy.goal.path}
                    labelId={`${id}-path-label`}
                    name="goal"
                    value={v.goal}
                    onChange={(x) => set("goal", x)}
                    options={goals.map((x) => ({
                      id: x.id,
                      title: x.short,
                      icon: goalIcon[x.id],
                      line: copy.goal.pathLine(
                        x.legs.length,
                        x.legs.reduce((n, l) => n + l.hours, 0),
                      ),
                    }))}
                  />
                </div>
                <div
                  inert={v.role !== "teach"}
                  className={cn(
                    "flex flex-col gap-5",
                    stacked(v.role === "teach"),
                  )}
                >
                  <RadioTiles
                    label={copy.goal.field}
                    labelId={`${id}-topic-label`}
                    name="topic"
                    value={v.topic}
                    onChange={(x) => set("topic", x as Topic)}
                    options={topics.map((t) => ({
                      id: t,
                      title: t,
                      icon: topicIcon[t],
                      line: copy.goal.fieldLine(liveIn(t)),
                    }))}
                  />
                  <TextField
                    id={`${id}-idea`} name="idea"
                    label={copy.goal.idea}
                    value={v.idea}
                    onChange={(x) => set("idea", x)}
                    error={errorOf("idea")}
                    aside={copy.goal.ideaAside}
                    maxLength={80}
                  />
                </div>
              </div>
            </div>

            {/* 3 · Your week */}
            <div
              inert={at !== 2}
              className={cn("flex min-w-0 flex-col", stacked(at === 2))}
            >
              <SliderRoot
                name="pace"
                value={v.pace}
                onValueChange={(x) => set("pace", x as number)}
                min={PACE.min}
                max={PACE.max}
                step={1}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <SliderLabel className="text-foreground">
                    {copy.week.hours}
                  </SliderLabel>
                  <span className="text-sm tabular-nums">
                    {copy.week.value(v.pace)}
                  </span>
                </div>
                <SliderControl className="mt-1">
                  <SliderTrack className="relative bg-transparent">
                    <SliderSteps value={v.pace} min={PACE.min} max={PACE.max} />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </SliderRoot>

              {/* What the hours buy, worked out as they move. */}
              <div data-object className="mt-6 rounded-sm bg-accent p-5">
                <Caps>
                  {v.role === "learn"
                    ? copy.week.learnCaps
                    : copy.week.teachCaps}
                </Caps>
                <p
                  aria-live="polite"
                  className="mt-2 font-heading text-2xl tracking-tight tabular-nums"
                >
                  {v.role === "learn"
                    ? copy.week.learnTitle(plan.finish)
                    : copy.week.teachTitle(draft)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  {v.role === "learn"
                    ? copy.week.learnLine(plan.hours, plan.weeks)
                    : copy.week.teachLine}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <Checkbox
                  id={`${id}-notes`} name="notes"
                  checked={v.notes}
                  onChange={(x) => set("notes", x)}
                >
                  {copy.week.notes}
                </Checkbox>
                <Checkbox
                  id={`${id}-terms`} name="terms"
                  checked={v.terms}
                  onChange={(x) => set("terms", x)}
                  error={errorOf("terms")}
                >
                  {copy.week.termsBefore}{" "}
                  <Link
                    href="/about#terms"
                    className="underline underline-offset-4 hover:text-muted-foreground"
                  >
                    {authCopy.legal.terms}
                  </Link>{" "}
                  {authCopy.legal.and}{" "}
                  <Link
                    href="/about#privacy"
                    className="underline underline-offset-4 hover:text-muted-foreground"
                  >
                    {authCopy.legal.privacy}
                  </Link>
                </Checkbox>
              </div>
            </div>
          </fieldset>

          {/* The reference's second shot: Back as a round-cornered square
              beside a wide primary, rather than under it. */}
          <div className="mt-9 flex items-center gap-3">
            {at > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                disabled={locked}
                onClick={() => goTo(at - 1)}
                aria-label={copy.buttons.back}
              >
                <ArrowLeftIcon />
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              aria-disabled={locked || undefined}
              className={cn("flex-1", locked && "pointer-events-none")}
            >
              <BusyLabel
                busy={state === "busy"}
                busyLabel={copy.buttons.busy}
                label={
                  at < 2 ? (
                    <>
                      {copy.buttons.next}
                      <ArrowRightIcon data-icon="inline-end" />
                    </>
                  ) : (
                    copy.buttons.create
                  )
                }
              />
            </Button>
          </div>
        </form>

        <div
          inert={!done}
          aria-hidden={!done || undefined}
          className={cn("flex min-w-0 flex-col justify-center", stacked(done))}
        >
          <ViewHead
            on={done}
            caps={copy.done.caps}
            title={copy.done.title(v.name.trim().split(/\s+/)[0] || "there")}
            lede={
              v.role === "learn"
                ? copy.done.learn(g.short.toLowerCase(), v.pace)
                : copy.done.teach
            }
            headingRef={doneHead}
          />
          <div className="mt-8 flex flex-col gap-3">
            {v.role === "learn" ? (
              <Button size="lg" render={<Link href={pathHref(g)} />}>
                {copy.done.startPath}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="lg" render={<Link href="/studio" />}>
                {copy.done.openStudio}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            )}
            <Link
              href={v.role === "learn" ? "/dashboard" : "/teach#earnings"}
              className="flex h-10 items-center justify-center rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
            >
              {v.role === "learn" ? copy.done.dashboard : copy.done.payouts}
            </Link>
          </div>
        </div>
      </div>
    </AuthFrame>
  );
}
