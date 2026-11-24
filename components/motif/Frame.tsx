/**
 * A rectangular moulding line drawn as four hairlines, so it can draw itself
 * in (top → right → bottom → left) like a line being ruled. Colour via text-*.
 */
export function Frame({ className = "" }: { className?: string }) {
  return (
    <span className={`frame ${className}`} aria-hidden="true">
      <i className="frame-t" />
      <i className="frame-r" />
      <i className="frame-b" />
      <i className="frame-l" />
    </span>
  );
}
