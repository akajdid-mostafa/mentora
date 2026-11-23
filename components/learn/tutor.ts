// How the tutor answers a question typed in its own words. There is no model
// behind it: the demo matches the question against what the lesson actually
// says, in three steps, and says so when nothing in the course covers it. That
// is the promise the home page makes about the real one, and the only order in
// which a canned answer can keep it:
//
//   1. one of the lesson's own suggested questions, asked another way;
//   2. the line of the transcript that shares the most words with it;
//   3. another lesson of the course whose title does.
//
// A question asking for a quiz's answer outright is turned back into the
// minute to watch, while a quiz is open.

import type { Language } from "@/components/course/courses";
import type { Outline } from "@/components/course/detail";
import type { LessonPack } from "@/components/course/lessons/types";
import { clock, tutorVoice } from "@/components/learn/copy";

export type Reply = {
  text: string;
  /** The minute the answer comes from, and the line spoken there. */
  cite?: { lesson: string; at: number; line?: string };
  /** Another lesson of the course the answer sends the learner to. */
  open?: { lesson: string; title: string };
};

// Words that carry no subject in the four languages the catalogue teaches in.
const STOP = new Set(
  (
    "the and for are but not you your yours with what why how when where which who whom " +
    "does did do was were been being have has had this that these those there here then " +
    "than into onto from about over under again just only also very can could would should " +
    "will shall may might must its it's i'm i've don't doesn't didn't isn't aren't wasn't " +
    "lesson lessons minute video part mean means meaning explain tell show say says said " +
    "please get got make made one two use used using thing things something way really " +
    "que qué los las del una unos unas por para con sin sobre como cómo cuando cuándo " +
    "donde dónde porque por qué esto esta este eso esa ese lección minuto vídeo video " +
    "uma umas uns dos das pelo pela com sem sobre como quando onde porque isso essa esse " +
    "aula vídeo minuto les des une pour avec sans sur comme quand pourquoi cette ceci cela " +
    "est sont leçon vidéo minute dans quoi quel quelle"
  ).split(" "),
);

// A light stem, enough for "joins" to meet "join" and "grouping" to meet
// "group". Accents come off first, so "vídeo" and "video" are one word.
function stem(w: string) {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s")) return w.slice(0, -1);
  return w;
}

export function words(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9*_' ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem);
}

const shared = (a: string[], b: string[]) => {
  const bs = new Set(b);
  return new Set(a.filter((w) => bs.has(w))).size;
};

const GIVE_AWAY =
  /\b(answer|which option|which one|tell me the|correct option|solution|respuesta|opci[oó]n correcta|resposta|op[cç][aã]o certa|r[ée]ponse|bonne option)\b/i;

export function answer(
  question: string,
  {
    lesson,
    pack,
    outline,
    lang,
    quiz,
  }: {
    lesson: string;
    pack?: LessonPack;
    outline: Outline;
    lang: Language;
    /** The minute behind the quiz question on screen, while a quiz is open. */
    quiz?: { at: number; lesson: string };
  },
): Reply {
  const voice = tutorVoice[lang];
  const asked = words(question);

  if (quiz && GIVE_AWAY.test(question)) {
    return {
      text: voice.noAnswer(clock(quiz.at)),
      cite: { lesson: quiz.lesson, at: quiz.at },
    };
  }

  if (pack && asked.length) {
    const lineAt = (at: number) => pack.transcript.find((l) => l.at === at)?.text;

    // A suggested question, pressed as a chip or typed out in full, and
    // then one asked another way: most of its own words are in the question
    // typed, and two of them at least unless it only has the one.
    const same = (a: string) => a.trim().toLowerCase() === question.trim().toLowerCase();
    const ask =
      pack.asks.find((a) => same(a.q)) ??
      pack.asks
        .map((a) => ({ a, own: words(a.q), hit: shared(asked, words(a.q)) }))
        .filter(({ own, hit }) => hit >= Math.max(Math.min(2, own.length), Math.ceil(own.length * 0.6)))
        .sort((x, y) => y.hit - x.hit)[0]?.a;
    if (ask) {
      return { text: ask.body, cite: { lesson, at: ask.at, line: lineAt(ask.at) } };
    }

    // The line that shares the most words with it. One shared word is enough
    // for a question of one or two words, "window functions?", and not for a
    // sentence, where one common word is chance.
    const line = pack.transcript
      .map((l) => ({ l, hit: shared(asked, words(l.text)) }))
      .sort((x, y) => y.hit - x.hit)[0];
    if (line && (line.hit >= 2 || (line.hit === 1 && asked.length <= 2))) {
      return {
        text: voice.line(clock(line.l.at), line.l.text),
        cite: { lesson, at: line.l.at, line: line.l.text },
      };
    }
  }

  // Another lesson of the course, by its title.
  const other = outline.modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.kind === "video" && l.id !== lesson)
    .map((l) => ({ l, hit: shared(asked, words(l.title)) }))
    .sort((x, y) => y.hit - x.hit)[0];
  if (other && other.hit >= 1) {
    return {
      text: voice.elsewhere(lesson, other.l.id, other.l.title),
      open: { lesson: other.l.id, title: other.l.title },
    };
  }

  return { text: voice.nothing };
}
