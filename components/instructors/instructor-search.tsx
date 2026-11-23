"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { teacherHref, topicTint } from "@/components/course/courses";
import { directoryCopy } from "@/components/instructors/copy";
import { matchesQuery, roster, type Entry } from "@/components/instructors/directory";
import { face } from "@/components/marketing/quotes";
import { useCombobox } from "@/components/search/use-combobox";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

type Row =
  | { kind: "query"; text: string }
  | { kind: "teacher"; entry: Entry }
  | { kind: "popular"; text: string; dot: string };

// The field most of a search's teachers work in, for the dot beside it.
export function dotFor(q: string) {
  const found = roster.filter((e) => matchesQuery(e, q));
  const field = found.reduce<Entry["field"] | null>(
    (best, e) =>
      !best || found.filter((x) => x.field === e.field).length > found.filter((x) => x.field === best).length
        ? e.field
        : best,
    null,
  );
  return field ? topicTint[field].dot : "bg-muted-foreground";
}

const popular = directoryCopy.popular.map((text) => ({ kind: "popular" as const, text, dot: dotFor(text) }));

// Most learners first, so two letters surface the teachers most learners
// already know rather than the first ones in the file.
const byLearners = [...roster].sort((a, b) => b.learners - a.learners);

/** The directory's search, built as the catalog's is: a combobox over every
 *  teacher, reading names, trades, fields and everything they teach. Typing
 *  lists up to five teachers under a row that searches for the words as
 *  typed; the arrow keys walk the rows, Enter takes one, Escape and a click
 *  elsewhere close the list. An empty field with focus offers the skills most
 *  searches start from. */
export function InstructorSearch({
  value,
  onSearch,
  onGo,
  className,
}: {
  value: string;
  onSearch: (q: string) => void;
  /** Called once a search is taken or submitted, not when the field is
   *  cleared, to take the reader down to the answer. */
  onGo?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const field = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value);
  // The applied search can change from outside, when its chip is removed,
  // and the field follows it.
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
          .filter((e) => matchesQuery(e, typed))
          .slice(0, 5)
          .map((entry) => ({ kind: "teacher" as const, entry })),
      ]
    : popular;

  const combo = useCombobox({
    rows,
    onType: setText,
    onTake: (row) => {
      // A suggested teacher opens their profile; the words as typed filter.
      if (row.kind === "teacher") {
        setText(row.entry.name);
        router.push(teacherHref(row.entry.name));
        return;
      }
      const q = row.text;
      setText(q);
      onSearch(q);
      onGo?.();
    },
  });

  return (
    <form
      role="search"
      aria-label="Instructors"
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
          size={1}
          name="q"
          value={text}
          {...combo.input}
          aria-label="Search the instructors"
          placeholder={directoryCopy.search}
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
          <ul {...combo.listbox} aria-label={typed ? "Suggested instructors" : "Popular searches"}>
            {rows.map((row, i) => (
              <li
                key={row.kind === "teacher" ? row.entry.name : `${row.kind}-${i}`}
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
                {row.kind === "teacher" && (
                  <>
                    {row.entry.portrait ? (
                      <Image
                        src={face(row.entry.portrait, 80)}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="size-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span aria-hidden="true" className="size-10 shrink-0 rounded-full bg-muted" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{row.entry.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {row.entry.trade}
                      </span>
                    </span>
                  </>
                )}
                {row.kind === "popular" && (
                  <>
                    <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", row.dot)} />
                    <span className="text-sm">{row.text}</span>
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
