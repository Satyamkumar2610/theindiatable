import Link from "next/link";
import { Seal } from "@/components/brand/Seal";
import { container } from "@/components/ui/Section";
import { brand, footer, isTodo } from "@/content/site";

async function Year() {
  "use cache";
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-secondary">
      <div className={`${container} grid gap-14 py-20 md:grid-cols-[auto_1fr] md:items-center md:gap-20 lg:py-28`}>
        <Seal className="w-32 md:w-44" />
        <p className="max-w-[26ch] font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.15] text-text">
          {brand.footerLine}
        </p>
      </div>
      <div className={container}>
        <div className="flex flex-col gap-6 border-t border-hairline py-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-10 gap-y-2">
            {footer.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-link label">
                  {l.label}
                </Link>
              </li>
            ))}
            {!isTodo(brand.contactEmail) && (
              <li>
                <a href={`mailto:${brand.contactEmail}`} className="text-link label">
                  {brand.contactEmail}
                </a>
              </li>
            )}
          </ul>
          <p className="label text-text-soft">
            © <Year /> {brand.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
