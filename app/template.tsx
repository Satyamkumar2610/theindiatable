"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";

/** Set after the first page has mounted: only moves between pages get the curtain. */
let arrived = false;

/**
 * The move from one page to the next. A green curtain with a gold rule covers
 * the new page as it mounts, the rule draws, and the curtain lifts away. The
 * first page a visitor lands on never gets it (it would hide the first paint),
 * and reduced motion never sees it (CSS).
 */
export default function Template({ children }: { children: ReactNode }) {
  const [curtain, setCurtain] = useState(() => typeof window !== "undefined" && arrived);
  const lenis = useLenis();

  useEffect(() => {
    arrived = true;
  }, []);

  // Lenis keeps its own idea of the scroll position: start the new page at the top unless a section was asked for.
  useEffect(() => {
    if (curtain && !window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [curtain, lenis]);

  return (
    <>
      {curtain && (
        <div className="page-curtain" aria-hidden="true" onAnimationEnd={(e) => e.target === e.currentTarget && setCurtain(false)}>
          <span className="page-curtain-rule" />
        </div>
      )}
      {children}
    </>
  );
}
