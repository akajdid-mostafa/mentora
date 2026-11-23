// A button's two labels in one grid cell, the one not showing kept
// invisible, so the button holds the width of the longer and nothing beside
// it moves when the label changes.
export function SwapLabel({ on, idle, busy }: { on: boolean; idle: string; busy: string }) {
  return (
    <span className="grid">
      <span className={on ? "invisible col-start-1 row-start-1" : "col-start-1 row-start-1"}>{idle}</span>
      <span aria-hidden={!on} className={on ? "col-start-1 row-start-1" : "invisible col-start-1 row-start-1"}>
        {busy}
      </span>
    </span>
  );
}
