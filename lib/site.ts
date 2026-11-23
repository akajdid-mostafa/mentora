// Who the site is, and where it lives. Two values every crawler-facing field
// resolves against, and the two a fork changes first.
//
// `siteUrl` is `.example.com` on purpose rather than a plausible-looking
// domain: `example.com` is reserved by the IANA and can never be registered,
// so a template shipping with this in it cannot be pointing a canonical or a
// sitemap at somebody else's live site — which is what a placeholder that
// looks real does the day the buyer forgets to change it.
//
// Read from NEXT_PUBLIC_SITE_URL when one is set, so a deploy names its own
// address without an edit here; with none set, the placeholder stands. The
// template ships no .env file, and a buyer replacing the mock data finds the
// fallback beside it.
export const siteName = "Mentora";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.example.com";

/** An absolute URL from a site path.
 *
 *  `metadataBase` does this for the metadata fields on its own, so `pageMeta`
 *  hands them a path. JSON-LD gets no such help — it is a string in a script
 *  tag, and `"/about"` in an `@id` is a claim about whatever host happens to
 *  be serving it. */
export const abs = (path: string) => new URL(path, siteUrl).toString();
