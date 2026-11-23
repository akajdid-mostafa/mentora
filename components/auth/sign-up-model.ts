// What the sign-up asks and what it works out from the answers, apart from
// the form that asks it, so the preview beside the form reads the same
// arithmetic the form's last step prints.

import { courses, topics, type Topic } from "@/components/course/courses";
import { demo } from "@/components/auth/demo";
import { goals, type Goal } from "@/components/marketing/goals";
import { addDays, planOf, shortDate } from "@/components/paths/plan";

export type Role = "learn" | "teach";

export type SignUpValues = {
  name: string;
  email: string;
  password: string;
  role: Role;
  goal: string;
  topic: Topic;
  idea: string;
  pace: number;
  notes: boolean;
  terms: boolean;
};
export type SignUpKey = keyof SignUpValues;

/** Where every field rests: the demo learner, the path the dashboard has
 *  them on, and the nine hours a week the planners open at, so Continue
 *  and Create work on their first press. */
export const restingSignUp: SignUpValues = {
  name: demo.name,
  email: demo.email,
  password: demo.password,
  role: "learn",
  goal: goals[0].id,
  topic: "Data",
  idea: "SQL for people who live in spreadsheets",
  pace: 9,
  notes: true,
  terms: true,
};

export const goalOf = (id: string): Goal =>
  goals.find((g) => g.id === id) ?? goals[0];

/** "JE" — the first letters of the first and last words. */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  return (
    words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")
  ).toUpperCase();
}

/** The path read for somebody who has taken none of it: every hour ahead,
 *  the weeks at this pace and the day the last course ends. */
export function freshPlan(g: Goal, pace: number, today: string) {
  const plan = planOf(
    g,
    g.legs.map(() => ({ done: 0, enrolled: false })),
    [],
    pace,
    today,
  );
  return {
    hours: plan.total,
    weeks: plan.weeks,
    finish: shortDate(plan.finish),
  };
}

/** Hours a six-chapter course takes to record and edit, which the teaching
 *  side's last step plans a first draft from. */
export const DRAFT_HOURS = 30;

export function draftDate(pace: number, today: string) {
  return shortDate(addDays(today, Math.ceil(DRAFT_HOURS / pace) * 7));
}

/** Courses the catalogue lists under each subject, counted from the array
 *  rather than claimed, as the listing pages count theirs. */
export const liveIn = (t: Topic) => courses.filter((c) => c.topic === t).length;

export { topics };
