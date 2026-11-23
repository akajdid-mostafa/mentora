"use client";

import { useRef, useState } from "react";
import { ArrowUpTrayIcon, CheckIcon, DocumentIcon } from "@heroicons/react/24/outline";
import type { ProjectBrief } from "@/components/course/lessons/projects";
import { learnCopy } from "@/components/learn/copy";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

type Attached = { name: string; size: number };

/** The closing project: what it asks for, what to hand in and the upload
 *  itself. A demo has nowhere to send the file, so the upload reads its name
 *  and size, and Submit lands on the state a real platform would show next.
 *  Every form in the template rests where Submit works on the first press,
 *  and a file field has no value to rest at, so the learner's draft of the
 *  hand-in comes attached; the button beside it swaps in a file of their own. */
export function ProjectStage({
  place,
  title,
  teacher,
  brief,
  handIn,
  accept,
  draft,
  done,
  lang,
  onSubmit,
}: {
  place: string;
  title: string;
  teacher: string;
  brief?: ProjectBrief;
  handIn: string;
  accept: string;
  /** The file attached before anything is chosen. */
  draft: Attached;
  done: boolean;
  lang?: string;
  onSubmit: () => void;
}) {
  const [file, setFile] = useState<Attached | null>(draft);
  const [sent, setSent] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const first = teacher.split(" ")[0];

  return (
    <div className="rounded-lg bg-card p-5 shadow-soft sm:p-7">
      {/* The title and the hours sit under the deck with every other item's;
          the card carries what only a project has. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Caps>{place}</Caps>
        <span className="text-sm text-muted-foreground">{learnCopy.project.review(first)}</span>
      </div>
      <h2 className="mt-3 text-lg font-medium">{learnCopy.project.brief}</h2>

      {brief && (
        <ol aria-label={title} className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
          {brief.tasks.map((t, i) => (
            <li key={t} className="flex gap-3 text-base">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs tabular-nums">
                {i + 1}
              </span>
              <span lang={lang}>{t}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6 rounded-sm bg-accent p-4">
        <p className="text-base">
          <span className="font-medium">{learnCopy.project.handIn}:</span>{" "}
          <span className="text-muted-foreground">{handIn}</span>
        </p>

        {done || sent ? (
          <div role="status" className="mt-4 flex items-start gap-3 rounded-sm bg-leaf/15 p-4 text-leaf-ink">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-leaf text-card">
              <CheckIcon aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
            </span>
            <p className="text-base">
              <span className="font-medium">
                {sent ? learnCopy.project.submitted(sent) : learnCopy.completed}.
              </span>{" "}
              {learnCopy.project.submittedBody}
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              ref={input}
              type="file"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile({ name: f.name, size: f.size });
              }}
              className="peer sr-only"
              id="project-file"
            />
            {/* The field is hidden and the label drawn as its button, so the
                label shows the ring when the field has the focus. */}
            <label
              htmlFor="project-file"
              className={cn(
                "flex h-10 cursor-pointer items-center gap-2 rounded-control bg-card px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-muted",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
              )}
            >
              <ArrowUpTrayIcon aria-hidden="true" className="size-4" />
              {file ? learnCopy.project.change : learnCopy.project.upload}
            </label>
            {file && (
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <DocumentIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`}
                </span>
              </span>
            )}
            <Button
              type="button"
              disabled={!file}
              onClick={() => {
                setSent(
                  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                );
                onSubmit();
              }}
              className="ml-auto"
            >
              {learnCopy.project.submit}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
