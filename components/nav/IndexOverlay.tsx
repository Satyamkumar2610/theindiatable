"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useLenis } from "lenis/react";
import { Seal } from "@/components/brand/Seal";
import { InviteButton } from "@/components/ui/Button";
import { nav, stages } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { canUseWebGL, motion } from "@/lib/motion";
import { scrollToTarget } from "@/lib/scroll";

const Silk = dynamic(() => import("@/components/reactbits/Silk"), { ssr: false });

/**
 * The Index: React Bits "Staggered Menu" pattern restyled. Two pre-layers
 * (raised green, then black) sweep down before the items stagger in.
 * Traps focus, closes on Esc, returns focus to the trigger.
 */
export function IndexOverlay({
  open,
  onClose,
  returnFocus,
}: {
  open: boolean;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const [webgl] = useState(() => typeof window !== "undefined" && canUseWebGL());

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(root.current, { autoAlpha: 0 });
      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power3.inOut" },
          onReverseComplete: () => gsap.set(root.current, { autoAlpha: 0 }),
        })
        .set(root.current, { autoAlpha: 1 })
        .fromTo(q(".pre"), { yPercent: -100 }, { yPercent: 0, duration: 0.7, stagger: 0.09 })
        .fromTo(
          q(".item"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: motion.stagger },
          "-=0.35",
        )
        .fromTo(q(".fade"), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: motion.ease }, "-=0.5");
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      if (!reduce) lenis?.stop();
      t.timeScale(1);
      if (reduce) t.progress(1);
      else t.play();
      // Focus once the timeline has made the dialog visible.
      const f = gsap.delayedCall(0.05, () =>
        root.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true }),
      );
      return () => {
        f.kill();
      };
    } else if (t.progress() > 0) {
      if (!reduce) lenis?.start();
      if (reduce) {
        t.progress(0);
        gsap.set(root.current, { autoAlpha: 0 });
      } else t.timeScale(1.8).reverse();
      returnFocus.current?.focus({ preventScroll: true });
    }
  }, [open, lenis, returnFocus]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !root.current) return;
      const f = root.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (id: string) => {
    onClose();
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    // Let the overlay start closing before the page moves.
    window.setTimeout(() => scrollToTarget(`#${id}`, lenis), 120);
  };

  return (
    <div
      ref={root}
      id="index-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[60] overflow-hidden"
      data-lenis-prevent
    >
      <div className="pre absolute inset-0 bg-primary-raised" aria-hidden="true" />
      <div className="pre absolute inset-0 overflow-hidden bg-secondary" aria-hidden="true">
        {webgl && <Silk className="absolute inset-0 h-full w-full opacity-35" active={open} />}
      </div>

      <div className="relative flex h-full flex-col overflow-y-auto">
        <div className="mx-auto grid h-16 w-full max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-10">
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="fade label -ml-2 flex items-center gap-3 justify-self-start p-2 text-text hover:text-gold-light"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
            {nav.close}
          </button>
        </div>

        <div className="mx-auto grid w-full max-w-[90rem] flex-1 gap-14 px-6 pt-8 pb-12 md:px-10 lg:grid-cols-[1fr_22rem] lg:gap-24 lg:pt-12">
          <ol className="flex flex-col">
            {stages.map((s) => (
              <li key={s.id} className="overflow-hidden border-b border-hairline first:border-t">
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  className="item group flex w-full items-baseline gap-5 py-3 text-left md:gap-8 md:py-3.5"
                >
                  <span className="label w-8 shrink-0 text-gold-light">{s.number}</span>
                  <span className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.1] text-text transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:text-gold-light group-focus-visible:text-gold-light">
                    {s.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="fade flex flex-col justify-end gap-12">
            <ul className="flex flex-col gap-2">
              {nav.pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} onClick={onClose} className="text-link label">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-10">
              <Seal className="hidden w-40 lg:block" />
              <InviteButton href={nav.cta.href}>{nav.cta.label}</InviteButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
