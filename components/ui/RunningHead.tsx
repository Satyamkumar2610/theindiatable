import { eyebrow, type Stage } from "@/content/site";

/** The brief's stage label ("[ 02 — THE IDEA ]"), demoted: small, soft, in the content column. */
export function RunningHead({ stage, className = "" }: { stage: Stage; className?: string }) {
  return (
    <p className={`stage-label ${className}`} aria-hidden="true">
      {eyebrow(stage)}
    </p>
  );
}
