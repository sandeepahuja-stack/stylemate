import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "STYLEMATE | Your Style, Understood.",
  description:
    "An intelligent private stylist that discovers what belongs in your wardrobe.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "STYLEMATE | Your Style, Understood.",
    description:
      "An intelligent private stylist that discovers what belongs in your wardrobe.",
    url: "/",
    siteName: "STYLEMATE",
    type: "website",
    locale: "en_IN",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "STYLEMATE",
  description:
    "An AI-native private fashion boutique for HNI clients. Don't search. Be understood.",
  url: siteUrl,
  slogan: "Your Style, Understood.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface font-sans text-on-surface">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
