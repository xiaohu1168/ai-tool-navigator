"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdInContent from "@/components/AdBanner";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  date: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const slug = typeof window !== "undefined" ? window.location.pathname.split("/blog/")[1] : "";

  useEffect(() => {
    if (!slug) return;
    fetch("/api/blog?slug=" + encodeURIComponent(slug))
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data: BlogPost) => {
        setPost(data);
        setLoading(false);
        // Track view
        fetch("/api/blog/" + encodeURIComponent(slug) + "/views", { method: "POST" }).catch(() => {});
      })
      .catch(() => {
        setError("Post not found");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-3 md:px-4 py-5 md:py-12">
        <p className="text-gray-500">Loading...</p>
      </main>
      <Footer />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-3 md:px-4 py-5 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Post not found</h1>
        <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-3 md:px-4 py-5 md:py-12">
        <div className="mb-5 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-1">{post.title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{post.category}</span>
            <span className="text-xs md:text-sm text-gray-500">{post.date}</span>
            <span className="text-xs text-gray-400">{post.views} 👁</span>
          </div>
        </div>
        <article className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">{post.content}</article>
        <AdInContent />
        <div className="mt-5 md:mt-8 pt-5 md:pt-8 border-t border-gray-200">
          <Link href="/blog" className="text-blue-600 hover:underline text-sm md:text-base">← Back to all posts</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
