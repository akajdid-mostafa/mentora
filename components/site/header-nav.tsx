"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Target02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { under } from "@/components/site/header-search";
import type { Nav } from "@/components/site/nav";
import { AiIcon } from "@/components/ui/ai-icon";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

// A bar item, a trigger or a plain link alike. An open trigger rests on the
// tint its hover would give it, so the item says which menu is showing.
const item = cn(
  "relative flex h-10 items-center gap-1 rounded-control px-3 text-sm",
  "text-muted-foreground hover:bg-accent hover:text-foreground",
  "data-popup-open:bg-accent data-popup-open:text-foreground",
  // the page the visitor is on, in the full ink; Base UI sets aria-current on
  // a link that is given `active`
  "aria-[current=page]:text-foreground",
);

// A row inside a panel: the reference's tinted hover, inset from the panel's
// edge by the panel's padding and rounded 6px under it. Keyboard focus takes
// the same tint and draws its ring inside the row, where the panel's clipping
// cannot cut it off.
const row = cn(
  "group/row flex h-10 items-center gap-3 rounded-[calc(var(--radius-lg)-6px)] px-3 text-sm",
  "transition-colors hover:bg-accent active:bg-muted focus-visible:bg-accent focus-visible:-outline-offset-2",
  // the page the visitor is on: `active` sets aria-current and this weight
  "aria-[current=page]:font-medium",
);

// The panel that is leaving slides out the way the pointer came from and the
// one arriving slides in behind it, so moving along the bar reads as moving
// along a strip rather than as three popups opening in turn.
const content = cn(
  "w-max p-2 transition-[opacity,translate] duration-(--duration) ease-(--easing)",
  "data-starting-style:opacity-0 data-ending-style:opacity-0",
  "data-starting-style:data-[activation-direction=left]:-translate-x-8",
  "data-starting-style:data-[activation-direction=right]:translate-x-8",
  "data-ending-style:data-[activation-direction=left]:translate-x-8",
  "data-ending-style:data-[activation-direction=right]:-translate-x-8",
  "motion-reduce:transition-none",
);

function MenuLink({
  href,
  prefetch,
  className,
  children,
}: {
  href: string;
  prefetch?: false;
  className?: string;
  children: ReactNode;
}) {
  const active = usePathname() === href;
  return (
    <NavigationMenu.Link
      href={href}
      active={active}
      closeOnClick
      render={<NextLink href={href} prefetch={prefetch} />}
      className={cn(row, className)}
    >
      {children}
    </NavigationMenu.Link>
  );
}

/** The page's one AI mark, at the size of a count. */
function Ai({ className }: { className?: string }) {
  return (
    <Caps
      as="span"
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1 rounded-control bg-iris/15 px-1.5 text-iris-ink",
        className,
      )}
    >
      <AiIcon size={12} />
      AI
    </Caps>
  );
}

function Trigger({ children }: { children: ReactNode }) {
  return (
    // A trigger stays put under a press, since the panel hangs from it, so the
    // press moves its fill a rung down instead, open or not.
    <NavigationMenu.Trigger
      className={cn(item, "pr-2.5 transition-colors active:bg-muted data-popup-open:active:bg-muted")}
    >
      {children}
      <NavigationMenu.Icon className="transition-transform data-popup-open:rotate-180 motion-reduce:transition-none">
        <ChevronDownIcon aria-hidden="true" className="size-4" />
      </NavigationMenu.Icon>
    </NavigationMenu.Trigger>
  );
}

/** A column of a panel: its caption over its rows. */
function Column({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="px-2 pb-1 pt-3">
      <Caps className="px-3">{heading}</Caps>
      <ul className="mt-2">{children}</ul>
    </div>
  );
}

/** The bar's nav from lg up: three menus and two links. One popup serves all
 *  three menus and takes each one's size as the pointer moves along the bar,
 *  and it is portalled into the bar itself, so it rides the sticky header
 *  down the page instead of being left behind at the top of it. */
export function HeaderNav({
  bar,
  nav,
  className,
}: {
  bar: HTMLElement | null;
  nav: Nav;
  className?: string;
}) {
  const path = usePathname();
  const { explore, subjects, credentials, courseTotal, coursesFoot, paths, ownGoal, links } = nav;
  return (
    <NavigationMenu.Root aria-label="Main" delay={80} closeDelay={120} className={className}>
      <NavigationMenu.List className="flex items-center gap-0.5">
        <NavigationMenu.Item value="explore">
          <Trigger>Explore</Trigger>
          <NavigationMenu.Content className={content}>
            {/* every route, a column per kind, split by the reference's
                full-height hairlines */}
            <div className="grid w-[50rem] grid-cols-4 divide-x divide-border py-1">
              {explore.map((g) => (
                <Column key={g.heading} heading={g.heading}>
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <MenuLink href={l.href} prefetch={l.prefetch}>
                        {l.label}
                        {l.count && (
                          <span className="ml-auto tabular-nums text-muted-foreground">
                            {l.count}
                          </span>
                        )}
                        {l.ai && <Ai className="ml-auto" />}
                      </MenuLink>
                    </li>
                  ))}
                </Column>
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="courses">
          <Trigger>Courses</Trigger>
          <NavigationMenu.Content className={content}>
            <div className="w-[33rem]">
              <div className="grid grid-cols-2 divide-x divide-border py-1">
                <Column heading="Subjects">
                  {subjects.map((s) => (
                    <li key={s.label}>
                      <MenuLink href={s.href}>
                        {/* the hue the subject's cards wear on the shelf */}
                        <HugeiconsIcon
                          icon={s.icon}
                          size={18}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className={s.tint.ink}
                        />
                        {s.label}
                        <span className="ml-auto tabular-nums text-muted-foreground">
                          {s.count}
                        </span>
                      </MenuLink>
                    </li>
                  ))}
                </Column>
                <Column heading="Credentials">
                  {credentials.map((c) => (
                    <li key={c.label}>
                      <MenuLink href={c.href}>{c.label}</MenuLink>
                    </li>
                  ))}
                </Column>
              </div>
              {/* the catalogue whole, on a strip of its own: the trigger is a
                  button, so this is where the bar's Courses link went */}
              <div className="mt-2 flex items-center justify-between gap-6 rounded-[calc(var(--radius-lg)-6px)] bg-accent py-1 pl-1 pr-4">
                <MenuLink href="/courses" className="gap-2 font-medium hover:bg-muted active:bg-secondary focus-visible:bg-muted">
                  All {courseTotal} courses
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </MenuLink>
                <p className="text-sm text-muted-foreground">{coursesFoot}</p>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item value="paths">
          <Trigger>Paths</Trigger>
          <NavigationMenu.Content className={content}>
            <ul className="w-72">
              {paths.map((p) => (
                <li key={p.href}>
                  <MenuLink href={p.href}>
                    <HugeiconsIcon
                      icon={p.icon}
                      size={18}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="text-muted-foreground transition-colors group-hover/row:text-foreground"
                    />
                    {p.label}
                    <span className="ml-auto tabular-nums text-muted-foreground">
                      {p.hours}
                    </span>
                  </MenuLink>
                </li>
              ))}
              {/* the reference's one rule, across the panel's full width */}
              <li aria-hidden="true" className="-mx-2 my-2 h-px bg-border" />
              <li>
                <MenuLink href={ownGoal.href}>
                  <HugeiconsIcon
                    icon={Target02Icon}
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-muted-foreground transition-colors group-hover/row:text-foreground"
                  />
                  {ownGoal.label}
                  <Ai className="ml-auto" />
                </MenuLink>
              </li>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {links.map((l) => (
          <NavigationMenu.Item key={l.href}>
            <NavigationMenu.Link
              href={l.href}
              active={l.href === path}
              render={<NextLink href={l.href} />}
              className={cn(item, "press")}
            >
              {l.label}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <NavigationMenu.Portal container={bar}>
        <NavigationMenu.Positioner
          side="bottom"
          align="start"
          sideOffset={() => under(bar)}
          collisionPadding={{ top: 8, right: 24, bottom: 16, left: 24 }}
          collisionAvoidance={{ side: "none" }}
          className={cn(
            "z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
            "transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) data-instant:transition-none motion-reduce:transition-none",
            // a bridge over the gap under the bar, so the pointer can travel
            // from a trigger to its panel without the menu closing on the way
            "before:absolute before:inset-x-0 before:bottom-full before:h-6 before:content-['']",
          )}
          style={
            {
              "--duration": "0.3s",
              "--easing": "var(--ease-answer)",
            } as CSSProperties
          }
        >
          <NavigationMenu.Popup
            className={cn(
              "relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow-soft-lg outline-none",
              "transition-[opacity,scale,width,height] duration-(--duration) ease-(--easing)",
              "data-starting-style:scale-[0.98] data-starting-style:opacity-0",
              "data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer",
              "motion-reduce:transition-none",
            )}
          >
            <NavigationMenu.Viewport className="relative size-full overflow-hidden rounded-[inherit]" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
