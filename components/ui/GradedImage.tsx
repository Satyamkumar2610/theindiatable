import Image, { type ImageProps } from "next/image";

/**
 * Photography in the house grade: monochrome, then pushed into the royal green
 * with a faint warm lift in the highlights. The file itself stays untouched.
 */
export function GradedImage({ className = "", alt, ...props }: ImageProps & { className?: string }) {
  return (
    <span className={`graded relative block overflow-hidden ${className}`}>
      <Image {...props} alt={alt} className="graded-img h-full w-full object-cover" />
      <span className="graded-tint" aria-hidden="true" />
    </span>
  );
}
