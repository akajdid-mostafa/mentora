"use client";

import { useState } from "react";
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { weekOf } from "@/components/marketing/goals";
import { addDays, longDate, type Plan } from "@/components/paths/plan";
import { reach } from "@/components/reach";
import { cn, count } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// When a session starts: evenings on a weekday, mornings at the weekend.
const START = [19, 19, 19, 19, 19, 9, 9];
const clock = (h: number) => (h === 12 ? "12pm" : h > 12 ? `${h - 12}pm` : `${h}am`);

/** The reference's map, turned from where the session happens to when: the
 *  week the pace asks for, a column a day and a block an hour, each block
 *  at the hour it starts. Four slots a day is the most the slider asks for.
 *  The calendar button saves the same week as a file a calendar opens, one
 *  repeating session a day until the finish, and the finish itself. */
export function Week({
  label,
  pace,
  plan,
  today,
}: {
  label: string;
  pace: number;
  plan: Plan;
  today: string;
}) {
  const week = weekOf(pace);
  const [saved, setSaved] = useState(false);

  const download = () => {
    const file = calendar(label, week, today, plan.finish);
    const url = URL.createObjectURL(new Blob([file], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentora-${label.toLowerCase().replace(/\s+/g, "-")}-path.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  // Every leg done or marked as known: no week to draw and nothing to add
  // to a calendar, and the line says so instead of drawing an empty one.
  if (!plan.weeks) {
    return (
      <p className="max-w-xl text-base text-muted-foreground">
        {plan.legs.some((l) => l.state === "known")
          ? "Nothing left to schedule: every leg is done or marked as known."
          : "Nothing left to schedule: every leg is done."}
      </p>
    );
  }

  return (
    <div>
      {/* A sentence a line from sm, the longer one last, so the last line
          stays the longest whatever the pace and the date make the first. */}
      <p className="max-w-xl text-base text-muted-foreground">
        <span className="sm:block">
          {count(pace, "hour")} a week, until{" "}
          {/* the date whole, never its year alone on the next line */}
          <span className="whitespace-nowrap">{longDate(plan.finish)}</span>.
        </span>{" "}
        <span className="sm:block">Sessions start at 7pm on weekdays and at 9am on weekends.</span>
      </p>
      <div data-object className="mt-6 rounded-lg bg-card p-3 shadow-soft sm:p-4">
        <ol className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {week.map((h, d) => (
            <li key={DAYS[d]} className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
              <p className="flex flex-col items-center pt-1 text-center">
                <span className="text-sm font-medium">{DAYS[d]}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{h ? `${h} h` : "Off"}</span>
              </p>
              {Array.from({ length: 4 }, (_, k) => (
                <span
                  key={k}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-sm text-xs tabular-nums sm:h-10",
                    k < h ? "bg-primary text-primary-foreground" : "bg-accent",
                  )}
                >
                  {k < h && <span className="max-sm:sr-only">{clock(START[d] + k)}</span>}
                </span>
              ))}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={download}
          className={cn(
            "flex h-10 items-center gap-2 rounded-control px-4 text-sm ring-1 ring-inset ring-border press hover:bg-accent",
            reach,
          )}
        >
          <HugeiconsIcon icon={CalendarAdd01Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
          Add to calendar
        </button>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {saved ? "Saved as a calendar file. Open it to add the sessions." : ""}
        </p>
      </div>
    </div>
  );
}

/** The week as an iCalendar file: a session a day at its hour, repeating
 *  weekly until the finish, and the finish as a day of its own. Local
 *  times, so the evening stays at 7pm wherever the file is opened. */
function calendar(label: string, week: number[], today: string, finish: string) {
  const compact = (key: string) => key.replaceAll("-", "");
  const stamp = `${compact(today)}T120000Z`;
  const tomorrow = addDays(today, 1);
  // Monday as 0, as the week is drawn
  const weekday = (key: string) => (new Date(`${key}T12:00:00Z`).getUTCDay() + 6) % 7;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mentora//Paths//EN",
    "CALSCALE:GREGORIAN",
  ];
  week.forEach((hours, d) => {
    if (!hours) return;
    const first = addDays(tomorrow, (d - weekday(tomorrow) + 7) % 7);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${label.replace(/\s+/g, "-").toLowerCase()}-${d}@mentora`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${compact(first)}T${String(START[d]).padStart(2, "0")}0000`,
      `DURATION:PT${hours}H`,
      `RRULE:FREQ=WEEKLY;UNTIL=${compact(finish)}T235959`,
      `SUMMARY:${label} path · Mentora`,
      "END:VEVENT",
    );
  });
  lines.push(
    "BEGIN:VEVENT",
    `UID:${label.replace(/\s+/g, "-").toLowerCase()}-finish@mentora`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(finish)}`,
    `SUMMARY:Finish the ${label.toLowerCase()} path`,
    "END:VEVENT",
    "END:VCALENDAR",
  );
  return lines.join("\r\n");
}
