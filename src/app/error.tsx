"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="text-center max-w-lg">
        <div
          className={mounted ? "w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center" : "opacity-0"}
          style={{
            animation: mounted ? "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both" : "none",
          }}
        >
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <div
          className={mounted ? "" : "opacity-0"}
          style={{
            animation: mounted ? "fadeInUp 0.3s ease-out 0.1s both" : "none",
          }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground mb-2">
            An unexpected error occurred. We&apos;re sorry for the inconvenience.
          </p>
          {process.env.NODE_ENV === "development" && error.digest && (
            <p className="text-xs font-mono text-muted-foreground/60 mb-6">
              Digest: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => reset()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes popIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
