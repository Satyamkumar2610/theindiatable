import type { Metadata } from "next";
import { Band } from "@/components/page/Band";
import { CloseBand } from "@/components/page/CloseBand";
import { Folio } from "@/components/page/Folio";
import { PageHero } from "@/components/page/PageHero";
import { Pending, showPending } from "@/components/page/Pending";
import { SectionSeams } from "@/components/providers/SectionSeams";
import { container } from "@/components/ui/Section";
import { beyond, conversation, distinction, isTodo, principlesPage as p } from "@/content/site";

export const metadata: Metadata = {
  title: p.meta.title,
  description: p.meta.description,
  alternates: { canonical: "/principles" },
};

type ChapterId = keyof typeof p.chapters;

/** A chapter whose copy the client has not supplied renders only in development. */
const pendingCopy: Partial<Record<ChapterId, string>> = {
  selection: p.selection,
  chathamHouse: conversation.noteConfirmed ? undefined : p.chathamHouse,
  conduct: p.conduct,
  privacy: p.privacy,
};
const order: ChapterId[] = ["principles", "format", "selection", "chathamHouse", "conduct", "beyond", "privacy"];
const chapters = order.filter((id) => {
  const copy = pendingCopy[id];
  return !copy || !isTodo(copy) || showPending;
});
const anchor = (id: ChapterId) => (id === "chathamHouse" ? "chatham-house" : id);

/** The reading column: chapters sit to the right of the margin contents on desktop. */
const column = "lg:col-span-7 lg:col-start-5";

function Chapter({ id, index, children }: { id: ChapterId; index: number; children: React.ReactNode }) {
  return (
    <Band id={anchor(id)} ground={index % 2 ? "green" : "black"} labelledBy={`${anchor(id)}-title`}>
      <div className={`${container} grid py-28 lg:grid-cols-12 lg:gap-x-10 lg:py-40`}>
        <div className={column}>
          <h2 id={`${anchor(id)}-title`} className="font-display text-statement text-text">
            {p.chapters[id]}
          </h2>
          <div className="mt-12 lg:mt-16">{children}</div>
        </div>
      </div>
    </Band>
  );
}

function body(id: ChapterId) {
  switch (id) {
    case "principles":
      return (
        <ul className="border-t border-hairline">
          {distinction.principles.map((pr) => (
            <li key={pr.title} className="border-b border-hairline py-10 first:pt-10">
              <h3 className="text-h3 text-text">{pr.title}</h3>
              <p className="mt-4 max-w-[62ch] text-text-soft">{pr.body}</p>
            </li>
          ))}
        </ul>
      );
    case "format":
      return (
        <dl className="border-t border-hairline">
          {p.format.map((row) => (
            <div key={row.term} className="grid gap-2 border-b border-hairline py-8 sm:grid-cols-[11rem_1fr] sm:gap-10">
              <dt className="font-display text-h3 text-text">{row.term}</dt>
              <dd className="max-w-[52ch] self-center text-text-soft">{row.detail}</dd>
            </div>
          ))}
        </dl>
      );
    case "beyond":
      return (
        <>
          <p className="max-w-[62ch] text-text-soft">{beyond.body}</p>
          <p className="mt-14 max-w-[30ch] border-l border-gold/60 pl-8 font-display text-lede text-text">{beyond.line}</p>
        </>
      );
    default:
      return <Pending>{pendingCopy[id]}</Pending>;
  }
}

export default function PrinciplesPage() {
  return (
    <>
      <SectionSeams />
      <PageHero title={p.title} standfirst={<p>{p.standfirst}</p>} />
      {chapters.map((id, i) => (
        <Chapter key={id} id={id} index={i}>
          {body(id)}
        </Chapter>
      ))}
      <Folio label={p.contentsLabel} items={chapters.map((id) => ({ id: anchor(id), label: p.chapters[id] }))} />
      {/* The close takes the other ground from the last chapter, so the seam between them is felt. */}
      <CloseBand ground={(chapters.length - 1) % 2 ? "black" : "green"} />
    </>
  );
}
