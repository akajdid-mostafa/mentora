// What a lesson says, minute by minute, and what the lesson player builds on
// it: the lines its captions and transcript read, the questions the tutor
// offers and answers from those lines, and the practice set under lesson one.
// One file per subject, keyed by the course's id in courses.ts and then by the
// lesson's place in the syllabus, "1.1", as the syllabus prints it.
//
// Written rather than generated, like the syllabus: a transcript is the part
// of the product a learner reads word for word, and a line of filler in it
// undoes every claim the home page makes about the tutor.

export type Line = {
  /** Seconds into the lesson. */
  at: number;
  text: string;
};

/** A question the tutor offers on a lesson, answered from one minute of its
 *  transcript: `at` is always the `at` of one of the lesson's lines, and the
 *  answer names that minute. */
export type Ask = { q: string; at: number; body: string };

/** One question of a practice set or a module quiz, graded the moment it is
 *  answered. `at` is where a lesson covers it; a quiz question names that
 *  lesson too, because a quiz closes a whole module. */
export type Check = {
  q: string;
  options: string[];
  /** The index of the right option. */
  answer: number;
  /** One sentence on why the answer holds, shown once one is chosen. */
  why: string;
  at: number;
  lesson?: string;
};

export type LessonPack = {
  transcript: Line[];
  asks: Ask[];
  practice?: Check[];
};

export type CoursePack = {
  /** By lesson, "1.1". A video lesson with no pack plays without captions,
   *  and the tutor answers it from the syllabus rather than from a minute. */
  lessons: Record<string, LessonPack>;
  /** By the quiz's own place in the syllabus, "1.4". */
  quizzes?: Record<string, Check[]>;
};
