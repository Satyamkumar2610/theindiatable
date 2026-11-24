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

/** WebGL (Silk-style shader) only on capable, pointer-driven, motion-permitting devices. */
export const canUseWebGL = () => {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (window.matchMedia("(hover: none)").matches) return false;
  if (!window.matchMedia("(min-width: 64rem) and (pointer: fine)").matches) return false;
  const cores = navigator.hardwareConcurrency ?? 2;
  return cores > 4;
};
