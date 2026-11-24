import { useId } from "react";
import { MetalGradient } from "./MetalGradient";
import { monogramFigure, monogramHead, monogramLeftT, monogramRightT, monogramViewBox } from "./paths";

type Props = {
  className?: string;
  /** Accessible name; omit for decorative use. */
  title?: string;
  /** Flat currentColor instead of the brushed sheen. */
  flat?: boolean;
};

/** T–I–T monogram. Groups are kept apart so the figure can be animated independently. */
export function Monogram({ className, title, flat }: Props) {
  const id = useId();
  const fill = flat ? "currentColor" : `url(#${id})`;
  return (
    <svg
      viewBox={monogramViewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {!flat && (
        <defs>
          <MetalGradient id={id} />
        </defs>
      )}
      <g data-part="ts" fill={fill} fillRule="evenodd">
        <path d={monogramLeftT} />
        <path d={monogramRightT} />
      </g>
      <g data-part="figure" fill={fill} fillRule="evenodd">
        <path d={monogramFigure} />
        <path data-part="head" d={monogramHead} />
      </g>
    </svg>
  );
}
