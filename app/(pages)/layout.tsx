import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/nav/Nav";

/** Inner pages: the same nav and footer as home, without the home's stage rail. */
export default function PagesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
