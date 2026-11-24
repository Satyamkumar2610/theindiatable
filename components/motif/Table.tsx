/**
 * The room seen from above: a table outline with seats around it. Each seat
 * is the monogram's head dot. The head of the table (left end, or top end in
 * portrait) is an unbroken gold segment with no seats: the senior voices.
 * Purely structural; it shows no names and no count beyond the brief's 20–30.
 */
type Orientation = "landscape" | "portrait";

type Seat = { x: number; y: number };

const GEO = {
  landscape: { vb: "0 0 1000 520", x: 170, y: 160, w: 660, h: 200 },
  portrait: { vb: "0 0 360 760", x: 110, y: 130, w: 140, h: 500 },
} as const;

/** 30 seats, ordered so the room fills from the head outward on both sides. */
export function seatLayout(o: Orientation): Seat[] {
  const g = GEO[o];
  const off = 40;
  const seats: Seat[] = [];
  if (o === "landscape") {
    const r = g.h / 2;
    const x0 = g.x + r - 20;
    const x1 = g.x + g.w - r + 20;
    for (let i = 0; i < 14; i++) {
      const x = x0 + ((x1 - x0) * i) / 13;
      seats.push({ x, y: g.y - off }, { x, y: g.y + g.h + off });
    }
    const cx = g.x + g.w - r;
    seats.push(
      { x: cx + (r + off) * Math.cos(-0.45), y: g.y + r + (r + off) * Math.sin(-0.45) },
      { x: cx + (r + off) * Math.cos(0.45), y: g.y + r + (r + off) * Math.sin(0.45) },
    );
  } else {
    const r = g.w / 2;
    const y0 = g.y + r - 10;
    const y1 = g.y + g.h - r + 10;
    for (let i = 0; i < 14; i++) {
      const y = y0 + ((y1 - y0) * i) / 13;
      seats.push({ x: g.x - off, y }, { x: g.x + g.w + off, y });
    }
    const cy = g.y + g.h - r;
    seats.push(
      { x: g.x + r + (r + off) * Math.cos(Math.PI / 2 + 0.5), y: cy + (r + off) * Math.sin(Math.PI / 2 + 0.5) },
      { x: g.x + r + (r + off) * Math.cos(Math.PI / 2 - 0.5), y: cy + (r + off) * Math.sin(Math.PI / 2 - 0.5) },
    );
  }
  return seats;
}

export function Table({
  orientation = "landscape",
  lit = 30,
  className = "",
  seatR = 7,
}: {
  orientation?: Orientation;
  /** Seats drawn lit (gold-light); the rest are faint. */
  lit?: number;
  className?: string;
  seatR?: number;
}) {
  const g = GEO[orientation];
  const seats = seatLayout(orientation);
  const r = Math.min(g.w, g.h) / 2;
  // The head of the table: the arc at the left end (landscape) or top end (portrait).
  const head =
    orientation === "landscape"
      ? `M ${g.x + r} ${g.y} A ${r} ${r} 0 0 0 ${g.x + r} ${g.y + g.h}`
      : `M ${g.x} ${g.y + r} A ${r} ${r} 0 0 1 ${g.x + g.w} ${g.y + r}`;
  return (
    <svg viewBox={g.vb} className={`table-svg ${className}`} aria-hidden="true">
      <rect
        className="table-top"
        x={g.x}
        y={g.y}
        width={g.w}
        height={g.h}
        rx={r}
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth="1.5"
        pathLength={1}
      />
      <path className="table-head" d={head} fill="none" stroke="var(--color-gold)" strokeWidth="3" />
      <g className="seats">
        {seats.map((s, i) => (
          <circle
            key={i}
            className={`seat ${i < lit ? "is-lit" : ""}`}
            data-i={i}
            cx={s.x}
            cy={s.y}
            r={seatR}
          />
        ))}
      </g>
    </svg>
  );
}
