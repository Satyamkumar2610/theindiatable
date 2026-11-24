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
import { Frame } from "@/components/motif/Frame";
import { InviteButton } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { arrival, stages } from "@/content/site";
import { canUseWebGL } from "@/lib/motion";
import { loadMotion } from "@/lib/motion-loader";
import { scrollToTarget } from "@/lib/scroll";

const Silk = dynamic(() => import("@/components/reactbits/Silk"), { ssr: false });
const Dust = dynamic(() => import("@/components/motif/Dust"), { ssr: false });

/** The desktop headline, set on the two leaves and split at the comma. */
const HALVES = {
  l: ["Behind closed", "doors,"],
  r: ["an open", "conversation."],
} as const;

function Leaf({ side, gid }: { side: "l" | "r"; gid: string }) {
  const tPath = side === "l" ? monogramLeftT : monogramRightT;
  return (
    <div className={`door-leaf door-leaf--${side}`}>
      <div className="leaf-face">
        {/* Outer moulding, then a raised and bevelled panel with its own inner line. */}
        <Frame className="leaf-frame text-hairline" />
        <div className="leaf-panel">
          <Frame className="leaf-panel-line text-hairline" />
        </div>
        {/* Cursor light: a soft sheen on the lacquer, and the gold lines brightening near it. */}
        <span className="leaf-spec" />
        <span className="leaf-glint">
          <Frame className="leaf-frame text-gold-light" />
          <span className="leaf-panel leaf-panel--ghost">
            <Frame className="leaf-panel-line text-gold-light" />
          </span>
        </span>
        <span className="leaf-grain" />

        <p className="leaf-words font-display text-text">
          <span>{HALVES[side][0]}</span>
          <span>{HALVES[side][1]}</span>
        </p>

        <span className="leaf-shade" />
      </div>

      {/* The T rides its leaf: the monogram is the door handle. */}
      <svg viewBox={monogramViewBox} className="leaf-t">
        <path d={tPath} fill={`url(#${gid})`} fillRule="evenodd" />
      </svg>

      {/* Leaf thickness, gold-edged, seen only as the door turns. */}
      <span className="leaf-edge" />
    </div>
  );
}

/**
 * [01] The Arrival. Two lacquered, panelled doors; the monogram is the handle,
 * each T on its leaf and the figure standing on the seam. On desktop the
 * scene pins and the doors swing inward on their hinges, the carved headline
 * leaving with them; the room settles, gold dust drifts in the light, the
 * table line draws out from the figure's feet and the headline rises again.
 */
export function Arrival() {
  const root = useRef<HTMLElement>(null);
  const gid = useId();
  const lenis = useLenis();

  // The silk room and dust load only once the doors begin to part, and pause whenever they are shut.
  const [room, setRoomState] = useState<"none" | "live" | "paused">("none");
  const roomRef = useRef(room);
  const setRoom = (open: boolean) => {
    const next = open ? "live" : roomRef.current === "none" ? "none" : "paused";
    if (next !== roomRef.current && (next !== "live" || canUseWebGL())) {
      roomRef.current = next;
      setRoomState(next);
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
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <MetalGradient id={gid} />
        </defs>
      </svg>

      {/* The room behind the doors. */}
      <div className="room absolute inset-0 -z-10" aria-hidden="true">
        <div className="room-poster absolute inset-0" />
        {room !== "none" && (
          <>
            <Silk className="room-silk absolute inset-0 h-full w-full" active={room === "live"} />
            <Dust className="absolute inset-0 h-full w-full" active={room === "live"} />
          </>
        )}
      </div>

      {/* The doorway. */}
      <div className="doorway absolute inset-0" aria-hidden="true">
        <Leaf side="l" gid={gid} />
        <Leaf side="r" gid={gid} />
        <span className="door-seam" />
      </div>

      {/* In front: the figure, the table, the words and the action. */}
      <div className="arrival-front relative z-10 h-full">
        <span className="table-line" aria-hidden="true" />
        <svg viewBox={monogramViewBox} className="door-figure overflow-visible" aria-hidden="true">
          <path d={monogramFigure} fill={`url(#${gid})`} fillRule="evenodd" />
          <path className="door-head" d={monogramHead} fill="var(--color-gold-light)" />
        </svg>
        <span className="mark-sheen" aria-hidden="true" />

        <div className="arrival-copy mx-auto flex h-full max-w-[75rem] flex-col px-6 md:px-10">
          <div className="flex flex-1 items-center justify-center">
            <h1 id="arrival-title" className="arrival-title max-w-[14ch] text-center font-display text-hero text-text">
              {arrival.headlines[arrival.headline]}
            </h1>
          </div>

          <div className="arrival-after flex flex-col items-center gap-8 pb-10 text-center lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-12 lg:text-left">
            <p className="max-w-[40ch] text-text-soft lg:max-w-[46ch]">{arrival.subline}</p>
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-10 lg:shrink-0">
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
          <span className="arrival-cue-track">
            <span className="arrival-cue-fill" />
          </span>
          <span className="label text-text-soft">{arrival.cue}</span>
        </div>
      </div>
    </section>
  );
}
