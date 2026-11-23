// A finished course's certificate: what it says, the address it is checked
// at, and the two files it leaves the dashboard as, the image the Download
// button saves and the LinkedIn form Add to LinkedIn opens filled in. One
// record behind all three, so the card, the file and the profile entry never
// disagree.

import type { Course, Credential } from "@/components/course/courses";
import { learner } from "@/components/dashboard/learner";
import { hash } from "@/lib/utils";

/** Where a certificate is checked, as the home page's credential prints it. */
export const VERIFY = "mentora.dev/verify";

export type Certificate = {
  course: Course;
  /** The credential as the certificate names itself. */
  kind: string;
  /** The day the course was finished, "YYYY-MM-DD". */
  issued: string;
  id: string;
  /** The address, without its scheme, as the certificate prints it. */
  url: string;
  hours: number;
  project: string;
};

const kindOf: Record<Credential, string> = {
  Course: "Course certificate",
  Specialization: "Specialization certificate",
  "Professional Certificate": "Professional Certificate",
  "Guided Project": "Guided Project certificate",
};

export function certificateOf(c: Course, issued: string, project: string): Certificate {
  // the same learner and course always read out the same code
  const h = hash(`${c.id}:${learner.name}`).toString(16).toUpperCase().padStart(8, "0").slice(-8);
  const id = `WP-${h.slice(0, 4)}-${h.slice(4)}`;
  return {
    course: c,
    kind: kindOf[c.credential],
    issued,
    id,
    url: `${VERIFY}/${id}`,
    hours: c.weeks * c.hours,
    project,
  };
}

const at = (key: string) => new Date(`${key}T12:00:00Z`);
/** "August 21, 2026" */
export const issuedOn = (key: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(at(key));

const escape = (s: string) => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

/** The certificate as an image, built in the browser with nothing to
 *  install. An SVG rather than a PDF for the same reason the home page's
 *  credential is one; a real product swaps this for the file its issuing
 *  service returns. */
export function certificateSvg(cert: Certificate) {
  const sans = "ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
  const mono = "ui-monospace, 'SF Mono', Menlo, monospace";
  const t = {
    kind: escape(cert.kind.toUpperCase()),
    course: escape(cert.course.title),
    holder: escape(learner.name),
    hours: escape(`${cert.hours} hours. Project reviewed: ${cert.project}.`),
    url: escape(cert.url),
  };
  const foot = [
    ["Taught at", cert.course.school],
    ["Issued", issuedOn(cert.issued)],
    ["Credential ID", cert.id],
  ]
    .map(
      ([k, v], i) => `
  <text x="${96 + i * 336}" y="640" font-family="${mono}" font-size="15" letter-spacing="1.5" fill="#6b6865">${escape(k.toUpperCase())}</text>
  <text x="${96 + i * 336}" y="674" font-family="${sans}" font-size="24" fill="#1c1a18">${escape(v)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850">
  <rect width="1200" height="850" fill="#ffffff"/>
  <rect x="32" y="32" width="1136" height="786" rx="24" fill="none" stroke="#e7e4e0" stroke-width="2"/>
  <text x="96" y="140" font-family="${sans}" font-size="30" font-weight="600" letter-spacing="-0.5" fill="#1c1a18">Mentora</text>
  <text x="96" y="268" font-family="${mono}" font-size="16" letter-spacing="2" fill="#6b6865">${t.kind}</text>
  <text x="96" y="344" font-family="${sans}" font-size="60" letter-spacing="-1.5" fill="#1c1a18">${t.course}</text>
  <text x="96" y="396" font-family="${sans}" font-size="20" fill="#6b6865">${t.hours}</text>
  <text x="96" y="470" font-family="${sans}" font-size="20" fill="#6b6865">Issued to</text>
  <text x="96" y="514" font-family="${sans}" font-size="36" letter-spacing="-0.5" fill="#1c1a18">${t.holder}</text>
  <line x1="96" y1="572" x2="1104" y2="572" stroke="#e7e4e0" stroke-width="2"/>${foot}
  <text x="96" y="760" font-family="${mono}" font-size="16" fill="#6b6865">${t.url}</text>
</svg>`;
}

/** How often the certificate's address was opened, a week a figure over the
 *  last eight, oldest first: the demo's stand-in for the count a verify page
 *  keeps. Read off the code, so one certificate always tells one story, and
 *  rising, as a certificate's first weeks on a profile do. */
export function viewsOf(cert: Certificate) {
  const h = hash(cert.id);
  const weeks = Array.from({ length: 8 }, (_, i) => 2 + Math.round(i * (1 + (h % 3) * 0.4)) + ((h >> (i * 2)) % 4));
  const month = weeks.slice(-4).reduce((n, x) => n + x, 0);
  const before = weeks.slice(0, 4).reduce((n, x) => n + x, 0);
  return { weeks, month, more: month - before };
}

/** LinkedIn's own add-to-profile form, filled in from the certificate. */
export function linkedInHref(cert: Certificate) {
  const d = at(cert.issued);
  const q = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: `${cert.course.title}, ${cert.kind}`,
    organizationName: "Mentora",
    issueYear: String(d.getUTCFullYear()),
    issueMonth: String(d.getUTCMonth() + 1),
    certUrl: `https://${cert.url}`,
    certId: cert.id,
  });
  return `https://www.linkedin.com/profile/add?${q}`;
}
