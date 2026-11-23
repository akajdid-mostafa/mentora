"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

/** The reference's last cell: one inline field closed by a round button.
 *  No backend, so the state it keeps is the only thing that proves the
 *  control is wired: a field that swallows a submit reads as decoration.
 *  As every form in the demo, it walks to its success from rest, so an empty
 *  field subscribes too; an address typed wrong says so under the field. */
const shaped = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"rest" | "sent" | "wrong">("rest");
  const address = email.trim();

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setState(address && !shaped(address) ? "wrong" : "sent");
      }}
      className="mt-5"
    >
      <div className="flex h-11 items-center rounded-control bg-card pl-4 pr-1 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring">
        <input
          // size={1}, or the input's default width becomes the row's
          // min-content and the cell cannot shrink at 320px.
          size={1}
          type="email"
          name="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("rest");
          }}
          aria-label="Email address"
          aria-invalid={state === "wrong"}
          aria-describedby="newsletter-note"
          placeholder="you@studio.com"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary",
            "press hover:bg-primary/80",
          )}
        >
          {state === "sent" ? (
            <CheckIcon className="size-4 text-primary-foreground" />
          ) : (
            <ArrowRightIcon className="size-4 text-primary-foreground" />
          )}
        </button>
      </div>

      {/* The three notes share one grid cell, the two not in play kept
          invisible, so the cell is always as tall as the longest and the
          footer under it never moves when the letter is sent. */}
      <p id="newsletter-note" aria-live="polite" className="mt-2 grid text-sm">
        {(
          [
            ["rest", "One letter a week. What shipped, and what we got wrong."],
            [
              "sent",
              address
                ? `Thanks. The Tuesday letter goes to ${address}.`
                : "Thanks. The Tuesday letter is on its way.",
            ],
            ["wrong", "That address needs an @ and a domain, like you@studio.com."],
          ] as const
        ).map(([key, note]) => (
          <span
            key={key}
            aria-hidden={key !== state || undefined}
            className={cn(
              "[grid-area:1/1]",
              key === "wrong" ? "text-destructive" : "text-muted-foreground",
              key !== state && "invisible",
            )}
          >
            {note}
          </span>
        ))}
      </p>
    </form>
  );
}
