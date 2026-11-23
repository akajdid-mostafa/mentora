---
name: restyle
description: Change this template's look — the brand colour, the fonts, the corner radius, the feel of the motion, or which mode it opens in. Use when asked to rebrand, "change the primary colour", "use our brand font", "make it less rounded", "make the animations snappier", or "open in dark mode".
---

# Restyle

Every value lives in `app/globals.css`, and the fonts load in `app/layout.tsx`.
Components read tokens, so a value changed there restyles every page; change
values, never component classes.

| To change | Edit |
|---|---|
| The brand colour | The brand row in `:root` — `--primary` (the fill: a chosen state, progress, chips — keep it bright), `--primary-foreground` (text on the fill), `--primary-ink` (brand text, links, a pick's frame — never a fill; the focus ring is `--ring`, the page's ink, and stays neutral), `--action`, `--action-foreground` and `--action-hover` (the primary button: the fill by default, or black, or a deep shade of the hue under a light fill — keep that style), `--chip-alpha`, `--chart-1..3` — **and the same row in the `.dark` block**, chosen against the dark page. Values are `oklch(L% C H)`: to move to another hue, change H across the row and keep L and C. The browser-tab icon, `app/icon.svg`, and the home-screen icon, `app/apple-icon.tsx`, read no token: give them the new `--primary-ink` pair and `--primary` as hex |
| The fonts | Load the face with `next/font` in `app/layout.tsx` as a CSS variable, then point `--font-sans` (body) or `--font-heading` (headings) at it in `:root` |
| The corners | `--radius` for containers (the scale derives from it) and `--radius-control` for buttons, inputs and chips |
| The motion | The `--duration-*` and `--ease-*` tokens in the motion block |
| The opening mode | The `ThemeProvider` props in `app/layout.tsx` |
| A whole preset or a panel colour | `preset.json` — a name from the `[data-preset]` and `[data-color]` blocks at the end of `app/globals.css`, or `original` |
| Right to left | `"direction": "rtl"` in `preset.json`, on a template that carries the key |

**Read `preset.json` before editing a value.** Anything but `original` lays one
of those blocks over `:root`, so a font or a radius changed in `:root` stays
hidden behind it: change the block it names, or set it back to `original` first.

1. **Read the matching section of `DESIGN.md`** — Colors, Typography, Shapes,
   motion or light-dark — for what the value has to keep true.
2. **Edit the values.** For a colour, measure it in both halves with any WCAG
   contrast checker: every ink at least 4.5:1 on `--background`, `--card` and
   `--muted`, and `--primary-foreground` on `--primary` and
   `--action-foreground` on `--action`. A fill only has to be seen.
3. **Run `npm run design`.** It rewrites `DESIGN.md`'s front matter from
   `globals.css`, so the next agent reads the new values.
4. **Look at the home page and one dense page** at 1280px and 390px, in both
   halves.

Done is `npm run design -- --check` passing and both halves reading at both
widths.
