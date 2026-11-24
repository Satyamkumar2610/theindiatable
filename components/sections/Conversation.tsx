"use client";

import { useRef } from "react";
import { Table } from "@/components/motif/Table";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { conversation, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";

/**
 * [05] The Conversation. The table tells the format in four beats: the one
 * issue placed at its centre, the room closed, the head of the table lit for
 * the senior voices, then the light passing from seat to seat.
 */
export function Conversation() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[4];

  useMotion(root, (el, { gsap }, c) => {
    if (!c.desktop) return;
    const q = gsap.utils.selector(el);
    const cards = q(".conv-card") as HTMLElement[];
    const seats = Array.from(el.querySelectorAll<SVGCircleElement>(".conv-table .seat"));
    // Seats in conversational order: around the table, not across it.
    const around = [
      ...seats.filter((_, i) => i < 28 && i % 2 === 0),
      ...seats.slice(28),
      ...seats.filter((_, i) => i < 28 && i % 2 === 1).reverse(),
    ];

    gsap.set(cards.slice(1), { autoAlpha: 0, y: 24 });
    gsap.set(q(".conv-dot"), { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(q(".conv-table .table-top"), { strokeDasharray: "1", strokeDashoffset: 1 });
    gsap.set(q(".conv-table .table-head"), { opacity: 0.35 });
    gsap.set(seats, { opacity: 0.25 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top top", end: "+=150%", pin: true, scrub: 1 },
    });
    const swap = (i: number, at: number) =>
      tl
        .to(cards[i - 1], { autoAlpha: 0, y: -24, duration: 0.06 }, at)
        .to(cards[i], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, at + 0.04);

    tl.to(q(".conv-dot"), { scale: 1, duration: 0.1, ease: "back.out(2)" }, 0.04)
      .to(q(".conv-table .table-top"), { strokeDashoffset: 0, duration: 0.18, ease: "power2.inOut" }, 0.24);
    swap(1, 0.22);
    tl.to(q(".conv-table .table-head"), { opacity: 1, strokeWidth: 5, duration: 0.14 }, 0.48);
    swap(2, 0.46);
    swap(3, 0.7);
    around.forEach((s, i) => {
      const at = 0.72 + (i / around.length) * 0.24;
      tl.to(s, { opacity: 1, fill: "var(--color-gold-light)", duration: 0.02 }, at).to(s, { opacity: 0.55, duration: 0.04 }, at + 0.02);
    });
    tl.to({}, { duration: 0.04 });
  });

  return (
    <Section ref={root} stage={stage} ground="green" className="lg:h-svh">
      <div className={`${container} grid gap-16 py-28 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0`}>
        <div className="lg:col-span-5">
          <RunningHead stage={stage} />
          <h2 id="conversation-title" className="mt-10 font-display text-h2 text-text">
            {conversation.headline}
          </h2>

          {/* Desktop: one card at a time, stacked in place. Phones: all four, in order. */}
          <ol className="conv-cards relative mt-12 grid gap-10 lg:mt-16 lg:min-h-[12rem] lg:gap-0">
            {conversation.cards.map((card) => (
              <li key={card.label} className="conv-card lg:absolute lg:inset-x-0 lg:top-0">
                <h3 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-gold-light">{card.label}</h3>
                <p className="mt-4 max-w-[34ch] text-text-soft">{card.line}</p>
              </li>
            ))}
          </ol>
          {conversation.noteConfirmed && <p className="stage-label mt-12">{conversation.note}</p>}
        </div>

        <div className="conv-table relative hidden lg:col-span-7 lg:block">
          <Table orientation="landscape" lit={30} className="w-full" />
          <svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle className="conv-dot" cx="500" cy="260" r="12" fill="var(--color-gold-light)" />
          </svg>
        </div>
      </div>
    </Section>
  );
}
