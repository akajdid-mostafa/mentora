"use client";

// Row 8's instrument: its words, its state and the three step panels. The
// section lays the steps out around it; what the studio does and says is all
// here.

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ListBulletIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { brief, chapters, quiz } from "@/components/marketing/draft";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const studioCopy = {
  eyebrow: "Course studio",
  heading: "You teach it. Mentora drafts the scaffolding.",
  lede: "Draft a syllabus in 4 minutes, not a weekend. Then change every line of it before a learner sees one.",
  // Under the three instructors' faces at the foot of the copy.
  credit: "Ana, Tomás and Mara drafted their courses here.",
};

export const steps = [
  { id: "describe", label: "Describe", title: "Say what the course is, in one line", Icon: DocumentTextIcon },
  { id: "outline", label: "Outline", title: "Six chapters, ordered by what depends on what", Icon: ListBulletIcon },
  { id: "quiz", label: "Quiz", title: "Four questions, cut from the transcript", Icon: QuestionMarkCircleIcon },
] as const;
export type StepId = (typeof steps)[number]["id"];

// What each step promises. Written as guarantees rather than features: the
// row's whole argument is where the line is drawn between the instructor and
// the machine.
export const promises: Record<StepId, string[]> = {
  describe: [
    "One line in, nothing else asked for",
    "No template to fill, no category to pick",
    "Your words stay in what it writes",
  ],
  // The first line used to repeat the step's own title word for word.
  outline: [
    "Every lesson holds one idea, not three",
    "Every lesson editable before anything is recorded",
    "Run time estimated from the lesson count, not guessed",
  ],
  quiz: [
    "Each question cites the minute it comes from",
    "You approve each one before it reaches a learner",
    "Nothing is published until you press publish",
  ],
};

export function useStudio() {
  const [step, setStep] = useState<StepId>("describe");
  const [text, setText] = useState(brief);
  const [drafting, setDrafting] = useState(false);
  const [drafted, setDrafted] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [question, setQuestion] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // The draft opens the step it was asked for at once and fills it while it
  // runs, so a reader watches the outline arrive in place rather than a
  // button saying it is busy.
  const draft = (then: StepId = "outline") => {
    if (timer.current) clearTimeout(timer.current);
    setDrafting(true);
    setStep(then);
    timer.current = setTimeout(() => {
      setDrafting(false);
      setDrafted(true);
    }, 900);
  };

  // A later step asked for before any draft exists runs the draft and opens
  // on it; nothing here is ever a card that ignores a click.
  const open = (id: StepId) => {
    if (id === step) return;
    if (id !== "describe" && !drafted && !drafting) draft(id);
    else setStep(id);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setStep("describe");
    setText(brief);
    setDrafting(false);
    setDrafted(false);
    setChapter(0);
    setPicked({});
    setQuestion(0);
  };

  return {
    step, open, reset,
    text, setText, drafting, drafted, draft,
    chapter, setChapter, picked, setPicked, question, setQuestion,
  };
}

export type Studio = ReturnType<typeof useStudio>;

function DescribeInstrument({ studio, className }: { studio: Studio; className?: string }) {
  return (
    <div className={className}>
      {/* Three lines tall and growing past them: at 320 the brief wraps to
          four, and a fixed three rows cut its last word in half. Where
          field-sizing is not supported, rows keeps the three and scrolls. */}
      <textarea
        value={studio.text}
        onChange={(e) => studio.setText(e.target.value)}
        rows={3}
        aria-label="Course description"
        className="field-sizing-content min-h-[calc(3lh+2rem)] w-full resize-none rounded-lg bg-accent p-4 text-base outline-none ring-1 ring-inset ring-border focus:ring-2 focus:ring-ring"
      />
      <Button
        type="button"
        onClick={(e) => {
          // The draft opens the outline step and this button leaves with the
          // describe step, so the caret goes to the step that opened.
          const section = e.currentTarget.closest("section");
          studio.draft();
          requestAnimationFrame(() =>
            section?.querySelector<HTMLElement>('[data-step="outline"]')?.focus(),
          );
        }}
        size="lg"
        className={cn("mt-4 w-fit px-5", reach)}
      >
        {studio.drafted ? "Draft it again" : "Draft the outline"}
      </Button>
    </div>
  );
}

// What a later step shows while the draft runs: its lines as pale bars in
// iris, the hue this page gives the AI, pulsing until the words arrive. The
// pale step is the opaque mark token, not iris at an alpha: Chrome without a
// GPU dropped the blue out of an oklab alpha on a pulsing layer and painted
// the bars yellow.
const bars = ["w-3/4", "w-3/5", "w-2/3", "w-4/5", "w-1/2", "w-3/5"];

function Drafting({
  label,
  rows,
  className,
}: {
  label: string;
  rows: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <ul aria-hidden="true" className="mt-3 divide-y divide-border border-t border-border">
        {bars.slice(0, rows).map((w, i) => (
          <li key={i} className="flex items-center gap-3 py-4">
            <span className="h-2 w-4 shrink-0 rounded-full bg-iris-mark motion-safe:animate-pulse" />
            <span className={cn("h-2 rounded-full bg-iris-mark motion-safe:animate-pulse", w)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function OutlineInstrument({ studio, className }: { studio: Studio; className?: string }) {
  const { chapter: i, setChapter } = studio;
  if (!studio.drafted)
    return (
      <Drafting
        label="Drafting six chapters from your line…"
        rows={6}
        className={className}
      />
    );
  const c = chapters[i];
  // One chapter at a time, the way the quiz shows one question: six rows
  // with one of them open ran this card to twice the height of the other
  // two steps.
  return (
    <div className={cn("rounded-lg bg-accent p-4", className)}>
      <Pager label="Chapter" index={i} count={chapters.length} onMove={setChapter} />
      <p className="mt-2 flex items-baseline gap-3 text-sm">
        <span className="min-w-0 flex-1 font-medium">{c.title}</span>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {c.minutes} min
        </span>
      </p>
      {/* Held at four lessons' height, the longest chapter, so from 1280 up,
          where no lesson wraps, paging keeps the box at one height. Narrower,
          a wrapped lesson still grows it; the pager sits on top, so the
          arrows stay under the pointer either way. */}
      <ul className="mt-3 flex min-h-26 flex-col gap-2">
        {c.lessons.map((l) => (
          <li key={l} className="flex gap-2.5 text-sm text-muted-foreground">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/30" />
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

// The line over a chapter or a question: where the reader is, a dot for each,
// and the two arrows between them. The dots are the reader's own, so each
// instrument says what colours them.
function Pager({
  label,
  index,
  count,
  dot,
  onMove,
}: {
  label: string;
  index: number;
  count: number;
  dot?: (k: number) => string;
  onMove: (to: number) => void;
}) {
  const noun = label.toLowerCase();
  const arrow =
    "press flex size-10 items-center justify-center rounded-control hover:bg-card disabled:pointer-events-none disabled:opacity-40";
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs tabular-nums text-muted-foreground">
        {label} {index + 1} of {count}
      </p>
      <span aria-hidden="true" className="flex gap-1.5">
        {Array.from({ length: count }, (_, k) => (
          <span
            key={k}
            className={cn(
              "size-1.5 rounded-full",
              dot?.(k) ?? (k === index ? "bg-foreground" : "bg-foreground/20"),
            )}
          />
        ))}
      </span>
      <span className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={() => onMove(index - 1)}
          disabled={index === 0}
          aria-label={`Previous ${noun}`}
          className={arrow}
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index + 1)}
          disabled={index === count - 1}
          aria-label={`Next ${noun}`}
          className={arrow}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </span>
    </div>
  );
}

function QuizInstrument({ studio, className }: { studio: Studio; className?: string }) {
  const { picked, setPicked, question: i, setQuestion } = studio;
  if (!studio.drafted)
    return (
      <Drafting
        label="Cutting four questions from the transcript…"
        rows={4}
        className={className}
      />
    );
  const q = quiz[i];
  // One question at a time, so the open card keeps close to the height of
  // the other two. All four at once ran the section to 1,340px at 1440 and
  // left the drawing beside it at the foot of an empty column.
  return (
    <div className={cn("rounded-lg bg-accent p-4", className)}>
      {/* a dot a question: ink for the one on screen, and once answered
          the state colours, green for right and red for wrong */}
      <Pager
        label="Question"
        index={i}
        count={quiz.length}
        onMove={setQuestion}
        dot={(k) =>
          picked[k] === undefined
            ? k === i
              ? "bg-foreground"
              : "bg-foreground/20"
            : picked[k] === quiz[k].answer
              ? "bg-leaf"
              : "bg-coral"
        }
      />
      <p className="mt-2 text-sm">{q.q}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {q.options.map((o, j) => {
          const chosen = picked[i] === j;
          const right = j === q.answer;
          return (
            <button
              key={o}
              type="button"
              onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
              className={cn(
                // 40px, the floor every button here stands on; a wrapped
                // answer grows past it rather than being held to it
                "press min-h-10 rounded-control px-4 py-2 text-left text-sm",
                "bg-card ring-1 ring-inset ring-border hover:bg-secondary",
                chosen && right && "bg-leaf/15 text-leaf-ink ring-leaf/40 hover:bg-leaf/20",
                chosen && !right && "bg-coral/15 text-coral-ink ring-coral/40 hover:bg-coral/20",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked[i] !== undefined && (
        <p className="mt-3 text-sm text-muted-foreground">
          {picked[i] === q.answer ? "Correct" : "Not that one"} · answered at{" "}
          {q.at} in the lesson
        </p>
      )}
    </div>
  );
}

// The step's own instrument, whichever step is open.
export function Instrument({ studio, className }: { studio: Studio; className?: string }) {
  if (studio.step === "describe") return <DescribeInstrument studio={studio} className={className} />;
  if (studio.step === "outline") return <OutlineInstrument studio={studio} className={className} />;
  return <QuizInstrument studio={studio} className={className} />;
}
