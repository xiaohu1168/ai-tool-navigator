import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/ToolCard";
import CategoryCard from "@/components/CategoryCard";
import AdBanner from "@/components/AdBanner";
import { getFeaturedTools, getCategories, getAllTools, type Tool, type Category } from "@/lib/tools";

export default async function Home() {
  const [categories, allTools, featuredTools] = await Promise.all([getCategories(), getAllTools(), getFeaturedTools(6)]);
  const latestTools = allTools.slice(0, 8) as Tool[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Find the Best AI Tools for 2026
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto px-2">
              Discover, compare, and choose the perfect AI tools for coding, writing, design, SEO, and more.
            </p>
            <Link href="/search" className="inline-block bg-blue-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm btn-primary text-sm md:text-base btn-solid">
              Browse All Tools
            </Link>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
          <AdBanner />
        </div>


        <section className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
          <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Top Picks by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Link href="/best/coding" className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow hover:border-blue-400">
              <div className="text-2xl mb-1">💻</div>
              <h3 className="font-semibold text-sm">Best Coding Tools</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ranked &amp; reviewed</p>
            </Link>
            <Link href="/best/writing" className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow hover:border-purple-400">
              <div className="text-2xl mb-1">✍️</div>
              <h3 className="font-semibold text-sm">Best Writing Tools</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ranked &amp; reviewed</p>
            </Link>
            <Link href="/best/design" className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow hover:border-orange-400">
              <div className="text-2xl mb-1">🎨</div>
              <h3 className="font-semibold text-sm">Best Design Tools</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ranked &amp; reviewed</p>
            </Link>
            <Link href="/best/seo" className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow hover:border-green-400">
              <div className="text-2xl mb-1">🔍</div>
              <h3 className="font-semibold text-sm">Best SEO Tools</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ranked &amp; reviewed</p>
            </Link>
          </div>
        </section>        <section className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12">
          <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.map((cat: Category) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-3 md:px-4">
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Featured Tools</h2>
              <Link href="/search" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {featuredTools.map((tool: Tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-3 md:px-4 py-8 md:py-12">
          <div className="flex items-center justify-between mb-5 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Recently Added</h2>
            <Link href="/search" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {latestTools.map((tool: Tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-3 md:px-4 py-8 md:py-12 border-t border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold mb-4">What Are AI Tools?</h2>
          <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
            <p>AI tools are software applications powered by artificial intelligence that help users accomplish tasks faster and smarter. In 2026, AI tools have evolved from experimental gadgets into essential instruments for developers, marketers, designers, and creators worldwide.</p>
            <p>Whether you are an indie developer looking for an AI coding assistant, a content creator seeking AI writing tools, or a designer needing AI image generators there is an AI tool for every workflow.</p>
            <p>Our curated directory covers the best AI tools across {categories.length} categories, with honest reviews, pricing comparisons, and real-world usage insights. We update our listings regularly.</p>
          </div>
        </section>

        <section className="bg-gray-50 py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-3 md:px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-5 md:mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3 md:space-y-4">
              <details className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <summary className="font-medium cursor-pointer text-sm md:text-base">What is the best AI tool in 2026?</summary>
                <p className="text-xs md:text-sm text-gray-600 mt-2">The best AI tool depends on your needs. For coding, Cursor and GitHub Copilot are top choices. For writing, ChatGPT and Claude lead. Browse our categories to find the perfect tool for your workflow.</p>
              </details>
              <details className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <summary className="font-medium cursor-pointer text-sm md:text-base">Are free AI tools worth using?</summary>
                <p className="text-xs md:text-sm text-gray-600 mt-2">Absolutely! Many AI tools offer generous free tiers. Codeium provides free code completion, ChatGPT has a free version, and many design tools offer free trials.</p>
              </details>
              <details className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <summary className="font-medium cursor-pointer text-sm md:text-base">How do you select tools for this directory?</summary>
                <p className="text-xs md:text-sm text-gray-600 mt-2">We manually test and review each tool. Our evaluation criteria include ease of use, feature quality, pricing value, reliability, and privacy practices.</p>
              </details>
            </div>
            <div className="text-center mt-5 md:mt-6">
              <Link href="/faq" className="text-blue-600 text-sm hover:underline">View all FAQs</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


