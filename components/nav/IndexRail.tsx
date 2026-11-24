"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { stages } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";

/** Desktop (≥1024px) margin index 01–08. Active stage in gold, updated by ScrollTrigger. */
export function IndexRail() {
  const [active, setActive] = useState<string>(stages[0].id);
  const lenis = useLenis();

  useEffect(() => {
    // The stage crossing the viewport's centre line is the active one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.stage ?? stages[0].id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-stage]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Stages"
      className={`pointer-events-none fixed top-1/2 left-8 z-40 hidden -translate-y-1/2 transition-opacity duration-700 lg:block ${active === stages[0].id ? "opacity-0" : "opacity-100"}`}
    >
      <ol className={`flex flex-col gap-1 ${active === stages[0].id ? "" : "pointer-events-auto"}`}>
        {stages.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                aria-label={`${s.number} ${s.name}`}
                onClick={() => scrollToTarget(`#${s.id}`, lenis)}
                className={`label group flex items-center gap-3 py-1.5 transition-colors duration-500 ${on ? "text-gold-light" : "text-text-soft hover:text-text"}`}
              >
                <span
                  className={`h-px transition-[width,background-color] duration-700 ease-[var(--ease-out-expo)] ${on ? "w-6 bg-gold" : "w-3 bg-current"}`}
                  aria-hidden="true"
                />
                {s.number}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
