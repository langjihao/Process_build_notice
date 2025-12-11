import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NPI Build Notice System",
  description: "AI-Native Manufacturing MVP with AG-UI Protocol",
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
