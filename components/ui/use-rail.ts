"use client";

import { useEffect, useRef, useState } from "react";

/** A row that scrolls sideways under two arrows: the ref for the row, which
 *  way it can still move, and a page step either way. The ends are read
 *  after paint, on every scroll and resize, and whenever the row's items
 *  change, so a rail whose contents are swapped disables the right arrows.
 *  `none` is the row with nothing to scroll, which draws no arrows at all. */
export function useRail<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setEnds({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      });
    const frame = requestAnimationFrame(measure);
    const swapped = new MutationObserver(measure);
    swapped.observe(el, { childList: true });
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      swapped.disconnect();
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth, behavior: still ? "auto" : "smooth" });
  };

  return { ref, ends, none: ends.start && ends.end, page };
}
