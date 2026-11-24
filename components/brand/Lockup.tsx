import { lockup, lockupViewBox } from "./paths";

/** Monogram + wordmark + rule + "A LEADERSHIP FORUM". */
export function Lockup({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={lockupViewBox}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path fillRule="evenodd" d={lockup} />
    </svg>
  );
}
