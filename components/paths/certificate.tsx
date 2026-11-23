import { Certificate01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { goals } from "@/components/marketing/goals";
import { detailOf } from "@/components/paths/paths";
import { Caps } from "@/components/ui/caps";

/** The reference's closing panel, the platform's word on the people it
 *  lists, here the path's word on what it ends in: the certificate itself,
 *  drawn at the size it is read at, the line that says what it holds, and
 *  the three figures a finished path is measured by. Iris, as the home
 *  page's credential is. */
export function Certificate({ id, total }: { id: string; total: number }) {
  const g = goals.find((x) => x.id === id) ?? goals[0];
  const d = detailOf(g);
  return (
    <section
      id="certificate"
      aria-labelledby="certificate-title"
      className="mt-14 rounded-lg bg-iris-surface px-5 pb-6 pt-10 sm:px-10 sm:pb-10 sm:pt-12 lg:mt-16"
    >
      <Paper id={g.id} total={total} />
      <h2 id="certificate-title" className="mx-auto mt-10 max-w-md text-balance text-center text-3xl tracking-tighter">
        One certificate for the whole path
      </h2>
      <p className="mx-auto mt-4 max-w-md text-center text-base">
        It lists the five courses, their hours and their reviewed projects, and an employer can check it at its own
        address.
      </p>
      {/* Three abreast where a figure's column holds its label on one line;
          beside the rail at lg the panel is 560px, three columns there were
          154px and every label broke, so the figures stack as the notes
          above them do. */}
      <dl data-object className="mt-10 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {d.figures.map((f) => (
          <div key={f.label} className="flex flex-col rounded-sm bg-card p-5">
            <dt className="order-2 mt-1 text-sm font-medium">{f.label}</dt>
            <dd className="order-1 font-heading text-2xl tracking-tight tabular-nums">{f.figure}</dd>
            <dd className="order-3 mt-2 text-sm text-muted-foreground">{f.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The certificate as a sheet of paper on the panel: the mark, the path, a
 *  line for the holder's name, the five courses with their hours and the
 *  address it is checked at. A drawn picture, which is what `data-picture`
 *  says. */
function Paper({ id, total }: { id: string; total: number }) {
  const g = goals.find((x) => x.id === id) ?? goals[0];
  return (
    <div
      data-picture
      aria-hidden="true"
      className="mx-auto w-full max-w-[34rem] rounded-sm bg-card p-6 text-left shadow-soft-lg sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <Caps>Path certificate</Caps>
          <p className="mt-3 font-heading text-3xl tracking-tighter">{g.short}</p>
          <p className="mt-1 text-sm text-muted-foreground">Issued when the fifth course is done</p>
        </div>
        {/* the seal: the site's verified tick on the AI's iris, a step deep */}
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card ring-4 ring-iris/20">
          <HugeiconsIcon icon={Certificate01Icon} size={26} strokeWidth={1.6} />
        </span>
      </div>
      <ol className="mt-6 border-t">
        {g.legs.map((l, i) => (
          <li key={l.course} className="flex items-baseline gap-3 border-b py-2 text-sm">
            <span className="w-4 shrink-0 text-muted-foreground tabular-nums">{i + 1}</span>
            {/* whole, over two lines where a phone needs them: a course
                named on a certificate is never cut */}
            <span className="min-w-0 flex-1">{l.title}</span>
            <span className="shrink-0 text-muted-foreground tabular-nums">{l.hours} h</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="tabular-nums">{total} hours, five projects reviewed</span>
        <span className="font-mono text-xs text-muted-foreground">mentora.dev/verify</span>
      </div>
    </div>
  );
}
