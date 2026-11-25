"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { scrollToTarget } from "@/lib/scroll";

type Item = { id: string; label: string };

/** Height of one entry in rem: the seat moves in whole steps of it. */
const STEP = 2.75;

/**
 * The margin contents of a long page (desktop). It stays fixed on the
 * content's left edge while a chapter is under the reading line, and one gold
 * seat (the logo's head) moves to the chapter being read. Hidden over the
 * page's opening and close, where there is nothing to navigate.
 */
export function Folio({ items, label }: { items: readonly Item[]; label: string }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;

    // The chapter crossing the middle of the screen is the one being read.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      const top = els[0].getBoundingClientRect().top;
      const bottom = els[els.length - 1].getBoundingClientRect().bottom;
      setShown(top < mid && bottom > mid);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label={label} inert={!shown} className="folio" data-shown={shown}>
      <p className="folio-label label">{label}</p>
      <ol className="relative mt-6" style={{ ["--step" as string]: `${STEP}rem` }}>
        <span className="folio-track" aria-hidden="true" />
        <span className="folio-seat" style={{ transform: `translateY(calc(${active} * var(--step)))` }} aria-hidden="true" />
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={i === active ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(`#${item.id}`, lenis);
              }}
              className="folio-link"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
