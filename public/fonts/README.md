# The heading face that is not in this folder

If you have just unzipped this template, this folder holds this file and
nothing else. That is deliberate, and one command fixes it:

```
npm run fonts
```

## Why it is not here

The headings are set in **Cabinet Grotesk**, from
[fontshare.com](https://www.fontshare.com). It is drawn and owned by the Indian
Type Foundry and released under the **ITF Free Font License**, which is free
for personal and commercial use, worldwide, forever, with no fee and no
attribution required.

What it does not allow is passing the file on. Section 02 rules out
distributing it "through another font website, font library, marketplace,
repository, download service, application or platform", and says any third
party who wants to use it "must obtain their own copy directly from
Fontshare". Shipping it inside a template is exactly that, so it is not in the
zip you bought and not in the repository.

`npm run fonts` downloads it from Fontshare to your machine, which is the route
the licence describes. You are then the licensee. The full text is at
<https://www.fontshare.com/licenses/itf-ffl>, and the script writes a copy to
`FFL.txt` beside the font. Read it before you launch a site on this face.

The body face, Geist, and the fallback below are SIL Open Font License faces
loaded by `next/font` in `app/layout.tsx`. Nothing needs fetching to use them.

## What happens if you never run it

The template works. Cabinet Grotesk is declared in `app/globals.css` as a
two-name stack with **Bricolage Grotesque** behind it, an OFL face in the same
register whose weight, tracking and leading land within a step of it. An
unfetched build is a finished page in a slightly different voice, not a broken
one. It will not match the preview screenshots.

There is no `postinstall` hook doing this behind your back, on purpose: an
install should not reach out to a font foundry you did not ask it to.

## Setting the headings in another face

Point `--font-heading` in `app/globals.css` at another face loaded in
`app/layout.tsx`, or delete that line to set headings in the body face. Then
you can delete `app/fontshare.css`, its import at the top of `globals.css`, this
folder and `scripts/fetch-fonts.mjs`.
