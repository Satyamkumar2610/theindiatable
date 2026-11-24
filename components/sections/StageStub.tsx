import { Section } from "@/components/ui/Section";
import type { Stage } from "@/content/site";

/**
 * Phase 1 placeholder for stages 02–08: real headline from content/site.ts only,
 * so the nav, index rail and overlay can be exercised. Replaced in Phase 2.
 */
export function StageStub({ stage, ground, headline }: { stage: Stage; ground: "green" | "black"; headline: string }) {
  return (
    <Section stage={stage} ground={ground} className="min-h-[70svh]">
      <h2 id={`${stage.id}-title`} className="max-w-[16ch] font-display text-h2 text-text">
        {headline}
      </h2>
    </Section>
  );
}
