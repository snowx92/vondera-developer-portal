import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vondera Developer Portal",
  description: "Developer portal for Vondera",
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
