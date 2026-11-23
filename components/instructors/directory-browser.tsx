"use client";

import { useMemo, useRef } from "react";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { SearchRemoveIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { languages, topics, type Topic } from "@/components/course/courses";
import { toggleFollow, useFollowing } from "@/components/course/following";
import { glyph } from "@/components/course/glyph";
import { BadgeRecord } from "@/components/instructors/badge-record";
import { LanguageSelect, RatingSelect, ToggleChip } from "@/components/instructors/controls";
import { directoryCopy } from "@/components/instructors/copy";
import {
  bestUndo,
  chips,
  counts,
  EMPTY,
  entryData,
  fromQuery,
  results,
  sorts,
  toQuery,
  type Filters,
  type Sort,
} from "@/components/instructors/directory";
import { InstructorCard, TeachCard } from "@/components/instructors/instructor-card";
import { dotFor, InstructorSearch } from "@/components/instructors/instructor-search";
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

const popular = directoryCopy.popular.map((q) => ({ q, dot: dotFor(q) }));

export function DirectoryBrowser() {
  // The filters and the order, read from the address and written back to
  // it, so the directory as filtered can be bookmarked, shared or reloaded.
  const [state, setState] = useAddressState(fromQuery, toQuery);
  const { filters, sort } = state;
  // The list Follow writes to on every card here and on the course pages.
  const followed = useFollowing();
  const heading = useRef<HTMLHeadingElement>(null);

  const found = useMemo(() => results(filters, sort, followed), [filters, sort, followed]);
  const n = useMemo(() => counts(filters, followed), [filters, followed]);
  const active = chips(filters);

  const setFilters = (next: Filters) => setState((s) => ({ ...s, filters: next }));
  const setSort = (next: Sort) => setState((s) => ({ ...s, sort: next }));

  const tabs: FacetTab<Topic>[] = [
    { label: "All", value: null, Icon: Squares2X2Icon, count: n.fieldAll },
    ...topics.map((t) => ({ label: t, value: t, Icon: glyph[t], count: n.field.get(t) ?? 0 })),
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10">
      {/* The title block on its band, as the catalog sets its own: the
          heading, the line under it and the search at the left, and at the
          right the object this page is about, here the record behind the
          badge on every card below. */}
      <div className="grid grid-cols-1 gap-12 rounded-lg bg-accent px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-14">
        <div>
          <Eyebrow>{directoryCopy.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
            {directoryCopy.heading[0]} <Highlight>{directoryCopy.heading[1]}</Highlight>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground">{directoryCopy.lede}</p>
          <InstructorSearch
            className="mt-8 max-w-md"
            value={filters.q}
            onSearch={(v) => setFilters({ ...filters, q: v })}
            onGo={() => scrollToResults(heading)}
          />
          {/* The skills most searches start from, as the catalog offers its
              own under the field, from lg where the column has room beside
              the record; below it the field's own list offers the same. */}
          <PopularSearches
            items={popular}
            value={filters.q}
            onPick={(v) => {
              setFilters({ ...filters, q: v });
              // Pressing the chip in force clears it, and stays put.
              if (v) scrollToResults(heading);
            }}
            className="mt-5 hidden max-w-md lg:flex"
          />
          <HandNote lines={directoryCopy.note} className="mt-6" />
        </div>
        <BadgeRecord className="mx-auto w-full max-w-[34rem] lg:mr-0" />
      </div>

      {/* The fields as tabs, each saying how many teachers it holds under
          the other filters. */}
      <div className="mt-14 pb-5">
        <FacetTabs
          label="Fields"
          tabs={tabs}
          value={filters.field}
          onChange={(field) => setFilters({ ...filters, field })}
        />
      </div>

      {/* The filters and the order on one row. Where the four chips run
          out of room they scroll sideways to the screen's edge, as a filter
          row does on a phone, and the sort keeps the row's end; the
          scroller's padding is room for the count that rides a chip's
          corner. */}
      <div className="flex items-center gap-3 border-t py-5">
        <div className="no-scrollbar -my-2.5 -ml-6 flex min-w-0 flex-1 items-center gap-3 overflow-x-auto py-2.5 pl-6 pr-2 sm:-ml-8 sm:pl-8 lg:ml-0 lg:pl-0">
          <LanguageSelect
            options={languages}
            value={filters.language}
            onChange={(language) => setFilters({ ...filters, language })}
            counts={n.language}
          />
          <RatingSelect
            value={filters.rating}
            onChange={(rating) => setFilters({ ...filters, rating })}
            counts={n.rating}
            all={n.ratingAll}
          />
          <ToggleChip
            label="Has a free course"
            on={filters.free}
            onChange={(free) => setFilters({ ...filters, free })}
            disabled={!filters.free && n.free === 0}
          />
          {/* The count is how many teachers the chip would leave under the
              other filters, as every option's count here is; following
              somebody who is filtered out of view locks it. With nobody
              followed it stays open, and its empty page says how to start. */}
          <ToggleChip
            label="Following"
            on={filters.following}
            onChange={(following) => setFilters({ ...filters, following })}
            badge={n.following}
            counted={["instructor", "instructors"]}
            disabled={!filters.following && followed.length > 0 && n.following === 0}
          />
        </div>
        <SortSelect label="Sort instructors" sorts={sorts} value={sort} onChange={setSort} />
      </div>

      <ResultsLine
        count={found.length}
        noun={["instructor", "instructors"]}
        query={filters.q}
        chips={active}
        onRemove={(c) => setFilters(c.clear(filters))}
        onClear={() => setFilters(EMPTY)}
        headingRef={heading}
      />

      {found.length === 0 ? (
        <NoResults
          filters={filters}
          followed={followed}
          onChange={(next) => {
            setFilters(next);
            focusAfterRender(heading);
          }}
          onFollow={() => focusAfterRender(heading)}
        />
      ) : (
        // Four across from lg, so the fifteen and the door card make four
        // full rows at every desktop width; at three the door stood alone.
        <ul aria-label="Instructors" className="mt-8 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {found.map((e) => (
            <li key={e.name} {...entryData(e)}>
              <InstructorCard
                entry={e}
                // unfollowed while only the followed are shown, the card
                // leaves the list with the focus on it
                onFollow={(on) => filters.following && !on && focusAfterRender(heading)}
              />
            </li>
          ))}
          <li>
            <TeachCard />
          </li>
        </ul>
      )}
    </section>
  );
}

/** An empty directory says what emptied it and offers the way back that
 *  fits. A search on its own is answered with the searches most people start
 *  from, since dropping it only brings everybody back. Following nobody gets
 *  its own words and a teacher to start with, the one the other filters put
 *  first, since dropping the filter says nothing about how to fill it.
 *  Anything else is answered with the one chip whose removal brings the most
 *  teachers back, and a way to clear the lot. */
function NoResults({
  filters,
  followed,
  onChange,
  onFollow,
}: {
  filters: Filters;
  followed: string[];
  onChange: (next: Filters) => void;
  onFollow: () => void;
}) {
  const on = chips(filters);
  const searchOnly = on.length === 1 && on[0].key === "q";
  const nobody = filters.following && followed.length === 0;
  const start = nobody ? results({ ...filters, following: false }, "learners", followed)[0] : undefined;
  const undo = searchOnly || nobody ? null : bestUndo(filters, followed);
  const back = undo && undo.found > 0 ? undo : null;

  return (
    <EmptyState
      icon={nobody ? UserAdd01Icon : SearchRemoveIcon}
      title={
        nobody
          ? "You follow nobody yet"
          : on.length === 1
            ? `Nobody matches ${on[0].said}`
            : "No instructor matches all of these"
      }
      text={
        nobody
          ? "Press Follow on any card and that teacher shows up in this list."
          : searchOnly
            ? "Try fewer words, or start where most searches do."
            : back
              ? `Drop ${back.chip.said} and ${back.found} ${back.found === 1 ? "instructor comes" : "instructors come"} back.`
              : "Try fewer words in the search, or a broader field."
      }
    >
      {searchOnly ? (
        <PopularSearches
          items={popular}
          value={filters.q}
          onPick={(v) => onChange({ ...filters, q: v })}
          className="mt-8 justify-center"
        />
      ) : (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {start && (
            <Button
              onClick={() => {
                toggleFollow(start.name);
                onFollow();
              }}
            >
              Follow {start.name}
            </Button>
          )}
          {back && <Button onClick={() => onChange(back.chip.clear(filters))}>Remove {back.chip.said}</Button>}
          <Button variant="outline" onClick={() => onChange(EMPTY)}>
            Clear all
          </Button>
        </div>
      )}
    </EmptyState>
  );
}
