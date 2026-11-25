import type { Metadata } from "next";
import { InvitationForm } from "@/components/invitation/InvitationForm";
import { container } from "@/components/ui/Section";
import { invitationForm as copy } from "@/content/site";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: "/invitation" },
};

/** /invitation: the title and standfirst on the green, then the request itself. */
export default function InvitationPage() {
  return (
    <>
      <section data-band data-veil="0.4" aria-labelledby="page-title" className="page-hero relative bg-primary">
        <div className={`${container} pt-36 pb-24 md:pt-44 lg:pt-52 lg:pb-32`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 id="page-title" className="page-hero-title font-display text-h2 text-text lg:col-span-7">
              {copy.title}
            </h1>
            <p className="page-hero-stand max-w-[40ch] text-[1.1875rem] leading-[1.65] text-text-soft lg:col-span-5 lg:pb-3">
              {copy.standfirst}
            </p>
          </div>
          <span className="page-hero-rule mt-16 block h-px bg-gold/60" aria-hidden="true" />
          <div className="mt-16 lg:mt-24">
            <InvitationForm />
          </div>
        </div>
        <span className="seam-veil" aria-hidden="true" />
      </section>
    </>
  );
}
