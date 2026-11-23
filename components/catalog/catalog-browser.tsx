"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { SearchRemoveIcon } from "@hugeicons/core-free-icons";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { CompareTray, compareToggle } from "@/components/catalog/compare";
import { FacetSelect, PricePopover, RatingSelect, ViewToggle } from "@/components/catalog/controls";
import { deckNote, popularSearches } from "@/components/catalog/copy";
import { FiltersDialog } from "@/components/catalog/filters-dialog";
import { RecentStack } from "@/components/catalog/recent-stack";
import {
  bestUndo,
  chips,
  counts,
  courseData,
  EMPTY,
  fromQuery,
  results,
  sorts,
  toQuery,
  type Filters,
  type Sort,
  type View,
} from "@/components/catalog/state";
import { useCompared } from "@/components/course/compared";
import { CourseCard, glyph, LevelDots } from "@/components/course/course-card";
import { CourseRow } from "@/components/course/course-row";
import {
  courses,
  credentials,
  durations,
  languages,
  levels,
  matchesQuery,
  topics,
  topicTint,
  type Topic,
} from "@/components/course/courses";
import { EmptyState } from "@/components/listing/empty-state";
import { FacetTabs, type FacetTab } from "@/components/listing/facet-tabs";
import { HandNote } from "@/components/listing/hand-note";
import { PopularSearches } from "@/components/listing/popular-searches";
import { focusAfterRender, ResultsLine, scrollToResults } from "@/components/listing/results-line";
import { SortSelect } from "@/components/listing/sort-select";
import { useAddressState } from "@/components/listing/use-address-state";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight } from "@/components/ui/section-heading";

// Three rows of the four-card grid a load, and four at lg where it runs three.
const PAGE = 12;

// The subject most of a search's courses sit in, for the dot beside it.
const subjectOf = (q: string): Topic => {
  const found = courses.filter((c) => matchesQuery(c, q));
  const count = (t: Topic) => found.filter((c) => c.topic === t).length;
  return topics.reduce((best, t) => (count(t) > count(best) ? t : best));
};

const popular = popularSearches.map((q) => ({ q, dot: topicTint[subjectOf(q)].dot }));

export function CatalogBrowser() {
  // The filters, the order and the layout, read from the address and
  // written back to it, so the page as filtered can be bookmarked, shared or
  // reloaded.
  const [state, setState] = useAddressState(fromQuery, toQuery);
  const { filters, sort, view } = state;
  const [visible, setVisible] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  // The list the home shelf picks into too, so a course picked there is
  // already in the tray here.
  const compare = useCompared();
  const timers = useRef<number[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);

  // A new question starts the list from its top, whether a filter here asked
  // it or the address moved under the page.
  const [asked, setAsked] = useState(filters);
  if (filters !== asked) {
    setAsked(filters);
    setVisible(PAGE);
  }

  const found = useMemo(() => results(filters, sort), [filters, sort]);
  const n = useMemo(() => counts(filters), [filters]);
  const active = chips(filters);
  const shown = found.slice(0, visible);

  const update = (next: Filters) => setState((s) => ({ ...s, filters: next }));
  const setSort = (next: Sort) => setState((s) => ({ ...s, sort: next }));
  const setView = (next: View) => setState((s) => ({ ...s, view: next }));

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  // The next twelve arrive after a beat behind skeleton cards, as they would
  // from a server; with the motion setting off, the beat is still there and
  // the skeletons simply do not pulse.
  const more = () => {
    setLoading(true);
    timers.current.push(
      window.setTimeout(() => {
        setVisible((v) => v + PAGE);
        setLoading(false);
      }, 650),
    );
  };

  const toggle = (id: string) => compareToggle(compare, id);

  const toResults = () => scrollToResults(heading);

  const tabs: FacetTab<Topic>[] = [
    { label: "All", value: null, Icon: Squares2X2Icon, count: n.topicAll },
    ...topics.map((t) => ({ label: t, value: t, Icon: glyph[t], count: n.topic.get(t) ?? 0 })),
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10">
      {/* The title block on its band: the heading, the one line under it and
          the search at the left, and at the right the reference's feature
          card, which here is the visitor's own history. The band pads its
          foot as it pads its head, and the deck keeps its own padding for
          the fan: the cards used to sink into the foot until the lowest
          corner stood 2px off the band's edge. */}
      <div className="grid grid-cols-1 gap-12 rounded-lg bg-accent px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-14">
        <div>
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-5 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
            Find a course <Highlight>you can finish</Highlight>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground">
            Every course lists the weeks it runs and the hours a week it asks,
            so start from the time you have and narrow by level, price and
            credential.
          </p>
          <CatalogSearch
            className="mt-8 max-w-md"
            value={filters.q}
            onSearch={(q) => update({ ...filters, q })}
            onGo={toResults}
          />
          {/* Beside a deck taller than the copy, the column ran out under
              the search. From lg it takes the searches most learners begin
              with, and the hand naming the deck. Chosen over each of the two
              alone: the searches by themselves left the deck without
              a name, and the hand by itself left the gap under the field. */}
          <PopularSearches
            items={popular}
            value={filters.q}
            onPick={(q) => {
              update({ ...filters, q });
              // Pressing the chip in force clears it, and stays put.
              if (q) toResults();
            }}
            className="mt-5 hidden max-w-md lg:flex"
          />
          <HandNote lines={deckNote} className="mt-6" />
        </div>
        {/* Held to the row's foot: where the copy column runs taller than
            the deck, at 1024, the hand's arrow still lands on the card
            rather than on the empty band under a centered one. */}
        <RecentStack className="mx-auto w-full max-w-[34rem] lg:mr-0 lg:self-end" />
      </div>

      {/* The reference's first row: the subjects as tabs, each saying how
          many courses it holds under the other filters, and from lg the
          pill that opens every filter at once. Below lg the tabs have the
          row to themselves and scroll to the screen's edge where they run
          out of room; at 768 the pill beside them cut "Business" off
          against its own edge. */}
      <div className="mt-14 flex items-center gap-4 pb-5">
        <FacetTabs
          label="Subjects"
          tabs={tabs}
          value={filters.topic}
          onChange={(topic) => update({ ...filters, topic })}
          className="flex-1"
        />
        <FiltersDialog filters={filters} onApply={update} className="hidden lg:flex" />
      </div>

      {/* The second row: one chip per facet, the sort and the layout. The six
          chips, the sort and the layout need about 960px, so they stand in
          the row from lg; below it they live in the Filters panel, as on a
          phone, because a tablet's row hid Language and Credential past its
          edge with nothing to say it scrolled. The scroller's padding is
          room for the counts that ride their corners. */}
      <div className="flex items-center gap-3 border-t py-5">
        <FiltersDialog filters={filters} onApply={update} className="lg:hidden" />
        <div className="no-scrollbar -my-2.5 hidden min-w-0 flex-1 items-center gap-3 overflow-x-auto py-2.5 pr-2 lg:flex">
          <FacetSelect
            label="Level"
            options={levels}
            value={filters.level}
            onChange={(level) => update({ ...filters, level })}
            counts={n.level}
            render={(l) => (
              <span className="flex items-center gap-2">
                <LevelDots level={l} />
                {l}
              </span>
            )}
          />
          <FacetSelect
            label="Duration"
            options={durations}
            value={filters.duration}
            onChange={(duration) => update({ ...filters, duration })}
            counts={n.duration}
          />
          <PricePopover
            value={filters.price}
            onChange={(price) => update({ ...filters, price })}
            histogram={n.histogram}
            found={n.priceIn(filters.price)}
          />
          <RatingSelect
            value={filters.rating}
            onChange={(rating) => update({ ...filters, rating })}
            counts={n.rating}
            all={n.ratingAll}
          />
          <FacetSelect
            label="Language"
            options={languages}
            value={filters.language}
            onChange={(language) => update({ ...filters, language })}
            counts={n.language}
          />
          <FacetSelect
            label="Credential"
            options={credentials}
            value={filters.credential}
            onChange={(credential) => update({ ...filters, credential })}
            counts={n.credential}
          />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <SortSelect label="Sort courses" sorts={sorts} value={sort} onChange={setSort} />
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <ResultsLine
        count={found.length}
        noun={["course", "courses"]}
        query={filters.q}
        chips={active}
        onRemove={(c) => update(c.clear(filters))}
        onClear={() => update(EMPTY)}
        headingRef={heading}
      />

      {found.length === 0 ? (
        <NoResults
          filters={filters}
          onChange={(next) => {
            update(next);
            focusAfterRender(heading);
          }}
        />
      ) : view === "grid" ? (
        <ul
          aria-label="Courses"
          className="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {shown.map((c) => (
            <li key={c.id} {...courseData(c)}>
              <CourseCard
                course={c}
                compare={toggle(c.id)}
                sizes="(min-width: 1280px) 290px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
              />
            </li>
          ))}
          {loading &&
            Array.from({ length: Math.min(4, found.length - visible) }, (_, i) => (
              <li key={`skeleton-${i}`} aria-hidden="true">
                <SkeletonCard />
              </li>
            ))}
        </ul>
      ) : (
        <ul aria-label="Courses" className="mt-8 grid gap-4">
          {shown.map((c) => (
            <li key={c.id} {...courseData(c)}>
              <CourseRow course={c} compare={toggle(c.id)} />
            </li>
          ))}
          {loading &&
            Array.from({ length: Math.min(2, found.length - visible) }, (_, i) => (
              <li key={`skeleton-${i}`} aria-hidden="true">
                <SkeletonRow />
              </li>
            ))}
        </ul>
      )}

      {found.length > 0 && (
        <div className="mt-14 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-sm tabular-nums text-muted-foreground">
              Showing {shown.length} of {found.length}
            </p>
            <span aria-hidden="true" className="h-1 w-40 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-answer ease-answer motion-reduce:transition-none"
                style={{ width: `${(shown.length / found.length) * 100}%` }}
              />
            </span>
          </div>
          {visible < found.length && (
            <Button size="lg" onClick={more} disabled={loading} aria-busy={loading || undefined}>
              {loading ? "Loading" : `Show ${Math.min(PAGE, found.length - visible)} more`}
              <ArrowDownIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
      )}

      <CompareTray />
    </section>
  );
}

/** An empty page says what emptied it and offers the way back that fits. A
 *  search on its own is answered with the searches most learners begin with,
 *  since dropping it would only bring the whole catalog back; filters are
 *  answered with the one chip whose removal brings the most courses back,
 *  and a way to clear the lot. */
function NoResults({ filters, onChange }: { filters: Filters; onChange: (next: Filters) => void }) {
  const on = chips(filters);
  const searchOnly = on.length === 1 && on[0].key === "q";
  const undo = searchOnly ? null : bestUndo(filters);
  const back = undo && undo.found > 0 ? undo : null;

  return (
    <EmptyState
      icon={SearchRemoveIcon}
      title={on.length === 1 ? `Nothing matches ${on[0].said}` : "No course matches all of these"}
      text={
        searchOnly
          ? "Try fewer words, or start where most learners do."
          : back
            ? `Drop ${back.chip.said} and ${back.found} ${back.found === 1 ? "course comes" : "courses come"} back.`
            : "Try fewer words in the search, or a broader subject."
      }
    >
      {searchOnly ? (
        // The same searches the band offers under its field.
        <PopularSearches
          items={popular}
          value={filters.q}
          onPick={(q) => onChange({ ...filters, q })}
          className="mt-8 justify-center"
        />
      ) : (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {back && (
            <Button onClick={() => onChange(back.chip.clear(filters))}>Remove {back.chip.said}</Button>
          )}
          <Button variant="outline" onClick={() => onChange(EMPTY)}>
            Clear all
          </Button>
        </div>
      )}
    </EmptyState>
  );
}

// Loading stand-ins, drawn to the card's own proportions so nothing moves
// when the real ones arrive.
function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-lg bg-card p-2 shadow-soft">
      <div className="aspect-[4/3] animate-pulse rounded-[calc(var(--radius)-0.5rem)] bg-muted motion-reduce:animate-none" />
      <div className="flex flex-col gap-3 px-3 pb-3 pt-4">
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="mt-4 h-10 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-card p-2 shadow-soft sm:flex-row">
      <div className="aspect-[4/3] animate-pulse rounded-[calc(var(--radius)-0.5rem)] bg-muted motion-reduce:animate-none sm:aspect-auto sm:h-56 sm:w-64 lg:w-80" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-5 w-2/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
      </div>
    </div>
  );
}
