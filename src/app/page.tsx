import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/ToolCard";
import CategoryCard from "@/components/CategoryCard";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, ExternalLink, ArrowRight, ChevronRight, Eye, Clock } from "lucide-react";
import { getFeaturedTools, getCategories, getAllTools, type Tool, type Category } from "@/lib/tools";

interface HomeBlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  date: string;
  views: number;
}

const categoryGuideIcons: Record<string, { emoji: string; gradient: string }> = {
  coding: { emoji: "💻", gradient: "from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400" },
  writing: { emoji: "✍️", gradient: "from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400" },
  design: { emoji: "🎨", gradient: "from-orange-50 to-red-50 border-orange-200 hover:border-orange-400" },
  seo: { emoji: "🔍", gradient: "from-green-50 to-teal-50 border-green-200 hover:border-green-400" },
  marketing: { emoji: "📢", gradient: "from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400" },
  devops: { emoji: "⚙️", gradient: "from-slate-50 to-gray-100 border-slate-200 hover:border-slate-400" },
  productivity: { emoji: "📋", gradient: "from-teal-50 to-emerald-50 border-teal-200 hover:border-teal-400" },
  voice: { emoji: "🎙️", gradient: "from-violet-50 to-purple-50 border-violet-200 hover:border-violet-400" },
  video: { emoji: "🎬", gradient: "from-rose-50 to-pink-50 border-rose-200 hover:border-rose-400" },
  analytics: { emoji: "📊", gradient: "from-cyan-50 to-sky-50 border-cyan-200 hover:border-cyan-400" },
  education: { emoji: "📚", gradient: "from-lime-50 to-green-50 border-lime-200 hover:border-lime-400" },
  "customer-service": { emoji: "🤖", gradient: "from-fuchsia-50 to-pink-50 border-fuchsia-200 hover:border-fuchsia-400" },
};

async function getBlogPosts(): Promise<HomeBlogPost[]> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`
      : "http://localhost:3000/api/blog",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [categories, allTools, featuredTools] = await Promise.all([
    getCategories(),
    getAllTools(),
    getFeaturedTools(6),
  ]);
  const latestTools = allTools.slice(0, 6) as Tool[];
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 md:py-20 lg:py-28">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_60%_40%,rgba(11,95,255,0.08),transparent_60%)]" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <Star className="w-3 h-3 fill-current" />
              Curated directory of the best AI tools
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-foreground">
              Find the Perfect{" "}
              <span className="text-primary">AI Tool</span> for Your Workflow
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover, compare, and choose the best AI tools for coding, writing, design, SEO, and more.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm text-sm md:text-base"
            >
              <Search className="w-4 h-4" />
              Browse All Tools
            </Link>
            <div className="flex flex-wrap justify-center gap-3 mt-6 text-xs text-muted-foreground">
              <span>Popular:</span>
              {["Cursor", "ChatGPT", "Claude", "Midjourney", "Windsurf"].map((keyword) => (
                <Link
                  key={keyword}
                  href={`/search?q=${encodeURIComponent(keyword)}`}
                  className="px-2.5 py-1 bg-background/80 border border-border/40 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <AdBanner />
        </div>

        {/* Top Picks by Category — All 12 */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Top Picks by Category</h2>
            <Link href="/search" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.slice(0, 12).map((cat: Category) => {
              const iconInfo = categoryGuideIcons[cat.id] || { emoji: "📁", gradient: "from-gray-50 to-gray-100 border-gray-200 hover:border-gray-400" };
              return (
                <Link key={cat.id} href={`/best/${cat.id}`}>
                  <Card className="border-border/60 hover:shadow-md transition-all hover:border-primary/30 overflow-hidden group">
                    <CardContent className="p-4 md:p-5 flex flex-col items-center text-center gap-1">
                      <div className="text-2xl mb-1">{iconInfo.emoji}</div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{cat.count} tools</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Tools */}
        <section className="bg-muted/30 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Featured Tools</h2>
                <p className="text-sm text-muted-foreground mt-1">Hand-picked by our editors</p>
              </div>
              <Link href="/search" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {featuredTools.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        {/* Latest Tools */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Latest Additions</h2>
              <p className="text-sm text-muted-foreground mt-1">Recently added to the directory</p>
            </div>
            <Link href="/search" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {latestTools.map((tool: Tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Blog Preview */}
        {blogPosts.length > 0 && (
          <section className="bg-muted/30 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">From Our Blog</h2>
                  <p className="text-sm text-muted-foreground mt-1">Insights and comparisons</p>
                </div>
                <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {blogPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                    <Card className="border-border/60 hover:shadow-md transition-all hover:border-primary/30 h-full">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                          <span className="text-muted-foreground">{post.date}</span>
                        </div>
                        <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {post.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground mt-2">Everything you need to know</p>
          </div>
          <Accordion className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger className="text-sm md:text-base">What is the best AI tool in 2026?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                The best AI tool depends on your needs. For coding, Cursor and GitHub Copilot are top choices. For writing, ChatGPT and Claude lead. Browse our categories to find the perfect tool for your workflow.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger className="text-sm md:text-base">Are free AI tools worth using?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Absolutely! Many AI tools offer generous free tiers. Codeium provides free code completion, ChatGPT has a free version, and many design tools offer free trials.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger className="text-sm md:text-base">How do you select tools for this directory?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                We manually test and review each tool. Our evaluation criteria include ease of use, feature quality, pricing value, reliability, and privacy practices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger className="text-sm md:text-base">Can I submit a tool for review?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes! Use our Submit a Tool form to suggest a tool. Our team will evaluate it and add it if it meets our quality criteria.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <Footer />
    </div>
  );
}
