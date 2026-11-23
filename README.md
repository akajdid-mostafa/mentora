# Mentora

A Next.js template for an online course marketplace where a model works at
both ends: a tutor beside the lesson a learner has open, and a studio that
drafts a course for the teacher to rewrite. Every button on the demo does
something, from state in the browser, with no backend to set up.

Built on Next.js 16, React 19, Tailwind CSS 4 and shadcn/ui.

## Pages

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

You need Node.js 20.9 or later.

```bash
npm install
npm run fonts
npm run dev
```

Open <http://localhost:3000>.

`npm run fonts` downloads the heading face, Cabinet Grotesk, from Fontshare.
Its licence does not allow it to be shipped inside a template, so it is not in
this folder. Skip the step and the headings fall back to Bricolage Grotesque;
`public/fonts/README.md` says why.

To build for production:

```bash
npm run build
npm start
```

## Change these first

1. **`lib/site.ts`**: the site's name and its URL. The sitemap, the canonical
   links, `robots.txt` and the structured data all resolve against `siteUrl`,
   which ships as a reserved `example.com` address. Set
   `NEXT_PUBLIC_SITE_URL` in your host's environment, or edit the fallback
   there: a launched site that leaves it tells every search engine its home
   is somewhere else.
2. **`app/globals.css`**: the brand colour is `--primary` and `--primary-ink`.
3. **The demo data**: courses in `components/course/courses.ts`, paths in
   `components/marketing/goals.ts`, and each page's copy in the `copy.ts` beside
   its components.
4. **The photography** is loaded from Unsplash and Lummi rather than shipped.
   `public/photos/CREDITS.md` lists every photograph and the file that uses it.
   `next.config.ts` allows only those two hosts; add your own image host there
   when you replace them.

The documentation in the package covers each of these in full.
