"use client";

import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toggleFollow, useFollowing } from "@/components/course/following";
import { cn } from "@/lib/utils";

/** Follow, with the words on it, drawn as the block's secondary button: a
 *  muted fill that darkens a rung under the pointer. Following is a selected
 *  state, so it fills with the brand and the plus turns to a tick, as the
 *  home page's instructor cards do; both read one list, so a teacher
 *  followed there is followed here.
 *
 *  `lead` is the profile page's, where Follow is the page's own action: the
 *  brand's fill until it is pressed, and the muted one once it has done its
 *  work, as a call to action that has been answered steps back. */
export function FollowButton({
  name,
  tone = "quiet",
  className,
}: {
  name: string;
  tone?: "quiet" | "lead";
  className?: string;
}) {
  const on = useFollowing().includes(name);
  const first = name.split(" ")[0];
  // Filled in the brand while following, or, for the lead tone, while not.
  const look =
    tone === "lead"
      ? "not-aria-pressed:bg-primary not-aria-pressed:text-primary-foreground not-aria-pressed:hover:bg-primary/80 aria-pressed:bg-muted aria-pressed:hover:bg-secondary"
      : "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80 not-aria-pressed:bg-muted not-aria-pressed:hover:bg-secondary";
  // Both labels stand in one cell and the one not in use is hidden, so the
  // button keeps the longer one's width and nothing beside it moves when the
  // label changes. Under 360px the name is heard and not drawn, so Share
  // keeps the row beside a long one.
  const label = "col-start-1 row-start-1 flex items-center gap-2";
  return (
    <button
      type="button"
      onClick={() => toggleFollow(name)}
      aria-pressed={on}
      className={cn(
        "group/follow grid h-10 place-items-center rounded-control px-5 text-sm font-medium press",
        look,
        className,
      )}
    >
      <span className={cn(label, "group-aria-pressed/follow:invisible")}>
        <PlusIcon aria-hidden="true" className="size-4" />
        <span>
          Follow
          <span className="max-[359px]:sr-only"> {first}</span>
        </span>
      </span>
      <span className={cn(label, "not-group-aria-pressed/follow:invisible")}>
        <CheckIcon aria-hidden="true" className="size-4" />
        <span>
          Following
          <span className="max-[359px]:sr-only"> {first}</span>
        </span>
      </span>
    </button>
  );
}
