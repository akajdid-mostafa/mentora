// Row 10's three learners and the one instructor beside them. Faces are Lummi
// ids rather than files: a portrait never ships inside a template that is sold,
// so they are hotlinked and the remote host is allowed in `next.config.ts`. The
// three are one shoot to the eye: a plain studio backdrop, soft light from the
// front, a full smile, and the shoulders in frame with room above the head,
// because the portrait is shown whole rather than cropped to the face. The
// dots move between people rather than between styles or distances.
//
// `result` is the thing this industry offers in place of five stars — the
// change itself, in words — and `figure` is its measure, with `of` the thing it
// was measured against, which is what turns a figure into a bar. The number
// lives in `figure` alone, so the panel and the portrait never say it twice.

export type Quote = {
  name: string;
  role: string;
  course: string;
  result: string;
  /** The measured half of `result`, split out so a bar can be drawn from it. */
  figure: string;
  of: string;
  pct: number;
  body: string;
  id: string;
};

export const quotes: Quote[] = [
  {
    name: "Dana Reinholt",
    figure: "+$28K",
    of: "on a $52K base",
    pct: 54,
    role: "Analyst, Halden Logistics",
    course: "SQL for analysis",
    result: "Support desk to analyst",
    body: "I had asked a chatbot the same question a dozen times and got a dozen queries I could not defend. This one asked me which table I wanted every row from, and that day it clicked.",
    id: "QmZTPHWS1XQQSdtZYzmGYUHj3oXTkC4AhVCKGCucxE9aYu",
  },
  {
    name: "Omar Haddad",
    figure: "9 months",
    of: "from first lesson to offer",
    pct: 75,
    role: "Product designer, Kerbside",
    course: "Interface fundamentals",
    result: "Into a first design role",
    body: "The path put research before the interface, which is the order every course I had tried got backwards. I went into my portfolio review with a case study instead of screenshots.",
    id: "QmSc8maEXGdxmC5oU8QqXmLaENwGq4VCDDyTNKVh3u9G1c",
  },
  {
    name: "Elena Moreau",
    figure: "5 seats",
    of: "of a team of six",
    pct: 83,
    role: "Engineering manager, Vessel",
    course: "Relational data modeling",
    result: "Four of her team finished it too",
    body: "I bought one seat to see whether it was any good and ended up putting the whole team through it. Nobody expected to like the quizzes.",
    id: "QmY58eZ79vkEXBq9eYzNtDS8n31yfrrL22vGJwmoFTMF3k",
  },
];

// The instructor side of the marketplace, in the same row as the learners: the
// brief says the page has to serve both, and a section that quotes only buyers
// says the teaching half is decoration.
export const maker = {
  name: "Joel Amadi",
  role: "Furniture maker · teaches on Mentora",
  result: "$142,000 earned in 18 months",
  seconds: 54,
};

/** Lummi crops to the face when asked to, and returns something unusable
 *  when it is not: `fit=facearea` with a square `w`/`h` pair is the whole of
 *  the contract, and dropping either half returns an image that never paints. */
export const face = (id: string, px: number) =>
  `https://assets.lummi.ai/assets/${id}?auto=format&fit=facearea&facepad=2.5&w=${px}&h=${px}`;

/** The photograph as it was taken, room and all, sized by its height: the
 *  frame it fills is taller than it is wide, so the height is the side that
 *  has to cover it. */
export const portrait = (id: string, px: number) =>
  `https://assets.lummi.ai/assets/${id}?auto=format&h=${px}`;

export const mmss = (s: number) => `0:${String(s).padStart(2, "0")}`;
