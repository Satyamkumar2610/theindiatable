/**
 * The brushed "metal-gold" sheen (client steer). Only for the monogram, seal and CTA.
 * userSpaceOnUse in monogram units, so split pieces of the mark share one continuous sheen.
 */
export function MetalGradient({ id, x2 = 333, y2 = 305 }: { id: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" style={{ stopColor: "var(--color-gold-light)" }} />
      <stop offset="0.38" style={{ stopColor: "var(--color-gold)" }} />
      <stop offset="0.62" style={{ stopColor: "var(--color-gold-deep)" }} />
      <stop offset="0.82" style={{ stopColor: "var(--color-gold)" }} />
      <stop offset="1" style={{ stopColor: "var(--color-gold-light)" }} />
    </linearGradient>
  );
}
