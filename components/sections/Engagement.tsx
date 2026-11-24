"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LockupMark } from "@/components/motif/LockupMark";
import { InviteButton } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { engagement, invitation, stages } from "@/content/site";
import { canUseWebGL } from "@/lib/motion";
import { onFirstInteraction, useMotion } from "@/lib/use-motion";

const Silk = dynamic(() => import("@/components/reactbits/Silk"), { ssr: false });

/**
 * [08] Engagement. The bookend: the silk room returns and the mark reassembles
 * whole (seat, table, figure, the T's closing). "The table is set." The one
 * gold action sits on the table's rule.
 */
export function Engagement() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[7];
  const [silk, setSilk] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = false;
    let touched = false;
    const go = () => seen && touched && canUseWebGL() && setSilk(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        seen = true;
        go();
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    const off = onFirstInteraction(() => {
      touched = true;
      go();
    });
    return () => {
      io.disconnect();
      off();
    };
  }, []);

  useMotion(root, (el, { gsap }) => {
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ scrollTrigger: { trigger: el.querySelector(".lockup"), start: "top 75%" } })
      .from(q(".lk-head"), { scale: 0.3, autoAlpha: 0, transformOrigin: "53% 4.6%", duration: 0.8, ease: "expo.out" })
      .from(q(".lk-rule"), { scaleX: 0, transformOrigin: "51.6% 87.1%", duration: 1.1, ease: "expo.out" }, 0.2)
      .from(q(".lk-fig .lk-in"), { yPercent: 61, duration: 1, ease: "expo.out" }, 0.5)
      .from(q(".lk-tl"), { xPercent: -11.4, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.85)
      .from(q(".lk-tr"), { xPercent: 11.4, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.85)
      .from(q(".lk-word, .lk-tag"), { autoAlpha: 0, y: 8, duration: 1, stagger: 0.25, ease: "power2.out" }, 1.2)
      .from(q(".eng-copy > *"), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 1.4);
  });

  return (
    <Section ref={root} stage={stage} ground="black" className="isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {silk && <Silk className="eng-silk absolute inset-0 h-full w-full" />}
        <div className="arrival-vignette absolute inset-0" />
      </div>

      <div className={`${container} flex min-h-svh flex-col items-center justify-center py-28 text-center lg:py-40`}>
        <RunningHead stage={stage} />
        <LockupMark className="lockup--static mt-14 w-[min(70vw,24rem)]" />

        <div className="eng-copy mt-16 flex flex-col items-center">
          <h2 id="engagement-title" className="font-display text-[clamp(3rem,8vw,7rem)] leading-[1.02] text-text">
            {engagement.headline}
          </h2>
          <p className="mt-8 max-w-[44ch] text-text-soft">{engagement.body}</p>

          {/* The action sits on the table. */}
          <div className="relative mt-14 flex w-full max-w-[40rem] items-center justify-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-gold/50" aria-hidden="true" />
            <InviteButton href={engagement.cta.href} className="relative">
              {engagement.cta.label}
            </InviteButton>
          </div>

          <ul className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
            {engagement.intents.map((i) => (
              <li key={i.intent}>
                <LinkArrow href={i.href}>{i.label}</LinkArrow>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-[36ch] text-[0.95rem] text-text-soft">{invitation.promise}</p>
        </div>
      </div>
    </Section>
  );
}
