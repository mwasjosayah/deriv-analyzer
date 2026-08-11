import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Deriv Analyzer",
  description: "Deriv market analysis and prediction tool",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
