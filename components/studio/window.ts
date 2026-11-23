// What the studio's window reports on beyond the drafts and the payout: the
// takes the instructor has uploaded, and how learners do on the course's
// module quizzes. The quizzes themselves are the course's own, read on the
// server by take.ts, so the window names the questions learners actually
// meet; nothing here reaches for the lesson packs, since the window runs in
// the browser.
//
// Mock data. A buyer's upload history and quiz results arrive from their
// backend in the shapes below.

// The desk the take was recorded at. Hotlinked from Unsplash, as the course
// photographs are; the id is the licence record, and public/photos/CREDITS.md
// lists it.
export const TAKE_PHOTO = "https://images.unsplash.com/photo-1661493817356-106d0cb05bdf?auto=format&w=1600&q=80";

export type TakeRow = {
  id: string;
  title: string;
  course: string;
  /** Seconds. */
  length: number;
  /** Days since it was uploaded. */
  ago: number;
  /** In review is the take the splitter below is working on. */
  state: "review" | "split" | "published";
  lessons: number;
};

// The last thirty days of uploads, newest first. The first is the take the
// splitter holds, so its length and lessons are the splitter's.
export const takes = (review: { length: number; lessons: number }): TakeRow[] => [
  { id: "sql-m4-t2", title: "Module 4 · take 2", course: "SQL for analysis", length: review.length, ago: 0, state: "review", lessons: review.lessons },
  { id: "ret-c2-t1", title: "Chapter 2 · take 1", course: "Cohorts and retention in SQL", length: 2890, ago: 2, state: "split", lessons: 3 },
  { id: "ret-c1-t2", title: "Chapter 1 · take 2", course: "Cohorts and retention in SQL", length: 3156, ago: 4, state: "split", lessons: 3 },
  { id: "sql-m3-t1", title: "Module 3 · take 1", course: "SQL for analysis", length: 3425, ago: 23, state: "published", lessons: 4 },
];

export type QuizRow = {
  module: number;
  title: string;
  questions: number;
  /** Share of first tries answered right over the last thirty days. */
  right: number;
  attempts: number;
};

export type Hardest = {
  module: number;
  lesson: string;
  at: number;
  q: string;
  options: string[];
  answer: number;
  /** Share of first tries that chose each option. */
  chose: number[];
};

// How learners did, module by module, and on the question most of them
// missed.
export const RESULTS: Record<number, { right: number; attempts: number }> = {
  1: { right: 0.88, attempts: 1640 },
  2: { right: 0.81, attempts: 1410 },
  3: { right: 0.72, attempts: 1260 },
  4: { right: 0.69, attempts: 1105 },
  5: { right: 0.77, attempts: 960 },
};
export const HARDEST = { quiz: "3.4", index: 1, chose: [0.34, 0.27, 0.39] };

export type StudioCourse = { title: string; quizzes: QuizRow[]; hardest: Hardest };
