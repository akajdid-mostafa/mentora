"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  BookOpen01Icon,
  Calendar03Icon,
  HourglassIcon,
  SubtitleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { focus, glyph, LevelDots, SaveButton } from "@/components/course/course-card";
import {
  courseHref,
  figure,
  priceLabel,
  topicTint,
  type Course,
} from "@/components/course/courses";
import { recordView } from "@/components/course/recent";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const spelled = (n: number) => words[n] ?? String(n);
const capital = (s: string) => s[0].toUpperCase() + s.slice(1);
/** "English", "English and Spanish", "English, French and Spanish" */
const listed = (xs: string[]) =>
  xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

/** What the lede counts, all of it from the data: the courses, the learners
 *  across them, the languages they are taught in, and how many languages
 *  their subtitles run to. Counts under ten are spelled, and a range with a
 *  figure past nine keeps both ends as figures. Two sentences, each set on a
 *  line of its own, so the second, the longer, is always the last line. */
function lede(first: string, courses: Course[]): [string, string] {
  const n = courses.length;
  const learners = figure(courses.reduce((sum, c) => sum + c.learners, 0));
  const taught = listed([...new Set(courses.map((c) => c.language))]);
  const subs = courses.map((c) => c.subtitles);
  const [lo, hi] = [Math.min(...subs), Math.max(...subs)];
  const range =
    lo === hi ? spelled(hi) : hi < 10 ? `${spelled(lo)} to ${spelled(hi)}` : `${lo} to ${hi}`;
  if (n === 1) {
    return [
      `One course and ${learners} learners so far.`,
      `${first} teaches it in ${taught}, with subtitles in ${range} languages.`,
    ];
  }
  const all = n === 2 ? "both" : `all ${spelled(n)}`;
  return [
    `${capital(spelled(n))} courses and ${learners} learners so far.`,
    `${first} teaches ${all} in ${taught}, with subtitles in ${range} languages.`,
  ];
}

/** Every course the teacher runs, as wide cards under a centred head: the
 *  photograph at the left and, at the right, what the catalogue's card
 *  carries plus the four facts two courses by one person differ on. Two
 *  abreast from xl; under it one to a row, held to a width where the four
 *  facts and a title still fit, and a lone last card centred. */
export function CoursesTaught({ first, courses }: { first: string; courses: Course[] }) {
  return (
    <section id="courses" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow className="justify-center">Courses</Eyebrow>
        <SectionHeading className="mx-auto mt-5">What {first} teaches</SectionHeading>
        {/* each sentence a line of its own from sm, the longer one last */}
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          {lede(first, courses).map((line) => (
            <span key={line} className="sm:block">
              {line}{" "}
            </span>
          ))}
        </p>
      </div>

      <ul className="mt-14 flex flex-wrap justify-center gap-5">
        {courses.map((c) => (
          <li key={c.id} className="w-full max-w-3xl xl:w-[calc(50%-0.625rem)] xl:max-w-none">
            <WideCard course={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One course, wide. The photograph and the title are one link with an
 *  overlay over the whole card, named by the title alone; Save stands above
 *  the overlay at the foot, as it does on the catalogue's card. */
function WideCard({ course: c }: { course: Course }) {
  const id = `taught-${c.id}`;
  const Glyph = glyph[c.topic];
  const tint = topicTint[c.topic];
  // Four short facts, so two sit abreast in the column without an ellipsis:
  // the length and the pace apart, the lessons, and the subtitle languages,
  // whose glyph says what the count is of (a screen reader hears it said).
  const specs = [
    { icon: Calendar03Icon, text: `${c.weeks} weeks` },
    { icon: HourglassIcon, text: `${c.hours} h a week` },
    { icon: BookOpen01Icon, text: `${c.lessons} lessons` },
    { icon: SubtitleIcon, text: `${c.subtitles} languages`, said: "Subtitles in " },
  ];

  return (
    <article
      data-object
      className="group/card relative grid h-full grid-cols-[minmax(0,1fr)] rounded-lg bg-card p-2 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
    >
      <Link
        href={courseHref(c)}
        onClick={() => recordView(c.id)}
        data-card-link
        aria-labelledby={c.badge ? `${id} ${id}-badge` : id}
        className="group/link block outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
      >
        {/* The link is not positioned, so its overlay takes the card's whole
            face; the photograph is its own positioned box inside it, inset
            at the card's radius less the 8px between them. */}
        <div className="relative h-full overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted max-sm:aspect-[4/3] sm:min-h-52">
          <Image
            src={c.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 270px, (min-width: 768px) 345px, (min-width: 640px) 45vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/link:[transform:scale(1.04)] motion-safe:group-active/link:[transform:scale(1)] group-active/link:duration-answer",
              c.focus && focus[c.focus],
            )}
          />
          {c.badge && (
            <span
              id={`${id}-badge`}
              className="absolute left-3 top-3 rounded-control bg-[color-mix(in_oklab,var(--primary)_var(--chip-alpha),var(--card))] px-2.5 py-1 text-xs font-medium text-primary-ink shadow-soft">
              {c.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-col px-3 pb-2 pt-5 sm:px-5 sm:pb-3 sm:pt-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium",
              tint.lid,
              tint.ink,
            )}
          >
            <Glyph className="size-3.5" />
            {c.topic}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <LevelDots level={c.level} />
            {c.level}
          </span>
        </div>
        <h3 id={id} className="mt-3 line-clamp-2 text-lg font-medium">
          {c.title}
        </h3>
        {/* the school, and the credential on a line of its own under it, so
            the credential shows at every width and a pair of cards stays
            level, where one shared line lost it to the school's length */}
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="block truncate">{c.school}</span>
          <span className="block truncate">{c.credential}</span>
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <StarSolid aria-hidden="true" className="size-3.5 text-foreground" />
          <span className="text-foreground tabular-nums">
            <span className="sr-only">Rated </span>
            {c.rating}
          </span>
          <span className="tabular-nums">
            ({figure(c.reviews)}
            <span className="sr-only"> reviews</span>)
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate tabular-nums">{figure(c.learners)} learners</span>
        </p>

        {/* the reference's short rule over the facts and again under them */}
        <span aria-hidden="true" className="mt-4 block w-12 border-t" />
        {/* two even columns, except on the narrowest phone, where the first
            takes only its own width so the fourth fact keeps its whole count */}
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm max-sm:grid-cols-[auto_minmax(0,1fr)]">
          {specs.map((s) => (
            <li key={s.text} className="flex min-w-0 items-center gap-2">
              <HugeiconsIcon
                icon={s.icon}
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
                className="shrink-0 text-muted-foreground"
              />
              <span className="truncate">
                {s.said && <span className="sr-only">{s.said}</span>}
                {s.text}
              </span>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="mt-4 block w-12 border-t" />

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-heading text-xl tracking-tight tabular-nums">{priceLabel(c.price)}</span>
          <SaveButton course={c} />
        </div>
      </div>
    </article>
  );
}
