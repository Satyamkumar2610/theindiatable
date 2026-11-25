import type { ReactNode } from "react";
import { container } from "@/components/ui/Section";

/**
 * The opening of an inner page: the title set large on the green, the
 * standfirst on the reading column, and a gold rule that draws across once on
 * load. The page's one entrance; nothing else on the page fades in.
 */
export function PageHero({
  title,
  standfirst,
  children,
}: {
  title: string;
  standfirst?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section data-band data-veil="0.4" aria-labelledby="page-title" className="page-hero relative bg-primary">
      <div className={`${container} pt-36 pb-16 md:pt-44 lg:pt-52 lg:pb-20`}>
        <h1 id="page-title" className="page-hero-title max-w-[14ch] font-display text-h2 text-text">
          {title}
        </h1>
        <div className="grid lg:grid-cols-12 lg:gap-x-10">
          <span className="page-hero-rule mt-12 block h-px bg-gold/60 lg:col-span-12 lg:mt-16" aria-hidden="true" />
          {standfirst && (
            <div className="page-hero-stand mt-10 max-w-[44ch] text-[1.1875rem] leading-[1.65] text-text-soft lg:col-span-7 lg:col-start-5 lg:mt-12 lg:text-[1.3125rem]">
              {standfirst}
            </div>
          )}
        </div>
        {children}
      </div>
      <span className="seam-veil" aria-hidden="true" />
    </section>
  );
}
