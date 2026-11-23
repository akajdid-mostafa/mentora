import Image from "next/image";
import Link from "next/link";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { focus, LevelDots } from "@/components/course/course-card";
import {
  courseHref,
  priceLabel,
  type Course,
} from "@/components/course/courses";
import { cn } from "@/lib/utils";

/** One of the teacher's other courses, as the reference's wide card with
 *  its frame taken off: the photograph at the left, on the page's own
 *  ground, and beside it the title, the level and length under it, and the
 *  rating and the price along the foot, one after the other. The whole row
 *  opens the course, and the photograph leans in while it is pointed at, as
 *  a course card's does everywhere else on the site. */
export function OtherCourse({ course: x }: { course: Course }) {
  return (
    <Link
      href={courseHref(x)}
      className="group flex gap-4 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <span className="relative size-24 shrink-0 overflow-hidden rounded-[calc(var(--radius)-0.375rem)] bg-muted">
        <Image
          src={x.image}
          alt=""
          fill
          sizes="96px"
          className={cn(
            "object-cover transition-transform duration-lean ease-lean motion-safe:group-hover:[transform:scale(1.04)] motion-safe:group-active:[transform:scale(1)] group-active:duration-answer",
            x.focus && focus[x.focus],
          )}
        />
      </span>
      {/* 1px top and bottom, so the title and the foot sit on the
          photograph's own edges */}
      <span className="flex min-w-0 flex-1 flex-col py-px">
        <span className="line-clamp-1 text-base font-medium">{x.title}</span>
        <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <LevelDots level={x.level} />
          <span className="truncate">
            {x.level} · {x.weeks} weeks
          </span>
        </span>
        {/* The rating and the price in a row, a slash between them, set on
            one baseline: the star rides the figure's centre, and the
            figure carries the rating's baseline out to the row. The star is
            ink, as the reviews and the teacher's card draw theirs. */}
        <span className="mt-auto flex items-baseline gap-2">
          <span className="flex items-baseline gap-0.5 text-sm">
            <StarSolid
              aria-hidden="true"
              className="size-3.5 self-center text-foreground"
            />
            <span className="sr-only">Rated </span>
            <span className="tabular-nums">{x.rating}</span>
          </span>
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            /
          </span>
          <span className="font-heading text-lg tabular-nums">
            {priceLabel(x.price)}
          </span>
        </span>
      </span>
    </Link>
  );
}
