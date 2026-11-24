"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { brand, nav } from "@/content/site";

// The overlay (and the GSAP it animates with) loads on first intent, not with the page.
const loadOverlay = () => import("./IndexOverlay").then((m) => m.IndexOverlay);
const IndexOverlay = dynamic(loadOverlay, { ssr: false });

/**
 * Fixed nav: transparent over the doors, blurred green once scrolled.
 * Hides on scroll down, returns on scroll up.
 */
export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      el.dataset.scrolled = String(y > 24);
      el.dataset.hidden = String(y > 80 && y > last);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const openIndex = () => {
    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <header
        ref={bar}
        data-scrolled="false"
        data-hidden="false"
        className="group fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-out-expo)] data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-b data-[scrolled=true]:border-hairline data-[scrolled=true]:bg-primary/80 data-[scrolled=true]:backdrop-blur-md"
      >
        <nav
          aria-label="Primary"
          className="mx-auto grid h-16 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-10"
        >
          <button
            ref={trigger}
            type="button"
            aria-expanded={open}
            aria-controls="index-overlay"
            onClick={openIndex}
            onPointerEnter={loadOverlay}
            onFocus={loadOverlay}
            className="label group/i -ml-2 flex items-center gap-3 justify-self-start p-2 text-text transition-colors hover:text-gold-light"
          >
            <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3/5 bg-current transition-[width] duration-500 group-hover/i:w-full" />
            </span>
            {nav.index}
          </button>

          <Link href="/" aria-label={brand.title} className="block p-2 text-gold">
            <Wordmark className="h-3 w-auto md:h-[0.9rem]" />
          </Link>

          <Link
            href="/invitation"
            className="label -mr-2 justify-self-end p-2 text-text transition-colors hover:text-gold-light"
          >
            {nav.enquire}
          </Link>
        </nav>
      </header>
      {mounted && <IndexOverlay open={open} onClose={() => setOpen(false)} returnFocus={trigger} />}
    </>
  );
}
