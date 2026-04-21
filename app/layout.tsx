import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MATOSHREE ENGINEERING - Fabrication & Retroreflective Sign Boards Manufacturing",
  description:
    "MATOSHREE ENGINEERING manufactures and installs all types of fabrication works and retroreflective sign boards for highways, industrial plants, warehouses, and construction zones. Expert fabrication solutions since 2011.",
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
