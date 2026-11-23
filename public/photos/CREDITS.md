# Photography

Every photograph on the site, where it comes from and which file loads it. None
of them ships in this folder: each is loaded from Unsplash or Lummi at runtime,
under that source's free licence. Those licences cover the demo. Replace the
photographs with your own, or license them yourself, before you launch.

## Hotlinked

| Used by | Photographer | Source |
|---|---|---|
| the closing band, `closing-photo-half.tsx` | Unsplash, free licence | photo-1587136527278-47b852bb3ef4 |
| every course card, `components/course/courses.ts` | Unsplash, free licence | the `photo(…)` id on each of the 36 courses |
| the four path pages and the path cards, `components/paths/paths.ts` | Unsplash, free licence | the `photo` id on each of the four paths |
| the teaching page's opening panel, `components/teach/hero-photo-panel.tsx` | Unsplash, free licence | photo-1780174604948-a314f7c98746 |
| the teaching page's three steps, `stepsCopy` in `components/teach/copy.ts` | Unsplash, free licence | photo-1674505921901-e54fe119f0a4, photo-1764664035176-8e92ff4f128e, photo-1742827871480-4962b0653e1d |
| the studio's recording, `components/studio/take-splitter.tsx` | Unsplash, free licence | photo-1661493817356-106d0cb05bdf |
| checkout for Plus alone, `PLUS_PHOTO` in `components/checkout/checkout.tsx` | Unsplash, free licence | photo-1679165806491-56e5f18d60a6 |
| the sign-in's photograph and the sign-up's preview, one photograph for both, `AUTH_PHOTO` in `components/auth/frame.tsx`, chosen by the studio and linked as given | Lummi, free licence | modern-office-space-dflsp |
| the dashboard's first path leg, `LEG_PHOTO` in `components/dashboard/path-rows.tsx`, chosen by the studio and linked as given | Unsplash, free licence | photo-1690228254548-31ef53e40cd1 |
| the pricing page's team panel, `PHOTO` and `ROOM` in `components/pricing/teams-seats.tsx`, chosen by the studio and linked as given | Lummi, free licence | modern-office-space-dflsp, modern-colorful-office-interior-2k55 |
| the about page's deck of six, `heroCopy.snapshots` in `components/about/copy.ts`, chosen by the studio and linked as given | Unsplash, free licence | photo-1668584086740-d4804b8836c0, photo-1601656269222-fda862e6dc7d, photo-1724402024508-8f0f7d19a865, photo-1563605990484-8d4c1fa9c3d2, photo-1542546068979-b6affb46ea8f, photo-1623276234990-c74be03fd36a |
| the about page's course standards, `standardsCopy.photo` in `components/about/copy.ts`, chosen by the studio and linked as given | Unsplash, free licence | photo-1640132219022-e7a98b4c92e9 |
| the contact page's opening card, `PHOTO` in `components/contact/message-form.tsx`, chosen by the studio and linked as given | Lummi, free licence | serene-white-themed-still-life-hor30 |

Small marks in the course photographs, each under a few pixels at the size a
card shows them and none of them the subject: a laptop maker's name on the
screen bezel in *Automate reporting with Python* and *Pandas and NumPy in
practice*; handwriting too small to read in *Product management essentials* and
*Forecasting with time series*; an operating system's dock icons along the
monitor in *Machine learning systems*; two book spines on a shelf in *Análisis
de datos con Python*; a figurine of GitHub's Octocat, about 13px tall on a card,
in *Engenharia de APIs na prática*. In *Python for data analysis* the monitor
shows the operating system's own wallpaper and menu bar.

Two course photographs carry marks large enough to read. *Python for finance*
shows a lanyard printed with a company's logo, about 20px wide on a card, and
Apple's logo on two monitors.

The path photographs show the work at its desk or in a pair of hands, and no
face, since the faces on this site come from Lummi. The code on the backend
path's laptop and the dashboard on the analyst's render as texture at the size
the frames are used, and the analyst's laptop faces away, so its lid shows no
maker's mark. The founder path's photograph is a desk with no one at it, and
its laptop lid carries the Apple logo at about 25px in both frames: a trademark
the Unsplash licence does not cover, and the one mark on the site large enough
to read.

The teaching page's photographs show work, and no one's face is their subject.
The opening panel is a developer's desk with nobody at it. A small pixel
display on the wall shows a cryptocurrency's name and price at about 150px wide
at 1440, the one readable mark in the frame; the monitor's maker's name on its
stand renders at a few pixels. On a phone the frame also takes in three posters
printing #id, <div> and <html>, and a neon sign's words. In the second step's photograph the wall behind the
camera is covered in instant photographs whose faces render at a few pixels,
and the tablet on the desk shows two people mid-lesson at about 40px tall.
Neither is the subject.

In the closing band's photograph the marks on the speakers, the mug and the
laptop's screen render under five pixels at the size the frame is used. The
one recognisable object is a small toy of a cartoon turtle on the second shelf,
about 19px tall and carrying no text.

The about page's deck is six rooms at the company with nobody in them. The
recording desk's monitor shows a music app's page with its title readable at
the 900px the photograph is fetched at, and a webcam's maker's name sits on the
monitor's top edge; on a card 304px wide both render at a few pixels. The
second desk carries a phone's home screen and a keyboard's maker's mark under
five pixels at card size. The course standards
photograph is a rendered reading corner with no one in it. Its two wall prints
are illustrations of a deer and a fox with no signature that reads at the frame's
size, and the book spines on the lower shelf carry titles at a few pixels.

## Mattes

`public/masks/` holds one silhouette, not a photograph: the alpha of the hero's
portrait, which the page hotlinks from Lummi, lifted on the studio's machine and
kept as a mask so a person can stand on a colour field without a cut-out copy of
the photograph shipping. A matte fits its own photograph only: replace the
portrait in `components/marketing/cutout.tsx` and its matte goes with it, or
point the component at a PNG that already carries its own transparency.

The studio's recording is a desk set up to record with no one at it. The
microphone carries its maker's wordmark, about 25px wide in the 846px frame at
1440 and readable if looked for; the monitor's maker's name under its screen
and the dock icons on it render at a few pixels.

The contact page's photograph is a white table against a white wall, a vase of
dried flowers and a cup on a small tray, with no one in it. It carries no sign,
lettering or mark.
