import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A field somebody types into, one look for every form on the site: the
 *  /teach application and the checkout. A hairline at rest that darkens under
 *  the pointer, the brand's 2px line when focused, and a red line while it is
 *  in error, a step wider when that field has focus, so the one being fixed
 *  stands out from the others still wrong.
 *
 *  The error stands on the label's line, so a field in error grows no line
 *  and the button under the form stays under the pointer that pressed it.
 *  While it is not in error, that line's far end can carry a word about the
 *  field: that it may be left empty, or the network a card number belongs
 *  to. */
export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  aside,
  type = "text",
  multiline,
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  spellCheck,
  autoCapitalize,
  leading,
  trailing,
  onKeyUp,
  className,
}: {
  id: string;
  /** The key the value is sent under when the form is submitted. */
  name?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: ReactNode;
  /** Read at the label line's far end while the field is not in error:
   *  "Optional", or the network a card number belongs to. Never a control. */
  aside?: ReactNode;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  maxLength?: number;
  spellCheck?: boolean;
  autoCapitalize?: string;
  /** A glyph inside the field's left end, drawn at 20px. */
  leading?: ReactNode;
  /** A control inside the field's right end, 32px tall so it sits in the
   *  40px field with 4px round it: a password's Show. */
  trailing?: ReactNode;
  /** Read by a password field, to tell a reader their Caps Lock is on. */
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  const described = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  const ring = cn(
    "w-full rounded-control bg-card px-4 text-base outline-none ring-inset transition-shadow placeholder:text-muted-foreground sm:text-sm",
    error
      ? "ring-2 ring-destructive focus:ring-[3px]"
      : "ring-1 ring-border enabled:hover:not-focus:ring-foreground/20 focus:ring-2 focus:ring-ring",
    leading && "pl-11",
    trailing && "pr-20",
  );
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
        {error ? (
          <p id={`${id}-error`} className="text-sm text-destructive">
            {error}
          </p>
        ) : (
          aside && <span className="text-sm text-muted-foreground">{aside}</span>
        )}
      </div>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          rows={3}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={described}
          className={cn(ring, "min-h-24 resize-none py-2.5 [field-sizing:content]")}
        />
      ) : (
        <div className="relative">
          {leading && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground"
            >
              {leading}
            </span>
          )}
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            autoComplete={autoComplete}
            inputMode={inputMode}
            placeholder={placeholder}
            maxLength={maxLength}
            // an address is not a word: no red line under every email
            spellCheck={spellCheck ?? (type === "email" ? false : undefined)}
            autoCapitalize={autoCapitalize}
            onKeyUp={onKeyUp}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={described}
            className={cn(ring, "h-10")}
          />
          {trailing && <span className="absolute inset-y-1 right-1 flex">{trailing}</span>}
        </div>
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
