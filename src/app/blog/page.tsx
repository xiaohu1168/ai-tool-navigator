"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdInContent from "@/components/AdBanner";

interface BlogPost {
  id: string; slug: string; title: string; content: string;
  category: string; date: string; views: number;
  created_at: string; updated_at: string;
}

const categoryColors: Record<string, string> = {
  "Best Of": "bg-blue-100 text-blue-800",
  Comparison: "bg-purple-100 text-purple-800",
  "How-To": "bg-green-100 text-green-800",
  News: "bg-orange-100 text-orange-800",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog").then(r => r.json()).then((data) => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => { setPosts([]); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-3 md:px-4 py-5 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Blog</h1>
        <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-8">Insights, rankings, and comparisons for the AI tool landscape.</p>
        {loading && <p className="text-gray-500 text-center py-12">Loading...</p>}
        {!loading && posts.length === 0 && <p className="text-gray-500 text-center py-12">No articles yet.</p>}
        <div className="space-y-4 md:space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <span className={"text-xs px-2 py-1 rounded-full font-medium " + (categoryColors[post.category] || "bg-gray-100 text-gray-700")}>{post.category}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
                <span className="text-xs text-gray-400"> {post.views}</span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold mb-2"><Link href={`/blog/${post.slug}`} className="hover:text-blue-600">{post.title}</Link></h2>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">{post.content.substring(0, 150)}...</p>
              <Link href={`/blog/${post.slug}`} className="text-xs md:text-sm text-blue-600 hover:underline mt-2 md:mt-3 inline-block">Read more →</Link>
            </article>
          ))}
        </div>
        <AdInContent />
      </main>
      <Footer />
    </div>
  );
}
