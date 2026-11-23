import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

// The three faces next/font loads, declared once: app/layout.tsx sets them on
// the document, and app/global-error.tsx, which replaces that layout and draws
// its own <html>, sets the same ones.

// The generated @theme inline maps --font-sans → var(--font-sans), so the
// next/font variable has to be named --font-sans, not --font-geist-sans.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The heading face, Cabinet Grotesk, is a Fontshare face: its licence forbids
// passing the file on, so it is fetched by `npm run fonts` and declared in
// app/fontshare.css rather than loaded here. Bricolage Grotesque is the OFL
// face its stack in globals.css falls back to, on a build that has not run
// that script yet. It carries an optical-size axis, and next/font ships only
// `wght` unless the axis is asked for by name.
//
// Preloaded, though once Cabinet Grotesk is on disk no heading draws it: a
// deploy pushed straight from git has no Cabinet, this is then every heading's
// face, and unpreloaded it arrives after the first paint and every heading
// swaps. 77 KB on a fetched build is the cheaper of the two.
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable}`;
