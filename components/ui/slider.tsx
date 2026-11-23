"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function SliderRoot<Value extends number | readonly number[]>({
  className,
  ...props
}: SliderPrimitive.Root.Props<Value>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

// Base UI wires the label to the thumb's own input, so the reading stays
// correct without an `htmlFor` that has to be kept in step with an id.
function SliderLabel({ className, ...props }: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("text-sm tabular-nums", className)}
      {...props}
    />
  )
}

// `touch-none` is the whole reason a drag works on a phone: without it the
// browser claims the gesture for scrolling the page and the thumb never moves.
// The control names a group, so pointing anywhere on the rail — where a click
// also lands the thumb — lights the thumb, not only pointing at the thumb.
function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn(
        "group/slider flex w-full touch-none select-none items-center py-2 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

// Contrast: the track (bg-muted) is 1.1:1 on the page and the filled part
// (bg-primary) 1.3:1 against the track, under WCAG's 3:1 for a graphic. Every
// slider on the site prints its value in words beside it.
function SliderTrack({ className, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn("h-2 w-full rounded-full bg-muted", className)}
      {...props}
    />
  )
}

function SliderIndicator({
  className,
  ...props
}: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn("block h-full rounded-full bg-primary data-[disabled]:bg-foreground/20", className)}
      {...props}
    />
  )
}

// Locked, a slider sinks rather than fades: the taken part goes to a pale ink
// and the thumb to the resting fill, and nothing answers the pointer.
// A track drawn in steps, for a slider over a few whole values: one dash a
// step, the steps taken in the brand hue and the rest a pale ink, as sunk as a
// locked choice, so the reader counts what they chose against what is still
// there. It stands in for the indicator, on a track given no fill of its own
// (`bg-transparent`). Each dash spans one step less 2px a side, so the thumb
// always stands on the seam between the last one taken and the next.
function SliderSteps({
  value,
  min,
  max,
  step = 1,
  className,
}: {
  value: number
  min: number
  max: number
  step?: number
  className?: string
}) {
  const n = Math.round((max - min) / step)
  const taken = Math.round((value - min) / step)
  return (
    <span
      aria-hidden="true"
      data-slot="slider-steps"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={cn(
            "absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-colors",
            i < taken ? "bg-primary group-data-[disabled]/slider:bg-foreground/20" : "bg-foreground/10"
          )}
          style={{ left: `calc(${(i / n) * 100}% + 2px)`, width: `calc(${100 / n}% - 4px)` }}
        />
      ))}
    </span>
  )
}

// Drawn at 24px rather than the 16 shadcn ships: a 16px dot reads as unfinished
// on a page this airy, and it is short on both axes against the 40px hit floor.
// The reach comes from the pseudo-element, so meeting that floor never moves
// the drawn edge. Raised off the surface, so it takes the depth rule for a
// raised control — `bg-card` and a soft shadow, no border.
// Pointed at or dragged, it lifts and takes a 3px outline in the brand's pale
// tint, the `chip` token, so the outline stays a whisper whatever the brand is
// — its alpha follows how dark the brand runs. Thin, so it keeps the token's
// full alpha: any paler and it goes out over the grey rail.
// Tab lands on the range input Base UI hides inside the thumb, and the global
// `:focus-visible` outline in `globals.css` is clipped away with it, so the
// thumb draws that same ring itself — 2px of `--ring`, 2px out — whenever its
// input has keyboard focus.
function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        "size-6 rounded-full bg-fixed-light shadow-soft transition-shadow data-[disabled]:bg-muted data-[disabled]:shadow-none",
        "after:absolute after:-inset-2 after:content-['']",
        "hover:shadow-soft-lg group-hover/slider:shadow-soft-lg data-[dragging]:shadow-soft-lg",
        "group-hover/slider:ring-3 group-hover/slider:ring-chip data-[dragging]:ring-3 data-[dragging]:ring-chip",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        className
      )}
      {...props}
    />
  )
}

// A scrubber drawn over a field — a waveform, a dot matrix — has no rail to
// stand a disc on, so its thumb is the playhead the field is already split at:
// a hairline the height of the control with a small head above it. Colour comes
// from `currentColor`, so a dark tile sets `text-background` once and both
// parts follow. A 1px line cannot be grabbed, so the whole hit area is the
// pseudo-element. Its focus is the thumb's: the ring drawn round the line.
function SliderPlayhead({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-playhead"
      className={cn(
        "h-full w-px",
        "after:absolute after:-inset-x-3 after:-inset-y-1 after:content-['']",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 bg-current opacity-40" />
      <span className="absolute -top-1 left-1/2 size-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-current opacity-70" />
    </SliderPrimitive.Thumb>
  )
}

// The whole control, for the common case: a rail, the played part in the brand
// hue, one thumb. A section that draws its own track — a waveform, a dot field
// — composes the parts instead and keeps this one out of it.
function Slider({
  className,
  ...props
}: Omit<SliderPrimitive.Root.Props<number>, "children">) {
  return (
    <SliderRoot className={className} {...props}>
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
          <SliderThumb />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  )
}

export {
  Slider,
  SliderControl,
  SliderLabel,
  SliderPlayhead,
  SliderValue,
  SliderIndicator,
  SliderRoot,
  SliderSteps,
  SliderThumb,
  SliderTrack,
}
