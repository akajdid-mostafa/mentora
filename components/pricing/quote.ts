// The team's quote as a file, built in the browser since there is no server to
// send it: a page that prints on one sheet, set in the system face because it
// is opened away from the site and its fonts. Written the way /checkout's
// receipt is, so the two documents a visitor can take away read as one set.

import { plansCopy } from "@/components/pricing/copy";
import { QUOTE_FROM, teamOf, teams, usd } from "@/components/pricing/math";

const long = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A quote number that reads back as the day and the seats: Q-260930-020. */
export const quoteNumber = (day: string, seats: number) =>
  `Q-${day.slice(2).replaceAll("-", "")}-${String(seats).padStart(3, "0")}`;

export function quotePage({ day, seats, yearly }: { day: string; seats: number; yearly: boolean }) {
  const t = teamOf(seats, yearly);
  const d = new Date(`${day}T12:00:00Z`);
  const until = new Date(d);
  until.setUTCDate(until.getUTCDate() + 30);
  const period = yearly ? "year" : "month";
  const number = quoteNumber(day, seats);
  const lines = [
    [`${teams.name}, ${seats} seats`, `${usd(t.seat)} a seat a ${period}`],
    ["Billed", yearly ? "Yearly, on one invoice with 30 days to pay" : "Monthly, by card"],
    [`Total a ${period}`, usd(t.total)],
    ...(yearly ? [["Against paying monthly", `${usd(t.savedByYear)} less a year`]] : []),
  ];
  const rows = lines.map(([a, b]) => `<tr><td>${escape(a)}</td><td class="n">${escape(b)}</td></tr>`).join("");
  const ticks = plansCopy.plans.teams.ticks.map((x) => `<li>${escape(x)}</li>`).join("");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Mentora quote ${escape(number)}</title>
<style>
  body { font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #23201d; margin: 48px auto; max-width: 560px; padding: 0 24px; }
  h1 { font-size: 28px; font-weight: 500; letter-spacing: -0.02em; margin: 0 0 4px; }
  .meta { color: #6f6a64; margin: 0 0 32px; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 28px; }
  td { padding: 10px 0; border-top: 1px solid #e7e3de; vertical-align: top; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  h2 { font-size: 15px; font-weight: 500; margin: 0 0 8px; }
  ul { margin: 0 0 28px; padding-left: 20px; }
  p { margin: 0 0 12px; }
  .small { color: #6f6a64; font-size: 13px; }
</style></head><body>
<h1>Quote ${escape(number)}</h1>
<p class="meta">Issued ${escape(long.format(d))} · valid until ${escape(long.format(until))}</p>
<table>${rows}</table>
<h2>Every seat includes</h2>
<ul><li>All 12,400 courses and every path</li>${ticks}</ul>
${seats >= QUOTE_FROM ? `<p>From ${QUOTE_FROM} seats a named contact prices the contract; the figures above are the list price.</p>` : ""}
<p class="small">Prices before tax. VAT or GST for your country is added to the invoice. Seats can be added at any time and removed at renewal.</p>
<p class="small">Mentora Teams · teams@example.com</p>
</body></html>`;
}
