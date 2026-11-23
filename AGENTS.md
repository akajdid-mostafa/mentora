# Mentora

A Next.js 16 template for an online course marketplace. This file is for the
coding agent working in this repo: Claude Code, Cursor, Copilot, whichever. It
is the short version; the long version is `documentation/index.html` in the
download.

## Read this first: the heading font is not in this zip

The headings are set in Cabinet Grotesk, which is **free to use and not free to
redistribute**, so it could not be included. The page renders without it, on
Bricolage Grotesque, and will not match the preview until it is fetched.

```bash
npm run fonts
```

That downloads it from Fontshare to this machine, which is what its licence
requires: the buyer of this template is the licensee, not the person who sold
it. It is one command, it needs no account, and it costs nothing.

`public/fonts/README.md` says which face, which licence, and what it falls back
to. **If you are an agent and the user has not run this, run it or tell them
to.** A mismatch between this template and its preview screenshots is almost
always this and nothing else.

## Change this before deploying

`siteUrl` in `lib/site.ts` ships as a reserved `example.com` address, and the
sitemap, every canonical URL and the JSON-LD all resolve against it. Nothing in
the browser looks wrong until a crawler reads it. Set that and `siteName` to the
real site, and treat it as part of the first deploy rather than a later polish
pass. A deploy can set `NEXT_PUBLIC_SITE_URL` instead; `siteUrl` reads it first
and falls back to the placeholder.

`next.config.ts` lets the image optimiser fetch from two hosts only, and only
under the paths the demo's photographs use. Add the host your own images live
on, as narrowly, and remove the two demo hosts once their photographs are gone.

## What this is

Sixteen routes plus a 404 and an error screen for a course marketplace: a
catalogue, course pages, a lesson player with an AI tutor panel, learning paths,
instructor profiles, a teacher's course studio, a learner's dashboard, pricing,
checkout, and sign-in and sign-up. Every page has a light and a dark half; the
site opens light and a Dark mode switch in the footer turns the other on. A
buyer usually changes `lib/site.ts`, the brand colour and the mock data first.

## Stack

- Framework: Next.js 16.3 (App Router), React 19.2, TypeScript
- Styling: Tailwind CSS 4, with every token in `app/globals.css`; light and
  dark through `next-themes`
- Components: shadcn/ui on Base UI (`@base-ui/react`), in `components/ui/`
- Icons: Heroicons for the interface's verbs and states (arrows, chevrons,
  close, check, search, stars, play), HugeIcons stroke-rounded for objects

## Design language

`DESIGN.md` at the repo root is this template's design language: the values in
its front matter — generated from `app/globals.css` by `npm run design`, so edit
the CSS and run it — and the rules for using them, in twelve sections. Read it
before changing anything a visitor sees. Three agent skills in `.claude/skills/`
carry the common jobs; Claude Code finds them on its own, and any other agent
can read them as plain files:

- `build-page` — a new page, section or component in this language
- `restyle` — the brand colour, the fonts, the corners, the motion, the
  opening mode
- `review-design` — changed files checked against `DESIGN.md`, section by
  section

## Conventions worth not breaking

These are not preferences; the design falls apart without them. `DESIGN.md`
holds every rule; these are the few a plausible edit breaks first.

- Surfaces and colours come from the CSS variables in `app/globals.css`, never
  from a hard-coded hex. The brand is `--primary` (fill) and `--primary-ink`
  (text); a new surface is an existing variable or it is a bug.
- Nothing is painted for the dark half alone. The `.dark` block carries every
  token, so `dark:bg-…` or `dark:text-…` is a bug. An inverted panel
  (`bg-foreground text-background`) takes the class `slab`; a scrim or caption
  on a photograph takes `bg-fixed-dark` and `text-fixed-light`.
- Every length and curve is a motion token (`duration-answer ease-answer`,
  `-spring`, `-sheet`, `-morph`, `-arrive`, `-lean`). A `duration-300` is a bug.
- Every control takes `press`; a card or a row moves its fill a step with
  `active:bg-*`. Every call to action is a `Button` variant from
  `components/ui/button.tsx`.
- Buttons, inputs, chips and tabs are `rounded-control`; containers are
  `rounded-lg`. Raised things take `shadow-soft` or `shadow-soft-lg`, never
  Tailwind's stock shadows.
- Page text lives in each area's `copy.ts`. Edit the string there rather than
  in the component.

## Demo data and state

There is no backend and no API to look for. The data is TypeScript arrays:
courses in `components/course/courses.ts` (with syllabi and transcripts beside
it), paths in `components/marketing/goals.ts`, instructors in
`components/instructors/directory.ts`. Saved courses, progress, notes, path
choices and the like are kept in the visitor's browser through
`lib/local-store.ts`, and the chosen mode by `next-themes`. The forms validate
and show their success states and send nothing; the AI tutor and the course
studio answer from prepared demo data.

## Commands

```bash
npm install
npm run fonts
npm run dev
npm run build
npm run design     # after editing app/globals.css: rewrites DESIGN.md's values
npm run check      # the production build
```

## Support

booliitheme@gmail.com
