"use client";

import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { reach } from "@/components/reach";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/** What a reader sees when a page throws: app/error.tsx inside the site's
 *  layout, app/global-error.tsx when the layout itself is what failed. The
 *  404's opening, at the same measure, with a retry where the 404 offers the
 *  catalogue. The bar is the wordmark alone: the full header reads the menus'
 *  records on the server, and a screen drawn in the browser after a failure
 *  should depend on as little as it can. */
export function ErrorScreen({ retry }: { retry: () => void }) {
  return (
    <>
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-6 sm:h-16 sm:px-8">
        <Link
          href="/"
          className={cn("press relative font-heading text-lg tracking-tighter hover:opacity-70", reach)}
        >
          <Logo />
        </Link>
      </div>
      <main id="content" className="flex flex-1 flex-col overflow-x-clip">
        <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-24 text-center sm:px-8 sm:pt-24 sm:pb-32">
          <Eyebrow className="justify-center">Something went wrong</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-[14ch] text-4xl tracking-tighter text-balance sm:text-5xl lg:text-6xl">
            This page didn&apos;t finish loading
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-balance text-muted-foreground">
            Something broke on our side while it was being put together. Trying again usually does it, and
            nothing you saved is lost.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button onClick={retry}>
              <ArrowPathIcon data-icon="inline-start" />
              Try again
            </Button>
            <Link
              href="/"
              className={cn(
                "press flex h-10 items-center justify-center rounded-control bg-card px-5 text-sm font-medium shadow-soft hover:shadow-soft-lg active:shadow-none",
                reach,
              )}
            >
              Back to the home page
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
