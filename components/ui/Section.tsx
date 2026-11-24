import type { ReactNode } from "react";
import type { Stage } from "@/content/site";
import { RunningHead } from "./RunningHead";

export const container = "mx-auto w-full max-w-[75rem] px-6 md:px-10 lg:pr-16 lg:pl-32 2xl:px-0";

/**
 * One home stage. Grounds alternate green / black; the 1px gold hairline at the
 * top edge is what separates them (they are only 1.3:1 apart).
 */
export function Section({
  stage,
  ground,
  children,
  className = "",
}: {
  stage: Stage;
  ground: "green" | "black";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={stage.id}
      aria-labelledby={`${stage.id}-title`}
      data-stage={stage.id}
      className={`relative border-t border-hairline ${ground === "green" ? "bg-primary" : "bg-secondary"} ${className}`}
    >
      <div className={`${container} pt-8 pb-28 md:pt-10 lg:pb-40`}>
        <RunningHead stage={stage} />
        <div className="pt-20 lg:pt-32">{children}</div>
      </div>
    </section>
  );
}
