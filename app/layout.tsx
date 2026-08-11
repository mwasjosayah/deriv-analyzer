import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deriv Analyzer by Mwas Josayah",
  description: "Smart Deriv market analysis and prediction tool",
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
