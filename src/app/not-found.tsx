"use client";

import Link from "next/link";
import { Search, ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="text-center max-w-lg">
        {/* 404 Hero */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary opacity-20">
            404
          </h1>
          {mounted && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: "float 2s ease-in-out infinite",
              }}
            >
              <Rocket className="w-20 h-20 md:w-24 md:h-24 text-primary" />
            </div>
          )}
        </div>

        <div
          className={mounted ? "animate-fade-in-up" : "opacity-0"}
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            The page you&apos;re looking for might have been moved or doesn&apos;t exist. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="gap-2">
                <Search className="w-4 h-4" />
                Browse Tools
              </Button>
            </Link>
          </div>
        </div>

        {/* Fun floating icons */}
        <div className="mt-12 flex justify-center gap-6 text-3xl opacity-30">
          <span style={{ animation: "float 3s ease-in-out infinite" }}>💻</span>
          <span style={{ animation: "float 3s ease-in-out infinite 0.5s" }}>🎨</span>
          <span style={{ animation: "float 3s ease-in-out infinite 1s" }}>✍️</span>
          <span style={{ animation: "float 3s ease-in-out infinite 1.5s" }}>🔍</span>
        </div>
      </div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out 0.2s both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
