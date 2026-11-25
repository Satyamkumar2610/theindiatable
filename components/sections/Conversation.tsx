"use client";

import { useRef } from "react";
import type { StaticImageData } from "next/image";
import { GradedImage } from "@/components/ui/GradedImage";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { conversation, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";
import pen from "@/public/images/pen.jpg";
import hall from "@/public/images/hall.jpg";
import column from "@/public/images/column.jpg";
import chairs from "@/public/images/chairs.jpg";

/** One photograph per beat, in the order of conversation.cards. */
const PHOTOS: StaticImageData[] = [pen, hall, column, chairs];
const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * [05] The Conversation. The format in four beats. Desktop: the stage holds
 * still while each beat takes the light in the list and its photograph wipes
 * up over the last one in a single tall frame. Phones: four beats in order,
 * each photograph opening as it arrives.
 */
export function Conversation() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[4];

  useMotion(root, (el, { gsap }, c) => {
    const q = gsap.utils.selector(el);

    if (c.desktop) {
      const beats = q(".conv-beat") as HTMLElement[];
      const frames = q(".conv-frame") as HTMLElement[];
      const imgs = frames.map((f) => f.querySelector(".graded-img"));
      const n = beats.length;

      gsap.set(beats.slice(1), { opacity: 0.28 });
      gsap.set(frames.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q(".conv-stage")[0], start: "top top", end: "bottom bottom", scrub: true },
      });
      tl.fromTo(q(".conv-progress"), { scaleX: 1 / n }, { scaleX: 1, duration: 1 }, 0);
      // Each photograph drifts slowly for the whole time it is on screen.
      imgs.forEach((img, i) => tl.fromTo(img, { scale: 1.18 }, { scale: 1.02, duration: 0.42 }, Math.max(0, i * 0.25 - 0.1)));
      for (let i = 1; i < n; i++) {
        const at = i * 0.25 - 0.08;
        tl.to(frames[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.14, ease: "power3.inOut" }, at)
          .to(imgs[i - 1], { yPercent: -6, duration: 0.14, ease: "power3.inOut" }, at)
          .to(beats[i - 1], { opacity: 0.28, duration: 0.08 }, at + 0.03)
          .to(beats[i], { opacity: 1, duration: 0.08 }, at + 0.05);
      }
      // The frame counter follows the beat that holds the light.
      const index = q(".conv-index")[0] as HTMLElement;
      tl.eventCallback("onUpdate", () => {
        const i = Math.min(n - 1, Math.floor((tl.progress() + 0.02) / 0.25));
        const label = pad(i);
        if (index.textContent !== label) index.textContent = label;
      });
      return () => (index.textContent = pad(0));
    }

    (q(".conv-item") as HTMLElement[]).forEach((item) => {
      gsap
        .timeline({ scrollTrigger: { trigger: item, start: "top 80%" } })
        .fromTo(item.querySelector(".conv-mframe"), { clipPath: "inset(18% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" })
        .fromTo(item.querySelector(".graded-img"), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
        .fromTo(item.querySelectorAll(".conv-text > *"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 0.25);
    });
  });

  return (
    <Section ref={root} stage={stage} ground="green">
      <div className="conv-stage scene" style={{ ["--scene-h" as string]: "340svh" }}>
        <div className="scene-pin lg:h-svh">
          <div className={`${container} grid gap-16 py-32 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-0`}>
            <div className="lg:col-span-5">
              <RunningHead stage={stage} />
              <h2 id="conversation-title" className="mt-10 font-display text-statement text-text">
                {conversation.headline}
              </h2>

              <ol className="mt-14 grid gap-14 lg:mt-[6svh] lg:gap-[3.2svh]">
                {conversation.cards.map((card, i) => (
                  <li key={card.label} className="conv-item conv-beat">
                    <div className="conv-mframe relative mb-8 aspect-[4/3] overflow-hidden lg:hidden">
                      <GradedImage src={PHOTOS[i]} alt={card.imageAlt} fill sizes="100vw" placeholder="blur" className="h-full w-full" />
                    </div>
                    <div className="conv-text grid grid-cols-[2.75rem_1fr] items-baseline gap-y-2">
                      <span className="label text-gold-light" aria-hidden="true">
                        {pad(i)}
                      </span>
                      <h3 className="text-h3 text-text">{card.label}</h3>
                      <p className="col-start-2 max-w-[38ch] text-text-soft">{card.line}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {conversation.noteConfirmed && <p className="stage-label mt-12">{conversation.note}</p>}
            </div>

            <figure className="relative hidden lg:col-span-6 lg:col-start-7 lg:block" aria-hidden="true">
              <div className="relative h-[74svh] overflow-hidden">
                {conversation.cards.map((card, i) => (
                  <div key={card.label} className="conv-frame absolute inset-0" style={{ zIndex: i }}>
                    <GradedImage src={PHOTOS[i]} alt="" fill sizes="45vw" placeholder="blur" className="h-full w-full" />
                  </div>
                ))}
              </div>
              <figcaption className="mt-5 flex items-center gap-6">
                <span className="label tabular-nums text-text">
                  <span className="conv-index">01</span>
                  <span className="text-text-soft"> / {pad(conversation.cards.length - 1)}</span>
                </span>
                <span className="relative h-px flex-1 bg-hairline">
                  <span className="conv-progress absolute inset-0 origin-left bg-gold" />
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </Section>
  );
}
