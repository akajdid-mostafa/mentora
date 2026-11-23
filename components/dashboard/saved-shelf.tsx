"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { CourseCard } from "@/components/course/course-card";
import { catalogue, courseById, type Course } from "@/components/course/courses";
import { clearRecent, useRecent } from "@/components/course/recent";
import { toggleSaved, useSaved } from "@/components/course/saved";
import { dashCopy } from "@/components/dashboard/copy";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

const copy = dashCopy.saved;

// Every course the catalogue lists, the home page's "Browse all 12,400".
const ALL = Object.values(catalogue).reduce((n, x) => n + x, 0);

// The catalogue grid's columns and the image sizes they ask for.
const sizes = "(min-width: 1280px) 290px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw";

type Tab = "saved" | "recent";

export function SavedShelf() {
  const saved = useSaved();
  const recent = useRecent();
  const [tab, setTab] = useState<Tab>("saved");
  const [gone, setGone] = useState<Course | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undo = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // the course Undo put back, whose Save takes focus once its card is back
  const restored = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // A control that takes itself off the page hands focus on, or a keyboard
  // user starts again from the top: an unsaved card to the Undo that stands
  // in its place, and Undo to the Save of the card it brought back.
  useEffect(() => {
    if (gone) undo.current?.focus();
  }, [gone]);
  useEffect(() => {
    if (!restored.current) return;
    panel.current?.querySelector<HTMLElement>(`[data-course="${restored.current}"] button[aria-pressed]`)?.focus();
    restored.current = null;
  }, [saved]);

  // newest first, as the recent list already is
  const kept = [...saved].reverse().flatMap((id) => courseById(id) ?? []);
  const viewed = recent.flatMap((v) => courseById(v.id) ?? []);
  const shown = tab === "saved" ? kept : viewed;

  // Unsaving from this list takes the card away, so the list says so and
  // offers it back for a few seconds, as the notes tab does for a note.
  const unsaved = (c: Course) => {
    setGone(c);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (document.activeElement === undo.current) document.getElementById("saved-tab-saved")?.focus();
      setGone(null);
    }, 6000);
  };

  return (
    <section id="saved" aria-labelledby="saved-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <SectionHeading className="mt-5">
        <span id="saved-title">
          {copy.title[0]} <Highlight>{copy.title[1]}</Highlight>
        </span>
      </SectionHeading>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <TabTrack
          label={copy.tabs}
          idPrefix="saved-tab"
          controls="saved-panel"
          options={[
            { id: "saved", label: copy.saved, count: kept.length },
            { id: "recent", label: copy.recent, count: viewed.length },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === "recent" && viewed.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearRecent();
              document.getElementById("saved-tab-recent")?.focus();
            }}
            className="h-10 rounded-control px-3 text-sm font-medium text-muted-foreground press hover:bg-accent hover:text-foreground"
          >
            {copy.clear}
          </button>
        )}
      </div>

      <div ref={panel} id="saved-panel" role="tabpanel" aria-labelledby={`saved-tab-${tab}`} className="mt-6">
        {tab === "saved" && gone && (
          <p role="status" className="mb-6 flex items-center gap-3 rounded-sm bg-accent py-1 pl-4 pr-1 text-sm">
            {copy.removed(gone.title)}
            <button
              ref={undo}
              type="button"
              onClick={() => {
                toggleSaved(gone.id);
                restored.current = gone.id;
                setGone(null);
              }}
              className="ml-auto h-10 rounded-control px-3 font-medium press hover:bg-muted"
            >
              {copy.undo}
            </button>
          </p>
        )}

        {shown.length === 0 ? (
          <div className="flex flex-col items-start gap-6 rounded-lg bg-accent px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="max-w-md text-base text-muted-foreground">
              {tab === "saved" ? copy.emptySaved : copy.emptyRecent}
            </p>
            <Button className="w-fit shrink-0" render={<Link href="/courses" />}>
              {copy.browse}
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          </div>
        ) : (
          <ul
            aria-label={tab === "saved" ? copy.saved : copy.recent}
            className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {shown.map((c) => (
              <li key={c.id} data-course={c.id}>
                <CourseCard
                  course={c}
                  sizes={sizes}
                  onSave={
                    tab === "saved"
                      ? (on) => {
                          if (!on) unsaved(c);
                        }
                      : undefined
                  }
                />
              </li>
            ))}
            <li className={door(shown.length)}>
              <Door tab={tab} />
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}

/** The slot after the last card is the door to the catalogue, as the home
 *  shelf's is, but only where it has a card beside it: at a width where the
 *  cards fill their last row, it would start a row of its own. */
function door(n: number) {
  return cn(
    "min-h-72",
    n % 2 === 0 && "sm:max-lg:hidden",
    n % 3 === 0 && "lg:max-xl:hidden",
    n % 4 === 0 && "xl:hidden",
  );
}

/** The home shelf's door slot: the catalogue's size in the heading face, what
 *  keeps a course in this list, and the way in. */
function Door({ tab }: { tab: Tab }) {
  return (
    <div className="flex h-full flex-col justify-between gap-10 rounded-lg bg-accent p-6">
      <div>
        <p className="font-heading text-5xl tracking-tighter tabular-nums text-primary-ink">
          {ALL.toLocaleString("en-US")}
        </p>
        <p className="mt-3 text-base font-medium">{copy.door.label}</p>
        <p className="mt-1 text-base text-muted-foreground">
          {tab === "saved" ? copy.door.saved : copy.door.recent}
        </p>
      </div>
      <Button className="w-fit" render={<Link href="/courses" />}>
        {copy.browse}
        <ArrowUpRightIcon data-icon="inline-end" />
      </Button>
    </div>
  );
}
