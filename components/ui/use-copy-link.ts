"use client";

import { useEffect, useRef, useState } from "react";

export type CopyState = "idle" | "copied" | "manual";

/** A button that copies a link, and says what happened. Three outcomes, each
 *  shown: the clipboard took it; the older command took it; or neither
 *  would, and the caller shows the link selected in a field for the reader's
 *  own keys. A button that swallows a refusal is a button that does nothing.
 *  Two calculators use it, /teach's and /pricing's. */
export function useCopyLink() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);
  /** The fallback field; it is selected as it appears. */
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (state === "manual") field.current?.select();
  }, [state]);

  const copy = async (url: string) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      const area = document.createElement("textarea");
      area.value = url;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(area);
      area.select();
      ok = document.execCommand("copy");
      area.remove();
    }
    setState(ok ? "copied" : "manual");
    window.clearTimeout(timer.current);
    if (ok) timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  /** Back to rest, when what the link carries changes under it. */
  const reset = () => setState("idle");

  return { state, copy, reset, field };
}
