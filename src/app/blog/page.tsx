import Link from "next/link";
import { Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  date: string;
  views: number;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("http://localhost:3000/api/blog", {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const categoryBadge: Record<string, string> = {
  "Best Of": "bg-blue-100 text-blue-700",
  Comparison: "bg-purple-100 text-purple-700",
  "How-To": "bg-green-100 text-green-700",
  News: "bg-orange-100 text-orange-700",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground">Insights, rankings, and comparisons for the AI tool landscape.</p>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No articles yet. Check back soon!</p>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <Card className="border-border/60 hover:shadow-md transition-all hover:border-primary/20 h-full">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className={categoryBadge[post.category] || "bg-muted text-muted-foreground"}>
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                      <Eye className="w-3 h-3" /> {post.views}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {post.content.substring(0, 200)}...
                  </p>
                  <span className="text-sm text-primary font-medium mt-3 inline-block group-hover:underline">
                    Read more →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <AdBanner />
      </main>

      <Footer />
    </div>
  );
}
