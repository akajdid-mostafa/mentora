# Changelog: Mentora

What changed on the page in each release. Newest release on top.

## 1.2.0 (2026-11-04)

Dark mode
- Every page now has a dark mode with its own near-black palette, not an
  inverted one: cards rise above the page, hairlines carry the edges, and the
  lime stays lime.
- A Dark mode switch in the footer turns it on, and the site remembers the
  choice. The site still opens light; two props in app/layout.tsx make it
  follow the visitor's system setting instead.
- Photographs keep their colours in both modes, and so do the scrims,
  captions and video frames over them. Logo walls turn light on the dark
  ground, and the dark panels (the About story, the earnings and revenue
  cards, the compare tray) stay dark panels.

Ready for AI coding tools
- DESIGN.md at the project root describes the design language: colours,
  type, radius, spacing, components, both modes, motion and imagery. Its
  values are generated from app/globals.css with `npm run design`, and
  `npm run check` stops when the two drift apart.
- AGENTS.md and three agent skills (build a page, restyle, review a design)
  ship beside it, so a coding agent adds pages in the same style.

Feel
- Every button, chip, tab and icon control sinks slightly while pressed and
  springs back on release. Rows, tiles and cards darken a step instead.
- Every transition reads one of six motion tokens in globals.css (answer,
  spring, sheet, morph, arrive and lean), so the pace of the whole site
  changes from one place.
- Disabled buttons lower their ink instead of fading.
- Every call to action is a Button variant, so one edit to
  components/ui/button.tsx reaches all of them.

Details
- Pastel cards are a shade softer.
- The planner's three figures sit in one panel.
- The video player's controls fit the card at 320px wide.
- Sections that fade in as you scroll now appear in a framed preview and on a
  fast scroll, where one could stay blank.
- The tutor's question field is 16px, so a phone keeps its zoom when you tap it.
- The revenue chart keeps its keyboard tab stop when you change the range.

Share links
- A link to any page now carries a share card drawn from the brand, in
  app/opengraph-image.png. A course, teacher or path shows its own photograph.

Under the hood
- The current link in the header, the open row of a learning path and the
  tutor's current transcript line read their state from aria and data
  attributes rather than a class, and each list filter reads data-* attributes
  from one helper beside its matcher, so a script that flips an attribute moves
  the look with it.

## 1.1.0 (2026-10-03)

Search and links
- A course suggested in the header, hero or catalogue search opens that course;
  a teacher suggested on /instructors opens their profile.
- Every course card links to its teacher. Contact links from the about and
  pricing pages arrive with the person or topic already chosen.
- The dashboard shows the next cohort of a teacher you follow, and a
  waitlisted cohort says so.

Forms
- Every field, choice, slider and one-time code now carries a name, so a form
  posts its values as soon as you connect it to a backend.
- Email fields are no longer spellchecked.

Pages
- A course, path, teacher or lesson address that does not exist returns a real
  404 page, with its own title.
- A new error screen, drawn like the 404, appears if a page fails to load, with
  a button to try again.
- Course studio statements say "Pays Oct 15" before payday and "Paid" after it.
- Pages that show today's date refresh once a day instead of keeping the date
  they were built on.
- Page titles read correctly on the teach, pricing and lesson pages.

Phones
- The cohort roster, contact desk, testimonials, hero search and carousel bars
  no longer cut off at 320px wide.
- A link to a section further down the page lands on its heading; select
  menus keep the 16px side gutter.
- The phone menu shows how many courses you have saved.

Dark mode and accessibility
- Buttons and menus no longer turn grey when the operating system is in dark
  mode but the site is not.
- Every select list and the phone search panel are named for screen readers;
  logo walls name their companies.
- Keyboard focus moves to the next sensible control when the one you used
  removes itself, and focus rings are no longer clipped.

Speed and search engines
- Each page preloads only the image that paints largest, and images are
  requested at the size they are drawn, on phones and wide screens alike.
- The header menus render on the server, so every page ships less JavaScript.
- The site's address can be set with NEXT_PUBLIC_SITE_URL instead of editing
  code; robots.txt no longer hides the pages it means to keep out of search;
  teacher pages get their own share image.
- Image hosts in next.config.ts are limited to the paths the demo uses.

## 1.0.0 (2026-10-01)

Initial release: sixteen routes, from the course catalogue and a lesson player
with an AI tutor beside it, to a teacher's course studio, a learner's
dashboard, pricing, a three-step checkout and the account screens.
