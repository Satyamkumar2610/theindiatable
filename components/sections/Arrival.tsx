"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { MetalGradient } from "@/components/brand/MetalGradient";
import {
  monogramFigure,
  monogramHead,
  monogramLeftT,
  monogramRightT,
  monogramViewBox,
} from "@/components/brand/paths";
import { InviteButton } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { arrival, stages } from "@/content/site";
import { canUseWebGL } from "@/lib/motion";
import { loadMotion } from "@/lib/motion-loader";
import { scrollToTarget } from "@/lib/scroll";

const Silk = dynamic(() => import("@/components/reactbits/Silk"), { ssr: false });

/**
 * [01] The Arrival. Two lacquered door leaves meet on a gold seam; the monogram
 * is the handle: each T rides its leaf and the figure stands on the seam. On
 * desktop the scene pins and the doors part on scroll, leaving the figure
 * standing in the room; the headline then resets word by word.
 */
export function Arrival() {
  const root = useRef<HTMLElement>(null);
  const gid = useId();
  const lenis = useLenis();
  // The silk room loads only once the doors begin to part, and pauses whenever they are shut.
  const [silk, setSilk] = useState<"none" | "live" | "paused">("none");
  const silkRef = useRef(silk);
  const setRoom = (open: boolean) => {
    const next = open ? "live" : silkRef.current === "none" ? "none" : "paused";
    if (next !== silkRef.current && (next !== "live" || canUseWebGL())) {
      silkRef.current = next;
      setSilk(next);
    }
  };

  useEffect(() => {
    let alive = true;
    let revert: (() => void) | undefined;
    Promise.all([loadMotion(), import("./arrival-motion")]).then(([, m]) => {
      if (alive && root.current) revert = m.setupArrival(root.current, setRoom);
    });
    return () => {
      alive = false;
      revert?.();
    };
  }, []);

  const stage = stages[0];

  return (
    <section
      ref={root}
      id={stage.id}
      data-stage={stage.id}
      aria-labelledby="arrival-title"
      className="arrival relative isolate h-svh min-h-[40rem] overflow-hidden bg-secondary"
    >
      {/* The room behind the doors. */}
      <div className="room absolute inset-0 -z-10 opacity-0" aria-hidden="true">
        {silk !== "none" && <Silk className="h-full w-full" active={silk === "live"} />}
      </div>

      {/* Door leaves. */}
      <div aria-hidden="true">
        <div className="door-leaf door-leaf--l absolute inset-y-0 left-0 w-1/2">
          <span className="absolute top-20 bottom-5 right-3 left-5 border border-hairline md:top-24 md:bottom-8 md:right-5 md:left-8" />
        </div>
        <div className="door-leaf door-leaf--r absolute inset-y-0 right-0 w-1/2">
          <span className="absolute top-20 bottom-5 right-5 left-3 border border-hairline md:top-24 md:bottom-8 md:right-8 md:left-5" />
        </div>
        <span className="door-seam absolute top-20 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gold/70 md:top-24" />
      </div>

      {/* Copy column, with the monogram as the door handle. */}
      <div className="relative z-10 mx-auto flex h-full max-w-[75rem] flex-col items-center justify-center px-6 pt-16 pb-10 text-center md:px-10">
        <div
          className="relative mb-8 aspect-[333/305] w-[clamp(7.5rem,14vw,12.5rem)] md:mb-12"
          aria-hidden="true"
        >
          <svg width="0" height="0" className="absolute">
            <defs>
              <MetalGradient id={gid} />
              <linearGradient
                id={`${gid}-sheen`}
                className="door-sheen"
                gradientUnits="userSpaceOnUse"
                x1="-333"
                y1="0"
                x2="0"
                y2="0"
              >
                <stop offset="0" stopColor="white" stopOpacity="0" />
                <stop offset="0.5" stopColor="white" stopOpacity="0.28" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          {(
            [
              ["door-t door-t--l", monogramLeftT],
              ["door-t door-t--r", monogramRightT],
            ] as const
          ).map(([cls, d]) => (
            <svg key={cls} viewBox={monogramViewBox} className={`${cls} absolute inset-0 h-full w-full`}>
              <path d={d} fill={`url(#${gid})`} fillRule="evenodd" />
              <path d={d} fill={`url(#${gid}-sheen)`} fillRule="evenodd" />
            </svg>
          ))}
          <svg viewBox={monogramViewBox} className="door-figure absolute inset-0 h-full w-full overflow-visible">
            <path d={monogramFigure} fill={`url(#${gid})`} fillRule="evenodd" />
            <path className="door-head" d={monogramHead} fill="var(--color-gold-light)" />
          </svg>
        </div>

        <h1
          id="arrival-title"
          className="arrival-title max-w-[14ch] font-display text-hero text-text"
        >
          {arrival.headlines[arrival.headline]}
        </h1>

        <div className="arrival-after mt-6 flex flex-col items-center md:mt-8">
          <p className="max-w-[40ch] text-text-soft">{arrival.subline}</p>
          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:gap-10">
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
    </section>
  );
}
