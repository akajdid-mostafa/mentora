// The five figures of row 2, the employers behind them, and the row's own
// words.

export const proofCopy = {
  eyebrow: "Mentora by the numbers",
  heading: "Nobody has to take a course platform’s word for it",
  hirers: "Graduates went on to work at",
};

// `label` is the line over the caption, in the medium weight: what the number
// counts, in a few words. The caption under it, in the muted ink, is the
// sentence that qualifies it.
export type Figure = {
  figure: string;
  label: string;
  caption: string;
};

// Widest first. Each row steps a little further right and each figure stands
// hard against its words, so in this order the figures' left edges fall away
// in one line too; with a narrower figure on top, the first two rows started
// level and the diagonal began with a kink.
export const figures: Figure[] = [
  {
    figure: "12,400",
    label: "Courses on the shelf",
    caption: "Every one opens its first lesson without a card.",
  },
  {
    figure: "680K",
    label: "Learners enrolled",
    caption: "Counted once each, however many courses they take.",
  },
  {
    figure: "3,100",
    label: "Verified instructors",
    caption: "Credentials checked before a course goes live.",
  },
  {
    figure: "94%",
    label: "Finish a guided path",
    caption: "Against 13% on single courses bought alone.",
  },
  {
    figure: "41",
    label: "Languages carried",
    caption: "Transcripts and quizzes too, not just the interface.",
  },
];

// The scaffold ships logoipsum logos in public/logos/. Free SVG, licensed in
// writing for templates that are sold, no attribution required. The row takes
// four marks from the site's one client set, the six /pricing's logo row
// shows, flattened to one ink, and
// under each the thing an employer row usually leaves out and a learner is
// actually asking — how many of us went there.
//
// Each is drawn at one optical area rather than one height, so the long
// wordmark sits lower than the compact ones and the four weigh the same. `w`
// and `h` are that size, from each file's viewBox, so the image's size
// attributes match the box it is drawn in. `size` sets the height and lets the
// width follow the file's own proportions: about 1,300px² on a phone and
// 2,100px² from lg, where each column has 190px to fill — a step under the
// counts beneath them. `name` is the employer's, read out as the logo's alt:
// the marks are placeholders, so replace both together.
export const hirers = [
  { logo: "logoipsum-411", name: "Pinwheel", w: 20, h: 20, size: "h-5 lg:h-6", hired: 340 },
  { logo: "logoipsum-221", name: "Northfield", w: 71, h: 18, size: "h-4.5 lg:h-5.75", hired: 212 },
  { logo: "logoipsum-317", name: "Kestrel", w: 75, h: 17, size: "h-4.25 lg:h-5.5", hired: 186 },
  { logo: "logoipsum-220", name: "Ostra", w: 70, h: 18, size: "h-4.5 lg:h-5.75", hired: 119 },
];
