/** Folded for matching: accents off and lower case, so "Analisis" finds
 *  "Análisis" and a search reads the way people type. */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** The words a search found, marked in the brand's chip tint. `query` is
 *  already folded. */
export function Marked({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const at = fold(text).indexOf(query);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[4px] bg-chip text-foreground">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}
