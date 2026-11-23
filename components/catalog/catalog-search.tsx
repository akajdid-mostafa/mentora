"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { courseHref, courses, matchesQuery, type Course } from "@/components/course/courses";
import { recordView } from "@/components/course/recent";
import { topics } from "@/components/marketing/catalogue";
import { useCombobox } from "@/components/search/use-combobox";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

type Row =
  | { kind: "query"; text: string }
  | { kind: "course"; course: Course }
  | { kind: "topic"; label: string; accent: string };

// Most enrolled first, so a two-letter query surfaces the courses most
// learners picked rather than the first ones in the file.
const byLearners = [...courses].sort((a, b) => b.learners - a.learners);

/** The catalogue's search: a combobox over every course, reading titles,
 *  skills, schools and teachers. Typing lists up to five courses under a row
 *  that searches for the words as typed; the arrow keys walk the rows, Enter
 *  takes one, Escape and a click elsewhere close the list. An empty field with
 *  focus offers the searches most learners start from. A suggested course
 *  opens its own page; the words as typed, or a popular search, are applied
 *  to the catalogue below at once, and `onGo` then takes the reader down to
 *  it; clearing the field applies too, but leaves them where they
 *  are, in the field. */
export function CatalogSearch({
  value,
  onSearch,
  onGo,
  className,
}: {
  value: string;
  onSearch: (q: string) => void;
  onGo?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const field = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value);
  // The applied query can change from outside, when its chip is removed, and
  // the field follows it: the documented way to reset state from a prop.
  const [applied, setApplied] = useState(value);
  if (value !== applied) {
    setApplied(value);
    setText(value);
  }

  const typed = text.trim();
  const rows: Row[] = typed
    ? [
        { kind: "query", text: typed },
        ...byLearners
          .filter((c) => matchesQuery(c, typed))
          .slice(0, 5)
          .map((course) => ({ kind: "course" as const, course })),
      ]
    : topics.map((t) => ({ kind: "topic" as const, label: t.label, accent: t.accent }));

  const combo = useCombobox({
    rows,
    onType: setText,
    onTake: (row) => {
      if (row.kind === "course") {
        setText(row.course.title);
        recordView(row.course.id);
        router.push(courseHref(row.course));
        return;
      }
      const q = row.kind === "query" ? row.text : row.label;
      setText(q);
      onSearch(q);
      onGo?.();
    },
  });

  return (
    <form
      role="search"
      aria-label="Courses"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(typed);
        combo.close();
        onGo?.();
      }}
      {...combo.root}
    >
      <div className="flex h-12 items-center gap-3 rounded-control bg-card pl-4 pr-1 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring">
        <MagnifyingGlassIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
        <input
          ref={field}
          // size={1}, or the input's default width sets the row's min-content
          // and the field cannot shrink inside a narrow column
          size={1}
          name="q"
          value={text}
          {...combo.input}
          aria-label="Search the catalog"
          placeholder="Title, skill or instructor"
          className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        {text && (
          <button
            type="button"
            aria-label="Clear the search"
            onClick={() => {
              setText("");
              onSearch("");
              // The button is about to unmount and would take focus with it,
              // stranding the list open; back in the field, empty, it offers
              // the popular searches instead.
              combo.show();
              field.current?.focus();
            }}
            className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground press hover:bg-accent hover:text-foreground after:absolute after:-inset-0.5 after:content-['']"
          >
            <XMarkIcon className="size-4" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="flex size-10 shrink-0 items-center justify-center rounded-[calc(var(--radius-control)-4px)] bg-primary text-primary-foreground press hover:bg-primary/80"
        >
          <MagnifyingGlassIcon className="size-4" />
        </button>
      </div>

      {combo.open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-lg bg-popover p-1.5 text-popover-foreground shadow-soft-lg">
          {!typed && <Caps className="px-3 pb-1.5 pt-2">Popular searches</Caps>}
          <ul
            {...combo.listbox}
            aria-label={typed ? "Suggested courses" : "Popular searches"}
          >
            {rows.map((row, i) => (
              <li
                key={row.kind === "course" ? row.course.id : `${row.kind}-${i}`}
                {...combo.option(i)}
                className="flex min-h-10 cursor-pointer items-center gap-3 rounded-sm px-3 py-2 transition-colors data-[active]:bg-accent"
              >
                {row.kind === "query" && (
                  <>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 truncate text-sm">
                      Search for <span className="font-medium">“{row.text}”</span>
                    </span>
                  </>
                )}
                {row.kind === "course" && (
                  <>
                    <Image
                      src={row.course.image}
                      alt=""
                      width={40}
                      height={40}
                      sizes="40px"
                      className="size-10 shrink-0 rounded-[10px] object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{row.course.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {row.course.credential} · {row.course.instructor}
                      </span>
                    </span>
                  </>
                )}
                {row.kind === "topic" && (
                  <>
                    <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", row.accent)} />
                    <span className="text-sm">{row.label}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
