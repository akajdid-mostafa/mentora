---
version: alpha
name: mentora
colors:
  background: "#fdfcfc"
  foreground: "#1b1a18"
  card: "#ffffff"
  card-foreground: "#1b1a18"
  popover: "#ffffff"
  popover-foreground: "#1b1a18"
  primary: "#98e561"
  primary-foreground: "#1b1a18"
  primary-ink: "#3d6321"
  secondary: "#e9e8e7"
  secondary-foreground: "#1b1a18"
  muted: "#eeedec"
  muted-foreground: "#6a6662"
  accent: "#f7f6f5"
  accent-foreground: "#1b1a18"
  border: "#f1f0ef"
  input: "#d8d6d4"
  ring: "#98e561"
  destructive: "#a52f27"
  chart-1: "#3d6321"
  chart-2: "#5a8d35"
  chart-3: "#77b14e"
  chart-4: "#bcb8b3"
  chart-5: "#dbd9d6"
  leaf: "oklch(76.5% 0.177 163.223)"
  leaf-ink: "oklch(50.8% 0.118 165.612)"
  sun: "oklch(82.8% 0.189 84.429)"
  sun-ink: "oklch(55.5% 0.163 48.998)"
  coral: "oklch(71.2% 0.194 13.428)"
  coral-ink: "oklch(51.4% 0.222 16.935)"
  iris: "oklch(70.2% 0.183 293.541)"
  iris-ink: "oklch(49.1% 0.27 292.581)"
  lime: "oklch(84.1% 0.238 128.85)"
  lime-ink: "oklch(53.2% 0.157 131.589)"
  sky: "oklch(74.6% 0.16 232.661)"
  sky-ink: "oklch(50% 0.134 242.749)"
  peach: "oklch(75% 0.183 55.934)"
  peach-ink: "oklch(47% 0.157 37.304)"
typography:
  heading:
    fontFamily: Cabinet Grotesk
    fontSize: "48px"
    fontWeight: 525
    lineHeight: 1
    letterSpacing: "-0.05em"
  title:
    fontFamily: Cabinet Grotesk
    fontSize: "20px"
    fontWeight: 625
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: Geist
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Geist
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4286
  label:
    fontFamily: Geist
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4286
  caption:
    fontFamily: Geist
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.3333
rounded:
  sm: "14.4px"
  md: "19.2px"
  lg: "24px"
  xl: "33.6px"
  2xl: "43.2px"
  3xl: "52.8px"
  4xl: "62.4px"
  control: "12px"
  full: "9999px"
omitted:
  - section: spacing
    reason: "Tailwind's default 4px scale; the rules for using it are under Layout & Spacing"
  - section: components
    reason: "Each component's states live in components/ui; the rules are under Components"
---

# Design language

Read this before adding or changing anything a visitor sees, and build in it.
The values live in `app/globals.css`; the front matter above is generated from
that file by `npm run design`, so edit the CSS and run it — never the front
matter. Below are the rules for using the values, in twelve sections: the first
eight are what a component needs to look right, the last four what a page needs
to not look templated.

## Overview

Bright and almost colourless, with a lime that means "go". Surfaces are five
warm near-whites that separate by tint rather than by borders or heavy shadow.
Controls take a soft 12px corner, containers a generous 24px one, and density
is airy. The brand hue is spent at full strength on the primary action and on
progress, and nowhere else in the chrome. Calm and friendly without turning
cute: friendly from the radius and the air, precise from the restraint in colour
and type, and from the small mono capitals that label things.

## Colors
<!-- axis: colors -->

- **Surfaces are a ladder, measured below the page.** `bg-card` and `bg-popover`
  are the one step above it; `bg-background` is the page; then `bg-accent` (the
  whisper surface: a section band, a side tile, a rail, the hover step),
  `border`, `bg-muted` (resting rows, chips, secondary buttons) and
  `bg-secondary` (the deepest well). A field — the hero's search included — is
  `bg-card` with an inset hairline ring, never a shadow. A raised element is one
  step lighter than its parent.
- **Nothing sits on its own colour.** A chip, an input or a secondary button is
  at least one step away from what is behind it. A white card on the page needs
  an edge — the two differ by almost nothing.
- **A section band is `bg-accent`, a pastel `bg-{hue}-surface` or `-band`, or
  brand gradient art**, drawn `rounded-lg` inside the `max-w-7xl` container,
  never full-bleed and never two in a row. The one ink band (`bg-foreground`)
  is on About.
- **The brand hue has a token for every strength.** `bg-primary` for the
  primary action and for progress — a slider's range, a progress bar, a step
  rule. `text-primary-ink` for brand-coloured text and links. `bg-chip` for a
  tinted disc or chip. `--chart-1..3` for an ordered series. The lime is a light
  fill, so what sits on it is ink, never white.
- **Six accents tell peers apart:** leaf, sun, coral, iris, lime, sky. The four
  subjects wear one each — Data iris, Engineering sky, Design coral, Business
  sun (`topicTint` in `components/course/courses.ts`). A chip or badge is
  `bg-{hue}/15 text-{hue}-ink`; a full `bg-{hue}` fill is for a set and never
  carries its own ink. Leaf means done; coral means a problem only beside leaf.
  A rating star is `text-sun-ink` on a card or a filter, ink in a reviews block
  and on a profile.
- **Two ink levels, never three.** `text-foreground` and
  `text-muted-foreground`; on an inverted ground the second is
  `text-background/70`. Lowering ink with opacity anywhere else drops it under
  4.5:1.
- **Colour rides the glyph, not the label.** A status dot or ring beside an ink
  label, never coloured text.

<!-- budget:colors -->
- The brand hue, and up to three accent decisions a page — a set of peers drawn one hue each is one decision.
- The secondary colour is `iris` (Tailwind violet): outside a chip, a set and a mark, it and the brand are the page's only colours.
- Accents in use: `leaf` (emerald), `sun` (amber), `coral` (rose), `iris` (violet), `lime` (lime), `sky` (sky) — no other.
- The surfaces a page presents with wear pastel at whisper strength: `bg-{hue}-band`, `bg-{hue}-surface`.
- One saturated moment — gradient art, a photograph, a tinted band — in every four sections.
<!-- /budget -->

## light-dark
<!-- axis: light-dark -->

- **Both halves ship, and the site opens light.** `next-themes` puts `dark` on
  `<html>` when the visitor turns on the Dark mode switch (`ModeToggle`) under
  the footer's blurb, and remembers it.
  To follow the visitor's system setting instead, set `enableSystem` and
  `defaultTheme="system"` on the provider in `app/layout.tsx`.
- **The dark half is its own ladder, in the `.dark` block of `globals.css`.**
  Every surface sits a step *above* a near-black page — the card nearest, then
  the tint, the hairline, the resting row and the deepest well — so the same
  classes (`bg-card`, `bg-muted`, `hover:bg-accent`) are right in both halves.
- **Read the tokens; never paint the dark half by hand.** No `dark:bg-…` or
  `dark:text-…` on a component: the `.dark` block already carries every colour.
  A `dark:` that changes what is shown — `dark:invert` on the ink logos,
  `dark:hidden` on a light-only asset — is fine.
- **An inverted panel takes `slab`.** `bg-foreground text-background` would be
  the brightest thing on a dark page; with `slab` it stays a raised dark panel
  with light type, and everything inside that reads `--background` follows.
- **What sits on a photograph keeps its colour.** A scrim, the type on it, a
  video frame: `bg-fixed-dark/70 text-fixed-light`, the same in both halves.
- **Chips keep their class string.** `bg-{hue}/15 text-{hue}-ink` reads a lighter
  ink in the dark half on its own.

## Typography
<!-- axis: typography -->

- **Two faces plus mono.** `font-sans` (Geist) for body; `font-heading`
  (Cabinet Grotesk, Bricolage Grotesque until `npm run fonts` has run) for
  headings and display figures. `font-mono` over machine text — a timestamp, an
  ID, a URL, code — and on the page's small capitals through `Caps`; never on a
  button or a sentence.
- **Two weights.** Normal and `font-medium`, and from `text-3xl` up the weight
  comes off entirely.
- **Sized by how a line is read.** 16px is body copy. 14px is a product
  object's data and a one-line meta line. 12px is a caption of a few words, and
  the small capitals: `Caps` (`font-mono text-xs uppercase tracking-eyebrow`,
  muted ink). A section's eyebrow is `Eyebrow` — `Caps` in `text-primary-ink`
  on a `bg-chip` pill with a brand-ink dot — and its heading is
  `SectionHeading`: 30, 36 from `sm`, 48 from `lg`.
- **Two to three sizes in a block, three to four across a section.** The lede
  under a heading is `text-base`.
- **Stay on the Tailwind scale.** An arbitrary size only above 36px, in even
  pixels. Leave `leading-*` and `tracking-[…]` off: both are bound to the face in
  `globals.css`.
- **Hierarchy inside a line comes from weight and ink, not size:**
  `**Thursday**, 5 February` — medium foreground, then normal muted, one size.
- **`tabular-nums`** on times, durations, prices, counts and IDs.

## Layout & Spacing
<!-- axis: spacing-scale -->

- **Airy.** Padding and row height run about 1.4× a dashboard. Space around a
  group always exceeds the space within it.
- **A control is 40px tall** (`h-10`) and never under it, a round one aside; a
  square icon beside a chip in a card's top row is the one drawn at 36, with a
  40px reach. 44 for a section's one call to action. Its inline padding is half
  its height and is set on the Button's `size`, never at the call site.
- **Sections carry no vertical padding.** One `gap-32 sm:gap-40` on `<main>`
  spaces them and nothing draws a rule between them. Each section is
  `mx-auto w-full max-w-7xl px-6 sm:px-8`.
- **A section's header block clears its content by 32–56px** (`mt-8` to
  `mt-14`); a new section can take `mt-head` (48px, 64 from `sm`).
- **Give things a `max-w-*`, not a percentage.** Prose runs 45–75 characters.
- **Every tap target clears 40px**, and nothing spills sideways at 320px.

## icons
<!-- axis: icons -->

- **Heroicons for the interface's verbs and states:** arrows, chevrons, close,
  check, search, plus, menu, the save heart and the four subject glyphs, from
  `24/outline` at `size-4`; a rating star, the verified badge and a saved heart
  from `24/solid`, and so are play and pause — in a disc over media, and beside
  a label in a chip or button at `size-3` to `size-3.5`.
- **HugeIcons for objects**, stroke-rounded, from `@hugeicons/react` and
  `@hugeicons/core-free-icons`: a calendar, a link, copy, a certificate, mail, a
  clock, a spinner — 16px at stroke 1.6–1.8 beside text, 18px leading a nav row,
  12–14px at stroke 2–2.5 inside a chip.
- Never a third family, and never an emoji standing in for an icon.

## Shapes
<!-- axis: shape-effects -->

- **`rounded-control` on everything interactive** — buttons, inputs, chips,
  tabs. `rounded-lg` on containers, `rounded-sm` on rows inside a card,
  `rounded-full` on circles and on bars — a track, a progress fill. A nested
  corner is concentric: the parent's radius is the child's plus the padding
  between them.
- **One depth cue, never two.** A resting card is `bg-card shadow-soft` — the
  shadow draws its own 1px edge — and lifts to `shadow-soft-lg` on hover; a flat
  card or an unpicked pill takes `ring-1 ring-inset ring-border`. Something that
  has left the surface — a dropdown, popover, modal — takes `shadow-soft-lg`.
  Never Tailwind's stock shadows, never a border beside a shadow.
- **A card's edge carries its hairline and nothing else** — no coloured bar
  across the top, no stripe down a side.

## Components
<!-- axis: component-states -->

- **Every control has six states:** rest, hover, pressed, `focus-visible`,
  disabled, and loading where it fetches or submits. Every list has an empty
  state and every form an error state.
- **Hover moves one step on the ladder.** A filled control shades itself
  (`bg-primary/80`); a toggle that is on hovers as on, not as off.
- **Selected is a ring, not a fill.** A picked tab, pill, chip or radio tile is
  `bg-card` inside `ring-2 ring-inset ring-ring` (`selected` from
  `components/ui/selected.ts`); at rest its edge is `ring-1 ring-inset
  ring-border`, never a `border`, so a pick moves nothing.
- **Pressed:** a control takes `press` and sinks 3%. Anything larger — a row, a
  tile, an accordion header — moves its fill one step below its hover with
  `active:bg-*`; a card whose link covers it presses across its face through the
  link's overlay.
- **Disabled is lower ink**, not lower opacity. Leave focus rings alone.
- **One component each:** every value dropdown is `components/ui/select`, every
  action list `components/ui/menu`, every range the `Slider`, the mobile menu
  the `Drawer`, every call to action a `Button` variant with its icon inside.
  Hoverable neighbours never touch.
- **A card that goes to a page is one target:** the photo is the link, named by
  `aria-labelledby` on the title, and it stretches over the card
  (`after:absolute after:inset-0`); its other controls sit `relative z-10`.

## motion
<!-- axis: motion -->

- **Every length and curve is a token:** `duration-answer ease-answer` for the
  page answering a pointer, `-spring` for a release or a menu opening, `-sheet`
  for a drawer or a panel unfolding, `-morph` for a shape re-forming, `-arrive`
  for the reveal, `-lean` for a photograph leaning in under the pointer. A bare
  `transition-*` already reads `answer`. Never a number.
- **The pointer gets the motion, not the scroll.** Every section below the home
  page's hero rises once through `<Reveal>`, the filtered course grid included;
  no other page reveals. Nothing parallaxes, pins or scrubs.
- **Transform and opacity**, and a progress fill may run its width. The page is
  complete with motion reduced.

<!-- budget:motion -->
- At most two things move on their own a page, and one of them may ground a section. At most one of them is a shader.
<!-- /budget -->

## sections
<!-- axis: sections -->

- **Every section carries one point of interest past its words** — a picture, a
  figure, a drawn detail, a control that does something.
- **A large image in a marketing section carries a fragment of the product**
  layered over it — a state, a number, a rating, a message the product would
  send — each on its own surface with `shadow-soft-lg`, clear of the subject's
  face. Not on a grid of cards from a CMS.
- **The second use of anything is a component.** Reuse the header, the footer,
  `SectionHeading`, `Eyebrow` and `Caps` rather than drawing new ones.
- **Alike items do one job.** Tiles drawn alike are worth the same press; a row
  of peers on pastel wears a hue each, no two neighbours alike.

## marks
<!-- axis: marks -->

- **Something on the page is drawn**: a dashed connector, a dot grid fading at
  one edge, gradient art inside a card, a hand-drawn underline, a slight tilt.
  One or two a section, chosen by what the section's shape asks for.
- **A mark is decoration**: `aria-hidden="true"` and `pointer-events-none`.
  Marks may spend colour; chrome may not.

<!-- budget:marks -->
- At least 6 different marks a page, and no more than 1 section in a row with nothing drawn.
- At least one figure mark a page — a line, an annotation, an oversized glyph or a kit.
<!-- /budget -->

## imagery
<!-- axis: imagery -->

- **Real photographs, framed.** A fixed aspect on the frame and `object-cover`
  on the image; never stretched, never a placeholder meant to be swapped later.
- **Photographs are hotlinked, not shipped:** Unsplash for work and rooms,
  Lummi for every face. `next.config.ts` allows those two hosts and
  `public/photos/CREDITS.md` lists each picture.
- **Logos are ink:** the six logoipsum marks in `public/logos/`, one dark fill,
  set through `next/image` at `opacity-60` with `dark:invert`, sized by height
  with a capped width, no box around each.
- **A photograph beside a form is a tile**, never the ground the form sits on.

Real work in the room it happens in — a desk with code open, a studio, a
workbench, a shelf of books — never a classroom, a handshake or a smile at a
laptop. One soft daylight source with a clear direction, the subject off centre
in a mid shot with room left for type, in warm neutrals — wood, concrete, paper,
linen — with a single saturated accent that is never blue. Faces are one shoot:
half-length on a warm taupe backdrop, in soft front light.

<!-- budget:imagery -->
- No more than 2 sections in a row without a large picture, and a real photograph on every page.
<!-- /budget -->

## copy
<!-- axis: copy -->

- **Real copy in the product's own language.** No lorem, and no sentence that
  says nothing.
- **A section heading runs ten words at most**; a caption or a stat label two
  lines.
- **The last line of a wrapped block runs at least two thirds of the longest**,
  and blocks in a row end on the same line — fitted in the words. `text-balance`
  is for text the page does not write: a transcript line, a note, a title a
  teacher edits.
- **A button names its action**, and the same action keeps the same name across
  the page.

## Do's and Don'ts

- Do spend the brand hue at full strength on the primary action and progress
  alone.
- Do separate surfaces by one step of tint before reaching for a border.
- Do give every section a picture, a figure or a drawn detail.
- Don't put white text on a saturated block — even the lime primary takes ink.
- Don't use a gradient as a surface — a button, a nav, a section ground — or as a
  loose blurred wash.
- Don't add a third ink level, a third icon family or a second Select.
- Don't put a weight on display type, or `font-mono` on a button or a sentence.
- Don't type a duration, a curve, a hex or a shadow into a class string.
