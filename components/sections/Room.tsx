"use client";

import { useRef } from "react";
import { Table } from "@/components/motif/Table";
import { RunningHead } from "@/components/ui/RunningHead";
import { Section, container } from "@/components/ui/Section";
import { conversation, room, stages } from "@/content/site";
import { useMotion } from "@/lib/use-motion";

function RoomNumber({ className = "", size }: { className?: string; size: string }) {
  const [a, b] = room.number.display.split("–");
  return (
    <p className={`text-center ${className}`}>
      <span className="sr-only">{room.number.display}</span>
      <span className={`block font-display leading-none text-text ${size}`} aria-hidden="true">
        <span className="count-a" aria-hidden="true">{a}</span>
        <span className="count-b" aria-hidden="true">–{b}</span>
      </span>
      <span className="label mt-3 block text-gold-light">{room.numberLabel}</span>
    </p>
  );
}

/**
 * [04] The Room. The table from above: the head is the senior voices, the
 * seats fill from the head outward as the count rises to 20, then the room
 * resolves to its range, 20–30. No names: the empty seats are the point.
 */
export function Room() {
  const root = useRef<HTMLElement>(null);
  const stage = stages[3];
  useMotion(root, (el, { gsap }) => {
    const q = gsap.utils.selector(el);
    q(".room-table").forEach((wrap: Element) => {
      const seats = (wrap as HTMLElement).querySelectorAll(".seat");
      const lit = Array.from(seats).slice(0, room.number.from);
      const rest = Array.from(seats).slice(room.number.from);
      const countA = wrap.querySelector(".count-a") as HTMLElement | null;
      const counter = { v: 0 };
      if (countA) countA.textContent = "0";
      gsap
        .timeline({ scrollTrigger: { trigger: wrap, start: "top 70%" } })
        .from(wrap.querySelector(".table-top"), { autoAlpha: 0, duration: 0.8, ease: "power2.out" })
        .from(wrap.querySelector(".table-head"), { autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0.2)
        .from(lit, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.07, ease: "back.out(1.4)" }, 0.5)
        .fromTo(
          counter,
          { v: 0 },
          {
            v: room.number.from,
            duration: 0.07 * lit.length + 0.4,
            ease: "none",
            onUpdate: () => {
              if (countA) countA.textContent = String(Math.round(counter.v));
            },
          },
          0.5,
        )
        .from(wrap.querySelectorAll(".count-b"), { autoAlpha: 0, x: -12, duration: 0.6, ease: "power2.out" }, ">")
        .from(rest, { autoAlpha: 0, duration: 0.6, stagger: 0.04, ease: "power2.out" }, "<")
        .from(wrap.querySelectorAll(".room-seg"), { autoAlpha: 0, y: 8, duration: 0.7, stagger: 0.1, ease: "power2.out" }, "<0.2");
    });
  });

  return (
    <Section ref={root} stage={stage} ground="black" className="py-28 lg:py-40">
      <div className={container}>
        <RunningHead stage={stage} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="room-title" className="font-display text-h2 text-text lg:col-span-7">
            {room.headline}
          </h2>
          <p className="measure text-text-soft lg:col-span-5">{room.body}</p>
        </div>

        {/* Desktop and tablet: the table from above, number on the table top. */}
        <div className="room-table relative mx-auto mt-16 hidden w-full max-w-[64rem] md:block lg:mt-24">
          <Table orientation="landscape" lit={room.number.from} className="w-full" />
          <RoomNumber className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size="text-[clamp(3.5rem,7.5vw,7rem)]" />
          <span className="room-seg label absolute top-[50%] left-0 -translate-y-1/2 text-gold-light">
            {conversation.cards[2].label}
          </span>
          {room.segments.map((s, i) => (
            <span
              key={s}
              className={`room-seg label absolute max-w-[18ch] text-text-soft ${["top-0 left-[18%]", "top-0 right-[10%] text-right", "bottom-0 left-[18%]", "bottom-0 right-[10%] text-right"][i]}`}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Phones: the table stands upright, the number above it. */}
        <div className="room-table relative mx-auto mt-14 max-w-[22rem] md:hidden">
          <RoomNumber className="mb-8" size="text-[clamp(4rem,20vw,6rem)]" />
          <p className="room-seg label mb-2 text-center text-gold-light">{conversation.cards[2].label}</p>
          <Table orientation="portrait" lit={room.number.from} seatR={9} className="mx-auto w-[80%]" />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {room.segments.map((s) => (
              <li key={s} className="room-seg label text-text-soft">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
