"use client";

import { useEffect } from "react";
import { ADSENSE_PUB_ID, isAdSenseEnabled } from "@/lib/adsense";
import { useState } from "react";

/**
 * 注入 Google AdSense 脚本到 <head>
 * 仅在客户端加载一次，服务端不执行
 */
export default function AdSenseScript() {
  const [consent] = useState<string | null>(() => {
    try { return localStorage.getItem("consent_ads"); } catch { return null; }
  });

  useEffect(() => {
    if (!isAdSenseEnabled()) return;
    if (consent !== "yes") return; // respect consent

    // 添加 AdSense 外部脚本
    const existingScript = document.querySelector('script[src^="https://pagead2.googlesyndication.com"]');
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_PUB_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-cfasync", "false");
    document.head.appendChild(script);

    // 标记 adsbyGoogle 已可用
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // ignore
      }
    };
  }, [consent]);

  return null;
}
