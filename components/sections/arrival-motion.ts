"use client";
/**
 * The Arrival's pinned scrub and cursor light, loaded lazily with GSAP.
 * gsap.matchMedia scopes everything to desktop + motion and reverts it all
 * (pin, SplitText, listeners) when the query stops matching or on unmount.
 */
import { gsap, SplitText } from "@/lib/gsap";

export const DESKTOP_MOTION =
  "(min-width: 64rem) and (hover: hover) and (prefers-reduced-motion: no-preference)";

export function setupArrival(root: HTMLElement, onRoom: (open: boolean) => void) {
  const mm = gsap.matchMedia();

  mm.add(DESKTOP_MOTION, () => {
    const q = gsap.utils.selector(root);
    const [leafL, leafR] = q(".door-leaf") as HTMLElement[];
    const title = q(".arrival-title")[0] as HTMLElement;
    const cue = q(".arrival-cue")[0] as HTMLElement;
    const cueFill = q(".arrival-cue-fill")[0] as HTMLElement;
    const split = SplitText.create(title, { type: "words,lines", mask: "lines", aria: "auto" });

    // ---- Cursor light on the lacquer, easing after the pointer. ----
    const light = { x: -999, y: -999 };
    const apply = () => {
      const half = root.offsetWidth / 2;
      leafL.style.setProperty("--sx", `${light.x}px`);
      leafL.style.setProperty("--sy", `${light.y}px`);
      leafR.style.setProperty("--sx", `${light.x - half}px`);
      leafR.style.setProperty("--sy", `${light.y}px`);
    };
    const toX = gsap.quickTo(light, "x", { duration: 0.9, ease: "power3.out", onUpdate: apply });
    const toY = gsap.quickTo(light, "y", { duration: 0.9, ease: "power3.out", onUpdate: apply });
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      if (light.x < -900) {
        // First contact: start the light where the pointer is, no sweep in from the corner.
        light.x = e.clientX - r.left;
        light.y = e.clientY - r.top;
      }
      toX(e.clientX - r.left);
      toY(e.clientY - r.top);
    };
    const onLeave = () => {
      light.x = light.y = -999;
      apply();
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    // ---- The doors open. ----
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=240%",
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          onRoom(self.progress > 0.03);
          // The cue fills with the first half of the swing, then steps aside.
          cueFill.style.transform = `scaleY(${Math.min(1, self.progress / 0.45)})`;
          cue.style.opacity = String(gsap.utils.clamp(0, 1, 1 - (self.progress - 0.42) / 0.08));
        },
      },
    });

    // Explicit start values: the CSS load-in may still be running when this is built.
    tl.fromTo(q(".arrival-after"), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: 0.08, immediateRender: false }, 0)
      .to(q(".leaf-spec, .leaf-glint"), { autoAlpha: 0, duration: 0.06 }, 0.02)
      .to(q(".door-seam"), { autoAlpha: 0, duration: 0.05 }, 0.05)
      // The hinge swing. Slow off the latch, then the weight of the leaf carries it.
      .to(leafL, { rotationY: 82, duration: 0.54, ease: "power2.inOut" }, 0.05)
      .to(leafR, { rotationY: -82, duration: 0.54, ease: "power2.inOut" }, 0.05)
      .to(q(".leaf-shade"), { opacity: 0.72, duration: 0.5, ease: "power1.in" }, 0.07)
      // The carved words go dark with the leaves, so they never compete with the room.
      .fromTo(q(".leaf-words"), { opacity: 1 }, { opacity: 0, duration: 0.22, immediateRender: false }, 0.16)
      // Walking in: the room settles toward you as the doors clear.
      .fromTo(q(".room"), { scale: 1.16 }, { scale: 1, duration: 0.72, ease: "power2.out" }, 0.05)
      // The figure rises; the table draws out from its feet.
      .to(q(".door-figure"), { yPercent: -7, duration: 0.2, ease: "power2.out" }, 0.44)
      .to(q(".door-head"), { yPercent: -6, duration: 0.16, ease: "power2.out" }, 0.5)
      .to(q(".table-line"), { scaleX: 1, duration: 0.24, ease: "power3.out" }, 0.5)
      // The headline rises inside the room.
      .set(title, { autoAlpha: 1 }, 0.6)
      .from(split.words, { yPercent: 115, duration: 0.12, stagger: 0.022, ease: "power3.out" }, 0.6)
      .to(q(".arrival-after"), { autoAlpha: 1, y: 0, duration: 0.1 }, 0.86)
      .to({}, { duration: 0.06 });

    return () => {
      cue.style.removeProperty("opacity");
      cueFill.style.removeProperty("transform");
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      split.revert();
    };
  });

  return () => mm.revert();
}
