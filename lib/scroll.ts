"use client";
import type Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

/** Scroll to an in-page target through Lenis when it is running, natively otherwise. */
export function scrollToTarget(target: string, lenis?: Lenis) {
  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;
  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
  history.replaceState(null, "", target);
}
