"use client";

import { useEffect } from "react";
import { loadMotion } from "@/lib/motion-loader";

/**
 * Makes the move from one stage to the next something you feel, not a hard cut.
 * For every seam, scrubbed to the scroll (Lenis is the only smoothing layer):
 *   1. the gold hairline on the incoming stage draws outward from the centre;
 *   2. the stage that is leaving dims into the incoming stage's ground as it rises over it.
 * Transforms and opacity only. Without motion (reduced motion, or GSAP failing to
 * load) the hairline is simply there and nothing dims.
 */
export function SectionSeams() {
  useEffect(() => {
    let alive = true;
    let revert: (() => void) | undefined;

    loadMotion()
      .then(({ gsap }) => {
        if (!alive) return;
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const stages = gsap.utils.toArray<HTMLElement>("main > section[data-stage], main > section[data-band]");
          stages.forEach((stage, i) => {
            if (i === 0) return;
            const line = stage.querySelector<HTMLElement>(":scope > .seam-line");
            const prev = stages[i - 1];
            const veil = prev.querySelector<HTMLElement>(":scope > .seam-veil");
            // Inner pages dim less (data-veil) so the end of a chapter stays readable.
            const depth = Number(prev.dataset.veil ?? 0.7);

            if (line) {
              gsap.fromTo(
                line,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  ease: "power2.out",
                  scrollTrigger: { trigger: stage, start: "top 100%", end: "top 55%", scrub: true },
                },
              );
            }
            if (veil) {
              // The leaving stage dissolves into the next room's own ground (green or black),
              // never to a flat grey. Read from the section's token-based background.
              gsap.set(veil, { backgroundColor: getComputedStyle(stage).backgroundColor });
              gsap.fromTo(
                veil,
                { opacity: 0 },
                {
                  opacity: depth,
                  ease: "power1.in",
                  scrollTrigger: { trigger: stage, start: "top 100%", end: "top 8%", scrub: true },
                },
              );
            }
          });
        });
        revert = () => mm.revert();
      })
      .catch(() => {});

    return () => {
      alive = false;
      revert?.();
    };
  }, []);

  return null;
}
