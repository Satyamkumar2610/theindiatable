import { Monogram } from "@/components/brand/Monogram";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/nav/Nav";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { notFound } from "@/content/site";

/** A room that doesn't exist: the mark, one line, and the way back. */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="relative flex min-h-svh flex-col items-center justify-center bg-primary px-6 text-center">
        <Monogram flat className="page-hero-title h-20 w-auto text-gold md:h-24" />
        <h1 className="page-hero-title mt-12 max-w-[16ch] font-display text-h2 text-text">{notFound.line}</h1>
        <span className="page-hero-rule mt-12 block h-px w-24 bg-gold/60" aria-hidden="true" />
        <LinkArrow href={notFound.link.href} className="mt-12">
          {notFound.link.label}
        </LinkArrow>
      </main>
      <Footer />
    </>
  );
}
