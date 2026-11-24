import { useId, type ReactNode } from "react";
import { BrushedGrain, MetalGradient } from "@/components/brand/MetalGradient";
import {
  lockupMonogramOffset,
  lockupRule,
  lockupTagline,
  lockupViewBox,
  lockupWord,
  monogramFigure,
  monogramHead,
  monogramLeftT,
  monogramRightT,
} from "@/components/brand/paths";

/**
 * The full lockup from the client's final vectors, as stacked layers that share
 * one viewBox, so each part can move on its own and they still compose the
 * exact mark at rest. Two levels per part: the outer `.lk-*` wrapper is moved
 * by GSAP on scroll; the inner `.lk-in` is animated by CSS on load. They never
 * share a transform. Monogram in polished gold; wordmark flat gold; tagline
 * gold-light (small text).
 */
export const LOCKUP = {
  /** T centres and bases, the figure's foot and the rule, in lockup units. */
  tlX: 324,
  trX: 513.5,
  tBase: 256,
  figFoot: 297,
  rule: { x: 408, y: 430.5, w: 484 },
  w: 790,
  h: 494,
};

function Layer({ part, children, clip }: { part: string; children: ReactNode; clip?: boolean }) {
  const svg = (
    <svg viewBox={lockupViewBox} className="lk-in" overflow="visible" aria-hidden="true">
      {children}
    </svg>
  );
  return <div className={`lk lk-${part}`}>{clip ? <div className="lk-clip">{svg}</div> : svg}</div>;
}

export function LockupMark({ className = "", title }: { className?: string; title?: string }) {
  const id = useId();
  const metal = (k: string) => `${id}-${k}-metal`;
  const grain = (k: string) => `${id}-${k}-grain`;
  const gold = (k: string, d: string) => (
    <>
      <defs>
        <MetalGradient id={metal(k)} />
        <BrushedGrain id={grain(k)} />
      </defs>
      <g transform={`translate(${lockupMonogramOffset} 0)`} filter={`url(#${grain(k)})`}>
        <path d={d} fill={`url(#${metal(k)})`} fillRule="evenodd" />
      </g>
    </>
  );

  return (
    <div
      className={`lockup relative ${className}`}
      style={{ aspectRatio: `${LOCKUP.w} / ${LOCKUP.h}` }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Layer part="rule">
        <path d={lockupRule} fill="var(--color-gold)" />
      </Layer>
      <Layer part="word">
        <path d={lockupWord} fill="var(--color-gold)" fillRule="evenodd" />
      </Layer>
      <Layer part="tag">
        <path d={lockupTagline} fill="var(--color-gold-light)" fillRule="evenodd" />
      </Layer>
      <Layer part="tl">{gold("tl", monogramLeftT)}</Layer>
      <Layer part="tr">{gold("tr", monogramRightT)}</Layer>
      <Layer part="fig" clip>
        {gold("fig", monogramFigure)}
      </Layer>
      <Layer part="head">
        <g transform={`translate(${lockupMonogramOffset} 0)`}>
          <path d={monogramHead} fill="var(--color-gold-light)" />
        </g>
      </Layer>
    </div>
  );
}
