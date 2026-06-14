import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import AdSenseScript from "@/components/AdSenseScript";
import ConsentBanner from "@/components/ConsentBanner";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Hey AI Hub — Discover the Best AI Tools for Developers and Creators",
    template: "%s | Hey AI Hub",
  },
  description:
    "Find and compare the best AI tools for coding, writing, design, SEO, and more. Your comprehensive guide to AI software for 2026.",
  keywords: [
    "AI tools",
    "AI hub",
    "best AI tools 2026",
    "AI coding tools",
    "AI writing tools",
    "hey ai hub",
  ],
  openGraph: {
    title: "Hey AI Hub — Discover the Best AI Tools for Developers and Creators",
    description:
      "Find and compare the best AI tools for coding, writing, design, SEO, and more.",
    type: "website",
    locale: "en_US",
    siteName: "Hey AI Hub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <AdSenseScript />
      </head>
      <body className="min-h-screen bg-background antialiased font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Skip to content — accessible keyboard navigation */}
          <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
          >
            Skip to content
          </Link>

          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
