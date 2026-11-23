"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Copy01Icon,
  Location01Icon,
  Loading03Icon,
  Mail01Icon,
  SmartPhone01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HugeiconsIcon } from "@hugeicons/react";
import { face, teamCopy } from "@/components/about/copy";
import { learner } from "@/components/dashboard/learner";
import {
  MESSAGE_MAX,
  MESSAGE_MIN,
  deskNames,
  formCopy,
  topicsFor,
  type Role,
} from "@/components/contact/copy";
import { contactLines, nextOpening, onShift, replyMinutes, span, whenFrom, clock } from "@/components/contact/desks";
import { useClock } from "@/components/contact/use-clock";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabTrack } from "@/components/ui/tab-track";
import { TextField } from "@/components/ui/text-field";
import { cn, hash } from "@/lib/utils";

// Hotlinked from Lummi, as the site's other Lummi photographs are; the page's
// slug is the licence record, and public/photos/CREDITS.md lists it. A white
// wall over a white table, a vase of dried flowers and a cup on a tray low at
// the right: the words take the empty wall, and the table keeps the foot.
const PHOTO = "https://assets.lummi.ai/assets/QmXxSFwoBUHRPW4XohFAVy2TqDt6TT3em6VTFMbAX2jFnY?auto=format&w=1600";

type Values = { name: string; email: string; role: Role; topic: string; message: string };
type Key = "name" | "email" | "message";

const valid: Record<Key, (v: Values) => boolean> = {
  name: (v) => v.name.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()),
  message: (v) => v.message.trim().length >= MESSAGE_MIN,
};
const ORDER: Key[] = ["name", "email", "message"];

const resting: Values = {
  name: learner.name,
  email: learner.email,
  role: formCopy.resting.role,
  topic: formCopy.resting.topic,
  message: formCopy.resting.message,
};

// Who a message is for when it is not a desk: one of the people on the about
// page, or the hiring team behind its open roles. Both answer within two days.
type Recipient = { name: string; first?: string; line: string; face?: string; route: string };
const TWO_DAYS = 2 * 24 * 60;

type Asked = Record<string, string | string[] | undefined>;
const one = (x: string | string[] | undefined) => (Array.isArray(x) ? x[0] : x);

/** What a link from elsewhere on the site asks the form to open on:
 *  `?person=` a profile's slug, `?topic=careers` the hiring tile, and
 *  `?topic=teams&seats=` the pricing page's quote. Anything else, or a slug
 *  that names nobody, opens the form at rest. */
function opening(asked: Asked): { values: Values; to: Recipient | null } {
  const a = formCopy.asked;
  const p = teamCopy.people.find((x) => x.slug === one(asked.person));
  if (p) {
    return {
      values: { ...resting, message: a.person(p.first, p.askAbout[0]) },
      to: { name: p.name, first: p.first, line: p.role, face: p.face, route: a.personRoute(p.first) },
    };
  }
  if (one(asked.topic) === "careers") {
    return { values: { ...resting, message: a.careers }, to: { ...a.hiring, route: a.hiringRoute } };
  }
  const seats = Math.round(Number(one(asked.seats)));
  if (one(asked.topic) === "teams") {
    return {
      values: {
        ...resting,
        role: "team",
        topic: "quote",
        message: Number.isFinite(seats) && seats > 0 ? a.seats(seats) : resting.message,
      },
      to: null,
    };
  }
  return { values: resting, to: null };
}

/** The page's opening: a photograph carrying the promise and the three ways
 *  in that are not a form, beside the form itself. The message goes to the
 *  desk its topic belongs to, and the line under the topic says which and
 *  how soon before anything is sent; a message addressed from another page
 *  goes to its person instead, named on a card where the topic would be. */
export function MessageForm({ now: serverNow, asked = {} }: { now: string; asked?: Asked }) {
  const c = formCopy;
  const id = useId();
  const { now, tz, live } = useClock(serverNow);
  const [start] = useState(() => opening(asked));
  const [v, setV] = useState<Values>(start.values);
  const [to, setTo] = useState<Recipient | null>(start.to);
  const [shown, setShown] = useState<Key[]>([]);
  const [state, setState] = useState<"form" | "sending" | "done">("form");
  const [sent, setSent] = useState<{ at: number; ticket: string } | null>(null);
  const doneHeading = useRef<HTMLSpanElement>(null);
  const land = useRef<"done" | "form" | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const sending = state === "sending";
  const done = state === "done";

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (land.current === "done") doneHeading.current?.focus();
    if (land.current === "form") document.getElementById(`${id}-name`)?.focus();
    land.current = null;
  }, [state, id]);

  const topics = topicsFor[v.role];
  const topic = topics.find((t) => t.id === v.topic) ?? topics[0];
  const set = <K extends keyof Values>(k: K, value: Values[K]) => setV((was) => ({ ...was, [k]: value }));
  const error = (k: Key) => (shown.includes(k) && !valid[k](v) ? c.errors[k] : undefined);

  const pickRole = (role: Role) =>
    setV((was) => ({
      ...was,
      role,
      // a topic from another writer's list has no desk here, so the list
      // opens on its own first question
      topic: topicsFor[role].some((t) => t.id === was.topic) ? was.topic : topicsFor[role][0].id,
    }));

  const send = () => {
    if (sending) return;
    const bad = ORDER.filter((k) => !valid[k](v));
    if (bad.length) {
      setShown(bad);
      document.getElementById(`${id}-${bad[0]}`)?.focus();
      return;
    }
    setShown([]);
    setState("sending");
    const at = Date.now();
    // Five digits read off what was written and when, so two messages in a
    // row get two numbers and one message keeps its own.
    const ticket = `WP-${String(hash(`${v.email}${v.message}${at}`) % 90000 + 10000)}`;
    timer.current = window.setTimeout(() => {
      setSent({ at, ticket });
      land.current = "done";
      setState("done");
    }, 900);
  };

  const again = () => {
    setV({ ...resting, message: "" });
    setTo(null);
    setSent(null);
    land.current = "form";
    setState("form");
  };

  // The promise under the heading: who has the chat right now, or when it
  // opens again, in the visitor's own time once the page knows it.
  const shift = onShift("learners", now);
  const next = shift ? null : nextOpening("learners", now);
  const promise = shift
    ? c.onShift(shift.city)
    : next
      ? c.offShift(live ? whenFrom(now, next.when, tz) : clock(next.when, "UTC"))
      : "";
  const faq = topic.faq;

  return (
    <section id="write" className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-8 sm:pt-14">
      <div className="grid grid-cols-1 gap-2 rounded-lg bg-accent p-2 lg:grid-cols-2 [&>*]:min-w-0">
        {/* The photograph's half. The words stand on its white wall in the
            page's own ink, and the table keeps the foot. Each width's crop is
            the one that keeps the most of the vase and the tray while neither
            reaches the contact lines. A phone's frame is too narrow for that
            and takes the tray whole at the table's middle instead, a few of
            the pale dried stems at its right edge. The wall is white in both
            halves, so the ink on it is the fixed one rather than the page's. */}
        <div className="relative isolate flex min-h-[36rem] flex-col overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] bg-muted px-6 pt-10 pb-56 text-fixed-dark sm:px-12 sm:pt-12 lg:min-h-0">
          <Image
            src={PHOTO}
            alt="A white table against a white wall, a vase of dried flowers and a cup on a small tray"
            fill
            preload
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 94vw"
            className="-z-10 object-cover object-[52%_bottom] sm:object-[60%_bottom] lg:object-[50%_bottom] xl:object-[70%_bottom]"
          />

          <h1 className="max-w-md text-4xl tracking-tighter sm:text-5xl">
            {c.heading.before} <Highlight>{c.heading.marked}</Highlight> {c.heading.after}
          </h1>
          {/* one line for the chat and one for email, each whole, so a
              change of shift never reflows the block under it */}
          <p className="mt-6 max-w-sm text-base">
            <span className="flex items-start gap-2.5">
              <span aria-hidden="true" className="relative mt-2 flex size-2 shrink-0">
                {shift && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                )}
                {/* the brand's ink, mixed from the lime and the fixed ink rather than
                    read from --primary-ink, which turns lime in the dark half
                    and would vanish into the white wall behind it */}
                <span
                  className={cn(
                    "relative size-2 rounded-full",
                    shift ? "bg-[color-mix(in_oklab,var(--primary)_40%,var(--fixed-dark))]" : "bg-fixed-dark/40",
                  )}
                />
              </span>
              <span>{promise}</span>
            </span>
            <span className="mt-1 block pl-[1.125rem]">{c.mailReply}</span>
          </p>

          <ul className="mt-9 flex flex-col gap-3">
            <ContactRow icon={Mail01Icon} href={`mailto:${contactLines.email}`}>
              {/* the address runs 24px past a 320px card, so it may break
                  after the @ and nowhere else */}
              {contactLines.email.split("@")[0]}@<wbr />
              {contactLines.email.split("@")[1]}
            </ContactRow>
            <ContactRow icon={SmartPhone01Icon} href={contactLines.phoneHref}>
              {contactLines.phone}
            </ContactRow>
            <ContactRow icon={Location01Icon} href="#offices">
              {c.officesLine}
            </ContactRow>
          </ul>
        </div>

        {/* The form's half: the form and the ticket share one cell, so the
            card keeps the taller one's height and nothing moves on Send. */}
        <div className="grid grid-cols-1 rounded-[calc(var(--radius-lg)-0.5rem)] bg-card px-6 py-10 sm:px-12 sm:py-12">
          <form
            noValidate
            inert={done}
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className={cn("flex flex-col gap-6 [grid-area:1/1]", done && "invisible")}
          >
            <fieldset disabled={sending} className="flex min-w-0 flex-col gap-6">
              <legend className="sr-only">{to ? to.name : deskNames[topic.desk]}</legend>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
                <TextField
                  id={`${id}-name`} name="name"
                  label={c.fields.name}
                  value={v.name}
                  onChange={(x) => set("name", x)}
                  error={error("name")}
                  autoComplete="name"
                />
                <TextField
                  id={`${id}-email`} name="email"
                  label={c.fields.email}
                  type="email"
                  value={v.email}
                  onChange={(x) => set("email", x)}
                  error={error("email")}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span id={`${id}-role-label`} className="text-sm">
                  {c.fields.role}
                </span>
                <TabTrack
                  kind="radios"
                  on="card"
                  labelledBy={`${id}-role-label`}
                  idPrefix={`${id}-role`}
                  options={c.roles.map((r) => ({ id: r.id, label: r.label }))}
                  value={v.role}
                  onChange={pickRole}
                  className="w-full [&>button]:flex-1 [&>button]:px-2"
                />
              </div>

              {to ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm">{c.asked.to}</span>
                  {/* Where the topic would be: the person the link named,
                      and the way back to the desks. */}
                  <div className="flex items-center gap-3 rounded-control py-2 pl-2 pr-1 ring-1 ring-inset ring-border">
                    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-chip text-primary-ink">
                      {to.face ? (
                        <Image src={face(to.face, 96)} alt="" width={40} height={40} className="size-10 object-cover" />
                      ) : (
                        <UserGroupIcon aria-hidden="true" className="size-5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{to.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{to.line}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={c.asked.change}
                      title={c.asked.change}
                      onClick={() => {
                        setTo(null);
                        setV((was) => ({ ...was, message: resting.message }));
                        requestAnimationFrame(() => document.getElementById(`${id}-topic`)?.focus());
                      }}
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground press hover:bg-accent hover:text-foreground"
                    >
                      <XMarkIcon className="size-4" />
                    </button>
                  </div>
                  <p aria-live="polite" className="min-h-[2lh] text-sm text-muted-foreground">
                    {to.route}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Select name="topic" value={topic.id} onValueChange={(x) => set("topic", String(x))}>
                    <div className="flex flex-col gap-2">
                      <SelectFieldLabel className="text-foreground">{c.fields.topic}</SelectFieldLabel>
                      <SelectTrigger id={`${id}-topic`} size="field" className="w-full">
                        <SelectValue>{(val: string) => topics.find((t) => t.id === val)?.label}</SelectValue>
                      </SelectTrigger>
                    </div>
                    <SelectContent label={c.fields.topic}>
                      <SelectGroup>
                        <SelectLabel>{c.fields.topic}</SelectLabel>
                        {topics.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* Where the message goes, before it goes: two lines kept
                      for it at every width, so a longer desk name or a link to
                      the answer never moves the fields under it. */}
                  <p aria-live="polite" className="min-h-[2lh] text-sm text-muted-foreground">
                    {c.route(deskNames[topic.desk], span(replyMinutes[topic.desk]))}
                    {faq !== undefined && (
                      <>
                        {" "}
                        <a
                          href="#questions"
                          data-faq={faq}
                          className={cn(
                            "inline-flex items-center gap-1 whitespace-nowrap text-foreground underline underline-offset-4 press hover:text-muted-foreground",
                            reach,
                          )}
                        >
                          {c.seeAnswer}
                        </a>
                      </>
                    )}
                  </p>
                </div>
              )}

              <TextField
                id={`${id}-message`} name="message"
                label={c.fields.message}
                value={v.message}
                onChange={(x) => set("message", x)}
                error={error("message")}
                aside={<span className="tabular-nums">{c.counter(v.message.length)}</span>}
                maxLength={MESSAGE_MAX}
                multiline
              />
            </fieldset>

            <Button
              type="submit"
              size="lg"
              aria-disabled={sending || undefined}
              className={cn("w-full", sending && "pointer-events-none")}
            >
              {sending ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    data-icon="inline-start"
                    className="animate-spin motion-reduce:animate-none"
                  />
                  {c.sending}
                </>
              ) : (
                <>
                  {c.send}
                  <ArrowRightIcon data-icon="inline-end" />
                </>
              )}
            </Button>
          </form>

          <div inert={!done} className={cn("flex flex-col justify-center [grid-area:1/1]", !done && "invisible")}>
            {sent && (
              <Ticket
                headingRef={doneHeading}
                first={v.name.trim().split(/\s+/)[0] || v.name}
                email={v.email.trim()}
                desk={to ? to.name : deskNames[topic.desk]}
                ticket={sent.ticket}
                due={whenFrom(now, new Date(sent.at + (to ? TWO_DAYS : replyMinutes[topic.desk]) * 60_000), tz)}
                onAgain={again}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  href,
  children,
}: {
  icon: typeof Mail01Icon;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a href={href} className="group/row flex w-fit items-center gap-3.5 text-base press">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-fixed-dark/25 transition-colors group-hover/row:bg-fixed-light/70">
          <HugeiconsIcon icon={icon} size={18} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="underline decoration-fixed-dark/0 underline-offset-4 transition-colors group-hover/row:decoration-fixed-dark/60">
          {children}
        </span>
      </a>
    </li>
  );
}

function Ticket({
  headingRef,
  first,
  email,
  desk,
  ticket,
  due,
  onAgain,
}: {
  headingRef: React.RefObject<HTMLSpanElement | null>;
  first: string;
  email: string;
  desk: string;
  ticket: string;
  due: string;
  onAgain: () => void;
}) {
  const c = formCopy.done;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ticket);
    } catch {
      // A browser that refuses the clipboard still shows the number, which
      // is the thing being kept.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div>
      <span className="flex size-14 items-center justify-center rounded-full bg-chip text-primary-ink">
        <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2} aria-hidden="true" />
      </span>
      <Eyebrow className="mt-6">{c.eyebrow}</Eyebrow>
      <h2 className="mt-5 max-w-sm text-3xl tracking-tighter sm:text-4xl">
        <span ref={headingRef} tabIndex={-1} className="outline-none">
          {c.heading(first)}
        </span>
      </h2>

      <dl className="mt-8 divide-y rounded-sm bg-accent px-5">
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-sm text-muted-foreground">{c.ticket}</dt>
          <dd className="flex items-center gap-2">
            <span className="font-mono text-sm tabular-nums">{ticket}</span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? c.copied : c.copy}
              className="relative flex size-9 items-center justify-center rounded-control text-muted-foreground press after:absolute after:-inset-0.5 hover:bg-card hover:text-foreground"
            >
              <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-sm text-muted-foreground">{c.desk}</dt>
          <dd className="text-sm">{desk}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-sm text-muted-foreground">{c.expect}</dt>
          <dd className="text-sm font-medium">{due}</dd>
        </div>
      </dl>
      <p className="mt-6 text-base text-muted-foreground">{c.copyTo(email)}</p>
      <Button variant="outline" onClick={onAgain} className="mt-8">
        {c.again}
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? c.copied : ""}
      </span>
    </div>
  );
}
