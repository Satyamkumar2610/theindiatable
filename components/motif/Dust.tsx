"use client";

import { useEffect, useRef } from "react";
import { tokens } from "@/lib/tokens";

/**
 * Fine gold dust drifting in the light of the open doorway. Sparse, slow,
 * denser toward the centre. 2D canvas; pauses offscreen, hidden tab, or when inactive.
 */
type Mote = { x: number; y: number; r: number; vy: number; sway: number; phase: number; a: number };

export default function Dust({ className, active = true }: { className?: string; active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const control = useRef<{ play: () => void; pause: () => void } | null>(null);

  useEffect(() => {
    activeRef.current = active;
    if (active) control.current?.play();
    else control.current?.pause();
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];

    // Gaussian-ish spread around the doorway centre.
    const centred = () => (Math.random() + Math.random() + Math.random()) / 3;
    const spawn = (y?: number): Mote => ({
      x: centred() * w,
      y: y ?? Math.random() * h,
      r: (0.35 + Math.random() * 1.1) * dpr,
      vy: (0.06 + Math.random() * 0.22) * dpr,
      sway: (6 + Math.random() * 18) * dpr,
      phase: Math.random() * Math.PI * 2,
      a: 0.12 + Math.random() * 0.45,
    });

    const resize = () => {
      w = canvas.width = Math.round(canvas.clientWidth * dpr);
      h = canvas.height = Math.round(canvas.clientHeight * dpr);
      const count = Math.round(Math.min(90, (canvas.clientWidth * canvas.clientHeight) / 16000));
      motes = Array.from({ length: count }, () => spawn());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    ctx.fillStyle = tokens.goldLight;
    let raf = 0;
    let visible = false;
    let t = 0;
    const frame = () => {
      t += 1 / 60;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        if (m.y < -10) Object.assign(m, spawn(h + 10));
        const x = m.x + Math.sin(t * 0.35 + m.phase) * m.sway;
        ctx.globalAlpha = m.a * (0.65 + 0.35 * Math.sin(t * 0.8 + m.phase * 3));
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && visible && activeRef.current && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    control.current = { play, pause };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
