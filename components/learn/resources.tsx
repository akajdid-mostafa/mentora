"use client";

import { ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { learnCopy } from "@/components/learn/copy";
import { download } from "@/components/learn/transcript";

export type Resource = {
  name: string;
  /** What it is, in a few words. */
  about: string;
  kind: "text" | "table" | "code";
  type: string;
  body: () => string;
};

const icon = { text: DocumentTextIcon, table: TableCellsIcon, code: CodeBracketIcon };

/** The files a lesson hands out. There is no server to fetch them from, so
 *  each one is written in the browser at the press of its button, and each
 *  one is real: the transcript as text, the learner's notes as Markdown, and
 *  on the course that ships them, the dataset and the schema it runs on. */
export function Resources({ files }: { files: Resource[] }) {
  if (!files.length) return <p className="text-base text-muted-foreground">{learnCopy.resources.none}</p>;
  return (
    <ul className="divide-y divide-border">
      {files.map((f) => {
        const Glyph = icon[f.kind];
        const size = new Blob([f.body()]).size;
        return (
          <li key={f.name} className="flex items-center gap-4 py-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-muted">
              <Glyph aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-medium">{f.name}</span>
              <span className="block truncate text-sm text-muted-foreground">
                {f.about} · {bytes(size)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => download(f.name, f.body(), f.type)}
              aria-label={`${learnCopy.resources.download} ${f.name}`}
              className="flex h-10 shrink-0 items-center gap-2 rounded-control px-3.5 text-sm ring-1 ring-inset ring-border press hover:bg-accent"
            >
              <ArrowDownTrayIcon aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">{learnCopy.resources.download}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const bytes = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
