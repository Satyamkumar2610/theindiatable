"use client";

import { useRef } from "react";
import { GradedImage } from "@/components/ui/GradedImage";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { room, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";
import tableImg from "@/public/images/conference-table.jpg";

const [FROM, TO] = room.number.display.split("–");

/**
 * [04] The Room. The photograph is the room: it opens from a narrow aperture
 * to the full screen while the count climbs to 20 (React Bits Count Up
 * pattern, driven by the scroll), then resolves to its range, 20–30. The four
 * kinds of people in it settle along the bottom edge.
 */
export function Room() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[3];

  useMotion(root, (el, { gsap }, c) => {
    const q = gsap.utils.selector(el);
    const countA = q(".count-a")[0] as HTMLElement;
    const counter = { v: 0 };
    const write = () => (countA.textContent = String(Math.round(counter.v)));
    const aperture = q(".room-aperture");
    const img = q(".room-aperture .graded-img");
    // While it counts, "20" stands alone at the centre; the group settles as "–30" arrives.
    const countB = q(".count-b")[0] as HTMLElement;
    const alone = () => countB.offsetWidth / 2;

    if (c.desktop) {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: q(".room-stage")[0], start: "top top", end: "bottom bottom", scrub: true },
        })
        .fromTo(aperture, { clipPath: "inset(26% 37% 26% 37%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, 0)
        .fromTo(img, { scale: 1.5 }, { scale: 1, duration: 0.62, ease: "power2.out" }, 0)
        .fromTo(q(".room-shade"), { opacity: 0.35 }, { opacity: 1, duration: 0.4 }, 0.2)
        .fromTo(counter, { v: 0 }, { v: room.number.from, duration: 0.48, ease: "power1.out", onUpdate: write }, 0.04)
        .fromTo(q(".room-count"), { x: alone }, { x: 0, duration: 0.14, ease: "power2.inOut" }, 0.52)
        .fromTo(q(".count-b"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.12, ease: "power2.out" }, 0.54)
        .fromTo(q(".room-unit"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.6)
        .fromTo(q(".room-ledger"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power2.inOut" }, 0.66)
        .fromTo(q(".room-seg"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.035, ease: "power2.out" }, 0.7)
        .to({}, { duration: 0.1 });
      return;
    }

    gsap
      .timeline({ scrollTrigger: { trigger: q(".room-stage")[0], start: "top 75%" } })
      .fromTo(aperture, { clipPath: "inset(14% 18% 14% 18%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out" })
      .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0)
      .fromTo(counter, { v: 0 }, { v: room.number.from, duration: 1.4, ease: "power2.out", onUpdate: write }, 0.2)
      .fromTo(q(".room-count"), { x: alone }, { x: 0, duration: 0.9, ease: "expo.inOut" }, 1.3)
      .fromTo(q(".count-b"), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "expo.out" }, 1.4)
      .fromTo(q(".room-unit"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 1.3)
      .fromTo(q(".room-seg"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power2.out" }, 0.5);
  });

  return (
    <Section ref={root} stage={stage} ground="black">
      <div className={`${container} pt-40 pb-20 lg:pt-56 lg:pb-28`}>
        <RunningHead stage={stage} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="room-title" className="font-display text-h2 text-text lg:col-span-7">
            {room.headline}
          </h2>
          <p className="measure text-text-soft lg:col-span-5">{room.body}</p>
        </div>
      </div>

      <div className="room-stage scene" style={{ ["--scene-h" as string]: "260svh" }}>
        <div className="scene-pin relative px-6 pb-32 md:px-10 lg:h-svh lg:overflow-hidden lg:p-0">
          <div className="room-aperture relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
            <GradedImage
              src={tableImg}
              alt={room.imageAlt}
              fill
              sizes="100vw"
              placeholder="blur"
              className="h-full w-full"
            />
            <span className="room-shade pointer-events-none absolute inset-0" aria-hidden="true" />

            <p className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="sr-only">
                {room.number.display} {room.numberLabel}
              </span>
              <span className="room-count inline-block font-display leading-[0.9] text-text" aria-hidden="true">
                <span className="count-a inline-block min-w-[2ch] text-right tabular-nums">{FROM}</span>
                <span className="count-b inline-block">–{TO}</span>
              </span>
              <span className="room-unit label mt-6 block text-gold-light" aria-hidden="true">
                {room.numberLabel}
              </span>
            </p>

            {/* Desktop: the four kinds of people sit along the bottom edge, as a ledger. */}
            <div className="room-ledger absolute inset-x-0 bottom-0 hidden border-t border-hairline lg:block">
              <ul className={`${container} grid grid-cols-4`}>
                {room.segments.map((s) => (
                  <li key={s} className="room-seg label border-l border-hairline px-10 py-8 text-text first:border-l-0 first:pl-0">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="mt-10 grid grid-cols-2 border-t border-hairline lg:hidden">
            {room.segments.map((s, i) => (
              <li key={s} className={`room-seg label py-5 text-text-soft ${i % 2 ? "pl-5" : "border-r border-hairline"} ${i > 1 ? "border-t border-hairline" : ""}`}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
