import Link from "next/link";
import { Eye, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdBanner from "@/components/AdBanner";
import { ArticleJsonLd } from "@/lib/jsonld";

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  category: string;
  date: string;
  views: number;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?slug=${encodeURIComponent(slug)}`
        : `http://localhost:3000/api/blog?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { title: "Post Not Found" };
    const post: BlogPost = await res.json();
    return {
      title: `${post.title} | Hey AI Hub`,
      description: post.content.substring(0, 160),
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?slug=${encodeURIComponent(slug)}`
        : `http://localhost:3000/api/blog?slug=${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) post = await res.json();
  } catch { /* ignore */ }

  // Track view (fire-and-forget)
  if (post) {
    fetch(
      process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${encodeURIComponent(slug)}/views`
        : `http://localhost:3000/api/blog/${encodeURIComponent(slug)}/views`,
      { method: "POST", signal: AbortSignal.timeout(3000) }
    ).catch(() => {});
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <ArticleJsonLd
          title={post.title}
          description={post.content.substring(0, 160)}
          url={`https://heyaihub.com/blog/${post.slug}`}
          date={post.date}
          category={post.category}
        />
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {post.views}
            </span>
          </div>
        </div>

        <article className="prose prose-sm md:prose-base prose-slate max-w-none leading-relaxed text-muted-foreground whitespace-pre-line">
          {post.content}
        </article>

        <AdBanner />

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/blog" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all posts
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
