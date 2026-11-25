"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { GradedImage } from "@/components/ui/GradedImage";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { distinction, stages } from "@/content/site";
import { tokens } from "@/lib/tokens";
import { useMotion } from "@/lib/use-motion";
import boardroom from "@/public/images/boardroom.jpg";

// Below the fold: React Bits Spotlight Card loads as its own chunk; the cards still render on the server.
const SpotlightCard = dynamic(() => import("@/components/reactbits/SpotlightCard"));

/** "Not a conference." / "Not a panel." / "A table." */
const LINES = distinction.headline.split(/(?<=\.)\s/);

/**
 * [03] The Distinction. What it is not passes through a single line, while a
 * gold slit waits beside it like a door ajar. "A table." arrives and the slit
 * opens onto the room.
 */
export function Distinction() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[2];

  useMotion(root, (el, { gsap }, c) => {
    const q = gsap.utils.selector(el);
    const lines = q(".dist-line") as HTMLElement[];
    const slot = q(".dist-lines")[0] as HTMLElement;

    if (c.desktop) {
      slot.classList.add("is-slot");
      gsap.set(lines.slice(1), { yPercent: 115 });
      gsap.set(lines, { opacity: 1 });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q(".dist-stage")[0], start: "top top", end: "bottom bottom", scrub: true },
        })
        .fromTo(q(".dist-slit"), { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: "power2.inOut" }, 0.04)
        .to(lines[0], { yPercent: -115, duration: 0.1, ease: "power2.inOut" }, 0.26)
        .to(lines[1], { yPercent: 0, duration: 0.1, ease: "power2.inOut" }, 0.26)
        .to(lines[1], { yPercent: -115, duration: 0.1, ease: "power2.inOut" }, 0.48)
        .to(lines[2], { yPercent: 0, duration: 0.1, ease: "power2.inOut" }, 0.48)
        .fromTo(
          q(".dist-window"),
          { clipPath: "inset(50% 0% 50% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.32, ease: "power3.inOut" },
          0.52,
        )
        .fromTo(q(".dist-window img"), { scale: 1.3 }, { scale: 1, duration: 0.42, ease: "power2.out" }, 0.52)
        .to(q(".dist-slit"), { autoAlpha: 0, duration: 0.06 }, 0.58)
        .to({}, { duration: 0.1 });
      return () => slot.classList.remove("is-slot");
    }

    gsap
      .timeline({ scrollTrigger: { trigger: q(".dist-window")[0], start: "top 80%" } })
      .fromTo(q(".dist-window"), { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut" })
      .fromTo(q(".dist-window img"), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0);
  });

  useMotion(root, (el, { gsap }) => {
    const q = gsap.utils.selector(el);
    gsap.from(q(".principle"), {
      y: 24,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: { trigger: q(".principles")[0], start: "top 80%" },
    });
  });

  return (
    <Section ref={root} stage={stage} ground="green">
      <div className="dist-stage scene relative" style={{ ["--scene-h" as string]: "220svh" }}>
        <div className="scene-pin py-32 lg:flex lg:h-svh lg:items-center lg:py-0">
          <div className={`${container} grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10`}>
            <div className="lg:col-span-7">
              <RunningHead stage={stage} />
              <h2 id="distinction-title" className="sr-only">
                {distinction.headline}
              </h2>
              <p className="dist-lines mt-10 font-display text-h2 text-text lg:whitespace-nowrap" aria-hidden="true">
                {LINES.map((l, i) => (
                  <span key={l} className={`dist-line block ${i < 2 ? "dist-not" : ""}`}>
                    {l}
                  </span>
                ))}
              </p>
            </div>

            <div className="relative lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
              <span className="dist-slit absolute inset-x-0 top-1/2 z-10 hidden h-px bg-gold lg:block" aria-hidden="true" />
              <GradedImage
                src={boardroom}
                alt="A long boardroom table set with chairs, empty, in perspective."
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur"
                className="dist-window aspect-[4/5] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${container} pt-12 pb-40 lg:pb-56`}>
        <ul className="principles grid gap-px bg-hairline md:grid-cols-2">
          {distinction.principles.map((p) => (
            <li key={p.title} className="principle">
              <SpotlightCard
                theme="light"
                spotlightColor={tokens.gold}
                intensity={0.9}
                spotlightSize={320}
                borderGlow={0}
                className="h-full p-10 md:p-14 lg:min-h-[22rem]"
                style={{ ["--spotlight-card-surface" as string]: "var(--color-text)", ["--spotlight-card-border" as string]: "transparent" }}
              >
                <h3 className="max-w-[16ch] text-h3 text-primary">{p.title}</h3>
                <span className="mt-8 block h-px w-10 bg-gold" aria-hidden="true" />
                <p className="mt-8 max-w-[42ch] text-primary-raised">{p.body}</p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
