"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Portrait } from "@/components/people/Portrait";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { people, stages, type Founder } from "@/content/site";
import { tokens } from "@/lib/tokens";
import { useMotion } from "@/lib/use-motion";

const TiltedCard = dynamic(() => import("@/components/reactbits/TiltedCard"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-primary" />,
});

/**
 * [07] The People Behind It. Three place cards on paper-white. Each card tilts
 * gently (React Bits Tilted Card, 3°) and opens a biography that zooms out of it.
 */
export function People() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Founder | null>(null);
  const lenis = useLenis();
  const stage = stages[6];

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lenis?.stop();
    }
    const onClose = () => {
      setOpen(null);
      lenis?.start();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, [open, lenis]);

  useMotion(root, (el, { gsap }) => {
    const q = gsap.utils.selector(el);
    gsap.from(q(".founder"), {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: q(".founders")[0], start: "top 80%" },
    });
  });

  return (
    <Section ref={root} stage={stage} ground="green" className="paper py-40 lg:py-56">
      <div className={container}>
        <RunningHead stage={stage} className="!text-primary-raised" />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="people-title" className="font-display text-h2 text-primary lg:col-span-7">
            {people.headline}
          </h2>
        </div>

        <ul className="founders mt-20 grid gap-16 md:grid-cols-3 md:gap-8 lg:mt-28 lg:gap-12">
          {people.founders.map((f) => (
            <li key={f.slug} className="founder">
              <div className="aspect-[4/5] w-full">
                <TiltedCard
                  containerWidth="100%"
                  containerHeight="100%"
                  imageWidth="100%"
                  imageHeight="100%"
                  rotateAmplitude={3}
                  scaleOnHover={1.02}
                  glare={0.18}
                  glareColor={tokens.goldLight}
                  shadow={0.25}
                  radius={0}
                  showTooltip={false}
                  intro={false}
                  gyroscope={false}
                  flipOnClick={false}
                  captionText={`${people.readBio}: ${f.name}`}
                  onClick={() => setOpen(f)}
                >
                  <span className="portrait-ground absolute inset-0" aria-hidden="true" />
                  <Portrait f={f} />
                </TiltedCard>
              </div>
              <h3 className="mt-8 text-h3 text-primary">{f.name}</h3>
              <p className="mt-3 max-w-[32ch] text-primary-raised">{f.oneLiner}</p>
              <button type="button" onClick={() => setOpen(f)} className="text-link label mt-6 !text-primary hover:!text-primary-raised">
                {people.readBio}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="bio-dialog"
        aria-labelledby="bio-title"
        data-lenis-prevent
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            dialog.current?.close();
          }
        }}
      >
        {open && (
          <div className="grid max-h-[88svh] overflow-y-auto md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="relative aspect-[4/5] bg-primary md:aspect-auto">
              <Portrait f={open} big />
            </div>
            <div className="flex flex-col p-8 md:p-14">
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="label self-end p-2 text-primary hover:text-primary-raised"
                autoFocus
              >
                {people.closeBio}
              </button>
              <h3 id="bio-title" className="mt-6 text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.05] text-primary">
                {open.name}
              </h3>
              <p className="label mt-4 text-primary-raised">{open.oneLiner}</p>
              <span className="mt-8 block h-px w-10 bg-gold" aria-hidden="true" />
              <div className="mt-8 space-y-5 text-primary-raised">
                {open.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </Section>
  );
}
