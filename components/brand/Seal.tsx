import { useId } from "react";
import { brand } from "@/content/site";
import { MetalGradient } from "./MetalGradient";
import { monogramFigure, monogramHead, monogramLeftT, monogramRightT } from "./paths";

const R = 82; // ring text radius in a 200-unit box
const CIRC = 2 * Math.PI * R;

/**
 * Monogram in a circle, ringed by circular text that turns once every 40s
 * (the role of React Bits Circular Text, built without its motion dependency).
 * Rotation stops under prefers-reduced-motion via the global rule.
 */
export function Seal({ className, rotate = true }: { className?: string; rotate?: boolean }) {
  const id = useId();
  const ring = `${id}-ring`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <MetalGradient id={`${id}-metal`} x2={200} y2={200} />
        <path id={ring} d={`M100,${100 - R} a${R},${R} 0 1,1 -0.01,0`} />
      </defs>
      <circle cx="100" cy="100" r="99.5" fill="none" stroke="var(--color-hairline)" strokeWidth="1" />
      <circle cx="100" cy="100" r="66" fill="none" stroke="var(--color-hairline)" strokeWidth="1" />
      <g
        className={rotate ? "origin-center animate-[spin_40s_linear_infinite]" : undefined}
        style={{ transformBox: "view-box" }}
      >
        <text
          className="fill-gold-light font-label"
          style={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 500 }}
        >
          <textPath href={`#${ring}`} textLength={CIRC - 6} lengthAdjust="spacing">
            {brand.sealRing}
          </textPath>
        </text>
      </g>
      <g transform="translate(62 66) scale(0.228)" fill={`url(#${id}-metal)`} fillRule="evenodd">
        <path d={monogramLeftT} />
        <path d={monogramRightT} />
        <path d={monogramFigure} />
        <path d={monogramHead} />
      </g>
    </svg>
  );
}
