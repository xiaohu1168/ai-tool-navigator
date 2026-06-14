"use client";

import { useEffect, useState } from "react";

export default function ConsentBanner() {
  const [consent, setConsent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("consent_ads");
      setConsent(stored);
      console.log("ConsentBanner loaded, consent:", stored);
    } catch (e) {
      console.error("localStorage error:", e);
    }
    setMounted(true);
  }, []);

  if (consent === "yes") return null;

  const accept = () => {
    console.log("User clicked Accept");
    try {
      localStorage.setItem("consent_ads", "yes");
      console.log("Consent saved: yes");
    } catch (e) {
      console.error("Failed to save consent:", e);
    }
    setConsent("yes");
  };

  const reject = () => {
    console.log("User clicked Decline");
    try {
      localStorage.setItem("consent_ads", "no");
      console.log("Consent saved: no");
    } catch (e) {
      console.error("Failed to save consent:", e);
    }
    setConsent("no");
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50">
      <div className="max-w-3xl mx-auto bg-white border shadow-lg rounded-lg p-4 flex items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          We use Google Ads to support this site. By accepting, you allow personalized ads.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reject}
            className="px-3 py-1 text-sm border rounded text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
