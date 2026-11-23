---
name: build-page
description: Build a new page, section or component in this template's design language. Use whenever adding or rebuilding anything a visitor sees in this repo — "add a pricing page", "make a new section", "build a booking form", "add a card for…".
---

# Build a page

1. **Read `DESIGN.md` whole.** Its front matter is the values; its twelve
   sections are the rules for using them, and step 5 holds the page to every
   one.
2. **Start from what exists.** Open the page nearest to the one asked for and
   list `components/`. The header, footer, `SectionHeading`, `Divider`, cards,
   buttons and the Select are the vocabulary — reuse them, and turn anything you
   draw a second time into a component.
3. **Build from tokens only.** Surfaces `bg-background`, `bg-card`,
   `bg-accent`, `bg-muted`, `bg-secondary`; ink `text-foreground` and
   `text-muted-foreground`; the brand `bg-action` on the primary button,
   `bg-primary` on a control's chosen state, `text-primary-ink` for brand text
   and thin outlines and never as a fill; `rounded-control` on controls and
   `rounded-lg` on containers; `shadow-soft` and `shadow-soft-lg`; `press` on
   every control; `duration-answer ease-answer` and the other motion tokens.
   The dark half comes from the same classes.
4. **Write the copy as you build it** — DESIGN.md § copy — in the product's own
   voice, every heading ten words or fewer.
5. **Check it before calling it done:**
   - `npm run lint` and `npm run build` pass.
   - At 1280px and 390px, in both halves (the toggle in the header): nothing
     spills sideways, every control answers a hover and a press, nothing fades
     into the dark ground.
   - The `review-design` skill, run on the changed files, finds nothing.

Done is all three: it builds, it reads in both halves at both widths, and the
review is clean.
