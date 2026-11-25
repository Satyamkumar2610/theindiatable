import type { ReactNode } from "react";
import { SeamLine, SeamVeil } from "@/components/ui/Seam";

/**
 * One full-width band of an inner page. Grounds switch green ↔ black, and the
 * gold hairline at the top edge draws open as the band arrives (SectionSeams).
 * `veil` is how far the band dims as the next one rises over it: reading pages
 * keep it light so the last lines of a chapter stay legible.
 */
export function Band({
  id,
  ground,
  labelledBy,
  veil = 0.4,
  className = "",
  children,
}: {
  id?: string;
  ground: "green" | "black";
  labelledBy?: string;
  veil?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-band
      data-veil={veil}
      aria-labelledby={labelledBy}
      className={`relative ${ground === "green" ? "bg-primary" : "bg-secondary"} ${className}`}
    >
      <SeamLine />
      {children}
      <SeamVeil />
    </section>
  );
}
