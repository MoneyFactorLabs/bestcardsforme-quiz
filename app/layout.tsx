import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import { buildSiteStructuredData } from "@/lib/structuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "BestCardsForMe Quiz by MoneyFactor",
  description: siteConfig.description,
  verification: {
    google: "wGAUXA7ZlmxxBFfmgzhvF0Lyt280_MY9BcVqyDyBgLY",
    other: {
      "fo-verify": "86008206-2347-4347-8999-caf367b26c87",
      "google-site-verification": "iBdgn43Q3dR5_VzVct8bAqsJrEeD_KeKYfQIFRqBcTI",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={buildSiteStructuredData()} />
        {children}
      </body>
    </html>
  );
}
