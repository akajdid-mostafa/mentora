import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { FontNotice } from "@/components/font-notice";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";
import { JsonLd } from "@/components/site/json-ld";
import { SelfLinkTop } from "@/components/site/self-link-top";
import { SkipLink } from "@/components/site/skip-link";
import { organizationLd, webSiteLd } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";

// The root fallback. Every route that matters exports its own, so this is what
// an unnamed route inherits rather than what the home page shows.
export const metadata: Metadata = {
  // Every relative URL below this point — a canonical, an `og:url`, a sitemap
  // entry — resolves against this. Without it Next throws on the first
  // relative one, which is the error saying out loud what the field is for: a
  // path is not an address, and a crawler is the reader who cannot supply the
  // missing half.
  metadataBase: new URL(siteUrl),
  title: {
    // Appends the site name to every *child* segment's title, so no page has
    // to type it. It does not apply to the title written here, which is why
    // `default` exists and carries the suffix itself — and why `pageMeta`
    // switches the home page to `title.absolute`.
    default: `${siteName} — learn with a tutor that reads the lesson you have open`,
    template: `%s · ${siteName}`,
  },
  description:
    "A multi-instructor course platform where AI works at both ends: a tutor that answers from the lesson on screen, and a studio that turns a transcript into chapters.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // data-scroll-behavior: Next 16 stopped neutralising the `scroll-behavior:
  // smooth` in globals.css around a route transition, so without the attribute
  // the new page renders at once and then animates up from wherever the old one
  // was parked — which reads as the page scrolling itself to a random section.
  // The attribute asks for the pre-16 behaviour back.
  return (
    // suppressHydrationWarning: next-themes writes the mode class onto <html>
    // before React hydrates, so the server's markup and the client's differ by
    // exactly that one attribute, on purpose.
    <html
      lang="en-US"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Light first, whatever the system says: the preview a buyer meets is
            the light half. `enableSystem` and `defaultTheme="system"` hand the
            choice to the visitor's setting instead. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
        {/* First focusable thing in the document. A fork's header is nine tab
            stops before its content on every route; this is one that jumps
            them. Its target is `id="content"` on each `<main>`. */}
        <SkipLink />
        {children}
        {/* A header or footer link to the page already open goes to its top. */}
        <SelfLinkTop />
        {/* The two site-wide objects, here so they are on every route. Every
            schema a fork adds points an `@id` at one of them — an article at
            its publisher, an offer at its provider — and a reference to
            something the page never published resolves to nothing. */}
        <JsonLd
          schema={[
            organizationLd(
              "A multi-instructor course platform with an AI tutor on the learning side and an AI course studio on the teaching side.",
            ),
            webSiteLd("/courses?q={search_term_string}"),
          ]}
        />
        {/* Development only, and silent once public/fonts/ is populated — see
            components/font-notice.tsx. Nothing to remove before shipping. */}
        <FontNotice />
        </ThemeProvider>
      </body>
    </html>
  );
}
