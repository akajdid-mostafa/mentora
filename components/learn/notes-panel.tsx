"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDownTrayIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { clock, learnCopy } from "@/components/learn/copy";
import { addNote, removeNote, restoreNote, updateNote, useNotes, type Note } from "@/components/learn/notes";
import { download } from "@/components/learn/transcript";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { TabTrack } from "@/components/ui/tab-track";
import { cn, slugify } from "@/lib/utils";

/** A note still being written: its text, and the lesson and second it was
 *  begun at. */
export type NoteDraft = { text: string; lesson: string; at: number };

/** Notes pinned to the minute they were written at. The field takes the
 *  player's minute when the first letter goes in rather than when Save is
 *  pressed, so a note written over half a minute keeps the moment it is
 *  about. The list opens on this lesson and can widen to the whole course,
 *  and a press on a note's minute plays it, from any lesson. The draft is
 *  held by the section, so it outlasts this tab closing and the next lesson
 *  opening under it. */
export function NotesPanel({
  course,
  courseTitle,
  lesson,
  at,
  titles,
  draft,
  onDraft,
  onJump,
}: {
  course: string;
  courseTitle: string;
  lesson: string;
  at: number;
  /** Every lesson's title by id, for the whole-course list and the export. */
  titles: Record<string, string>;
  draft: NoteDraft | null;
  onDraft: (draft: NoteDraft | null) => void;
  onJump: (lesson: string, at: number) => void;
}) {
  const all = useNotes().filter((n) => n.course === course);
  const [scope, setScope] = useState<"here" | "all">("here");
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [gone, setGone] = useState<Note | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  // Save, Delete and Undo each take away the button that was pressed, which
  // drops a keyboard reader's focus to the page. The control that follows
  // on is named here and focused once the list has redrawn. A pointer press
  // (detail > 0) has nothing to lose and leaves focus where it was.
  const refocus = useRef<string | null>(null);
  const after = (e: MouseEvent, selector: string) => {
    if (e.detail === 0) refocus.current = selector;
  };
  // after every commit, so it runs on the render each press causes
  useEffect(() => {
    const selector = refocus.current;
    if (!selector) return;
    refocus.current = null;
    root.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
  });

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const order = Object.keys(titles);
  const list = all
    .filter((n) => scope === "all" || n.lesson === lesson)
    .sort((a, b) => order.indexOf(a.lesson) - order.indexOf(b.lesson) || a.at - b.at);

  const save = () => {
    const text = draft?.text.trim();
    if (!draft || !text) return;
    addNote({ course, lesson: draft.lesson, at: draft.at, text });
    onDraft(null);
  };
  const t = clock(draft ? draft.at : at);

  const remove = (id: string) => {
    const note = removeNote(id);
    if (!note) return;
    setGone(note);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGone(null), 6000);
  };

  const exportAll = () => {
    const by = new Map<string, Note[]>();
    for (const n of [...all].sort((a, b) => order.indexOf(a.lesson) - order.indexOf(b.lesson) || a.at - b.at)) {
      by.set(n.lesson, [...(by.get(n.lesson) ?? []), n]);
    }
    const md = [
      `# ${courseTitle}: notes`,
      ...[...by].flatMap(([id, notes]) => [
        "",
        `## Lesson ${id}, ${titles[id] ?? ""}`,
        "",
        ...notes.map((n) => `- **${clock(n.at)}** ${n.text}`),
      ]),
      "",
    ].join("\n");
    download(`${slugify(courseTitle)}-notes.md`, md, "text/markdown");
  };

  return (
    <div ref={root}>
      {/* the new note, on the whisper tint a field rests on */}
      <div className="rounded-sm bg-accent p-3">
        <label htmlFor="new-note" className="block px-1 pb-2 text-sm font-medium tabular-nums">
          {draft && draft.lesson !== lesson ? learnCopy.notes.newIn(t, draft.lesson) : learnCopy.notes.new(t)}
        </label>
        <textarea
          id="new-note"
          value={draft?.text ?? ""}
          onChange={(e) => {
            const text = e.target.value;
            onDraft(text ? { text, lesson: draft?.lesson ?? lesson, at: draft?.at ?? Math.floor(at) } : null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) save();
          }}
          rows={2}
          placeholder={learnCopy.notes.placeholder}
          className="field-sizing-content block max-h-48 min-h-[calc(2lh+1.5rem)] w-full resize-none rounded-control bg-card px-4 py-3 text-base outline-none ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <div className="mt-2 flex justify-end gap-2">
          {draft && (
            <button
              type="button"
              onClick={() => onDraft(null)}
              className="flex h-10 items-center rounded-control px-4 text-sm font-medium press hover:bg-muted"
            >
              {learnCopy.notes.cancel}
            </button>
          )}
          <Button
            type="button"
            onClick={(e) => {
              save();
              after(e, "#new-note");
            }}
            disabled={!draft?.text.trim()}
            className="px-4"
          >
            {learnCopy.notes.save}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <TabTrack
          kind="radios"
          label={learnCopy.tabs.notes}
          idPrefix="notes-scope"
          options={[
            { id: "here", label: learnCopy.notes.here },
            { id: "all", label: learnCopy.notes.all },
          ]}
          value={scope}
          onChange={setScope}
        />
        <button
          type="button"
          onClick={exportAll}
          disabled={!all.length}
          className="ml-auto flex h-10 items-center gap-2 rounded-control px-3.5 text-sm ring-1 ring-inset ring-border press hover:bg-accent disabled:pointer-events-none disabled:text-muted-foreground"
        >
          <ArrowDownTrayIcon aria-hidden="true" className="size-4" />
          {learnCopy.notes.export}
        </button>
      </div>

      {gone && (
        <p role="status" className="mt-4 flex items-center gap-3 rounded-sm bg-accent px-4 py-2 text-sm">
          {learnCopy.notes.removed}
          <button
            type="button"
            data-note-undo
            onClick={(e) => {
              restoreNote(gone);
              setGone(null);
              after(e, `[data-note-edit="${gone.id}"]`);
            }}
            className="ml-auto h-10 rounded-control px-3 font-medium underline-offset-4 press hover:bg-muted"
          >
            {learnCopy.notes.undo}
          </button>
        </p>
      )}

      {list.length === 0 ? (
        <p className="mt-6 max-w-prose text-base text-muted-foreground">
          {scope === "here" ? learnCopy.notes.empty : learnCopy.notes.emptyAll}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {list.map((n) => (
            <li key={n.id} className="flex gap-3 py-4">
              <button
                type="button"
                onClick={() => onJump(n.lesson, n.at)}
                aria-label={learnCopy.notes.play(clock(n.at))}
                // drawn at the note's first line, with the 40px target from reach
                className={cn(
                  "flex h-8 shrink-0 items-center gap-1.5 rounded-control bg-muted px-2.5 font-mono text-xs tabular-nums press hover:bg-secondary",
                  reach,
                )}
              >
                <PlayIcon aria-hidden="true" className="size-3" />
                {clock(n.at)}
              </button>
              <div className="min-w-0 flex-1 pt-1">
                {scope === "all" && (
                  <p className="mb-1 truncate text-sm text-muted-foreground">
                    {learnCopy.lesson(n.lesson)}, {titles[n.lesson]}
                  </p>
                )}
                {editing?.id === n.id ? (
                  <div>
                    <textarea
                      value={editing.text}
                      onChange={(e) => setEditing({ id: n.id, text: e.target.value })}
                      aria-label={learnCopy.notes.edit}
                      autoFocus
                      className="field-sizing-content block max-h-48 min-h-12 w-full resize-none rounded-control bg-card px-3 py-2.5 text-base outline-none ring-1 ring-inset ring-border focus:ring-2 focus:ring-ring"
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        onClick={(e) => {
                          if (editing.text.trim()) updateNote(n.id, editing.text.trim());
                          setEditing(null);
                          after(e, `[data-note-edit="${n.id}"]`);
                        }}
                        className="px-4"
                      >
                        {learnCopy.notes.save}
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          setEditing(null);
                          after(e, `[data-note-edit="${n.id}"]`);
                        }}
                        className="flex h-10 items-center rounded-control px-4 text-sm font-medium press hover:bg-accent"
                      >
                        {learnCopy.notes.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-pretty text-base">{n.text}</p>
                )}
              </div>
              {editing?.id !== n.id && (
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    data-note-edit={n.id}
                    onClick={() => setEditing({ id: n.id, text: n.text })}
                    aria-label={learnCopy.notes.edit}
                    className="flex size-10 items-center justify-center rounded-control text-muted-foreground press hover:bg-accent hover:text-foreground"
                  >
                    <PencilSquareIcon aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      remove(n.id);
                      after(e, "[data-note-undo]");
                    }}
                    aria-label={learnCopy.notes.remove}
                    className="flex size-10 items-center justify-center rounded-control text-muted-foreground press hover:bg-accent hover:text-foreground"
                  >
                    <TrashIcon aria-hidden="true" className="size-4" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
