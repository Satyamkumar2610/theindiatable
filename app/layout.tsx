import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Libre_Caslon_Display, Montserrat } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { brand, nav } from "@/content/site";
import { tokens } from "@/lib/tokens";
import "./globals.css";

// Only the display face is preloaded (brief §10).
const caslon = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caslon",
});
const montserrat = Montserrat({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-montserrat",
});
const hanken = Hanken_Grotesk({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-hanken",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: brand.title, template: `%s — ${brand.name}` },
  description: brand.description,
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: brand.title,
    description: brand.description,
    siteName: brand.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: brand.title, description: brand.description },
};

export const viewport: Viewport = {
  themeColor: tokens.primary,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${caslon.variable} ${montserrat.variable} ${hanken.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="label sr-only z-[100] bg-gold px-4 py-3 text-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {nav.skip}
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
