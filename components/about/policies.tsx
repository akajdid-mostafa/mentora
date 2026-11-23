"use client";

import { useEffect, useState } from "react";
import {
  Calendar03Icon,
  Link01Icon,
  PrinterIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { policiesCopy, type Policy } from "@/components/about/copy";
import { reach } from "@/components/reach";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { useCopyLink } from "@/components/ui/use-copy-link";
import { cn } from "@/lib/utils";

const POLICIES: Policy[] = ["privacy", "terms"];
const isPolicy = (h: string): h is Policy => (POLICIES as string[]).includes(h);

export function Policies() {
  const c = policiesCopy;
  const [tab, setTab] = useState<Policy>("privacy");
  const { state, copy, reset, field } = useCopyLink();

  // The footer's Privacy and Terms, and the checkout's terms link, land here
  // by their hash; the hash picks the tab, on arrival and on every later
  // press of one of those links.
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      if (isPolicy(h)) setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const url = () => `${window.location.origin}/about#${tab}`;

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* Two doors, one place: both land on the section's head. */}
      <span id="privacy" aria-hidden="true" className="absolute top-0" />
      <span id="terms" aria-hidden="true" className="absolute top-0" />

      <div className="max-w-3xl">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <SectionHeading className="mt-5">{c.heading}</SectionHeading>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          {c.lede}
        </p>
      </div>

      {/* The toolbar over the text: which policy, when it last changed, and
          the two things a reader does with a policy besides read it. */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-b border-border pb-5 sm:mt-12">
        <TabTrack
          idPrefix="policy"
          label={c.label}
          controls="policy-panel"
          value={tab}
          onChange={(t) => {
            setTab(t);
            reset();
          }}
          options={POLICIES.map((id) => ({ id, label: c.tabs[id] }))}
        />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            {c.updated}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => printPolicy(tab)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-control bg-muted px-4 text-sm font-medium press hover:bg-secondary",
              )}
            >
              <HugeiconsIcon
                icon={PrinterIcon}
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {c.print}
            </button>
            <button
              type="button"
              onClick={() => copy(url())}
              className={cn(
                "flex h-10 items-center gap-2 rounded-control bg-muted px-4 text-sm font-medium press hover:bg-secondary",
                reach,
              )}
            >
              <HugeiconsIcon
                icon={state === "copied" ? Tick02Icon : Link01Icon}
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span aria-live="polite" className="grid">
              <span className={cn("[grid-area:1/1]", state === "copied" && "invisible")}>{c.copy}</span>
              <span className={cn("[grid-area:1/1]", state !== "copied" && "invisible")}>{c.copied}</span>
            </span>
            </button>
          </div>
        </div>
      </div>
      {state === "manual" && (
        <label className="mt-3 flex flex-col gap-1.5 text-sm sm:ml-auto sm:w-80">
          <span className="text-muted-foreground">{c.manual}</span>
          <input
            ref={field}
            readOnly
            value={url()}
            className="h-10 rounded-control bg-card px-3 font-mono text-xs ring-1 ring-inset ring-border focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      )}

      {/* Five clauses, each a row: its number and name, the short version a
          reader can stop at, and the full text. */}
      {/* Both policies laid in one cell, the other one hidden, so the
          section is always as tall as the longer of the two and nothing
          under it moves when the tab changes. */}
      <div id="policy-panel" role="tabpanel" aria-labelledby={`policy-${tab}`} className="grid">
        {POLICIES.map((id) => (
          <ol
            key={id}
            aria-hidden={id !== tab}
            inert={id !== tab}
            className={cn(
              "[grid-area:1/1]",
              id === tab ? "animate-in fade-in duration-sheet ease-sheet motion-reduce:animate-none" : "invisible",
            )}
          >
            {c.clauses[id].map((k, i) => (
              <li
                key={k.title}
                className="grid gap-3 border-b border-border py-7 sm:py-8 lg:grid-cols-[15rem_1fr_1.35fr] lg:gap-10"
              >
                <div className="flex items-baseline gap-3">
                  <Caps as="span" className="tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </Caps>
                  <h3 className="text-base font-medium">{k.title}</h3>
                </div>
                <div>
                  <Caps className="lg:hidden">{c.short}</Caps>
                  <p className="mt-1 text-lg tracking-tight lg:mt-0">{k.short}</p>
                </div>
                <p className="text-base text-muted-foreground">{k.full}</p>
              </li>
            ))}
          </ol>
        ))}
      </div>
    </section>
  );
}

/** The policy on a sheet of its own: a page that holds only its clauses,
 *  printed from a window opened for it, so the rest of the about page stays
 *  off the paper. A browser that refuses the window prints this page. */
function printPolicy(tab: Policy) {
  const c = policiesCopy;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const rows = c.clauses[tab]
    .map(
      (k, i) =>
        `<section><h2>${String(i + 1).padStart(2, "0")} ${esc(k.title)}</h2><p class="short">${esc(k.short)}</p><p>${esc(k.full)}</p></section>`,
    )
    .join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Mentora ${esc(c.tabs[tab])}</title><style>body{font:15px/1.55 system-ui,sans-serif;color:#1c1b19;max-width:40rem;margin:3rem auto;padding:0 1.5rem}h1{font-size:28px;margin:0 0 .25rem}.meta{color:#6b6862;margin:0 0 2rem}h2{font-size:15px;margin:1.75rem 0 .25rem}.short{font-weight:600;margin:.25rem 0}p{margin:.25rem 0}</style></head><body><h1>Mentora ${esc(c.tabs[tab])}</h1><p class="meta">${esc(c.updated)}</p>${rows}</body></html>`;
  const w = window.open("", "_blank", "width=720,height=900");
  if (!w) {
    window.print();
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}
