import type { Metadata } from "next";
import { Band } from "@/components/page/Band";
import { CloseBand } from "@/components/page/CloseBand";
import { PageHero } from "@/components/page/PageHero";
import { Pending } from "@/components/page/Pending";
import { FounderIndex } from "@/components/people/FounderIndex";
import { Portrait } from "@/components/people/Portrait";
import { SectionSeams } from "@/components/providers/SectionSeams";
import { container } from "@/components/ui/Section";
import { isTodo, people, peoplePage } from "@/content/site";

export const metadata: Metadata = {
  title: peoplePage.meta.title,
  description: peoplePage.meta.description,
  alternates: { canonical: "/people" },
};

/**
 * /people. An index of the founders on the green, then one spread each:
 * the portrait holds still in the margin while the biography is read.
 * Grounds alternate black / green so each founder is a room of their own.
 */
export default function PeoplePage() {
  const intent = isTodo(people.intent) ? null : people.intent;
  const last = people.founders.length - 1;

  return (
    <>
      <SectionSeams />
      <PageHero title={people.headline} standfirst={intent ? <p>{intent}</p> : <Pending>{people.intent}</Pending>}>
        <FounderIndex founders={people.founders} label={peoplePage.indexLabel} />
      </PageHero>

      {people.founders.map((f, i) => (
        <Band key={f.slug} id={f.slug} ground={i % 2 ? "green" : "black"} labelledBy={`${f.slug}-name`}>
          <article className={`${container} grid gap-12 py-28 lg:grid-cols-12 lg:gap-10 lg:py-40`}>
            <div className="lg:col-span-3">
              <div className="relative aspect-[4/5] w-full max-w-[24rem] overflow-hidden lg:sticky lg:top-28">
                {/* On a green band the card takes the black, so it never dissolves into the ground. */}
                <span className={`portrait-ground ${i % 2 ? "portrait-ground--dark" : ""} absolute inset-0`} aria-hidden="true" />
                <Portrait f={f} big sizes="(min-width: 1024px) 30vw, 90vw" />
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-5">
              <h2 id={`${f.slug}-name`} className="font-display text-statement text-text">
                {f.name}
              </h2>
              <p className="mt-5 max-w-[44ch] text-[1.1875rem] leading-[1.55] text-gold-light">{f.oneLiner}</p>
              <span className="mt-10 block h-px w-12 bg-gold" aria-hidden="true" />
              <div className="bio mt-10 max-w-[62ch]">
                {f.bio.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              {!people.biosApproved && i === 0 && <Pending>Biographies await the client&apos;s approval before launch.</Pending>}
            </div>
          </article>
        </Band>
      ))}

      <CloseBand ground={last % 2 ? "black" : "green"} />
    </>
  );
}
