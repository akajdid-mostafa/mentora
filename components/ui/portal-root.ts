"use client";

import { useSyncExternalStore } from "react";

// Where a popup mounts: the element that holds the page's header, content and
// footer rather than <body>. A popup mounted in <body> escapes any wrapper
// that sets the page's tokens (the build's switch does, while it is up), and
// comes out in the root's face, radius and hue instead of the page's. Once no
// wrapper is left this is <body> itself, so nothing changes for a buyer.
const find = () => document.getElementById("content")?.parentElement ?? null;
const never = () => () => {};

export function usePortalRoot() {
  return useSyncExternalStore(never, find, () => null);
}
