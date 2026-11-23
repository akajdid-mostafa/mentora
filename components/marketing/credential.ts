// Row 9's content: the credential a learner walks away with, the chapters
// behind it, and the three career figures.
//
// Every number here is Mentora's own, measured on its own learners and said
// so on the page — an industry figure borrowed from somewhere else is a claim
// the template's buyer cannot stand behind.

export const credential = {
  course: "SQL for analysis",
  kind: "Professional Certificate",
  holder: "Priya Raman",
  issuer: "Northline Institute",
  issued: "March 18, 2026",
  id: "WP-7F42-9C18",
  verify: "mentora.dev/verify/WP-7F42-9C18",
};

export const chapters = [
  { title: "What a table is", done: true },
  { title: "Filtering", done: true },
  { title: "Grouping", done: true },
  { title: "Joins and nulls", done: true },
  { title: "Subqueries and CTEs", done: true },
  { title: "The analysis you hand somebody", done: true },
];

export const marks = [
  { label: "Chapters finished", value: "6 of 6" },
  { label: "Quizzes passed", value: "4 of 4" },
  { label: "Project reviewed", value: "1 of 1" },
];

export const careers = [
  {
    figure: "$94,000",
    label: "Median salary",
    note: "First analyst role, reported by 1,840 graduates twelve months out.",
  },
  {
    figure: "8,200",
    label: "Open roles",
    note: "Named this skill path in their posting, on the boards we track.",
  },
  {
    figure: "71%",
    label: "Hired within a year",
    note: "Of those who finished the path rather than a single course.",
  },
];
