import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AdSenseScript from "@/components/AdSenseScript";
import ConsentBanner from "@/components/ConsentBanner";

export const metadata: Metadata = {
  title: "Hey AI Hub — Discover the Best AI Tools for Developers and Creators",
  description: "Find and compare the best AI tools for coding, writing, design, SEO, and more. Your comprehensive guide to AI software for 2026.",
  keywords: ["AI tools", "AI hub", "best AI tools 2026", "AI coding tools", "AI writing tools", "hey ai hub"],
  openGraph: {
    title: "Hey AI Hub — Discover the Best AI Tools for Developers and Creators",
    description: "Find and compare the best AI tools for coding, writing, design, SEO, and more.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      <head>
        <AdSenseScript />
      </head>
      <body className={"min-h-screen bg-white antialiased font-sans"}>
        {children}
        <Toaster />
        <ConsentBanner />
      </body>
    </html>
  );
}
