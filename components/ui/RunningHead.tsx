import { eyebrow, type Stage } from "@/content/site";

/**
 * The stage label set as a running head on the section's gold rule (like a
 * book's running head), not stacked over the heading as a kicker.
 */
export function RunningHead({ stage, className = "" }: { stage: Stage; className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`} aria-hidden="true">
      <span className="label whitespace-nowrap text-gold-light">{eyebrow(stage)}</span>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}
