import Image from "next/image";
import type { Founder } from "@/content/site";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

/** The portrait slot: the supplied photograph, or the founder's initials until one arrives. */
export function Portrait({ f, big = false, sizes }: { f: Founder; big?: boolean; sizes?: string }) {
  if (f.portrait) {
    return (
      <Image
        src={f.portrait}
        alt={`Portrait of ${f.name}`}
        fill
        sizes={sizes ?? (big ? "40vw" : "(min-width: 768px) 30vw, 90vw")}
        className="object-cover grayscale"
      />
    );
  }
  return (
    <span className="portrait-slot absolute inset-0 flex items-end justify-between p-6 md:p-8" aria-hidden="true">
      <span className={`font-display leading-none text-gold-light ${big ? "text-[clamp(5rem,10vw,9rem)]" : "text-[clamp(4rem,7vw,6.5rem)]"}`}>
        {initials(f.name)}
      </span>
      <span className="mb-2 h-2.5 w-2.5 rounded-full bg-gold-light" />
    </span>
  );
}
