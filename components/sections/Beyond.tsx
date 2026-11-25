"use client";

import { useRef } from "react";
import { GradedImage } from "@/components/ui/GradedImage";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { beyond, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";
import colonnade from "@/public/images/colonnade.jpg";

/**
 * [06] Beyond the Table. A colonnade that runs on past the frame: as the
 * visitor scrolls through it the camera walks forward towards the vanishing
 * point, and the headline rises line by line out of the stone. What lasts is
 * the walk, not the gathering.
 */
export function Beyond() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[5];

  useMotion(root, (el, { gsap, SplitText }) => {
    const q = gsap.utils.selector(el);
    const band = q(".beyond-band")[0] as HTMLElement;

    // The walk: a slow dolly towards the vanishing point, tied to the scroll.
    gsap.fromTo(
      q(".beyond-band .graded-img"),
      { scale: 1.02, yPercent: -4 },
      { scale: 1.32, yPercent: 4, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true } },
    );

    const split = SplitText.create(q(".beyond-title")[0], { type: "lines", mask: "lines", aria: "none" });
    gsap
      .timeline({ scrollTrigger: { trigger: band, start: "top 55%" } })
      .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.12, ease: "expo.out" })
      .from(q(".beyond-rule"), { scaleX: 0, duration: 1.2, ease: "expo.out" }, 0.35);

    gsap.from(q(".beyond-copy > *"), {
      autoAlpha: 0,
      y: 16,
      duration: 1,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: q(".beyond-copy")[0], start: "top 82%" },
    });

    return () => split.revert();
  });

  return (
    <Section ref={root} stage={stage} ground="black" className="overflow-hidden">
      <div className="beyond-band relative isolate flex h-[92svh] items-center overflow-hidden lg:h-[118svh]">
        <GradedImage
          src={colonnade}
          alt={beyond.imageAlt}
          fill
          sizes="100vw"
          placeholder="blur"
          className="beyond-photo !absolute inset-0 -z-10 h-full w-full"
        />
        <span className="beyond-shade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

        <div className={`${container} text-center`}>
          <RunningHead stage={stage} />
          <h2
            id="beyond-title"
            className="beyond-title mx-auto mt-12 max-w-[18ch] font-display text-h2 text-text"
          >
            {beyond.headline}
          </h2>
          <span className="beyond-rule mx-auto mt-12 block h-px w-24 bg-gold" aria-hidden="true" />
        </div>
      </div>

      <div className={`beyond-copy ${container} grid gap-16 py-32 lg:grid-cols-12 lg:py-48`}>
        <p className="text-text-soft lg:col-span-6 lg:max-w-[52ch]">{beyond.body}</p>
        <p className="font-display text-lede text-text lg:col-span-5 lg:col-start-8">
          {beyond.line}
        </p>
      </div>
    </Section>
  );
}
