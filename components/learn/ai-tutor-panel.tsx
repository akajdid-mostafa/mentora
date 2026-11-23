"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ArrowUpIcon, PlayIcon } from "@heroicons/react/24/solid";
import { clock, learnCopy } from "@/components/learn/copy";
import type { Reply } from "@/components/learn/tutor";
import { AiIcon } from "@/components/ui/ai-icon";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

export type Message =
  | { id: string; from: "you"; text: string }
  | ({ id: string; from: "tutor"; streaming?: boolean } & Reply);

/** The tutor beside the video. It opens naming the lesson it has open, offers
 *  that lesson's own questions as chips, and answers each one in place: the
 *  words arrive as they would from a model, and under them the minute they
 *  came from, as a button that plays it and as the line spoken there. */
export function TutorPanel({
  reads,
  messages,
  thinking,
  suggestions,
  locked,
  lang,
  onAsk,
  onPlay,
  onOpen,
  onStreamed,
  onLessonOne,
  draft,
  onDraft,
  className,
}: {
  /** What the status line says the tutor has open. */
  reads: string;
  messages: Message[];
  /** Between the question and the first word of the answer. */
  thinking: boolean;
  suggestions: string[];
  /** The lesson on screen has no tutor until the learner enrolls. */
  locked: boolean;
  lang?: string;
  onAsk: (question: string) => void;
  onPlay: (cite: NonNullable<Reply["cite"]>) => void;
  onOpen: (lesson: string) => void;
  onStreamed: (id: string) => void;
  onLessonOne: () => void;
  /** The question being typed, held by the section so it outlasts a look
   *  at another tab. */
  draft: string;
  onDraft: (draft: string) => void;
  className?: string;
}) {
  const thread = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const pinned = useRef(true);
  // Set while the thread scrolls itself, so its own scrolling is not read as
  // the learner's.
  const steering = useRef(false);
  // A question has just been asked: the view stops at it, not at the foot.
  const anchored = useRef(false);
  // Where the thread runs on past an edge it fades there, under the head or
  // into the questions, rather than cutting a message in half at the edge.
  const [edges, setEdges] = useState({ above: false, below: false });
  const measure = (el: HTMLElement) => {
    const above = el.scrollTop > 4;
    // Past the thread's own 24px foot, and by more than a sliver.
    const below = el.scrollHeight - el.scrollTop - el.clientHeight > 32;
    setEdges((e) => (e.above === above && e.below === below ? e : { above, below }));
  };
  const busy = thinking || messages.some((m) => m.from === "tutor" && m.streaming);
  const started = messages.some((m) => m.from === "you");

  // The thread keeps its foot in view while an answer is still arriving, by
  // scrolling itself rather than the page: scrollIntoView would drag the
  // whole window down to the rail with every word. Never past the question
  // just asked, though: on a short rail the foot of an answer is its minute
  // and its quote, and following it there left the words themselves out of
  // sight above. It lets go once the learner scrolls up to reread, and takes
  // hold again at the foot.
  useEffect(() => {
    const box = thread.current;
    const inner = body.current;
    if (!box || !inner) return;
    const follow = new ResizeObserver(() => {
      if (!pinned.current) return;
      const foot = box.scrollHeight - box.clientHeight;
      let top = foot;
      // Only while the question is the last thing asked and its answer the
      // one arriving: a hint posted under an older answer goes to the foot.
      const asked = [...inner.querySelectorAll<HTMLElement>(":scope > [data-asked]")].at(-1);
      if (anchored.current && asked && (!asked.nextElementSibling || !asked.nextElementSibling.nextElementSibling)) {
        const at = asked.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
        top = Math.min(foot, at - 16);
      }
      steering.current = true;
      box.scrollTop = Math.max(0, top);
      requestAnimationFrame(() => {
        steering.current = false;
      });
      measure(box);
    });
    follow.observe(inner);
    return () => follow.disconnect();
  }, []);

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const q = draft.trim();
    if (!q || busy) return;
    pinned.current = true;
    anchored.current = true;
    onAsk(q);
    onDraft("");
  };

  return (
    // A product object: its thread is data at 14px, the way a chat's is.
    <div data-object className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center gap-2 px-2 pb-5 pt-1">
        <Caps
          as="span"
          className="inline-flex h-7 items-center gap-1.5 rounded-control bg-iris/15 px-2.5 text-iris-ink"
        >
          <AiIcon />
          {learnCopy.tutor.chip}
        </Caps>
        {/* The reference's status pill: what the tutor is doing, with a
            spinner while it reads, and which lesson it has open otherwise. */}
        <span aria-live="polite" className="ml-auto flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          {thinking ? (
            <>
              <Spinner />
              {learnCopy.tutor.thinking}
            </>
          ) : (
            !locked && <span className="truncate">{reads}</span>
          )}
        </span>
      </div>

      <div
        ref={thread}
        onScroll={(e) => {
          const el = e.currentTarget;
          measure(el);
          if (steering.current) return;
          pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
          anchored.current = false;
        }}
        className={cn(
          "no-scrollbar min-h-0 flex-1 overflow-y-auto px-2",
          edges.above && !edges.below && "[mask-image:linear-gradient(to_bottom,transparent,black_1rem)]",
          edges.above &&
            edges.below &&
            "[mask-image:linear-gradient(to_bottom,transparent,black_1rem,black_calc(100%-2rem),transparent)]",
          !edges.above && edges.below && "[mask-image:linear-gradient(to_bottom,black_calc(100%-2rem),transparent)]",
        )}
      >
        {/* A log, read out as it grows, and busy while an answer arrives so
            it is read once whole rather than two words at a time. */}
        <div ref={body} role="log" aria-busy={busy} className="flex flex-col gap-4 pb-6">
        {messages.map((m) =>
          m.from === "you" ? (
            <p
              key={m.id}
              data-asked
              className="ml-10 self-end rounded-sm bg-card px-4 py-3 text-sm shadow-soft"
            >
              <span className="sr-only">{learnCopy.tutor.you}: </span>
              {m.text}
            </p>
          ) : (
            <TutorMessage
              key={m.id}
              message={m}
              lang={lang}
              onPlay={onPlay}
              onOpen={onOpen}
              onStreamed={onStreamed}
            />
          ),
        )}
        {locked && (
          <button
            type="button"
            onClick={onLessonOne}
            className="flex h-10 w-fit items-center gap-2 rounded-control bg-card px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-muted"
          >
            {learnCopy.tutor.toLessonOne}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </button>
        )}
        </div>
      </div>

      {!locked && (
        <div className="px-2 pb-4">
          {/* Stacked while the thread is empty and there is room for them;
              once a question is in, the rest go to one row that scrolls
              sideways, so the answers keep the height. Either way 8px over
              the field, the gap between two questions: the row pads 4px for
              the focus ring its scroll would otherwise cut, and gives the
              same 4px back at its top. */}
          {suggestions.length > 0 && (
            <ul
              className={cn(
                "flex gap-2",
                started ? "no-scrollbar -mx-2 -mt-1 mb-1 overflow-x-auto px-2 py-1" : "mb-2 flex-wrap",
              )}
            >
              {suggestions.map((s) => (
                <li key={s} className={cn(started && "shrink-0")}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={(e) => {
                      pinned.current = true;
                      anchored.current = true;
                      onAsk(s);
                      // The chip leaves the row once asked, and the rest
                      // go quiet while the answer arrives, so a keyboard
                      // press would drop focus to the page; it goes on to
                      // the field, where the follow-up is typed. A pointer
                      // press (detail > 0) leaves focus where it was.
                      if (e.detail === 0) field.current?.focus({ preventScroll: true });
                    }}
                    lang={lang}
                    className={cn(
                      "min-h-10 rounded-control bg-card px-3.5 py-2 text-left text-sm ring-1 ring-inset ring-border press hover:bg-muted disabled:pointer-events-none disabled:text-muted-foreground",
                      started && "whitespace-nowrap",
                    )}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={send} className="relative">
            <label htmlFor="tutor-question" className="sr-only">
              {learnCopy.tutor.placeholder}
            </label>
            <textarea
              ref={field}
              id="tutor-question"
              name="question"
              value={draft}
              onChange={(e) => onDraft(e.target.value)}
              onKeyDown={(e) => {
                // Not while an input method is composing: there Enter picks
                // the word, and sending then would cut the question short.
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) send(e);
              }}
              rows={1}
              placeholder={learnCopy.tutor.placeholder}
              className="field-sizing-content block max-h-32 min-h-12 w-full resize-none rounded-control bg-card py-3 pl-4 pr-13 text-base outline-none ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            {/* The round send button inside the field, 36px: the one round
                control the site sets inside an input. */}
            <button
              type="submit"
              disabled={!draft.trim() || busy}
              aria-label={learnCopy.tutor.send}
              className="absolute bottom-1.5 right-1.5 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground press hover:bg-primary/80 disabled:bg-muted disabled:text-muted-foreground"
            >
              <ArrowUpIcon aria-hidden="true" className="size-4" />
            </button>
          </form>
          <p className="mt-2 px-4 text-sm text-muted-foreground">{learnCopy.tutor.scope}</p>
        </div>
      )}
    </div>
  );
}

function TutorMessage({
  message: m,
  lang,
  onPlay,
  onOpen,
  onStreamed,
}: {
  message: Extract<Message, { from: "tutor" }>;
  lang?: string;
  onPlay: (cite: NonNullable<Reply["cite"]>) => void;
  onOpen: (lesson: string) => void;
  onStreamed: (id: string) => void;
}) {
  // Word by word, as a model's answer arrives, and at once for a reader who
  // asked for less motion. The extras under the words wait for the last one.
  const [still] = useState(
    () => !m.streaming || matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [shown, setShown] = useState(still ? Number.POSITIVE_INFINITY : 0);
  // A minute is kept on the line of the word before it, so a line never ends
  // on "At" with its 08:02 at the head of the next.
  const parts = m.text.replace(/ (?=\d{2}:\d{2}\b)/g, "\u00a0").split(/(\s+)/);

  useEffect(() => {
    if (!m.streaming) return;
    if (still) {
      onStreamed(m.id);
      return;
    }
    let i = 0;
    const tick = setInterval(() => {
      i += 2;
      setShown(i);
      if (i >= parts.length) {
        clearInterval(tick);
        onStreamed(m.id);
      }
    }, 45);
    return () => clearInterval(tick);
    // The text of a message never changes once it is in the thread.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.id, m.streaming]);

  const writing = m.streaming && shown < parts.length;

  return (
    <div className="flex gap-3.5">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card"
      >
        <AiIcon size={13} />
      </span>
      {/* 2px down, so the first line's middle meets the disc's: the disc is
          24px and a line of the answer 20px. */}
      <div className="min-w-0 flex-1 pt-0.5">
        <p lang={lang} className="text-balance text-sm">
          {parts.slice(0, shown).join("")}
          {writing && (
            <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-iris motion-safe:animate-pulse" />
          )}
        </p>
        {!writing && m.cite && (
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onPlay(m.cite!)}
              className="flex h-10 w-fit items-center gap-2 rounded-control bg-iris/15 px-3.5 text-sm font-medium text-iris-ink press hover:bg-iris/25"
            >
              <PlayIcon aria-hidden="true" className="size-3.5" />
              {learnCopy.tutor.play(clock(m.cite.at))}
            </button>
            {m.cite.line && (
              <blockquote lang={lang} className="text-balance rounded-[10px] bg-iris/10 px-3 py-2 text-sm text-muted-foreground">
                {m.cite.line}
              </blockquote>
            )}
          </div>
        )}
        {!writing && m.open && (
          <button
            type="button"
            onClick={() => onOpen(m.open!.lesson)}
            className="mt-4 flex h-10 w-fit items-center gap-2 rounded-control bg-card px-3.5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-muted"
          >
            {learnCopy.tutor.open(m.open.lesson)}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 motion-safe:animate-spin">
      <circle cx="8" cy="8" r="6" fill="none" strokeWidth="2" className="stroke-iris/25" />
      <path d="M8 2a6 6 0 0 1 6 6" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-iris" />
    </svg>
  );
}
