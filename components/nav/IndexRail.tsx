"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { stages } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Desktop index: one gold seat travelling a hairline on the right edge.
 * Stage names appear on hover or focus. Hidden (and inert) during the Arrival.
 */
export function IndexRail() {
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = stages.findIndex((s) => s.id === (e.target as HTMLElement).dataset.stage);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-stage]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const hidden = active === 0;
  const step = 2.25; // rem between stops

  return (
    <nav
      aria-label="Stages"
      inert={hidden}
      className={`fixed top-1/2 right-8 z-40 hidden -translate-y-1/2 transition-opacity duration-700 lg:block ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <span className="absolute top-0 right-[3px] h-full w-px bg-hairline" aria-hidden="true" />
      <span
        className="absolute right-0 h-[7px] w-[7px] rounded-full bg-gold-light transition-transform duration-700 ease-[var(--ease-out-expo)]"
        style={{ top: "calc(0.75rem - 3.5px)", transform: `translateY(${active * step}rem)` }}
        aria-hidden="true"
      />
      <ol className="relative flex flex-col" style={{ gap: `${step - 1.5}rem` }}>
        {stages.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={i === active ? "step" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${s.id}`, lenis);
              }}
              className="group flex h-6 items-center justify-end gap-3 pr-5"
            >
              <span
                className={`label whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${i === active ? "text-gold-light" : "text-text-soft"}`}
              >
                {s.number}&nbsp;&nbsp;{s.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
