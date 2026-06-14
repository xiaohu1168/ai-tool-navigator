"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_PUB_ID, isAdSenseEnabled } from "@/lib/adsense";

function getConsent() {
  try { return localStorage.getItem("consent_ads"); } catch { return null; }
}

interface AdSlotProps {
  className?: string;
  adFormat?: string;
  adLayoutKey?: string;
  showLabel?: boolean;
}

function AdSlot({
  className = "",
  adFormat = "responsive",
  adLayoutKey,
  showLabel = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useRef(false);

  const [consent] = useState<string | null>(() => {
    try { return localStorage.getItem("consent_ads"); } catch { return null; }
  });
  useEffect(() => {
    if (!isAdSenseEnabled() || !adRef.current) return;
    if (consent !== "yes") return;
    try {
      if (typeof window.adsbygoogle === "undefined") return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.adsbygoogle as any).push({});
    } catch {
      // ignore ads loading errors
    }
  }, [consent]);

  const dataAttrs: Record<string, string> = {
    "data-ad-client": ADSENSE_PUB_ID,
    "data-ad-slot": "placeholder",
    "data-full-width-responsive": "true",
  };

  if (adFormat) dataAttrs["data-ad-format"] = adFormat;
  if (adLayoutKey) dataAttrs["data-ad-layout-key"] = adLayoutKey;

  const isEnabled = isAdSenseEnabled();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {!isEnabled && (
        <div className="w-full max-w-2xl bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center my-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Advertisement</div>
          <div className="text-xs text-gray-300">Google AdSense — Replace pub-ID in .env.local</div>
        </div>
      )}
      <ins
        ref={adRef as unknown as React.RefObject<HTMLModElement>}
        className="adsbygoogle"
        style={{ display: isEnabled ? "block" : "none" }}
        {...dataAttrs}
      />
    </div>
  );
}

export default function AdBanner(props: AdSlotProps) {
  return (
    <div className="my-6">
      <AdSlot
        className="max-w-4xl mx-auto"
        adFormat="rectangle"
        adLayoutKey="-+feed"
        {...props}
      />
    </div>
  );
}

export function AdSidebar(props: Omit<AdSlotProps, "showLabel">) {
  return (
    <div className="sticky top-24">
      <AdSlot
        className="max-w-xs mx-auto lg:mx-0"
        adFormat="vertical"
        showLabel={false}
        {...props}
      />
    </div>
  );
}

export function AdInContent(props: AdSlotProps) {
  return (
    <div className="my-8 py-6 border-y border-gray-100">
      <AdSlot
        className="max-w-3xl mx-auto"
        adFormat="responsive"
        adLayoutKey="-+feed+2"
        {...props}
      />
    </div>
  );
}