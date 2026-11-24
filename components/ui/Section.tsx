import { forwardRef, type ReactNode } from "react";
import type { Stage } from "@/content/site";

export const container = "mx-auto w-full max-w-[75rem] px-6 md:px-10 xl:px-0";

/**
 * One home stage. Grounds alternate green / black; the 1px gold hairline at the
 * top edge is what separates them (they are only 1.3:1 apart).
 */
export const Section = forwardRef<
  HTMLElement,
  { stage: Stage; ground: "green" | "black"; children: ReactNode; className?: string }
>(function Section({ stage, ground, children, className = "" }, ref) {
  return (
    <section
      ref={ref}
      id={stage.id}
      aria-labelledby={`${stage.id}-title`}
      data-stage={stage.id}
      className={`relative border-t border-hairline ${ground === "green" ? "bg-primary" : "bg-secondary"} ${className}`}
    >
      {children}
    </section>
  );
});
