"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link01Icon, Location01Icon, Mail01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { face, teamCopy, type Person } from "@/components/about/copy";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { useCopyLink } from "@/components/ui/use-copy-link";
import { cn } from "@/lib/utils";

export function TeamArches() {
  const c = teamCopy;
  const [open, setOpen] = useState<Person | null>(null);

  return (
    <section id="team" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="max-w-3xl">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <SectionHeading className="mt-5">{c.heading}</SectionHeading>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">{c.lede}</p>
      </div>

      {/* The reference's band starts halfway down the first row's arches, so
          the portraits rise out of it. The arches are square under their
          curve, so half an arch is an eighth of the grid's width less its
          gaps at four across, and a quarter at two; the container query reads
          that width without measuring anything. */}
      <div className="@container relative mt-14 px-4 pb-6 [--gap:1rem] [--pad:1rem] sm:mt-16 sm:px-8 sm:pb-10 sm:[--gap:1.5rem] sm:[--pad:2rem] lg:px-10 lg:pb-12 lg:[--gap:2rem] lg:[--pad:2.5rem]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 top-[calc((100cqw-2*var(--pad)-var(--gap))/4)] rounded-lg bg-accent md:top-[calc((100cqw-2*var(--pad)-2*var(--gap))/6)] lg:top-[calc((100cqw-2*var(--pad)-3*var(--gap))/8)]"
        />
        <ul className="relative grid grid-cols-2 gap-x-[var(--gap)] gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
          {c.people.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => setOpen(p)}
                aria-label={c.open(p.first)}
                aria-haspopup="dialog"
                className="group/person flex w-full flex-col rounded-t-full rounded-b-sm text-left outline-offset-4 focus-visible:outline-3 focus-visible:outline-ring/60"
              >
                <span className="relative block aspect-square w-full overflow-hidden rounded-t-full bg-muted">
                  <Image
                    src={face(p.face, 560)}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 280px, (min-width: 768px) 30vw, 45vw"
                    className="object-cover object-[50%_22%] transition-transform duration-lean ease-lean group-hover/person:scale-[1.03] motion-reduce:transition-none"
                  />
                  {/* On a phone the name runs the cell's width, so the
                      profile's door moves onto the arch's foot. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-card shadow-soft sm:hidden"
                  >
                    <PlusIcon className="size-4" />
                  </span>
                </span>
                {/* name and role, ruled off on the right as the reference
                    rules its columns, with the profile's door at the rule */}
                <span className="mt-4 flex items-start gap-3 sm:mt-5 sm:border-r sm:border-border sm:pr-4">
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium lg:truncate">{p.name}</span>
                    <Caps as="span" className="mt-1.5 block lg:truncate">
                      {p.role}
                    </Caps>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden size-9 shrink-0 items-center justify-center rounded-control bg-card text-foreground shadow-soft transition-colors group-hover/person:bg-primary group-hover/person:text-primary-foreground sm:flex"
                  >
                    <PlusIcon className="size-4" />
                  </span>
                </span>
              </button>
            </li>
          ))}

          <li className="md:col-span-2 lg:col-span-1">
            <Hiring />
          </li>
        </ul>
      </div>

      <Profile person={open} onClose={() => setOpen(null)} />
      {/* Read apart from the grid, so the page is still built ahead of time
          with every portrait in it and only this reads the address. */}
      <Suspense fallback={null}>
        <AskedPerson onAsk={setOpen} />
      </Suspense>
    </section>
  );
}

/** The cell the reference leaves empty: where the eighth face would be, the
 *  roles that would bring one. */
function Hiring() {
  const h = teamCopy.hiring;
  return (
    <div className="flex h-full flex-col rounded-lg bg-card p-3 shadow-soft min-[360px]:p-4 sm:p-7 lg:rounded-t-[10rem] lg:pt-12">
      <p className="flex lg:justify-center">
        <span className="inline-flex h-7 items-center gap-2 rounded-control bg-chip pl-2.5 pr-3 text-xs font-medium text-primary-ink">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary-ink" />
          {h.tag}
        </span>
      </p>
      <h3 className="mt-4 text-xl tracking-tight sm:text-2xl lg:text-center">{h.title}</h3>
      {/* On a phone the cell is a portrait's width, so it names the count
          and the door; the roles wait behind it. */}
      <ul className="mt-5 flex flex-col gap-3 max-sm:hidden">
        {h.roles.map((r) => (
          <li key={r.title} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium">{r.title}</span>
            <span className="shrink-0 text-muted-foreground">{r.where}</span>
          </li>
        ))}
      </ul>
      {/* the door stands at the cell's foot, level with the names beside
          it, and never closer than 24px to the words above */}
      <div className="mt-auto pt-6">
        {/* three widths of the same door: a 320 phone's cell holds one word
            beside the arrow, so the padding stays even rather than trimmed
            at the arrow's side */}
        <Button
          render={
            <Link href={h.cta.href}>
              <span className="min-[360px]:hidden">{h.cta.short}</span>
              <span className="max-[359px]:hidden sm:hidden">{h.cta.mid}</span>
              <span className="max-sm:hidden">{h.cta.label}</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          }
          className="w-full px-2.5 sm:px-5"
        />
      </div>
    </div>
  );
}

/** One person, opened over the page: the arch again at a larger size, the
 *  bio, what they did before, what to ask them, and two ways to reach them. */
/** A profile link someone copied opens on its person: `?person=` names
 *  them, and the dialog opens once the page has hydrated. */
function AskedPerson({ onAsk }: { onAsk: (p: Person) => void }) {
  const asked = useSearchParams().get("person");
  useEffect(() => {
    const p = teamCopy.people.find((x) => x.slug === asked);
    if (p) onAsk(p);
  }, [asked, onAsk]);
  return null;
}

function Profile({ person, onClose }: { person: Person | null; onClose: () => void }) {
  const d = teamCopy.dialog;
  // The last person shown, so the dialog keeps its words while it closes.
  const [shown, setShown] = useState<Person | null>(person);
  if (person && person !== shown) setShown(person);
  const { state, copy, reset, field } = useCopyLink();
  const url = shown ? `${typeof window === "undefined" ? "" : window.location.origin}/about?person=${shown.slug}#team` : "";

  return (
    <Dialog
      open={person !== null}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        {shown && (
          <div className="grid overflow-y-auto sm:grid-cols-[16rem_1fr]">
            <div className="relative hidden bg-accent p-6 pb-0 sm:flex sm:items-end">
              <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-full">
                <Image
                  src={face(shown.face, 448)}
                  alt={`${shown.name}, ${shown.role}`}
                  fill
                  unoptimized
                  sizes="224px"
                  className="object-cover object-[50%_20%]"
                />
              </span>
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-full sm:hidden">
                  <Image src={face(shown.face, 112)} alt="" fill unoptimized sizes="56px" className="object-cover object-[50%_20%]" />
                </span>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-2xl tracking-tight">{shown.name}</DialogTitle>
                  <DialogDescription className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Caps as="span">{shown.role}</Caps>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={1.8} aria-hidden="true" />
                      {shown.city}
                    </span>
                  </DialogDescription>
                </div>
                <DialogCloseButton className="-mr-2 -mt-2" />
              </div>

              <p className="mt-6 text-base">{shown.bio}</p>

              <dl className="mt-6 flex flex-col gap-5 border-t border-border pt-6">
                <div>
                  <Caps as="dt">{d.before}</Caps>
                  <dd className="mt-1.5 text-sm">{shown.before}</dd>
                </div>
                <div>
                  <Caps as="dt">{d.ask}</Caps>
                  <dd className="mt-2.5 flex flex-wrap gap-2">
                    {shown.askAbout.map((a) => (
                      <span key={a} className="flex h-8 items-center rounded-control bg-muted px-3 text-sm">
                        {a}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  render={
                    <Link href={`/contact?topic=team&person=${shown.slug}`}>
                      <HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={1.8} data-icon="inline-start" aria-hidden="true" />
                      {d.write(shown.first)}
                    </Link>
                  }
                />
                <button
                  type="button"
                  onClick={() => copy(url)}
                  className={cn(
                    "flex h-10 items-center justify-center gap-2 rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none",
                    reach,
                  )}
                >
                  <HugeiconsIcon icon={state === "copied" ? Tick02Icon : Link01Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
                  {/* both labels in one cell, so the button keeps its width */}
                  <span aria-live="polite" className="grid">
                    <span className={cn("[grid-area:1/1]", state === "copied" && "invisible")}>{d.share}</span>
                    <span className={cn("[grid-area:1/1]", state !== "copied" && "invisible")}>{d.copied}</span>
                  </span>
                </button>
              </div>
              {state === "manual" && (
                <label className="mt-3 flex flex-col gap-1.5 text-sm">
                  <span className="text-muted-foreground">{d.manual}</span>
                  <input
                    ref={field}
                    readOnly
                    value={url}
                    className="h-10 rounded-control bg-card px-3 font-mono text-xs ring-1 ring-inset ring-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
