"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { usePortalRoot } from "@/components/ui/portal-root";
import { cn } from "@/lib/utils";

// A list of actions on one thing, opened from a button beside it: the studio's
// lesson cards and draft rows. Dressed as the Select's popup is, the same
// corner, padding, cast and 40px rows, so a list that picks a value and a
// list that does something read as one family.

const Menu = MenuPrimitive.Root;
const MenuTrigger = MenuPrimitive.Trigger;

function MenuContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 6,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset">) {
  // Mounted beside the page rather than in <body>, so the list is set in the
  // page's own face and radius, as every popup here is.
  const root = usePortalRoot();
  return (
    <MenuPrimitive.Portal container={root}>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={16}
        className="isolate z-50 outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          className={cn(
            "no-scrollbar max-h-(--available-height) min-w-52 origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover p-1.5 text-popover-foreground shadow-soft-lg outline-none",
            "transition-[scale,opacity] duration-spring ease-spring data-ending-style:duration-answer data-ending-style:ease-answer data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

// The highlight is data-highlighted, as on the Select's rows: Base UI keeps
// focus on the popup and marks the active row with an attribute.
// A destructive row stays in ink: the page's colours are the brand and the
// secondary, and the undo line that follows a delete is what makes it safe.
function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      className={cn(
        "flex min-h-10 cursor-default items-center gap-2.5 rounded-sm px-3 py-2 text-sm outline-none select-none data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-px bg-border", className)} {...props} />;
}

function MenuGroup(props: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group {...props} />;
}

function MenuGroupLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return <MenuPrimitive.GroupLabel className={cn("px-3 pt-2 pb-1 text-xs text-muted-foreground", className)} {...props} />;
}

export { Menu, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger };
