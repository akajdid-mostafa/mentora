"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  CheckmarkBadge01Icon,
  Mortarboard01Icon,
  UserCheck01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { face, standardsCopy, teamCopy } from "@/components/about/copy";
import { aiGlyph } from "@/components/ui/ai-icon";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// One glyph a standard, in the order the four run. The third is the site's
// AI glyph, since that check is about what the model drafted.
const ICON: IconSvgElement[] = [UserCheck01Icon, Video01Icon, aiGlyph, Mortarboard01Icon];

export function StandardsPanel() {
  const c = standardsCopy;
  const [at, setAt] = useState(0);
  const s = c.standards[at];
  const by = teamCopy.people.find((p) => p.slug === s.by)!;
  const of = c.standards.length;

  return (
    <section id="standards" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="max-w-4xl">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <SectionHeading className="mt-5 lg:max-w-4xl">
          {c.heading[0]}
          <Highlight>{c.heading[1]}</Highlight>
          {c.heading[2]}
        </SectionHeading>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">{c.lede}</p>
      </div>

      {/* The reference's frame: one tinted slab holding a white card over its
          bar on the left and the photograph on the right, both inset by the
          frame's own padding. */}
      <div className="mt-12 grid gap-2 rounded-lg bg-accent p-2 sm:mt-14 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={c.counter(at + 1, of)}
            className="flex flex-1 flex-col rounded-[calc(var(--radius-lg)-0.5rem)] bg-card p-6 sm:p-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <span className="flex h-8 items-center gap-2 rounded-control bg-accent pl-2.5 pr-3 text-sm">
                <HugeiconsIcon icon={ICON[at]} size={16} strokeWidth={1.8} aria-hidden="true" />
                {s.tag}
              </span>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="mr-1 font-heading text-lg tabular-nums tracking-tight">
                  {c.counter(at + 1, of)}
                </span>
                <Step dir="prev" label={c.prev} disabled={at === 0} onClick={() => setAt(at - 1)} />
                <Step dir="next" label={c.next} disabled={at === of - 1} onClick={() => setAt(at + 1)} />
              </div>
            </div>

            {/* One height whichever standard is shown, so the page under the
                frame holds still as the four are stepped through. */}
            <div key={at} aria-live="polite" className="flex flex-1 flex-col animate-in fade-in duration-sheet ease-sheet motion-reduce:animate-none">
              <h3 className="mt-8 max-w-md text-2xl tracking-tight sm:mt-10 sm:text-3xl sm:tracking-tighter">{s.title}</h3>
              <p className="mt-4 min-h-[6rem] max-w-md text-base text-muted-foreground sm:min-h-[4.5rem]">{s.body}</p>

              <div className="mt-10 min-h-[7.5rem] lg:mt-auto lg:min-h-0 lg:pt-10">
                <p className="text-base font-medium">{c.checksLabel}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.checks.map((k) => (
                    <li key={k} className="flex h-8 items-center gap-1.5 rounded-control bg-muted px-3 text-sm">
                      <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} strokeWidth={1.8} aria-hidden="true" className="text-iris-ink" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* the reference's bar at the card's foot, the section's one door */}
          <Link
            href={c.cta.href}
            className="flex h-12 items-center justify-center gap-2 rounded-[calc(var(--radius-lg)-0.5rem)] bg-primary text-sm font-medium text-primary-foreground press hover:bg-primary/80"
          >
            {c.cta.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/* The photograph, with the person who holds this check quoted over
            its corner on glass: a frosted panel rather than ink on the
            picture, since ink straight onto a photograph fails somewhere. */}
        <div className="relative min-h-[26rem] overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] sm:min-h-[32rem] lg:min-h-[38rem]">
          <Image
            src={c.photo}
            alt={c.photoAlt}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) calc(50vw - 40px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 64px)"
            className="object-cover object-[50%_40%]"
          />
          <figure
            key={s.by}
            className="absolute inset-x-3 bottom-3 rounded-lg bg-background/75 p-5 shadow-soft-lg backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-sheet ease-sheet motion-reduce:animate-none sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[22rem] sm:p-6"
          >
            <blockquote className="text-base">“{s.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image src={face(by.face, 80)} alt="" fill unoptimized sizes="40px" className="object-cover object-[50%_20%]" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{by.name}</span>
                {/* Contrast: 4.09–4.17:1, the muted ink on this frosted panel
                    over the photograph (sampled #e0d9d8–#e2dbda), under AA's
                    4.5:1 for 12px. Kept for the caption's tone; text-foreground/70
                    reads 5.5:1 here. */}
                <Caps as="span" className="mt-0.5 block truncate">
                  {by.role}
                </Caps>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Step({
  dir,
  label,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-control bg-muted press after:absolute after:-inset-0.5 after:content-[''] hover:bg-secondary",
        "disabled:cursor-not-allowed disabled:bg-accent disabled:text-muted-foreground disabled:hover:bg-accent",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
