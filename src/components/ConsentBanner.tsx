"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ConsentBanner() {
  const [consent, setConsent] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("consent_ads");
      setConsent(stored);
      if (!stored) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const handleAction = (value: string) => {
    setExiting(true);
    setTimeout(() => {
      try {
        localStorage.setItem("consent_ads", value);
      } catch { /* ignore */ }
      setShow(false);
      setConsent(value);
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 transition-all duration-300 ${
        exiting ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="max-w-sm md:max-w-md bg-card border border-border rounded-xl shadow-xl p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-1">Cookie & Ad Preferences</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies and ad tracking to support this site and improve your experience.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                className="h-7 px-3 text-xs bg-primary hover:bg-primary/90"
                onClick={() => handleAction("yes")}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => handleAction("no")}
              >
                Decline
              </Button>
            </div>
          </div>
          <button
            onClick={() => {
              setExiting(true);
              setTimeout(() => {
                setShow(false);
                try { localStorage.setItem("consent_ads", "no"); } catch { /* ignore */ }
              }, 300);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
