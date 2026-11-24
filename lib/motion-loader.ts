"use client";
/**
 * GSAP + plugins load as an async chunk once the page is idle after `load`,
 * never in the initial bundle (home JS budget) and never competing with first
 * paint. Every initial-load component goes through this.
 */
let pending: Promise<typeof import("./gsap")> | null = null;

const whenIdle = () =>
  new Promise<void>((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window ? requestIdleCallback(() => resolve(), { timeout: 1200 }) : setTimeout(resolve, 200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });

export const loadMotion = () =>
  (pending ??= whenIdle()
    .then(() => import("./gsap"))
    .catch((err) => {
      // Without GSAP every scene must show its final, readable state.
      document.documentElement.classList.add("no-motion");
      throw err;
    }));
