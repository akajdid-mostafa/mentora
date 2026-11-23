"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "next/navigation";

const parse = (address: string) => Object.fromEntries(new URLSearchParams(address));

/** A list page's filters, kept in the address so a view can be bookmarked,
 *  shared or reloaded. `read` turns the address's parameters into the page's
 *  state and `write` turns the state back into a query ("" or "?…"); writing
 *  what was read gives the same address back.
 *
 *  The state starts from the address rather than from the server's copy of
 *  it. Going Back to a view whose filters changed after it loaded restores
 *  the page from the router's cache, which still holds the filters it loaded
 *  with, while the address holds the ones the visitor left it on.
 *
 *  A change to the state rewrites the address without a navigation. The
 *  address also changes from outside the state: a link to this page from
 *  this page (the footer's, the Explore menu's), and Back between two such
 *  links, navigate without remounting the section. When the address moves
 *  somewhere the state did not write, it wins.
 *
 *  The router reports each rewrite a moment after it is made, so a visitor
 *  who changes two filters in that moment sees the first rewrite arrive
 *  after the second change. The rewrites still on their way are kept, and
 *  one arriving is recognised as the page's own rather than as a link. */
export function useAddressState<S>(
  read: (params: Record<string, string>) => S,
  write: (state: S) => string,
): [S, Dispatch<SetStateAction<S>>] {
  const address = useSearchParams().toString();
  const [held, setHeld] = useState(() => ({ value: read(parse(address)), sent: [] as string[] }));
  const [seen, setSeen] = useState(address);
  if (address !== seen) {
    setSeen(address);
    const own = held.sent.indexOf(address);
    if (own >= 0) setHeld({ value: held.value, sent: held.sent.slice(own + 1) });
    else if (address !== write(held.value).slice(1)) setHeld({ value: read(parse(address)), sent: [] });
  }

  const set = useCallback<Dispatch<SetStateAction<S>>>(
    (next) =>
      setHeld((h) => {
        const value = typeof next === "function" ? (next as (s: S) => S)(h.value) : next;
        return { value, sent: [...h.sent, write(value).slice(1)] };
      }),
    [write],
  );

  // The rewrite has to go through the router's copy of `replaceState`, which
  // keeps the router's mark on the entry. On a page's first load this effect
  // runs before the router's own effect takes history over, and a rewrite
  // made then wipes the mark: Back to this entry moves the address and leaves
  // the page that was open on screen. A microtask lands after the router's
  // effect. An address that already says what the state says stays as it is.
  useEffect(() => {
    const to = `${window.location.pathname}${write(held.value)}`;
    if (to === `${window.location.pathname}${window.location.search}`) return;
    let live = true;
    queueMicrotask(() => {
      if (live) window.history.replaceState(null, "", to);
    });
    return () => {
      live = false;
    };
  }, [held.value, write]);

  return [held.value, set];
}
