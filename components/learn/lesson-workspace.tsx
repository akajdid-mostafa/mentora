"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowRightIcon, CheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  Download04Icon,
  LeftToRightListBulletIcon,
  Note01Icon,
  Quiz01Icon,
  TextIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { courseHref, courseSlug, type Course } from "@/components/course/courses";
import type { Lesson, Outline } from "@/components/course/detail";
import type { ProjectBrief } from "@/components/course/lessons/projects";
import { fallbackBrief } from "@/components/course/lessons/projects";
import type { Check, CoursePack } from "@/components/course/lessons/types";
import {
  readProgress,
  serverProgress,
  setAt as saveAt,
  setDone,
  setFinished,
  setLast,
  useProgress,
  type Progress,
} from "@/components/course/progress";
import { logStudy } from "@/components/course/study";
import { localToday } from "@/components/course-page/start";
import { TutorPanel, type Message } from "@/components/learn/ai-tutor-panel";
import { clock, learnCopy, tutorVoice } from "@/components/learn/copy";
import { filesFor, transcriptText } from "@/components/learn/files";
import { LessonToc, type Access } from "@/components/learn/lesson-toc";
import { NotesPanel, type NoteDraft } from "@/components/learn/notes-panel";
import { useNotes } from "@/components/learn/notes";
import { LessonPlayer, type UpNext } from "@/components/learn/player";
import { ProjectStage } from "@/components/learn/project";
import { CheckCard, freshCheck, type CheckState } from "@/components/learn/quiz";
import { Resources } from "@/components/learn/resources";
import { Transcript, TranscriptNote } from "@/components/learn/transcript";
import { answer, type Reply } from "@/components/learn/tutor";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { aiGlyph } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { TabTrack } from "@/components/ui/tab-track";
import { cn, hash } from "@/lib/utils";

type Item = Lesson & {
  /** The module, counted from one, and its title. */
  m: number;
  module: string;
  /** Its place among the module's videos, for "Lesson 2 of 4". */
  k: number;
  of: number;
};

type Tab = "transcript" | "notes" | "practice" | "resources" | "contents" | "tutor";

const LANG = { Spanish: "es", Portuguese: "pt", French: "fr" } as const;

// The rail and the tabs trade places at lg: from there the tutor and the
// contents stand beside the player, and under it they are two more tabs.
const WIDE = "(min-width: 1024px)";
const subscribeWide = (change: () => void) => {
  const mq = matchMedia(WIDE);
  mq.addEventListener("change", change);
  return () => mq.removeEventListener("change", change);
};
const useWide = () =>
  useSyncExternalStore(subscribeWide, () => matchMedia(WIDE).matches, () => true);

const unchanging = () => () => {};

/** False on the server and through hydration, true on every render after. */
const useHydrated = () =>
  useSyncExternalStore(
    unchanging,
    () => true,
    () => false,
  );

/** The item a visit opens on: the lesson a link names, else the one the
 *  learner had open last, else the first thing not yet done. The link's
 *  lesson comes from the server, which read it off `?lesson=`: a link
 *  followed inside the site renders before the address bar changes, so the
 *  bar cannot be asked. The rest the server and the hydrating render work
 *  out from the demo's seed, so the markup and the first render agree, and
 *  the browser's own record takes over on the render after. */
function useStart(course: string, items: Item[], asked?: string) {
  const named = asked && items.some((i) => i.id === asked) ? asked : undefined;
  return useSyncExternalStore(
    unchanging,
    () => named ?? startOf(readProgress(), course, items),
    () => named ?? startOf(serverProgress(), course, items),
  );
}

const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

let uid = 0;
const nextId = () => `m${(uid += 1)}`;

/** The lesson section: the course's trail and progress over a deck that
 *  holds the player and the rail beside it, and the lesson's title, its
 *  actions and its tabs under that. One clock runs the whole of it. The
 *  player plays on it, the transcript lights the line it has reached, a note
 *  keeps the second it was begun at and the tutor's answers seek it. */
export function LessonWorkspace({
  course,
  outline,
  pack,
  brief,
  teacher,
  linked,
}: {
  course: Course;
  outline: Outline;
  pack?: CoursePack;
  brief?: ProjectBrief;
  teacher: { name: string; trade: string };
  /** The lesson the address names, `?lesson=4.2`. */
  linked?: string;
}) {
  const lang = course.language === "English" ? undefined : LANG[course.language];
  const voice = tutorVoice[course.language];
  const progress = useProgress();
  const enrolled = progress.enrolled.includes(course.id);
  const done = new Set(progress.done[course.id] ?? []);
  const positions = progress.at[course.id] ?? {};
  const notes = useNotes().filter((n) => n.course === course.id);
  const wide = useWide();

  const items: Item[] = outline.modules.flatMap((mod, mi) => {
    const videos = mod.lessons.filter((l) => l.kind === "video");
    return mod.lessons.map((l) => ({
      ...l,
      m: mi + 1,
      module: mod.title,
      k: videos.indexOf(l) + 1,
      of: videos.length,
    }));
  });
  const byId = new Map(items.map((i) => [i.id, i]));
  const titles = Object.fromEntries(
    items.filter((i) => i.kind === "video").map((i) => [i.id, i.title]),
  );

  const access = (l: Lesson): Access =>
    enrolled || l.id === "1.1" ? "full" : l.kind === "video" && l.preview ? "video" : "locked";

  // Every piece of state below is held against the item it was set on, so
  // opening another item resets nothing by hand: a clock set on 4.2 simply
  // is not 4.3's, and 4.3 reads its own resume point instead.
  const start = useStart(course.id, items, linked);
  const hydrated = useHydrated();
  const [chosen, setChosen] = useState<string | null>(null);
  const current = chosen && byId.has(chosen) ? chosen : start;
  const item = byId.get(current) ?? items[0];

  const [clockOf, setClockOf] = useState<{ id: string; at: number } | null>(null);
  const at = clockOf?.id === current ? clockOf.at : (positions[current] ?? 0);
  const [playingOn, setPlayingOn] = useState<string | null>(null);
  const playing = playingOn === current;
  const [countOf, setCountOf] = useState<{ id: string; left: number } | null>(null);
  const countdown = countOf?.id === current ? countOf.left : null;
  const [shownOf, setShownOf] = useState<{ id: string; i: number } | null>(null);
  const shown = shownOf?.id === current ? shownOf.i : item.m - 1;
  const [thinkingOn, setThinkingOn] = useState<string | null>(null);
  const thinking = thinkingOn === current;

  const [speed, setSpeed] = useState(1);
  const [cc, setCc] = useState(true);
  const [railTab, setRailTab] = useState<"tutor" | "contents">("tutor");
  const [picked, setTab] = useState<Tab | null>(null);
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [checks, setChecks] = useState<Record<string, CheckState>>({});
  // What is being typed lives here rather than in the field's own panel,
  // which unmounts whenever another tab opens: a question half asked and a
  // note half written survive a look at the contents, and the note keeps the
  // lesson and the second it was begun at when the next lesson opens by
  // itself under it.
  const [question, setQuestion] = useState("");
  const [noteDraft, setNoteDraft] = useState<NoteDraft | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const saved = useRef<{ id: string; at: number } | null>(null);

  const reach = access(item);
  const lessonPack = item.kind === "video" ? pack?.lessons[item.id] : undefined;
  const lines = reach === "full" ? lessonPack?.transcript : undefined;
  const total = item.kind === "video" ? item.minutes * 60 : 0;
  const running = playing && item.kind === "video" && reach !== "locked" && at < total;
  const next = items[items.indexOf(item) + 1];
  const counting = countdown !== null && next !== undefined && access(next) !== "locked";

  const setPlaying = (on: boolean) => setPlayingOn(on ? current : null);
  const setShown = (i: number) => setShownOf({ id: current, i });
  const seek = (s: number) => {
    setCountOf(null);
    setClockOf({ id: current, at: Math.max(0, Math.min(total, s)) });
  };

  // Opening an item resumes a video where it stopped, or at the second a
  // citation asked for.
  const open = (id: string, opts: { at?: number; play?: boolean } = {}) => {
    if (!byId.has(id)) return;
    setChosen(id);
    setClockOf(opts.at === undefined ? null : { id, at: opts.at });
    setPlayingOn(opts.play ? id : null);
    setCountOf(null);
    setShownOf(null);
  };

  const toggle = () => {
    if (running) return setPlaying(false);
    setCountOf(null);
    if (at >= total) setClockOf({ id: current, at: 0 });
    setPlaying(true);
  };

  // The address bar follows the item, so a lesson can be linked and
  // reloaded, and the record keeps it as the one to open next time. Not
  // while the page hydrates: that render still holds the server's pick, and
  // writing it would wipe the lesson a link asked for before it is read.
  useEffect(() => {
    if (!hydrated) return;
    const url = `${window.location.pathname}?lesson=${current}`;
    if (`${window.location.pathname}${window.location.search}` !== url) {
      window.history.replaceState(null, "", url);
    }
    if (reach !== "locked") setLast(course.id, current);
  }, [hydrated, current, reach, course.id]);

  // The clock: a quarter second at a time, times the speed. The end of a
  // video ticks it off and starts the count to the next item.
  const tick = useEffectEvent(() => {
    const now = Math.min(total, at + 0.25 * speed);
    setClockOf({ id: current, at: now });
    if (now < total) return;
    setPlayingOn(null);
    setDone(course.id, current, true);
    if (next) setCountOf({ id: current, left: 5 });
  });
  useEffect(() => {
    if (!running) return;
    const t = setInterval(tick, 250);
    return () => clearInterval(t);
  }, [running]);

  const count = useEffectEvent(() => {
    if (countdown === null || !next) return;
    if (countdown <= 1) open(next.id, { play: next.kind === "video" });
    else setCountOf({ id: current, left: countdown - 1 });
  });
  useEffect(() => {
    if (!counting) return;
    const t = setTimeout(count, 1000);
    return () => clearTimeout(t);
  }, [counting, countdown]);

  // Where the video stood is kept whenever it stops, and every five seconds
  // while it plays, so a closed tab resumes within a breath of where it was.
  useEffect(() => {
    if (item.kind !== "video" || reach === "locked" || at <= 0) return;
    const last = saved.current;
    if (running && last?.id === item.id && Math.abs(at - last.at) < 5) return;
    if (Math.floor(at) === readProgress().at[course.id]?.[item.id]) return;
    saved.current = { id: item.id, at };
    saveAt(course.id, item.id, at);
  }, [at, running, item.kind, item.id, reach, course.id]);

  // The dashboard's week counts the learner's time rather than the lesson's:
  // five seconds for every five a video plays, at whatever speed.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => logStudy(5, localToday()), 5000);
    return () => clearInterval(t);
  }, [running]);

  // The day the last item is ticked, however it was ticked, is the day the
  // course's certificate carries. Read off the stored record rather than the
  // render, which during hydration still holds the seed.
  const complete = enrolled && items.every((i) => done.has(i.id));
  const stamp = useEffectEvent(() => {
    const p = readProgress();
    const ticked = new Set(p.done[course.id] ?? []);
    if (p.enrolled.includes(course.id) && items.every((i) => ticked.has(i.id))) {
      setFinished(course.id, localToday());
    }
  });
  useEffect(() => {
    if (complete) stamp();
  }, [complete]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // The player's keys, wherever the focus is not already using them: space
  // or K plays and pauses, the arrows skip ten seconds, C turns the captions.
  const key = useEffectEvent((e: KeyboardEvent) => {
    if (item.kind !== "video" || reach === "locked") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t.closest("input, textarea, select, [contenteditable], [role='dialog'], [role='slider']")) return;
    const onControl = Boolean(t.closest("button, a"));
    if ((e.key === " " && !onControl) || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowLeft" && !onControl) {
      seek(at - 10);
    } else if (e.key === "ArrowRight" && !onControl) {
      seek(at + 10);
    } else if (e.key === "c" && lines) {
      setCc((v) => !v);
    }
  });
  useEffect(() => {
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);

  // ---- the tutor --------------------------------------------------------

  const intro: Message = {
    id: `intro-${item.id}`,
    from: "tutor",
    text:
      reach !== "full"
        ? learnCopy.tutor.locked
        : item.kind === "quiz"
          ? voice.quiz(item.m)
          : item.kind === "project"
            ? voice.project
            : !lessonPack
              ? voice.noTranscript(item.id)
              : voice.intro(item.id),
  };

  const thread = [intro, ...(threads[current] ?? [])];
  const asked = new Set(
    (threads[current] ?? []).filter((m) => m.from === "you").map((m) => m.text),
  );
  const quizCheck = item.kind === "quiz" ? pack?.quizzes?.[item.id] : undefined;
  const onQuestion = checks[current]?.index ?? 0;
  // On a quiz the one thing to offer is a hint for the question on screen.
  const hintAsk = quizCheck ? learnCopy.tutor.hintFor(onQuestion + 1) : undefined;
  const suggestions =
    reach !== "full"
      ? []
      : lessonPack
        ? lessonPack.asks.map((a) => a.q).filter((q) => !asked.has(q))
        : hintAsk && !asked.has(hintAsk)
          ? [hintAsk]
          : [];

  const post = (id: string, m: Message) =>
    setThreads((t) => ({ ...t, [id]: [...(t[id] ?? []), m] }));

  // The answer lands after a beat, as a model's would, into the thread it
  // was asked in even if the learner has moved to another lesson meanwhile.
  const reply = (id: string, r: Reply) => {
    setThinkingOn(id);
    timers.current.push(
      setTimeout(() => {
        setThinkingOn((on) => (on === id ? null : on));
        post(id, { id: nextId(), from: "tutor", streaming: true, ...r });
      }, 750),
    );
  };

  const ask = (text: string) => {
    post(current, { id: nextId(), from: "you", text });
    if (quizCheck && text === hintAsk) return hint(quizCheck, onQuestion, false);
    const onScreen = quizCheck?.[onQuestion];
    reply(
      current,
      answer(text, {
        lesson: item.kind === "video" ? item.id : (onScreen?.lesson ?? item.id),
        pack: lessonPack,
        outline,
        lang: course.language,
        quiz: onScreen ? { at: onScreen.at, lesson: onScreen.lesson ?? item.id } : undefined,
      }),
    );
  };

  const showTutor = () => (wide ? setRailTab("tutor") : setTab("tutor"));

  const hint = (set: Check[], i: number, show = true) => {
    const c = set[i];
    const lesson = c.lesson ?? item.id;
    if (show) showTutor();
    reply(current, {
      text: voice.hint(i + 1, clock(c.at), lesson),
      cite: {
        lesson,
        at: c.at,
        line: pack?.lessons[lesson]?.transcript.find((l) => l.at === c.at)?.text,
      },
    });
  };

  // Playing a cited minute brings the player back into view when it has
  // scrolled away, which on a phone it always has.
  const play = (cite: { lesson: string; at: number }) => {
    if (cite.lesson !== current) open(cite.lesson, { at: cite.at, play: true });
    else {
      seek(cite.at);
      setPlaying(true);
    }
    const top = stage.current?.getBoundingClientRect().top ?? 0;
    if (top < 64) stage.current?.scrollIntoView({ behavior: still() ? "auto" : "smooth", block: "start" });
  };

  const streamed = (id: string) =>
    setThreads((t) =>
      Object.fromEntries(
        Object.entries(t).map(([k, list]) => [
          k,
          list.map((m) => (m.id === id && m.from === "tutor" ? { ...m, streaming: false } : m)),
        ]),
      ),
    );

  const cites = (threads[current] ?? []).flatMap((m) =>
    m.from === "tutor" && m.cite && m.cite.lesson === current ? [m.cite.at] : [],
  );

  // ---- what sits under the player -----------------------------------------

  const here = notes.filter((n) => n.lesson === item.id);
  const files =
    item.kind === "video" && reach === "full"
      ? filesFor({ course, lesson: item, lines, notes: here })
      : [];
  const practice = reach === "full" ? lessonPack?.practice : undefined;

  const tabs: { id: Tab; label: string; icon: IconSvgElement; count?: number; narrow?: boolean }[] = [
    { id: "contents", label: learnCopy.rail.contents, icon: LeftToRightListBulletIcon, narrow: true },
    { id: "tutor", label: learnCopy.rail.tutor, icon: aiGlyph, narrow: true },
    ...(item.kind === "video" && reach !== "locked"
      ? ([
          { id: "transcript", label: learnCopy.tabs.transcript, icon: TextIcon },
          { id: "notes", label: learnCopy.tabs.notes, icon: Note01Icon, count: here.length || undefined },
          ...(practice ? [{ id: "practice", label: learnCopy.tabs.practice, icon: Quiz01Icon }] : []),
          ...(files.length
            ? [{ id: "resources", label: learnCopy.tabs.resources, icon: Download04Icon }]
            : []),
        ] as typeof tabs)
      : []),
  ];
  // Until a tab is picked, a phone opens on the contents and a wide screen on
  // the lesson's first own tab, the transcript. Which of the two is drawn is
  // the breakpoint's call rather than the script's, so the markup the server
  // sends is already right at both widths; the script only keeps the
  // selected state a screen reader hears in step. A pick holds while its
  // tab is drawn: from lg the contents and the tutor are in the rail instead.
  const wideFirst = tabs.find((t) => !t.narrow)?.id;
  const held = tabs.some((t) => t.id === picked && !(t.narrow && wide));
  const tab: Tab | undefined = held && picked ? picked : wide ? wideFirst : "contents";
  const auto = held ? undefined : { narrow: "contents" as const, wide: wideFirst };

  const toc = (
    <LessonToc
      modules={outline.modules}
      shown={shown}
      onShown={setShown}
      current={current}
      done={done}
      at={positions}
      live={{ at, playing: running }}
      access={access}
      notes={(id) => notes.filter((n) => n.lesson === id).length}
      lang={lang}
      onOpen={(id) => open(id)}
    />
  );
  const tutor = (
    <TutorPanel
      reads={
        item.kind === "video"
          ? learnCopy.tutor.reads(item.id)
          : item.kind === "quiz"
            ? learnCopy.tutor.readsQuiz(item.m)
            : learnCopy.tutor.readsProject
      }
      messages={thread}
      thinking={thinking}
      suggestions={suggestions}
      locked={reach !== "full"}
      lang={lang}
      onAsk={ask}
      onPlay={play}
      onOpen={(id) => open(id)}
      onStreamed={streamed}
      onLessonOne={() => open("1.1")}
      draft={question}
      onDraft={setQuestion}
    />
  );

  const panel = (id: Tab) => {
    if (id === "contents") return <div className="-mx-2 rounded-lg bg-accent py-3 lg:hidden">{toc}</div>;
    if (id === "tutor")
      return <div className="-mx-2 h-[34rem] rounded-lg bg-accent py-4 lg:hidden">{!wide && tutor}</div>;
    if (id === "transcript")
      return reach === "video" ? (
        <TranscriptNote text={learnCopy.transcript.locked} />
      ) : lines ? (
        <Transcript
          lines={lines}
          at={at}
          cites={cites}
          lang={lang}
          file={{
            name: `${courseSlug(course)}-${item.id.replace(".", "-")}-transcript.txt`,
            text: transcriptText(course, item, lines),
          }}
          onJump={(s) => {
            seek(s);
            setPlaying(true);
          }}
        />
      ) : (
        <TranscriptNote text={learnCopy.transcript.none} />
      );
    if (id === "notes")
      return (
        <NotesPanel
          course={course.id}
          courseTitle={course.title}
          lesson={item.id}
          at={at}
          titles={titles}
          draft={noteDraft}
          onDraft={setNoteDraft}
          onJump={(lesson, s) => play({ lesson, at: s })}
        />
      );
    if (id === "practice" && practice)
      return (
        <CheckCard
          mode="practice"
          title={learnCopy.check.practice}
          checks={practice}
          state={checks[item.id] ?? freshCheck}
          lang={lang}
          onState={(s) => setChecks((c) => ({ ...c, [item.id]: s }))}
          onHint={(i) => hint(practice, i)}
          onWatch={(c) => play({ lesson: item.id, at: c.at })}
          className="pb-4"
        />
      );
    if (id === "resources") return <Resources files={files} />;
    return null;
  };

  const upNext: UpNext | undefined = next
    ? {
        title: next.kind === "quiz" ? learnCopy.check.quiz(next.m) : next.title,
        label: labelOf(next),
        locked: access(next) === "locked",
      }
    : undefined;
  const enrollHref = `/checkout?course=${courseSlug(course)}`;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8">
      {/* Stacked until md, where the trail and what stands at its end fit
          one row; a wrapping row would have left one of them at each edge.
          The trail sits on the row's foot, and so does everything at its
          end. */}
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
        <Breadcrumb
          trail={[
            { label: learnCopy.home, href: "/dashboard" },
            { label: course.title, href: courseHref(course) },
            {
              label:
                item.kind === "video"
                  ? learnCopy.lesson(item.id)
                  : item.kind === "quiz"
                    ? learnCopy.check.quiz(item.m)
                    : learnCopy.contents.sub.project,
            },
          ]}
        />
        {enrolled ? (
          <CourseProgress done={items.filter((i) => done.has(i.id)).length} total={items.length} />
        ) : (
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            {course.price > 0 && (
              <span className="inline-flex h-7 items-center rounded-control bg-chip px-3 text-xs font-medium text-primary-ink">
                {learnCopy.free(course.price)}
              </span>
            )}
            <Button render={<Link href={enrollHref}>{learnCopy.enroll(course.price)}</Link>} />
          </div>
        )}
      </div>

      {/* The deck. The reference's pale panel runs behind the rail and under
          the player's right edge, a step past both at the top and the foot,
          so the player reads as laid on it and the rail as part of it rather
          than as a column that happens to stand beside the video. */}
      <div className="relative isolate mt-5 lg:mt-8">
        <div
          aria-hidden="true"
          className="absolute -inset-y-5 right-0 -z-10 hidden rounded-lg bg-accent lg:block lg:left-[calc(100%-22rem-2rem-10rem)] xl:left-[calc(100%-24rem-2rem-12rem)]"
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div ref={stage} className="min-w-0">
            {reach === "locked" ? (
              <LockedStage course={course} item={item} enrollHref={enrollHref} onLessonOne={() => open("1.1")} />
            ) : item.kind === "video" ? (
              <LessonPlayer
                course={course}
                lesson={item}
                lang={lang}
                at={at}
                playing={running}
                speed={speed}
                cc={cc}
                lines={lines}
                cites={cites}
                notes={here.map((n) => n.at)}
                countdown={countdown}
                upNext={upNext}
                enrollHref={enrollHref}
                onSeek={seek}
                onToggle={toggle}
                onSkip={(by) => seek(at + by)}
                onSpeed={setSpeed}
                onCc={setCc}
                onUpNext={() => next && open(next.id, { play: next.kind === "video" })}
                onStay={() => setCountOf(null)}
              />
            ) : item.kind === "quiz" && quizCheck ? (
              <Frame>
                <CheckCard
                  mode="quiz"
                  title={learnCopy.check.quiz(item.m)}
                  checks={quizCheck}
                  state={checks[item.id] ?? freshCheck}
                  lang={lang}
                  onState={(s) => setChecks((c) => ({ ...c, [item.id]: s }))}
                  onHint={(i) => hint(quizCheck, i)}
                  onWatch={(c) => play({ lesson: c.lesson ?? item.id, at: c.at })}
                  onPassed={() => setDone(course.id, item.id, true)}
                  onward={
                    next
                      ? { label: learnCopy.check.onward(next.m), go: () => open(next.id) }
                      : undefined
                  }
                />
              </Frame>
            ) : item.kind === "project" ? (
              <ProjectStage
                place={learnCopy.place.project(item.m)}
                title={item.title}
                teacher={teacher.name}
                brief={brief}
                handIn={brief?.handIn ?? fallbackBrief.handIn}
                accept={brief?.accept ?? fallbackBrief.accept}
                draft={draftOf(course, brief?.accept ?? fallbackBrief.accept)}
                done={done.has(item.id)}
                lang={lang}
                onSubmit={() => setDone(course.id, item.id, true)}
              />
            ) : (
              <Frame>
                <div className="rounded-lg bg-card p-6 shadow-soft">
                  <Caps>{learnCopy.check.quiz(item.m)}</Caps>
                  <p className="mt-3 max-w-md text-balance text-base text-muted-foreground">
                    {learnCopy.check.missing}
                  </p>
                </div>
              </Frame>
            )}
          </div>

          {/* As tall as the player from xl. Under xl the player is as short
              as 435px, which left the tutor's thread room for one line of
              an answer, so there the rail keeps a floor of its own. */}
          <aside
            aria-label={learnCopy.rail.label}
            className="hidden min-h-0 flex-col py-2 pr-2 lg:flex lg:min-h-[34rem] xl:min-h-0"
          >
            {/* On the rail's own tint, so the well takes the rung under it,
                and the rail's width, the two tabs taking half each. */}
            <TabTrack
              label={learnCopy.rail.label}
              idPrefix="tab-rail-panel"
              controls="rail-panel"
              on="tint"
              options={[
                { id: "tutor", label: learnCopy.rail.tutor, icon: glyph(aiGlyph) },
                { id: "contents", label: learnCopy.rail.contents, icon: glyph(LeftToRightListBulletIcon) },
              ]}
              value={railTab}
              onChange={setRailTab}
              className="mx-2 mb-3 grid w-auto grid-cols-2"
            />
            <div
              id="rail-panel"
              role="tabpanel"
              aria-labelledby={`tab-rail-panel-${railTab}`}
              className="relative min-h-0 flex-1"
            >
              {/* The rail is as tall as the player beside it and no taller:
                  its panels scroll inside it. Absolute, so their content
                  never stretches the row the player sets. */}
              <div className="absolute inset-0 flex flex-col">{wide && (railTab === "tutor" ? tutor : toc)}</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Under the deck the tabs take the width, with the next item's card
          beside them only from xl: at 1024 the column beside a 22rem card
          broke every transcript line in two. */}
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:mt-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              {/* The module over the title as a meta line: at 12px in capitals
                  it carried six words, which is past what a caption holds. */}
              <p className="text-sm text-muted-foreground">
                {learnCopy.place.module(item.m)} · <span lang={lang}>{item.module}</span>
              </p>
              <h1 lang={lang} className="mt-2 text-2xl tracking-tight sm:text-3xl">
                {item.kind === "quiz" ? learnCopy.check.quiz(item.m) : item.title}
              </h1>
              <p className="mt-2 text-sm">
                <span className="font-medium">{metaOf(item)}</span>
                <span className="text-muted-foreground">
                  {item.kind === "video" && ` · ${learnCopy.place.position(item.k, item.of)}`}
                  {` · ${teacher.name}`}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {reach !== "locked" && item.kind === "video" && (
                <button
                  type="button"
                  aria-pressed={done.has(item.id)}
                  onClick={() => setDone(course.id, item.id, !done.has(item.id))}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-control px-4 text-sm font-medium press",
                    "aria-pressed:bg-iris/15 aria-pressed:text-iris-ink aria-pressed:hover:bg-iris/25",
                    "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
                  )}
                >
                  <CheckIcon aria-hidden="true" className="size-4" strokeWidth={2} />
                  {done.has(item.id) ? learnCopy.completed : learnCopy.complete}
                </button>
              )}
              {/* From xl the next item has its own card beside the tabs, so
                  the title keeps the row to itself. */}
              {next ? (
                <button
                  type="button"
                  onClick={() => open(next.id)}
                  className="flex h-10 items-center gap-2 rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent xl:hidden"
                >
                  {next.kind === "quiz"
                    ? learnCopy.next.quiz
                    : next.kind === "project"
                      ? learnCopy.next.project
                      : learnCopy.next.video}
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex h-10 items-center gap-2 rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent xl:hidden"
                >
                  {learnCopy.next.end}
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </Link>
              )}
            </div>
          </div>

          {tabs.length > 0 && (
            <div className={cn("mt-8", !wideFirst && "lg:hidden")}>
              {/* Too long for a phone, so the track scrolls sideways as one
                  piece from the gutter instead of wrapping; the padding is
                  room for a picked tab's lift. */}
              <div className="no-scrollbar -mx-6 scroll-px-6 overflow-x-auto px-6 py-2 sm:-mx-1 sm:scroll-px-1 sm:px-1">
                <TabTrack
                  label={learnCopy.tabs.label}
                  idPrefix="tab-lesson-panel"
                  controls="lesson-panel"
                  options={tabs.map((t) => ({
                    id: t.id,
                    label: t.label,
                    icon: glyph(t.icon),
                    count: t.count,
                    className: t.narrow ? "lg:hidden" : undefined,
                  }))}
                  value={tab ?? "contents"}
                  auto={auto}
                  onChange={setTab}
                  className="w-max"
                />
              </div>
              <div
                id="lesson-panel"
                role="tabpanel"
                aria-labelledby={`tab-lesson-panel-${tab ?? "contents"}`}
                className="mt-4"
              >
                {/* Both defaults go out with the markup, each drawn at its own
                    width; once hydrated the script knows the width, and the
                    one not drawn at it leaves the page. */}
                {(auto ? (hydrated ? [wide ? auto.wide : auto.narrow] : [auto.narrow, auto.wide]) : [tab]).map(
                  (id) =>
                    id && (
                      <div
                        key={id}
                        className={auto ? (id === auto.narrow ? "lg:hidden" : "hidden lg:block") : undefined}
                      >
                        {panel(id)}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {enrolled ? (
            <NextCard
              course={course}
              item={next ?? items.find((i) => !done.has(i.id) && i.id !== current)}
              last={!next}
              left={items.filter((i) => !done.has(i.id)).length}
              onOpen={(id) => open(id)}
            />
          ) : (
            <EnrollCard course={course} items={items} href={enrollHref} />
          )}
        </div>
      </div>
    </section>
  );
}

function startOf(p: Progress, id: string, items: Item[]) {
  const last = p.last[id];
  if (last && items.some((i) => i.id === last)) return last;
  if (!p.enrolled.includes(id)) return "1.1";
  const done = new Set(p.done[id] ?? []);
  return items.find((i) => !done.has(i.id))?.id ?? items[0].id;
}

const labelOf = (i: Item) =>
  i.kind === "video"
    ? `${learnCopy.lesson(i.id)} · ${learnCopy.contents.length(i.minutes)}`
    : i.kind === "quiz"
      ? `${learnCopy.contents.sub.quiz(i.questions ?? 0)} · ${learnCopy.contents.length(i.minutes)}`
      : `${learnCopy.contents.sub.project} · ${learnCopy.contents.length(i.minutes)}`;

/** The hand-in the demo learner has ready: named for the course, in the
 *  first type the brief takes, at a size that type runs to. */
const draftOf = (course: Course, accept: string) => {
  const ext = accept.split(",")[0];
  const h = hash(course.id);
  return {
    name: `${courseSlug(course)}-project${ext}`,
    size: ext === ".sql" ? 3072 + (h % 5120) : 184_320 + (h % 716_800),
  };
};

const metaOf = (i: Item) =>
  i.kind === "video"
    ? learnCopy.meta.video(i.minutes)
    : i.kind === "quiz"
      ? learnCopy.meta.quiz(i.questions ?? 0)
      : learnCopy.meta.project(Math.round(i.minutes / 60));

/** A stage for what is not a video, at least as tall as the player it
 *  stands in for, so moving from a lesson to its quiz does not pull the
 *  page up by the difference. */
function Frame({ children }: { children: ReactNode }) {
  // The spacer stands at the top of its row rather than stretching down it.
  // Stretched, a card taller than 16:9 of the column made the spacer that
  // tall, its ratio then made it wider than the column, and the track grew
  // with it: the quiz ran under the rail, and off a phone's edge.
  return (
    <div className="grid grid-cols-1 before:col-start-1 before:row-start-1 before:aspect-video before:self-start before:content-['']">
      <div className="col-start-1 row-start-1 flex flex-col justify-center pb-4">{children}</div>
    </div>
  );
}

/** A tab's glyph, at the size and weight the track's labels take. */
function glyph(icon: IconSvgElement) {
  return <HugeiconsIcon icon={icon} size={16} strokeWidth={1.7} />;
}

function CourseProgress({ done, total }: { done: number; total: number }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm tabular-nums">
        <span className="font-medium">{learnCopy.progress(done, total)}</span>
      </span>
      {/* Contrast: the meter's fill is 1.3:1 against its bg-muted track,
          under WCAG's 3:1 for a graphic; the count beside it says it. */}
      <span
        role="meter"
        aria-label={learnCopy.progress(done, total)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="block h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:w-40"
      >
        <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </span>
      <span className="text-sm tabular-nums text-muted-foreground">{pct}%</span>
    </div>
  );
}

/** The poster of a lesson that opens on enrolling, dimmed under the one way
 *  on: the price, and lesson one, which is open now. */
function LockedStage({
  course,
  item,
  enrollHref,
  onLessonOne,
}: {
  course: Course;
  item: Item;
  enrollHref: string;
  onLessonOne: () => void;
}) {
  return (
    <div className="rounded-lg bg-card p-2 shadow-soft">
      {/* 16:9, and taller where the card on it is: on a phone the poster is
          183px, and a frame locked to that cut the card top and bottom. */}
      <div className="relative grid grid-cols-1 overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] bg-fixed-dark before:col-start-1 before:row-start-1 before:aspect-video before:self-start before:content-['']">
        <Image
          src={course.image}
          alt=""
          fill
          preload
          sizes="(min-width: 1280px) 820px, (min-width: 1024px) 60vw, 100vw"
          className="object-cover opacity-60 blur-[2px]"
        />
        <div className="relative col-start-1 row-start-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-lg bg-card p-5 text-center shadow-soft-lg">
            <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
              <LockClosedIcon aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-3 text-base font-medium">{learnCopy.locked.title(item.id)}</p>
            <p className="mt-1 text-balance text-sm text-muted-foreground">{learnCopy.locked.body}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button render={<Link href={enrollHref}>{learnCopy.enroll(course.price)}</Link>} />
              <button
                type="button"
                onClick={onLessonOne}
                className="flex h-10 items-center rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
              >
                {learnCopy.locked.toLessonOne}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The item after this one, or on the last item of the course the first one
 *  still open, with how many are left before the certificate. */
function NextCard({
  course,
  item,
  last,
  left,
  onOpen,
}: {
  course: Course;
  item?: Item;
  last: boolean;
  left: number;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="rounded-lg bg-card p-4 shadow-soft">
      <Caps>{!item ? learnCopy.upNext.end : last ? learnCopy.upNext.left : learnCopy.upNext.label}</Caps>
      {item && last && (
        <p className="mt-1 text-sm text-muted-foreground">{learnCopy.upNext.leftBody(left)}</p>
      )}
      {item ? (
        <button
          type="button"
          onClick={() => onOpen(item.id)}
          className="group/next mt-3 flex w-full items-center gap-3 rounded-sm text-left"
        >
          <span className="relative size-16 shrink-0 overflow-hidden rounded-[10px] bg-muted">
            <Image
              src={course.image}
              alt=""
              fill
              sizes="64px"
              className="object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/next:[transform:scale(1.06)] motion-safe:group-active/next:[transform:scale(1)] group-active/next:duration-answer"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-fixed-dark/25">
              <PlayIcon aria-hidden="true" className="size-4 translate-x-px text-fixed-light" />
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-sm font-medium transition-colors group-hover/next:text-muted-foreground">
              {item.kind === "quiz" ? learnCopy.check.quiz(item.m) : item.title}
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">{labelOf(item)}</span>
          </span>
        </button>
      ) : (
        <>
          <p className="mt-2 text-base">{learnCopy.upNext.endBody}</p>
          <Link href="/dashboard" className="mt-3 inline-flex h-10 items-center gap-2 text-sm font-medium">
            {learnCopy.upNext.toDashboard}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </>
      )}
    </div>
  );
}

/** What enrolling opens, counted off the syllabus, beside the price. */
function EnrollCard({ course, items, href }: { course: Course; items: Item[]; href: string }) {
  const videos = items.filter((i) => i.kind === "video").length;
  const quizzes = items.filter((i) => i.kind === "quiz").length;
  const lines = [
    learnCopy.enrolling.lessons(videos - 1),
    learnCopy.enrolling.tutor,
    learnCopy.enrolling.checks(quizzes),
    learnCopy.enrolling.credential(course.credential),
  ];
  return (
    <div className="rounded-lg bg-card p-5 shadow-soft">
      <Caps>{learnCopy.free(course.price)}</Caps>
      <p className="mt-2 text-base font-medium">{learnCopy.enrolling.title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {lines.map((l) => (
          <li key={l} className="flex gap-2.5 text-sm">
            <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-iris-ink" strokeWidth={2} />
            {l}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-5 flex h-10 items-center justify-center rounded-control px-5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
      >
        {learnCopy.enroll(course.price)}
      </Link>
    </div>
  );
}
