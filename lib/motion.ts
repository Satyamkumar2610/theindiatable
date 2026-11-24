/** Single source for motion values. Brief §7. */
export const motion = {
  ease: "power2.out",
  scrubEase: "none",
  reveal: 0.7,
  stagger: 0.06,
  revealY: 12,
  revealStart: "top 85%",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * WebGL silk: any device that permits motion, has more than 4 cores and is not
 * asking to save data. Phones included (rendered at low resolution, 30fps,
 * started on first interaction); everything else keeps the CSS room.
 */
export const canUseWebGL = () => {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  return (navigator.hardwareConcurrency ?? 2) > 4;
};
