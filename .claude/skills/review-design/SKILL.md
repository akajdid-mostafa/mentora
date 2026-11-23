---
name: review-design
description: Review changed UI against this template's design language and report what breaks it, axis by axis. Use after building or editing a page or component, before committing, or when asked "does this match the template", "review the design", "check the styling".
---

# Review against DESIGN.md

1. **Take the changed files** — `git diff --name-only -- app components`, or the
   files you were given.
2. **Run the greps.** Every hit is a finding unless `DESIGN.md` allows it:

   ```bash
   git diff --name-only -- app components | grep -E '\.tsx?$' > /tmp/changed
   xargs grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' /dev/null < /tmp/changed   # a colour by hand
   xargs grep -nE 'dark:(bg|text|border|from|via|to|fill|stroke|ring)-' /dev/null < /tmp/changed   # the dark half painted by hand
   xargs grep -nE 'duration-[0-9]|ease-(in|out|in-out)\b|ease-\[' /dev/null < /tmp/changed   # motion as a number
   xargs grep -nE 'lucide-react|font-(semibold|bold)|text-\[[0-9]+px\]' /dev/null < /tmp/changed   # third icon family, heavy weight, off-scale size
   ```

3. **Read each changed file against `DESIGN.md`'s sections in order** — Colors,
   light-dark, Typography, Layout & Spacing, icons, Shapes, Components, motion,
   sections, ornaments, imagery, copy, then Do's and Don'ts.
4. **Look at the page** at 1280px and 390px, in both halves: hover and press
   every control, and read every line of text that sits on a tint.
5. **Report by section**, one line per finding — the rule, `file:line`, the
   change that fixes it — and "clean" under a section with none.

Done is every changed file read against all twelve sections, and a report that
names each of them.
