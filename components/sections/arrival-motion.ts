"use client";
/**
 * The Arrival's pinned scrub, loaded lazily with GSAP. gsap.matchMedia scopes it
 * to desktop + motion and reverts everything (pin, SplitText) when the query
 * stops matching or the component unmounts.
 */
import { gsap, SplitText } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export const DESKTOP_MOTION =
  "(min-width: 64rem) and (hover: hover) and (prefers-reduced-motion: no-preference)";

export function setupArrival(root: HTMLElement, onRoom: (open: boolean) => void) {
  const mm = gsap.matchMedia();
  mm.add(DESKTOP_MOTION, () => {
    const q = gsap.utils.selector(root);
    const half = () => root.offsetWidth / 2;
    const split = SplitText.create(q(".arrival-title")[0], { type: "words", aria: "auto" });

    const tl = gsap.timeline({
      defaults: { ease: motion.scrubEase },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => onRoom(self.progress > 0.06),
      },
    });

    tl.to(q(".arrival-after"), { autoAlpha: 0, y: -16, duration: 0.12 }, 0)
      .to(q(".arrival-title"), { autoAlpha: 0, y: -24, duration: 0.12 }, 0.02)
      .to(q(".door-seam"), { scaleY: 0, duration: 0.1 }, 0.1)
      .to(q(".door-leaf--l"), { xPercent: -100, duration: 0.5 }, 0.14)
      .to(q(".door-leaf--r"), { xPercent: 100, duration: 0.5 }, 0.14)
      .to(q(".door-t--l"), { x: () => -half(), duration: 0.5 }, 0.14)
      .to(q(".door-t--r"), { x: () => half(), duration: 0.5 }, 0.14)
      .fromTo(q(".door-sheen"), { attr: { x1: -333, x2: 0 } }, { attr: { x1: 333, x2: 666 }, duration: 0.5 }, 0.14)
      .to(q(".door-figure"), { yPercent: -8, duration: 0.22 }, 0.44)
      .to(q(".door-head"), { yPercent: -4, duration: 0.18 }, 0.5)
      .to(q(".room"), { autoAlpha: 0.5, duration: 0.3 }, 0.3)
      .set(split.words, { autoAlpha: 0, yPercent: 60 }, 0.15)
      .set(q(".arrival-title"), { autoAlpha: 1, y: 0 }, 0.58)
      .to(split.words, { autoAlpha: 1, yPercent: 0, duration: 0.08, stagger: 0.03 }, 0.6)
      .to(q(".arrival-after"), { autoAlpha: 1, y: 0, duration: 0.1 }, 0.84)
      .to({}, { duration: 0.06 });

    return () => split.revert();
  });
  return () => mm.revert();
}
