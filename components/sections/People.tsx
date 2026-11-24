"use client";

import { useRef } from "react";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { people, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";

/**
 * [07] The People Behind It. Three seats lit; each name set like a place card.
 * Typographic only: no portraits were supplied.
 */
export function People() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[6];

  useMotion(root, (el, { gsap }) => {
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: q(".cards")[0], start: "top 75%" } })
      .from(q(".cards-rule"), { scaleX: 0, transformOrigin: "0 50%", duration: 1.2, ease: "power3.inOut" })
      .from(q(".card-seat"), { scale: 0, duration: 0.6, stagger: 0.25, ease: "back.out(2)" }, 0.5)
      .from(q(".card-body"), { y: 14, autoAlpha: 0, duration: 0.9, stagger: 0.25, ease: "power2.out" }, 0.6);
  });

  return (
    <Section ref={root} stage={stage} ground="green" className="py-28 lg:py-40">
      <div className={container}>
        <RunningHead stage={stage} />
        <h2 id="people-title" className="mt-10 font-display text-h2 text-text">
          {people.headline}
        </h2>

        <div className="cards relative mt-20 lg:mt-28">
          <span className="cards-rule absolute inset-x-0 top-0 h-px bg-hairline" aria-hidden="true" />
          <ul className="grid gap-14 md:grid-cols-3 md:gap-10">
            {people.founders.map((f) => (
              <li key={f.slug} className="relative pt-12">
                <span className="card-seat absolute top-0 left-0 h-3 w-3 -translate-y-1/2 rounded-full bg-gold-light" aria-hidden="true" />
                <div className="card-body">
                  <h3 className="text-[clamp(2rem,3.2vw,2.9rem)] leading-[1.05] text-text">{f.name}</h3>
                  <p className="mt-4 max-w-[30ch] text-[1rem] leading-[1.6] text-gold-light">{f.oneLiner}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
