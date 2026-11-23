"use client";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { Lesson, Module } from "@/components/course/detail";
import { clock, learnCopy } from "@/components/learn/copy";
import { cn } from "@/lib/utils";

export type Access = "full" | "video" | "locked";

/** The syllabus one module at a time, the way the reference pages one day at
 *  a time: the module named in split weight with a stepper beside it, and a
 *  row a lesson under it. The row that is open stands up off the panel in
 *  white and carries what the others leave out: the minute it stopped at,
 *  the notes on it and a rule of how much of it has played. */
export function LessonToc({
  modules,
  shown,
  onShown,
  current,
  done,
  at,
  live,
  access,
  notes,
  lang,
  onOpen,
}: {
  modules: Module[];
  shown: number;
  onShown: (i: number) => void;
  current: string;
  done: Set<string>;
  /** Where each video stopped, in seconds. */
  at: Record<string, number>;
  /** The clock of the lesson on screen, so its ring fills as it plays. */
  live: { at: number; playing: boolean };
  access: (l: Lesson) => Access;
  notes: (lesson: string) => number;
  lang?: string;
  onOpen: (id: string) => void;
}) {
  const m = modules[shown];
  const head = learnCopy.contents.module(shown + 1, modules.length);

  return (
    <div data-object className="flex h-full flex-col">
      <div className="flex items-start gap-3 px-5 pb-3 pt-1">
        <div className="min-w-0 flex-1 pt-1.5">
          <p className="text-base">
            <span className="font-medium">{head.lead}</span>
            <span className="text-muted-foreground">{head.rest}</span>
          </p>
          <p lang={lang} className="mt-0.5 line-clamp-2 text-balance text-sm text-muted-foreground">
            {m.title}
          </p>
        </div>
        {/* The reference's stepper, as two buttons a finger can find. */}
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onShown(shown - 1)}
            disabled={shown === 0}
            aria-label={learnCopy.contents.previous}
            className="flex size-10 items-center justify-center rounded-control press hover:bg-muted disabled:pointer-events-none disabled:text-muted-foreground"
          >
            <ChevronUpIcon aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onShown(shown + 1)}
            disabled={shown === modules.length - 1}
            aria-label={learnCopy.contents.nextModule}
            className="flex size-10 items-center justify-center rounded-control press hover:bg-muted disabled:pointer-events-none disabled:text-muted-foreground"
          >
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <ol className="no-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2 pb-2">
        {m.lessons.map((l) => {
          const open = l.id === current;
          const shut = access(l) === "locked";
          const total = l.minutes * 60;
          const stood = open ? live.at : (at[l.id] ?? 0);
          const state: GlyphState = done.has(l.id)
            ? "done"
            : shut
              ? "locked"
              : l.kind === "video" && stood > 0
                ? "progress"
                : "todo";
          const count = l.kind === "video" ? notes(l.id) : 0;
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onOpen(l.id)}
                aria-current={open ? "step" : undefined}
                // The ring inside the row, as in the transcript: the list
                // scrolls, and its edge would cut a ring drawn outside.
                className="group/row flex w-full gap-3 rounded-sm bg-background px-3 py-3 text-left transition-[background-color,box-shadow] focus-visible:-outline-offset-2 aria-[current=step]:bg-card aria-[current=step]:shadow-soft aria-[current=step]:hover:shadow-soft-lg aria-[current=step]:active:shadow-none not-aria-[current=step]:hover:bg-card not-aria-[current=step]:active:bg-accent"
              >
                <Glyph state={state} fraction={total ? stood / total : 0} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3">
                    <span
                      lang={lang}
                      className={cn(
                        "line-clamp-2 min-w-0 flex-1 text-balance text-sm font-medium",
                        shut && "text-muted-foreground",
                      )}
                    >
                      {l.kind === "quiz" ? learnCopy.contents.quiz : l.title}
                    </span>
                    <span
                      className="shrink-0 text-sm tabular-nums text-muted-foreground group-aria-[current=step]/row:text-foreground"
                    >
                      {learnCopy.contents.length(l.minutes)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {l.kind === "video"
                      ? learnCopy.contents.sub.video(l.id)
                      : l.kind === "quiz"
                        ? learnCopy.contents.sub.quiz(l.questions ?? 0)
                        : learnCopy.contents.sub.project}
                  </span>

                  {/* The reference's open row: two chips and what it adds,
                      here the rule of how far the lesson has played. */}
                  {open && (
                    <>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        <span className="inline-flex h-7 items-center rounded-control bg-iris/15 px-2.5 text-xs font-medium text-iris-ink">
                          {shut
                            ? learnCopy.contents.state.locked
                            : done.has(l.id)
                              ? learnCopy.contents.state.done
                              : l.kind === "video" && stood > 0
                                ? learnCopy.contents.watched(clock(stood), clock(total))
                                : learnCopy.contents.state.open}
                        </span>
                        {count > 0 && (
                          <span className="inline-flex h-7 items-center rounded-control bg-muted px-2.5 text-xs font-medium">
                            {learnCopy.contents.notes(count)}
                          </span>
                        )}
                      </span>
                      {l.kind === "video" && !shut && (
                        <span aria-hidden="true" className="mt-3 block h-1 overflow-hidden rounded-full bg-muted">
                          {/* The length is the clock's: a little over its 250ms
                              tick, so the rule runs on between ticks. */}
                          <span
                            className="block h-full rounded-full bg-iris transition-[width] ease-linear motion-reduce:transition-none"
                            style={{
                              width: `${Math.min(100, (stood / total) * 100)}%`,
                              transitionDuration: "300ms",
                            }}
                          />
                        </span>
                      )}
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export type GlyphState = "done" | "progress" | "todo" | "locked";

/** The reference's status mark, a line box tall: a filled tick once an item
 *  is finished, a ring that fills as a video plays, a broken ring for one
 *  not begun, and a lock for one that opens on enrolling. */
export function Glyph({ state, fraction }: { state: GlyphState; fraction: number }) {
  return (
    <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center">
      {state === "done" ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card">
          <CheckIcon className="size-3" strokeWidth={2.5} />
        </span>
      ) : state === "locked" ? (
        <LockClosedIcon className="size-4 text-muted-foreground" />
      ) : (
        <svg viewBox="0 0 20 20" className="size-5 -rotate-90">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="1.75"
            strokeDasharray={state === "todo" ? "2.6 2.4" : undefined}
            className="stroke-muted-foreground/50"
          />
          {state === "progress" && (
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              strokeWidth="2.25"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - Math.max(0.04, Math.min(1, fraction))}
              className="stroke-iris"
            />
          )}
        </svg>
      )}
    </span>
  );
}
