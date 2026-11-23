"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Building03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { authCopy, signInCopy } from "@/components/auth/copy";
import { demo, landingOf } from "@/components/auth/demo";
import {
  BusyLabel,
  CodeField,
  EMAIL,
  OrLine,
  PasswordField,
  Providers,
  StrengthMeter,
  ViewHead,
  stacked,
} from "@/components/auth/parts";
import { rulesOf, scoreOf } from "@/components/auth/strength";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/utils";

const copy = signInCopy;
const e = authCopy.errors;

type View = "signin" | "sso" | "email" | "code" | "fresh" | "done";
const views: View[] = ["signin", "sso", "email", "code", "fresh", "done"];

type Values = {
  email: string;
  password: string;
  keep: boolean;
  work: string;
  code: string;
  fresh: string;
};
type Key = keyof Values;

/** Where every field rests: the demo learner's details and the answers the
 *  demo accepts, so each button works on its first press. Emptying a field
 *  is how a reader sees its error. */
const resting: Values = {
  email: demo.email,
  password: demo.password,
  keep: true,
  work: demo.work,
  code: demo.code,
  fresh: demo.fresh,
};

/** The fields of a view that will not do, in the order the view shows
 *  them, so its button stops on the first one. */
function problemsOf(v: Values, view: View): [Key, string][] {
  const out: [Key, string][] = [];
  if (view === "signin") {
    if (!EMAIL.test(v.email.trim())) out.push(["email", e.email]);
    if (!v.password) out.push(["password", e.password]);
    else if (v.password.length < 8) out.push(["password", e.short]);
  }
  if (view === "sso") {
    if (!EMAIL.test(v.work.trim())) out.push(["work", e.email]);
    // the demo knows one team; any other domain is one no team signs in with
    else if (domainOf(v.work) !== domainOf(demo.work))
      out.push(["work", e.team(domainOf(v.work))]);
  }
  if (view === "email" && !EMAIL.test(v.email.trim()))
    out.push(["email", e.email]);
  if (view === "code") {
    if (v.code.length < 6) out.push(["code", e.code]);
    else if (v.code !== demo.code) out.push(["code", e.wrongCode]);
  }
  if (
    view === "fresh" &&
    rulesOf(v.fresh, demo.name, v.email).some((r) => !r.met)
  )
    out.push(["fresh", e.rules]);
  return out;
}

const domainOf = (email: string) =>
  email.trim().toLowerCase().split("@")[1] ?? "";

/** "0:24" */
const clock = (s: number) => `0:${String(s).padStart(2, "0")}`;

export function SignIn() {
  const id = useId();
  const router = useRouter();
  const next = useLanding();
  const [view, setView] = useState<View>("signin");
  const [v, setV] = useState<Values>(resting);
  const [shown, setShown] = useState<Key[]>([]);
  const [busy, setBusy] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [team, setTeam] = useState(false);
  const [wait, setWait] = useState(0);
  const [resent, setResent] = useState(false);
  const heads = useRef<Partial<Record<View, HTMLHeadingElement | null>>>({});
  const land = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A view shown by a press takes the focus on its heading, so a reader on
  // a keyboard or a screen reader starts at the top of what just appeared.
  useEffect(() => {
    if (land.current) heads.current[view]?.focus();
    land.current = false;
  }, [view]);

  // The resend waits out its seconds while the inbox step is open.
  useEffect(() => {
    if (view !== "code" || wait <= 0) return;
    const t = window.setTimeout(() => setWait((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [view, wait]);

  const set = <K extends Key>(k: K, value: Values[K]) => {
    setV((was) => ({ ...was, [k]: value }));
    if (k === "work") setTeam(false);
  };
  const errorOf = (k: Key) =>
    shown.includes(k)
      ? problemsOf(v, view).find(([key]) => key === k)?.[1]
      : undefined;

  const go = (to: View) => {
    window.clearTimeout(timer.current);
    setBusy(false);
    setShown([]);
    land.current = true;
    setView(to);
    if (to === "code") {
      setWait(demo.resend);
      setResent(false);
    }
  };

  const later = (ms: number, then: () => void) => {
    setBusy(true);
    timer.current = window.setTimeout(then, ms);
  };

  const enter = () => router.push(next);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (busy || provider) return;
    const bad = problemsOf(v, view);
    if (bad.length) {
      setShown(bad.map(([k]) => k));
      document.getElementById(`${id}-${view}-${bad[0][0]}`)?.focus();
      return;
    }
    setShown([]);
    if (view === "signin") later(demo.wait, enter);
    if (view === "sso") {
      if (!team)
        later(demo.wait, () => {
          setBusy(false);
          setTeam(true);
        });
      else later(demo.wait, enter);
    }
    if (view === "email") later(900, () => go("code"));
    if (view === "code") later(700, () => go("fresh"));
    if (view === "fresh") later(900, () => go("done"));
  };

  const pick = (name: string) => {
    setProvider(name);
    timer.current = window.setTimeout(enter, demo.wait + 400);
  };

  const field = (view: View, k: Key) => `${id}-${view}-${k}`;
  const back = (
    <button
      type="button"
      onClick={() => go("signin")}
      className={cn(
        "mx-auto mt-6 flex items-center gap-1.5 text-sm text-muted-foreground press hover:text-foreground",
        reach,
      )}
    >
      <ArrowLeftIcon aria-hidden="true" className="size-4" />
      {copy.reset.back}
    </button>
  );
  const cta = (label: string, busyLabel: string, arrow = false) => (
    <Button
      type="submit"
      size="lg"
      aria-disabled={busy || undefined}
      className={cn("mt-8 w-full", busy && "pointer-events-none")}
    >
      <BusyLabel
        busy={busy}
        busyLabel={busyLabel}
        label={
          <>
            {label}
            {arrow && <ArrowRightIcon data-icon="inline-end" />}
          </>
        }
      />
    </Button>
  );

  const panel = (key: View, children: ReactNode) => (
    <form
      key={key}
      noValidate
      onSubmit={submit}
      inert={view !== key}
      aria-hidden={view !== key || undefined}
      className={cn("flex min-w-0 flex-col", stacked(view === key))}
    >
      {children}
    </form>
  );
  const head = (
    key: View,
    h: { caps: string; title: string; lede?: string },
  ) => (
    <ViewHead
      on={view === key}
      caps={h.caps}
      title={h.title}
      lede={h.lede}
      headingRef={(el) => {
        heads.current[key] = el;
      }}
    />
  );

  const r = copy.reset;
  const rules = rulesOf(v.fresh, demo.name, v.email);

  return (
    // Every view in one cell, so the column keeps the height of the tallest
    // and the page never jumps as a reader moves between them. What is not
    // showing is inert.
    <div className="grid grid-cols-1">
      {views.map((key) => {
        if (key === "signin")
          return panel(
            key,
            <>
              {head(key, copy.signin)}
              <div className="mt-8">
                <Providers busy={provider} onPick={pick} />
              </div>
              <OrLine className="mt-6" />
              <div className="mt-6 flex flex-col gap-5">
                <TextField
                  id={field(key, "email")} name="email"
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
                  id={field(key, "password")}
                  label={authCopy.fields.password}
                  value={v.password}
                  onChange={(x) => set("password", x)}
                  error={errorOf("password")}
                  autoComplete="current-password"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <Checkbox
                  id={`${id}-keep`} name="keep"
                  checked={v.keep}
                  onChange={(x) => set("keep", x)}
                >
                  {copy.signin.keep}
                </Checkbox>
                <button
                  type="button"
                  onClick={() => go("email")}
                  className={cn(
                    "text-sm font-medium underline-offset-4 press hover:underline",
                    reach,
                  )}
                >
                  {copy.signin.forgot}
                </button>
              </div>
              {cta(copy.signin.submit, copy.signin.busy)}
              <button
                type="button"
                onClick={() => go("sso")}
                className={cn(
                  "mx-auto mt-5 flex items-center gap-2 text-sm text-muted-foreground press hover:text-foreground",
                  reach,
                )}
              >
                <HugeiconsIcon
                  icon={Building03Icon}
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {copy.signin.sso}
              </button>
            </>,
          );
        if (key === "sso")
          return panel(
            key,
            <>
              {head(key, copy.sso)}
              <div className="mt-8 flex flex-col gap-5">
                <TextField
                  id={field(key, "work")} name="work"
                  label={copy.sso.field}
                  type="email"
                  value={v.work}
                  onChange={(x) => set("work", x)}
                  error={errorOf("work")}
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  autoCapitalize="off"
                />
                {/* The team the address belongs to, once it is found: the
                    row is always drawn, so finding it moves nothing. */}
                <div
                  aria-live="polite"
                  className={cn(
                    "flex items-center gap-3 rounded-sm bg-accent p-3 transition-opacity",
                    !team && "opacity-0",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-card font-heading text-base text-foreground shadow-soft"
                  >
                    {demo.team
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  {team && (
                    <span className="min-w-0 text-sm">
                      <span className="sr-only">{copy.sso.found}: </span>
                      <span className="block font-medium">{demo.team}</span>
                      <span className="block text-muted-foreground">
                        {copy.sso.via("214")}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              {team
                ? cta(copy.sso.go(demo.team), copy.sso.going, true)
                : cta(copy.sso.find, copy.sso.finding)}
              {back}
            </>,
          );
        if (key === "email")
          return panel(
            key,
            <>
              {head(key, r.email)}
              <div className="mt-8">
                <TextField
                  id={field(key, "email")} name="email"
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
              </div>
              {cta(r.email.submit, r.email.busy)}
              {back}
            </>,
          );
        if (key === "code")
          return panel(
            key,
            <>
              {head(key, {
                ...r.code,
                lede: r.code.lede(v.email.trim() || demo.email),
              })}
              <div className="mt-8 flex flex-col gap-3">
                <CodeField
                  id={field(key, "code")}
                  label={r.code.field}
                  value={v.code}
                  onChange={(x) => set("code", x)}
                  error={errorOf("code")}
                  digitLabel={r.code.digit}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                  <span className="text-muted-foreground">
                    {r.code.hint(demo.code)}
                  </span>
                  <button
                    type="button"
                    aria-disabled={wait > 0 || undefined}
                    onClick={() => {
                      if (wait > 0) return;
                      setWait(demo.resend);
                      setResent(true);
                    }}
                    className={cn(
                      "tabular-nums",
                      wait > 0
                        ? "cursor-default text-muted-foreground"
                        : "font-medium underline-offset-4 press hover:underline",
                      reach,
                    )}
                  >
                    {wait > 0 ? r.code.wait(clock(wait)) : r.code.resend}
                  </button>
                </div>
                <p aria-live="polite" className="sr-only">
                  {resent ? r.code.sent : ""}
                </p>
              </div>
              {cta(r.code.submit, r.code.busy)}
              {back}
            </>,
          );
        if (key === "fresh")
          return panel(
            key,
            <>
              {head(key, r.fresh)}
              <div className="mt-8 flex flex-col gap-4">
                <PasswordField
                  id={field(key, "fresh")}
                  label={r.fresh.field}
                  value={v.fresh}
                  onChange={(x) => set("fresh", x)}
                  error={errorOf("fresh")}
                  autoComplete="new-password"
                />
                <StrengthMeter
                  id={`${id}-meter`}
                  score={scoreOf(v.fresh, rules)}
                  rules={rules}
                />
              </div>
              {cta(r.fresh.submit, r.fresh.busy)}
              {back}
            </>,
          );
        return (
          <div
            key={key}
            inert={view !== key}
            aria-hidden={view !== key || undefined}
            className={cn("flex min-w-0 flex-col", stacked(view === key))}
          >
            {head(key, r.done)}
            <Button
              size="lg"
              render={<Link href={next} />}
              className="mt-8 w-full"
            >
              {r.done.go}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

const never = () => () => {};

/** Where a finished sign-in lands: `?next=` when the address carries one,
 *  read off the address itself rather than through a hook that would hold
 *  the form back behind a Suspense boundary; the dashboard on the server. */
function useLanding() {
  return useSyncExternalStore(
    never,
    () => landingOf(new URLSearchParams(window.location.search).get("next")),
    () => landingOf(null),
  );
}

/** Under the column, the door for a visitor with no account yet. */
export function SignInFoot() {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {copy.signin.newHere}{" "}
      <Link
        href="/sign-up"
        className={cn(
          "font-medium text-foreground underline-offset-4 hover:underline",
          reach,
        )}
      >
        {copy.signin.create}
      </Link>
    </p>
  );
}
