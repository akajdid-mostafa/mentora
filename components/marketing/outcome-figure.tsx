"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  CheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import {
  careers,
  chapters,
  credential,
  marks,
} from "@/components/marketing/credential";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

/** A measurement on one line: the figure, what it counts, and where the
 *  number comes from. Every figure here carries its source on the page; the
 *  large one passes no figure and uses the line as its caption. */
function Line({
  figure, label, note,
}: { figure?: string; label: string; note: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      {figure && (
        <span className="text-base font-medium tabular-nums">{figure}</span>
      )}
      <Caps as="span">{label}</Caps>
      <span className="text-balance text-sm text-muted-foreground">{note}</span>
    </p>
  );
}

// The certificate the Download button saves, drawn from the same record the
// card shows, so the file and the page never disagree. An SVG rather than a
// PDF: it is built in the browser with nothing to install, and a real product
// swaps this for the file its own issuing service returns.
const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function certificateSvg() {
  const sans = "ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
  const mono = "ui-monospace, 'SF Mono', Menlo, monospace";
  const c = Object.fromEntries(
    Object.entries(credential).map(([k, v]) => [k, escape(v)]),
  ) as typeof credential;
  const foot = [
    ["Verified by", c.issuer],
    ["Issued", c.issued],
    ["Credential ID", c.id],
  ]
    .map(
      ([k, v], i) => `
    <text x="${96 + i * 336}" y="640" font-family="${mono}" font-size="15" letter-spacing="1.5" fill="#6b6865">${k.toUpperCase()}</text>
    <text x="${96 + i * 336}" y="674" font-family="${sans}" font-size="24" fill="#1c1a18">${v}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
  <rect width="1200" height="850" fill="#ffffff"/>
  <rect x="32" y="32" width="1136" height="786" rx="24" fill="none" stroke="#e7e4e0" stroke-width="2"/>
  <text x="96" y="140" font-family="${sans}" font-size="30" font-weight="600" letter-spacing="-0.5" fill="#1c1a18">Mentora</text>
  <text x="96" y="268" font-family="${mono}" font-size="16" letter-spacing="2" fill="#6b6865">${c.kind.toUpperCase()}</text>
  <text x="96" y="348" font-family="${sans}" font-size="64" letter-spacing="-1.5" fill="#1c1a18">${c.course}</text>
  <text x="96" y="430" font-family="${sans}" font-size="20" fill="#6b6865">Issued to</text>
  <text x="96" y="476" font-family="${sans}" font-size="36" letter-spacing="-0.5" fill="#1c1a18">${c.holder}</text>
  <line x1="96" y1="572" x2="1104" y2="572" stroke="#e7e4e0" stroke-width="2"/>${foot}
  <text x="96" y="760" font-family="${mono}" font-size="16" fill="#6b6865">${c.verify}</text>
</svg>`;
}

function downloadCertificate() {
  const url = URL.createObjectURL(
    new Blob([certificateSvg()], { type: "image/svg+xml" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `mentora-certificate-${credential.id}.svg`;
  document.body.append(a);
  a.click();
  a.remove();
  // revoked a beat later: a URL revoked in the same task can cancel the save
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function OutcomeFigure() {
  const [copied, setCopied] = useState(false);

  // the tick stands for two seconds, then the clipboard is offered again
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${credential.verify}`);
      setCopied(true);
    } catch {
      // clipboard refused (an insecure origin, a denied permission): the
      // link stays on screen to select by hand, and no tick claims otherwise
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <SectionHeading>
        What you <Highlight>carry out of it</Highlight>
      </SectionHeading>

      {/* the stack: a small figure, a rule, the large one, a small figure,
          a rule. The rules are what make the big number an entry in a table
          rather than a poster. */}
      <div className="mt-10">
        <Line {...careers[1]} />
        <span aria-hidden="true" className="mt-4 block h-px w-full bg-border" />

        {/* No padding under the figure: its line box already runs a fifth of
            its size below the digits, and with more on top the caption stood
            nearer the next row (32px) than its own figure (41px). */}
        <p className="pt-2 font-heading text-[clamp(3.5rem,13vw,10rem)]/[var(--heading-leading-display)] tracking-tighter tabular-nums">
          {careers[0].figure}
        </p>
        <Line label={careers[0].label} note={careers[0].note} />

        <div className="mt-12">
          <Line {...careers[2]} />
        </div>
        <span aria-hidden="true" className="mt-4 block h-px w-full bg-border" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[62fr_38fr] [&>*]:min-w-0">
        {/* the reference's wide tile, holding the credential: a white
            certificate on an iris mat, the page's second colour, beside the
            record, which keeps to the brand */}
        <div data-picture className="rounded-lg bg-iris-surface p-6 sm:p-8">
          {/* both tile titles on one line, so what sits under them starts
              level across the pair */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl tracking-tighter sm:text-3xl">
              The credential
            </h3>
            {/* on a pastel mat a chip is white and its ink and dot carry the
                hue: a tinted chip on the mat's own hue drops under 4.5:1 once
                the page moves to its stronger pastel */}
            <span className="flex shrink-0 items-center gap-1.5 rounded-control bg-card px-2.5 py-1 text-xs font-medium text-iris-ink">
              <span className="size-1.5 rounded-full bg-iris" />
              Verified
            </span>
          </div>

          <div className="mt-8 rounded-lg bg-card p-5 shadow-soft sm:p-6">
            <Caps>Issued {credential.issued}</Caps>
            <p className="mt-4 text-xl tracking-tighter sm:text-2xl">
              {credential.course}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{credential.kind}</p>

            <dl className="mt-6 flex flex-col gap-2 border-t pt-5">
              {[
                ["Issued to", credential.holder],
                ["Verified by", credential.issuer],
                ["Credential ID", credential.id],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <Caps as="dt">{k}</Caps>
                  <dd className="text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={copy}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-control bg-card/60 px-4 py-3 text-left transition-colors hover:bg-card active:bg-card/80"
            >
              <span className="sr-only">Copy </span>
              <span className="min-w-0 flex-1 truncate font-mono text-sm">
                {credential.verify}
              </span>
              {copied ? (
                <CheckIcon aria-hidden="true" className="size-4 shrink-0" />
              ) : (
                <ClipboardDocumentIcon aria-hidden="true" className="size-4 shrink-0" />
              )}
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? "Link copied" : ""}
            </span>
            <Button
              type="button"
              onClick={downloadCertificate}
              size="lg"
              className="shrink-0 px-5"
            >
              <ArrowDownTrayIcon aria-hidden="true" data-icon="inline-start" className="size-4" />
              Download
            </Button>
          </div>
        </div>

        {/* the second tile, on the whisper tint: the record behind it. Its
            closing line stands at the foot, level with the credential's
            buttons, rather than leaving the shorter tile's gap under it */}
        <div className="flex flex-col rounded-lg bg-accent p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl tracking-tighter sm:text-3xl">
              The record
            </h3>
            <span className="flex shrink-0 items-center gap-1.5 rounded-control bg-chip px-2.5 py-1 text-xs font-medium text-primary-ink">
              <CheckIcon className="size-3.5" />
              Complete
            </span>
          </div>

          <span aria-hidden="true" className="mt-8 flex gap-1">
            {chapters.map((c) => (
              <span
                key={c.title}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  c.done ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </span>

          <ul className="mt-6 divide-y divide-border border-y border-border">
            {marks.map((m) => (
              <li
                key={m.label}
                className="flex items-baseline justify-between gap-3 py-3 text-sm"
              >
                <span className="text-muted-foreground">{m.label}</span>
                <span className="tabular-nums">{m.value}</span>
              </li>
            ))}
          </ul>

          <p className="mt-auto max-w-sm pt-6 text-balance text-base text-muted-foreground">
            It travels with the credential, so a reviewer reads the same record
            you do.
          </p>
        </div>
      </div>
    </section>
  );
}
