import { useId } from "react";
import { MetalGradient } from "@/components/brand/MetalGradient";
import { monogramFigure, monogramHead, monogramLeftT, monogramRightT, monogramViewBox } from "@/components/brand/paths";

/**
 * The monogram as three independent pieces stacked in one box: left T, right T,
 * figure (with its head, the seat). Each piece can travel on its own; at rest
 * they compose the exact mark.
 */
export function MarkPieces({ className = "" }: { className?: string }) {
  const id = useId();
  const fill = `url(#${id})`;
  return (
    <div className={`mark-pieces relative ${className}`} aria-hidden="true">
      <svg width="0" height="0" className="absolute">
        <defs>
          <MetalGradient id={id} />
        </defs>
      </svg>
      <svg viewBox={monogramViewBox} className="mp-tl absolute inset-0 h-full w-full overflow-visible">
        <path d={monogramLeftT} fill={fill} fillRule="evenodd" />
      </svg>
      <svg viewBox={monogramViewBox} className="mp-tr absolute inset-0 h-full w-full overflow-visible">
        <path d={monogramRightT} fill={fill} fillRule="evenodd" />
      </svg>
      <div className="mp-fig-clip absolute inset-0 overflow-hidden">
        <svg viewBox={monogramViewBox} className="mp-fig absolute inset-0 h-full w-full overflow-visible">
          <path d={monogramFigure} fill={fill} fillRule="evenodd" />
          <path d={monogramHead} fill="var(--color-gold-light)" />
        </svg>
      </div>
    </div>
  );
}
