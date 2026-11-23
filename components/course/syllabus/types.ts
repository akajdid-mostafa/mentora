// The shape a course's syllabus is written in, before the course page counts
// it. One draft per course, keyed by the course's id in courses.ts.

export type Draft = {
  /** Two sentences on who the course is for and how it teaches, shown under
   *  "About this course". */
  about: string;
  /** The piece of work the last module ends on, reviewed by the instructor's
   *  team. */
  project: string;
  /** In order. Each lesson is a video; the page adds a quiz to the foot of
   *  every module but the last, which ends on the project instead. `minutes`,
   *  where it is set, is the module's video time split across its lessons;
   *  otherwise each lesson's length is read off its title. */
  modules: { title: string; lessons: string[]; minutes?: number }[];
};
