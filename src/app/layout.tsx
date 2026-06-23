import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import AdSenseScript from "@/components/AdSenseScript";
import ConsentBanner from "@/components/ConsentBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Link from "next/link";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

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
  twitter: {
    card: "summary_large_image",
    site: "@heyaihub",
    creator: "@heyaihub",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://heyaihub.com",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Hey AI Hub RSS Feed" },
      ],
    },
  },
  openGraph: {
    title: "Hey AI Hub — Discover the Best AI Tools for Developers and Creators",
    description:
      "Find and compare the best AI tools for coding, writing, design, SEO, and more.",
    type: "website",
    locale: "en_US",
    siteName: "Hey AI Hub",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://heyaihub.com",
    images: [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`
          : "/api/og",
        width: 1200,
        height: 630,
        alt: "Hey AI Hub — Discover the Best AI Tools",
      },
    ],
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
        <meta name="google-adsense-account" content="ca-pub-8677289489236814" />
        <meta name="google-site-verification" content="7WcVhuBNo1oiwSX9jEsUn2sPCsyHNN6t3uCzElkt8Dg" />
        <meta name="impact-site-verification" content="c870a1b4-1728-43ac-8b3c-fac36d8c9a0a" />
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_SITE_URL || "https://heyaihub.com"}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Hey AI Hub",
              url: "https://heyaihub.com",
              description: "Discover the best AI tools for developers and creators.",
              sameAs: ["https://twitter.com/heyaihub"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Hey AI Hub",
              url: "https://heyaihub.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://heyaihub.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
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
          {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        </ThemeProvider>
      </body>
    </html>
  );
}
