import Link from "next/link";
import type { ReactNode } from "react";

/** The only filled button on the site: gold, "Request an invitation". */
export function InviteButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`btn-invite ${className}`}>
      {children}
    </Link>
  );
}
