"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
// Not the lucide set shadcn generates: the chevrons are Heroicons' outline
// ones, as every other chevron on the site, and the picked row's tick is
// HugeIcons', as the site's other picked lists draw it.
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePortalRoot } from "@/components/ui/portal-root"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

// A trigger's hairline, its focus and its open state, as one ring: 1px of the
// border colour at rest, 2px of the ring's colour when focused or open, inset
// both times so the box never grows. The hand-built fields draw the same two
// rings, `ring-1 ring-border` resting and `ring-2 ring-ring` focused.
const triggerRing =
  "outline-none ring-1 ring-inset ring-border focus-visible:ring-2 focus-visible:ring-ring data-[popup-open]:ring-2 data-[popup-open]:ring-ring"

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  /** `field` is the trigger inside a form, beside hand-built text fields:
   *  their height, their 16px value on a phone, where a smaller one would
   *  sit a size under the fields around it, and their hover, the hairline
   *  darkening on white rather than the fill turning grey. */
  size?: "sm" | "default" | "field"
}) {
  return (
    // Dressed as the page's other fields rather than as shadcn's outline: a
    // white fill on the page's own hairline, the way the hero search and the
    // newsletter input sit, with the 16px inline the filter chips take at the
    // same height. The chevron side takes 12, since the glyph's own box
    // already carries air on that side.
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "group flex w-fit items-center justify-between gap-1.5 rounded-control bg-card py-2 pr-3 pl-4 text-sm whitespace-nowrap transition-colors hover:bg-accent select-none disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-card aria-invalid:ring-2 aria-invalid:ring-destructive data-placeholder:text-muted-foreground data-[size=default]:h-10 data-[size=sm]:h-10 data-[size=sm]:rounded-control data-[size=field]:h-10 data-[size=field]:text-base data-[size=field]:hover:bg-card data-[size=field]:enabled:hover:not-focus-visible:not-data-[popup-open]:ring-foreground/20 sm:data-[size=field]:text-sm *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        triggerRing,
        className
      )}
      {...props}
    >
      {children}
      {/* data-popup-open, not data-open: Base UI marks the trigger of an open
          popup with its own attribute, and the group- prefix reads it off the
          trigger this icon sits inside. No pointer-events-none of its own:
          the trigger's [&_svg] already sets it, and on an aria-hidden svg the
          class is what mark-visibility.py takes for a drawn mark. */}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180 motion-reduce:transition-none" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

/** The trigger as a word of a heading: "More instructors in Data ▾". It takes
 *  the heading's size and its one ink, says it is a control with an underline
 *  and a chevron, and answers the pointer with the soft tint, on the
 *  control's own corner. Its padding is taken back by its margins, so the word
 *  keeps its place in the line. The chevron is the one here drawn to the type
 *  rather than at `size-4`: a third of the letter's height, as a heading's
 *  dropdown draws it, since 16px beside 48px type reads as a speck. */
function SelectTriggerInline({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-variant="inline"
      className={cn(
        "group/inline -mx-1.5 inline-flex items-center gap-1.5 rounded-control px-1.5 underline decoration-foreground/25 decoration-2 underline-offset-[0.18em] outline-none transition-colors hover:bg-accent hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring data-[popup-open]:bg-accent data-[popup-open]:decoration-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            strokeWidth={2}
            className="size-[0.55em] shrink-0 transition-transform group-data-[popup-open]/inline:rotate-180 motion-reduce:transition-none"
          />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  label,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    /** The list's accessible name, the same words as the trigger's label:
     *  Base UI names the trigger but leaves the listbox it opens unnamed. */
    label?: string
  }) {
  // Mounted beside the page rather than in <body>, so the list is set in the
  // page's own face and radius — see portal-root.ts.
  const root = usePortalRoot()
  return (
    <SelectPrimitive.Portal container={root}>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        // the page's own 16px gutter, so a list opened near the edge of a
        // phone keeps the margin every other block on it keeps
        collisionPadding={16}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1.5 no-scrollbar bg-popover text-popover-foreground shadow-soft-lg duration-answer ease-answer data-open:duration-spring data-open:ease-spring data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List aria-label={label}>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-3 pt-2 pb-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// The label of the whole control, which Base UI wires to the trigger and which
// focuses it when clicked — not SelectLabel above, which heads a group inside
// the popup. A form field's label, so sentence case at 14px.
function SelectFieldLabel({
  className,
  ...props
}: SelectPrimitive.Label.Props) {
  return (
    <SelectPrimitive.Label
      data-slot="select-field-label"
      className={cn("text-sm text-muted-foreground select-none", className)}
      {...props}
    />
  )
}

// Two additions to what shadcn generates, both for a list that counts what
// each row holds, as the catalogue's filters do: `indicator` moves the tick to
// the row's leading edge, where a glyph can stand, and `trailing` renders
// outside ItemText. Anything inside ItemText is cloned into the trigger, so a
// per-row count put there would show up beside the chosen value.
//
// The highlight is data-highlighted rather than the registry's focus:. Base UI
// keeps DOM focus on the popup and marks the active row with an attribute, so
// a focus: rule here would never paint.
function SelectItem({
  className,
  children,
  indicator = "end",
  trailing,
  ...props
}: SelectPrimitive.Item.Props & {
  indicator?: "start" | "end"
  trailing?: React.ReactNode
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-sm py-2.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // 40px rows, the floor every other control here stands on, and the
        // label 12px in from the highlight's 14px corner rather than 6.
        indicator === "start" ? "pr-3 pl-8" : "pr-8 pl-3",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute flex size-4 items-center justify-center",
          indicator === "start" ? "left-2" : "right-2"
        )}
      >
        <SelectPrimitive.ItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={1.5} className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {trailing}
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectTriggerInline,
  SelectValue,
  triggerRing,
}
