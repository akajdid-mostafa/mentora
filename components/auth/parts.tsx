"use client";

import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  Alert02Icon,
  AppleIcon,
  GoogleIcon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { authCopy } from "@/components/auth/copy";
import type { Rule } from "@/components/auth/strength";
import { Caps } from "@/components/ui/caps";
import { TextField } from "@/components/ui/text-field";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

const copy = authCopy;

/** A view's head: the bracketed capitals the reference sets over its
 *  headline, the headline and, where the view needs one, a line under it.
 *  Only the view on screen carries the page's h1; the ones stacked behind
 *  it are hidden and say so with a lesser tag. */
export function ViewHead({
  caps,
  title,
  lede,
  on,
  headingRef,
  center = true,
}: {
  caps?: string;
  title: string;
  lede?: string;
  on: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
  center?: boolean;
}) {
  const H = on ? "h1" : "h2";
  return (
    <div className={cn(center && "text-center")}>
      {caps && <Caps>{caps}</Caps>}
      <H
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-3xl tracking-tighter outline-none sm:text-4xl"
      >
        {title}
      </H>
      {lede && <p className="mt-3 text-base text-muted-foreground">{lede}</p>}
    </div>
  );
}

/** The two accounts a visitor can bring instead of a password, side by
 *  side as white buttons lifted off the page. A press shows the handoff a
 *  real provider would open, then lands where a sign-in lands. */
export function Providers({
  busy,
  onPick,
}: {
  busy: string | null;
  onPick: (name: string) => void;
}) {
  const p = copy.providers;
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { key: "google", icon: GoogleIcon, ...p.google },
        { key: "apple", icon: AppleIcon, ...p.apple },
      ].map((x) => {
        const on = busy === x.label;
        return (
          <button
            key={x.key}
            type="button"
            aria-label={on ? p.busy(x.label) : x.aria}
            aria-disabled={busy !== null || undefined}
            onClick={() => busy === null && onPick(x.label)}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-control bg-card text-sm font-medium shadow-soft press",
              busy === null ? "hover:shadow-soft-lg active:shadow-none" : "cursor-default",
            )}
          >
            <HugeiconsIcon
              icon={on ? Loading03Icon : x.icon}
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
              className={cn(on && "animate-spin motion-reduce:animate-none")}
            />
            {x.label}
          </button>
        );
      })}
    </div>
  );
}

/** The hairline between the providers and the fields, with its word in the
 *  middle. */
export function OrLine({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-4 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
    >
      {copy.or}
    </p>
  );
}

/** A password field with its Show inside the field's right end. While Caps
 *  Lock is on, the far end of the label's line says so on an amber chip: a
 *  line of its own would push the button under the form down the moment it
 *  appeared. */
export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  aside,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete: "current-password" | "new-password";
  aside?: ReactNode;
}) {
  const f = copy.fields;
  const [shown, setShown] = useState(false);
  const [caps, setCaps] = useState(false);
  return (
    <TextField
      id={id}
      name={autoComplete === "new-password" ? "new-password" : "password"}
      label={label}
      type={shown ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      aside={
        caps ? (
          <span
            role="status"
            className="flex h-6 items-center gap-1.5 rounded-control bg-sun/15 pr-2.5 pl-2 text-sun-ink"
          >
            <HugeiconsIcon
              icon={Alert02Icon}
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            {f.caps}
          </span>
        ) : (
          aside
        )
      }
      autoComplete={autoComplete}
      spellCheck={false}
      autoCapitalize="off"
      onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
      trailing={
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? f.hideAria : f.showAria}
          aria-pressed={shown}
          className={cn(
            "group/reveal grid w-16 place-items-center rounded-[calc(var(--radius-control)-4px)] text-sm text-muted-foreground press hover:bg-accent hover:text-foreground",
            reach,
          )}
        >
          {/* both words in one cell, so the button keeps one width */}
          {[f.show, f.hide].map((w) => (
            <span
              key={w}
              aria-hidden="true"
              className={cn(
                "[grid-area:1/1]",
                w === f.hide ? "not-group-aria-pressed/reveal:invisible" : "group-aria-pressed/reveal:invisible",
              )}
            >
              {w}
            </span>
          ))}
        </button>
      }
    />
  );
}

/** How hard a new password is to guess, as four dashes filling in the
 *  brand with the word for the step beside them, and the three rules on one
 *  row under it, each ticked as it is met. The rules are what the form checks; the
 *  dashes only advise. */
export function StrengthMeter({
  score,
  rules,
  id,
}: {
  score: number;
  rules: Rule[];
  id: string;
}) {
  return (
    <div id={id} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="grid flex-1 grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={cn(
                "h-1 rounded-full transition-colors",
                n <= score ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
        <p
          aria-live="polite"
          className="w-14 text-right text-sm text-muted-foreground"
        >
          <span className="sr-only">{copy.strengthLabel}: </span>
          {copy.strength[score]}
        </p>
      </div>
      <ul className="flex flex-wrap gap-x-3.5 gap-y-1.5">
        {rules.map((r) => (
          <li
            key={r.id}
            className={cn(
              "flex items-center gap-1.5 text-sm",
              r.met ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full transition-colors",
                r.met
                  ? "bg-iris/15 text-iris-ink"
                  : "ring-1 ring-inset ring-foreground/20",
              )}
            >
              {r.met && (
                <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.6} />
              )}
            </span>
            <span className="sr-only">{r.met ? "Met: " : "Not yet: "}</span>
            {copy.rules[r.id]}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Six cells for a code sent by email: a digit each, the cursor moving on
 *  as each is typed and back on Backspace, and a code pasted into any cell
 *  spread across all six. */
export function CodeField({
  id,
  label,
  value,
  onChange,
  error,
  digitLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  digitLabel: (i: number) => string;
}) {
  const cells = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const put = (at: number, typed: string) => {
    const clean = typed.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    clean
      .slice(0, 6 - at)
      .split("")
      .forEach((d, k) => (next[at + k] = d));
    onChange(next.join(""));
    cells.current[Math.min(5, at + clean.length)]?.focus();
  };
  const key = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) next[i] = "";
      else if (i > 0) {
        next[i - 1] = "";
        cells.current[i - 1]?.focus();
      }
      onChange(next.join(""));
    }
    if (e.key === "ArrowLeft" && i > 0) cells.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) cells.current[i + 1]?.focus();
  };
  const paste = (e: ClipboardEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();
    put(i, e.clipboardData.getData("text"));
  };
  return (
    <div
      role="group"
      aria-labelledby={`${id}-label`}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span id={`${id}-label`} className="text-sm">
          {label}
        </span>
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
      <input type="hidden" name="code" value={digits.join("")} />
      <div className="grid grid-cols-6 gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            id={i === 0 ? id : undefined}
            ref={(el) => {
              cells.current[i] = el;
            }}
            value={d}
            onChange={(e) => put(i, e.target.value.slice(-1))}
            onKeyDown={(e) => key(e, i)}
            onPaste={(e) => paste(e, i)}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={digitLabel(i + 1)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "h-10 w-full min-w-0 rounded-control bg-card text-center font-heading text-lg tabular-nums outline-none ring-inset transition-shadow",
              error
                ? "ring-2 ring-destructive focus:ring-[3px]"
                : "ring-1 ring-border hover:not-focus:ring-foreground/20 focus:ring-2 focus:ring-ring",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** A form's one call to action: the label, or a turning glyph and the word
 *  for what is happening while the demo pretends to send it. It keeps its
 *  ink while busy and stops taking presses rather than fading, as the
 *  checkout's does. */
export function BusyLabel({
  busy,
  label,
  busyLabel,
}: {
  busy: boolean;
  label: ReactNode;
  busyLabel: string;
}) {
  return busy ? (
    <>
      <HugeiconsIcon
        icon={Loading03Icon}
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
        data-icon="inline-start"
        className="animate-spin motion-reduce:animate-none"
      />
      {busyLabel}
    </>
  ) : (
    label
  );
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A panel stacked with its neighbours in one cell, shown or hidden. With no
 *  transition, so a panel shown in the same moment it is focused is not
 *  still hidden to the browser while one runs. */
export const stacked = (on: boolean) =>
  cn("[grid-area:1/1] transition-none", !on && "invisible");
