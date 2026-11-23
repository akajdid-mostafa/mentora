// The brief behind each course's closing project, where one is written out.
// A course without one here shows its project's title from the syllabus and
// the general hand-in line, which is true of every project on the platform.

export type ProjectBrief = {
  /** What the project asks for, one task a line. */
  tasks: string[];
  /** What to upload, in a sentence. */
  handIn: string;
  /** File types the upload field offers. */
  accept: string;
};

export const projects: Record<string, ProjectBrief> = {
  // The six questions a finance team sends an analyst in the first month,
  // each answerable from the four tables the course runs on.
  c1: {
    tasks: [
      "Revenue by month for the last twelve months, with refunds taken out",
      "The share of orders refunded in each product category",
      "Customers who ordered once and never again, by city",
      "Average order value in a customer's first 90 days, against everyone else",
      "The ten products that bring in the most revenue, with their share of it",
      "The weekday with the most orders, and whether it held every month",
    ],
    handIn:
      "One .sql file with a query per question, each opening on a comment that says what the number means.",
    accept: ".sql,.txt,.zip",
  },
};

export const fallbackBrief = {
  handIn: "The files the brief asks for, in one upload. A .zip holds more than one.",
  accept: ".zip,.pdf,.sql,.py,.ipynb,.xlsx,.fig,.txt",
};
