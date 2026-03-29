import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafePath Sign Systems",
  description:
    "Bright professional business website for a road safety and industrial signage company serving highways, factories, and construction zones.",
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
