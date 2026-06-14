import { Suspense } from "react";
import { searchTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdInContent from "@/components/AdBanner";

async function SearchResults({ query }: { query: string }) {
  const results = await searchTools(query);

    if (!query) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Search AI Tools</h2>
        <p className="text-gray-500 text-sm">Use the search bar in the navigation to find AI tools by name, description, or tag.</p>
      </div>
    );
  }

    if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tools found for &quot;{query}&quot;</p>
        <p className="text-gray-400 text-sm mt-2">Try different keywords or browse our categories.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">{results.length} tool{results.length !== 1 ? "s" : ""} found for &quot;{query}&quot;</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((tool: any) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      <AdInContent />
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <SearchResults query={q || ""} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
