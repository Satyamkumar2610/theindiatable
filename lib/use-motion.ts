"use client";

import { useEffect, type RefObject } from "react";
import { loadMotion } from "./motion-loader";

export type Motion = Awaited<ReturnType<typeof loadMotion>>;
export type MotionConditions = { desktop: boolean; mobile: boolean };

/** Motion only ever runs when the visitor allows it; reduced motion gets the CSS final state. */
export const MQ = {
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 63.998rem) and (prefers-reduced-motion: no-preference)",
};

/**
 * Runs a section's GSAP setup once GSAP has loaded (idle, after first paint),
 * inside gsap.matchMedia so every tween, ScrollTrigger and SplitText is
 * reverted on breakpoint change or unmount. GSAP is passed in, never imported
 * statically, so it stays out of the initial bundle.
 */
export function useMotion<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (root: T, m: Motion, c: MotionConditions) => void | (() => void),
) {
  useEffect(() => {
    let alive = true;
    let revert: (() => void) | undefined;
    loadMotion().then((m) => {
      if (!alive || !ref.current) return;
      const root = ref.current;
      const mm = m.gsap.matchMedia();
      mm.add(MQ, (ctx) => setup(root, m, ctx.conditions as MotionConditions));
      revert = () => mm.revert();
    });
    return () => {
      alive = false;
      revert?.();
    };
    // Setup is defined inline by each section and must run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Resolves on the visitor's first real interaction: heavy visuals wait for intent, not for page load. */
export function onFirstInteraction(cb: () => void) {
  const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    events.forEach((e) => window.removeEventListener(e, fire));
    cb();
  };
  events.forEach((e) => window.addEventListener(e, fire, { passive: true, once: true }));
  return () => events.forEach((e) => window.removeEventListener(e, fire));
}
