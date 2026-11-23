"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { clock } from "@/components/learn/copy";
import { quizCopy as copy } from "@/components/studio/copy";
import { player } from "@/components/studio/player";
import { progress } from "@/components/studio/progress";
import { RadioPills } from "@/components/studio/radio-pills";
import { SwapLabel } from "@/components/studio/swap-label";
import { goTo } from "@/components/studio/studio-window";
import type { Question } from "@/components/studio/take";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

type Count = "4" | "5" | "6";
type Verdict = "approved" | "discarded";
type Exit = "left" | "right" | "down";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The order a cut deals in: the module quiz's own questions first, then
 *  the spares. */
const orderOf = (pool: Question[]) => [...pool.filter((q) => !q.spare), ...pool.filter((q) => q.spare)];
const dealOf = (pool: Question[], n: number) => orderOf(pool).slice(0, n).map((q) => q.id);

// Where each card of the deck stands. The one in front sits square; the next
// two step back behind it, smaller and paler, and show only at its right edge
// and foot, as the reference's do. From md they turn a little as well; on a
// phone the band's padding has no room for a turned corner. The rest wait
// unseen in the last one's place, so a card brought up from the back fades in
// there. Tailwind draws these with the translate, rotate and scale
// properties, which is why the transition names them rather than transform.
const SLOT = [
  "z-30 bg-card shadow-soft-lg",
  "z-20 translate-x-2.5 translate-y-2 scale-[0.97] bg-card/90 shadow-soft md:translate-x-5 md:rotate-[1.5deg]",
  "z-10 translate-x-5 translate-y-4 scale-[0.94] bg-card/70 shadow-soft md:translate-x-10 md:rotate-[3deg]",
];
const UNSEEN = "invisible z-0 translate-x-5 translate-y-4 scale-[0.94] bg-card/70 opacity-0 md:translate-x-10 md:rotate-[3deg]";
// A decided card leaves the way its verdict points; a swapped one drops out
// of the deck.
const EXIT: Record<Exit, string> = {
  right: "z-40 translate-x-[45%] -translate-y-3 rotate-[8deg] bg-card opacity-0 shadow-soft-lg",
  left: "z-40 -translate-x-[45%] -translate-y-3 -rotate-[8deg] bg-card opacity-0 shadow-soft-lg",
  down: "z-40 translate-y-8 scale-95 bg-card opacity-0 shadow-soft-lg",
};
// The move takes a sheet's length on the answer's curve while a leaving
// card's fade is over in an answer, so it is gone before the one coming
// forward shows what it says.
const MOVE =
  "[transition:translate_var(--duration-sheet)_var(--ease-answer),rotate_var(--duration-sheet)_var(--ease-answer),scale_var(--duration-sheet)_var(--ease-answer),opacity_var(--duration-answer)_var(--ease-answer),background-color_var(--duration-answer)_var(--ease-answer),box-shadow_var(--duration-answer)_var(--ease-answer),visibility_var(--duration-sheet)] motion-reduce:transition-none";

export function QuizDeck({ pool }: { pool: Question[] }) {
  const byId = useMemo(() => new Map(pool.map((q) => [q.id, q])), [pool]);
  const [count, setCount] = useState<Count>("5");
  const [deck, setDeck] = useState<string[]>(() => dealOf(pool, 5));
  const [verdict, setVerdict] = useState<Record<string, Verdict>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [dealing, setDealing] = useState(false);
  // Cards on their way out, each for as long as its exit takes.
  const [leaving, setLeaving] = useState<Record<string, Exit>>({});
  const [mode, setMode] = useState<"review" | "learner">("review");
  const [added, setAdded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [asked, setAsked] = useState(0);
  const wants = useRef<string | null>(null);
  const [turn, setTurn] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The card coming forward is still easing out of `invisible` on its first
  // frame, when a focus is refused, so the caret is offered again until it
  // lands.
  useEffect(() => {
    const act = wants.current;
    if (!act) return;
    wants.current = null;
    const next =
      document.querySelector<HTMLElement>(`#quiz [data-front] [data-act="${act}"]`) ??
      document.getElementById("quiz-done");
    let tries = 0;
    const offer = () => {
      next?.focus();
      if (next && document.activeElement !== next && ++tries < 8) setTimeout(offer, 30);
    };
    offer();
  }, [turn]);

  const live = deck.filter((id) => verdict[id] !== "discarded");
  const pending = deck.filter((id) => !verdict[id]);
  const approved = deck.filter((id) => verdict[id] === "approved");
  const front = pending[0];
  const done = pending.length === 0;
  const lessonOf = (q: Question) => q.lesson ?? "4.1";
  // A question's place in the set, which it keeps while it leaves: a
  // discarded one is counted where it stood until it is gone.
  const numberOf = (id: string) => {
    const i = deck.filter((x) => verdict[x] !== "discarded" || x === id).indexOf(id);
    return i < 0 ? approved.length + 1 : i + 1;
  };
  const minuteOf = (q: Question) => clock(q.at);

  // The window's Quizzes tab reports on the deck, so it is told as it moves.
  useEffect(() => {
    progress.set("quiz", { approved: approved.length, live: live.length, pending: pending.length, added });
  }, [approved.length, live.length, pending.length, added]);

  // A spare not dealt yet, from the lesson the question it replaces came
  // from where one is left, from any lesson otherwise.
  const spareFor = (q: Question) => {
    const unused = pool.filter((p) => !deck.includes(p.id));
    return unused.find((p) => lessonOf(p) === lessonOf(q)) ?? unused[0];
  };

  const exit = (id: string, to: Exit) => {
    if (reduced()) return;
    setLeaving((all) => ({ ...all, [id]: to }));
    timers.current.push(
      setTimeout(
        () =>
          setLeaving((all) => {
            const rest = { ...all };
            delete rest[id];
            return rest;
          }),
        420,
      ),
    );
  };

  const cut = () => {
    const n = Number(count);
    setDeck(dealOf(pool, n));
    setVerdict({});
    setEdits({});
    setEditing(false);
    setAdded(false);
    setMode("review");
    setAnswers({});
    setAsked(0);
    const lessons = new Set(dealOf(pool, n).map((id) => lessonOf(byId.get(id) as Question))).size;
    if (reduced()) return setStatus(copy.status.cut(n, lessons));
    setDealing(true);
    setStatus(copy.status.cutting(n));
    timers.current.push(
      setTimeout(() => {
        setDealing(false);
        setStatus(copy.status.cut(n, lessons));
      }, 900),
    );
  };

  // How many to cut takes effect on the deck at once: questions are dealt
  // onto the back of it, or the last ones still waiting go back to the pool.
  // Nothing already decided is touched.
  const choose = (c: Count) => {
    setCount(c);
    if (dealing) return;
    const n = Number(c);
    setMode("review");
    if (live.length < n) {
      const more = orderOf(pool)
        .filter((q) => !deck.includes(q.id))
        .slice(0, n - live.length);
      if (!more.length) return setStatus(copy.status.noSpare);
      setDeck((d) => [...d, ...more.map((q) => q.id)]);
      setAdded(false);
      setStatus(
        copy.status.more(
          live.length + more.length,
          more.map((q) => ({ lesson: lessonOf(q), at: minuteOf(q) })),
        ),
      );
    } else if (live.length > n) {
      const out = pending.slice(-(live.length - n));
      if (!out.length) return setStatus(copy.status.held(live.length));
      setDeck((d) => d.filter((id) => !out.includes(id)));
      setStatus(
        live.length - out.length > n ? copy.status.held(live.length - out.length) : copy.status.fewer(n, out.length),
      );
    } else setStatus(null);
  };

  // A decided card leaves the way its verdict points, and the next one comes
  // up from behind it in the same moment.
  const decide = (id: string, v: Verdict) => {
    setEditing(false);
    exit(id, v === "approved" ? "right" : "left");
    setVerdict((all) => ({ ...all, [id]: v }));
    if (v === "discarded") {
      const spare = spareFor(byId.get(id) as Question);
      if (spare) {
        setDeck((d) => [...d, spare.id]);
        setStatus(copy.status.replaced(lessonOf(spare), minuteOf(spare)));
      } else setStatus(copy.status.noSpare);
    } else setStatus(null);
    refocus(v === "approved" ? "approve" : "discard");
  };

  const swap = (id: string) => {
    setEditing(false);
    const spare = spareFor(byId.get(id) as Question);
    if (!spare) return setStatus(copy.status.noSpare);
    exit(id, "down");
    setDeck((d) => d.map((x) => (x === id ? spare.id : x)));
    setStatus(copy.status.swapped(lessonOf(spare), minuteOf(spare)));
    refocus("swap");
  };

  // A decided card leaves the page, so the caret goes to the same call on
  // the card that takes its place, or to the summary once none is left. Set
  // here, taken up once the new card is on the page.
  const refocus = (act: string) => {
    wants.current = act;
    setTurn((n) => n + 1);
  };

  const hear = (q: Question) => {
    player.seek(q.take);
    player.play();
    goTo("recordings", "take-play");
  };

  const learnerSet = approved.map((id) => byId.get(id) as Question);
  const right = learnerSet.filter((q) => answers[q.id] === q.answer).length;
  const summary = mode === "review" && done;

  return (
    <section id="quiz" aria-labelledby="quiz-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="-mx-6 rounded-lg bg-accent px-4 py-14 sm:-mx-8 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow className="justify-center">{copy.eyebrow}</Eyebrow>
          <SectionHeading className="mx-auto mt-5 text-center">
            <span id="quiz-title">
              {copy.heading.before} <Highlight>{copy.heading.marked}</Highlight> {copy.heading.after}
            </span>
          </SectionHeading>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">{copy.lede}</p>
          {/* How many questions, which the deck takes up the moment it is
              picked, and the section's one call, which cuts a fresh set. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
            {/* On a phone the label stands over the pills, so the three keep
                one line. */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <span id="quiz-count" className="text-sm text-muted-foreground">
                {copy.count}
              </span>
              <RadioPills<Count>
                on="tint"
                labelledBy="quiz-count"
                idPrefix="quiz-count"
                value={count}
                onChange={choose}
                options={[
                  { id: "4", label: "4" },
                  { id: "5", label: "5" },
                  { id: "6", label: "6" },
                ]}
              />
            </div>
            <span aria-hidden="true" className="basis-full sm:hidden" />
            <Button size="lg" onClick={cut} disabled={dealing} focusableWhenDisabled>
              <AiIcon size={16} />
              <SwapLabel on={dealing} idle={copy.cut} busy={copy.cutting} />
            </Button>
          </div>
          <p aria-live="polite" className="mt-4 min-h-6 text-sm text-muted-foreground">
            {status ?? copy.source}
          </p>
        </div>

        {/* The deck. Every question sits in one grid cell, in its place in
            the fan or unseen behind it, so the deck keeps the height of the
            longest and nothing under it moves as the questions change. */}
        <div className="relative mx-auto mt-12 max-w-xl">
          <div data-object className="relative grid">
            {pool.map((q) => {
              const slot = mode === "review" ? pending.indexOf(q.id) : -1;
              const out = leaving[q.id];
              const on = slot === 0 && !out;
              const stem = edits[q.id] ?? q.q;
              return (
                <div
                  key={q.id}
                  data-front={on ? "" : undefined}
                  inert={!on}
                  aria-hidden={!on}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col rounded-lg",
                    MOVE,
                    out ? EXIT[out] : slot >= 0 && slot < SLOT.length ? SLOT[slot] : UNSEEN,
                  )}
                >
                  {/* What a card says shows once it is in front, and fades
                      up as it arrives there; behind, a card is paper. */}
                  <div
                    className={cn(
                      "flex flex-1 flex-col p-5 transition-opacity motion-reduce:transition-none sm:p-8",
                      on || out ? "opacity-100 delay-200 duration-sheet ease-sheet" : "opacity-0",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Caps as="span">{copy.of(numberOf(q.id), live.length)}</Caps>
                      <button
                        type="button"
                        onClick={() => hear(q)}
                        aria-label={copy.play(lessonOf(q), minuteOf(q))}
                        className="relative inline-flex h-8 items-center gap-1.5 rounded-control bg-[color-mix(in_oklab,var(--iris)_12%,var(--card))] px-3 text-xs tabular-nums text-iris-ink press after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 hover:bg-[color-mix(in_oklab,var(--iris)_20%,var(--card))]"
                      >
                        <PlayIcon className="size-3" />
                        {lessonOf(q)} · {minuteOf(q)}
                      </button>
                    </div>
                    {dealing ? (
                      <div aria-hidden="true" className="mt-6 flex flex-col gap-3">
                        <span className="h-3 w-5/6 rounded-full bg-iris-mark motion-safe:animate-pulse" />
                        <span className="h-3 w-3/5 rounded-full bg-iris-mark motion-safe:animate-pulse" />
                        {q.options.map((o) => (
                          <span key={o} className="mt-2 h-12 rounded-md bg-accent motion-safe:animate-pulse" />
                        ))}
                      </div>
                    ) : editing && on ? (
                      <Stem
                        initial={stem}
                        onSave={(v) => {
                          if (v.trim() && v.trim() !== q.q) setEdits((e) => ({ ...e, [q.id]: v.trim() }));
                          setEditing(false);
                          refocus("edit");
                        }}
                        onCancel={() => {
                          setEditing(false);
                          refocus("edit");
                        }}
                      />
                    ) : (
                      <h3 className="mt-5 text-xl tracking-tight text-balance">
                        {stem}
                        {edits[q.id] && (
                          <span className="ml-2 inline-flex h-6 translate-y-[-2px] items-center rounded-control bg-muted px-2 align-middle text-xs tracking-normal text-muted-foreground">
                            {copy.edited}
                          </span>
                        )}
                      </h3>
                    )}
                    {!dealing && (
                      <>
                        <ol className="mt-6 flex flex-col gap-2">
                          {q.options.map((o, i) => (
                            <li
                              key={o}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-4 py-3 text-sm ring-1 ring-inset",
                                i === q.answer ? "bg-leaf/15 text-leaf-ink ring-leaf/40" : "ring-border",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                                  i === q.answer ? "bg-leaf/15 text-leaf-ink" : "ring-1 ring-foreground/20",
                                )}
                              >
                                {i === q.answer && <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2.4} />}
                              </span>
                              <span className="flex-1">{o}</span>
                              {i === q.answer && (
                                // Contrast: leaf-ink on the leaf/15 chip over the card
                                // is 4.36:1, under AA's 4.5:1 for 12px. The tick
                                // beside the option says the same thing.
                                <span className="rounded-control bg-leaf/15 px-2 py-0.5 text-xs text-leaf-ink max-[359px]:hidden">{copy.answer}</span>
                              )}
                            </li>
                          ))}
                        </ol>
                        {/* 24rem, the width every "why" in the pool is fitted to */}
                        <p className="mt-4 mb-6 max-w-[24rem] text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{copy.why}</span> {q.why}
                        </p>
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                          <Button variant="ghost" data-act="discard" onClick={() => decide(q.id, "discarded")}>
                            {copy.discard}
                          </Button>
                          <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto">
                            <Button variant="outline" data-act="swap" onClick={() => swap(q.id)} className="max-sm:px-2">
                              <AiIcon size={16} />
                              {copy.swap}
                            </Button>
                            <Button variant="outline" data-act="edit" onClick={() => setEditing(true)} disabled={editing} focusableWhenDisabled className="max-sm:px-2">
                              {copy.edit}
                            </Button>
                            <Button data-act="approve" onClick={() => decide(q.id, "approved")} className="max-sm:px-2">
                              {copy.approve}
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Every question decided: what was approved, and what to do
                with it. It rises in as the last card leaves. */}
            <div
              inert={!summary}
              aria-hidden={!summary}
              className={cn(
                "col-start-1 row-start-1 flex flex-col rounded-lg bg-card p-5 shadow-soft-lg transition-[opacity,translate,visibility] duration-sheet ease-sheet motion-reduce:transition-none sm:p-8",
                summary ? "z-30 delay-150" : "invisible translate-y-3 opacity-0",
              )}
            >
              <h3 id="quiz-done" tabIndex={-1} className="text-xl tracking-tight outline-none">{copy.done.heading(approved.length)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{copy.done.lede}</p>
              <ol className="mt-5 flex flex-col divide-y border-y">
                {approved.map((id, i) => {
                  const q = byId.get(id) as Question;
                  return (
                    <li key={id} className="flex items-baseline gap-3 py-3 text-sm">
                      <span className="w-5 shrink-0 tabular-nums text-muted-foreground">{i + 1}</span>
                      <span className="flex-1">{edits[id] ?? q.q}</span>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {lessonOf(q)} · {minuteOf(q)}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Button
                  onClick={() => {
                    setAdded(true);
                    setStatus(copy.status.added(approved.length));
                  }}
                  disabled={added || approved.length === 0}
                  focusableWhenDisabled
                >
                  <SwapLabel on={added} idle={copy.done.add} busy={copy.done.added} />
                </Button>
                <Button
                  variant="outline"
                  disabled={approved.length === 0}
                  onClick={() => {
                    setMode("learner");
                    setAnswers({});
                    setAsked(0);
                  }}
                >
                  {copy.done.learner}
                </Button>
                <Button variant="ghost" onClick={cut}>
                  {copy.done.again}
                </Button>
              </div>
            </div>

            {/* The approved questions as a learner meets them: one at a time,
                marked the moment one is chosen. */}
            <Learner
              on={mode === "learner"}
              questions={learnerSet}
              edits={edits}
              asked={asked}
              answers={answers}
              right={right}
              onAnswer={(id, i) => setAnswers((a) => (id in a ? a : { ...a, [id]: i }))}
              onNext={() => setAsked((n) => n + 1)}
              onRetry={() => {
                setAnswers({});
                setAsked(0);
              }}
              onBack={() => setMode("review")}
            />
          </div>
        </div>

        {/* Where the deck stands: a bar a question, the approved ones in the
            brand, the one in front darker. A question dealt on grows in from
            nothing, so a change of count shows where it landed. */}
        {mode === "review" && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <ol aria-hidden="true" className="flex gap-1">
              {live.map((id) => (
                <li
                  key={id}
                  className={cn(
                    "h-1.5 w-10 rounded-full transition-[width,background-color] duration-answer ease-answer starting:w-0 motion-reduce:transition-none",
                    verdict[id] === "approved" ? "bg-primary" : id === front ? "bg-foreground/40" : "bg-foreground/10",
                  )}
                />
              ))}
            </ol>
            <p className="text-sm tabular-nums text-muted-foreground">{copy.approved(approved.length, live.length)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Stem({ initial, onSave, onCancel }: { initial: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(initial);
  return (
    <div className="mt-5">
      <label htmlFor="stem" className="sr-only">
        {copy.stem}
      </label>
      <textarea
        id="stem"
        autoFocus
        value={v}
        rows={3}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSave(v);
          }
          if (e.key === "Escape") onCancel();
        }}
        className="field-sizing-content block w-full resize-none rounded-md bg-card px-3 py-2 text-base outline-none ring-2 ring-inset ring-ring"
      />
      <div className="mt-2 flex justify-end gap-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {copy.cancel}
        </Button>
        <Button size="sm" onClick={() => onSave(v)}>
          {copy.save}
        </Button>
      </div>
    </div>
  );
}

function Learner({
  on,
  questions,
  edits,
  asked,
  answers,
  right,
  onAnswer,
  onNext,
  onRetry,
  onBack,
}: {
  on: boolean;
  questions: Question[];
  edits: Record<string, string>;
  asked: number;
  answers: Record<string, number>;
  right: number;
  onAnswer: (id: string, i: number) => void;
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
}) {
  const q = questions[asked];
  const chosen = q ? answers[q.id] : undefined;
  return (
    <div
      inert={!on}
      aria-hidden={!on}
      className={cn("col-start-1 row-start-1 flex flex-col rounded-lg bg-card p-5 shadow-soft-lg sm:p-8", !on && "invisible")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Caps as="span">{copy.learner.mode}</Caps>
        <span className="text-sm tabular-nums text-muted-foreground">
          {q ? copy.of(asked + 1, questions.length) : copy.learner.score(right, questions.length)}
        </span>
      </div>
      {q ? (
        <>
          <h3 className="mt-5 text-xl tracking-tight text-balance">{edits[q.id] ?? q.q}</h3>
          <ol className="mt-6 flex flex-col gap-2">
            {q.options.map((o, i) => {
              const picked = chosen === i;
              const shows = chosen !== undefined && (picked || i === q.answer);
              return (
                <li key={o}>
                  <button
                    type="button"
                    disabled={chosen !== undefined}
                    onClick={() => onAnswer(q.id, i)}
                    className={cn(
                      "flex min-h-10 w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm ring-1 ring-inset ring-border transition-colors enabled:hover:bg-accent enabled:active:bg-muted",
                      shows && i === q.answer && "bg-leaf/15 text-leaf-ink ring-leaf/40",
                      shows && picked && i !== q.answer && "bg-coral/15 text-coral-ink ring-coral/40",
                    )}
                  >
                    <span className="flex-1">{o}</span>
                    {shows && (
                      <span className={cn("rounded-control px-2 py-0.5 text-xs", i === q.answer ? "bg-leaf/15 text-leaf-ink" : "bg-coral/15 text-coral-ink")}>
                        {i === q.answer ? copy.learner.right : copy.learner.wrong}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className={cn("mt-4 min-h-10 max-w-[24rem] text-sm text-muted-foreground", chosen === undefined && "invisible")}>
            <span className="font-medium text-foreground">{copy.why}</span> {q.why}
          </p>
          <div className="mt-auto flex justify-between gap-2 border-t pt-5">
            <Button variant="ghost" onClick={onBack}>
              {copy.learner.back}
            </Button>
            <Button onClick={onNext} disabled={chosen === undefined}>
              {copy.learner.next}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-5 font-heading text-5xl tracking-tighter tabular-nums">{copy.learner.score(right, questions.length)}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            <Button onClick={onRetry}>{copy.learner.retry}</Button>
            <Button variant="outline" onClick={onBack}>
              {copy.learner.back}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
