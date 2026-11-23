// Row 8's brief and the syllabus the studio produces from it. The three steps
// are content; how they are arranged on the page is the section's business.

export type Chapter = { title: string; minutes: number; lessons: string[] };

// One brief in, one syllabus out. Written rather than generated, and it has to
// be a course somebody could actually teach — an outline that reads as filler
// makes the claim above it worse than no claim at all.
//
// Its length is measured against the studio's box: at every width from 640 up
// the last line runs past two thirds of the longest, where the shorter brief
// left "spreadsheets" alone on the second line.
export const brief =
  "A practical SQL course for people who already live in spreadsheets and have outgrown them";

export const chapters: Chapter[] = [
  {
    title: "What a table is, if you already know a sheet",
    minutes: 38,
    lessons: [
      "Rows, columns and the one difference that matters",
      "Types, and why a date is not a string",
      "Your first SELECT, on data you recognize",
    ],
  },
  {
    title: "Filtering: WHERE, and the traps in it",
    minutes: 44,
    lessons: [
      "Comparisons, AND, OR and the bracket you forgot",
      "NULL is not zero and not empty",
      "When IN, BETWEEN and LIKE are the wrong choice",
    ],
  },
  {
    title: "Grouping, and the question a total answers",
    minutes: 51,
    lessons: [
      "COUNT, SUM, AVG on a column you chose on purpose",
      "GROUP BY, read as a sentence",
      "HAVING, and why WHERE cannot do it",
    ],
  },
  {
    title: "Joins, nulls and the shape of a result set",
    minutes: 62,
    lessons: [
      "Two tables, one key, and what a join really is",
      "LEFT, INNER, and the rows that disappear",
      "Joining three tables without losing count",
      "Debugging a result set that came back too long",
    ],
  },
  {
    title: "Subqueries and CTEs",
    minutes: 47,
    lessons: [
      "A query inside a query, and when it earns it",
      "WITH: the same thing, readable",
      "Window functions, gently",
    ],
  },
  {
    title: "The analysis you hand somebody",
    minutes: 55,
    lessons: [
      "From a question in a meeting to a query",
      "Sanity checks before anyone sees the number",
      "Shipping it: a view, a schedule, a caveat",
    ],
  },
];

export type Question = { q: string; options: string[]; answer: number; at: string };

export const quiz: Question[] = [
  {
    q: "A LEFT JOIN returns three rows where the right table has no match. What is in those right-hand columns?",
    options: ["Zero", "NULL", "An empty string"],
    answer: 1,
    at: "12:40",
  },
  {
    q: "Which clause filters rows before they are grouped?",
    options: ["HAVING", "WHERE", "Either, they are interchangeable"],
    answer: 1,
    at: "18:05",
  },
  {
    q: "Why does COUNT(*) disagree with COUNT(customer_id) on this table?",
    options: [
      "COUNT(*) counts rows, COUNT(column) skips NULLs",
      "COUNT(*) is faster and rounds",
      "They only disagree on joined tables",
    ],
    answer: 0,
    at: "24:18",
  },
  {
    q: "A three-table join returned more rows than the largest table. The likeliest cause is:",
    options: [
      "A missing WHERE clause",
      "A key that is not unique on one side",
      "The join order",
    ],
    answer: 1,
    at: "41:02",
  },
];

