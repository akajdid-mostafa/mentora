"use client";

import { useEffect } from "react";
import { recordView } from "@/components/course/recent";

/** Puts the course at the top of the visitor's recently viewed list, however
 *  they arrived — a card, a search, a link somebody sent — so the catalogue's
 *  deck is the history of pages opened rather than of cards pressed. */
export function RecordView({ id }: { id: string }) {
  useEffect(() => recordView(id), [id]);
  return null;
}
