import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deriv Analyzer",
  description: "Deriv market analysis and prediction tool",
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
