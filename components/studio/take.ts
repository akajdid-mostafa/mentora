// The recording the studio splits: module 4 of SQL for analysis, recorded
// again in one take. The transcript is the one learners read in the lesson
// player today, lesson by lesson, laid end to end, so every line the splitter
// quotes is a line the course already says. Read on the server, and only this
// module is handed to the page.
//
// Mock data. A buyer's recording arrives from their own upload and
// transcription; the shape below is what the splitter needs from it.

import { courseById, type Course } from "@/components/course/courses";
import { outlineOf } from "@/components/course/detail";
import { packOf } from "@/components/course/lessons";
import type { Check, Line } from "@/components/course/lessons/types";
import { HARDEST, RESULTS, type StudioCourse } from "@/components/studio/window";

export type TakeLesson = {
  /** The lesson this part of the take replaces, "4.2". */
  id: string;
  /** Its title on the course page today. */
  published: string;
  /** What the studio calls this part, from what is said in it. */
  drafted: string;
  /** Where the studio cut, in seconds into the take. */
  start: number;
  /** The query on screen when the part opens: the frame the rail shows. */
  frame: string[];
  /** Why the studio cut here, for every part after the first. */
  reason?: string;
};

export type Take = {
  course: string;
  module: string;
  label: string;
  /** The whole take, in seconds. */
  length: number;
  /** Every line said, at its second in the take. */
  lines: (Line & { lesson: string })[];
  lessons: TakeLesson[];
  /** The module's quiz as learners take it today, then the spares Swap
   *  draws from, each question at its second in the take. */
  quiz: Question[];
};

export type Question = Check & {
  id: string;
  /** Its second in the take. */
  take: number;
  /** Not in the first cut: a question Swap or Discard brings in. */
  spare?: boolean;
};

// More questions from the same four lessons, each from a line the take says,
// for Swap and Discard to draw on once the quiz's own five are dealt. Each
// "why" is fitted to the quiz card's 24rem column after its "Why:", as the
// module quiz's own five are: every last line past two thirds of the first.
const SPARES: Check[] = [
  {
    q: "In customers each customer_id appears once. How often does it appear in orders?",
    options: ["Once for every order the customer placed", "Once, as in customers", "Once for every day with an order"],
    answer: 0,
    why: "Orders has one row per order, so a customer_id repeats once for every order that customer placed.",
    lesson: "4.1",
    at: 163,
  },
  {
    q: "What should you compare before and after every join?",
    options: ["The number of rows", "The column names", "How long the query ran"],
    answer: 0,
    why: "If the count changes, the join dropped rows or copied them, and you need to know which before a total.",
    lesson: "4.1",
    at: 814,
  },
  {
    q: "Changing LEFT JOIN to JOIN drops three March 1 customers. What warns you?",
    options: ["An error message", "Only the smaller row count", "A NULL in the output"],
    answer: 1,
    why: "The inner join runs without complaint and returns 28 rows instead of 31. The count is the only sign.",
    lesson: "4.2",
    at: 356,
  },
  {
    q: "How do you list the March 1 sign\u2011ups who never placed an order?",
    options: ["Inner join, then WHERE o.order_id IS NULL", "Left join, then WHERE o.order_id IS NULL", "Left join, then WHERE o.status = 'paid'"],
    answer: 1,
    why: "The left join keeps the customers with no orders, and a NULL order_id picks out those customers alone.",
    lesson: "4.2",
    at: 462,
  },
  {
    q: "After joining orders to order_items, how do you count orders?",
    options: ["COUNT(*)", "COUNT(DISTINCT o.order_id)", "SUM(oi.quantity)"],
    answer: 1,
    why: "There is one row per item now, so COUNT(*) counts items, and DISTINCT counts each order once.",
    lesson: "4.3",
    at: 607,
  },
  {
    q: "Products holds fourteen product_ids twice. Where did the second rows come from?",
    options: ["A June price change loaded as new rows", "Two warehouses stocking one product", "A join that ran twice"],
    answer: 0,
    why: "The June prices went in as new rows rather than updates, so each of those products sits in the table twice.",
    lesson: "4.4",
    at: 456,
  },
];

// Each part's length on the take: the course page's 16, 16, 15 and 15
// minutes, a few seconds past the last line said in each.
const LENGTHS = [958, 949, 904, 897];

const PARTS: Record<string, Omit<TakeLesson, "id" | "published" | "start">> = {
  "4.1": {
    drafted: "Inner joins and the 96 missing orders",
    frame: ["FROM orders o", "JOIN customers c", "  ON c.customer_id = o.customer_id"],
  },
  "4.2": {
    drafted: "The customers who never ordered",
    frame: ["FROM customers c", "LEFT JOIN orders o", "  ON o.customer_id = c.customer_id"],
    reason: "The talk turns from inner joins to the rows a left join keeps.",
  },
  "4.3": {
    drafted: "Revenue by category across three tables",
    frame: ["FROM orders o", "JOIN order_items oi", "  ON oi.order_id = o.order_id"],
    reason: "A new question starts: March revenue by category.",
  },
  "4.4": {
    drafted: "Finding the join that added 46 rows",
    frame: ["SELECT product_id, COUNT(*)", "FROM products", "GROUP BY product_id", "HAVING COUNT(*) > 1"],
    reason: "You go back to the forty-six rows the last join added.",
  },
};

export function takeOf(): Take {
  const course = courseById("c1") as Course;
  const pack = packOf(course.id);
  if (!pack) throw new Error("SQL for analysis has no lesson pack");
  const outline = outlineOf(course);
  const mod = outline.modules[3];

  let start = 0;
  const lessons: TakeLesson[] = [];
  const lines: Take["lines"] = [];
  Object.keys(PARTS).forEach((id, i) => {
    const published = mod.lessons.find((l) => l.id === id)?.title ?? id;
    lessons.push({ id, published, start, ...PARTS[id] });
    for (const l of pack.lessons[id]?.transcript ?? []) lines.push({ at: start + l.at, text: l.text, lesson: id });
    start += LENGTHS[i];
  });

  const at = (lesson: string, s: number) => (lessons.find((l) => l.id === lesson)?.start ?? 0) + s;
  const quiz: Question[] = [
    ...(pack.quizzes?.["4.5"] ?? []).map((q, i) => ({ ...q, id: `q${i + 1}`, take: at(q.lesson ?? "4.1", q.at) })),
    ...SPARES.map((q, i) => ({ ...q, id: `s${i + 1}`, take: at(q.lesson ?? "4.1", q.at), spare: true })),
  ];

  return {
    course: course.title,
    module: mod.title,
    label: "Module 4 · take 2",
    length: start,
    lines,
    lessons,
    quiz,
  };
}

/** The course the window reports on, read on the server: its module quizzes
 *  as learners take them, and the hardest question among them. */
export function studioCourseOf(): StudioCourse {
  const course = courseById("c1") as Course;
  const pack = packOf(course.id);
  if (!pack?.quizzes) throw new Error("SQL for analysis has no module quizzes");
  const outline = outlineOf(course);
  const quizzes = Object.entries(pack.quizzes).map(([key, questions]) => {
    const n = Number(key.split(".")[0]);
    return {
      module: n,
      title: outline.modules[n - 1].title,
      questions: questions.length,
      ...RESULTS[n],
    };
  });
  const q = pack.quizzes[HARDEST.quiz][HARDEST.index];
  return {
    title: course.title,
    quizzes,
    hardest: {
      module: Number(HARDEST.quiz.split(".")[0]),
      lesson: q.lesson ?? HARDEST.quiz,
      at: q.at,
      q: q.q,
      options: q.options,
      answer: q.answer,
      chose: HARDEST.chose,
    },
  };
}
