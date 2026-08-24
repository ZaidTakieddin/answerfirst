import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnswerFirst AI - AI Lead Desk for Dubai Real Estate",
  description:
    "Never lose another Bayut lead. An AI that answers instantly in English or Arabic, qualifies buyers, and books viewings 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
