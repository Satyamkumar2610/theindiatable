import { wordmark, wordmarkViewBox } from "./paths";

/** "THE INDIA TABLE" in the client's lettering. Colour comes from CSS (currentColor). */
export function Wordmark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={wordmarkViewBox}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path fillRule="evenodd" d={wordmark} />
    </svg>
  );
}
