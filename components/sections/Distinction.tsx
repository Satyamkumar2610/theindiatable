"use client";

import { useRef } from "react";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { distinction, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";

/** "Not a conference." / "Not a panel." / "A table." */
const LINES = distinction.headline.split(/(?<=\.)\s/);

/**
 * [03] The Distinction. The gold rule strikes out what this is not, then
 * becomes the table "A table." sits on.
 */
export function Distinction() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[2];

  useMotion(root, (el, { gsap }, c) => {
    const q = gsap.utils.selector(el);
    const scene = q(".dist-stage")[0];
    if (c.desktop) {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: 1 },
        })
        .fromTo(q(".strike-1"), { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power2.inOut" }, 0.05)
        .fromTo(q(".dist-l1"), { opacity: 1 }, { opacity: 0.5, duration: 0.12 }, 0.2)
        .fromTo(q(".strike-2"), { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: "power2.inOut" }, 0.32)
        .fromTo(q(".dist-l2"), { opacity: 1 }, { opacity: 0.5, duration: 0.12 }, 0.47)
        .fromTo(q(".dist-l3"), { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.2, ease: "power3.out" }, 0.6)
        .fromTo(q(".dist-table"), { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: "power2.inOut" }, 0.68)
        .to({}, { duration: 0.1 });
    } else {
      gsap
        .timeline({ scrollTrigger: { trigger: scene, start: "top 65%" } })
        .from(q(".strike-1"), { scaleX: 0, duration: 0.7, ease: "power2.inOut" })
        .fromTo(q(".dist-l1"), { opacity: 1 }, { opacity: 0.5, duration: 0.4 })
        .from(q(".strike-2"), { scaleX: 0, duration: 0.7, ease: "power2.inOut" })
        .fromTo(q(".dist-l2"), { opacity: 1 }, { opacity: 0.5, duration: 0.4 })
        .from(q(".dist-l3"), { autoAlpha: 0, y: 20, duration: 0.8, ease: "power3.out" })
        .from(q(".dist-table"), { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, "<0.2");
    }

    // Principles: the shared quiet reveal (y 12, opacity, 0.7s, power2.out, top 85%).
    q(".principle").forEach((row: Element) =>
      gsap.from(row, { y: 12, autoAlpha: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 85%" } }),
    );

    // Closing line: three refusals, landing one by one.
    gsap.fromTo(
      q(".close-w"),
      { opacity: 0.18 },
      {
        opacity: 1,
        stagger: 0.3,
        ease: "none",
        // Full strength until it enters the viewport; the dim state exists only while being read.
        immediateRender: false,
        scrollTrigger: { trigger: q(".dist-close")[0], start: "top bottom", end: "center 45%", scrub: true },
      },
    );
  });

  return (
    <Section ref={root} stage={stage} ground="green">
      <div className="dist-stage relative lg:h-[200vh]">
        <div className="flex min-h-svh flex-col justify-center py-28 lg:sticky lg:top-0 lg:h-svh lg:py-0">
          <div className={container}>
            <RunningHead stage={stage} />
            <h2 id="distinction-title" className="mt-10 font-display text-text">
              {LINES.slice(0, 2).map((l, i) => (
                <span key={l} className={`dist-l${i + 1} relative block w-fit text-h2 text-text-soft`}>
                  {l}
                  <span className={`strike strike-${i + 1}`} aria-hidden="true" />
                </span>
              ))}
              <span className="dist-l3 relative mt-[0.12em] block w-fit text-[clamp(4.5rem,13vw,12rem)] leading-none">
                {LINES[2]}
                <span className="dist-table" aria-hidden="true" />
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className={`${container} pb-28 lg:pb-40`}>
        <ul className="border-t border-hairline">
          {distinction.principles.map((p) => (
            <li key={p.title} className="principle grid gap-4 border-b border-hairline py-10 md:grid-cols-12 md:gap-10 md:py-14">
              <h3 className="text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.15] text-text md:col-span-5">{p.title}</h3>
              <p className="measure text-text-soft md:col-span-6 md:col-start-7">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={`dist-close ${container} flex min-h-[70svh] items-center justify-center pb-24 text-center`}>
        <p className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.08] text-text">
          {distinction.closing.split(/(?<=\.)\s/).map((w) => (
            <span key={w} className="close-w block">
              {w}
            </span>
          ))}
        </p>
      </div>
    </Section>
  );
}
