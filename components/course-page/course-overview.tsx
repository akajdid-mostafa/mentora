import type { ReactNode } from "react";
import Link from "next/link";
import { CheckIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  Calendar03Icon,
  Certificate01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LevelDots, SaveButton } from "@/components/course/course-card";
import { glyph } from "@/components/course/glyph";
import {
  courseHref,
  duration,
  figure,
  teacherHref,
  topicTint,
  type Course,
} from "@/components/course/courses";
import {
  aspectsOf,
  instructorOf,
  spread,
  type Instructor,
  type Outline,
} from "@/components/course/detail";
import { reviewsOf } from "@/components/course/reviews";
import { EnrolPanel } from "@/components/course-page/enrol-panel";
import { Avatar, InstructorProfile } from "@/components/course-page/instructor";
import { PreviewFrame, PreviewProvider, type Clip } from "@/components/course-page/preview";
import { RecordView } from "@/components/course-page/record-view";
import { Reviews } from "@/components/course-page/reviews";
import { ShareButton } from "@/components/course-page/share-button";
import { cohorts } from "@/components/course-page/start";
import { Syllabus } from "@/components/course-page/syllabus";
import { reach } from "@/components/reach";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { JsonLd } from "@/components/site/json-ld";
import { aiGlyph } from "@/components/ui/ai-icon";
import { Caps } from "@/components/ui/caps";
import { abs } from "@/lib/site";
import { cn, count, slugify } from "@/lib/utils";

const code = { English: "en", Spanish: "es", Portuguese: "pt", French: "fr" } as const;

/** The course page's first section and most of the page: on the right the
 *  title, the reference's host rows (who teaches it, then the four facts)
 *  and the buy panel; down the left the poster of the first free lesson,
 *  the syllabus and the teacher; the reviews under both. The panel rides
 *  down beside the long read, so the price and the button are never further
 *  than a glance away while the syllabus is being read. */
export function CourseOverview({
  course: c,
  outline,
  today,
}: {
  course: Course;
  outline: Outline;
  /** The server's date, which the start rows open on. */
  today: string;
}) {
  const teacher = instructorOf(c);
  // A course taught in another language carries its own title, description
  // and syllabus in that language, and says so, so a screen reader reads
  // them in the right voice.
  const lang = c.language === "English" ? undefined : code[c.language];
  const clips: Clip[] = outline.modules.flatMap((m) =>
    m.lessons.filter((l) => l.preview).map((l) => ({ ...l, module: m.title })),
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8">
      <RecordView id={c.id} />
      <JsonLd schema={courseLd(c, outline)} />
      <PreviewProvider course={c} clips={clips} lang={lang}>
        <Breadcrumb
          trail={[
            { label: "Courses", href: "/courses" },
            { label: c.topic, href: `/courses?topic=${slugify(c.topic)}` },
            { label: c.title },
          ]}
        />

        {/* One column on a phone, in reading order: the title, the poster,
            the teacher and the facts, the panel, then the long read. From lg the two halves
            stand side by side — the left column and the right one become
            boxes of their own — and the panel sticks inside the right one,
            which is as tall as the left. Below lg both are `contents`, so
            their children line up in the order above. */}
        {/* grid-cols-1 rather than the implicit auto column, which grows to
            its widest child's content: one row that scrolls sideways on a
            phone would widen the whole page. */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_26rem] xl:gap-x-16">
          {/* The title's column comes first in the source, so the page's h1 is
              read before the h2s down the left; the grid places it on the
              right. */}
          <div className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col">
            <Head course={c} lang={lang} className="max-lg:order-1" />
            <Details course={c} teacher={teacher} className="max-lg:order-3 lg:mt-10 lg:border-t lg:pt-10" />
            <div className="max-lg:order-4 lg:sticky lg:top-20 lg:mt-12">
              <EnrolPanel course={c} today={today} />
            </div>
          </div>

          <div className="contents lg:col-start-1 lg:row-start-1 lg:block">
            <div className="max-lg:order-2">
              {clips[0] && (
                <PreviewFrame course={c} clip={clips[0]} count={clips.length} lang={lang} />
              )}
            </div>
            <div className="max-lg:order-5">
              <Block id="about" title="About this course" first>
                <p lang={lang} className="max-w-xl text-base">
                  {outline.about}
                </p>
                <Caps className="mt-8">Skills you practice</Caps>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/courses?q=${encodeURIComponent(s)}`}
                        className="flex h-10 items-center rounded-control bg-card px-4 text-sm shadow-soft press hover:shadow-soft-lg active:shadow-none"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block id="syllabus" title="Syllabus">
                <Syllabus
                  lang={lang}
                  modules={outline.modules}
                  lessons={outline.lessons}
                  quizzes={outline.quizzes}
                  minutes={outline.minutes}
                  skills={c.skills}
                  teacher={teacher.name}
                />
              </Block>

              <Block id="includes" title="What the price covers">
                <Covers course={c} outline={outline} teacher={teacher} />
              </Block>

              <Block id="instructor" title="Your instructor">
                <InstructorProfile teacher={teacher} course={c} />
              </Block>

            </div>
          </div>
        </div>

        {/* The reviews run the container's whole width under both columns,
            as the reference lays its own under the listing: the panel stops
            riding at the teacher, the scores take a cell each across the
            page, and the list runs two abreast with rules between. The
            rating is the heading, the figure and the count on one line. */}
        <Block
          id="reviews"
          title={
            <span className="flex items-center gap-2.5">
              {/* the star held against the figure it belongs to, 2px off
                  it as on the teacher's card */}
              <span className="flex items-center gap-0.5">
                <StarSolid aria-hidden="true" className="size-6 text-foreground" />
                <span className="sr-only">Reviews, rated</span>
                <span className="tabular-nums">{c.rating}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{figure(c.reviews)} reviews</span>
            </span>
          }
        >
          <Reviews course={c} reviews={reviewsOf(c)} spread={spread(c)} aspects={aspectsOf(c)} />
        </Block>
      </PreviewProvider>
    </section>
  );
}

/** A part of the long read: a heading of its own, and a hairline over it
 *  where another part ends above. All but the reviews sit in the left
 *  column; the reviews take the container's width under both. */
function Block({
  id,
  title,
  first,
  children,
}: {
  id: string;
  title: ReactNode;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      id={id}
      className={cn(first ? "lg:mt-16" : "mt-14 border-t pt-14 lg:mt-16 lg:pt-16")}
    >
      <h2 id={`${id}-title`} className="mb-6 text-2xl tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** The title block, set on the centre line as the reference sets its own. */
function Head({
  course: c,
  lang,
  className,
}: {
  course: Course;
  lang?: string;
  className?: string;
}) {
  const Glyph = glyph[c.topic];
  const tint = topicTint[c.topic];
  return (
    <div className={cn("text-center", className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium",
            tint.lid,
            tint.ink,
          )}
        >
          <Glyph aria-hidden="true" className="size-3.5" />
          {c.topic}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LevelDots level={c.level} />
          {c.level}
        </span>
      </div>

      <h1 lang={lang} className="mt-6 text-4xl tracking-tighter sm:text-5xl lg:text-4xl xl:text-5xl">
        {c.title}
      </h1>
      {/* Balanced, where every other paragraph here is fitted by hand: this
          line is each course's own data, thirty-six of them here and however
          many a buyer writes, and no wording fits every one of them. */}
      <p lang={lang} className="mx-auto mt-5 max-w-md text-balance text-base text-muted-foreground">
        {c.outcome}
      </p>

      <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
        <span className="flex items-center gap-0.5">
          <StarSolid aria-hidden="true" className="size-4 text-foreground" />
          <span className="sr-only">Rated </span>
          <span className="tabular-nums">{c.rating}</span>
        </span>
        <a
          href="#reviews"
          className={cn("tabular-nums underline underline-offset-4 press hover:text-muted-foreground", reach)}
        >
          {figure(c.reviews)} reviews
        </a>
        <span aria-hidden="true" className="text-muted-foreground">
          ·
        </span>
        <span>
          <span className="tabular-nums">{figure(c.learners)}</span>{" "}
          <span className="text-muted-foreground">learners</span>
        </span>
      </p>

      <div className="mt-6 flex items-center justify-center gap-2">
        <SaveButton course={c} className="h-10 px-4" />
        <ShareButton title={c.title} path={courseHref(c)} />
      </div>

    </div>
  );
}

/** The reference's host rows, under the title on the right: who teaches it,
 *  one press from the block that says more, then the four facts a buyer
 *  weighs, each on a tile of its own as the reference sets its pin, clock
 *  and clipboard on theirs. */
// What each credential gives, in the words the Details rows lead with. A
// guided project carries no certificate: the reviewed work is the credential.
const earned: Record<Course["credential"], string> = {
  "Professional Certificate": "Earn a Professional Certificate",
  Specialization: "Earn a Specialization certificate",
  Course: "Earn a course certificate",
  "Guided Project": "Finish with a reviewed project",
};

function Details({
  course: c,
  teacher,
  className,
}: {
  course: Course;
  teacher: Instructor;
  className?: string;
}) {
  const facts = [
    {
      term: "Length",
      icon: Calendar03Icon,
      value: `${c.weeks} weeks at ${c.hours} hours a week`,
      note: cohorts(c) ? "At your own pace, or in a live cohort" : "At your own pace, starting today",
    },
    {
      term: "Credential",
      icon: Certificate01Icon,
      value: earned[c.credential],
      note: c.credential === "Guided Project" ? "A line on your record links to it" : `Issued by ${c.school}`,
    },
    {
      term: "Language",
      icon: Globe02Icon,
      value: `Taught in ${c.language}`,
      note: `With subtitles in ${count(c.subtitles, "language")}`,
    },
    {
      term: "Tutor",
      icon: aiGlyph,
      value: "An AI tutor in every lesson",
      note: "It answers from the lesson on screen",
    },
  ];
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <a href="#instructor" className="group flex items-center gap-4 press">
        <Avatar teacher={teacher} topic={c.topic} size="sm" />
        <span className="min-w-0">
          <span className="flex items-center gap-1 text-sm font-medium">
            <span className="truncate underline-offset-4 group-hover:underline">
              Taught by {teacher.name}
            </span>
            <CheckBadgeIcon aria-hidden="true" className="size-4 shrink-0 text-iris-ink" />
            <span className="sr-only">, verified instructor</span>
          </span>
          <span className="block text-sm text-muted-foreground">
            {teacher.trade} · {c.school}
          </span>
        </span>
      </a>
      <dl data-object className="flex flex-col gap-6">
        {facts.map((f) => (
          <div key={f.term}>
            <dt className="sr-only">{f.term}</dt>
            <dd className="flex items-center gap-4">
              {/* a 44px tile, the avatar's size, so the five rows share one
                  edge; the tutor keeps the AI glyph in the AI accent */}
              <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-card shadow-soft">
                <HugeiconsIcon
                  icon={f.icon}
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={f.icon === aiGlyph ? "text-iris-ink" : undefined}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{f.value}</span>
                <span className="block text-balance text-sm text-muted-foreground">{f.note}</span>
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** The reference's two columns: what the price covers, and what it does
 *  not, each line a claim the rest of the page can back. */
function Covers({
  course: c,
  outline,
  teacher,
}: {
  course: Course;
  outline: Outline;
  teacher: Instructor;
}) {
  const first = teacher.name.split(" ")[0];
  const yes = [
    `${count(outline.lessons, "video lesson")}, ${duration(outline.minutes)} in all`,
    "The AI tutor beside every lesson",
    `${count(outline.quizzes, "quiz", "quizzes")}, graded as you answer`,
    `A project reviewed by ${first}'s team`,
    c.credential === "Guided Project"
      ? "The reviewed project, on your record"
      : c.credential === "Course"
        ? "A course certificate when you finish"
        : `A ${c.credential} when you finish`,
    `Transcripts in ${c.subtitles} languages`,
  ];
  const no = [
    "Answers the tutor writes for you",
    cohorts(c) ? "Live reviews outside a cohort" : "Live classes",
    "One-to-one mentoring",
    "A job guarantee",
  ];
  return (
    // Two columns where a line fits its column: from sm while the page is one
    // column, and from xl; between, the panel beside takes the room and the
    // lines would break a word from their ends.
    <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-1 lg:gap-10 xl:grid-cols-2 xl:gap-8">
      {[
        { head: "In the price", rows: yes, on: true },
        { head: "Not in it", rows: no, on: false },
      ].map((col) => (
        <div key={col.head}>
          <Caps>{col.head}</Caps>
          <ul className="mt-4 flex flex-col gap-3.5">
            {col.rows.map((line) => (
              <li key={line} className="flex gap-3 text-base">
                <span className="flex h-6 shrink-0 items-center">
                  {col.on ? (
                    <CheckIcon aria-hidden="true" className="size-4.5 text-iris-ink" />
                  ) : (
                    <NoSymbolIcon aria-hidden="true" className="size-4.5 text-muted-foreground" />
                  )}
                </span>
                <span className={col.on ? undefined : "text-muted-foreground"}>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** The course as a search engine reads it, off the same row the page
 *  prints: the rating and count in the head, the price in the panel. */
function courseLd(c: Course, outline: Outline) {
  const url = abs(courseHref(c));
  return {
    "@type": "Course",
    "@id": `${url}#course`,
    name: c.title,
    description: outline.about,
    url,
    image: c.image,
    inLanguage: code[c.language],
    educationalCredentialAwarded: c.credential,
    provider: { "@type": "Organization", name: c.school },
    publisher: { "@id": abs("/#organization") },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: c.rating,
      reviewCount: c.reviews,
      bestRating: 5,
    },
    offers: {
      "@type": "Offer",
      price: c.price,
      priceCurrency: "USD",
      category: c.price ? "Paid" : "Free",
      url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      // the hours the course asks for in all, as Google reads the field
      courseWorkload: `PT${c.weeks * c.hours}H`,
      // the profile page publishes this person under the same @id
      instructor: {
        "@type": "Person",
        "@id": `${abs(teacherHref(c.instructor))}#person`,
        name: c.instructor,
        url: abs(teacherHref(c.instructor)),
      },
    },
  };
}
