# Mentora

### The course platform that sits on both sides of the lesson.

A learner opens a video and the tutor is already there, answering from the
transcript on screen. A teacher types one line and the studio returns a
six-chapter outline to argue with. Same table, two ends of it.

> Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui
> Sixteen routes · light and dark · zero backend to set up.

---

## Description

Mentora is a demo-first marketplace template. Every control does something:
save a course, compare two, take notes beside a lesson, ask the tutor a question
in your own words, drag a studio outline into shape, walk through a three-step
checkout. It all persists in the visitor's browser through `localStorage`, shared
across tabs by `useSyncExternalStore` — no account, no API, no keys.

The two "AI" surfaces are written demos, not model calls. The tutor matches a
question against the suggested questions, transcript lines and lesson titles of
the course that is open (with stemming and stop words in four languages), cites
the minute it found, and says so when nothing covers the answer. The studio
matches a typed brief against written outlines and offers a second draft of each
lesson. Both refuse to fake an answer they do not have: that honesty is the
whole product story, and `components/learn/tutor.ts` is where it lives.

[Repository](https://github.com/akajdid-mostafa/mentora) ·
[Maintainer](#the-person-behind-it) · [Run it](#run-it)

## Topics

`nextjs` · `nextjs-16` · `react` · `typescript` · `tailwindcss` · `shadcn-ui` ·
`base-ui` · `app-router` · `next-themes` · `education` · `course-marketplace` ·
`learning-management` · `ai-tutor` · `dark-mode` · `template`

## The two ends

| End | Where | What it does |
| --- | --- | --- |
| `tutor` | `/learn/[slug]` | Transcript, notes, quiz, and a tutor that cites the minute it answered from. |
| `studio` | `/studio` | A brief becomes an outline; Redraft swaps in a second take; revenue lives next door. |

## The map

| Route | What it is |
| --- | --- |
| `/` | Home: search, the tutor and the studio, paths, instructors, pricing |
| `/courses` | The catalog, with filters, sort, compare and recently viewed |
| `/courses/[slug]` | A course: preview, syllabus, cohorts, reviews, enrollment |
| `/learn/[slug]` | The lesson player, with transcript, notes and the AI tutor |
| `/paths/[slug]` | A career path: five courses and a weekly plan |
| `/instructors` | The instructor directory |
| `/instructors/[slug]` | An instructor's profile, cohorts and reviews |
| `/dashboard` | A learner's progress, saved courses and certificates |
| `/studio` | An instructor's course studio and revenue |
| `/teach` | Teaching on the platform, with an earnings calculator and application |
| `/pricing` | Plans, a cost calculator, the comparison and team seats |
| `/checkout` | A three-step checkout for a course, a gift or a plan |
| `/about`, `/contact` | The company, and a contact form with three desks |
| `/sign-in`, `/sign-up` | The account screens |

A designed 404 and error screen, a sitemap and `robots.txt` come with them.

## Run it

Node.js 20.9 or later.

```bash
npm install
npm run fonts
npm run dev
```

Open <http://localhost:3000>.

`npm run fonts` fetches the heading face, Cabinet Grotesk, from Fontshare. Its
licence allows use but not redistribution, so the font files are **not** in
this repository — a fresh clone needs that command. Skip it and headings fall
back to Bricolage Grotesque; pages still work, they just stop matching the
preview. `public/fonts/README.md` carries the licence note.

```bash
npm run build     # production build
npm run lint      # eslint
npm run check     # the production build again
npm run design    # sync DESIGN.md after editing app/globals.css
```

## Make it yours

1. **`lib/site.ts`** — `siteName` and `siteUrl`. The fallback is this repo's
   GitHub Pages address; the sitemap, canonicals, `robots.txt` and JSON-LD all
   resolve against it. Point `NEXT_PUBLIC_SITE_URL` at your domain before you
   launch and crawlers will follow.
2. **`app/globals.css`** — the brand is `--primary` and `--primary-ink`. Change
   those two and the gradient art, chips and dark half follow. `DESIGN.md` is
   the rulebook; `npm run design` keeps its numbers honest.
3. **The demo data** — courses in `components/course/courses.ts`, paths in
   `components/marketing/goals.ts`, instructors in
   `components/instructors/directory.ts`, and each page's strings in the
   `copy.ts` beside its components.
4. **The photography** — loaded from Unsplash and Lummi, not shipped.
   `public/photos/CREDITS.md` lists every photograph and where it is used.
   `next.config.ts` allows only those two hosts; narrow it to yours when the
   demo photos are gone.

## The person behind it

**Mostafa Akajdid** — maintainer and builder of this fork.

- GitHub: [@akajdid-mostafa](https://github.com/akajdid-mostafa)
- Email: mostafaakajdid6@gmail.com
- Project: [akajdid-mostafa/mentora](https://github.com/akajdid-mostafa/mentora)

Bugs, ideas and "why does the tutor do that?" questions are welcome in issues
or by mail.

---

Mentora is a rebrand of the Waypoint v1.2.0 template. Cabinet Grotesk is by the
Indian Type Foundry under the ITF Free Font License; Geist and Bricolage
Grotesque are OFL faces. Photo credits live in `public/photos/CREDITS.md`.
