"use client";

import { useSyncExternalStore } from "react";
import { localToday } from "@/components/course-page/start";

const never = () => () => {};

/** Today as the visitor's own clock has it, and as the server's did while the
 *  page renders and hydrates, so the first frame and the markup agree. */
export function useToday(server: string) {
  return useSyncExternalStore(never, localToday, () => server);
}
