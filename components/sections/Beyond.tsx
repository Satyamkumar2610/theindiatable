"use client";

import { useRef } from "react";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { beyond, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";

/** Seats sitting on the table's edge, spread from the centre (fractions of half-width). */
const SEATS = [-0.42, -0.3, -0.19, -0.09, 0, 0.09, 0.19, 0.3, 0.42];

/**
 * [06] Beyond the Table. The table's edge runs out past both sides of the
 * screen and becomes a horizon; the seats travel outward with it. The network
 * continues beyond any one gathering.
 */
export function Beyond() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[5];

  useMotion(root, (el, { gsap }) => {
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: q(".horizon")[0], start: "top 85%", end: "bottom 15%", scrub: 1 },
    });
    tl.fromTo(q(".horizon-line"), { scaleX: 0.28 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0);
    q(".horizon-seat").forEach((s: HTMLElement) => {
      const f = Number(s.dataset.f);
      tl.fromTo(
        s,
        { x: 0 },
        { x: () => f * window.innerWidth * 1.4, opacity: Math.abs(f) > 0.25 ? 0 : 0.35, duration: 1, ease: "power2.in" },
        0,
      );
    });
  });

  return (
    <Section ref={root} stage={stage} ground="black" className="overflow-hidden py-28 lg:py-40">
      <div className={container}>
        <RunningHead stage={stage} />
        <h2 id="beyond-title" className="mx-auto mt-16 max-w-[14ch] text-center font-display text-[clamp(3rem,8vw,7.5rem)] leading-[1.02] text-text">
          {beyond.headline}
        </h2>
      </div>

      <div className="horizon relative my-20 h-24 lg:my-28" aria-hidden="true">
        <span className="horizon-line absolute top-1/2 left-0 h-px w-full bg-[linear-gradient(90deg,transparent,var(--color-gold)_20%,var(--color-gold)_80%,transparent)]" />
        {SEATS.map((f) => (
          <span
            key={f}
            data-f={f}
            className="horizon-seat absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-[calc(50%+14px)] rounded-full bg-gold-light"
            style={{ left: `${50 + f * 50}%` }}
          />
        ))}
      </div>

      <div className={`${container} grid gap-16 lg:grid-cols-12`}>
        <p className="text-text-soft lg:col-span-6 lg:col-start-2 lg:max-w-[52ch]">{beyond.body}</p>
        <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.25] text-text lg:col-span-4 lg:col-start-8">
          {beyond.line}
        </p>
      </div>
    </Section>
  );
}
