// Every string the dashboard prints, in one place a buyer can find. The
// sentences that carry a figure are functions of that figure, so the words
// and the numbers they read out come from the same record.

import { duration } from "@/components/course/courses";
import { count } from "@/lib/utils";

const hours = (n: number) => count(n, "hour");
/** A phrase that never breaks across two lines: a date, a name. */
export const keep = (text: string) => text.replace(/ /g, "\u00a0");
/** A length that never breaks across two lines: "1 h 10 min". */
export const span = (minutes: number) => keep(duration(minutes));

const at = (key: string) => new Date(`${key}T12:00:00Z`);
/** "August 4", with the year only when it is not this one: "January 18, 2027". */
export function dayOf(key: string, today: string) {
  const year = key.slice(0, 4) !== today.slice(0, 4);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    ...(year ? { year: "numeric" } : {}),
    timeZone: "UTC",
  }).format(at(key));
}

export const dashCopy = {
  meta: {
    title: "My learning",
    description:
      "Your courses under way, the week you set against your goal, the path you are on and the certificates you have earned.",
  },

  // The line under the welcome when a teacher the learner follows has a
  // cohort coming: the instructors page promises their dates land here.
  followed: {
    label: "From teachers you follow",
    line: (teacher: string, course: string, day: string) => `${teacher} opens ${course} on ${day}.`,
    seats: (left: number, of: number) => `${left} of ${of} seats left`,
    more: (n: number) => `${n} more ${n === 1 ? "date" : "dates"}`,
    reserve: "Reserve a seat",
  },

  continue: {
    eyebrow: "My learning",
    title: (first: string) => `Welcome back, ${first}`,
    /** The lede: where the learner stopped, then how far the week is from
     *  its goal. Each sentence is a line of its own from sm. */
    stopped: (where: string, course: string) => `You stopped ${where} of ${course}.`,
    where: {
      video: (at: string, id: string) => `${at} into lesson ${id}`,
      start: (id: string) => `at the start of lesson ${id}`,
      quiz: (m: number) => `at the quiz closing module ${m}`,
      project: "at the final project",
    },
    toGo: (minutes: number, goal: number) => `Another ${span(minutes)} this week reaches your ${goal}-hour goal.`,
    met: (goal: number, weeks: number) =>
      `This week's ${hours(goal)} are in, and your streak stands at ${count(weeks, "week")}.`,
    tabs: "Courses in progress",
    progress: (done: number, total: number) => `${done} of ${total} done`,
    chip: { video: (id: string) => `Lesson ${id}`, quiz: (m: number) => `Quiz ${m}`, project: "Project" },
    module: (m: number, of: number) => `Module ${m} of ${of}`,
    quiz: (questions: number) => `Quiz, ${count(questions, "question")}`,
    resume: (at: string) => `Resume at ${at}`,
    start: { video: (id: string) => `Start lesson ${id}`, quiz: "Start the quiz", project: "Open the project" },
    coursePage: "Course page",
    play: (id: string, at: string) => `Resume lesson ${id} at ${at}`,
    stoppedAt: "Where you stopped",
    reading: "Reading the transcript",
    noLines: "This lesson has no transcript, so the tutor answers from its syllabus.",
    /** The fragment over the photograph when the next item is not a video. */
    next: {
      quiz: (m: number) => `Quiz ${m} is next`,
      quizBody: (questions: number, minutes: number) =>
        `${count(questions, "question")}, about ${span(minutes)}. Four in five right passes the module.`,
      project: "The final project is next",
    },
    of: (at: string, total: string) => `${at} of ${total}`,
    empty: {
      title: "Nothing under way",
      chip: "Next on your path",
      meta: (teacher: string, weeks: number) => `${teacher} · ${count(weeks, "week")}`,
      body: "Lesson one of every course is free, tutor included.",
      start: "Start lesson one",
      action: "Browse courses",
    },
  },

  week: {
    label: "Last 7 days",
    toGo: (minutes: number) => `${span(minutes)} to go`,
    met: "Goal met",
    day: (name: string, minutes: number) => `${name}, ${minutes ? duration(minutes) : "nothing"}`,
    today: "Today",
    goal: "Weekly goal",
    goalValue: (h: number) => `${h} h`,
    lower: "Lower the weekly goal",
    raise: "Raise the weekly goal",
    pace: (minutes: number) => `${span(minutes)} a day meets the goal`,
    streak: (weeks: number) => (weeks ? `${weeks}-week streak` : "No streak yet"),
    streakSince: (date: string) => `Since ${date}`,
    streakNone: "Reach your goal this week to start one",
    weeks: (met: number, now: boolean) =>
      `${met} of the last 8 weeks at your goal, ${now ? "this week too" : "this week under way"}`,
    path: (role: string) => `${role} path`,
    finishes: (date: string) => `Finishes ${date}`,
    left: (h: number) => `${h} h left`,
  },

  path: {
    eyebrow: "Your path",
    title: (role: string) => `${role} path`,
    lede: (done: number, of: number, going: number, left: number, h: number, date: string) =>
      `${done} of ${of} courses finished${going ? `, ${going} under way` : ""}. ${left} hours to go, and at ${hours(h)} a week the last one ends on ${date}.`,
    open: "Open the path",
    leg: (n: string) => `Leg ${n}`,
    state: {
      done: "Done",
      ready: "Ready",
      known: "Known",
      after: (legs: number[]) => `After ${legs.join(" and ")}`,
    },
    hours: (h: number) => `${h} h`,
    finished: (date: string) => `Finished ${date}`,
    left: (h: number) => `${h} h left`,
    weeks: (from: number, to: number) => (from === to ? `Week ${from}` : `Weeks ${from} to ${to}`),
    /** The three figures on an open leg, each under its value. */
    facts: {
      left: "hours left",
      hours: "hours in all",
      studied: "hours studied",
      skipped: "hours skipped",
      done: "of it done",
      week: "week of your plan",
      weeks: "weeks of your plan",
      finished: "the day you finished",
      off: "off your plan",
    },
    /** The open leg's second tile: how it ties into the path. */
    links: {
      opens: "Opens the way to",
      first: "Finish these first",
      ends: "Ends the path",
      cert: "Certificate issued",
      known: "Marked as known",
    },
    pathCert: "Brings the path certificate",
    knownBody: "You told the tutor you know this one, so its hours are off the plan.",
    actions: {
      resume: "Resume the course",
      start: "Start the course",
      view: "See the course",
      review: "Review the course",
      page: "Course page",
    },
    kept: "You kept these paths too",
    legsDone: (n: number, of: number) => `${n} of ${of} done`,
    none: "Not started",
    empty: {
      title: "No path yet",
      body: "Type the job you want on the home page, and the tutor drafts the five courses that lead to it.",
      action: "Draft a path",
    },
  },

  certificates: {
    eyebrow: "Certificates",
    /** The heading, and the words the brand's marker swipes through. */
    title: ["Certificates", "you can show"] as const,
    issued: (kind: string, date: string) => `${kind}, issued ${keep(date)}.`,
    detail: (h: number) => `${hours(h)}, one project reviewed.`,
    project: (title: string) => `The project: ${title}.`,
    to: "Issued to",
    issuedLabel: "Issued",
    instructor: "Instructor",
    /** The hand beside the certificate, pointing at its code. */
    note: ["An employer checks it", "with this code"] as const,
    views: {
      label: "views this month",
      more: (n: number) => `+${n}`,
      after: " from last month",
    },
    view: "View",
    download: "Download",
    copy: "Copy link",
    copied: "Link copied",
    /** Split so a phone can show the network's name alone, beside its logo. */
    linkedin: ["Add to", "LinkedIn"] as const,
    /** What each button acts on, for a screen reader, which meets four of
     *  each on the page. */
    of: (course: string) => `, the ${course} certificate`,
    issuedTo: (name: string, date: string) => `Issued to ${name} on ${date}`,
    close: "Close",
    path: {
      kind: "Path certificate",
      title: (role: string) => `${role} path certificate`,
      body: "Issued when the fifth course is done. It lists all five, with their hours and their reviewed projects.",
      chip: (done: number, of: number) => `${done} of ${of} courses`,
      open: "See the path",
    },
    /** The certificate that holds the place before a first one is earned. */
    ghost: "Your first certificate",
    empty: "Finish a course and its certificate appears here, ready to download and share.",
  },

  saved: {
    eyebrow: "Saved",
    /** The heading, and the words the brand's marker swipes through. */
    title: ["Kept", "for later"] as const,
    browse: "Browse courses",
    tabs: "Saved and recent courses",
    saved: "Saved",
    recent: "Recently viewed",
    door: {
      label: "courses in the catalog",
      saved: "The heart on any of their cards keeps one here.",
      recent: "Open any of them and it joins this list, newest first.",
    },
    removed: (title: string) => `${title} is out of your saved courses.`,
    undo: "Undo",
    clear: "Clear history",
    emptySaved: "Nothing saved yet. The heart on any course card keeps a course here.",
    emptyRecent: "Courses you open show up here, newest first.",
  },
};
