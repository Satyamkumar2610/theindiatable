"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { loadMotion } from "@/lib/motion-loader";

/**
 * Drives Lenis from gsap.ticker (brief §6). Until the GSAP chunk arrives a plain
 * rAF loop keeps Lenis alive, so wheel scrolling never stalls during load.
 */
function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (prefersReducedMotion()) {
      lenis.destroy();
      return;
    }
    let alive = true;
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    let cleanup = () => cancelAnimationFrame(raf);

    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (!alive) return;
      cancelAnimationFrame(raf);
      const onTick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        lenis.off("scroll", ScrollTrigger.update);
        gsap.ticker.remove(onTick);
      };
    });

    return () => {
      alive = false;
      cleanup();
    };
  }, [lenis]);

  // Re-measure every trigger once webfonts settle (brief §7).
  useEffect(() => {
    Promise.all([document.fonts?.ready, loadMotion()]).then(([, m]) => m.ScrollTrigger.refresh());
  }, []);

  return null;
}

/**
 * A continuous glide (lerp), not a fixed-duration ease that restarts on every
 * wheel tick: it reads as one long, even motion on mouse wheels and trackpads.
 * Lenis is the only smoothing layer: every ScrollTrigger uses `scrub: true`,
 * so scenes follow it exactly instead of lagging behind a second catch-up.
 */
const lenisOptions = {
  autoRaf: false,
  lerp: 0.085,
  wheelMultiplier: 0.9,
  syncTouch: false,
};

/**
 * Always rendered so the tree never remounts after hydration; under
 * prefers-reduced-motion the instance is destroyed at once and the page uses
 * native scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
