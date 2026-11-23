"use client";

// The combobox the site's four searches share — the hero's, the header's, the
// catalog's and the instructor directory's: which row is current, the keys
// that move it, the clicks that take one, and the ARIA that lets a screen
// reader follow along. What the rows are, how they are drawn and what taking
// one does stay with each search, because those are where they differ.

import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

/** One field over the rows it suggests. Focus or typing opens the list, the
 *  arrow keys walk it, Enter takes the current row, and Escape or focus
 *  leaving `root` closes it without taking anything. The field keeps its
 *  text, so coming back to it opens the same list again.
 *
 *  Spread `root` on the element holding both the field and the list, `input`
 *  on the field, `listbox` on the list and `option(i)` on each row. A row
 *  carries `data-active` while it is current, which is what its highlight
 *  hangs on. `open` is whether the list is showing: asked for, and with at
 *  least one row to show. */
export function useCombobox<T>({
  rows,
  onType,
  onTake,
  keepOpen,
}: {
  rows: readonly T[];
  /** The field's text, on every keystroke. */
  onType: (text: string) => void;
  /** A row taken, by Enter or by a click. */
  onTake: (row: T) => void;
  /** Rows that only narrow the search: taking one leaves the list open on
   *  whatever rows it leads to. */
  keepOpen?: (row: T) => boolean;
}) {
  const list = useId();
  const [asked, setAsked] = useState(false);
  const [index, setIndex] = useState(-1);

  const open = asked && rows.length > 0;
  // An index left past the end by rows that changed under it is no row.
  const active = open && index < rows.length ? index : -1;
  const id = (i: number) => `${list}-${i}`;

  /** The list, open on its rows with none of them current. */
  const show = () => {
    setAsked(true);
    setIndex(-1);
  };
  const close = () => {
    setAsked(false);
    setIndex(-1);
  };
  const take = (i: number) => {
    const row = rows[i];
    setAsked(keepOpen?.(row) ?? false);
    setIndex(-1);
    onTake(row);
  };

  return {
    open,
    show,
    close,
    root: {
      // Focus moving to another control inside it, the submit button or a
      // clear button, keeps the list; leaving it altogether closes it.
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      },
    },
    input: {
      role: "combobox",
      "aria-autocomplete": "list" as const,
      "aria-expanded": open,
      "aria-controls": list,
      "aria-activedescendant": active >= 0 ? id(active) : undefined,
      autoComplete: "off",
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        onType(e.target.value);
        show();
      },
      onFocus: () => setAsked(true),
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        // A key that commits an IME composition belongs to the IME, or
        // confirming a word typed in Japanese or Chinese would take a row.
        if (e.nativeEvent.isComposing) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setAsked(true);
          setIndex(Math.min(rows.length - 1, active + 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setIndex(Math.max(-1, active - 1));
        } else if (e.key === "Escape" && open) {
          // The list first; a second Escape reaches whatever holds the field,
          // such as the header's popover.
          e.stopPropagation();
          close();
        } else if (e.key === "Enter" && active >= 0) {
          // Without a current row, Enter submits the form as typed.
          e.preventDefault();
          take(active);
        }
      },
    },
    listbox: { id: list, role: "listbox" },
    option: (i: number) => ({
      id: id(i),
      role: "option",
      "aria-selected": i === active,
      "data-active": i === active || undefined,
      // mousedown would move focus off the field first, and the blur on
      // `root` would close the list before the click could land
      onMouseDown: (e: MouseEvent) => e.preventDefault(),
      onMouseEnter: () => setIndex(i),
      onClick: () => take(i),
    }),
  };
}
