"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bars3Icon, HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSaved } from "@/components/course/saved";
import { HeaderNav } from "@/components/site/header-nav";
import { HeaderSearch, SearchPopover } from "@/components/site/header-search";
import { Logo } from "@/components/site/logo";
import { face } from "@/components/marketing/quotes";
import type { Nav } from "@/components/site/nav";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

/** Who the page is signed in as, on the two screens that belong to someone:
 *  the learner's dashboard and the instructor's studio. Every other page is
 *  a visitor's, and offers Sign in instead. */
export type Account = { name: string; href: string; portrait?: string };

/** The bar itself, rendered by `SiteHeader` in header.tsx with the menus'
 *  words and counts already read on the server. */
export function HeaderBar({ account, nav }: { account?: Account; nav: Nav }) {
  const { explore } = nav;
  // The reference carries a live figure in its account pill. A logged-out
  // marketplace has one that means something: what the visitor has kept, the
  // same list every Save button on the site writes to.
  const saved = useSaved().length;
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  // the drawer names the page the visitor is on
  const path = usePathname();
  // The bar itself, for the panels that open from it: the menus and the
  // search mount inside it and ride the sticky header down the page.
  const [bar, setBar] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Before the subscription: a reload partway down a page arrives already
    // scrolled, and a bar that takes its ground only on the reader's first
    // flick has shown them the page through its links until then.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // A still bar, and sticky, so past the first 8px of scroll it needs a
    // ground of its own or the page runs straight through the links. The
    // ground takes the whole width rather than the container line, because
    // content runs under the gutters as well. 90%, because the bar crosses the
    // dark hero band: with the band showing through, the muted links measure
    // 2.2:1 at 60% and 4.6:1 at 90%.
    <header
      ref={setBar}
      data-bar={scrolled ? "true" : undefined}
      className={cn(
        "group/header sticky top-0 z-50 h-14 sm:h-16",
        "transition-[background-color,backdrop-filter] motion-reduce:duration-0",
        "data-[bar=true]:bg-background/90 data-[bar=true]:backdrop-blur-xl",
        "data-[bar=true]:backdrop-saturate-125",
      )}
    >
      {/* the bar's edge, drawn only once something is scrolling under it: at
          rest the header sits on the page's own ground and a line there would
          fence it off from the hero it introduces */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border opacity-0 transition-opacity group-data-[bar=true]/header:opacity-100 motion-reduce:duration-0"
      />
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-6 sm:h-16 sm:gap-4 sm:px-8">
        <Link
          href="/"
          className={cn(
            "relative shrink-0 font-heading text-lg tracking-tighter",
            "press hover:opacity-70",
            reach,
          )}
        >
          <Logo />
        </Link>

        {/* the reference's rule: it is what tells a reader the wordmark is not
            the first item of the nav */}
        <span
          aria-hidden="true"
          className="hidden h-5 w-px shrink-0 bg-border lg:block"
        />

        <HeaderNav bar={bar} nav={nav} className="hidden lg:block" />

        {/* The reference's field, from xl up, where the bar has room for it
            beside the nav. Below that the same search opens from a glyph. */}
        <HeaderSearch className="ml-auto hidden w-72 xl:block" />

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <SearchPopover bar={bar} className="xl:hidden" />

          {/* On the search field's own fill, so from xl the two read as one
              set. */}
          <Link
            href="/dashboard"
            aria-label={`Saved courses, ${saved} kept`}
            className={cn(
              "relative hidden size-10 shrink-0 items-center justify-center rounded-control sm:flex",
              "bg-accent text-muted-foreground",
              "press hover:bg-muted hover:text-foreground",
              "after:absolute after:-inset-0.5 after:content-['']",
            )}
          >
            <HeartIcon className="size-5" />
            {/* the reference's status dot, carrying a count rather than a
                state, ringed in the ground the bar stands on so it reads as a
                count on the control rather than a notch in it. Nothing saved,
                no dot: a zero on a badge reads as an alert. */}
            {saved > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium tabular-nums text-primary-foreground ring-2 ring-background"
              >
                {saved}
              </span>
            )}
          </Link>

          {account ? (
            <Link
              href={account.href}
              aria-label={`Signed in as ${account.name}`}
              className="hidden h-10 shrink-0 items-center gap-2 rounded-control py-1 pl-1 pr-3 text-sm font-medium press hover:bg-accent lg:inline-flex"
            >
              <Avatar account={account} />
              {account.name.split(" ")[0]}
            </Link>
          ) : (
            <Button
              render={<Link href="/sign-in">Sign in</Link>}
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex"
            />
          )}
          <Button
            render={<Link href="/courses">Browse courses</Link>}
            size="sm"
            className="hidden sm:inline-flex"
          />

          {/* Below lg the routes live here, in the four groups Explore holds
              on a wide screen: a menu inside a drawer would scroll twice. */}
          <Drawer open={menu} onOpenChange={setMenu} showSwipeHandle>
            <DrawerTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className={cn(
                    "relative flex size-10 shrink-0 items-center justify-center rounded-control lg:hidden",
                    "transition-colors hover:bg-accent",
                    "after:absolute after:-inset-0.5 after:content-['']",
                  )}
                >
                  <Bars3Icon className="size-5" />
                </button>
              }
            />
            {/* Mounted beside the bar rather than in body, so it reads the
                tokens of whatever the page is wrapped in, as the bar does.
                The padding sits inside the scroller, where the wordmark's
                overhanging W still has room to draw. */}
            <DrawerContent
              container={bar?.parentElement ?? null}
              className="sm:mx-auto sm:w-full sm:max-w-xl"
            >
              <div className="no-scrollbar flex flex-col overflow-y-auto px-6 pb-8 pt-2">
                <div className="flex items-center justify-between">
                  <DrawerTitle className="font-heading text-lg tracking-tighter">
                    <Logo />
                  </DrawerTitle>
                  <DrawerClose
                    render={
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="press relative flex size-10 items-center justify-center rounded-control hover:bg-accent after:absolute after:-inset-0.5 after:content-['']"
                      >
                        <XMarkIcon className="size-5" />
                      </button>
                    }
                  />
                </div>

                <nav aria-label="Main" className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8">
                  {explore.map((g) => (
                    <div key={g.heading}>
                      <Caps>{g.heading}</Caps>
                      <ul className="mt-2">
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              prefetch={l.prefetch}
                              onClick={() => setMenu(false)}
                              aria-current={l.href === path ? "page" : undefined}
                              className="press flex h-10 items-center gap-2 text-base hover:text-muted-foreground aria-[current=page]:font-medium"
                            >
                              {l.label}
                              {/* the heart's count, which the bar drops on a
                                  phone, beside the page it opens */}
                              {l.href === "/dashboard" && saved > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-control bg-primary px-1.5 text-xs font-medium tabular-nums text-primary-foreground">
                                  <span className="sr-only">, </span>
                                  {saved}
                                  <span className="sr-only"> saved</span>
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>

                <div className="mt-10 grid grid-cols-2 gap-2">
                  {account ? (
                    <Button
                      render={
                        <Link href={account.href} onClick={() => setMenu(false)}>
                          <Avatar account={account} small />
                          {account.name.split(" ")[0]}
                        </Link>
                      }
                      variant="outline"
                      aria-label={`Signed in as ${account.name}`}
                    />
                  ) : (
                    <Button
                      render={
                        <Link href="/sign-in" onClick={() => setMenu(false)}>
                          Sign in
                        </Link>
                      }
                      variant="outline"
                    />
                  )}
                  <Button
                    render={
                      <Link href="/courses" onClick={() => setMenu(false)}>
                        Browse courses
                      </Link>
                    }
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

/** The account's face, or its initials on the brand's pale chip. */
function Avatar({ account, small = false }: { account: Account; small?: boolean }) {
  const size = small ? "size-6" : "size-8";
  if (account.portrait) {
    return (
      <Image
        src={face(account.portrait, 64)}
        alt=""
        width={32}
        height={32}
        className={cn(size, "shrink-0 rounded-full object-cover")}
      />
    );
  }
  const initials = account.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      aria-hidden="true"
      className={cn(
        size,
        "flex shrink-0 items-center justify-center rounded-full bg-chip text-xs font-medium text-primary-ink",
      )}
    >
      {initials}
    </span>
  );
}
