// Writes DESIGN.md's front matter from app/globals.css, and its budget lines
// from .soft-neutral.json when that file is present.
//
//   npm run design            rewrite DESIGN.md
//   npm run design -- --check exit 1 when DESIGN.md has drifted from the CSS
//
// One direction only. The values live in globals.css, where a shadcn project
// keeps them; DESIGN.md's front matter is a reading of that file in the shape
// Google's DESIGN.md spec defines, so a coding agent or a design tool gets the
// real numbers. Edit the CSS, then run this — never edit the front matter.
//
// The prose below the front matter is written by hand and left alone, except
// between `<!-- budget:… -->` and `<!-- /budget -->`, which carry the limits a
// page is built to. Without .soft-neutral.json those lines are kept as they
// are.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CSS = join(ROOT, "app/globals.css");
// Where next/font is called: in the root layout, or in a module the layout
// and the global error page both import.
const LOADERS = [join(ROOT, "app/layout.tsx"), join(ROOT, "lib/fonts.ts")];
const DESIGN = join(ROOT, "DESIGN.md");
const DIALS = join(ROOT, ".soft-neutral.json");
const TAILWIND = join(ROOT, "node_modules/tailwindcss/theme.css");

// --- reading the CSS ---------------------------------------------------------

// Every custom property, keyed by the block it is declared in. Comments are
// dropped first; nesting is followed so a rule inside @layer still counts.
function declarations(text) {
  const out = [];
  const stack = [];
  const src = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const token = /([^{};]+)\{|\}|([^{};]+);/g;
  let m;
  while ((m = token.exec(src))) {
    if (m[1] !== undefined) stack.push(m[1].trim().replace(/\s+/g, " "));
    else if (m[0] === "}") stack.pop();
    else {
      const d = m[2].trim();
      if (!d.startsWith("--")) continue;
      const i = d.indexOf(":");
      out.push({ block: stack.join(" > "), name: d.slice(0, i).trim(), value: d.slice(i + 1).trim().replace(/\s+/g, " ") });
    }
  }
  return out;
}

// The page's own values: `:root` and the @theme blocks. A pastel strength or a
// heading-only rebinding is a variation on these, and stays in the prose.
function table() {
  const vars = new Map();
  if (existsSync(TAILWIND)) {
    for (const d of declarations(readFileSync(TAILWIND, "utf8"))) vars.set(d.name, d.value);
  }
  for (const d of declarations(readFileSync(CSS, "utf8"))) {
    if (d.block === ":root" || d.block.startsWith("@theme")) {
      // `@theme inline` maps a utility onto a :root value of the same name
      // (`--font-sans: var(--font-sans)`); the :root one is the value.
      if (d.value === `var(${d.name})`) continue;
      vars.set(d.name, d.value);
    }
  }
  return vars;
}

function resolve(vars, value, depth = 0) {
  if (value == null || depth > 12) return value;
  return value.replace(/var\((--[\w-]+)(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, name, fallback) => {
    if (vars.has(name)) return resolve(vars, vars.get(name), depth + 1);
    return fallback !== undefined ? resolve(vars, fallback.trim(), depth + 1) : `var(${name})`;
  });
}

// --- values in the spec's shapes ---------------------------------------------

function hex(n) {
  return Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
}

// hsl(h s% l%) or hsl(h s% l% / a) to #rrggbb[aa]; oklch() and hex pass as
// they are, since the spec reads both. Anything else is not a colour this file
// can state, and is left out rather than guessed.
function colour(value) {
  if (!value) return null;
  const v = value.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(v) || /^oklch\(/i.test(v)) return v;
  const m = v.match(/^hsla?\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?))?\s*\)$/i);
  if (!m) return null;
  const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  let out = `#${hex(f(0) * 255)}${hex(f(8) * 255)}${hex(f(4) * 255)}`;
  if (m[4] !== undefined) {
    const a = m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4];
    if (a < 1) out += hex(a * 255);
  }
  return out;
}

// A length in px, the unit the spec's examples use. `calc(var(--radius) * k)`
// is the radius ladder; `calc(infinity * 1px)` is the pill.
function length(value) {
  if (!value) return null;
  const v = value.trim();
  if (/infinity/.test(v)) return "9999px";
  const calc = v.match(/^calc\(\s*([\d.]+)(rem|px)\s*\*\s*([\d.]+)\s*\)$/);
  if (calc) return px(+calc[1] * +calc[3], calc[2]);
  const plain = v.match(/^([\d.]+)(rem|px)$/);
  if (plain) return px(+plain[1], plain[2]);
  if (v === "0") return "0px";
  return null;
}

function px(n, unit) {
  const value = unit === "rem" ? n * 16 : n;
  return `${+value.toFixed(2)}px`;
}

// Unitless where the CSS writes a ratio, as `calc(1.25 / 0.875)`.
function ratio(value) {
  if (!value) return null;
  const v = value.trim();
  const calc = v.match(/^calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)$/);
  if (calc) return +(+calc[1] / +calc[2]).toFixed(4);
  if (/^[\d.]+$/.test(v)) return +v;
  return null;
}

// The family a font variable carries. next/font names it in layout.tsx —
// `Plus_Jakarta_Sans({ variable: "--font-plus-jakarta-sans" })` — and a fetched
// face names itself in globals.css as a quoted string at the head of a stack.
function family(vars, name) {
  const raw = vars.get(name);
  if (raw) {
    const quoted = raw.match(/^\s*"([^"]+)"/);
    if (quoted) return quoted[1];
    const via = raw.match(/^var\((--font-[\w-]+)/);
    if (via && via[1] !== name) return family(vars, via[1]);
  }
  for (const file of LOADERS.filter(existsSync)) {
    const source = readFileSync(file, "utf8");
    const loader = new RegExp(`(\\w+)\\(\\{[^}]*?variable:\\s*"${name}"`).exec(source);
    if (loader && loader[1] !== "localFont") return loader[1].replace(/_/g, " ");
  }
  return name.replace(/^--font-/, "").split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

// --- the front matter ---------------------------------------------------------

const COLOURS = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "primary-ink",
  "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "border", "input", "ring", "destructive",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  ...["leaf", "sun", "coral", "iris", "lime", "sky", "peach"].flatMap((h) => [h, `${h}-ink`]),
];

const RADII = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

function frontMatter() {
  const vars = table();
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const v = (name) => resolve(vars, vars.get(name));

  const colors = {};
  for (const name of COLOURS) {
    const c = colour(v(`--${name}`));
    if (c) colors[name] = c;
  }

  const body = family(vars, "--font-sans");
  // `--font-heading` reads itself with the body as fallback until a pairing
  // writes one into :root.
  const set = vars.get("--font-heading") ?? "";
  const heading = !set || set.startsWith("var(--font-heading") ? body : family(vars, "--font-heading");
  const size = (step) => length(v(`--text-${step}`));
  const lead = (step) => ratio(v(`--text-${step}--line-height`));
  const typography = {
    heading: {
      fontFamily: heading, fontSize: size("5xl"),
      fontWeight: +v("--heading-weight-normal") || 400,
      lineHeight: ratio(v("--heading-leading-display")) ?? 1,
      letterSpacing: v("--heading-tracking-tighter"),
    },
    title: {
      fontFamily: heading, fontSize: size("xl"),
      fontWeight: +v("--heading-weight-medium") || 500,
      lineHeight: lead("xl"), letterSpacing: v("--heading-tracking-tight"),
    },
    body: { fontFamily: body, fontSize: size("base"), fontWeight: +v("--font-weight-normal") || 400, lineHeight: lead("base") },
    "body-sm": { fontFamily: body, fontSize: size("sm"), fontWeight: +v("--font-weight-normal") || 400, lineHeight: lead("sm") },
    label: { fontFamily: body, fontSize: size("sm"), fontWeight: +v("--font-weight-medium") || 500, lineHeight: lead("sm") },
    caption: { fontFamily: body, fontSize: size("xs"), fontWeight: +v("--font-weight-normal") || 400, lineHeight: lead("xs") },
  };

  const rounded = {};
  for (const step of RADII) {
    const r = length(v(`--radius-${step}`));
    if (r) rounded[step] = r;
  }
  rounded.control = length(v("--radius-control")) ?? "9999px";
  rounded.full = "9999px";

  const doc = {
    version: "alpha",
    name: pkg.name,
    ...(pkg.description ? { description: pkg.description } : {}),
    colors, typography, rounded,
    omitted: [
      { section: "spacing", reason: "Tailwind's default 4px scale; the rules for using it are under Layout & Spacing" },
      { section: "components", reason: "Each component's states live in components/ui; the rules are under Components" },
    ],
  };
  return `---\n${yaml(doc)}---\n`;
}

// Enough YAML for this shape: maps, a list of maps, strings and numbers.
function yaml(node, indent = "") {
  let out = "";
  for (const [key, value] of Object.entries(node)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      out += `${indent}${key}:\n`;
      for (const item of value) {
        const lines = yaml(item, `${indent}    `).split("\n").filter(Boolean);
        out += `${indent}  - ${lines[0].trim()}\n`;
        for (const line of lines.slice(1)) out += `${indent}    ${line.trim()}\n`;
      }
    } else if (typeof value === "object") {
      out += `${indent}${key}:\n${yaml(value, `${indent}  `)}`;
    } else {
      out += `${indent}${key}: ${scalar(value)}\n`;
    }
  }
  return out;
}

function scalar(value) {
  if (typeof value === "number") return String(value);
  const s = String(value);
  return /^[\w .-]+$/.test(s) && !/^[\d.-]/.test(s) ? s : JSON.stringify(s);
}

// --- the budget lines ---------------------------------------------------------

// Each accent name over its Tailwind family; `families` in .soft-neutral.json
// moves one or adds a name, as `_dials.py` reads it.
const FAMILIES = { leaf: "emerald", sun: "amber", coral: "rose", iris: "violet",
  lime: "lime", sky: "sky", peach: "orange" };

function dials() {
  if (!existsSync(DIALS)) return null;
  const raw = JSON.parse(readFileSync(DIALS, "utf8"));
  const families = { ...FAMILIES, ...(raw.families ?? {}) };
  return {
    marks: raw.marks ?? 3, colour: raw.colour ?? 3, motion: raw.motion ?? 0,
    pastel: raw.pastel ?? 0, marketplace: !!raw.marketplace, families,
    accents: raw.accents ?? Object.keys(families), secondary: raw.secondary ?? null,
  };
}

function budgets(d) {
  const decisions = ["no accent anywhere", "no accent decision", "one accent decision",
    "up to three accent decisions", "up to four accent decisions, and an accent may ground a whole section",
    "accent decisions without a cap"][d.colour];
  const colors = [
    d.colour === 0
      ? "- Colour is the brand hue on the primary action and nowhere else."
      : `- The brand hue, and ${decisions} a page — a set of peers drawn one hue each is one decision.`,
    d.secondary
      ? `- The secondary colour is \`${d.secondary}\` (Tailwind ${d.families[d.secondary] ?? "?"}): outside a chip, a set and a mark, it and the brand are the page's only colours.`
      : "- No secondary colour: outside a chip, a set and a mark, the brand is the page's only colour.",
    d.colour > 0 ? `- Accents in use: ${d.accents.map((a) => `\`${a}\` (${d.families[a]})`).join(", ")} — no other.` : null,
    d.pastel === 1 ? "- The surfaces a page presents with wear pastel at whisper strength: `bg-{hue}-band`, `bg-{hue}-surface`." : null,
    d.pastel === 2 ? "- The surfaces a page presents with wear pastel at candy strength — `data-pastel=\"2\"` on `<html>`." : null,
    d.marketplace
      ? "- One saturated moment — gradient art, a photograph, a tinted band — in every four sections."
      : "- At least one saturated moment on every page: gradient art, a photograph or a tinted band.",
  ];
  const moving = ["Nothing moves on its own.", "At most one thing moves on its own a page.",
    "At most two things move on their own a page.",
    "At most two things move on their own a page, and one of them may ground a section.",
    "At most three things move on their own a page, and one of them may ground a section.",
    "Things may move on their own without a cap, and one may ground a section."][d.motion];
  const motion = [`- ${moving}${d.motion ? " At most one of them is a shader." : ""}`];
  const kinds = [null, 1, 2, 4, 6, 8][d.marks];
  const bare = [null, null, 4, 2, 1, 0][d.marks];
  const marks = [
    d.marks === 0 ? "- Marks are optional." :
      `- At least ${kinds} different ${kinds === 1 ? "kind of mark" : "marks"} a page` +
      (bare === null ? "." : bare === 0 ? ", and every section draws one." :
        `, and no more than ${bare} ${bare === 1 ? "section" : "sections"} in a row with nothing drawn.`),
    d.marketplace ? "- At least one figure mark a page — a line, an annotation, an oversized glyph or a kit." : null,
  ];
  const imagery = [
    `- No more than ${d.marketplace ? 2 : 3} sections in a row without a large picture, and a real photograph on every page.`,
  ];
  return { colors, motion, marks, imagery };
}

// --- putting it together -------------------------------------------------------

function write(current) {
  let next = current.replace(/^---\n[\s\S]*?\n---\n/, "");
  next = frontMatter() + next;
  const d = dials();
  if (d) {
    const lines = budgets(d);
    next = next.replace(/(<!-- budget:([\w-]+) -->\n)[\s\S]*?(<!-- \/budget -->)/g, (whole, open, axis, close) =>
      lines[axis] ? `${open}${lines[axis].filter(Boolean).join("\n")}\n${close}` : whole);
  }
  return next;
}

function main() {
  const check = process.argv.includes("--check");
  if (!existsSync(DESIGN)) {
    console.error("design: no DESIGN.md at the repo root — the template scaffold carries one");
    process.exit(1);
  }
  const current = readFileSync(DESIGN, "utf8");
  const next = write(current);
  const unfilled = (next.match(/<!-- fill: [^>]*-->/g) || []).length;

  if (check) {
    if (next !== current) {
      console.error("design: DESIGN.md has drifted from app/globals.css — run `npm run design`");
      process.exit(1);
    }
    console.log(`design: DESIGN.md matches app/globals.css${unfilled ? ` · ${unfilled} section(s) still to fill` : ""}`);
    return;
  }
  writeFileSync(DESIGN, next);
  console.log(`design: DESIGN.md written from app/globals.css${dials() ? " and .soft-neutral.json" : ""}` +
    (unfilled ? ` · ${unfilled} section(s) still to fill` : ""));
}

main();
