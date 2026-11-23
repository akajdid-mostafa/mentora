"use client";

import { useEffect, useRef, useState } from "react";

import { viewportObserver } from "@/lib/viewport-observer";

const fmt = (v: number) => v.toLocaleString("en-US");

/** A figure that counts up from zero the first time it scrolls into view.
 *  The server draws the final figure, so a reader without JavaScript, a
 *  crawler and a reader who asked for less motion all get the number itself;
 *  the count only runs for a figure still below the fold when the page wakes.
 *
 *  `tabular-nums` cannot hold the digits still here: the display faces the
 *  Switch offers carry no tabular figures, and the property does nothing
 *  without them. So while it counts, every digit stands in a cell as wide as
 *  the face's widest digit, and when it lands the cells ease to the final
 *  figure's own widths. The final figure stays in the layout, invisible, so
 *  the box around it never moves. */
export function CountUp({ to, ms = 900 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  // Cell widths in px while counting, and the final figure's own widths once
  // it lands; null draws the plain figure, as the server does.
  const [cells, setCells] = useState<{ count: number[]; rest: number[] } | null>(null);
  const [landed, setLanded] = useState(false);
  const final = fmt(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen or scrolled past: the reader has seen the number.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    // Measured in the element itself, so its face, size and tracking apply.
    const width = (ch: string) => {
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
      probe.textContent = ch;
      el.append(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      return w;
    };
    const widest = Math.max(...[..."0123456789"].map(width));
    const rest = [...final].map(width);
    const count = [...final].map((ch, i) => (/\d/.test(ch) ? widest : rest[i]));
    setCells({ count, rest });
    setN(0);

    let frame = 0;
    let settle = 0;
    const io = viewportObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / ms);
          setN(Math.round(to * (1 - (1 - t) ** 3)));
          if (t < 1) frame = requestAnimationFrame(step);
          else {
            setLanded(true);
            // Once the cells have eased to the figure's own widths, the
            // plain figure takes their place, kerned as the server drew it.
            settle = window.setTimeout(() => setCells(null), 550);
          }
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      setCells(null);
      setLanded(false);
      setN(to);
    };
  }, [to, ms, final]);

  // The count's characters laid right to left into the final figure's slots:
  // a slot the count has not reached yet stays empty.
  const shown = fmt(n);
  const slots = [...final].map((_, i) => shown[shown.length - (final.length - i)] ?? "");

  return (
    <span ref={ref} className="inline-grid justify-items-center">
      <span className="invisible col-start-1 row-start-1">{final}</span>
      {cells ? (
        <span className="col-start-1 row-start-1 flex whitespace-nowrap">
          {slots.map((ch, i) => (
            <span
              key={i}
              className="inline-block text-center transition-[width] duration-sheet ease-sheet motion-reduce:transition-none"
              style={{ width: (landed ? cells.rest : cells.count)[i] }}
            >
              {ch}
            </span>
          ))}
        </span>
      ) : (
        <span className="col-start-1 row-start-1">{final}</span>
      )}
    </span>
  );
}
