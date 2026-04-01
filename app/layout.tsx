import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKB - Premium Safety Signboards | Road, Industrial & Construction Boards",
  description:
    "AKB manufactures and installs high-quality safety signboards for highways, industrial plants, warehouses, and construction zones. Expert road safety solutions since 2011.",
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
