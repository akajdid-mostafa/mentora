// Where a learner stands in each course, and where the demo learner starts.
// Kept apart from the store in progress.ts, which runs in the browser, so a
// server page can read the seed as well: the dashboard draws its first frame
// from it, as every client component's first render does.
//
// Items are named the way the syllabus prints them: "4.2" for a video, and
// the quiz or the project by their own place in their module.
export type Progress = {
  enrolled: string[];
  done: Record<string, string[]>;
  at: Record<string, Record<string, number>>;
  last: Record<string, string>;
  /** The day each finished course was finished, "YYYY-MM-DD": the date its
   *  certificate carries. The player writes it when the last item is ticked. */
  finished: Record<string, string>;
  /** When each course was last opened in the player, in milliseconds, so
   *  the dashboard puts the course opened most recently first. */
  opened?: Record<string, number>;
};

/** Every item of one module from one place to another: "3.1" to "3.5". */
function run(from: string, to: string) {
  const [m, a] = from.split(".").map(Number);
  const b = Number(to.split(".")[1]);
  return Array.from({ length: b - a + 1 }, (_, i) => `${m}.${a + i}`);
}

// Jordan, the demo learner, is on the data analyst path. They are halfway
// through its first course, SQL for analysis, stopped 04:12 into lesson 4.2,
// the minute the home page's tutor answers from. They finished its second,
// the statistics course, in August, which opened its fourth, A/B tests, and
// they are four minutes into that one's first lesson. Before the path they
// took the free interviews course, the first leg of two other paths. Every
// other course opens on its free first lesson.
//
// A finished course lists every item its syllabus holds, the quizzes and the
// project too, so a syllabus edited in `syllabus/` needs its list here
// edited with it.
export const seed: Progress = {
  enrolled: ["c1", "c19", "c2", "c24"],
  done: {
    c1: [...run("1.1", "1.4"), ...run("2.1", "2.4"), ...run("3.1", "3.4"), "4.1"],
    c2: [...run("1.1", "1.4"), ...run("2.1", "2.4"), ...run("3.1", "3.5"), ...run("4.1", "4.4")],
    c24: [...run("1.1", "1.4"), ...run("2.1", "2.5"), ...run("3.1", "3.4")],
  },
  at: { c1: { "4.2": 252 }, c19: { "1.1": 247 } },
  last: { c1: "4.2", c19: "1.1" },
  finished: { c2: "2026-08-21", c24: "2026-06-12" },
};
