import { Seal } from "@/components/brand/Seal";
import { Band } from "@/components/page/Band";
import { InviteButton } from "@/components/ui/Button";
import { container } from "@/components/ui/Section";
import { engagement, invitation } from "@/content/site";

/** The close of an inner page: the seal, the invitation line and the one gold action. */
export function CloseBand({ ground = "black" }: { ground?: "green" | "black" }) {
  return (
    <Band ground={ground} labelledBy="close-title">
      <div className={`${container} flex flex-col items-center py-32 text-center lg:py-44`}>
        <Seal className="w-28 md:w-32" />
        <h2 id="close-title" className="mt-12 font-display text-statement text-text">
          {engagement.headline}
        </h2>
        <p className="mt-6 max-w-[44ch] text-text-soft">{engagement.body}</p>
        <InviteButton href={engagement.cta.href} className="mt-12">
          {engagement.cta.label}
        </InviteButton>
        <p className="mt-8 max-w-[36ch] text-[0.95rem] text-text-soft">{invitation.promise}</p>
      </div>
    </Band>
  );
}
