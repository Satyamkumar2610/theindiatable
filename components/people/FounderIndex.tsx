"use client";

import { useLenis } from "lenis/react";
import type { Founder } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";

/**
 * The founders as a ruled index: each row is a name and a role. On hover or
 * focus the gold seat takes its place before the name and the name steps in.
 */
export function FounderIndex({ founders, label }: { founders: readonly Founder[]; label: string }) {
  const lenis = useLenis();
  return (
    <nav aria-label={label} className="mt-16 lg:mt-20">
      <ol className="border-t border-hairline">
        {founders.map((f) => (
          <li key={f.slug} className="border-b border-hairline">
            <a
              href={`#${f.slug}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${f.slug}`, lenis);
              }}
              className="founder-row group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-10 md:py-9"
            >
              <span className="flex items-center gap-5 md:col-span-4">
                <span className="founder-seat" aria-hidden="true" />
                <span className="founder-name font-display text-h3 text-text">{f.name}</span>
              </span>
              <span className="pl-[1.875rem] text-text-soft md:col-span-8 md:pl-0">{f.oneLiner}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
