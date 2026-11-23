// Everything the course page says about one course beyond its card: the
// syllabus lesson by lesson, the rating behind the star, who teaches it and
// what the price covers. The page reads this on the server and hands each
// client component the one course it shows, so no browser downloads the
// syllabus of all thirty-six to render one.
//
// Mock data, and nothing fetches it. The syllabus drafts live in
// `syllabus/`, one file per subject; the numbers below are worked out from
// them and from courses.ts rather than typed, so a buyer who rewrites a
// syllabus gets a page whose counts, times and previews follow it.

import {
  courses,
  teacherOf,
  teacherStats,
  type Course,
  type Teacher,
} from "@/components/course/courses";
import { business } from "@/components/course/syllabus/business";
import { data } from "@/components/course/syllabus/data";
import { design } from "@/components/course/syllabus/design";
import { engineering } from "@/components/course/syllabus/engineering";
import type { Draft } from "@/components/course/syllabus/types";
import { hash } from "@/lib/utils";

const drafts: Record<string, Draft> = { ...data, ...engineering, ...design, ...business };

export type LessonKind = "video" | "quiz" | "project";

export type Lesson = {
  /** Module and place, "2.3", as the syllabus prints it. */
  id: string;
  title: string;
  kind: LessonKind;
  minutes: number;
  /** A quiz's question count. */
  questions?: number;
  /** Watchable before enrolling, in the preview player. */
  preview?: boolean;
  /** Timed lines for the player's captions, where the lesson has them. */
  captions?: { at: number; text: string }[];
};

export type Module = { title: string; lessons: Lesson[] };

export type Outline = {
  about: string;
  project: string;
  modules: Module[];
  /** Video lessons only: what the course card counts. */
  lessons: number;
  quizzes: number;
  /** Minutes of video across the course. */
  minutes: number;
  previews: Lesson[];
};

// The first lesson of the first two modules is free to watch. Lesson one is
// the course's promise on every page — free, tutor included — and the second
// shows a reader what the course is like once it is under way.
const PREVIEW = new Set(["1.1", "2.1"]);

// Lesson one of SQL for analysis, the course the home page's tutor demo is
// taken from, carries its transcript, so the preview player can show
// captions where a lesson has them.
const captions: Record<string, Lesson["captions"]> = {
  "c1:1.1": [
    { at: 0, text: "If you have lived in spreadsheets for a few years, you already know most of what a table is." },
    { at: 38, text: "Rows, columns, a header along the top. So we start with the one difference that matters." },
    { at: 96, text: "In a sheet, any cell can hold anything: a date, a note, a total, a color." },
    { at: 157, text: "In a table, every value in a column has one type, and the database holds you to it." },
    { at: 224, text: "That sounds like a restriction. It is the reason a query can trust the column it reads." },
    { at: 290, text: "Here is the orders table we use for the whole course. Forty thousand rows, one order each." },
    { at: 361, text: "There is no total row at the bottom. A table holds the facts, and a query adds them up." },
    { at: 433, text: "Nothing is merged, nothing is colored, and nobody has typed N/A into a date." },
    { at: 502, text: "And the rows come back in no order at all until you ask for one." },
    { at: 568, text: "That surprises everybody in the first week, so we will ask for an order every time." },
    { at: 641, text: "Open the practice set under this video and find the column that breaks the rule." },
    { at: 712, text: "The tutor will ask you why it breaks it before it tells you whether you are right." },
  ],
};

/** The syllabus as the page prints it: every lesson with its length, a quiz
 *  closing each module, the project closing the last one. */
export function outlineOf(c: Course): Outline {
  const draft = drafts[c.id];
  if (!draft) throw new Error(`No syllabus for ${c.id} in components/course/syllabus/`);

  const last = draft.modules.length - 1;
  const modules: Module[] = draft.modules.map((m, mi) => {
    // A module's own total, where the draft gives one, is split across its
    // lessons, and the remainder goes to the first ones.
    const split = (li: number) =>
      m.minutes === undefined
        ? 7 + (hash(m.lessons[li]) % 12)
        : Math.floor(m.minutes / m.lessons.length) + (li < m.minutes % m.lessons.length ? 1 : 0);

    const lessons: Lesson[] = m.lessons.map((title, li) => {
      const id = `${mi + 1}.${li + 1}`;
      return {
        id,
        title,
        kind: "video",
        minutes: split(li),
        preview: PREVIEW.has(id) || undefined,
        captions: captions[`${c.id}:${id}`],
      };
    });

    const next = `${mi + 1}.${lessons.length + 1}`;
    if (mi < last) {
      const h = hash(`${c.id}${m.title}`);
      lessons.push({ id: next, title: "Quiz", kind: "quiz", minutes: 6 + (h % 5), questions: 5 + (h % 4) });
    } else {
      // Most of the course's time goes into the project, and its length says
      // so: an eighth of the weeks times the hours, never under two hours.
      const hours = Math.max(2, Math.round(c.weeks * c.hours * 0.12));
      lessons.push({ id: next, title: draft.project, kind: "project", minutes: hours * 60 });
    }
    return { title: m.title, lessons };
  });

  const all = modules.flatMap((m) => m.lessons);
  const videos = all.filter((l) => l.kind === "video");
  return {
    about: draft.about,
    project: draft.project,
    modules,
    lessons: videos.length,
    quizzes: all.filter((l) => l.kind === "quiz").length,
    minutes: videos.reduce((sum, l) => sum + l.minutes, 0),
    previews: videos.filter((l) => l.preview),
  };
}

// ---------------------------------------------------------------------------
// The rating, broken down
// ---------------------------------------------------------------------------

/** How a course's reviews spread across one to five stars, as whole
 *  percentages adding to 100. One family of shapes, placed by the rating: a
 *  4.8 course is mostly fives with a thin tail, a 4.3 has a fatter middle,
 *  and the mean of the spread lands on the rating the card prints. */
export function spread(c: Course): { stars: number; pct: number; count: number }[] {
  // The four lower bars keep one proportion to each other, and the five-star
  // share is solved so the spread's mean is the course's rating.
  const tail = [0.7, 0.18, 0.07, 0.05];
  const tailMean = 4 * tail[0] + 3 * tail[1] + 2 * tail[2] + 1 * tail[3];
  const five = Math.min(0.97, Math.max(0.2, (c.rating - tailMean) / (5 - tailMean)));
  const shares = [five, ...tail.map((t) => t * (1 - five))];

  // Largest remainder, so the five percentages always add to exactly 100.
  const raw = shares.map((s) => s * 100);
  const pct = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; k < 100 - pct.reduce((a, b) => a + b, 0); k++) pct[order[k][1]] += 1;

  return pct.map((p, i) => ({
    stars: 5 - i,
    pct: p,
    count: Math.round(shares[i] * c.reviews),
  }));
}

export type Aspect = { label: string; score: number };

// What learners are asked to rate besides the whole, in the order the page
// draws them. Pace scores lowest on most courses, as it does on real ones:
// the hours a week are the promise a learner holds a course to.
const ASPECTS: [string, number][] = [
  ["Clarity", 0.1],
  ["Pace", -0.25],
  ["Practice", 0],
  ["Tutor", 0.05],
  ["Feedback", 0.05],
  ["Value", -0.1],
];

export function aspectsOf(c: Course): Aspect[] {
  return ASPECTS.map(([label, lean]) => {
    const jitter = ((hash(c.id + label) % 5) - 2) * 0.05;
    const score = Math.min(5, Math.max(3.5, c.rating + lean + jitter));
    return { label, score: Math.round(score * 10) / 10 };
  });
}

// ---------------------------------------------------------------------------
// Who teaches it
// ---------------------------------------------------------------------------

/** What a teacher has done, as three rows: how long and in what, one thing
 *  done that a learner can hold the course to, and how the course is taught.
 *  Written in the teacher's own voice, as a profile is, so a buyer swapping
 *  in their own people swaps the words and nothing else. Each line under a
 *  title is one line of 14px at 1280, where the row holds 396px: a fact a
 *  learner takes in at a glance, not a paragraph. */
export type Credentials = {
  /** The first row's title: "15 years in product design". */
  years: string;
  work: string;
  highlight: string;
  teaching: string;
};

const credentials: Record<string, Credentials> = {
  "Ana Reyes": {
    years: "11\u00a0years in analytics",
    work: "I lead analytics at a payments company.",
    highlight: "My fraud dashboard opens every morning meeting.",
    teaching: "Each lesson starts from a question a manager asked.",
  },
  "Priya Raman": {
    years: "12\u00a0years in finance",
    work: "I built risk models on a trading desk for eight years.",
    highlight: "Three startups I advise raised on these models.",
    teaching: "I review models the way my desk did, cell by cell.",
  },
  "Tomás Oliveira": {
    years: "13\u00a0years in software",
    work: "I build payments software for four million merchants.",
    highlight: "I moved our ledger to Postgres with zero downtime.",
    teaching: "The courses grew out of my weekly code reviews.",
  },
  "Mara Lindqvist": {
    years: "15\u00a0years in product design",
    work: "I run the design system eleven product teams use.",
    highlight: "Our system halved the time from sketch to screen.",
    teaching: "You get notes on your own work every week.",
  },
  "Ibrahim Salah": {
    years: "10\u00a0years in machine learning",
    work: "I build demand and routing models for a logistics firm.",
    highlight: "My routing model cut empty truck miles by a fifth.",
    teaching: "I teach the statistics that tell noise from news.",
  },
  "Dan Whitfield": {
    years: "9\u00a0years in retail analytics",
    work: "I run the reporting for four hundred UK stores.",
    highlight: "I have automated forty reports since 2019.",
    teaching: "You automate one report a week, as I did.",
  },
  "Lucía Ferrer": {
    years: "8\u00a0years in public health data",
    work: "I analyze vaccination and hospital data in Spain.",
    highlight: "My dashboards planned the region's vaccine rollout.",
    teaching: "I teach in Spanish, the way my analysts asked for.",
  },
  "Kofi Mensah": {
    years: "12\u00a0years in platform engineering",
    work: "I run the platform team at a video streaming service.",
    highlight: "We cut our cloud bill by a third in one year.",
    teaching: "I teach the layers under the frameworks.",
  },
  "Hana Sato": {
    years: "10\u00a0years in front\u2011end development",
    work: "I lead front\u2011end development at an online grocer.",
    highlight: "I have audited more than forty checkout flows.",
    teaching: "Each lesson fixes a real bug from those audits.",
  },
  "Rafael Costa": {
    years: "11\u00a0years in backend engineering",
    work: "I design the internal APIs of a bank in São Paulo.",
    highlight: "Forty teams follow the versioning rules I wrote.",
    teaching: "I teach in Portuguese, from the bank's real APIs.",
  },
  "Noor Aziz": {
    years: "14\u00a0years in type and interfaces",
    work: "I draw typefaces at an independent foundry.",
    highlight: "My type sets the headlines of three national papers.",
    teaching: "Every lesson starts on a screen, at reading size.",
  },
  "Inés Soler": {
    years: "9\u00a0years in public service design",
    work: "I design public services for a regional government.",
    highlight: "I have redesigned sixty procedures since 2019.",
    teaching: "I teach in Spanish, on screens from those services.",
  },
  "Sam Okafor": {
    years: "12\u00a0years building companies",
    work: "I founded two software companies and sold both.",
    highlight: "My second company grew to ten thousand customers.",
    teaching: "I teach from my own spreadsheets, mistakes left in.",
  },
  "Eva Brandt": {
    years: "13\u00a0years in product management",
    work: "I led product at two online marketplaces.",
    highlight: "I grew a used-car marketplace from one city to eleven.",
    teaching: "I teach the documents a product manager is judged on.",
  },
  "Claire Dubois": {
    years: "16\u00a0years in finance",
    work: "I run finance at a software company in Lyon.",
    highlight: "I have raised four rounds, the last in six weeks.",
    teaching: "I teach in French, with the questions investors ask.",
  },
};

export type Instructor = Teacher & {
  credentials?: Credentials;
  courses: Course[];
  learners: number;
  rating: number;
};

export function instructorOf(c: Course): Instructor {
  const t = teacherOf(c);
  return { ...t, ...teacherStats(t.name), credentials: credentials[t.name] };
}

// ---------------------------------------------------------------------------
// Where to go next
// ---------------------------------------------------------------------------

/** The courses a learner of this one is likeliest to take next: the same
 *  subject first, then shared skills, the same teacher, and a level at or
 *  one above this one. Eight, in that order. */
export function relatedTo(c: Course, n = 8): Course[] {
  const step = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;
  const score = (x: Course) =>
    (x.topic === c.topic ? 6 : 0) +
    x.skills.filter((s) => c.skills.includes(s)).length * 4 +
    (x.instructor === c.instructor ? 2 : 0) +
    (step[x.level] - step[c.level] === 0 || step[x.level] - step[c.level] === 1 ? 1 : 0);
  return courses
    .filter((x) => x.id !== c.id)
    .map((x, i) => ({ x, s: score(x), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map(({ x }) => x);
}
