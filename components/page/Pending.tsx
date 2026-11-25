import type { ReactNode } from "react";

/** Development builds show where client copy is missing; production renders nothing. */
export const showPending = process.env.NODE_ENV !== "production";

export function Pending({ children }: { children: ReactNode }) {
  if (!showPending) return null;
  return (
    <p className="pending" role="note">
      <span className="label">Client copy needed</span>
      <span>{children}</span>
    </p>
  );
}
