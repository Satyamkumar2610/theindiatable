"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { Wordmark } from "@/components/brand/Wordmark";
import { brand, nav } from "@/content/site";

// The overlay (and the GSAP it animates with) loads on first intent, not with the page.
const loadOverlay = () => import("./IndexOverlay").then((m) => m.IndexOverlay);
const IndexOverlay = dynamic(loadOverlay, { ssr: false });

/**
 * Fixed nav. Transparent over the Arrival (whose lockup is the brand), a
 * blurred green layer once scrolled. Hides on scroll down, returns on scroll
 * up, and always returns while focus is inside it.
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

    // The nav's own brand mark stays quiet while the Arrival's lockup is on screen.
    const arrival = document.getElementById("arrival");
    const io = arrival
      ? new IntersectionObserver(([e]) => (el.dataset.brand = String(e.intersectionRatio < 0.35)), {
          threshold: [0, 0.35, 1],
        })
      : null;
    if (arrival && io) io.observe(arrival);
    else el.dataset.brand = "true";

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      io?.disconnect();
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
        data-brand="false"
        className="site-nav group fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-transform duration-700 ease-[var(--ease-out-expo)] focus-within:!translate-y-0 data-[hidden=true]:-translate-y-full"
      >
        <nav
          aria-label="Primary"
          className="relative mx-auto grid h-16 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-10"
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
              <span className="h-px w-3/5 origin-left bg-current transition-transform duration-500 group-hover/i:scale-x-[1.67]" />
            </span>
            {nav.index}
          </button>

          <Link
            href="/"
            aria-label={brand.title}
            translate="no"
            className="nav-brand flex items-center gap-3 p-2 text-gold transition-opacity duration-700 group-data-[brand=false]:pointer-events-none group-data-[brand=false]:opacity-0"
          >
            <Monogram flat className="h-6 w-auto md:h-7" />
            <Wordmark className="hidden h-3 w-auto sm:block md:h-[0.85rem]" />
          </Link>

          <Link
            href={nav.cta.href}
            aria-label={nav.cta.label}
            className="label -mr-2 justify-self-end p-2 text-text transition-colors hover:text-gold-light"
          >
            <span className="md:hidden">{nav.ctaShort}</span>
            <span className="hidden md:inline">{nav.cta.label}</span>
          </Link>
        </nav>
      </header>
      {mounted && <IndexOverlay open={open} onClose={() => setOpen(false)} returnFocus={trigger} />}
    </>
  );
}
