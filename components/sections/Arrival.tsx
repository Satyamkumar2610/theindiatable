"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { LOCKUP, LockupMark } from "@/components/motif/LockupMark";
import { InviteButton } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { arrival, brand, stages } from "@/content/site";
import { canUseWebGL } from "@/lib/motion";
import { onFirstInteraction, useMotion } from "@/lib/use-motion";
import { scrollToTarget } from "@/lib/scroll";

const Silk = dynamic(() => import("@/components/reactbits/Silk"), { ssr: false });

/** "Behind closed doors," / "an open conversation." — split at the comma for the two beats. */
const [LINE1, LINE2] = (() => {
  const h = arrival.headlines[arrival.headline];
  const i = h.indexOf(",");
  return i > 0 ? [h.slice(0, i + 1), h.slice(i + 2)] : [h, ""];
})();

/**
 * [01] The Arrival. The logo is the threshold. On load the lockup assembles:
 * the seat (head), the table (rule), the figure rising, the two T's closing
 * in like doors, then the name. Desktop: scrolling slides the T's apart along
 * the table into two gold pillars, the silk room opens between them and the
 * second half of the line lands.
 */
export function Arrival() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [silk, setSilk] = useState(false);

  // The silk room starts on the visitor's first interaction, never competing with first paint.
  useEffect(() => onFirstInteraction(() => canUseWebGL() && setSilk(true)), []);

  useMotion(root, (el, { gsap, SplitText }, c) => {
    if (!c.desktop) return;
    const q = gsap.utils.selector(el);
    const svg = el.querySelector(".lockup") as HTMLElement;
    const line2 = q(".arrival-line2")[0] as HTMLElement;
    const split = SplitText.create(line2, { type: "words,lines", mask: "lines", aria: "none" });
    gsap.set(q(".arrival-reveal"), { autoAlpha: 1 });

    // Lockup units per CSS pixel, so every move lands at the same place at any size.
    const unit = () => LOCKUP.w / svg.getBoundingClientRect().width;
    const px = (units: number) => () => units / unit();
    const edge = (side: -1 | 1) => () => {
      const r = svg.getBoundingClientRect();
      const tScreen = r.left + (side < 0 ? LOCKUP.tlX : LOCKUP.trX) / unit();
      return window.innerWidth * (side < 0 ? 0.1 : 0.9) - tScreen;
    };
    const ruleScale = () => (window.innerWidth / (LOCKUP.rule.w / unit())) * 1.06;
    const pct = (x: number, y: number) => `${(x / LOCKUP.w) * 100}% ${(y / LOCKUP.h) * 100}%`;

    const tl = gsap.timeline({
      defaults: { ease: "none", immediateRender: false },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // T bases sit at y≈256, the figure's foot at 297, the rule (the table) at 430.
    const toTable = LOCKUP.rule.y - LOCKUP.tBase;
    const figToTable = LOCKUP.rule.y - LOCKUP.figFoot;
    tl.fromTo(q(".lk-word, .lk-tag"), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -14, duration: 0.14 }, 0)
      .fromTo(q(".arrival-cue"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.08 }, 0)
      // The doors: the T's slide apart along the table and stand on it as pillars at the edges.
      .fromTo(q(".lk-tl"), { x: 0, y: 0, scale: 1 }, { x: edge(-1), y: px(toTable), scale: 1.7, transformOrigin: pct(LOCKUP.tlX, LOCKUP.tBase), duration: 0.5, ease: "power2.inOut" }, 0.06)
      .fromTo(q(".lk-tr"), { x: 0, y: 0, scale: 1 }, { x: edge(1), y: px(toTable), scale: 1.7, transformOrigin: pct(LOCKUP.trX, LOCKUP.tBase), duration: 0.5, ease: "power2.inOut" }, 0.06)
      .fromTo(q(".lk-rule"), { scaleX: 1 }, { scaleX: ruleScale, transformOrigin: pct(LOCKUP.rule.x, LOCKUP.rule.y), duration: 0.5, ease: "power2.inOut" }, 0.06)
      .to(q(".arrival-silk"), { opacity: 0.85, duration: 0.5 }, 0.08)
      // The figure steps down to the table, then rises at it.
      .fromTo(q(".lk-fig, .lk-head"), { y: 0 }, { y: px(figToTable), duration: 0.3, ease: "power2.inOut" }, 0.14)
      .to(q(".lk-fig, .lk-head"), { y: px(figToTable - 30), duration: 0.2, ease: "power2.out" }, 0.46)
      // "an open conversation."
      .from(split.words, { yPercent: 110, duration: 0.14, stagger: 0.025, ease: "power3.out", immediateRender: true }, 0.56)
      .fromTo(q(".arrival-after"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.12, immediateRender: true }, 0.78)
      .to({}, { duration: 0.08 });

    return () => split.revert();
  });

  const stage = stages[0];

  return (
    <section
      ref={root}
      id={stage.id}
      data-stage={stage.id}
      aria-labelledby="arrival-title"
      className="arrival relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-primary"
    >
      <div className="arrival-room absolute inset-0 -z-10" aria-hidden="true">
        {silk && <Silk className="arrival-silk absolute inset-0 h-full w-full" />}
        <div className="arrival-vignette absolute inset-0" />
      </div>

      <div className="arrival-stage flex w-full flex-1 flex-col items-center px-6 pt-24 pb-10 text-center md:px-10 lg:pt-[15vh]">
        <LockupMark className="arrival-lockup" title={`${brand.name} — ${brand.tagline}`} />

        <h1 id="arrival-title" className="arrival-title mt-[6vh] font-display text-hero text-text lg:mt-[8vh]">
          <span className="arrival-line1 block">{LINE1}</span>
          <span className="arrival-line2 arrival-reveal block">{LINE2}</span>
        </h1>

        <div className="arrival-after arrival-reveal mt-8 flex flex-col items-center gap-8 lg:mt-10 lg:flex-row lg:gap-14 lg:text-left">
          <p className="max-w-[44ch] text-text-soft lg:max-w-[40ch]">{arrival.subline}</p>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
            <InviteButton href={arrival.cta.href}>{arrival.cta.label}</InviteButton>
            <LinkArrow
              href={arrival.secondary.href}
              dir="down"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(arrival.secondary.href, lenis);
              }}
            >
              {arrival.secondary.label}
            </LinkArrow>
          </div>
        </div>
      </div>

      <div className="arrival-cue" aria-hidden="true">
        <span className="arrival-cue-dot" />
        <span className="label text-text-soft">{arrival.cue}</span>
      </div>
    </section>
  );
}
