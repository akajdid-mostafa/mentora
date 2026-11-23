"use client";

import { useId, useState } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlayCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  CheckListIcon,
  Clock01Icon,
  Layers01Icon,
  Package01Icon,
  PlayListIcon,
  SquareUnlock02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { duration } from "@/components/course/courses";
import type { Lesson, Module } from "@/components/course/detail";
import { usePreview } from "@/components/course-page/preview";
import { fold, Marked } from "@/components/course-page/marked";
import { cn, count } from "@/lib/utils";

/** The syllabus, open before anyone pays: every module, and in each one the
 *  lessons with their lengths, the quiz that closes it and, at the foot, the
 *  project. The first module starts open so the list reads as something
 *  that opens. A search narrows it to the lessons that mention a word, with
 *  their modules opened around them. */
export function Syllabus({
  lang,
  modules,
  lessons,
  quizzes,
  minutes,
  skills,
  teacher,
}: {
  /** The course's language where it is not English, for its titles. */
  lang?: string;
  modules: Module[];
  lessons: number;
  quizzes: number;
  minutes: number;
  /** Offered as searches when a search finds nothing. */
  skills: string[];
  /** Whose team reviews the project. */
  teacher: string;
}) {
  const id = useId();
  const [open, setOpen] = useState<number[]>([0]);
  const [query, setQuery] = useState("");
  const show = usePreview();

  const q = fold(query.trim());
  const hits = (l: Lesson) => !q || fold(l.title).includes(q);
  // A module whose own title matches keeps every lesson; any other keeps
  // only the lessons that match, and drops out when none do.
  const shown = modules
    .map((m, i) => ({
      m,
      i,
      lessons: fold(m.title).includes(q) ? m.lessons : m.lessons.filter(hits),
    }))
    .filter((x) => x.lessons.length > 0);
  // What the line under the search counts is what it marks: lessons whose
  // own title matched, and modules whose title did, never the lessons a
  // matching module brought along with it.
  const found = q ? modules.flatMap((m) => m.lessons).filter((l) => fold(l.title).includes(q)).length : 0;
  const titled = q ? modules.filter((m) => fold(m.title).includes(q)).length : 0;
  const tally = [found ? count(found, "lesson") : "", titled ? count(titled, "module") : ""]
    .filter(Boolean)
    .join(" and ");
  const all = open.length === modules.length;

  // The course in six figures, each with the line that says what it holds.
  // Every one is worked out from the syllabus, so a rewritten course keeps a
  // true summary, and a figure that comes to nothing drops out. Each line is
  // held to about 26 characters, so it ends well short of the next column.
  const items = modules.flatMap((m) => m.lessons);
  const videos = items.filter((l) => l.kind === "video");
  const lengths = videos.map((l) => l.minutes);
  const [shortest, longest] = [Math.min(...lengths), Math.max(...lengths)];
  const free = videos.filter((l) => l.preview).length;
  const questions = items.reduce((sum, l) => sum + (l.questions ?? 0), 0);
  const project = items.some((l) => l.kind === "project");
  const facts = [
    { n: modules.length, icon: Layers01Icon, title: count(modules.length, "module"), text: "Ends on the project" },
    {
      n: lessons,
      icon: PlayListIcon,
      title: count(lessons, "lesson"),
      text: shortest === longest ? `${shortest} min each` : `${shortest} to ${longest} min each`,
    },
    { n: minutes, icon: Clock01Icon, title: `${duration(minutes)} of video`, text: "Pause to ask the tutor" },
    { n: free, icon: SquareUnlock02Icon, title: count(free, "free lesson"), text: "Watch before you pay" },
    { n: quizzes, icon: CheckListIcon, title: count(quizzes, "quiz", "quizzes"), text: `${questions} questions in all` },
    {
      n: project ? 1 : 0,
      icon: Package01Icon,
      title: "1 project",
      text: `Reviewed by ${teacher.split(" ")[0]}'s team`,
    },
  ].filter((f) => f.n > 0);

  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <div data-object>
      {/* The course in six figures, two to a row on a phone and three from
          sm, each a glyph, the figure and one line on what it holds, all at
          14px, the figure told apart by its weight and ink alone; the glyphs
          are the 20px the lesson rows carry below, and the quiz and project
          ones are theirs. A line stops 16px short of its cell, and 48px
          short of the next column, and a longer one wraps to two. Then the
          rule, and the two ways through the list, as the reviews set
          theirs. */}
      <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {facts.map((f) => (
          <li key={f.title} className="flex flex-col pr-4">
            <HugeiconsIcon icon={f.icon} size={20} strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-3 text-balance text-sm font-medium">{f.title}</p>
            <p className="mt-0.5 text-balance text-sm text-muted-foreground">{f.text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center">
        {/* flex-1 only once the row is a row: in the stacked column a phone
            gets, a zero basis would take the field's height down to its text */}
        <label className="flex h-10 items-center gap-2.5 rounded-control bg-card pl-3.5 pr-1 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring sm:flex-1">
          <MagnifyingGlassIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="sr-only">Search the syllabus</span>
          <input
            size={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a lesson"
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear the search"
              className="relative flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground press hover:bg-accent hover:text-foreground after:absolute after:-inset-1 after:content-['']"
            >
              <XMarkIcon className="size-4" />
            </button>
          )}
        </label>
        {!q && (
          <button
            type="button"
            onClick={() => setOpen(all ? [] : modules.map((_, i) => i))}
            className="h-10 shrink-0 rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
          >
            {all ? "Close every module" : "Open every module"}
          </button>
        )}
      </div>

      <p aria-live="polite" className={cn("text-sm text-muted-foreground", q ? "mt-4" : "sr-only")}>
        {q && tally && `${tally} ${found + titled === 1 ? "mentions" : "mention"} “${query.trim()}”`}
      </p>

      {q && shown.length === 0 ? (
        <div className="mt-4 rounded-lg bg-accent p-6">
          <p className="text-base font-medium">No lesson mentions “{query.trim()}”</p>
          <p className="mt-1 text-sm text-muted-foreground">Try one of the skills the course is built on.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="h-10 rounded-control bg-card px-4 text-sm shadow-soft press hover:shadow-soft-lg active:shadow-none"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <ol className="mt-6">
          {shown.map(({ m, i, lessons: rows }, k) => {
            const on = !!q || open.includes(i);
            const last = k === shown.length - 1;
            const time = m.lessons.reduce((s, l) => s + (l.kind === "video" ? l.minutes : 0), 0);
            const videos = m.lessons.filter((l) => l.kind === "video").length;
            const closer = m.lessons[m.lessons.length - 1];
            // On a phone the number sits in front of the title, in a column
            // of its own so a second line of title starts under the first.
            const head = (
              <span className="min-w-0 flex-1">
                <span className="flex gap-2 text-base font-medium">
                  <span className="shrink-0 font-heading tabular-nums text-muted-foreground sm:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span lang={lang} className="min-w-0">
                    <Marked text={m.title} query={q} />
                  </span>
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {count(videos, "lesson")} · {duration(time)}
                  {closer.kind === "quiz" ? " · quiz" : " · project"}
                </span>
              </span>
            );
            return (
              <li
                key={m.title}
                data-title={fold(m.title)}
                className="relative grid border-t first:border-t-0 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5 sm:border-t-0"
              >
                {/* The reference's rail: each module's tile, and a line
                    running down from it to the next, so the modules read as
                    one course taken in order rather than as a list. A phone
                    has no width to spare for it, so there the number moves
                    in front of the title and hairlines divide the modules. */}
                <div className="relative hidden justify-center sm:flex">
                  <span className="relative z-10 flex size-12 items-center justify-center rounded-sm bg-accent font-heading text-base tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {!last && (
                    <span aria-hidden="true" className="absolute bottom-0 top-12 w-px bg-border" />
                  )}
                </div>

                <div className={cn("min-w-0 py-2 sm:py-0", !last && "sm:pb-4")}>
                  {/* While a search holds every matching module open, the
                      header is a heading and nothing more: a button there
                      would do nothing when pressed. */}
                  {q ? (
                    <div className="py-1.5 pl-2 pr-1 sm:pl-3 sm:pr-2">{head}</div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={on}
                      aria-controls={`${id}-${i}`}
                      className="group flex w-full items-center gap-4 rounded-sm py-1.5 pl-2 pr-1 text-left transition-colors hover:bg-accent active:bg-muted sm:pl-3 sm:pr-2"
                    >
                      {head}
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-border transition-colors group-hover:bg-card"
                      >
                        <ChevronDownIcon className="size-4 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none" />
                      </span>
                    </button>
                  )}

                  {/* Eased open to its own height, as the FAQ rows are, and
                      inert while shut, so a screen reader does not read the
                      lessons of a module nobody opened. */}
                  <div
                    id={`${id}-${i}`}
                    inert={!on}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-sheet ease-sheet motion-reduce:transition-none",
                      on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    {/* the clip the easing needs, widened by the focus
                        ring's reach and taken back by the margins, so it
                        does not cut a previewable row's ring */}
                    <div className="-mx-1 overflow-hidden px-1">
                      <ul className="mb-2 mt-1 flex flex-col">
                        {(q ? rows : m.lessons).map((l) => (
                          <LessonRow
                            key={l.id}
                            lesson={l}
                            query={q}
                            lang={lang}
                            onPreview={() => show(l.id)}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// A lesson's glyph says what kind of time it asks for: watching, answering,
// or making something somebody will review.
function Kind({ kind }: { kind: Lesson["kind"] }) {
  if (kind === "video") return <PlayCircleIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />;
  return (
    <HugeiconsIcon
      icon={kind === "quiz" ? CheckListIcon : Package01Icon}
      size={20}
      strokeWidth={1.5}
      aria-hidden="true"
      className="shrink-0 text-muted-foreground"
    />
  );
}

function LessonRow({
  lesson: l,
  query,
  lang,
  onPreview,
}: {
  lesson: Lesson;
  query: string;
  lang?: string;
  onPreview: () => void;
}) {
  // A quiz is named by the page, in the page's language; a lesson and the
  // project are named by the course, in the course's.
  const title =
    l.kind === "quiz" ? (
      <Marked text={`Quiz · ${l.questions} questions`} query={query} />
    ) : (
      <>
        {l.kind === "project" && "Project · "}
        <span lang={lang}>
          <Marked text={l.title} query={query} />
        </span>
      </>
    );
  const length = l.kind === "project" ? `${l.minutes / 60} hours` : `${l.minutes} min`;
  // The chip sits in a column of its own from sm, and under the title on a
  // phone, where a column would squeeze the title to a word a line.
  const chip = (
    <span className="flex h-6 w-fit shrink-0 items-center gap-1 rounded-control bg-chip px-2 text-xs font-medium text-primary-ink">
      <PlayIcon aria-hidden="true" className="size-3" />
      Preview
    </span>
  );
  const body = (
    <>
      <Kind kind={l.kind} />
      <span className="flex min-w-0 flex-1 gap-2 text-sm">
        {/* the lesson's number in a column of its own, so a title that
            wraps starts its second line under its first */}
        {l.kind === "video" && (
          <span className="shrink-0 tabular-nums text-muted-foreground">{l.id}</span>
        )}
        <span className="min-w-0">
          {title}
          {l.preview && <span className="mt-1.5 block sm:hidden">{chip}</span>}
        </span>
      </span>
      {l.preview && <span className="hidden sm:block">{chip}</span>}
      <span className="w-14 shrink-0 text-right text-sm tabular-nums text-muted-foreground sm:w-16">
        {length}
      </span>
    </>
  );
  const row = "flex min-h-11 w-full items-center gap-3 rounded-sm py-2 pl-2 pr-1 text-left sm:pl-3 sm:pr-2";

  // A lesson free to watch is the whole row as a control, which opens the
  // player on it; the chip names what the row does. The rest are read only.
  return (
    <li data-title={fold(l.title)} className="border-b border-border/70 last:border-b-0">
      {l.preview ? (
        <button
          type="button"
          onClick={onPreview}
          aria-label={`Preview lesson ${l.id}, ${l.title}, ${length}`}
          className={cn(row, "transition-colors hover:bg-accent active:bg-muted")}
        >
          {body}
        </button>
      ) : (
        <div className={row}>{body}</div>
      )}
    </li>
  );
}

