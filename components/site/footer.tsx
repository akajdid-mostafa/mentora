import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { ModeToggle } from "@/components/site/mode-toggle";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { reach } from "@/components/reach";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

// The reference's second cell is a link list with no heading at all, which is
// the detail that makes its four cells read as different objects rather than
// as four of the same column. So the first group keeps its heading off: it is
// the one a visitor arrives wanting.
const learn = [
  { href: "/courses", label: "Browse courses" },
  // the home page's planner, where all four paths start, as the header's
  // "Start from your own goal" goes
  { href: "/#paths", label: "Career paths" },
  { href: "/instructors", label: "Instructors" },
  { href: "/dashboard", label: "My learning" },
  { href: "/pricing", label: "Pricing" },
];

const groups = [
  {
    heading: "Teach",
    links: [
      { href: "/teach", label: "Teach on Mentora" },
      { href: "/studio", label: "Course studio" },
      { href: "/teach#earnings", label: "Earnings calculator" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/about#standards", label: "Course standards" },
    ],
  },
];

const legal = [
  { href: "/about#privacy", label: "Privacy" },
  { href: "/about#terms", label: "Terms" },
  { href: "/about#ai", label: "How we use AI" },
  { href: "/contact", label: "Support" },
];

const link = cn(
  "text-sm text-muted-foreground transition-colors hover:text-foreground",
  reach,
);

export function SiteFooter() {
  return (
    // Not a section, so mt-32 rather than a member of main's gap: main's rhythm
    // ends where its content does. A hairline across the page rather than a
    // band is what says the page has stopped.
    <footer className="mt-32 border-t sm:mt-40">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        {/* The reference's structure is four unequal cells cut by full-height
            rules. Below lg there is no width to divide, so the same boundary
            is drawn horizontally and each cell pads itself — which is what
            keeps every line centred between the two blocks it separates. */}
        <div className="grid divide-y divide-border lg:grid-cols-[1.15fr_1fr_1fr_1.25fr] lg:divide-x lg:divide-y-0">
          <div className="pb-10 lg:pb-0 lg:pr-10">
            <p className="font-heading text-lg tracking-tighter">
              <Logo />
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A course platform with a tutor that answers from the lesson you
              have open, and a studio that turns a raw transcript into a
              chapter list.
            </p>
            {/* the mode lives here rather than in the header, which is full:
                it is set once, and every page ends on this column */}
            <ModeToggle className="mt-5" />
          </div>

          <div className="py-10 lg:px-10 lg:py-0">
            <ul className="flex flex-col gap-3">
              {learn.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-10 py-10 lg:px-10 lg:py-0">
            {groups.map((g) => (
              <div key={g.heading}>
                <Caps>{g.heading}</Caps>
                <ul className="mt-4 flex flex-col gap-3">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={link}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 lg:pl-10 lg:pt-0">
            <Caps>Newsletter</Caps>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The lesson teardowns and studio notes we write for instructors,
              sent once a week.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* the reference's baseline row, and where the legal set belongs: a
            reader looks along this line for it, not up in a column */}
        <div className="mt-14 flex flex-col gap-5 border-t pt-8 sm:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mentora. A demo template. Every figure
            here is written for it.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
