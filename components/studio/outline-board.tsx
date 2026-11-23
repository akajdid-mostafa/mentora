"use client";

import { useEffect, useRef, useState, type DragEvent, type PointerEvent } from "react";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { span } from "@/components/dashboard/copy";
import { reach } from "@/components/reach";
import { outlineCopy as copy } from "@/components/studio/copy";
import {
  addLesson,
  countsOf,
  deleteLesson,
  draftFrom,
  minutesAt,
  moveLesson,
  redraftChapter,
  redraftLesson,
  renameChapter,
  renameDraft,
  rewriteLesson,
  useStudio,
  type Card,
  type Draft,
  type Length,
} from "@/components/studio/drafts";
import { matchOutline, samples } from "@/components/studio/outlines";
import { RadioPills } from "@/components/studio/radio-pills";
import { SwapLabel } from "@/components/studio/swap-label";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const STEP_MS = 380;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The two states a lesson's card is drawn in, and the legend's swatches of
// them: the instructor's words on a plain white card, the studio's draft in
// a dashed outline of its iris over a wash of it.
const YOURS_CARD = "bg-card ring-1 ring-inset ring-border";
// The dashes are a pseudo-element's border rather than the card's outline,
// so the outline stays free for the focus ring.
const DRAFTED_CARD =
  "relative bg-[color-mix(in_oklab,var(--iris)_7%,var(--card))] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border-[1.5px] before:border-dashed before:border-[color-mix(in_oklab,var(--iris),white_10%)] before:content-['']";

// A chapter's title: a box a little wider and taller than its words, pulled
// back by as much, so the words sit where the column's other lines start.
const TITLE_BOX = "-mx-1 -my-0.5 block w-[calc(100%+0.5rem)] rounded-sm px-1 py-0.5 text-balance";

// The board's titles are headings the instructor writes and rewrites, so no
// wording can be fitted to the column ahead of them: a title that wraps is
// balanced instead, its last line never a stub under the first. A field open
// on one balances the same way, so the words keep their lines as it opens.
const TITLE = "text-balance";

// A status is a line, or two sentences that stand on a line each on a phone
// and run on from sm.
type Status = { text: string | string[]; undo?: () => void };
type Drop = { chapter: number; index: number };

export function OutlineBoard() {
  const { open } = useStudio();
  const [brief, setBrief] = useState(open?.brief ?? "");
  const [length, setLength] = useState<Length>("standard");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  // While a draft is being written, how many of its chapters have arrived.
  const [reveal, setReveal] = useState<{ id: string; shown: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const openId = open?.id;

  // A draft opened from the overview brings its own line into the field,
  // when a different draft opens and never while the line is typed.
  const [shown, setShown] = useState(openId);
  if (openId !== shown) {
    setShown(openId);
    setBrief(open?.brief ?? "");
  }

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  // The teach page's "Open the studio" sends the course its applicant just
  // described as `?brief=`: the field opens holding it, with the caret in it.
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("brief");
    if (!asked) return;
    const frame = requestAnimationFrame(() => {
      setBrief(asked);
      document.getElementById("brief")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const draft = (line = brief) => {
    if (reveal) return;
    const text = line.trim();
    if (text.length < 20) {
      setError(copy.status.short);
      return;
    }
    setError(null);
    const match = matchOutline(text);
    if (!match) {
      setNote(copy.status.none);
      return;
    }
    const d = draftFrom(match, text, length);
    const done = () => {
      setReveal(null);
      setNote(
        text === match.brief || text.toLowerCase().includes(match.title.toLowerCase())
          ? copy.status.drafted(match.title)
          : copy.status.closest(match.title),
      );
    };
    if (reduced()) return done();
    setReveal({ id: d.id, shown: 0 });
    setNote(copy.status.drafting(1, d.chapters.length));
    let shown = 0;
    timer.current = setInterval(() => {
      shown += 1;
      if (shown >= d.chapters.length) {
        if (timer.current) clearInterval(timer.current);
        done();
        return;
      }
      setReveal({ id: d.id, shown });
      setNote(copy.status.drafting(shown + 1, d.chapters.length));
    }, STEP_MS);
  };

  const drafting = reveal !== null;

  return (
    <section id="outline" aria-labelledby="outline-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* The reference's head: the step and the heading on the left, the
          lede and its one bullet on the right, from lg. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">
            <span id="outline-title">
              {copy.heading.before} <Highlight>{copy.heading.marked}</Highlight> {copy.heading.after}
            </span>
          </SectionHeading>
        </div>
        <div className="lg:pt-10">
          <p className="max-w-[28rem] text-base text-muted-foreground">{copy.lede}</p>
          <p className="mt-4 flex items-start gap-2.5 text-base">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
            {copy.promise}
          </p>
        </div>
      </div>

      {/* The brief's field, as a prompt: the line, then the one setting the
          studio can honour and the button, inside one hairline. */}
      <div className="mt-24">
        <div
          className={cn(
            "rounded-lg bg-card p-2 ring-1 ring-inset ring-border transition-shadow focus-within:ring-2 focus-within:ring-ring hover:not-focus-within:ring-foreground/20",
            error && "ring-2 ring-destructive focus-within:ring-destructive hover:not-focus-within:ring-destructive",
          )}
        >
          <label htmlFor="brief" className="sr-only">
            {copy.field}
          </label>
          <textarea
            id="brief"
            value={brief}
            rows={2}
            placeholder={copy.placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby="brief-status"
            onChange={(e) => {
              setBrief(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) draft();
            }}
            className="field-sizing-content block min-h-[calc(2lh+1rem)] w-full resize-none bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground"
          />
          {/* The one setting the draft takes, named and drawn as radios with
              what each length means, so it reads as a choice for the button
              beside it rather than as tabs. */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-2 pb-1">
            <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 sm:w-auto">
              <span id="length-label" className="pl-2 text-sm text-muted-foreground">
                {copy.length.label}
              </span>
              <RadioPills<Length>
                fill
                labelledBy="length-label"
                idPrefix="length"
                value={length}
                onChange={setLength}
                options={(["short", "standard", "long"] as const).map((id) => ({
                  id,
                  label: copy.length[id],
                  hint: copy.length.minutes(minutesAt(id)),
                }))}
              />
            </div>
            <Button size="lg" onClick={() => draft()} disabled={drafting} focusableWhenDisabled className="w-full sm:w-auto">
              <AiIcon size={16} />
              <SwapLabel on={drafting} idle={copy.draft} busy={copy.drafting} />
            </Button>
          </div>
        </div>
        {/* The samples wrap under the first one; on a phone "Try" stands over
            them and each takes the full width, as the length pills do. */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          <span className="text-sm text-muted-foreground sm:flex sm:h-10 sm:items-center">{copy.try}</span>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={drafting}
                onClick={() => {
                  setBrief(s.brief);
                  draft(s.brief);
                }}
                className="min-h-10 rounded-control bg-card px-4 py-2.5 text-left text-sm ring-1 ring-inset ring-border press hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-card sm:h-10 sm:py-0"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
        <p id="brief-status" aria-live="polite" className={cn("mt-4 min-h-6 text-sm", error ? "text-destructive" : "text-muted-foreground")}>
          {error ?? note ?? ""}
        </p>
      </div>

      {open ? (
        <Board draft={open} reveal={reveal && reveal.id === open.id ? reveal.shown : null} />
      ) : (
        <div className="mt-10 rounded-lg bg-accent px-6 py-12 text-center">
          <p className="mx-auto max-w-md text-base text-muted-foreground">{copy.board.empty}</p>
        </div>
      )}
    </section>
  );
}

function outlineText(d: Draft) {
  return [
    `# ${d.title}`,
    d.brief,
    ...d.chapters.flatMap((c, ci) => [
      "",
      `## ${ci + 1}. ${c.title}`,
      ...c.lessons.map((l, li) => `${ci + 1}.${li + 1} ${l.title} (${l.minutes} min)${l.yours ? "" : " [drafted]"}`),
    ]),
  ].join("\n");
}

function Board({ draft: d, reveal }: { draft: Draft; reveal: number | null }) {
  const counts = countsOf(d);
  const [status, setStatus] = useState<Status | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<string | null>(null);
  const [drop, setDrop] = useState<Drop | null>(null);
  // A lesson added and never named stays in storage when the page is left
  // while it is being written, so the board takes it out when it is next seen.
  const unnamed = editing ? undefined : d.chapters.flatMap((c) => c.lessons).find((l) => !l.title)?.id;
  useEffect(() => {
    if (unnamed) deleteLesson(d.id, unnamed);
  }, [d.id, unnamed]);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  // Whether the board sits at either end of its scroll, for the arrows.
  const [ends, setEnds] = useState({ start: true, end: false });
  const pan = useRef<{ x: number; left: number } | null>(null);
  const [panning, setPanning] = useState(false);

  useEffect(
    () => () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    },
    [],
  );

  const measure = () => {
    const r = rail.current;
    if (!r) return;
    const start = r.scrollLeft < 4;
    const end = r.scrollLeft + r.clientWidth > r.scrollWidth - 4;
    setEnds((e) => (e.start === start && e.end === end ? e : { start, end }));
  };

  // A board that fits the window has no end to scroll to; one that grows or
  // shrinks with its lessons is measured again.
  useEffect(() => {
    const r = rail.current;
    if (!r) return;
    measure();
    const seen = new ResizeObserver(measure);
    seen.observe(r);
    if (r.firstElementChild) seen.observe(r.firstElementChild);
    return () => seen.disconnect();
  }, []);

  // One column and its gap a press.
  const step = (by: number) => {
    const r = rail.current;
    const column = r?.querySelector<HTMLElement>(":scope > ol > li");
    if (!r || !column) return;
    r.scrollBy({ left: by * (column.offsetWidth + 16), behavior: reduced() ? "auto" : "smooth" });
  };

  // A mouse pressed on the board's empty ground drags it sideways, as a
  // kanban board does; on a card, a control or a field it does what that
  // does. A finger scrolls the board natively.
  const grab = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, textarea, input, [data-card]")) return;
    pan.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
    setPanning(true);
  };
  const drag = (e: PointerEvent<HTMLDivElement>) => {
    if (pan.current) e.currentTarget.scrollLeft = pan.current.left - (e.clientX - pan.current.x);
  };
  const release = (e: PointerEvent<HTMLDivElement>) => {
    if (!pan.current) return;
    pan.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setPanning(false);
  };

  // A new lesson, or one whose menu said Rewrite, opens for writing; a card
  // that moved takes the caret back once it has landed.
  const focusCard = (id: string) =>
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-card-button="${id}"]`)?.focus());

  const say = (text: Status["text"], undo?: () => void) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setStatus({ text, undo });
    if (undo) undoTimer.current = setTimeout(() => setStatus(null), 6000);
  };

  const pulse = (ids: string[], then: () => void) => {
    if (reduced()) return then();
    setBusy(new Set(ids));
    setTimeout(() => {
      then();
      setBusy(new Set());
    }, 650);
  };

  const place = (id: string) => {
    for (const [ci, c] of d.chapters.entries()) {
      const li = c.lessons.findIndex((l) => l.id === id);
      if (li >= 0) return { ci, li };
    }
    return null;
  };

  const move = (id: string, chapter: number, to: number) => {
    const from = place(id);
    if (!from) return;
    const before = `${from.ci + 1}.${from.li + 1}`;
    moveLesson(d.id, id, chapter, to);
    say(copy.lesson.moved(before, `${chapter + 1}.${Math.min(to, d.chapters[chapter].lessons.length - (from.ci === chapter ? 1 : 0)) + 1}`));
    focusCard(id);
  };

  const remove = (id: string) => {
    const at = place(id);
    const undo = deleteLesson(d.id, id);
    if (!undo || !at) return;
    say(copy.lesson.removed(`${at.ci + 1}.${at.li + 1}`), () => {
      undo();
      setStatus(null);
      focusCard(id);
    });
  };

  const copyOutline = async () => {
    try {
      await navigator.clipboard.writeText(outlineText(d));
      say(copy.board.copied);
    } catch {
      say(copy.board.blocked);
    }
  };

  // Where a dragged card would land in a chapter: before the first card
  // whose middle is below the pointer.
  const over = (e: DragEvent<HTMLElement>, chapter: number) => {
    if (!dragging) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const cards = [...e.currentTarget.querySelectorAll<HTMLElement>("[data-card]")].filter(
      (el) => el.dataset.card !== dragging,
    );
    const index = cards.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    const next = { chapter, index: index < 0 ? cards.length : index };
    if (!drop || drop.chapter !== next.chapter || drop.index !== next.index) setDrop(next);
  };

  const land = () => {
    if (dragging && drop) move(dragging, drop.chapter, drop.index);
    setDragging(null);
    setDrop(null);
  };

  return (
    <div className="mt-10">
      {/* The board's head: the open draft by name, what it holds, the
          legend naming the two states with their counts, and the copy. */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{copy.board.eyebrow}</p>
          {/* The name is rewritten where it stands: the words keep their
              place and size, and the pencil becomes the tick that keeps
              them. */}
          <h3 className="mt-1 flex items-center gap-2 text-2xl tracking-tight">
            {renaming ? (
              <InPlace
                label={copy.board.title}
                initial={d.title}
                className={cn("-mx-1.5 w-auto min-w-[8ch] rounded-sm bg-card px-1.5 outline-2 outline-ring", TITLE)}
                onDone={(v) => {
                  if (v && v !== d.title) renameDraft(d.id, v);
                  setRenaming(false);
                  requestAnimationFrame(() => document.getElementById("board-title")?.focus());
                }}
              />
            ) : (
              <span id="board-title" tabIndex={-1} className={cn("min-w-0 outline-none", TITLE)}>
                {d.title}
              </span>
            )}
            <button
              type="button"
              aria-label={renaming ? copy.board.keep : copy.board.rename}
              onPointerDown={(e) => renaming && e.preventDefault()}
              onClick={() => (renaming ? (document.activeElement as HTMLElement | null)?.blur() : setRenaming(true))}
              className="relative flex size-9 shrink-0 items-center justify-center rounded-control text-muted-foreground press after:absolute after:-inset-0.5 hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={renaming ? Tick02Icon : PencilEdit02Icon} size={18} strokeWidth={renaming ? 1.8 : 1.6} />
            </button>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.board.meta(d.chapters.length, counts.lessons, span(counts.minutes), d.level)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("block h-4 w-6 rounded-[5px]", YOURS_CARD)} />
              <span className="text-muted-foreground">{copy.board.yours}</span>
              <span className="font-medium tabular-nums">{counts.yours}</span>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("block h-4 w-6 rounded-[5px]", DRAFTED_CARD)} />
              <span className="text-muted-foreground">{copy.board.drafted}</span>
              <span className="font-medium tabular-nums">{counts.drafted}</span>
            </li>
          </ul>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
            {copy.board.saved}
          </span>
          <Button variant="outline" size="sm" onClick={copyOutline}>
            {copy.board.copy}
          </Button>
        </div>
      </div>

      {/* What the last action did, with its undo while one is offered, and
          the arrows that walk the board a chapter at a time. */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <div aria-live="polite" className="min-h-6 min-w-0">
          {status && (
            <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
              <span>
                {[status.text].flat().map((line, i) => (
                  <span key={i} className="max-sm:block">
                    {i > 0 && " "}
                    {line}
                  </span>
                ))}
              </span>
              {status.undo && (
                <button
                  type="button"
                  onClick={status.undo}
                  className={cn("font-medium text-foreground underline underline-offset-4 press hover:decoration-2", reach)}
                >
                  {copy.lesson.undo}
                </button>
              )}
            </p>
          )}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Button variant="outline" size="icon" aria-label={copy.board.back} disabled={ends.start} focusableWhenDisabled onClick={() => step(-1)}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label={copy.board.on} disabled={ends.end} focusableWhenDisabled onClick={() => step(1)}>
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* The board, as a kanban board is laid: a column a chapter at a
          width a lesson's title reads at, running off both edges of the
          page and scrolled sideways, by the arrows over it, a trackpad, or
          a drag on its empty ground. The first column lines up with the
          page's text. */}
      <div
        ref={rail}
        onScroll={measure}
        onPointerDown={grab}
        onPointerMove={drag}
        onPointerUp={release}
        onPointerCancel={release}
        className={cn(
          "no-scrollbar mx-[calc(50%-50vw)] mt-3 overflow-x-auto px-[calc(50vw-50%)] py-2 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-6 sm:max-lg:scroll-px-8",
          panning && "cursor-grabbing select-none",
        )}
      >
        <ol
          data-object
          aria-label={copy.board.label(d.title)}
          className="flex w-max gap-4"
        >
          {d.chapters.map((c, ci) => {
            const waiting = reveal !== null && ci >= reveal;
            const chapterMinutes = c.lessons.reduce((n, l) => n + l.minutes, 0);
            return (
              <li key={ci} className="flex w-72 shrink-0 snap-start flex-col rounded-lg bg-accent p-2.5 max-[359px]:w-64">
                {waiting ? (
                  <Skeleton rows={c.lessons.length} />
                ) : (
                  <Chapter
                    n={ci + 1}
                    title={c.title}
                    meta={copy.chapter.minutes(span(chapterMinutes), c.lessons.length)}
                    onRename={(t) => renameChapter(d.id, ci, t)}
                    onRedraft={() => {
                      const drafted = c.lessons.filter((l) => !l.yours);
                      if (!drafted.length) return say(copy.chapter.allYours(ci + 1));
                      pulse(
                        drafted.map((l) => l.id),
                        () => {
                          redraftChapter(d.id, ci);
                          say(copy.chapter.redrafted(ci + 1, c.lessons.length - drafted.length));
                        },
                      );
                    }}
                  >
                    {/* The cards, and the way to add one right under the last;
                        the column's ground below them still takes a drop. */}
                    <div
                      className="flex flex-1 flex-col"
                      onDragOver={(e) => over(e, ci)}
                      onDrop={(e) => {
                        e.preventDefault();
                        land();
                      }}
                    >
                      <ol className="flex min-h-20 flex-col gap-2.5">
                        {c.lessons.map((l, li) => (
                          <LessonCard
                            key={l.id}
                            card={l}
                            number={`${ci + 1}.${li + 1}`}
                            busy={busy.has(l.id)}
                            editing={editing === l.id}
                            dragging={dragging === l.id}
                            dropBefore={drop?.chapter === ci && drop.index === indexWithout(c.lessons, li, dragging)}
                            first={li === 0}
                            last={li === c.lessons.length - 1}
                            chapter={ci}
                            chapters={d.chapters.length}
                            onEdit={() => setEditing(l.id)}
                            onSave={(t) => {
                              setEditing(null);
                              if (!t.trim()) {
                                // an empty new lesson is taken back out, and the
                                // caret goes to the button that made it
                                if (!l.title) {
                                  deleteLesson(d.id, l.id);
                                  requestAnimationFrame(() => document.getElementById(`add-${ci}`)?.focus());
                                } else focusCard(l.id);
                                return;
                              }
                              rewriteLesson(d.id, l.id, t.trim());
                              focusCard(l.id);
                            }}
                            onCancel={() => {
                              setEditing(null);
                              if (!l.title) {
                                deleteLesson(d.id, l.id);
                                requestAnimationFrame(() => document.getElementById(`add-${ci}`)?.focus());
                              } else focusCard(l.id);
                            }}
                            onRedraft={() => pulse([l.id], () => redraftLesson(d.id, l.id))}
                            onMove={(chapter, to) => move(l.id, chapter, to)}
                            onRemove={() => remove(l.id)}
                            onDragStart={() => setDragging(l.id)}
                            onDragEnd={() => {
                              setDragging(null);
                              setDrop(null);
                            }}
                          />
                        ))}
                        {drop?.chapter === ci && drop.index >= c.lessons.filter((l) => l.id !== dragging).length && (
                          <li aria-hidden="true" className="h-1 rounded-full bg-iris" />
                        )}
                      </ol>
                      <button
                        type="button"
                        id={`add-${ci}`}
                        onClick={() => setEditing(addLesson(d.id, ci))}
                        className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-secondary"
                      >
                        <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
                        {copy.chapter.add}
                      </button>
                    </div>
                  </Chapter>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/** A lesson's place among the others once the dragged card has left. */
function indexWithout(lessons: Card[], li: number, dragging: string | null) {
  const without = lessons.filter((l) => l.id !== dragging);
  return without.findIndex((l) => l.id === lessons[li].id);
}

function Chapter({
  n,
  title,
  meta,
  onRename,
  onRedraft,
  children,
}: {
  n: number;
  title: string;
  meta: string;
  onRename: (t: string) => void;
  onRedraft: () => void;
  children: React.ReactNode;
}) {
  const [renaming, setRenaming] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <>
      <div className="px-2 pt-2 pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-xl tracking-tight tabular-nums">{String(n).padStart(2, "0")}</span>
          <button
            type="button"
            aria-label={copy.chapter.redraft(n)}
            onClick={onRedraft}
            className="relative flex size-9 items-center justify-center rounded-control text-iris-ink press after:absolute after:-inset-0.5 hover:bg-card"
          >
            <AiIcon size={16} />
          </button>
        </div>
        {/* The title is one box at rest, under the pointer and open for
            writing, so its words hold their lines as it opens. */}
        <h4 className="mt-2 flow-root min-h-10 text-sm font-medium">
          {renaming ? (
            <InPlace
              label={copy.chapter.rename(n)}
              initial={title}
              className={cn(TITLE_BOX, "bg-card outline-2 outline-ring")}
              onDone={(v, keyed) => {
                if (v && v !== title) onRename(v);
                setRenaming(false);
                // back to the title it opened from, which is drawn again
                // once the field has gone
                if (keyed) requestAnimationFrame(() => opener.current?.focus());
              }}
            />
          ) : (
            <button
              ref={opener}
              type="button"
              aria-label={`${copy.chapter.rename(n)}: ${title}`}
              onClick={() => setRenaming(true)}
              className={cn(TITLE_BOX, "text-left transition-colors hover:bg-card active:bg-background")}
            >
              {title}
            </button>
          )}
        </h4>
        <p className="mt-1 text-sm tabular-nums text-muted-foreground">{meta}</p>
      </div>
      {children}
    </>
  );
}

function LessonCard({
  card: l,
  number,
  busy,
  editing,
  dragging,
  dropBefore,
  first,
  last,
  chapter,
  chapters,
  onEdit,
  onSave,
  onCancel,
  onRedraft,
  onMove,
  onRemove,
  onDragStart,
  onDragEnd,
}: {
  card: Card;
  number: string;
  busy: boolean;
  editing: boolean;
  dragging: boolean;
  dropBefore: boolean;
  first: boolean;
  last: boolean;
  chapter: number;
  chapters: number;
  onEdit: () => void;
  onSave: (t: string) => void;
  onCancel: () => void;
  onRedraft: () => void;
  onMove: (chapter: number, to: number) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const li = Number(number.split(".")[1]) - 1;
  const frame = cn("flex w-full flex-col rounded-md p-3 text-left", l.yours ? YOURS_CARD : DRAFTED_CARD);

  // Open for writing, the card keeps its frame, its number, its foot and
  // where its words stand: only the title becomes a field, the card takes
  // the focus ring, and the menu's place holds the tick that keeps it.
  if (editing)
    return (
      <li data-card={l.id} className="relative">
        <div className={cn(frame, "shadow-soft outline-2 outline-offset-2 outline-ring")}>
          <span className="flex h-6 items-center text-xs tabular-nums text-muted-foreground">{number}</span>
          <InPlace
            label={copy.lesson.field(number)}
            initial={l.title}
            placeholder={copy.lesson.placeholder}
            className={cn("mt-2 text-sm", TITLE)}
            onDone={onSave}
            onCancel={onCancel}
          />
          <span className="mt-2.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{copy.lesson.keys}</span>
            <span className="tabular-nums">{l.minutes}&nbsp;min</span>
          </span>
        </div>
        <button
          type="button"
          aria-label={copy.lesson.save(number)}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => (document.activeElement as HTMLElement | null)?.blur()}
          className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-control text-foreground press after:absolute after:-inset-0.5 hover:bg-muted"
        >
          <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={1.8} />
        </button>
      </li>
    );

  return (
    <>
      {dropBefore && <li aria-hidden="true" className="h-1 rounded-full bg-iris" />}
      <li data-card={l.id} className={cn("relative", dragging && "opacity-40")}>
        <button
          type="button"
          data-card-button={l.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", l.id);
            e.dataTransfer.effectAllowed = "move";
            onDragStart();
          }}
          onDragEnd={onDragEnd}
          onClick={onEdit}
          aria-label={`${copy.lesson.edit(number)}: ${l.title}${l.yours ? "" : `, ${copy.lesson.drafted.toLowerCase()}`}`}
          className={cn(
            frame,
            "cursor-grab transition-shadow hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing active:shadow-none",
          )}
        >
          {/* The number's row is the menu's too: the menu stands at its end,
              so the title below runs the card's whole width. */}
          <span className="flex h-6 items-center text-xs tabular-nums text-muted-foreground">{number}</span>
          {busy ? (
            <span aria-hidden="true" className="mt-3 mb-1 flex flex-col gap-2">
              <span className="h-2 w-5/6 rounded-full bg-iris-mark motion-safe:animate-pulse" />
              <span className="h-2 w-3/5 rounded-full bg-iris-mark motion-safe:animate-pulse" />
            </span>
          ) : (
            <span className={cn("mt-2 text-sm", TITLE)}>{l.title}</span>
          )}
          <span className="mt-2.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {l.yours ? (
              <span />
            ) : (
              <span className="flex items-center gap-1 text-iris-ink">
                <AiIcon size={12} />
                {copy.lesson.drafted}
              </span>
            )}
            <span className="tabular-nums">{l.minutes}&nbsp;min</span>
          </span>
        </button>
        <Menu>
          <MenuTrigger
            aria-label={copy.lesson.more(number)}
            className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-control text-muted-foreground transition-colors after:absolute after:-inset-0.5 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[popup-open]:bg-muted data-[popup-open]:text-foreground"
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={18} strokeWidth={1.8} />
          </MenuTrigger>
          <MenuContent>
            <MenuItem onClick={onEdit}>
              <HugeiconsIcon icon={PencilEdit02Icon} size={16} strokeWidth={1.6} />
              {copy.lesson.rewrite}
            </MenuItem>
            {!l.yours && (
              <MenuItem onClick={onRedraft}>
                <AiIcon size={16} className="text-iris-ink" />
                {copy.lesson.redraft}
              </MenuItem>
            )}
            <MenuSeparator />
            <MenuItem disabled={first} onClick={() => onMove(chapter, li - 1)}>
              <ArrowUpIcon className="size-4" />
              {copy.lesson.up}
            </MenuItem>
            <MenuItem disabled={last} onClick={() => onMove(chapter, li + 1)}>
              <ArrowDownIcon className="size-4" />
              {copy.lesson.down}
            </MenuItem>
            {chapter > 0 && (
              <MenuItem onClick={() => onMove(chapter - 1, Number.MAX_SAFE_INTEGER)}>
                <ArrowLeftIcon className="size-4" />
                {copy.lesson.toChapter(chapter)}
              </MenuItem>
            )}
            {chapter < chapters - 1 && (
              <MenuItem onClick={() => onMove(chapter + 1, Number.MAX_SAFE_INTEGER)}>
                <ArrowRightIcon className="size-4" />
                {copy.lesson.toChapter(chapter + 2)}
              </MenuItem>
            )}
            <MenuSeparator />
            <MenuItem onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.6} />
              {copy.lesson.remove}
            </MenuItem>
          </MenuContent>
        </Menu>
      </li>
    </>
  );
}

/** Words rewritten where they stand: a field that takes the type, the
 *  lines and the place of the words it replaces, and grows with them. It
 *  opens on its own words with them selected; Enter or leaving it keeps what
 *  is written, Escape gives up. A title is one paragraph, so a line break
 *  typed or pasted into it becomes a space. */
function InPlace({
  label,
  initial,
  placeholder,
  className,
  onDone,
  onCancel,
}: {
  label: string;
  initial: string;
  placeholder?: string;
  className?: string;
  /** `keyed` is true when Enter or Escape closed the field, which leaves
   *  focus on nothing once the field is gone; a blur has already put it
   *  somewhere. */
  onDone: (v: string, keyed: boolean) => void;
  onCancel?: (keyed: boolean) => void;
}) {
  const [v, setV] = useState(initial);
  const ref = useRef<HTMLTextAreaElement>(null);
  // Settled once: Enter keeps the words, and the blur that follows as the
  // field leaves the page must not keep them a second time.
  const settled = useRef(false);
  const finish = (keep: boolean, keyed: boolean) => {
    if (settled.current) return;
    settled.current = true;
    if (keep) onDone(v.trim(), keyed);
    else if (onCancel) onCancel(keyed);
    else onDone(initial, keyed);
  };
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <textarea
      ref={ref}
      aria-label={label}
      value={v}
      rows={1}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value.replace(/\s*\n\s*/g, " "))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          finish(true, true);
        }
        if (e.key === "Escape") {
          e.preventDefault();
          finish(false, true);
        }
      }}
      onBlur={() => finish(true, false)}
      className={cn(
        "block w-full resize-none bg-transparent p-0 outline-none field-sizing-content placeholder:text-muted-foreground",
        className,
      )}
    />
  );
}

/** A chapter still being written: its head and lessons as pale iris bars,
 *  pulsing until the words arrive. The bars are the opaque mark step rather
 *  than iris at an alpha, as the home page's studio draws them. */
function Skeleton({ rows }: { rows: number }) {
  return (
    <div aria-hidden="true" className="flex flex-1 flex-col">
      <div className="px-2 pt-2 pb-3">
        <span className="block h-6 w-8 rounded-sm bg-iris-mark motion-safe:animate-pulse" />
        <span className="mt-3 block h-2.5 w-4/5 rounded-full bg-iris-mark motion-safe:animate-pulse" />
        <span className="mt-2 block h-2.5 w-2/5 rounded-full bg-iris-mark motion-safe:animate-pulse" />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className="flex h-24 flex-col gap-2 rounded-md bg-card p-3 ring-1 ring-inset ring-border">
            <span className="h-2 w-6 rounded-full bg-iris-mark motion-safe:animate-pulse" />
            <span className="h-2 w-5/6 rounded-full bg-iris-mark motion-safe:animate-pulse" />
            <span className="h-2 w-3/5 rounded-full bg-iris-mark motion-safe:animate-pulse" />
          </span>
        ))}
      </div>
    </div>
  );
}
