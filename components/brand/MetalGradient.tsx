/**
 * Polished brushed gold (client steer). One light, key from the top-left, with
 * a thin hot band: the band is what reads as polish rather than tan print.
 * Every stop is derived from the gold / gold-light / black / white tokens.
 * Only the monogram, seal and CTA use it; small gold stays flat gold-light.
 * userSpaceOnUse, so split pieces of one mark share one continuous light.
 */
export function MetalGradient({ id, w = 333, h = 305 }: { id: string; w?: number; h?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h * 0.42}>
      <stop offset="0" style={{ stopColor: "var(--color-gold-shadow)" }} />
      <stop offset="0.3" style={{ stopColor: "var(--color-gold-deep)" }} />
      <stop offset="0.46" style={{ stopColor: "var(--color-gold-light)" }} />
      <stop offset="0.49" style={{ stopColor: "var(--color-gold-hot)" }} />
      <stop offset="0.54" style={{ stopColor: "var(--color-gold)" }} />
      <stop offset="0.78" style={{ stopColor: "var(--color-gold-deep)" }} />
      <stop offset="1" style={{ stopColor: "var(--color-gold-light)" }} />
    </linearGradient>
  );
}

/**
 * Fine horizontal brushing, composited inside the glyph only. For large gold
 * (monogram at hero size, seal); never on small marks.
 */
export function BrushedGrain({ id }: { id: string }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" seed="7" result="n" />
      <feColorMatrix
        in="n"
        values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.22 -0.04"
        result="streaks"
      />
      <feComposite in="streaks" in2="SourceGraphic" operator="in" result="brushed" />
      <feBlend in="brushed" in2="SourceGraphic" mode="soft-light" />
    </filter>
  );
}
