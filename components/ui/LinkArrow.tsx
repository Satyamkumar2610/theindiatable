import Link from "next/link";
import type { ReactNode } from "react";

type Dir = "right" | "down";

function Arrow({ dir }: { dir: Dir }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-[0.85em] w-[0.85em] shrink-0 ${dir === "down" ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  );
}

/** The site's one secondary action: text with a gold underline that grows on hover. */
export function LinkArrow({
  href,
  children,
  dir = "right",
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  dir?: Dir;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link href={href} onClick={onClick} className={`text-link label ${className}`}>
      {children}
      <Arrow dir={dir} />
    </Link>
  );
}
