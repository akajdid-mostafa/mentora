import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { JsonLd } from "@/components/site/json-ld";
import { reach } from "@/components/reach";
import { breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Where the reader is, one link per step back. The last crumb is the page
 *  itself and is not a link. It publishes its own BreadcrumbList off the
 *  same array it draws, so the markup a search engine reads can never name
 *  a different trail from the one on the page. */
export function Breadcrumb({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {trail.map((c, i) => (
          <li key={c.label} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && (
              <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            )}
            {c.href ? (
              <Link
                href={c.href}
                className={cn(
                  "press text-muted-foreground hover:text-foreground",
                  reach,
                )}
              >
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd schema={breadcrumbLd(trail)} />
    </nav>
  );
}
