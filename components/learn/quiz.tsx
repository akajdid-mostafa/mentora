"use client";

import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import type { Check } from "@/components/course/lessons/types";
import { clock, learnCopy } from "@/components/learn/copy";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

export type CheckState = {
  index: number;
  /** Every option picked on each question, in the order it was picked. */
  picks: Record<number, number[]>;
  finished: boolean;
};

export const freshCheck: CheckState = { index: 0, picks: {}, finished: false };

const LETTERS = ["A", "B", "C", "D"];

/** One question at a time on the front card of a stack, the reference's
 *  study card: the cards behind it are the questions still to come, so the
 *  stack thins as the set is worked through.
 *
 *  A practice set lets a wrong pick be tried again and counts what was right
 *  first time. A quiz takes one pick a question and shows the right option
 *  at once, and four in five passes it. Either way the explanation names the
 *  minute the lesson covers it, as a button that plays that minute. */
export function CheckCard({
  mode,
  title,
  checks,
  state,
  lang,
  onState,
  onHint,
  onWatch,
  onPassed,
  onward,
  className,
}: {
  mode: "practice" | "quiz";
  title: string;
  checks: Check[];
  state: CheckState;
  lang?: string;
  onState: (next: CheckState) => void;
  onHint: (i: number) => void;
  onWatch: (check: Check) => void;
  onPassed?: () => void;
  /** Where a passed quiz leads, the next module. */
  onward?: { label: string; go: () => void };
  className?: string;
}) {
  const n = checks.length;
  const i = Math.min(state.index, n - 1);
  const c = checks[i];
  const picks = state.picks[i] ?? [];
  const solved = picks.includes(c.answer);
  const last = picks[picks.length - 1];
  const wrongNow = last !== undefined && last !== c.answer && !solved;
  const answered = mode === "quiz" ? picks.length > 0 : solved;
  const firstRight = checks.filter((q, k) => state.picks[k]?.[0] === q.answer).length;
  // The first question a quiz still has no answer to, which the pager lets
  // a learner step past: Finish sends them back to it rather than greying.
  const open = checks.findIndex((_, k) => !state.picks[k]?.length);
  const left = state.finished ? 0 : Math.min(2, n - 1 - i);

  const pick = (j: number) => {
    if (mode === "quiz" ? picks.length > 0 : solved || picks.includes(j)) return;
    onState({ ...state, picks: { ...state.picks, [i]: [...picks, j] } });
  };
  const go = (to: number) => onState({ ...state, index: Math.max(0, Math.min(n - 1, to)) });
  const finish = () => {
    onState({ ...state, finished: true });
    if (mode === "quiz" && firstRight / n >= 0.8) onPassed?.();
  };

  return (
    <div className={cn("relative isolate", className)}>
      {/* the questions still to come, as the cards under this one */}
      {left > 1 && (
        <div aria-hidden="true" className="absolute inset-x-8 -bottom-4 top-8 -z-20 rounded-lg bg-card shadow-soft" />
      )}
      {left > 0 && (
        <div aria-hidden="true" className="absolute inset-x-4 -bottom-2 top-4 -z-10 rounded-lg bg-card shadow-soft" />
      )}

      <div className="rounded-lg bg-card p-5 shadow-soft sm:p-6">
        {state.finished ? (
          <Result
            mode={mode}
            right={firstRight}
            n={n}
            onAgain={() => onState(freshCheck)}
            onward={onward}
          />
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <Caps>{title}</Caps>
                <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                  {learnCopy.check.count(i + 1, n)}
                  {mode === "quiz" && <> · {learnCopy.check.pass}</>}
                </p>
              </div>
              <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
                {checks.map((q, k) => {
                  const first = state.picks[k]?.[0];
                  return (
                    <span
                      key={k}
                      className={cn(
                        "size-1.5 rounded-full",
                        first === undefined
                          ? k === i
                            ? "bg-foreground"
                            : "bg-foreground/20"
                          : first === q.answer
                            ? "bg-leaf"
                            : "bg-coral",
                      )}
                    />
                  );
                })}
              </span>
              <span className="flex gap-1">
                <button
                  type="button"
                  onClick={() => go(i - 1)}
                  disabled={i === 0}
                  aria-label={learnCopy.check.previous}
                  className="flex size-10 items-center justify-center rounded-control press hover:bg-accent disabled:pointer-events-none disabled:text-muted-foreground"
                >
                  <ChevronLeftIcon aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(i + 1)}
                  disabled={i === n - 1}
                  aria-label={learnCopy.check.next}
                  className="flex size-10 items-center justify-center rounded-control press hover:bg-accent disabled:pointer-events-none disabled:text-muted-foreground"
                >
                  <ChevronRightIcon aria-hidden="true" className="size-4" />
                </button>
              </span>
            </div>

            <p lang={lang} className="mt-5 text-balance text-lg sm:text-xl">
              {c.q}
            </p>

            <ul className="mt-5 flex flex-col gap-2">
              {c.options.map((o, j) => {
                const tried = picks.includes(j);
                const right = j === c.answer;
                // A quiz shows the right option once any option is picked; a
                // practice set only once the learner has found it.
                const showRight = right && (solved || (mode === "quiz" && picks.length > 0));
                const showWrong = tried && !right;
                const locked = mode === "quiz" ? picks.length > 0 : solved || tried;
                return (
                  <li key={o}>
                    <button
                      type="button"
                      onClick={() => pick(j)}
                      aria-disabled={locked || undefined}
                      className={cn(
                        "flex min-h-10 w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-base ring-1 ring-inset transition-colors",
                        showRight
                          ? "bg-leaf/15 text-leaf-ink ring-leaf/40 hover:bg-leaf/20"
                          : showWrong
                            ? "bg-coral/15 text-coral-ink ring-coral/40 hover:bg-coral/20"
                            : locked
                              ? "text-muted-foreground ring-border"
                              : "bg-card ring-border hover:bg-accent active:bg-muted",
                        locked && "cursor-default",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          showRight
                            ? "bg-leaf text-card"
                            : showWrong
                              ? "bg-coral text-card"
                              : "bg-muted text-foreground",
                        )}
                      >
                        {showRight ? (
                          <CheckIcon className="size-3.5" strokeWidth={2.5} />
                        ) : showWrong ? (
                          <XMarkIcon className="size-3.5" strokeWidth={2.5} />
                        ) : (
                          LETTERS[j]
                        )}
                      </span>
                      <span lang={lang} className="min-w-0 flex-1 text-balance">
                        {o}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* The reference's footer panel, which says how the answer went
                and what to do with it. */}
            <div aria-live="polite">
              {(answered || wrongNow) && (
                <div
                  className={cn(
                    "mt-5 rounded-sm p-4",
                    answered && (mode === "practice" || picks[0] === c.answer) ? "bg-leaf/10" : "bg-coral/10",
                  )}
                >
                  <p lang={lang} className="text-balance text-base">
                    <span className="font-medium">
                      {answered && (mode === "practice" || picks[0] === c.answer)
                        ? learnCopy.check.right
                        : learnCopy.check.wrong}
                    </span>{" "}
                    {answered && <span className="text-muted-foreground">{c.why}</span>}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {answered ? (
                      <button
                        type="button"
                        onClick={() => onWatch(c)}
                        className="flex h-10 items-center gap-2 rounded-control bg-card px-3.5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
                      >
                        <PlayIcon aria-hidden="true" className="size-3.5" />
                        {learnCopy.check.watch(clock(c.at), mode === "quiz" ? c.lesson : undefined)}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onHint(i)}
                          className="flex h-10 items-center gap-2 rounded-control bg-iris/15 px-3.5 text-sm font-medium text-iris-ink press hover:bg-iris/25"
                        >
                          <AiIcon />
                          {learnCopy.check.hint}
                        </button>
                        <span className="self-center text-sm text-muted-foreground">
                          {learnCopy.check.retry}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* A hint is always one press away before an answer lands. */}
            {!answered && !wrongNow && (
              <button
                type="button"
                onClick={() => onHint(i)}
                className="mt-5 flex h-10 items-center gap-2 rounded-control bg-iris/15 px-3.5 text-sm font-medium text-iris-ink press hover:bg-iris/25"
              >
                <AiIcon />
                {learnCopy.check.hint}
              </button>
            )}

            {answered && (
              <div className="mt-5 flex justify-end">
                {i < n - 1 ? (
                  <Button type="button" onClick={() => go(i + 1)} className="px-4">
                    {learnCopy.check.next}
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" className="size-4" />
                  </Button>
                ) : mode === "quiz" && open !== -1 ? (
                  <Button type="button" onClick={() => go(open)} className="px-4">
                    <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" className="size-4" />
                    {learnCopy.check.toUnanswered(open + 1)}
                  </Button>
                ) : (
                  <Button type="button" onClick={finish} className="px-4">
                    {mode === "quiz" ? learnCopy.check.finish : learnCopy.check.score}
                    <ArrowRightIcon data-icon="inline-end" aria-hidden="true" className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Result({
  mode,
  right,
  n,
  onAgain,
  onward,
}: {
  mode: "practice" | "quiz";
  right: number;
  n: number;
  onAgain: () => void;
  onward?: { label: string; go: () => void };
}) {
  const passed = right / n >= 0.8;
  return (
    <div className="py-2">
      {mode === "quiz" && (
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-control px-2.5 text-xs font-medium",
            passed ? "bg-leaf/15 text-leaf-ink" : "bg-coral/15 text-coral-ink",
          )}
        >
          {passed ? learnCopy.check.passed : learnCopy.check.notYet}
        </span>
      )}
      <p className="mt-4 font-heading text-3xl tracking-tight tabular-nums">
        {mode === "quiz" ? learnCopy.check.result(right, n) : learnCopy.check.firstTry(right, n)}
      </p>
      {mode === "quiz" && (
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          {passed ? learnCopy.check.passedBody : learnCopy.check.notYetBody}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        {mode === "quiz" && passed && onward && (
          <Button type="button" onClick={onward.go}>
            {onward.label}
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" className="size-4" />
          </Button>
        )}
        <button
          type="button"
          onClick={onAgain}
          className="flex h-10 items-center rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
        >
          {mode === "quiz" ? learnCopy.check.retake : learnCopy.check.again}
        </button>
      </div>
    </div>
  );
}
