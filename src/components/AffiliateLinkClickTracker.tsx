/**
 * Client-side affiliate link click tracker.
 * Fires a GA4 event when a user clicks an affiliate link.
 *
 * Usage (in a server component):
 *   <AffiliateLinkClickTracker links={affiliateLinks} toolSlug={tool.slug} />
 */
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

interface TrackedLink {
  id: string;
  label: string;
  url: string;
  network?: string;
}

export default function AffiliateLinkClickTracker({
  links,
  toolSlug,
}: {
  links: TrackedLink[];
  toolSlug: string;
}) {
  useEffect(() => {
    links.forEach((link) => {
      const anchor = document.getElementById(`affiliate-link-${link.id}`);
      if (!anchor) return;

      anchor.addEventListener("click", (e) => {
        // Small delay to ensure gtag fires before navigation
        setTimeout(() => {
          try {
            window.gtag("event", "affiliate_click", {
              affiliate_link_id: link.id,
              affiliate_label: link.label,
              affiliate_network: link.network || "unknown",
              tool_slug: toolSlug,
              page_location: window.location.href,
            });
          } catch {
            // gtag not available yet
          }
        }, 100);
      });
    });
  }, [links, toolSlug]);

  return null;
}
