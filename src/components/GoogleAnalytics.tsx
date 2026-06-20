/**
 * Google Analytics 4 integration component.
 * Loads gtag.js script and initializes GA4 tracking.
 * Only renders on client side to avoid SSR issues.
 *
 * Usage: Add <GoogleAnalytics gaId="G-XXXXXXXXXX" /> to layout.tsx
 */
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

function GAContent({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? "?" + searchParams.toString() : "");
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gaId]);

  return null;
}

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_transport_timeout: 10000,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GAContent gaId={gaId} />
      </Suspense>
    </>
  );
}
