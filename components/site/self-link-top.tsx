"use client";

import { useEffect } from "react";

/** A press on a link outside the page's content (the header, the footer, the
 *  menu drawer) that leads to the page already open takes the reader to its
 *  top, as a link to a page is expected to. The router changes nothing when
 *  the address is already that page, and keeps the scroll when only the query
 *  differs, since the page is still on screen; either way the press looks
 *  dead from the foot of a long page. A link with a hash keeps its own jump,
 *  and links inside the content (a filter, a tab) keep the reader where they
 *  are. */
export function SelfLinkTop() {
  useEffect(() => {
    const press = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!a || a.closest("main") || (a.target && a.target !== "_self")) return;
      const to = new URL(a.href, window.location.href);
      if (to.origin !== window.location.origin || to.pathname !== window.location.pathname || to.hash) return;
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // After the router has handled the press, so a navigation that does
      // move the page starts from the top as well.
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" }));
    };
    document.addEventListener("click", press);
    return () => document.removeEventListener("click", press);
  }, []);
  return null;
}
