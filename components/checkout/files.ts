// The two files the finished checkout hands over, built in the browser since
// there is no server to send them: the receipt as a page that prints on one
// sheet, and a cohort's Thursday reviews as a calendar file.

import { dateLabel, dayLabel } from "@/components/course-page/start";
import { icsText } from "@/lib/utils";
import { money, type Totals } from "@/components/checkout/order";

const long = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
/** "Sep 29, 2026": a receipt prints the year on every date it carries. */
export const receiptDate = (key: string) => long.format(new Date(`${key}T12:00:00Z`));

/** An order number that reads back as the day it was placed: WP-260929-4821. */
export function orderNumber(day: string, seed: number) {
  return `WP-${day.slice(2).replaceAll("-", "")}-${String(1000 + (seed % 9000)).padStart(4, "0")}`;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type ReceiptLine = { label: string; value: string };

/** The receipt as a standalone page: what was bought, who paid, the money
 *  line by line, and what is still to come off the card. Set in the system
 *  face, since the file is opened away from the site and its fonts. */
export function receiptPage({
  number,
  day,
  buyer,
  item,
  lines,
  totals,
  paidWith,
  footer,
}: {
  number: string;
  day: string;
  buyer: string[];
  item: { title: string; detail: string };
  lines: ReceiptLine[];
  totals: Totals;
  paidWith: string;
  footer: string;
}) {
  const rows = lines
    .map((l) => `<tr><td>${escape(l.label)}</td><td class="n">${escape(l.value)}</td></tr>`)
    .join("");
  const next = totals.schedule
    ? totals.schedule
        .slice(1)
        .map((p) => `<li>${escape(money(p.cents))} on ${escape(receiptDate(p.key))}</li>`)
        .join("")
    : totals.charge
      ? `<li>${escape(money(totals.total))} on ${escape(receiptDate(totals.charge))}, when the free week ends</li>`
      : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Mentora receipt ${escape(number)}</title>
<style>
  body { font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #23201d; margin: 48px auto; max-width: 560px; padding: 0 24px; }
  h1 { font-size: 28px; font-weight: 500; letter-spacing: -0.02em; margin: 0 0 4px; }
  .muted { color: #6f6a64; }
  .mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  hr { border: 0; border-top: 1px solid #e7e3de; margin: 24px 0; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 6px 0; }
  .n { text-align: right; font-variant-numeric: tabular-nums; }
  .total td { border-top: 1px solid #e7e3de; padding-top: 12px; font-weight: 600; font-size: 17px; }
  ul { padding-left: 18px; margin: 8px 0 0; }
</style></head>
<body>
  <h1>Receipt</h1>
  <p class="muted">Mentora · <span class="mono">${escape(number)}</span> · ${escape(receiptDate(day))}</p>
  <hr>
  <p><strong>${escape(item.title)}</strong><br><span class="muted">${escape(item.detail)}</span></p>
  <p class="muted">${buyer.map(escape).join("<br>")}</p>
  <hr>
  <table>${rows}<tr class="total"><td>Paid today</td><td class="n">${escape(money(totals.today))}</td></tr></table>
  <p class="muted">Paid with ${escape(paidWith)}.</p>
  ${next ? `<p>Still to come off the same card:</p><ul>${next}</ul>` : ""}
  <hr>
  <p class="muted">${escape(footer)}</p>
</body></html>
`;
}

/** A cohort's live reviews as a calendar file: one event a Thursday from
 *  the first week to the last, at 17:00 UTC, which a calendar shows in the
 *  reader's own hour. */
export function cohortCalendar({
  id,
  title,
  teacher,
  starts,
  ends,
  url,
}: {
  id: string;
  title: string;
  teacher: string;
  starts: string;
  ends: string;
  url: string;
}) {
  const compact = (key: string) => key.replaceAll("-", "");
  // the cohort starts on a Monday, so its first review is three days on
  const first = new Date(`${starts}T17:00:00Z`);
  first.setUTCDate(first.getUTCDate() + 3);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mentora//Checkout//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${id}-${starts}-reviews@mentora`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${compact(first.toISOString().slice(0, 10))}T170000Z`,
    "DURATION:PT1H",
    `RRULE:FREQ=WEEKLY;BYDAY=TH;UNTIL=${compact(ends)}T235959Z`,
    `SUMMARY:${icsText(`${title}: live review`)}`,
    `DESCRIPTION:${icsText(`The week's work, reviewed live with ${teacher}. Cohort of ${dayLabel(starts)} to ${dateLabel(ends)}.`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
