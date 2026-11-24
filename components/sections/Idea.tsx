"use client";

import { useRef } from "react";
import { MarkPieces } from "@/components/motif/MarkPieces";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { idea, people, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";

const [L1, L2] = idea.headline.split(/(?<=\.)\s/);

/**
 * [02] The Idea. The two T's are the two constituencies, at opposite ends of
 * the table. Scrolling brings them together and the figure rises between them:
 * "One room." Then the manifesto brightens as it is read.
 */
export function Idea() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[1];

  useMotion(root, (el, { gsap }, c) => {
    const q = gsap.utils.selector(el);
    const apart = () => {
      const w = (q(".idea-rule")[0] as HTMLElement).offsetWidth;
      const box = (q(".mark-pieces")[0] as HTMLElement).offsetWidth;
      return Math.max(0, w / 2 - box * 0.35);
    };

    if (c.desktop) {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q(".idea-stage")[0], start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      tl.fromTo(q(".mp-tl"), { x: () => -apart() }, { x: 0, duration: 0.55, ease: "power2.inOut" }, 0.05)
        .fromTo(q(".mp-tr"), { x: () => apart() }, { x: 0, duration: 0.55, ease: "power2.inOut" }, 0.05)
        .fromTo(q(".idea-side"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, 0.2)
        .fromTo(q(".mp-fig"), { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: "power2.out" }, 0.55)
        .fromTo(q(".idea-l2"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.72)
        .to({}, { duration: 0.1 });
    } else {
      gsap
        .timeline({ scrollTrigger: { trigger: q(".idea-stage")[0], start: "top 70%" } })
        .from(q(".mp-tl"), { x: () => -apart(), duration: 1.4, ease: "power3.inOut" })
        .from(q(".mp-tr"), { x: () => apart(), duration: 1.4, ease: "power3.inOut" }, 0)
        .from(q(".mp-fig"), { yPercent: 100, duration: 1, ease: "power3.out" }, 1)
        .from(q(".idea-l2"), { autoAlpha: 0, y: 16, duration: 0.9, ease: "power2.out" }, 1.4);
    }

    // The manifesto lights word by word as it is read (Scroll Reveal, no blur, no rotation).
    gsap.fromTo(
      q(".rw"),
      { opacity: 0.2 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        // Full strength until it enters the viewport; the dim state exists only while being read.
        immediateRender: false,
        scrollTrigger: { trigger: q(".idea-manifesto")[0], start: "top bottom", end: "bottom 45%", scrub: true },
      },
    );
  });

  return (
    <Section ref={root} stage={stage} ground="black">
      <div className="idea-stage relative lg:h-[230vh]">
        <div className="flex min-h-svh flex-col justify-center py-28 lg:sticky lg:top-0 lg:h-svh lg:py-0">
          <div className={container}>
            <RunningHead stage={stage} />
            <h2 id="idea-title" className="mt-10 text-center font-display text-h2 text-text">
              <span className="block">{L1}</span>
              <span className="idea-l2 block">{L2}</span>
            </h2>

            <div className="relative mx-auto mt-[8vh] w-full max-w-[60rem]">
              <MarkPieces className="mx-auto aspect-[333/305] w-[clamp(6rem,11vw,10rem)]" />
              <span className="idea-rule absolute inset-x-0 bottom-[2%] h-px bg-gold/60" aria-hidden="true" />
              <p className="idea-side label absolute top-full left-0 mt-5 hidden max-w-[26ch] text-left leading-[1.8] text-text-soft md:block">
                {idea.sides[0]}
              </p>
              <p className="idea-side label absolute top-full right-0 mt-5 hidden max-w-[26ch] text-right leading-[1.8] text-text-soft md:block">
                {idea.sides[1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${container} pt-16 pb-40 lg:pb-56`}>
        <p className="idea-manifesto mx-auto max-w-[30ch] font-display text-[clamp(1.6rem,2.7vw,2.5rem)] leading-[1.3] text-text">
          {idea.manifesto.split(" ").map((w, i) => (
            <span key={i} className="rw">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="paper border-t border-hairline">
        <figure className={`${container} flex min-h-[90svh] flex-col items-center justify-center py-40 text-center`}>
          <span className="h-px w-12 bg-gold" aria-hidden="true" />
          <blockquote className="mt-12 max-w-[22ch] font-display text-[clamp(2.1rem,4.4vw,4rem)] leading-[1.14] text-primary">
            {idea.pullQuote}
          </blockquote>
          <figcaption className="mt-14 flex flex-col items-center gap-4">
            <span className="stage-label !text-primary-raised">{idea.creditLabel}</span>
            <span className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {people.founders.map((f) => (
                <a key={f.slug} href="#people" className="text-link label !text-primary hover:!text-primary-raised">
                  {f.name}
                </a>
              ))}
            </span>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
