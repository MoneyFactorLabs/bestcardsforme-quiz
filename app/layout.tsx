import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BestCardsForMe Quiz by MoneyFactor",
  description:
    "Find the credit card that actually fits your lifestyle using honest annual-value math.",
  verification: {
    google: "wGAUXA7ZlmxxBFfmgzhvF0Lyt280_MY9BcVqyDyBgLY",
    other: {
      "fo-verify": "86008206-2347-4347-8999-caf367b26c87",
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
      <body>{children}</body>
    </html>
  );
}
